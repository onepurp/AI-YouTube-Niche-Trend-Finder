
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { GeminiApiResponse } from '../types';
import { GEMINI_MODEL_NAME, SystemInstruction } from '../constants';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // This error should ideally be handled more gracefully in a real app,
  // perhaps by disabling functionality or showing a message to the user.
  console.error("Gemini API_KEY environment variable not set.");
  // throw new Error("API_KEY environment variable not set. Please set it in your environment.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! }); // Non-null assertion, assuming API_KEY will be set in deployment

export const fetchTrendAnalysisFromGemini = async (niche: string): Promise<GeminiApiResponse> => {
  if (!API_KEY) {
    return Promise.reject(new Error("Gemini API Key is not configured. Please set the API_KEY environment variable."));
  }
  try {
    const userPrompt = `Niche: ${niche}`;
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_MODEL_NAME,
      contents: userPrompt,
      config: {
        systemInstruction: SystemInstruction,
        responseMimeType: "application/json",
      }
    });

    let jsonStr = response.text.trim();
    
    const fenceRegex = /^```(?:json)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[1]) {
      jsonStr = match[1].trim();
    }

    const parsedData = JSON.parse(jsonStr) as GeminiApiResponse;

    if (!parsedData.trendAnalysis || !Array.isArray(parsedData.suggestedSearchQueries) || parsedData.suggestedSearchQueries.length === 0) {
      console.error("Invalid response structure from AI:", parsedData);
      throw new Error("AI response is missing crucial data (trendAnalysis or suggestedSearchQueries).");
    }
     if (parsedData.suggestedSearchQueries.some(query => typeof query !== 'string')) {
      console.error("Invalid search query format from AI:", parsedData.suggestedSearchQueries);
      throw new Error("AI provided search queries in an invalid format.");
    }


    return parsedData;

  } catch (error) {
    console.error("Error fetching trend analysis from Gemini API:", error);
    if (error instanceof SyntaxError) {
         throw new Error("Failed to parse AI response. The AI may have returned invalid JSON.");
    }
    if (error instanceof Error) {
        throw new Error(`Failed to get trend analysis from AI: ${error.message}`);
    }
    throw new Error("Failed to get trend analysis due to an unknown AI error.");
  }
};
