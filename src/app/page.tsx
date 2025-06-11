'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 mt-8">
        <h1 className="text-4xl font-bold text-blue-700 mb-2 text-center">
          Welcome to AWS S3 Manager
        </h1>
        <p className="text-lg text-gray-600 mb-8 text-center">
          Easily manage your files, users, and uploads with a modern, intuitive dashboard.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <a
            href="/dashboard"
            className="group rounded-xl border border-blue-100 bg-blue-50 hover:bg-blue-100 p-6 flex flex-col items-center transition"
          >
            <span className="text-blue-600 text-3xl mb-2">📊</span>
            <span className="font-semibold text-blue-700">Dashboard</span>
            <span className="text-gray-500 text-sm mt-1 text-center">
              View file stats, recent uploads, and notifications.
            </span>
          </a>
          <a
            href="/upload"
            className="group rounded-xl border border-green-100 bg-green-50 hover:bg-green-100 p-6 flex flex-col items-center transition"
          >
            <span className="text-green-600 text-3xl mb-2">⬆️</span>
            <span className="font-semibold text-green-700">Upload</span>
            <span className="text-gray-500 text-sm mt-1 text-center">
              Upload files directly to your S3 bucket.
            </span>
          </a>
          <a
            href="/user-management"
            className="group rounded-xl border border-purple-100 bg-purple-50 hover:bg-purple-100 p-6 flex flex-col items-center transition"
          >
            <span className="text-purple-600 text-3xl mb-2">👤</span>
            <span className="font-semibold text-purple-700">User Management</span>
            <span className="text-gray-500 text-sm mt-1 text-center">
              Manage users, add admins, and more.
            </span>
          </a>
        </div>
        <div className="text-center text-gray-400 text-xs mt-6">
          &copy; {new Date().getFullYear()} AWS S3 Manager. All rights reserved.
        </div>
      </div>
    </div>
  );
}
