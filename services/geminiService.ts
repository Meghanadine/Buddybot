import { GoogleGenAI, Type, Schema } from "@google/genai";
import { CandidateAnalysis, ModelType } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    candidateName: { type: Type.STRING, description: "Full name of the candidate extracted from the resume" },
    matchScore: { type: Type.INTEGER, description: "A score from 0 to 100 indicating fit for the job" },
    summary: { type: Type.STRING, description: "A brief executive summary of the candidate's profile" },
    keySkillsMatched: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of skills from the JD that the candidate possesses" },
    missingSkills: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of skills from the JD that are missing" },
    redFlags: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Potential concerns like employment gaps, short tenure, etc." },
    experienceYears: { type: Type.NUMBER, description: "Total years of relevant experience" },
    educationLevel: { type: Type.STRING, description: "Highest degree obtained" },
    recommendation: { type: Type.STRING, enum: ["Strong Hire", "Potential", "No Fit"] }
  },
  required: ["candidateName", "matchScore", "summary", "keySkillsMatched", "missingSkills", "recommendation"]
};

export const analyzeResume = async (file: File, jobDescription: string, modelType: ModelType): Promise<CandidateAnalysis> => {
  let contentParts: any[] = [];

  // Optimization: If it's a text file (e.g. from the manual entry modal), read as text and send as a text part
  // This avoids overhead and potential errors with inlineData for simple text content
  if (file.type === 'text/plain') {
    const textContent = await file.text();
    contentParts.push({
      text: `RESUME TEXT CONTENT:\n${textContent}`
    });
  } else {
    // For PDFs or images, use inlineData (Base64)
    const fileToGenerativePart = async (file: File) => {
      const base64EncodedDataPromise = new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const result = reader.result as string;
            // Robustly handle the data URL prefix
            const base64 = result.includes(',') ? result.split(',')[1] : result;
            resolve(base64);
        };
        reader.readAsDataURL(file);
      });
      return {
        inlineData: { data: await base64EncodedDataPromise, mimeType: file.type || 'application/pdf' },
      };
    };
    contentParts.push(await fileToGenerativePart(file));
  }

  let systemPrompt = "You are a helpful HR assistant.";
  if (modelType === 'gpt4') systemPrompt = "You are an analytical and precise HR Data Scientist. Be strict with scoring.";
  else if (modelType === 'claude') systemPrompt = "You are a nuanced HR Manager. Look for potential and soft skills. Be detailed.";
  else if (modelType === 'llama') systemPrompt = "You are an efficient screening algorithm. Focus on keyword density and hard requirements.";

  contentParts.push({ 
    text: `System Persona: ${systemPrompt}. \n\nAnalyze this resume against the following Job Description:\n${jobDescription}` 
  });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: contentParts
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
      }
    });

    let text = response.text || "{}";
    // Sanitize if markdown code blocks exist
    if (text.startsWith("```json")) {
        text = text.replace(/^```json\n/, "").replace(/\n```$/, "");
    } else if (text.startsWith("```")) {
        text = text.replace(/^```\n/, "").replace(/\n```$/, "");
    }

    return JSON.parse(text);
  } catch (error) {
    console.error("Error analyzing resume:", error);
    return {
      id: crypto.randomUUID(),
      candidateName: "Error Parsing",
      matchScore: 0,
      summary: "Failed to analyze resume. The API returned an error. Please try again or check the console.",
      keySkillsMatched: [],
      missingSkills: [],
      redFlags: [],
      experienceYears: 0,
      educationLevel: "Unknown",
      recommendation: "No Fit"
    };
  }
};

export const askHRPolicy = async (question: string, history: {role: string, content: string}[]) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        { role: 'user', parts: [{ text: "System: You are AskHR AI. Answer questions about generic tech company policies (PTO, Benefits, Remote Work) professionally." }] },
        ...history.map(msg => ({ role: msg.role === 'user' ? 'user' : 'model', parts: [{ text: msg.content }] })),
        { role: 'user', parts: [{ text: question }] }
      ]
    });
    return response.text;
  } catch (e) {
    return "I'm having trouble connecting to the policy database right now.";
  }
};

export const generateInterviewQuestions = async (role: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [{ text: `Generate 5 challenging technical and behavioral interview questions for a ${role} position. Return ONLY a JSON object with a property 'questions' which is an array of strings.` }]
      },
      config: { responseMimeType: "application/json" }
    });
    return JSON.parse(response.text || "{ \"questions\": [] }").questions;
  } catch (e) {
    return ["Tell me about yourself.", "What are your strengths?"];
  }
};

export const generateOnboardingPlan = async (name: string, role: string, department: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [{ text: `Create a 5-item onboarding checklist for ${name}, a new ${role} in ${department}. Return JSON: { "tasks": [{ "title": string, "description": string }] }` }]
      },
      config: { responseMimeType: "application/json" }
    });
    return JSON.parse(response.text || "{ \"tasks\": [] }").tasks;
  } catch (e) {
    return [];
  }
};