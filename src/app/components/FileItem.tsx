import { useState } from "react";
import { Trash2, File, Download, MoreHorizontal } from "lucide-react";

interface FileItemProps {
  file: {
    Key: string;
    Size: number;
  };
  onDeleteSuccess: (fileKey: string) => void;
}

export default function FileItem({ file, onDeleteSuccess }: FileItemProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const bucketName = process.env.NEXT_PUBLIC_S3_BUCKET_NAME || "default-bucket";
  

  // Format file size nicely
  const formatFileSize = (bytes:any) => {
    if (bytes < 1024) return bytes + " B";
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
    else if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(2) + " MB";
    else return (bytes / (1024 * 1024 * 1024)).toFixed(2) + " GB";
  };

  // Get file extension for icon selection
  const getFileExtension = (filename:any) => {
    return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2).toLowerCase();
  };

  const getFileIcon = () => {
    const ext = getFileExtension(file.Key);
    const iconClasses = "w-8 h-8 p-1 rounded";
    
    if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(ext)) {
      return <div className={`${iconClasses} bg-purple-100 text-purple-600`}><File size={24} /></div>;
    } else if (['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'].includes(ext)) {
      return <div className={`${iconClasses} bg-red-100 text-red-600`}><File size={24} /></div>;
    } else if (['mp3', 'wav', 'mp4', 'mov', 'avi', 'webm'].includes(ext)) {
      return <div className={`${iconClasses} bg-green-100 text-green-600`}><File size={24} /></div>;
    } else {
      return <div className={`${iconClasses} bg-blue-100 text-blue-600`}><File size={24} /></div>;
    }
  };

  const handleDelete = async (e:any) => {
    e.stopPropagation();
    if (confirmDelete) {
      try {
        setIsDeleting(true);
        await fetch("/api/delete", {
          method: "DELETE",
          body: JSON.stringify({ bucket: bucketName, key: file.Key }),
        });
        onDeleteSuccess(file.Key);
      } catch (error) {
        console.error("Failed to delete file:", error);
      } finally {
        setIsDeleting(false);
        setConfirmDelete(false);
      }
    } else {
      setConfirmDelete(true);
      // Auto-reset confirmation after 3 seconds
      setTimeout(() => setConfirmDelete(false), 3000);
    }
  };

  const handleDownload = (e:any) => {
    e.stopPropagation();
    // In a real implementation, this would download the file
    console.log("Downloading:", file.Key);
  };

  return (
    <div 
      className="group relative bg-white border rounded-lg mb-2 transition-all duration-300 hover:shadow-md"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="p-3 flex items-center justify-between">
        <div className="flex items-center overflow-hidden">
          {getFileIcon()}
          <div className="ml-3 overflow-hidden">
            <div className="font-medium text-gray-800 truncate max-w-xs">
              {file.Key.split('/').pop()}
            </div>
            <div className="text-sm text-gray-500">
              {formatFileSize(file.Size)}
            </div>
          </div>
        </div>

        <div className={`flex items-center space-x-2 transition-opacity duration-300 ${showActions ? 'opacity-100' : 'opacity-0 sm:group-hover:opacity-100'}`}>
          <button
            onClick={handleDownload}
            className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-full transition-colors"
            title="Download"
          >
            <Download size={18} />
          </button>
          
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className={`p-2 rounded-full transition-colors ${
              confirmDelete 
                ? "bg-red-100 text-red-600 hover:bg-red-200" 
                : "text-gray-500 hover:text-red-500 hover:bg-red-50"
            }`}
            title={confirmDelete ? "Click again to confirm" : "Delete"}
          >
            {isDeleting ? (
              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <Trash2 size={18} />
            )}
          </button>
        </div>
        
        <button 
          className="sm:hidden p-2 text-gray-500 hover:text-gray-700"
          onClick={(e) => {
            e.stopPropagation();
            setShowActions(!showActions);
          }}
        >
          <MoreHorizontal size={18} />
        </button>
      </div>
    </div>
  );
}