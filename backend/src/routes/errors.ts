import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { db } from '../db';
import { errorMessages } from '../db/schema';
import { AnalysisResponse } from '../types/analysis';

const errorsRouter = new Hono();

const errorMessageSchema = z.object({
  message: z.string(),
  analysis: z.object({
    score: z.number(),
    passed: z.boolean(),
    frameworkAnalysis: z.object({
      whatHappened: z.boolean(),
      providesReassurance: z.boolean(),
      whyHappened: z.boolean(),
      howToFix: z.boolean(),
      wayOut: z.boolean(),
    }),
    critique: z.array(z.string()),
    rewrittenMessage: z.object({
      title: z.string(),
      body: z.string(),
    }),
    rationale: z.string(),
  }).passthrough(), // Use passthrough to allow extra fields if they exist
});

errorsRouter.post(
  '/',
  zValidator('json', errorMessageSchema, (result, c) => {
    if (!result.success) {
      return c.json({ error: 'Invalid data' }, 400);
    }
  }),
  async (c) => {
    const { message, analysis } = c.req.valid('json');
    try {
      const result = await db.insert(errorMessages).values({ message, analysis: JSON.stringify(analysis) }).returning();
      return c.json({ ...result[0], analysis: JSON.parse(result[0].analysis) }, 201);
    } catch (error) {
      console.error('Error saving error message:', error);
      return c.json({ error: 'Failed to save error message' }, 500);
    }
  }
);

errorsRouter.get('/', async (c) => {
  try {
    const allErrorMessages = await db.select().from(errorMessages);
    const parsedMessages = allErrorMessages.map(item => ({ ...item, analysis: JSON.parse(item.analysis) }));
    return c.json(parsedMessages);
  } catch (error) {
    console.error('Error fetching error messages:', error);
    return c.json({ error: 'Failed to fetch error messages' }, 500);
  }
});

export { errorsRouter }; 