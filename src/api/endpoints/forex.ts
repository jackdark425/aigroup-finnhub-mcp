import { getFinnhubClient } from '../client.js';
import type { ForexExchange, ForexSymbol, ForexRate, Candle } from '../models/index.js';

const client = getFinnhubClient();

export async function getForexExchanges(): Promise<ForexExchange[]> {
  return client.get<ForexExchange[]>('/forex/exchange');
}

export async function getForexSymbols(exchange: string): Promise<ForexSymbol[]> {
  return client.get<ForexSymbol[]>('/forex/symbol', { exchange });
}

export async function getForexRate(from: string, to: string): Promise<ForexRate> {
  return client.get<ForexRate>('/forex/rate', {
    base: from.toUpperCase(),
    quote: to.toUpperCase(),
  });
}

export async function getForexCandles(
  symbol: string,
  resolution: string,
  from: number,
  to: number
): Promise<Candle> {
  return client.get<Candle>('/forex/candle', {
    symbol: symbol.toUpperCase(),
    resolution,
    from,
    to,
  });
}
