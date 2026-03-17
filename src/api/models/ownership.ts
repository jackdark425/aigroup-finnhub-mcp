import { z } from 'zod';

// Insider Transaction
export const InsiderTransactionSchema = z.object({
  symbol: z.string(),
  name: z.string(),
  share: z.number(),
  change: z.number(),
  filingDate: z.string(),
  transactionDate: z.string(),
  transactionCode: z.string(),
  transactionPrice: z.number(),
  id: z.string(),
});

export type InsiderTransaction = z.infer<typeof InsiderTransactionSchema>;

// Institutional Ownership
export const InstitutionalOwnershipSchema = z.object({
  symbol: z.string(),
  cik: z.string(),
  data: z.array(z.object({
    name: z.string(),
    totalShares: z.number(),
    newPositions: z.number(),
    increasedPositions: z.number(),
    decreasedPositions: z.number(),
    soldOutPositions: z.number(),
    date: z.string(),
  })),
});

export type InstitutionalOwnership = z.infer<typeof InstitutionalOwnershipSchema>;

// Institutional Portfolio
export const InstitutionalPortfolioSchema = z.object({
  name: z.string(),
  cik: z.string(),
  data: z.array(z.object({
    symbol: z.string(),
    totalShares: z.number(),
    newPositions: z.number(),
    increasedPositions: z.number(),
    decreasedPositions: z.number(),
    soldOutPositions: z.number(),
    date: z.string(),
  })),
});

export type InstitutionalPortfolio = z.infer<typeof InstitutionalPortfolioSchema>;

// Congress Trading
export const CongressTransactionSchema = z.object({
  symbol: z.string(),
  representative: z.string(),
  bioGuideId: z.string(),
  chamber: z.string(),
  state: z.string(),
  district: z.string(),
  transactionDate: z.string(),
  disclosureDate: z.string(),
  owner: z.string(),
  ticker: z.string(),
  assetDescription: z.string(),
  type: z.string(),
  amount: z.string(),
  comment: z.string(),
});

export type CongressTransaction = z.infer<typeof CongressTransactionSchema>;
