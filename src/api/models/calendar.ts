import { z } from 'zod';

// IPO Calendar
export const IPOEventSchema = z.object({
  symbol: z.string(),
  name: z.string(),
  date: z.string(),
  exchange: z.string(),
  price: z.string().optional(),
  numberOfShares: z.number().optional(),
  totalSharesValue: z.number().optional(),
  status: z.enum(['filed', 'scheduled', 'withdrawn']),
});

export type IPOEvent = z.infer<typeof IPOEventSchema>;

// Earnings Calendar
export const EarningsEventSchema = z.object({
  symbol: z.string(),
  date: z.string(),
  hour: z.enum(['amc', 'bmo', '']).optional(),
  year: z.number(),
  quarter: z.number(),
  epsEstimate: z.number().optional(),
  epsActual: z.number().optional(),
  revenueEstimate: z.number().optional(),
  revenueActual: z.number().optional(),
});

export type EarningsEvent = z.infer<typeof EarningsEventSchema>;

// Economic Calendar
export const EconomicEventSchema = z.object({
  time: z.string(),
  country: z.string(),
  event: z.string(),
  actual: z.string().optional(),
  previous: z.string().optional(),
  estimate: z.string().optional(),
  impact: z.enum(['low', 'medium', 'high', '']).optional(),
});

export type EconomicEvent = z.infer<typeof EconomicEventSchema>;

// FDA Calendar
export const FDAEventSchema = z.object({
  symbol: z.string(),
  name: z.string(),
  eventType: z.string(),
  date: z.string(),
  status: z.string(),
  outcome: z.string().optional(),
});

export type FDAEvent = z.infer<typeof FDAEventSchema>;
