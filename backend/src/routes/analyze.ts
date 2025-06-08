import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { analysisRequestSchema, AnalysisResponse } from '../types/analysis';
import { llmService } from '../lib/llm-service';

const analyzeRouter = new Hono();

analyzeRouter.post(
  '/',
  zValidator('json', analysisRequestSchema),
  async (c) => {
    const { message } = c.req.valid('json');
    
    try {
      const result = await llmService.analyzeErrorMessage(message);
      return c.json(result);
    } catch (error) {
      console.error('Error analyzing message:', error);
      return c.json(
        { error: 'Failed to analyze error message' },
        { status: 500 }
      );
    }
  }
);

export { analyzeRouter };
