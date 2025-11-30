import React, { useState } from 'react';
import { CandidateAnalysis } from '../types';
import { ChevronRightIcon, UserIcon, BriefcaseIcon, EducationIcon, CheckIcon, WarningIcon, TrophyIcon, FlagIcon } from './Icons';

interface ResultCardProps {
  analysis: CandidateAnalysis;
  rank?: number;
}

export const ResultCard: React.FC<ResultCardProps> = ({ analysis, rank }) => {
  const [expanded, setExpanded] = useState(false);

  const getRecommendationBadge = (rec: string) => {
    switch (rec) {
      case 'Strong Hire': return "bg-green-100 text-green-800 border-green-200";
      case 'Potential': return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default: return "bg-red-100 text-red-800 border-red-200";
    }
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm border transition-all duration-200 hover:shadow-md overflow-hidden ${rank === 1 ? 'border-indigo-200 ring-1 ring-indigo-100' : 'border-gray-200'}`}>
      {/* Header Summary */}
      <div 
        className="p-5 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 relative"
        onClick={() => setExpanded(!expanded)}
      >
        {/* Rank Badge for top 3 */}
        {rank && rank <= 3 && (
          <div className={`absolute -left-1 top-0 bottom-0 w-1.5 rounded-l-xl ${rank === 1 ? 'bg-indigo-500' : rank === 2 ? 'bg-indigo-400' : 'bg-indigo-300'}`} />
        )}

        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="flex-shrink-0 h-14 w-14 bg-gray-100 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
              <UserIcon className="h-7 w-7 text-gray-500" />
            </div>
            {rank && rank === 1 && (
               <div className="absolute -top-1 -right-1 bg-yellow-400 text-white p-1 rounded-full shadow-sm">
                 <TrophyIcon className="w-3 h-3 fill-current" />
               </div>
            )}
            {rank && rank > 1 && (
               <div className="absolute -top-1 -right-1 bg-gray-800 text-white w-5 h-5 flex items-center justify-center text-xs font-bold rounded-full shadow-sm">
                 #{rank}
               </div>
            )}
          </div>
          
          <div>
            <h3 className="text-lg font-bold text-gray-900 leading-tight">{analysis.candidateName}</h3>
            <div className="flex flex-wrap items-center gap-2 mt-1.5">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRecommendationBadge(analysis.recommendation)}`}>
                {analysis.recommendation}
              </span>
              <span className="text-sm text-gray-500 flex items-center">
                <BriefcaseIcon className="w-3 h-3 mr-1" /> {analysis.experienceYears}y
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between md:justify-end gap-6 flex-1">
          {/* Red Flags Preview */}
          {analysis.redFlags && analysis.redFlags.length > 0 && (
             <div className="hidden md:flex items-center text-red-600 text-xs font-medium bg-red-50 px-2 py-1 rounded">
                <FlagIcon className="w-3 h-3 mr-1" />
                {analysis.redFlags.length} Flag{analysis.redFlags.length > 1 ? 's' : ''}
             </div>
          )}

          <div className="text-right pl-4 border-l border-gray-100">
            <div className={`text-2xl font-bold ${analysis.matchScore >= 80 ? 'text-green-600' : analysis.matchScore >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
              {analysis.matchScore}%
            </div>
            <div className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Match</div>
          </div>
          <ChevronRightIcon className={`w-5 h-5 text-gray-400 transform transition-transform duration-200 ${expanded ? 'rotate-90' : ''}`} />
        </div>
      </div>

      {/* Expanded Details */}
      {expanded && (
        <div className="border-t border-gray-100 bg-gray-50/50 p-6 space-y-6 animate-fadeIn">
          
          <div className="prose prose-sm max-w-none text-gray-600">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Executive Summary</h4>
            <p className="text-gray-800 leading-relaxed">{analysis.summary}</p>
          </div>

          {/* Skills Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <h4 className="flex items-center text-xs font-bold text-green-700 uppercase tracking-wider mb-3">
                <CheckIcon className="w-4 h-4 mr-2" /> Top Matched Skills
              </h4>
              <div className="flex flex-wrap gap-2">
                {analysis.keySkillsMatched.map((skill, idx) => (
                  <span key={idx} className="px-2.5 py-1 bg-green-50 text-green-700 text-xs rounded-md border border-green-100 font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <h4 className="flex items-center text-xs font-bold text-red-700 uppercase tracking-wider mb-3">
                <WarningIcon className="w-4 h-4 mr-2" /> Missing Skills
              </h4>
              <div className="flex flex-wrap gap-2">
                {analysis.missingSkills.length > 0 ? (
                  analysis.missingSkills.map((skill, idx) => (
                    <span key={idx} className="px-2.5 py-1 bg-red-50 text-red-700 text-xs rounded-md border border-red-100 font-medium">
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-gray-400 italic">No critical skills missing.</span>
                )}
              </div>
            </div>
          </div>

          {/* Red Flags Section */}
          {analysis.redFlags && analysis.redFlags.length > 0 && (
            <div className="bg-red-50 p-4 rounded-lg border border-red-100">
              <h4 className="flex items-center text-xs font-bold text-red-800 uppercase tracking-wider mb-2">
                <FlagIcon className="w-4 h-4 mr-2" /> Potential Red Flags
              </h4>
              <ul className="list-disc list-inside text-sm text-red-700 space-y-1 ml-1">
                {analysis.redFlags.map((flag, idx) => (
                  <li key={idx}>{flag}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Stats Footer */}
          <div className="flex flex-col sm:flex-row gap-4 pt-2 border-t border-gray-100">
            <div className="flex items-center space-x-2 text-sm text-gray-600 bg-white px-3 py-2 rounded border border-gray-200">
              <BriefcaseIcon className="w-4 h-4 text-gray-400" />
              <span className="font-medium">{analysis.experienceYears} Years</span>
              <span className="text-gray-400">Experience</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600 bg-white px-3 py-2 rounded border border-gray-200">
              <EducationIcon className="w-4 h-4 text-gray-400" />
              <span className="font-medium">{analysis.educationLevel}</span>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};