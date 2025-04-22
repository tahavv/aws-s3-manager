import { useState, useEffect, SetStateAction } from "react";
import { FolderOpen, Search, ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import FileItem from "./FileItem"; // This would need to be updated to use the modernized FileItem

interface File {
  Key: string;
  Size: number;
}

interface ListFilesProps {
  files: File[];
  onDeleteSuccess: (fileKey: string) => void;
}

export default function ListFiles({ files, onDeleteSuccess }: ListFilesProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [filteredFiles, setFilteredFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (files) {
      setIsLoading(false);
      
      // Filter files based on search term
      const filtered = files.filter(file => 
        file.Key.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      // Sort files
      const sorted = [...filtered].sort((a, b) => {
        if (sortBy === "name") {
          const nameA = a.Key.toLowerCase();
          const nameB = b.Key.toLowerCase();
          return sortOrder === "asc" 
            ? nameA.localeCompare(nameB) 
            : nameB.localeCompare(nameA);
        } else if (sortBy === "size") {
          return sortOrder === "asc" 
            ? a.Size - b.Size 
            : b.Size - a.Size;
        }
        return 0;
      });
      
      setFilteredFiles(sorted);
    }
  }, [files, searchTerm, sortBy, sortOrder]);

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === "asc" ? "desc" : "asc");
  };

  const handleSortChange = (field: any) => {
    if (sortBy === field) {
      toggleSortOrder();
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8 transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800 flex items-center">
          <FolderOpen className="mr-2 text-blue-500" size={20} />
          Files
          {filteredFiles.length > 0 && (
            <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
              {filteredFiles.length}
            </span>
          )}
        </h2>
      </div>

      <div className="mb-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="text-gray-400" size={18} />
          </div>
          <input
            type="text"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
            placeholder="Search files..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => handleSortChange("name")}
            className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors flex items-center ${
              sortBy === "name"
                ? "bg-blue-100 text-blue-800" 
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Name
            {sortBy === "name" && (
              sortOrder === "asc" 
                ? <ArrowUpCircle size={14} className="ml-1" />
                : <ArrowDownCircle size={14} className="ml-1" />
            )}
          </button>

          <button
            onClick={() => handleSortChange("size")}
            className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors flex items-center ${
              sortBy === "size" 
                ? "bg-blue-100 text-blue-800" 
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Size
            {sortBy === "size" && (
              sortOrder === "asc" 
                ? <ArrowUpCircle size={14} className="ml-1" />
                : <ArrowDownCircle size={14} className="ml-1" />
            )}
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="py-12 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : filteredFiles.length > 0 ? (
        <div className="space-y-2">
          {filteredFiles.map((file) => (
            <FileItem
              key={file.Key}
              file={file}
              onDeleteSuccess={onDeleteSuccess}
            />
          ))}
        </div>
      ) : (
        <div className="py-12 text-center text-gray-500">
          {searchTerm ? (
            <div>
              <p className="text-lg font-medium">No matching files found</p>
              <p className="text-sm">Try changing your search term</p>
            </div>
          ) : (
            <div>
              <p className="text-lg font-medium">No files yet</p>
              <p className="text-sm">Upload your first file to get started</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}