import { getFinnhubClient } from '../client.js';
import type { IPOEvent, EarningsEvent, EconomicEvent, FDAEvent } from '../models/index.js';

const client = getFinnhubClient();

export async function getIPOCalendar(
  from: string,
  to: string
): Promise<IPOEvent[]> {
  return client.get<IPOEvent[]>('/calendar/ipo', { from, to });
}

export async function getEarningsCalendar(
  from: string,
  to: string,
  symbol?: string
): Promise<{ earningsCalendar: EarningsEvent[] }> {
  const params: Record<string, string> = { from, to };
  if (symbol) params.symbol = symbol.toUpperCase();
  return client.get<{ earningsCalendar: EarningsEvent[] }>('/calendar/earnings', params);
}

export async function getEconomicCalendar(
  from: string,
  to: string
): Promise<EconomicEvent[]> {
  return client.get<EconomicEvent[]>('/calendar/economic', { from, to });
}

export async function getFDACalendar(from: string, to: string): Promise<FDAEvent[]> {
  return client.get<FDAEvent[]>('/calendar/fda', { from, to });
}
