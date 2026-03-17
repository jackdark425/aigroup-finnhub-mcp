import { z } from 'zod';

// ESG Score
export const ESGScoreSchema = z.object({
  symbol: z.string(),
  totalEsg: z.number(),
  environmentScore: z.number(),
  socialScore: z.number(),
  governanceScore: z.number(),
  controversyLevel: z.number(),
  highestControversy: z.string().optional(),
  peerGroup: z.string().optional(),
  peerCount: z.number(),
  percentile: z.number().optional(),
  lastUpdate: z.string().optional(),
});

export type ESGScore = z.infer<typeof ESGScoreSchema>;

// Social Sentiment
export const SocialSentimentSchema = z.object({
  symbol: z.string(),
  atTime: z.string(),
  mention: z.number(),
  positiveScore: z.number(),
  negativeScore: z.number(),
  positiveMention: z.number(),
  negativeMention: z.number(),
  score: z.number(),
});

export type SocialSentiment = z.infer<typeof SocialSentimentSchema>;

// Supply Chain
export const SupplyChainNodeSchema = z.object({
  symbol: z.string(),
  name: z.string(),
  relationship: z.enum(['customer', 'supplier', 'partner']),
  strength: z.number().optional(),
});

export const SupplyChainSchema = z.object({
  symbol: z.string(),
  data: z.array(SupplyChainNodeSchema),
});

export type SupplyChain = z.infer<typeof SupplyChainSchema>;

// Patent
export const PatentSchema = z.object({
  symbol: z.string(),
  patentNumber: z.string(),
  title: z.string(),
  abstract: z.string(),
  filingDate: z.string(),
  grantDate: z.string(),
  assignee: z.string(),
  category: z.string().optional(),
});

export type Patent = z.infer<typeof PatentSchema>;
