'use client';

import { useState } from 'react';

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState('');

  const bucketName = process.env.NEXT_PUBLIC_S3_BUCKET_NAME || 'default-bucket';

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: JSON.stringify({
        bucket: bucketName,
        key: file.name,
        file: await file.arrayBuffer(),
      }),
    });

    const result = await response.json();
    setMessage(result.message);
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white rounded-xl shadow-lg p-8 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-blue-700 mb-6">Upload File</h1>
      <input
        type="file"
        className="mb-4 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />
      <button
        onClick={handleUpload}
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg px-6 py-2 mb-4 transition disabled:opacity-50"
        disabled={!file}
      >
        Upload
      </button>
      {message && <p className="text-green-600 font-medium mt-2">{message}</p>}
    </div>
  );
}
