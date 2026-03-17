import { z } from 'zod';

// SEC Filing
export const SECFilingSchema = z.object({
  symbol: z.string(),
  cik: z.string(),
  accessNumber: z.string(),
  form: z.string(),
  fileNumber: z.string().optional(),
  acceptanceDateTime: z.string(),
  act: z.string().optional(),
  items: z.array(z.string()).optional(),
  size: z.number(),
  completeTextUrl: z.string(),
  filingUrl: z.string(),
});

export type SECFiling = z.infer<typeof SECFilingSchema>;

// Filing Sentiment
export const FilingSentimentSchema = z.object({
  symbol: z.string(),
  cik: z.string().optional(),
  accessNumber: z.string(),
  filingDate: z.string(),
  sentiment: z.number(),
  wordCount: z.number(),
  positiveWords: z.number(),
  negativeWords: z.number(),
});

export type FilingSentiment = z.infer<typeof FilingSentimentSchema>;

// Similarity Index
export const SimilarityIndexSchema = z.object({
  symbol: z.string(),
  cik: z.string(),
  item1: z.string(),
  item2: z.string(),
  simScore: z.number(),
  year1: z.number(),
  year2: z.number(),
  quarter1: z.number(),
  quarter2: z.number(),
});

export type SimilarityIndex = z.infer<typeof SimilarityIndexSchema>;
