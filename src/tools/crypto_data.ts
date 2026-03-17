import { z } from 'zod';
import * as crypto from '../api/endpoints/crypto.js';
import { getLogger } from '../utils/logger.js';
import { createSuccessResult, createErrorResult, SymbolSchema, getUnixTimestamp, getUnixDaysAgo, type ToolResult } from './_common.js';

const logger = getLogger('CryptoDataTool');

const GetCryptoSymbolsSchema = z.object({ exchange: z.string() });
const GetCryptoQuoteSchema = z.object({ symbol: SymbolSchema });
const GetCryptoCandlesSchema = z.object({ symbol: SymbolSchema, resolution: z.enum(['1', '5', '15', '30', '60', 'D', 'W', 'M']), from: z.number().optional(), to: z.number().optional(), days: z.number().default(30) });

export async function getCryptoExchanges(): Promise<ToolResult> {
  try {
    logger.info('Getting crypto exchanges');
    const data = await crypto.getCryptoExchanges();
    return createSuccessResult(data);
  } catch (error) {
    logger.error('Error:', error);
    return createErrorResult(error instanceof Error ? error.message : 'Unknown error');
  }
}

export async function getCryptoSymbols(args: unknown): Promise<ToolResult> {
  try {
    const { exchange } = GetCryptoSymbolsSchema.parse(args);
    logger.info(`Getting crypto symbols for ${exchange}`);
    const data = await crypto.getCryptoSymbols(exchange);
    return createSuccessResult(data);
  } catch (error) {
    logger.error('Error:', error);
    return createErrorResult(error instanceof Error ? error.message : 'Unknown error');
  }
}

export async function getCryptoQuote(args: unknown): Promise<ToolResult> {
  try {
    const { symbol } = GetCryptoQuoteSchema.parse(args);
    logger.info(`Getting crypto quote for ${symbol}`);
    const data = await crypto.getCryptoQuote(symbol);
    return createSuccessResult(data);
  } catch (error) {
    logger.error('Error:', error);
    return createErrorResult(error instanceof Error ? error.message : 'Unknown error');
  }
}

export async function getCryptoCandles(args: unknown): Promise<ToolResult> {
  try {
    const { symbol, resolution, from, to, days } = GetCryptoCandlesSchema.parse(args);
    const endTime = to ?? getUnixTimestamp();
    const startTime = from ?? getUnixDaysAgo(days);
    logger.info(`Getting crypto candles for ${symbol}`);
    const data = await crypto.getCryptoCandles(symbol, resolution, startTime, endTime);
    return createSuccessResult(data);
  } catch (error) {
    logger.error('Error:', error);
    return createErrorResult(error instanceof Error ? error.message : 'Unknown error');
  }
}

export const cryptoDataTool = {
  name: 'finnhub_crypto_data',
  description: 'Access cryptocurrency market data',
  operations: [
    { name: 'get_exchanges', description: 'Get list of crypto exchanges', parameters: { type: 'object', properties: {}, required: [] } },
    { name: 'get_symbols', description: 'Get available crypto symbols', parameters: { type: 'object', properties: { exchange: { type: 'string' } }, required: ['exchange'] } },
    { name: 'get_quote', description: 'Get crypto quote', parameters: { type: 'object', properties: { symbol: { type: 'string' } }, required: ['symbol'] } },
    { name: 'get_candles', description: 'Get crypto OHLCV data', parameters: { type: 'object', properties: { symbol: { type: 'string' }, resolution: { type: 'string', enum: ['1', '5', '15', '30', '60', 'D', 'W', 'M'] }, days: { type: 'number', default: 30 } }, required: ['symbol', 'resolution'] } },
  ],
};
