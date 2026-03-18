import { z } from 'zod';
import * as events from '../api/endpoints/events.js';
import { getLogger } from '../utils/logger.js';
import { createSmartResult, createErrorResult, SymbolSchema, type ToolResult } from './_common.js';
import { FinnhubError } from '../api/errors.js';

const logger = getLogger('MarketEventsTool');

const GetMarketHolidaysSchema = z.object({
  exchange: z.string(),
  project: z.string().optional(),
  export: z.boolean().optional(),
});

const GetAnalystRatingsSchema = z.object({
  symbol: SymbolSchema,
  project: z.string().optional(),
  export: z.boolean().optional(),
});

export async function getMarketHolidays(args: unknown): Promise<ToolResult> {
  try {
    const { exchange, project, export: forceExport } = GetMarketHolidaysSchema.parse(args);
    logger.info(`Getting market holidays for ${exchange}`);
    const data = await events.getMarketHolidays(exchange);
    return createSmartResult(data, {
      project,
      export: forceExport,
      subdir: 'market-data',
      filename: `${exchange.toLowerCase()}-holidays.json`,
    });
  } catch (error) {
    logger.error('Error getting market holidays:', error);
    if (error instanceof z.ZodError) {
      return createErrorResult(`Validation error: ${error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')}`);
    }
    if (error instanceof FinnhubError) {
      return createErrorResult(`API error: ${error.message}`);
    }
    return createErrorResult(error instanceof Error ? error.message : 'Unknown error');
  }
}

export async function getAnalystRatings(args: unknown): Promise<ToolResult> {
  try {
    const { symbol, project, export: forceExport } = GetAnalystRatingsSchema.parse(args);
    logger.info(`Getting analyst ratings for ${symbol}`);
    const data = await events.getAnalystRatings(symbol);
    return createSmartResult(data, {
      project,
      export: forceExport,
      subdir: 'market-data',
      filename: `${symbol.toLowerCase()}-analyst-ratings.json`,
    });
  } catch (error) {
    logger.error('Error getting analyst ratings:', error);
    if (error instanceof z.ZodError) {
      return createErrorResult(`Validation error: ${error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')}`);
    }
    if (error instanceof FinnhubError) {
      return createErrorResult(`API error: ${error.message}`);
    }
    return createErrorResult(error instanceof Error ? error.message : 'Unknown error');
  }
}

export async function getMergerAcquisitions(args: unknown): Promise<ToolResult> {
  try {
    const params = (args as { project?: string; export?: boolean }) || {};
    logger.info('Getting merger and acquisitions data');
    const data = await events.getMergerAcquisitions();
    return createSmartResult(data, {
      project: params.project,
      export: params.export,
      subdir: 'market-data',
      filename: 'merger-acquisitions.json',
    });
  } catch (error) {
    logger.error('Error getting merger and acquisitions:', error);
    if (error instanceof z.ZodError) {
      return createErrorResult(`Validation error: ${error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')}`);
    }
    if (error instanceof FinnhubError) {
      return createErrorResult(`API error: ${error.message}`);
    }
    return createErrorResult(error instanceof Error ? error.message : 'Unknown error');
  }
}

export const marketEventsTool = {
  name: 'finnhub_market_events',
  description: 'Access market holidays, analyst ratings, and M&A activity. Supports JSON export for large datasets.',
  operations: [
    {
      name: 'get_market_holidays',
      description: 'Get market holidays for an exchange',
      parameters: {
        type: 'object',
        properties: {
          exchange: { type: 'string', description: 'Exchange code (e.g., US, LSE)' },
          project: { type: 'string', description: 'Project name for saving data' },
          export: { type: 'boolean', description: 'Force export to JSON file' },
        },
        required: ['exchange'],
      },
    },
    {
      name: 'get_analyst_ratings',
      description: 'Get analyst rating changes',
      parameters: {
        type: 'object',
        properties: {
          symbol: { type: 'string', description: 'Stock symbol' },
          project: { type: 'string', description: 'Project name for saving data' },
          export: { type: 'boolean', description: 'Force export to JSON file' },
        },
        required: ['symbol'],
      },
    },
    {
      name: 'get_merger_acquisitions',
      description: 'Get merger and acquisition activity',
      parameters: {
        type: 'object',
        properties: {
          project: { type: 'string', description: 'Project name for saving data' },
          export: { type: 'boolean', description: 'Force export to JSON file' },
        },
      },
    },
  ],
};
