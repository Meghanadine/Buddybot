import React from 'react';

interface JobInputProps {
  value: string;
  onChange: (value: string) => void;
}

export const JobInput: React.FC<JobInputProps> = ({ value, onChange }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6 h-full flex flex-col">
      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <span className="bg-indigo-100 text-indigo-600 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3">1</span>
        Job Description
      </h2>
      <p className="text-sm text-gray-500 mb-4">
        Paste the full job description here. The AI will use this to evaluate candidates.
      </p>
      <textarea
        className="flex-1 w-full p-4 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 resize-none text-sm leading-relaxed"
        placeholder="e.g. Senior Frontend Engineer with 5+ years of experience in React, TypeScript, and Node.js..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};
