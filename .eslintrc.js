module.exports = {
  extends: [
    'next/core-web-vitals',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  plugins: ['@typescript-eslint', 'prettier'],
  rules: {
    'prettier/prettier': 'error',

    // Disable specific TypeScript ESLint rules
    '@typescript-eslint/no-require-imports': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unsafe-function-type': 'off',

    // Optionally, disable React hooks warning for `useEffect`
    'react-hooks/exhaustive-deps': 'off', // Only if you want to disable hook dependency warnings
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
};
