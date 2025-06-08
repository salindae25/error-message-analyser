import { generateText } from "ai";
import { AnalysisResponse } from "../types/analysis";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

// Helper function to parse the LLM response
function parseAnalysisResponse(text: string): AnalysisResponse {
  try {
    // Try to parse the response as JSON first
    const jsonStart = text.indexOf('{');
    const jsonEnd = text.lastIndexOf('}') + 1;
    const jsonString = text.slice(jsonStart, jsonEnd);
    const response = JSON.parse(jsonString);

    // Map the response to our expected format
    return {
      score: response.overallScore || 0,
      passed: (response.overallScore || 0) >= 0.7,
      frameworkAnalysis: {
        whatHappened: response.frameworkAnalysis?.saidWhatHappened || false,
        providesReassurance: response.frameworkAnalysis?.providedReassurance || false,
        whyHappened: response.frameworkAnalysis?.saidWhyItHappened || false,
        howToFix: response.frameworkAnalysis?.helpedFixIt || false,
        wayOut: response.frameworkAnalysis?.gaveWayOut || false,
      },
      critique: Array.isArray(response.critiqueAndSuggestions) 
        ? response.critiqueAndSuggestions 
        : ['No specific critique provided'],
      rewrittenMessage: {
        title: response.rewrittenMessage?.title || '',
        body: response.rewrittenMessage?.body || '',
      },
      rationale: response.rationale || 'No rationale provided',
    };
  } catch (error) {
    console.error('Failed to parse LLM response as JSON:', error);
    
    // Fallback to the old parsing method if JSON parsing fails
    const scoreMatch = text.match(/overallScore[\s:]*([0-9.]+)/i);
    const score = scoreMatch ? parseFloat(scoreMatch[1]) : 0;
    
    return {
      score,
      passed: score >= 0.7,
      frameworkAnalysis: {
        whatHappened: false,
        providesReassurance: false,
        whyHappened: false,
        howToFix: false,
        wayOut: false,
      },
      critique: ['Failed to analyze error message. The response format was unexpected.'],
      rewrittenMessage: {
        title: 'Error Analysis Failed',
        body: 'We encountered an issue analyzing this error message. Please try again.'
      },
      rationale: 'The AI response could not be parsed. Please check the format and try again.'
    };
  }
}
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SYSTEM_PROMPT = fs.readFileSync(path.join(__dirname, 'prompt.txt'), 'utf-8');

class LLMService {
  private model: any;
  private openaiApiKey: string;
  private openaiBaseUrl: string;

  constructor() {
    this.openaiApiKey = process.env.OPENAI_API_KEY || "";
    this.openaiBaseUrl =
      process.env.OPENAI_API_BASE_URL || "https://api.openai.com/v1";

    if (!this.openaiApiKey) {
      throw new Error("OPENAI_API_KEY environment variable is not set");
    }

    // Initialize the model with the OpenAI-compatible endpoint
    this.model = createOpenAICompatible({
      name: "lmstudio",
      baseURL: "http://localhost:1234/v1",
    });
  }

  async analyzeErrorMessage(message: string): Promise<AnalysisResponse> {
    try {
      // Generate the analysis using the AI model
      const { text } = await generateText({
        model: this.model("gpt-3"),
        system: SYSTEM_PROMPT,
        prompt: `Analyze the following error message. Your response must be a valid JSON object following the specified format.\n\nError message to analyze: "${message}"`,
        temperature: 0.2, // Lower temperature for more consistent results
        maxTokens: 2000, // Increased for detailed JSON responses
      });

      console.log("Raw LLM response:", text); // For debugging
      
      // Parse the structured response
      return parseAnalysisResponse(text);
    } catch (error) {
      console.error("Error analyzing message:", error);
      // Fallback response if analysis fails
      return {
        score: 0.5,
        passed: false,
        frameworkAnalysis: {
          whatHappened: false,
          providesReassurance: false,
          whyHappened: false,
          howToFix: false,
          wayOut: false
        },
        critique: ['Failed to analyze error message. Please try again.'],
        rewrittenMessage: {
          title: 'Error Analysis Failed',
          body: 'We were unable to analyze this error message. Please try again or provide a different error message.'
        },
        rationale: 'An error occurred while processing the error message.'
      };
    }
  }

}

export const llmService = new LLMService();
