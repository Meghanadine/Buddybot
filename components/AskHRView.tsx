import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeftIcon, MessageIcon, SendIcon, LoaderIcon } from './Icons';
import { askHRPolicy } from '../services/geminiService';

interface AskHRViewProps {
  onBack: () => void;
}

interface Message {
  role: 'user' | 'ai';
  content: string;
}

export const AskHRView: React.FC<AskHRViewProps> = ({ onBack }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const suggestions = [
    "What is the leave policy?",
    "How do I apply for remote work?",
    "What are the health benefits?",
    "How does the performance review process work?"
  ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;
    
    setMessages(prev => [...prev, { role: 'user', content: text }]);
    setInput('');
    setIsLoading(true);

    const answer = await askHRPolicy(text, messages.map(m => ({ role: m.role, content: m.content })));
    
    setMessages(prev => [...prev, { role: 'ai', content: answer }]);
    setIsLoading(false);
  };

  return (
    <div className="animate-fadeInUp h-[calc(100vh-140px)] flex flex-col max-w-5xl mx-auto">
       <div className="flex items-center mb-6 flex-shrink-0">
        <button onClick={onBack} className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-green-600">
            <ArrowLeftIcon className="w-6 h-6" />
        </button>
        <div>
            <h1 className="text-xl font-bold text-green-900">
                AskHR AI
            </h1>
            <p className="text-sm text-gray-500">Your HR Assistant</p>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col relative">
        <div className="flex-1 overflow-y-auto p-6" ref={scrollRef}>
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8">
                 <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-fadeIn">
                    <div className="w-8 h-8 text-green-600">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M8 14C8 14 9.5 16 12 16C14.5 16 16 14 16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M9 9H9.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M15 9H15.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                 </div>
                 <h2 className="text-2xl font-medium text-green-900 mb-2">How can I help you today?</h2>
                 <p className="text-gray-500 mb-8 max-w-md">Ask me anything about company policies, benefits, or HR procedures.</p>
                 
                 <div className="flex flex-wrap justify-center gap-3 max-w-2xl">
                    {suggestions.map((suggestion, idx) => (
                      <button 
                        key={idx}
                        onClick={() => handleSend(suggestion)}
                        className="bg-gray-50 hover:bg-green-50 text-gray-700 hover:text-green-700 px-4 py-2 rounded-full text-sm border border-gray-200 hover:border-green-200 transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                 </div>
              </div>
            ) : (
              <div className="space-y-6">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}>
                        <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${
                            msg.role === 'user' 
                            ? 'bg-gray-100 text-gray-900 rounded-br-sm' 
                            : 'bg-green-50 text-green-900 border border-green-100 rounded-bl-sm'
                        }`}>
                            {msg.content}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-white p-4 rounded-2xl rounded-bl-none flex items-center border border-gray-100 shadow-sm">
                            <LoaderIcon className="w-4 h-4 animate-spin text-green-600 mr-2" />
                            <span className="text-gray-400 text-xs font-medium">Processing...</span>
                        </div>
                    </div>
                )}
              </div>
            )}
        </div>
        
        <div className="p-4 bg-white border-t border-gray-100">
            <div className="relative">
                <input 
                    type="text" 
                    className="w-full border border-gray-200 rounded-full pl-6 pr-12 py-4 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent shadow-sm text-gray-700 placeholder-gray-400"
                    placeholder="Ask a question..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
                />
                <button 
                    onClick={() => handleSend(input)}
                    disabled={isLoading || !input.trim()}
                    className="absolute right-2 top-2 p-2 bg-green-700 text-white rounded-full hover:bg-green-800 disabled:opacity-50 disabled:bg-gray-300 transition-colors"
                >
                    <SendIcon className="w-4 h-4" />
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};