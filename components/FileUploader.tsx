import React, { useRef, useState } from 'react';
import { UploadIcon, FileIcon, XIcon, CheckIcon } from './Icons';
import { UploadedFile } from '../types';

interface FileUploaderProps {
  files: UploadedFile[];
  onFilesAdded: (files: File[]) => void;
  onRemoveFile: (id: string) => void;
}

export const FileUploader: React.FC<FileUploaderProps> = ({ files, onFilesAdded, onRemoveFile }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFilesAdded(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesAdded(Array.from(e.target.files));
    }
    // Reset value so same file can be selected again if needed
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 h-full flex flex-col">
      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <span className="bg-indigo-100 text-indigo-600 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3">2</span>
        Upload Resumes
      </h2>
      
      <div 
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-indigo-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          multiple 
          accept=".pdf,.txt,application/pdf,text/plain" 
        />
        <UploadIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-sm font-medium text-gray-900">Click to upload or drag and drop</p>
        <p className="text-xs text-gray-500 mt-1">PDF or TXT files only</p>
      </div>

      <div className="mt-6 flex-1 overflow-y-auto">
        {files.length === 0 ? (
          <p className="text-center text-sm text-gray-400 mt-4">No files uploaded yet.</p>
        ) : (
          <ul className="space-y-3">
            {files.map((fileWrapper) => (
              <li key={fileWrapper.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md group">
                <div className="flex items-center space-x-3 overflow-hidden">
                  <div className={`p-2 rounded-full ${
                    fileWrapper.status === 'completed' ? 'bg-green-100 text-green-600' :
                    fileWrapper.status === 'error' ? 'bg-red-100 text-red-600' :
                    'bg-gray-200 text-gray-500'
                  }`}>
                    <FileIcon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{fileWrapper.file.name}</p>
                    <p className="text-xs text-gray-500">{(fileWrapper.file.size / 1024).toFixed(1)} KB</p>
                  </div>
                </div>
                
                {fileWrapper.status === 'pending' && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); onRemoveFile(fileWrapper.id); }}
                    className="text-gray-400 hover:text-red-500 p-1"
                  >
                    <XIcon className="w-5 h-5" />
                  </button>
                )}
                 {fileWrapper.status === 'completed' && (
                    <CheckIcon className="w-5 h-5 text-green-500" />
                 )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
