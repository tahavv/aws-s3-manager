"use client";

import { useState } from "react";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: JSON.stringify({
        bucket: "your-bucket-name",
        key: file.name,
        file: await file.arrayBuffer(),
      }),
    });

    const result = await response.json();
    setMessage(result.message);
  };

  return (
    <div>
      <h1>Upload File</h1>
      <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
      <button onClick={handleUpload}>Upload</button>
      {message && <p>{message}</p>}
    </div>
  );
}