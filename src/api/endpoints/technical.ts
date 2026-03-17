import { getFinnhubClient } from '../client.js';
import type { 
  TechnicalIndicator, 
  AggregateSignals, 
  PatternRecognition, 
  SupportResistance 
} from '../models/index.js';

const client = getFinnhubClient();

export async function getTechnicalIndicator(
  symbol: string,
  resolution: string,
  indicator: string,
  timePeriod: number,
  from: number,
  to: number,
  indicatorFields?: Record<string, unknown>
): Promise<TechnicalIndicator> {
  const params: Record<string, unknown> = {
    symbol: symbol.toUpperCase(),
    resolution,
    indicator,
    timeperiod: timePeriod,
    from,
    to,
    ...indicatorFields,
  };
  return client.get<TechnicalIndicator>('/indicator', params);
}

export async function getAggregateSignals(symbol: string): Promise<AggregateSignals> {
  return client.get<AggregateSignals>('/scan/technical', { 
    symbol: symbol.toUpperCase() 
  });
}

export async function getPatternRecognition(
  symbol: string,
  resolution: string
): Promise<PatternRecognition> {
  return client.get<PatternRecognition>('/scan/pattern', {
    symbol: symbol.toUpperCase(),
    resolution,
  });
}

export async function getSupportResistance(
  symbol: string,
  resolution: string
): Promise<SupportResistance> {
  return client.get<SupportResistance>('/scan/support-resistance', {
    symbol: symbol.toUpperCase(),
    resolution,
  });
}
