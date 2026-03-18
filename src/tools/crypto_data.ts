import { z } from 'zod';
import * as crypto from '../api/endpoints/crypto.js';
import { getLogger } from '../utils/logger.js';
import {
  createSmartResult,
  createErrorResult,
  SymbolSchema,
  getUnixTimestamp,
  getUnixDaysAgo,
  type ToolResult
} from './_common.js';
import { FinnhubError } from '../api/errors.js';

const logger = getLogger('CryptoDataTool');

const GetCryptoSymbolsSchema = z.object({
  exchange: z.string(),
  project: z.string().optional(),
  export: z.boolean().optional(),
});

const GetCryptoQuoteSchema = z.object({
  symbol: SymbolSchema,
  project: z.string().optional(),
  export: z.boolean().optional(),
});

const GetCryptoCandlesSchema = z.object({
  symbol: SymbolSchema,
  resolution: z.enum(['1', '5', '15', '30', '60', 'D', 'W', 'M']),
  from: z.number().optional(),
  to: z.number().optional(),
  days: z.number().default(30),
  project: z.string().optional(),
  export: z.boolean().optional(),
});

export async function getCryptoExchanges(args: unknown): Promise<ToolResult> {
  try {
    const params = (args as { project?: string; export?: boolean }) || {};
    logger.info('Getting crypto exchanges');
    const data = await crypto.getCryptoExchanges();
    return createSmartResult(data, {
      project: params.project,
      export: params.export,
      subdir: 'crypto',
      filename: 'exchanges.json',
    });
  } catch (error) {
    logger.error('Error getting crypto exchanges:', error);
    if (error instanceof z.ZodError) {
      return createErrorResult(`Validation error: ${error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')}`);
    }
    if (error instanceof FinnhubError) {
      return createErrorResult(`API error: ${error.message}`);
    }
    return createErrorResult(error instanceof Error ? error.message : 'Unknown error');
  }
}

export async function getCryptoSymbols(args: unknown): Promise<ToolResult> {
  try {
    const { exchange, project, export: forceExport } = GetCryptoSymbolsSchema.parse(args);
    logger.info(`Getting crypto symbols for ${exchange}`);
    const data = await crypto.getCryptoSymbols(exchange);
    return createSmartResult(data, {
      project,
      export: forceExport,
      subdir: 'crypto',
      filename: `${exchange}-symbols.json`,
    });
  } catch (error) {
    logger.error('Error getting crypto symbols:', error);
    if (error instanceof z.ZodError) {
      return createErrorResult(`Validation error: ${error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')}`);
    }
    if (error instanceof FinnhubError) {
      return createErrorResult(`API error: ${error.message}`);
    }
    return createErrorResult(error instanceof Error ? error.message : 'Unknown error');
  }
}

export async function getCryptoQuote(args: unknown): Promise<ToolResult> {
  try {
    const { symbol, project, export: forceExport } = GetCryptoQuoteSchema.parse(args);
    logger.info(`Getting crypto quote for ${symbol}`);
    const data = await crypto.getCryptoQuote(symbol);
    return createSmartResult(data, {
      project,
      export: forceExport,
      subdir: 'crypto',
      filename: `${symbol.toLowerCase().replace(':', '-')}-quote.json`,
    });
  } catch (error) {
    logger.error('Error getting crypto quote:', error);
    if (error instanceof z.ZodError) {
      return createErrorResult(`Validation error: ${error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')}`);
    }
    if (error instanceof FinnhubError) {
      return createErrorResult(`API error: ${error.message}`);
    }
    return createErrorResult(error instanceof Error ? error.message : 'Unknown error');
  }
}

export async function getCryptoCandles(args: unknown): Promise<ToolResult> {
  try {
    const { symbol, resolution, from, to, days, project, export: forceExport } = GetCryptoCandlesSchema.parse(args);
    const endTime = to ?? getUnixTimestamp();
    const startTime = from ?? getUnixDaysAgo(days);
    logger.info(`Getting crypto candles for ${symbol}`);
    const data = await crypto.getCryptoCandles(symbol, resolution, startTime, endTime);
    return createSmartResult(data, {
      project,
      export: forceExport,
      subdir: 'crypto',
      filename: `${symbol.toLowerCase().replace(':', '-')}-candles-${resolution}.json`,
    });
  } catch (error) {
    logger.error('Error getting crypto candles:', error);
    if (error instanceof z.ZodError) {
      return createErrorResult(`Validation error: ${error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')}`);
    }
    if (error instanceof FinnhubError) {
      return createErrorResult(`API error: ${error.message}`);
    }
    return createErrorResult(error instanceof Error ? error.message : 'Unknown error');
  }
}

export const cryptoDataTool = {
  name: 'finnhub_crypto_data',
  description: 'Access cryptocurrency market data. Supports JSON export for large datasets.',
  operations: [
    {
      name: 'get_exchanges',
      description: 'Get list of crypto exchanges',
      parameters: {
        type: 'object',
        properties: {
          project: { type: 'string', description: 'Project name for saving data' },
          export: { type: 'boolean', description: 'Force export to JSON file' },
        },
      },
    },
    {
      name: 'get_symbols',
      description: 'Get available crypto symbols',
      parameters: {
        type: 'object',
        properties: {
          exchange: { type: 'string', description: 'Crypto exchange name' },
          project: { type: 'string', description: 'Project name for saving data' },
          export: { type: 'boolean', description: 'Force export to JSON file' },
        },
        required: ['exchange'],
      },
    },
    {
      name: 'get_quote',
      description: 'Get crypto quote',
      parameters: {
        type: 'object',
        properties: {
          symbol: { type: 'string', description: 'Crypto symbol' },
          project: { type: 'string', description: 'Project name for saving data' },
          export: { type: 'boolean', description: 'Force export to JSON file' },
        },
        required: ['symbol'],
      },
    },
    {
      name: 'get_candles',
      description: 'Get crypto OHLCV data',
      parameters: {
        type: 'object',
        properties: {
          symbol: { type: 'string', description: 'Crypto symbol' },
          resolution: { type: 'string', enum: ['1', '5', '15', '30', '60', 'D', 'W', 'M'] },
          days: { type: 'number', default: 30 },
          project: { type: 'string', description: 'Project name for saving data' },
          export: { type: 'boolean', description: 'Force export to JSON file' },
        },
        required: ['symbol', 'resolution'],
      },
    },
  ],
};
