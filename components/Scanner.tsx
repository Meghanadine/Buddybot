import React from 'react';
import { FileIcon } from './Icons';

interface ScannerProps {
  filename: string;
}

export const Scanner: React.FC<ScannerProps> = ({ filename }) => {
  return (
    <div className="relative w-24 h-32 mx-auto mb-4 bg-white rounded-lg shadow-md border border-gray-200 flex flex-col items-center justify-center overflow-hidden">
      <FileIcon className="w-10 h-10 text-gray-300 mb-2" />
      <div className="text-[10px] text-gray-400 px-2 text-center truncate w-full">{filename}</div>
      
      {/* Scanning Beam */}
      <div className="absolute top-0 left-0 right-0 h-full w-full pointer-events-none">
        <div className="animate-scan"></div>
      </div>
      
      {/* Overlay tint */}
      <div className="absolute inset-0 bg-indigo-500 opacity-10 mix-blend-overlay"></div>
    </div>
  );
};