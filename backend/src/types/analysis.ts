import { z } from 'zod';

export const analysisRequestSchema = z.object({
  message: z.string().min(1, 'Error message is required'),
});

export type AnalysisRequest = z.infer<typeof analysisRequestSchema>;

export interface FrameworkAnalysis {
  whatHappened: boolean;
  providesReassurance: boolean;
  whyHappened: boolean;
  howToFix: boolean;
  wayOut: boolean;
}

export interface AnalysisResponse {
  score: number;
  passed: boolean;
  frameworkAnalysis: FrameworkAnalysis;
  critique: string[];
  rewrittenMessage: {
    title: string;
    body: string;
  };
  rationale: string;
}
