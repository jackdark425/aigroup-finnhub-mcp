import { z } from 'zod';

// Forex Exchange
export const ForexExchangeSchema = z.object({
  code: z.string(),
  name: z.string(),
});

export type ForexExchange = z.infer<typeof ForexExchangeSchema>;

// Forex Symbol
export const ForexSymbolSchema = z.object({
  description: z.string(),
  displaySymbol: z.string(),
  symbol: z.string(),
});

export type ForexSymbol = z.infer<typeof ForexSymbolSchema>;

// Forex Rate
export const ForexRateSchema = z.object({
  base: z.string(),
  quote: z.string(),
  bid: z.number(),
  ask: z.number(),
  mid: z.number(),
  timestamp: z.number(),
});

export type ForexRate = z.infer<typeof ForexRateSchema>;

// Forex Candle (uses common Candle schema)
export { CandleSchema as ForexCandleSchema, type Candle as ForexCandle } from './common.js';
