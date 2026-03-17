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
  from: string,
  to: string
): Promise<Dividend[]> {
  return client.get<Dividend[]>('/stock/dividend', {
    symbol: symbol.toUpperCase(),
    from,
    to,
  });
}

export async function getStockSplits(
  symbol: string,
  from: string,
  to: string
): Promise<StockSplit[]> {
  return client.get<StockSplit[]>('/stock/split', {
    symbol: symbol.toUpperCase(),
    from,
    to,
  });
}

export async function getRevenueBreakdown(symbol: string): Promise<RevenueBreakdown> {
  return client.get<RevenueBreakdown>('/stock/revenue-breakdown', {
    symbol: symbol.toUpperCase(),
  });
}

export async function getEarningsSurprises(symbol: string): Promise<unknown[]> {
  return client.get<unknown[]>('/stock/earnings-surprises', {
    symbol: symbol.toUpperCase(),
  });
}
