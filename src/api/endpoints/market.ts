import { getFinnhubClient } from '../client.js';
import type { 
  Quote, 
  Candle, 
  CompanyProfile, 
  MarketStatus, 
  SymbolResult,
  Exchange,
  BasicFinancials 
} from '../models/index.js';

const client = getFinnhubClient();

export async function getQuote(symbol: string): Promise<Quote> {
  return client.get<Quote>('/quote', { symbol: symbol.toUpperCase() });
}

export async function getCandles(
  symbol: string, 
  resolution: string, 
  from: number, 
  to: number
): Promise<Candle> {
  return client.get<Candle>('/stock/candle', {
    symbol: symbol.toUpperCase(),
    resolution,
    from,
    to,
  });
}

export async function getCompanyProfile(symbol: string): Promise<CompanyProfile> {
  return client.get<CompanyProfile>('/stock/profile2', { 
    symbol: symbol.toUpperCase() 
  });
}

export async function getMarketStatus(exchange: string): Promise<MarketStatus> {
  return client.get<MarketStatus>('/stock/market-status', { exchange });
}

export async function symbolLookup(query: string): Promise<SymbolResult> {
  return client.get<SymbolResult>('/search', { q: query });
}

export async function getExchanges(): Promise<Exchange[]> {
  return client.get<Exchange[]>('/stock/exchange');
}

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
): Promise<unknown> {
  return client.get('/stock/financials-reported', {
    symbol: symbol.toUpperCase(),
    freq,
  });
}

export async function getEarningsSurprises(symbol: string): Promise<unknown> {
  return client.get('/stock/earningsSurprises', {
    symbol: symbol.toUpperCase()
  });
}
