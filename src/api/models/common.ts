import { z } from 'zod';

// Quote Response
export const QuoteSchema = z.object({
  c: z.number(), // Current price
  d: z.number(), // Change
  dp: z.number(), // Percent change
  h: z.number(), // High
  l: z.number(), // Low
  o: z.number(), // Open
  pc: z.number(), // Previous close
  t: z.number(), // Timestamp
});

export type Quote = z.infer<typeof QuoteSchema>;

// Candle Response
export const CandleSchema = z.object({
  c: z.array(z.number()), // Close prices
  h: z.array(z.number()), // High prices
  l: z.array(z.number()), // Low prices
  o: z.array(z.number()), // Open prices
  t: z.array(z.number()), // Timestamps
  v: z.array(z.number()), // Volumes
  s: z.enum(['ok', 'no_data']), // Status
});

export type Candle = z.infer<typeof CandleSchema>;

// Company Profile
export const CompanyProfileSchema = z.object({
  country: z.string().optional(),
  currency: z.string().optional(),
  exchange: z.string().optional(),
  ipo: z.string().optional(),
  marketCapitalization: z.number().optional(),
  name: z.string().optional(),
  ticker: z.string(),
  weburl: z.string().optional(),
  finnhubIndustry: z.string().optional(),
  phone: z.string().optional(),
  logo: z.string().optional(),
});

export type CompanyProfile = z.infer<typeof CompanyProfileSchema>;

// Market Status
export const MarketStatusSchema = z.object({
  exchange: z.string(),
  holiday: z.string().nullable(),
  isOpen: z.boolean(),
  session: z.string().nullable(),
  t: z.number(),
  utcOffset: z.string(),
});

export type MarketStatus = z.infer<typeof MarketStatusSchema>;

// Symbol Lookup Result
export const SymbolResultSchema = z.object({
  count: z.number(),
  result: z.array(z.object({
    description: z.string(),
    displaySymbol: z.string(),
    symbol: z.string(),
    type: z.string(),
  })),
});

export type SymbolResult = z.infer<typeof SymbolResultSchema>;

// Exchange
export const ExchangeSchema = z.object({
  code: z.string(),
  currency: z.string(),
  name: z.string(),
});

export type Exchange = z.infer<typeof ExchangeSchema>;
