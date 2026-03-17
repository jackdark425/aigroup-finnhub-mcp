import { getFinnhubClient } from '../client.js';
import type { CryptoExchange, CryptoSymbol, Candle } from '../models/index.js';

const client = getFinnhubClient();

export async function getCryptoExchanges(): Promise<CryptoExchange[]> {
  return client.get<CryptoExchange[]>('/crypto/exchange');
}

export async function getCryptoSymbols(exchange: string): Promise<CryptoSymbol[]> {
  return client.get<CryptoSymbol[]>('/crypto/symbol', { exchange });
}

export async function getCryptoQuote(symbol: string): Promise<unknown> {
  return client.get('/quote', { symbol: symbol.toUpperCase() });
}

export async function getCryptoCandles(
  symbol: string,
  resolution: string,
  from: number,
  to: number
): Promise<Candle> {
  return client.get<Candle>('/crypto/candle', {
    symbol: symbol.toUpperCase(),
    resolution,
    from,
    to,
  });
}
