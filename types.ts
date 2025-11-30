export interface CandidateAnalysis {
  id: string;
  candidateName: string;
  matchScore: number;
  summary: string;
  keySkillsMatched: string[];
  missingSkills: string[];
  redFlags: string[];
  experienceYears: number;
  educationLevel: string;
  recommendation: 'Strong Hire' | 'Potential' | 'No Fit';
}

export interface UploadedFile {
  id: string;
  file: File;
  previewUrl?: string;
  status: 'pending' | 'analyzing' | 'completed' | 'error';
  analysis?: CandidateAnalysis;
}

export enum AnalysisStatus {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}

export type ModelType = 'gemini' | 'gpt4' | 'claude' | 'llama';

export const MODELS: { id: ModelType; name: string; description: string }[] = [
  { id: 'gemini', name: 'Gemini 2.5 Flash', description: 'Fastest, Google Native' },
  { id: 'gpt4', name: 'GPT-4o', description: 'Analytical & Precise' },
  { id: 'claude', name: 'Claude 3.5 Sonnet', description: 'Nuanced & Detailed' },
  { id: 'llama', name: 'Llama 3 70B', description: 'Open Source Powerhouse' },
];