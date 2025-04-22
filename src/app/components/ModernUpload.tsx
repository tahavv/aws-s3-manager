import { useState, useRef } from "react";
import { Upload, X, CheckCircle, AlertCircle } from "lucide-react";

interface ModernUploadProps {
  onUploadSuccess: () => void;
}

export default function ModernUpload({ onUploadSuccess }: ModernUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e:any) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
      setStatus({ type: "", message: "" });
    }
  };

  const handleDragOver = (e:any) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e:any) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files?.[0]) {
      setFile(e.dataTransfer.files[0]);
      setStatus({ type: "", message: "" });
    }
  };

  const clearFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    try {
      setIsUploading(true);
      setStatus({ type: "", message: "" });
      
      // Mock the FileReader to convert the file to arrayBuffer
      const arrayBuffer = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
      });
      
      const response = await fetch("/api/upload", {
        method: "POST",
        body: JSON.stringify({
          bucket: "your-bucket-name",
          key: file.name,
          file: arrayBuffer,
        }),
      });

      const result = await response.json();
      
      if (response.ok) {
        setStatus({ type: "success", message: "File uploaded successfully!" });
        setFile(null);
        onUploadSuccess();
      } else {
        setStatus({ type: "error", message: result.message || "Upload failed" });
      }
    } catch (error) {
      setStatus({ type: "error", message: "Upload failed. Please try again." });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="mb-8 bg-white rounded-lg shadow-md p-6 transition-all duration-300">
      <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
        <Upload className="mr-2 text-blue-500" size={20} />
        Upload File
      </h2>
      
      <div
        className={`border-2 border-dashed rounded-lg p-8 mb-4 transition-colors duration-300 ${
          isDragging ? "border-blue-500 bg-blue-50" : 
          file ? "border-green-400 bg-green-50" : "border-gray-300 hover:border-blue-400"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="flex flex-col items-center justify-center text-center">
          {!file ? (
            <>
              <div className="mb-4 p-4 bg-blue-100 rounded-full">
                <Upload className="text-blue-500" size={24} />
              </div>
              <p className="text-gray-600 mb-2">
                {isDragging ? "Drop your file here" : "Drag & drop your file here"}
              </p>
              <p className="text-gray-400 text-sm">or click to browse</p>
            </>
          ) : (
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-lg mr-3">
                  <CheckCircle className="text-green-500" size={20} />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-800 truncate max-w-xs">{file.name}</p>
                  <p className="text-sm text-gray-500">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  clearFile();
                }}
                className="p-1 rounded-full hover:bg-gray-200 transition-colors"
              >
                <X size={18} className="text-gray-500" />
              </button>
            </div>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          onClick={handleUpload}
          disabled={!file || isUploading}
          className={`w-full sm:w-auto px-6 py-3 rounded-lg font-medium flex items-center justify-center transition-all duration-300 ${
            !file
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600 text-white shadow-md hover:shadow-lg"
          }`}
        >
          {isUploading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Uploading...
            </>
          ) : (
            "Upload File"
          )}
        </button>
        
        {status.message && (
          <div className={`flex items-center ${
            status.type === "error" ? "text-red-500" : "text-green-500"
          }`}>
            {status.type === "error" ? (
              <AlertCircle size={16} className="mr-1" />
            ) : (
              <CheckCircle size={16} className="mr-1" />
            )}
            <span>{status.message}</span>
          </div>
        )}
      </div>
    </div>
  );
}