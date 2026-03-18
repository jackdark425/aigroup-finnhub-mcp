import { getFinnhubClient } from '../client.js';
import type { 
  BasicFinancials, 
  FinancialReport, 
  Dividend, 
  StockSplit,
  RevenueBreakdown 
} from '../models/index.js';

const client = getFinnhubClient();

export async function getBasicFinancials(
  symbol: string,
  metricType: 'all' | 'price' | 'valuation' | 'growth' = 'all'
): Promise<BasicFinancials> {
  return client.get<BasicFinancials>('/stock/metric', {
    symbol: symbol.toUpperCase(),
    metric: metricType,
  });
}

export async function getFinancialsAsReported(
  symbol: string,
  freq: 'annual' | 'quarterly' = 'annual'
): Promise<{ symbol: string; data: FinancialReport[] }> {
  return client.get<{ symbol: string; data: FinancialReport[] }>('/stock/financials-reported', {
    symbol: symbol.toUpperCase(),
    freq,
  });
}

export async function getDividends(
  symbol: string,
  from?: string,
  to?: string
): Promise<Dividend[]> {
  const params: Record<string, string> = {
    symbol: symbol.toUpperCase(),
  };
  if (from) params.from = from;
  if (to) params.to = to;
  return client.get<Dividend[]>('/stock/dividend', params);
}

export async function getStockSplits(
  symbol: string,
  from?: string,
  to?: string
): Promise<StockSplit[]> {
  const params: Record<string, string> = {
    symbol: symbol.toUpperCase(),
  };
  if (from) params.from = from;
  if (to) params.to = to;
  return client.get<StockSplit[]>('/stock/split', params);
}

export async function getRevenueBreakdown(symbol: string): Promise<RevenueBreakdown> {
  return client.get<RevenueBreakdown>('/stock/revenue-breakdown', {
    symbol: symbol.toUpperCase(),
  });
}

export async function getEarningsSurprises(symbol: string): Promise<unknown[]> {
  return client.get<unknown[]>('/stock/earningsSurprises', {
    symbol: symbol.toUpperCase(),
  });
}
