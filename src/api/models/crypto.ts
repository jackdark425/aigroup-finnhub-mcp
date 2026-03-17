import { z } from 'zod';

// Crypto Exchange
export const CryptoExchangeSchema = z.object({
  name: z.string(),
});

export type CryptoExchange = z.infer<typeof CryptoExchangeSchema>;

// Crypto Symbol
export const CryptoSymbolSchema = z.object({
  description: z.string(),
  displaySymbol: z.string(),
  symbol: z.string(),
});

export type CryptoSymbol = z.infer<typeof CryptoSymbolSchema>;

// Crypto Quote (uses common Quote schema)
export { QuoteSchema as CryptoQuoteSchema, type Quote as CryptoQuote } from './common.js';

// Crypto Candle (uses common Candle schema)
export { CandleSchema as CryptoCandleSchema, type Candle as CryptoCandle } from './common.js';
