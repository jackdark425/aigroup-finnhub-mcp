import { getFinnhubClient } from '../client.js';
import type { 
  EarningsEstimate, 
  RevenueEstimate, 
  EbitdaEstimate,
  PriceTarget,
  Recommendation 
} from '../models/index.js';

const client = getFinnhubClient();

export async function getEarningsEstimates(symbol: string): Promise<EarningsEstimate> {
  return client.get<EarningsEstimate>('/stock/eps-estimate', {
    symbol: symbol.toUpperCase(),
  });
}

export async function getRevenueEstimates(symbol: string): Promise<RevenueEstimate> {
  return client.get<RevenueEstimate>('/stock/revenue-estimate', {
    symbol: symbol.toUpperCase(),
  });
}

export async function getEbitdaEstimates(symbol: string): Promise<EbitdaEstimate> {
  return client.get<EbitdaEstimate>('/stock/ebitda-estimate', {
    symbol: symbol.toUpperCase(),
  });
}

export async function getPriceTarget(symbol: string): Promise<PriceTarget> {
  return client.get<PriceTarget>('/stock/price-target', {
    symbol: symbol.toUpperCase(),
  });
}

export async function getRecommendationTrends(symbol: string): Promise<Recommendation[]> {
  return client.get<Recommendation[]>('/stock/recommendation', {
    symbol: symbol.toUpperCase(),
  });
}
