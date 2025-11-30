import React, { useState } from 'react';
import { BriefcaseIcon, MessageIcon, UsersIcon, RocketIcon } from './components/Icons';
import { ResumeScreeningView } from './components/ResumeScreeningView';
import { AskHRView } from './components/AskHRView';
import { InterviewView } from './components/InterviewView';
import { OnboardingView } from './components/OnboardingView';

type ViewState = 'dashboard' | 'screening' | 'askhr' | 'interview' | 'onboarding';

function App() {
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');

  const renderContent = () => {
    switch (currentView) {
      case 'screening':
        return <ResumeScreeningView onBack={() => setCurrentView('dashboard')} />;
      case 'askhr':
        return <AskHRView onBack={() => setCurrentView('dashboard')} />;
      case 'interview':
        return <InterviewView onBack={() => setCurrentView('dashboard')} />;
      case 'onboarding':
        return <OnboardingView onBack={() => setCurrentView('dashboard')} />;
      default:
        return (
          <div className="max-w-6xl mx-auto animate-fadeInUp pb-12">
            <div className="text-center mb-16 pt-8">
              <h1 className="text-5xl font-bold text-gray-900 mb-4 tracking-tight">
                Welcome to Your <span className="text-green-800">HR Command Center</span>
              </h1>
              <p className="text-xl text-gray-500">Four powerful AI agents working together to streamline your HR operations</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4 mb-16">
              
              {/* Card 1: AskHR */}
              <button 
                onClick={() => setCurrentView('askhr')}
                className="group bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl border border-gray-200 hover:border-green-200 transition-all duration-300 text-left relative overflow-hidden"
              >
                <div className="flex items-start justify-between mb-6">
                   <div className="p-3 bg-green-100 rounded-xl text-green-600 group-hover:scale-110 transition-transform duration-300">
                      <MessageIcon className="w-8 h-8" />
                   </div>
                   <div className="bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                     Launch Module
                   </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">AskHR AI</h3>
                <p className="text-gray-500 leading-relaxed mb-4">
                  Get instant answers to employee questions about policies, benefits, and HR procedures.
                </p>
                <div className="w-full bg-gray-100 h-1 rounded-full overflow-hidden">
                  <div className="bg-green-500 h-full w-0 group-hover:w-full transition-all duration-500 ease-out"></div>
                </div>
              </button>

              {/* Card 2: Talent Scout */}
              <button 
                onClick={() => setCurrentView('screening')}
                className="group bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl border border-gray-200 hover:border-yellow-200 transition-all duration-300 text-left relative overflow-hidden"
              >
                <div className="flex items-start justify-between mb-6">
                   <div className="p-3 bg-yellow-100 rounded-xl text-yellow-600 group-hover:scale-110 transition-transform duration-300">
                      <BriefcaseIcon className="w-8 h-8" />
                   </div>
                   <div className="bg-yellow-600 text-white text-xs font-bold px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                     Launch Module
                   </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Talent Scout</h3>
                <p className="text-gray-500 leading-relaxed mb-4">
                  AI-powered candidate screening with intelligent resume analysis and match scoring.
                </p>
                <div className="w-full bg-gray-100 h-1 rounded-full overflow-hidden">
                  <div className="bg-yellow-500 h-full w-0 group-hover:w-full transition-all duration-500 ease-out"></div>
                </div>
              </button>

              {/* Card 3: Interview Pilot */}
              <button 
                onClick={() => setCurrentView('interview')}
                className="group bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl border border-gray-200 hover:border-blue-200 transition-all duration-300 text-left relative overflow-hidden"
              >
                <div className="flex items-start justify-between mb-6">
                   <div className="p-3 bg-blue-100 rounded-xl text-blue-600 group-hover:scale-110 transition-transform duration-300">
                      <UsersIcon className="w-8 h-8" />
                   </div>
                   <div className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                     Launch Module
                   </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Interview Pilot</h3>
                <p className="text-gray-500 leading-relaxed mb-4">
                  Conduct AI-driven interviews with automated question generation and evaluation.
                </p>
                <div className="w-full bg-gray-100 h-1 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full w-0 group-hover:w-full transition-all duration-500 ease-out"></div>
                </div>
              </button>

               {/* Card 4: Launchpad */}
               <button 
                onClick={() => setCurrentView('onboarding')}
                className="group bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl border border-gray-200 hover:border-purple-200 transition-all duration-300 text-left relative overflow-hidden"
              >
                <div className="flex items-start justify-between mb-6">
                   <div className="p-3 bg-purple-100 rounded-xl text-purple-600 group-hover:scale-110 transition-transform duration-300">
                      <RocketIcon className="w-8 h-8" />
                   </div>
                   <div className="bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                     Launch Module
                   </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Launchpad</h3>
                <p className="text-gray-500 leading-relaxed mb-4">
                  Streamline new hire onboarding with guided checklists and progress tracking.
                </p>
                <div className="w-full bg-gray-100 h-1 rounded-full overflow-hidden">
                  <div className="bg-purple-500 h-full w-0 group-hover:w-full transition-all duration-500 ease-out"></div>
                </div>
              </button>

            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-4">
              <div className="bg-white p-6 rounded-xl border border-gray-200 text-center">
                 <div className="text-3xl font-light text-green-700 mb-1">248</div>
                 <div className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Active Employees</div>
              </div>
              <div className="bg-white p-6 rounded-xl border border-gray-200 text-center">
                 <div className="text-3xl font-light text-green-700 mb-1">156</div>
                 <div className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Candidates Screened</div>
              </div>
              <div className="bg-white p-6 rounded-xl border border-gray-200 text-center">
                 <div className="text-3xl font-light text-green-700 mb-1">89</div>
                 <div className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Interviews Conducted</div>
              </div>
              <div className="bg-white p-6 rounded-xl border border-gray-200 text-center">
                 <div className="text-3xl font-light text-green-700 mb-1">12</div>
                 <div className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Onboarding In Progress</div>
              </div>
            </div>
            
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Global Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setCurrentView('dashboard')}>
            <h1 className="text-xl font-bold text-green-900">
              BuddyBot
            </h1>
            <span className="hidden md:inline-block text-gray-300">|</span>
            <span className="hidden md:inline-block text-gray-400 text-xs uppercase tracking-wide">Intelligent HR Workflow System</span>
          </div>
          <div className="flex items-center space-x-4">
             <div className="h-8 w-8 bg-green-800 rounded-md flex items-center justify-center text-white font-bold text-xs shadow-sm">
                HR
             </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
         {renderContent()}
      </main>
    </div>
  );
}

export default App;