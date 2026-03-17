import { getFinnhubClient } from '../client.js';
import type { 
  InsiderTransaction, 
  InstitutionalOwnership,
  CongressTransaction 
} from '../models/index.js';

const client = getFinnhubClient();

export async function getInsiderTransactions(
  symbol: string,
  from: string,
  to: string
): Promise<InsiderTransaction[]> {
  return client.get<InsiderTransaction[]>('/stock/insider-transactions', {
    symbol: symbol.toUpperCase(),
    from,
    to,
  });
}

export async function getInstitutionalOwnership(symbol: string): Promise<InstitutionalOwnership> {
  return client.get<InstitutionalOwnership>('/stock/institutional-ownership', {
    symbol: symbol.toUpperCase(),
  });
}

export async function getInstitutionalPortfolio(cik: string): Promise<unknown> {
  return client.get('/institutional/portfolio', { cik });
}

export async function getCongressTransactions(
  symbol?: string,
  from?: string,
  to?: string
): Promise<CongressTransaction[]> {
  const params: Record<string, string> = {};
  if (symbol) params.symbol = symbol.toUpperCase();
  if (from) params.from = from;
  if (to) params.to = to;
  return client.get<CongressTransaction[]>('/stock/congressional-trading', params);
}
