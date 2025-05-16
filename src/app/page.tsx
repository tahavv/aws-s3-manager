'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function HomePage() {
  const router = useRouter();

  // useEffect(() => {
  //   // Redirect to dashboard when the component is mounted
  //   router.push('/dashboard');
  // }, [router]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">AWS S3 Uploader</h1>
      <p className="mt-2">Manage your AWS S3 files and view notifications.</p>
      <div className="mt-4 space-x-4">
        <Link href="/dashboard" className="text-blue-600 underline">
          Go to Dashboard
        </Link>
        {/* <Link href="/upload" className="text-blue-600 underline">
          Upload Files
        </Link> */}
        <Link href="/user-management" className="text-blue-600 underline">
          User Management
        </Link>
        {/* <Link href="/auth/login" className="text-blue-600 underline">
          Login
        </Link> */}
      </div>
    </div>
  );
}
