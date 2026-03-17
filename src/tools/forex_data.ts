import { z } from 'zod';
import * as forex from '../api/endpoints/forex.js';
import { getLogger } from '../utils/logger.js';
import { createSuccessResult, createErrorResult, SymbolSchema, getUnixTimestamp, getUnixDaysAgo, type ToolResult } from './_common.js';

const logger = getLogger('ForexDataTool');

const GetForexSymbolsSchema = z.object({ exchange: z.string() });
const GetForexRateSchema = z.object({ from: z.string(), to: z.string() });
const GetForexCandlesSchema = z.object({
  symbol: SymbolSchema,
  resolution: z.enum(['1', '5', '15', '30', '60', 'D', 'W', 'M']),
  from: z.number().optional(),
  to: z.number().optional(),
  days: z.number().default(30),
});

export async function getForexExchanges(): Promise<ToolResult> {
  try {
    logger.info('Getting forex exchanges');
    const data = await forex.getForexExchanges();
    return createSuccessResult(data);
  } catch (error) {
    logger.error('Error:', error);
    return createErrorResult(error instanceof Error ? error.message : 'Unknown error');
  }
}

export async function getForexSymbols(args: unknown): Promise<ToolResult> {
  try {
    const { exchange } = GetForexSymbolsSchema.parse(args);
    logger.info(`Getting forex symbols for ${exchange}`);
    const data = await forex.getForexSymbols(exchange);
    return createSuccessResult(data);
  } catch (error) {
    logger.error('Error:', error);
    return createErrorResult(error instanceof Error ? error.message : 'Unknown error');
  }
}

export async function getForexRate(args: unknown): Promise<ToolResult> {
  try {
    const { from, to: toCurrency } = GetForexRateSchema.parse(args);
    logger.info(`Getting forex rate ${from}/${toCurrency}`);
    const data = await forex.getForexRate(from, toCurrency);
    return createSuccessResult(data);
  } catch (error) {
    logger.error('Error:', error);
    return createErrorResult(error instanceof Error ? error.message : 'Unknown error');
  }
}

export async function getForexCandles(args: unknown): Promise<ToolResult> {
  try {
    const { symbol, resolution, from, to, days } = GetForexCandlesSchema.parse(args);
    const endTime = to ?? getUnixTimestamp();
    const startTime = from ?? getUnixDaysAgo(days);
    logger.info(`Getting forex candles for ${symbol}`);
    const data = await forex.getForexCandles(symbol, resolution, startTime, endTime);
    return createSuccessResult(data);
  } catch (error) {
    logger.error('Error:', error);
    return createErrorResult(error instanceof Error ? error.message : 'Unknown error');
  }
}

export const forexDataTool = {
  name: 'finnhub_forex_data',
  description: 'Access foreign exchange market data',
  operations: [
    { name: 'get_exchanges', description: 'Get list of forex exchanges', parameters: { type: 'object', properties: {} } },
    { name: 'get_symbols', description: 'Get available forex symbols', parameters: { type: 'object', properties: { exchange: { type: 'string' } }, required: ['exchange'] } },
    { name: 'get_rate', description: 'Get forex exchange rate', parameters: { type: 'object', properties: { from: { type: 'string' }, to: { type: 'string' } }, required: ['from', 'to'] } },
    { name: 'get_candles', description: 'Get forex OHLCV data', parameters: { type: 'object', properties: { symbol: { type: 'string' }, resolution: { type: 'string', enum: ['1', '5', '15', '30', '60', 'D', 'W', 'M'] }, days: { type: 'number', default: 30 } }, required: ['symbol', 'resolution'] } },
  ],
};
