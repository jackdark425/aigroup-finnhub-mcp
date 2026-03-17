import { z } from 'zod';

// Earnings Estimate
export const EarningsEstimateSchema = z.object({
  symbol: z.string(),
  data: z.array(z.object({
    period: z.string(),
    numberOfAnalysts: z.number(),
    high: z.number(),
    low: z.number(),
    mean: z.number(),
    median: z.number(),
  })),
});

export type EarningsEstimate = z.infer<typeof EarningsEstimateSchema>;

// Revenue Estimate
export const RevenueEstimateSchema = z.object({
  symbol: z.string(),
  data: z.array(z.object({
    period: z.string(),
    numberOfAnalysts: z.number(),
    high: z.number(),
    low: z.number(),
    mean: z.number(),
    median: z.number(),
    currency: z.string(),
  })),
});

export type RevenueEstimate = z.infer<typeof RevenueEstimateSchema>;

// EBITDA Estimate
export const EbitdaEstimateSchema = z.object({
  symbol: z.string(),
  data: z.array(z.object({
    period: z.string(),
    numberOfAnalysts: z.number(),
    high: z.number(),
    low: z.number(),
    mean: z.number(),
    median: z.number(),
  })),
});

export type EbitdaEstimate = z.infer<typeof EbitdaEstimateSchema>;

// Price Target
export const PriceTargetSchema = z.object({
  symbol: z.string(),
  targetHigh: z.number(),
  targetLow: z.number(),
  targetMean: z.number(),
  targetMedian: z.number(),
  numberOfAnalysts: z.number(),
  currency: z.string(),
  lastUpdated: z.string(),
});

export type PriceTarget = z.infer<typeof PriceTargetSchema>;

// Recommendation Trends
export const RecommendationSchema = z.object({
  buy: z.number(),
  hold: z.number(),
  period: z.string(),
  sell: z.number(),
  strongBuy: z.number(),
  strongSell: z.number(),
  symbol: z.string(),
});

export type Recommendation = z.infer<typeof RecommendationSchema>;
