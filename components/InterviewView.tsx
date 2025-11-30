import React, { useState } from 'react';
import { ArrowLeftIcon, UsersIcon, LoaderIcon } from './Icons';
import { generateInterviewQuestions } from '../services/geminiService';

interface InterviewViewProps {
  onBack: () => void;
}

export const InterviewView: React.FC<InterviewViewProps> = ({ onBack }) => {
  const [role, setRole] = useState('');
  const [questions, setQuestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!role) return;
    setLoading(true);
    const qs = await generateInterviewQuestions(role);
    setQuestions(qs);
    setLoading(false);
  };

  return (
    <div className="animate-fadeInUp max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
            <button onClick={onBack} className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-blue-600">
                <ArrowLeftIcon className="w-6 h-6" />
            </button>
            <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <UsersIcon className="w-6 h-6 text-blue-600" />
                    Interview Pilot <span className="text-gray-400 font-normal text-lg">| Question Generator</span>
                </h1>
            </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">Job Role / Position</label>
                <div className="flex gap-4">
                    <input 
                        type="text" 
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        placeholder="e.g. Senior Product Manager"
                        className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                    <button 
                        onClick={handleGenerate}
                        disabled={loading || !role}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium flex items-center"
                    >
                        {loading ? <LoaderIcon className="w-4 h-4 animate-spin mr-2" /> : null}
                        Generate Questions
                    </button>
                </div>
            </div>

            {questions.length > 0 && (
                <div className="space-y-4 animate-fadeInUp">
                    <h3 className="text-lg font-semibold text-gray-900">Generated Interview Questions</h3>
                    <div className="space-y-3">
                        {questions.map((q, idx) => (
                            <div key={idx} className="p-4 bg-blue-50 border border-blue-100 rounded-lg text-blue-900 font-medium">
                                <span className="text-blue-400 mr-3 font-bold">{idx + 1}.</span>
                                {q}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    </div>
  );
};