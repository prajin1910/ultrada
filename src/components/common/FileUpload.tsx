import React, { useCallback } from "react";
import { Upload, File, X } from "lucide-react";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  onClearFile: () => void;
  isLoading: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  selectedFile,
  onClearFile,
  isLoading,
}) => {
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const files = Array.from(e.dataTransfer.files);
      const validFile = files.find((file) => {
        const extension = file.name.toLowerCase();
        return (
          extension.endsWith(".txt") ||
          extension.endsWith(".pdf") ||
          extension.endsWith(".docx")
        );
      });

      if (validFile) {
        onFileSelect(validFile);
      }
    },
    [onFileSelect]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        onFileSelect(file);
      }
    },
    [onFileSelect]
  );

  return (
    <div className="w-full max-w-2xl mx-auto">
      {!selectedFile ? (
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className="border-2 border-dashed border-blue-300 rounded-xl p-12 text-center hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-300 cursor-pointer group"
        >
          <input
            type="file"
            accept=".txt,.pdf,.docx"
            onChange={handleFileInput}
            className="hidden"
            id="file-upload"
            disabled={isLoading}
          />
          <label htmlFor="file-upload" className="cursor-pointer">
            <Upload className="mx-auto h-16 w-16 text-blue-400 group-hover:text-blue-500 transition-colors duration-300" />
            <p className="mt-4 text-lg font-medium text-gray-700">
              Drop your file here or click to browse
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Supports .txt, .pdf, and .docx files (max 10MB)
            </p>
          </label>
        </div>
      ) : (
        <div className="bg-white rounded-xl border-2 border-blue-200 p-6 flex items-center justify-between shadow-sm">
          <div className="flex items-center space-x-3">
            <File className="h-8 w-8 text-blue-500" />
            <div>
              <p className="font-medium text-gray-900">{selectedFile.name}</p>
              <p className="text-sm text-gray-500">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
          <button
            onClick={onClearFile}
            disabled={isLoading}
            className="p-2 text-gray-400 hover:text-red-500 transition-colors duration-200 disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
};
