pipeline {
    agent any
    
    environment {
        DOCKER_REGISTRY = 'your-registry.com'
        IMAGE_NAME = 'aws-s3-manager'
        KUBECONFIG = credentials('kubeconfig')
        DOCKER_CREDENTIALS = credentials('docker-registry-credentials')
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Install Dependencies') {
            steps {
                script {
                    sh 'npm ci'
                }
            }
        }
        
        stage('Lint & Type Check') {
            parallel {
                stage('Lint') {
                    steps {
                        sh 'npm run lint'
                    }
                }
                stage('Type Check') {
                    steps {
                        sh 'npm run check-types'
                    }
                }
            }
        }
        
        stage('Test') {
            steps {
                sh 'npm run test:ci'
            }
            post {
                always {
                    publishTestResults testResultsPattern: 'coverage/junit.xml'
                    publishCoverageResults coverageResultsPattern: 'coverage/lcov.info'
                }
            }
        }
        
        stage('Build Application') {
            steps {
                sh 'npm run build:prod'
            }
        }
        
        stage('Build Docker Image') {
            steps {
                script {
                    def imageTag = "${env.BUILD_NUMBER}-${env.GIT_COMMIT.take(7)}"
                    def fullImageName = "${DOCKER_REGISTRY}/${IMAGE_NAME}:${imageTag}"
                    
                    sh """
                        docker build -t ${fullImageName} .
                        docker tag ${fullImageName} ${DOCKER_REGISTRY}/${IMAGE_NAME}:latest
                    """
                    
                    env.IMAGE_TAG = imageTag
                    env.FULL_IMAGE_NAME = fullImageName
                }
            }
        }
        
        stage('Security Scan') {
            steps {
                script {
                    sh """
                        # Run security scan on Docker image
                        docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \\
                            -v \$(pwd):/workspace \\
                            aquasec/trivy image --exit-code 1 --severity HIGH,CRITICAL ${env.FULL_IMAGE_NAME}
                    """
                }
            }
        }
        
        stage('Push Docker Image') {
            when {
                anyOf {
                    branch 'main'
                    branch 'develop'
                }
            }
            steps {
                script {
                    sh """
                        echo \${DOCKER_CREDENTIALS_PSW} | docker login ${DOCKER_REGISTRY} -u \${DOCKER_CREDENTIALS_USR} --password-stdin
                        docker push ${env.FULL_IMAGE_NAME}
                        docker push ${DOCKER_REGISTRY}/${IMAGE_NAME}:latest
                    """
                }
            }
        }
        
        stage('Deploy to Staging') {
            when {
                branch 'develop'
            }
            steps {
                script {
                    sh """
                        # Update image tag in staging deployment
                        sed -i 's|image: aws-s3-manager:.*|image: ${env.FULL_IMAGE_NAME}|g' k8s/app-deployment.yaml
                        
                        # Apply staging namespace and configurations
                        kubectl apply -f k8s/namespace.yaml
                        kubectl apply -f k8s/configmap.yaml
                        kubectl apply -f k8s/secret.yaml
                        
                        # Deploy PostgreSQL first
                        kubectl apply -f k8s/postgres-deployment.yaml
                        kubectl rollout status deployment/postgres -n aws-s3-manager --timeout=300s
                        
                        # Deploy application
                        kubectl apply -f k8s/app-deployment.yaml
                        kubectl rollout status deployment/aws-s3-manager-app -n aws-s3-manager --timeout=300s
                        
                        # Apply ingress
                        kubectl apply -f k8s/ingress.yaml
                    """
                }
            }
        }
        
        stage('Deploy to Production') {
            when {
                branch 'main'
            }
            steps {
                script {
                    input message: 'Deploy to Production?', ok: 'Deploy'
                    
                    sh """
                        # Update image tag in production deployment
                        sed -i 's|image: aws-s3-manager:.*|image: ${env.FULL_IMAGE_NAME}|g' k8s/app-deployment.yaml
                        
                        # Apply production namespace and configurations
                        kubectl apply -f k8s/namespace.yaml
                        kubectl apply -f k8s/configmap.yaml
                        kubectl apply -f k8s/secret.yaml
                        
                        # Deploy PostgreSQL first
                        kubectl apply -f k8s/postgres-deployment.yaml
                        kubectl rollout status deployment/postgres -n aws-s3-manager --timeout=300s
                        
                        # Deploy application with rolling update
                        kubectl apply -f k8s/app-deployment.yaml
                        kubectl rollout status deployment/aws-s3-manager-app -n aws-s3-manager --timeout=300s
                        
                        # Apply ingress
                        kubectl apply -f k8s/ingress.yaml
                        
                        # Verify deployment
                        kubectl get pods -n aws-s3-manager
                        kubectl get services -n aws-s3-manager
                    """
                }
            }
        }
        
        stage('Run Integration Tests') {
            when {
                anyOf {
                    branch 'main'
                    branch 'develop'
                }
            }
            steps {
                script {
                    sh """
                        # Wait for deployment to be ready
                        sleep 30
                        
                        # Run Playwright integration tests against deployed environment
                        npm run test:e2e
                    """
                }
            }
            post {
                always {
                    archiveArtifacts artifacts: 'test-results/**/*', allowEmptyArchive: true
                }
            }
        }
    }
    
    post {
        always {
            cleanWs()
        }
        success {
            slackSend(
                channel: '#deployments',
                color: 'good',
                message: "✅ Pipeline succeeded for ${env.JOB_NAME} - ${env.BUILD_NUMBER}"
            )
        }
        failure {
            slackSend(
                channel: '#deployments',
                color: 'danger',
                message: "❌ Pipeline failed for ${env.JOB_NAME} - ${env.BUILD_NUMBER}"
            )
        }
    }
}