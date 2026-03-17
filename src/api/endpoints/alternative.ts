import { getFinnhubClient } from '../client.js';
import type { ESGScore, SocialSentiment, SupplyChain, Patent } from '../models/index.js';

const client = getFinnhubClient();

export async function getESGScore(symbol: string): Promise<ESGScore> {
  return client.get<ESGScore>('/stock/esg', { symbol: symbol.toUpperCase() });
}

export async function getSocialSentiment(
  symbol: string,
  from?: string,
  to?: string
): Promise<SocialSentiment[]> {
  const params: Record<string, string> = {
    symbol: symbol.toUpperCase(),
  };
  if (from) params.from = from;
  if (to) params.to = to;
  return client.get<SocialSentiment[]>('/stock/social-sentiment', params);
}

export async function getSupplyChain(symbol: string): Promise<SupplyChain> {
  return client.get<SupplyChain>('/stock/supply-chain', { symbol: symbol.toUpperCase() });
}

export async function getPatents(symbol: string): Promise<Patent[]> {
  return client.get<Patent[]>('/stock/patents', { symbol: symbol.toUpperCase() });
}
