import { z } from 'zod';
import * as forex from '../api/endpoints/forex.js';
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

const logger = getLogger('ForexDataTool');

const GetForexSymbolsSchema = z.object({
  exchange: z.string(),
  project: z.string().optional(),
  export: z.boolean().optional(),
});

const GetForexRateSchema = z.object({
  from: z.string().min(1),
  to: z.string().min(1),
  project: z.string().optional(),
  export: z.boolean().optional(),
});

const GetForexCandlesSchema = z.object({
  symbol: SymbolSchema,
  resolution: z.enum(['1', '5', '15', '30', '60', 'D', 'W', 'M']),
  from: z.number().optional(),
  to: z.number().optional(),
  days: z.number().default(30),
  project: z.string().optional(),
  export: z.boolean().optional(),
});

export async function getForexExchanges(args: unknown): Promise<ToolResult> {
  try {
    const params = (args as { project?: string; export?: boolean }) || {};
    logger.info('Getting forex exchanges');
    const data = await forex.getForexExchanges();
    return createSmartResult(data, {
      project: params.project,
      export: params.export,
      subdir: 'forex',
      filename: 'exchanges.json',
    });
  } catch (error) {
    logger.error('Error getting forex exchanges:', error);
    if (error instanceof z.ZodError) {
      return createErrorResult(`Validation error: ${error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')}`);
    }
    if (error instanceof FinnhubError) {
      return createErrorResult(`API error: ${error.message}`);
    }
    return createErrorResult(error instanceof Error ? error.message : 'Unknown error');
  }
}

export async function getForexSymbols(args: unknown): Promise<ToolResult> {
  try {
    const { exchange, project, export: forceExport } = GetForexSymbolsSchema.parse(args);
    logger.info(`Getting forex symbols for ${exchange}`);
    const data = await forex.getForexSymbols(exchange);
    return createSmartResult(data, {
      project,
      export: forceExport,
      subdir: 'forex',
      filename: `${exchange}-symbols.json`,
    });
  } catch (error) {
    logger.error('Error getting forex symbols:', error);
    if (error instanceof z.ZodError) {
      return createErrorResult(`Validation error: ${error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')}`);
    }
    if (error instanceof FinnhubError) {
      return createErrorResult(`API error: ${error.message}`);
    }
    return createErrorResult(error instanceof Error ? error.message : 'Unknown error');
  }
}

export async function getForexRate(args: unknown): Promise<ToolResult> {
  try {
    const { from: fromCurrency, to: toCurrency, project, export: forceExport } = GetForexRateSchema.parse(args);
    logger.info(`Getting forex rate ${fromCurrency}/${toCurrency}`);
    const data = await forex.getForexRate(fromCurrency, toCurrency);
    return createSmartResult(data, {
      project,
      export: forceExport,
      subdir: 'forex',
      filename: `${fromCurrency.toLowerCase()}-${toCurrency.toLowerCase()}-rate.json`,
    });
  } catch (error) {
    logger.error('Error getting forex rate:', error);
    if (error instanceof z.ZodError) {
      return createErrorResult(`Validation error: ${error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')}`);
    }
    if (error instanceof FinnhubError) {
      return createErrorResult(`API error: ${error.message}`);
    }
    return createErrorResult(error instanceof Error ? error.message : 'Unknown error');
  }
}

export async function getForexCandles(args: unknown): Promise<ToolResult> {
  try {
    const { symbol, resolution, from, to, days, project, export: forceExport } = GetForexCandlesSchema.parse(args);
    const endTime = to ?? getUnixTimestamp();
    const startTime = from ?? getUnixDaysAgo(days);
    logger.info(`Getting forex candles for ${symbol}`);
    const data = await forex.getForexCandles(symbol, resolution, startTime, endTime);
    return createSmartResult(data, {
      project,
      export: forceExport,
      subdir: 'forex',
      filename: `${symbol.toLowerCase().replace(':', '-')}-candles-${resolution}.json`,
    });
  } catch (error) {
    logger.error('Error getting forex candles:', error);
    if (error instanceof z.ZodError) {
      return createErrorResult(`Validation error: ${error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')}`);
    }
    if (error instanceof FinnhubError) {
      return createErrorResult(`API error: ${error.message}`);
    }
    return createErrorResult(error instanceof Error ? error.message : 'Unknown error');
  }
}

export const forexDataTool = {
  name: 'finnhub_forex_data',
  description: 'Access foreign exchange market data. Supports JSON export for large datasets.',
  operations: [
    {
      name: 'get_exchanges',
      description: 'Get list of forex exchanges',
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
      description: 'Get available forex symbols',
      parameters: {
        type: 'object',
        properties: {
          exchange: { type: 'string', description: 'Forex exchange name' },
          project: { type: 'string', description: 'Project name for saving data' },
          export: { type: 'boolean', description: 'Force export to JSON file' },
        },
        required: ['exchange'],
      },
    },
    {
      name: 'get_rate',
      description: 'Get forex exchange rate',
      parameters: {
        type: 'object',
        properties: {
          from: { type: 'string', description: 'Base currency code' },
          to: { type: 'string', description: 'Target currency code' },
          project: { type: 'string', description: 'Project name for saving data' },
          export: { type: 'boolean', description: 'Force export to JSON file' },
        },
        required: ['from', 'to'],
      },
    },
    {
      name: 'get_candles',
      description: 'Get forex OHLCV data',
      parameters: {
        type: 'object',
        properties: {
          symbol: { type: 'string', description: 'Forex symbol' },
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
