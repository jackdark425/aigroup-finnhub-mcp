import { getFinnhubClient } from '../client.js';
import type { MarketHoliday, AnalystRating, MergerAcquisition } from '../models/index.js';

const client = getFinnhubClient();

export async function getMarketHolidays(exchange: string): Promise<MarketHoliday[]> {
  return client.get<MarketHoliday[]>('/stock/market-holiday', { exchange });
}

export async function getAnalystRatings(symbol: string): Promise<AnalystRating[]> {
  return client.get<AnalystRating[]>('/stock/analyst-ratings', {
    symbol: symbol.toUpperCase(),
  });
}

export async function getMergerAcquisitions(): Promise<MergerAcquisition[]> {
  return client.get<MergerAcquisition[]>('/merger/acquisition');
}
