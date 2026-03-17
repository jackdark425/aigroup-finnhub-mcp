import { getFinnhubClient } from '../client.js';
import type { SECFiling, FilingSentiment, SimilarityIndex } from '../models/index.js';

const client = getFinnhubClient();

export async function getSECFilings(
  symbol: string,
  form?: string,
  from?: string,
  to?: string
): Promise<SECFiling[]> {
  const params: Record<string, string> = {
    symbol: symbol.toUpperCase(),
  };
  if (form) params.form = form;
  if (from) params.from = from;
  if (to) params.to = to;
  return client.get<SECFiling[]>('/stock/filings', params);
}

export async function getFilingSentiment(symbol: string): Promise<FilingSentiment[]> {
  return client.get<FilingSentiment[]>('/stock/filing-sentiment', {
    symbol: symbol.toUpperCase(),
  });
}

export async function getSimilarityIndex(symbol: string): Promise<SimilarityIndex[]> {
  return client.get<SimilarityIndex[]>('/stock/similarity-index', {
    symbol: symbol.toUpperCase(),
  });
}
