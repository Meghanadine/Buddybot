import React, { useState, useRef } from 'react';
import { UploadedFile, AnalysisStatus, ModelType } from '../types';
import { analyzeResume } from '../services/geminiService';
import { ResultCard } from './ResultCard';
import { 
  ArrowLeftIcon, 
  PlusIcon, 
  SearchIcon, 
  UploadIcon, 
  LoaderIcon, 
  BriefcaseIcon,
  CheckIcon,
  MailIcon,
  PhoneIcon,
  XIcon
} from './Icons';

interface ResumeScreeningViewProps {
  onBack: () => void;
}

interface Job {
  id: string;
  title: string;
  department: string;
  requirements: string;
  description: string;
}

// Extracted Component to fix React Hook Rules violation
interface CandidateCardProps {
    candidate: UploadedFile;
    jobs: Job[];
    onScreen: (candidateId: string, jobId: string) => void;
}

const CandidateCard: React.FC<CandidateCardProps> = ({ candidate, jobs, onScreen }) => {
    const [selectedJobId, setSelectedJobId] = useState(jobs[0]?.id || '');

    if (candidate.status === 'completed' && candidate.analysis) {
        return (
            <div className="h-full animate-fadeIn">
                <ResultCard analysis={candidate.analysis} />
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col h-full hover:shadow-md transition-shadow animate-fadeIn">
            <div className="flex items-start justify-between mb-6">
                <div className="flex items-center">
                    <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-700 font-bold text-lg mr-4">
                        {candidate.file.name.split('_')[0].charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 truncate max-w-[180px]">{candidate.file.name.replace(/_Resume.txt$/, "").replace(/\.[^/.]+$/, "")}</h3>
                        <p className="text-sm text-gray-500">Candidate</p> 
                    </div>
                </div>
            </div>

            <div className="space-y-3 mb-6 flex-1">
                 <div className="flex items-center text-sm text-gray-500">
                    <MailIcon className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="truncate">candidate@example.com</span>
                 </div>
                 <div className="flex items-center text-sm text-gray-500">
                    <PhoneIcon className="w-4 h-4 mr-2 text-gray-400" />
                    <span>+1-555-0123</span>
                 </div>
            </div>

            <div className="pt-4 border-t border-gray-100 space-y-3">
                 <select 
                    className="w-full text-sm border-gray-200 rounded-md focus:ring-yellow-500 focus:border-yellow-500 bg-gray-50 p-2"
                    value={selectedJobId}
                    onChange={(e) => setSelectedJobId(e.target.value)}
                 >
                    {jobs.map(j => (
                        <option key={j.id} value={j.id}>{j.title}</option>
                    ))}
                 </select>
                 
                 <button 
                    onClick={() => onScreen(candidate.id, selectedJobId)}
                    disabled={candidate.status === 'analyzing' || !selectedJobId}
                    className="w-full py-2 bg-white border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 hover:border-yellow-300 hover:text-yellow-700 transition-colors flex items-center justify-center"
                 >
                    {candidate.status === 'analyzing' ? (
                        <>
                           <LoaderIcon className="w-4 h-4 mr-2 animate-spin" />
                           Screening...
                        </>
                    ) : (
                        <>
                           <BriefcaseIcon className="w-4 h-4 mr-2" />
                           Screen Candidate
                        </>
                    )}
                 </button>
            </div>
        </div>
    );
};

export const ResumeScreeningView: React.FC<ResumeScreeningViewProps> = ({ onBack }) => {
  // Mock Jobs
  const [jobs, setJobs] = useState<Job[]>([
    { 
      id: '1', 
      title: 'Senior Frontend Engineer', 
      department: 'Engineering',
      requirements: '5+ years experience, React, TypeScript',
      description: 'Senior Frontend Engineer with 5+ years of experience in React, TypeScript, and Node.js. Experience with Tailwind CSS and AI integration is a plus.' 
    },
    { 
      id: '2', 
      title: 'Product Manager', 
      department: 'Product',
      requirements: 'SaaS experience, Agile',
      description: 'Product Manager needed for SaaS platform.' 
    }
  ]);

  const [candidates, setCandidates] = useState<UploadedFile[]>([
    // Pre-populate with some mock data if desired, or leave empty
  ]);
  
  const [isUploading, setIsUploading] = useState(false);
  
  // Job Posting Modal State
  const [showJobModal, setShowJobModal] = useState(false);
  const [newJob, setNewJob] = useState({
    title: '',
    department: '',
    requirements: '',
    description: ''
  });

  // Candidate Modal State
  const [showCandidateModal, setShowCandidateModal] = useState(false);
  const [newCandidate, setNewCandidate] = useState({
    fullName: '',
    position: '',
    email: '',
    phone: '',
    resumeText: ''
  });

  const handlePostJob = () => {
    if (!newJob.title || !newJob.requirements) return;
    
    const job: Job = {
        id: crypto.randomUUID(),
        title: newJob.title,
        department: newJob.department,
        requirements: newJob.requirements,
        description: newJob.description
    };
    
    setJobs(prev => [job, ...prev]); // Add new job to top
    setShowJobModal(false);
    setNewJob({ title: '', department: '', requirements: '', description: '' });
  };

  const handleAddCandidate = () => {
    if (!newCandidate.fullName || !newCandidate.position || !newCandidate.resumeText) return;

    setIsUploading(true);
    
    // Create a text file from the resume text to be compatible with existing logic
    const blob = new Blob([newCandidate.resumeText], { type: 'text/plain' });
    const file = new File([blob], `${newCandidate.fullName.replace(/\s+/g, '_')}_Resume.txt`, { type: 'text/plain' });

    const newFile: UploadedFile = {
        id: crypto.randomUUID(),
        file: file,
        status: 'pending'
    };

    // Simulate delay
    setTimeout(() => {
        setCandidates(prev => [...prev, newFile]);
        setIsUploading(false);
        setShowCandidateModal(false);
        setNewCandidate({ fullName: '', position: '', email: '', phone: '', resumeText: '' });
    }, 800);
  };

  const runScreening = async (candidateId: string, jobId: string) => {
    const candidate = candidates.find(c => c.id === candidateId);
    const job = jobs.find(j => j.id === jobId);
    
    if (!candidate || !job) return;

    // Update status to analyzing
    setCandidates(prev => prev.map(c => c.id === candidateId ? { ...c, status: 'analyzing' } : c));

    // Combine description and requirements for analysis
    const fullJobContext = `Job Title: ${job.title}\nDepartment: ${job.department}\nRequirements: ${job.requirements}\nDescription: ${job.description}`;

    // Call API
    const analysis = await analyzeResume(candidate.file, fullJobContext, 'gemini');

    // Update with result
    setCandidates(prev => prev.map(c => c.id === candidateId ? { 
        ...c, 
        status: analysis.matchScore > 0 ? 'completed' : 'error',
        analysis: {
          ...analysis,
          candidateName: newCandidate.fullName || analysis.candidateName // Use inputted name if available, fallback to AI extracted
        }
    } : c));
  };

  return (
    <div className="animate-fadeInUp max-w-7xl mx-auto relative">
      <div className="flex items-center mb-6">
        <button onClick={onBack} className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-yellow-600">
            <ArrowLeftIcon className="w-6 h-6" />
        </button>
        <div>
            <h1 className="text-xl font-bold text-gray-900">
                Talent Scout
            </h1>
            <p className="text-sm text-gray-500">AI-Powered Candidate Screening</p>
        </div>
        
        <div className="ml-auto flex space-x-3">
             <button 
                onClick={() => setShowJobModal(true)}
                className="hidden md:flex items-center px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50"
             >
                <PlusIcon className="w-4 h-4 mr-2" />
                Post Job
             </button>
             <button 
                onClick={() => setShowCandidateModal(true)}
                className="flex items-center px-4 py-2 bg-green-900 text-white rounded-full text-sm font-medium hover:bg-green-800 transition-colors"
            >
                {isUploading ? <LoaderIcon className="w-4 h-4 mr-2 animate-spin" /> : <PlusIcon className="w-4 h-4 mr-2" />}
                Add Candidate
             </button>
        </div>
      </div>

      <div className="mb-8 relative">
         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-gray-400" />
         </div>
         <input 
            type="text"
            className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 sm:text-sm shadow-sm"
            placeholder="Search candidates by name or position..."
         />
      </div>

      {candidates.length === 0 ? (
         <div className="text-center py-20 bg-white rounded-2xl border border-gray-200 border-dashed">
             <div className="mx-auto h-16 w-16 text-gray-300 mb-4">
                <UploadIcon className="h-full w-full" />
             </div>
             <h3 className="mt-2 text-sm font-medium text-gray-900">No Candidates Yet</h3>
             <p className="mt-1 text-sm text-gray-500">Start by adding candidates to screen for your open positions.</p>
             <div className="mt-6">
                <button
                    onClick={() => setShowCandidateModal(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-full text-white bg-green-900 hover:bg-green-800 focus:outline-none"
                >
                    <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                    Add First Candidate
                </button>
             </div>
         </div>
      ) : (
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
            {candidates.map(candidate => (
                <CandidateCard 
                    key={candidate.id}
                    candidate={candidate}
                    jobs={jobs}
                    onScreen={runScreening}
                />
            ))}
         </div>
      )}

      {/* Post Job Modal */}
      {showJobModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm" onClick={() => setShowJobModal(false)}></div>
           <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-fadeInUp">
              <div className="p-6">
                 <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-gray-900">Post New Job</h3>
                    <button onClick={() => setShowJobModal(false)} className="text-gray-400 hover:text-gray-600">
                       <XIcon className="w-5 h-5" />
                    </button>
                 </div>
                 
                 <div className="space-y-4">
                    <div>
                       <label className="block text-sm font-medium text-gray-700 mb-1">Job Title *</label>
                       <input 
                         type="text"
                         className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-shadow"
                         placeholder="e.g., Senior Software Engineer"
                         value={newJob.title}
                         onChange={(e) => setNewJob({...newJob, title: e.target.value})}
                       />
                    </div>
                    
                    <div>
                       <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                       <input 
                         type="text"
                         className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-shadow"
                         placeholder="e.g., Engineering"
                         value={newJob.department}
                         onChange={(e) => setNewJob({...newJob, department: e.target.value})}
                       />
                    </div>

                    <div>
                       <label className="block text-sm font-medium text-gray-700 mb-1">Requirements *</label>
                       <textarea 
                         rows={4}
                         className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-shadow resize-none"
                         placeholder="List key requirements, skills, and qualifications..."
                         value={newJob.requirements}
                         onChange={(e) => setNewJob({...newJob, requirements: e.target.value})}
                       />
                    </div>

                    <div>
                       <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                       <textarea 
                         rows={3}
                         className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-shadow resize-none"
                         placeholder="Job description and responsibilities..."
                         value={newJob.description}
                         onChange={(e) => setNewJob({...newJob, description: e.target.value})}
                       />
                    </div>
                 </div>

                 <div className="mt-8">
                    <button 
                      onClick={handlePostJob}
                      disabled={!newJob.title || !newJob.requirements}
                      className="w-full bg-green-900 text-white font-medium py-3 rounded-lg hover:bg-green-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                       Post Job
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Add Candidate Modal */}
      {showCandidateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm" onClick={() => setShowCandidateModal(false)}></div>
           <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-xl overflow-hidden animate-fadeInUp">
              <div className="p-6">
                 <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900">Add New Candidate</h3>
                    <button onClick={() => setShowCandidateModal(false)} className="text-gray-400 hover:text-gray-600">
                       <XIcon className="w-5 h-5" />
                    </button>
                 </div>
                 
                 <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                       <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                          <input 
                            type="text"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-shadow"
                            placeholder="John Doe"
                            value={newCandidate.fullName}
                            onChange={(e) => setNewCandidate({...newCandidate, fullName: e.target.value})}
                          />
                       </div>
                       <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Position *</label>
                          <input 
                            type="text"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-shadow"
                            placeholder="Software Engineer"
                            value={newCandidate.position}
                            onChange={(e) => setNewCandidate({...newCandidate, position: e.target.value})}
                          />
                       </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                       <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                          <input 
                            type="text"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-shadow"
                            placeholder="john@example.com"
                            value={newCandidate.email}
                            onChange={(e) => setNewCandidate({...newCandidate, email: e.target.value})}
                          />
                       </div>
                       <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                          <input 
                            type="text"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-shadow"
                            placeholder="+1 234 567 8900"
                            value={newCandidate.phone}
                            onChange={(e) => setNewCandidate({...newCandidate, phone: e.target.value})}
                          />
                       </div>
                    </div>

                    <div>
                       <label className="block text-sm font-medium text-gray-700 mb-1">Resume / CV *</label>
                       <textarea 
                         rows={8}
                         className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-shadow resize-none"
                         placeholder="Paste resume text or key qualifications..."
                         value={newCandidate.resumeText}
                         onChange={(e) => setNewCandidate({...newCandidate, resumeText: e.target.value})}
                       />
                    </div>
                 </div>

                 <div className="mt-8">
                    <button 
                      onClick={handleAddCandidate}
                      disabled={!newCandidate.fullName || !newCandidate.position || !newCandidate.resumeText}
                      className="w-full bg-green-900 text-white font-medium py-3 rounded-lg hover:bg-green-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                       Add Candidate
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}

    </div>
  );
};