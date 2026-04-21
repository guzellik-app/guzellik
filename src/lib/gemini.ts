import { GoogleGenAI } from "@google/genai";

// Initialize Gemini with process.env.GEMINI_API_KEY
// AI Studio manages this key in the user's environment.
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn("GEMINI_API_KEY is not defined. AI translations will be unavailable.");
}

export const ai = new GoogleGenAI({ apiKey: apiKey || "" });
