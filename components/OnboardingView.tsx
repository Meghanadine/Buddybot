import React, { useState } from 'react';
import { 
  ArrowLeftIcon, 
  PlusIcon, 
  XIcon, 
  CalendarIcon, 
  CheckIcon, 
  ClockIcon, 
  CircleIcon, 
  ChevronDownIcon, 
  ChevronRightIcon 
} from './Icons';

interface OnboardingViewProps {
  onBack: () => void;
}

interface Task {
  id: string;
  title: string;
  status: 'done' | 'in-progress' | 'pending';
  description?: string;
}

interface OnboardingProfile {
  id: number;
  name: string;
  role: string;
  progress: number;
  tasks: Task[];
}

export const OnboardingView: React.FC<OnboardingViewProps> = ({ onBack }) => {
  const [currentView, setCurrentView] = useState<'dashboard' | 'detail'>('dashboard');
  const [selectedProfileId, setSelectedProfileId] = useState<number | null>(null);
  
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ 
    employeeName: '', 
    position: '', 
    employeeId: '', 
    startDate: '30/11/2025' 
  });

  // Detailed Mock Data matching screenshot
  const [onboardings, setOnboardings] = useState<OnboardingProfile[]>([
    { 
      id: 1, 
      name: "Alice Johnson", 
      role: "Senior Developer", 
      progress: 14, 
      tasks: [
        { id: 't1', title: 'Complete Personal Information Form', status: 'done' },
        { id: 't2', title: 'Review Company Policies', status: 'in-progress' },
        { id: 't3', title: 'Set Up Work Equipment', status: 'pending', description: 'Receive and configure your laptop, phone, and other work equipment.' },
        { id: 't4', title: 'Complete IT Security Training', status: 'pending' },
        { id: 't5', title: 'Meet Your Team', status: 'pending' },
        { id: 't6', title: 'Review Job Responsibilities', status: 'pending' },
        { id: 't7', title: 'Submit Required Documents', status: 'pending' },
      ]
    },
    { 
      id: 2, 
      name: "Bob Smith", 
      role: "Product Manager", 
      progress: 0, 
      tasks: [
        { id: 't1', title: 'Complete Personal Information Form', status: 'pending' },
        { id: 't2', title: 'Review Company Policies', status: 'pending' },
        { id: 't3', title: 'Set Up Work Equipment', status: 'pending' }
      ]
    },
  ]);

  const [expandedTaskId, setExpandedTaskId] = useState<string | null>('t3');

  const handleCreateOnboarding = () => {
    if (!formData.employeeName || !formData.position) return;
    
    const newProfile: OnboardingProfile = {
      id: Date.now(),
      name: formData.employeeName,
      role: formData.position,
      progress: 0,
      tasks: [
        { id: 't1', title: 'Complete Personal Information Form', status: 'pending' },
        { id: 't2', title: 'Review Company Policies', status: 'pending' },
        { id: 't3', title: 'Set Up Work Equipment', status: 'pending' },
        { id: 't4', title: 'Complete IT Security Training', status: 'pending' },
        { id: 't5', title: 'Meet Your Team', status: 'pending' },
      ]
    };

    setOnboardings(prev => [...prev, newProfile]);
    setShowModal(false);
    setFormData({ 
      employeeName: '', 
      position: '', 
      employeeId: '', 
      startDate: '30/11/2025' 
    });
  };

  const handleCardClick = (id: number) => {
    setSelectedProfileId(id);
    setCurrentView('detail');
    // Default expand the first pending task
    const profile = onboardings.find(p => p.id === id);
    if (profile) {
      const firstPending = profile.tasks.find(t => t.status === 'pending');
      setExpandedTaskId(firstPending ? firstPending.id : null);
    }
  };

  const handleBackToList = () => {
    setCurrentView('dashboard');
    setSelectedProfileId(null);
  };

  const toggleTask = (taskId: string) => {
    setExpandedTaskId(prev => prev === taskId ? null : taskId);
  };

  const handleUpdateTaskStatus = (profileId: number, taskId: string, newStatus: 'done' | 'in-progress') => {
    setOnboardings(prev => prev.map(profile => {
      if (profile.id !== profileId) return profile;

      const updatedTasks = profile.tasks.map(task => 
        task.id === taskId ? { ...task, status: newStatus } : task
      );

      // Recalculate progress based on 'done' tasks
      const doneCount = updatedTasks.filter(t => t.status === 'done').length;
      const totalCount = updatedTasks.length;
      const newProgress = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

      return {
        ...profile,
        tasks: updatedTasks,
        progress: newProgress
      };
    }));
  };

  // --- RENDER HELPERS ---

  const renderDashboard = () => (
    <div className="animate-fadeInUp">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-green-900">Active Onboardings</h2>
        <p className="text-gray-500 text-sm">Track and manage employee onboarding progress</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {onboardings.map(profile => {
            const doneCount = profile.tasks.filter(t => t.status === 'done').length;
            const inProgressCount = profile.tasks.filter(t => t.status === 'in-progress').length;
            const pendingCount = profile.tasks.filter(t => t.status === 'pending').length;

            return (
                <div 
                  key={profile.id} 
                  onClick={() => handleCardClick(profile.id)}
                  className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
                >
                    <div className="mb-4">
                        <h3 className="text-lg font-bold text-green-900 group-hover:text-green-700">{profile.name}</h3>
                        <p className="text-sm text-gray-500">{profile.role}</p>
                    </div>
                    
                    <div className="mb-6">
                        <div className="flex justify-between text-xs font-medium text-gray-500 mb-2">
                            <span>Progress</span>
                            <span className="text-green-700">{profile.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                            <div className="bg-gray-800 h-2 rounded-full" style={{ width: `${profile.progress}%` }}></div>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="bg-gray-50 p-2 rounded-lg">
                            <div className="text-green-600 font-bold text-lg">{doneCount}</div>
                            <div className="text-[10px] text-gray-500 uppercase">Done</div>
                        </div>
                        <div className="bg-gray-50 p-2 rounded-lg">
                            <div className="text-orange-500 font-bold text-lg">{inProgressCount}</div>
                            <div className="text-[10px] text-gray-500 uppercase">In Progress</div>
                        </div>
                        <div className="bg-gray-50 p-2 rounded-lg">
                            <div className="text-gray-400 font-bold text-lg">{pendingCount}</div>
                            <div className="text-[10px] text-gray-500 uppercase">Pending</div>
                        </div>
                    </div>
                </div>
            );
        })}
      </div>
    </div>
  );

  const renderDetail = () => {
    const profile = onboardings.find(p => p.id === selectedProfileId);
    if (!profile) return null;

    return (
      <div className="animate-fadeInUp">
        {/* Progress Header Card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 mb-8 relative overflow-hidden">
             <button 
                onClick={handleBackToList}
                className="absolute top-8 left-8 flex items-center text-sm font-medium text-gray-600 hover:text-green-800 transition-colors"
             >
                <ArrowLeftIcon className="w-4 h-4 mr-2" />
                Back to List
             </button>

             <div className="flex flex-col items-center justify-center">
                <div className="text-6xl font-light text-green-900 mb-2">
                    {profile.progress}%
                </div>
                <div className="text-sm text-gray-500 uppercase tracking-wider mb-6">Onboarding Progress</div>
                
                <div className="w-full max-w-2xl bg-gray-200 rounded-full h-3 mb-8">
                    <div className="bg-gray-900 h-3 rounded-full transition-all duration-1000 ease-out" style={{ width: `${profile.progress}%` }}></div>
                </div>

                <div className="text-center">
                    <h2 className="text-xl font-bold text-green-900">{profile.name}</h2>
                    <p className="text-gray-500">{profile.role}</p>
                </div>
             </div>
        </div>

        {/* Task List */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
            <h3 className="text-lg font-bold text-green-900 mb-6">Onboarding Tasks</h3>
            
            <div className="space-y-4">
                {profile.tasks.map((task, index) => {
                    const isExpanded = expandedTaskId === task.id;
                    
                    return (
                        <div key={task.id} className={`border rounded-lg transition-all duration-200 ${isExpanded ? 'border-gray-300 shadow-sm' : 'border-gray-100 hover:border-gray-200'}`}>
                            {/* Task Header */}
                            <div 
                                className={`flex items-center justify-between p-4 cursor-pointer ${task.status === 'done' ? 'opacity-75' : ''}`}
                                onClick={() => toggleTask(task.id)}
                            >
                                <div className="flex items-center space-x-4">
                                    {task.status === 'done' && (
                                        <div className="flex-shrink-0 w-6 h-6 rounded-full border-2 border-green-500 flex items-center justify-center bg-green-50">
                                            <CheckIcon className="w-3.5 h-3.5 text-green-600" />
                                        </div>
                                    )}
                                    {task.status === 'in-progress' && (
                                        <div className="flex-shrink-0 w-6 h-6 rounded-full border-2 border-orange-400 flex items-center justify-center">
                                            <ClockIcon className="w-3.5 h-3.5 text-orange-500" />
                                        </div>
                                    )}
                                    {task.status === 'pending' && (
                                        <div className="flex-shrink-0 w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center">
                                            <CircleIcon className="w-3.5 h-3.5 text-transparent" />
                                        </div>
                                    )}

                                    <span className={`text-sm font-medium ${task.status === 'done' ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                                        {task.title}
                                    </span>
                                </div>
                                
                                {isExpanded ? <ChevronDownIcon className="w-4 h-4 text-gray-400" /> : <ChevronRightIcon className="w-4 h-4 text-gray-300" />}
                            </div>

                            {/* Task Body (Expanded) */}
                            {isExpanded && (
                                <div className="px-14 pb-6 pt-0 animate-fadeIn">
                                    {task.description && (
                                        <p className="text-sm text-gray-500 mb-4 leading-relaxed">
                                            {task.description}
                                        </p>
                                    )}
                                    
                                    {task.status !== 'done' && (
                                        <div className="flex space-x-3">
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleUpdateTaskStatus(profile.id, task.id, 'done');
                                                }}
                                                className="px-4 py-1.5 bg-green-900 text-white text-xs font-bold rounded-full hover:bg-green-800 flex items-center"
                                            >
                                                <CheckIcon className="w-3 h-3 mr-1.5" />
                                                Mark Complete
                                            </button>
                                            
                                            {task.status !== 'in-progress' && (
                                                <button 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleUpdateTaskStatus(profile.id, task.id, 'in-progress');
                                                    }}
                                                    className="px-4 py-1.5 bg-white border border-gray-200 text-gray-600 text-xs font-medium rounded-full hover:bg-gray-50"
                                                >
                                                    Start Task
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
      </div>
    );
  };

  return (
    <div className="animate-fadeInUp max-w-5xl mx-auto relative">
        <div className="flex items-center mb-6">
            <button onClick={onBack} className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-purple-600">
                <ArrowLeftIcon className="w-6 h-6" />
            </button>
            <div>
                <h1 className="text-xl font-bold text-gray-900">
                    Launchpad
                </h1>
                <p className="text-sm text-gray-500">Employee Onboarding Assistant</p>
            </div>
            
            {currentView === 'dashboard' && (
                <div className="ml-auto">
                    <button 
                        onClick={() => setShowModal(true)}
                        className="bg-green-900 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center hover:bg-green-800 transition-colors"
                    >
                        <PlusIcon className="w-4 h-4 mr-2" />
                        New Onboarding
                    </button>
                </div>
            )}
        </div>
        
        {currentView === 'dashboard' ? renderDashboard() : renderDetail()}

        {/* Create Onboarding Modal */}
        {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
                <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-fadeInUp">
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-gray-900">Create Onboarding</h3>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                                <XIcon className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Employee Name *</label>
                                <input 
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-shadow" 
                                    value={formData.employeeName}
                                    onChange={e => setFormData({...formData, employeeName: e.target.value})}
                                    placeholder="Jane Smith"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Position *</label>
                                <input 
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-shadow" 
                                    value={formData.position}
                                    onChange={e => setFormData({...formData, position: e.target.value})}
                                    placeholder="Senior Developer"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID (Optional)</label>
                                <input 
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-shadow" 
                                    value={formData.employeeId}
                                    onChange={e => setFormData({...formData, employeeId: e.target.value})}
                                    placeholder="Auto-generated if not provided"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                                <div className="relative">
                                    <input 
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-shadow pr-10" 
                                        value={formData.startDate}
                                        onChange={e => setFormData({...formData, startDate: e.target.value})}
                                    />
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                        <CalendarIcon className="h-4 w-4 text-gray-900" />
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 pt-4">
                                <button 
                                    onClick={handleCreateOnboarding}
                                    disabled={!formData.employeeName || !formData.position}
                                    className="w-full bg-green-900 text-white font-medium py-3 rounded-lg hover:bg-green-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Create Onboarding
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};