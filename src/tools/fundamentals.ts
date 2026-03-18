import { z } from 'zod';
import * as fundamentals from '../api/endpoints/fundamentals.js';
import { getLogger } from '../utils/logger.js';
import { createSmartResult, createErrorResult, SymbolSchema, type ToolResult } from './_common.js';
import { FinnhubError } from '../api/errors.js';

const logger = getLogger('FundamentalsTool');

const DateStringSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format');

const GetBasicFinancialsSchema = z.object({
  symbol: SymbolSchema,
  metricType: z.enum(['all', 'price', 'valuation', 'growth']).default('all'),
  project: z.string().optional(),
  export: z.boolean().optional(),
});

const GetFinancialsAsReportedSchema = z.object({
  symbol: SymbolSchema,
  freq: z.enum(['annual', 'quarterly']).default('annual'),
  project: z.string().optional(),
  export: z.boolean().optional(),
});

const GetDividendsSchema = z.object({
  symbol: SymbolSchema,
  from: DateStringSchema.optional(),
  to: DateStringSchema.optional(),
  project: z.string().optional(),
  export: z.boolean().optional(),
});

const GetStockSplitsSchema = z.object({
  symbol: SymbolSchema,
  from: DateStringSchema.optional(),
  to: DateStringSchema.optional(),
  project: z.string().optional(),
  export: z.boolean().optional(),
});

const GetRevenueBreakdownSchema = z.object({
  symbol: SymbolSchema,
  project: z.string().optional(),
  export: z.boolean().optional(),
});

export async function getBasicFinancials(args: unknown): Promise<ToolResult> {
  try {
    const { symbol, metricType, project, export: forceExport } = GetBasicFinancialsSchema.parse(args);
    logger.info(`Getting basic financials for ${symbol}`);
    const data = await fundamentals.getBasicFinancials(symbol, metricType);
    return createSmartResult(data, {
      project,
      export: forceExport,
      subdir: 'fundamentals',
      filename: `${symbol.toLowerCase()}-financials-${metricType}.json`,
    });
  } catch (error) {
    logger.error('Error getting basic financials:', error);
    if (error instanceof z.ZodError) {
      return createErrorResult(`Validation error: ${error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')}`);
    }
    if (error instanceof FinnhubError) {
      return createErrorResult(`API error: ${error.message}`);
    }
    return createErrorResult(error instanceof Error ? error.message : 'Unknown error');
  }
}

export async function getFinancialsAsReported(args: unknown): Promise<ToolResult> {
  try {
    const { symbol, freq, project, export: forceExport } = GetFinancialsAsReportedSchema.parse(args);
    logger.info(`Getting financials as reported for ${symbol}`);
    const data = await fundamentals.getFinancialsAsReported(symbol, freq);
    return createSmartResult(data, {
      project,
      export: forceExport,
      subdir: 'fundamentals',
      filename: `${symbol.toLowerCase()}-financials-reported-${freq}.json`,
    });
  } catch (error) {
    logger.error('Error getting financials as reported:', error);
    if (error instanceof z.ZodError) {
      return createErrorResult(`Validation error: ${error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')}`);
    }
    if (error instanceof FinnhubError) {
      return createErrorResult(`API error: ${error.message}`);
    }
    return createErrorResult(error instanceof Error ? error.message : 'Unknown error');
  }
}

export async function getDividends(args: unknown): Promise<ToolResult> {
  try {
    const { symbol, from, to, project, export: forceExport } = GetDividendsSchema.parse(args);
    logger.info(`Getting dividends for ${symbol}`);
    const data = await fundamentals.getDividends(symbol, from, to);
    return createSmartResult(data, {
      project,
      export: forceExport,
      subdir: 'fundamentals',
      filename: `${symbol.toLowerCase()}-dividends-${from ?? 'all'}-${to ?? 'all'}.json`,
    });
  } catch (error) {
    logger.error('Error getting dividends:', error);
    if (error instanceof z.ZodError) {
      return createErrorResult(`Validation error: ${error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')}`);
    }
    if (error instanceof FinnhubError) {
      return createErrorResult(`API error: ${error.message}`);
    }
    return createErrorResult(error instanceof Error ? error.message : 'Unknown error');
  }
}

export async function getStockSplits(args: unknown): Promise<ToolResult> {
  try {
    const { symbol, from, to, project, export: forceExport } = GetStockSplitsSchema.parse(args);
    logger.info(`Getting stock splits for ${symbol}`);
    const data = await fundamentals.getStockSplits(symbol, from, to);
    return createSmartResult(data, {
      project,
      export: forceExport,
      subdir: 'fundamentals',
      filename: `${symbol.toLowerCase()}-splits-${from ?? 'all'}-${to ?? 'all'}.json`,
    });
  } catch (error) {
    logger.error('Error getting stock splits:', error);
    if (error instanceof z.ZodError) {
      return createErrorResult(`Validation error: ${error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')}`);
    }
    if (error instanceof FinnhubError) {
      return createErrorResult(`API error: ${error.message}`);
    }
    return createErrorResult(error instanceof Error ? error.message : 'Unknown error');
  }
}

export async function getRevenueBreakdown(args: unknown): Promise<ToolResult> {
  try {
    const { symbol, project, export: forceExport } = GetRevenueBreakdownSchema.parse(args);
    logger.info(`Getting revenue breakdown for ${symbol}`);
    const data = await fundamentals.getRevenueBreakdown(symbol);
    
    // Check for empty data (revenue breakdown often requires paid subscription)
    if (!data || (Array.isArray(data) && data.length === 0) || (typeof data === 'object' && Object.keys(data).length === 0)) {
      return createErrorResult('No revenue breakdown data available for the specified criteria. Note: Revenue breakdown data may require a paid Finnhub subscription.');
    }
    
    return createSmartResult(data, {
      project,
      export: forceExport,
      subdir: 'fundamentals',
      filename: `${symbol.toLowerCase()}-revenue-breakdown.json`,
    });
  } catch (error) {
    logger.error('Error getting revenue breakdown:', error);
    if (error instanceof z.ZodError) {
      return createErrorResult(`Validation error: ${error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')}`);
    }
    if (error instanceof FinnhubError) {
      return createErrorResult(`API error: ${error.message}`);
    }
    return createErrorResult(error instanceof Error ? error.message : 'Unknown error');
  }
}

export const fundamentalsTool = {
  name: 'finnhub_stock_fundamentals',
  description: 'Access fundamental financial data including metrics, dividends, and revenue breakdown. Supports JSON export for large datasets.',
  operations: [
    {
      name: 'get_basic_financials',
      description: 'Get basic financial metrics',
      parameters: {
        type: 'object',
        properties: {
          symbol: { type: 'string', description: 'Stock symbol' },
          metricType: { type: 'string', enum: ['all', 'price', 'valuation', 'growth'], default: 'all' },
          project: { type: 'string', description: 'Project name for saving data' },
          export: { type: 'boolean', description: 'Force export to JSON file' },
        },
        required: ['symbol'],
      },
    },
    {
      name: 'get_financials_as_reported',
      description: 'Get financial statements',
      parameters: {
        type: 'object',
        properties: {
          symbol: { type: 'string', description: 'Stock symbol' },
          freq: { type: 'string', enum: ['annual', 'quarterly'], default: 'annual' },
          project: { type: 'string', description: 'Project name for saving data' },
          export: { type: 'boolean', description: 'Force export to JSON file' },
        },
        required: ['symbol'],
      },
    },
    {
      name: 'get_dividends',
      description: 'Get dividend history',
      parameters: {
        type: 'object',
        properties: {
          symbol: { type: 'string', description: 'Stock symbol' },
          from: { type: 'string', description: 'Start date in YYYY-MM-DD format (optional)' },
          to: { type: 'string', description: 'End date in YYYY-MM-DD format (optional)' },
          project: { type: 'string', description: 'Project name for saving data' },
          export: { type: 'boolean', description: 'Force export to JSON file' },
        },
        required: ['symbol'],
      },
    },
    {
      name: 'get_stock_splits',
      description: 'Get stock split history',
      parameters: {
        type: 'object',
        properties: {
          symbol: { type: 'string', description: 'Stock symbol' },
          from: { type: 'string', description: 'Start date in YYYY-MM-DD format (optional)' },
          to: { type: 'string', description: 'End date in YYYY-MM-DD format (optional)' },
          project: { type: 'string', description: 'Project name for saving data' },
          export: { type: 'boolean', description: 'Force export to JSON file' },
        },
        required: ['symbol'],
      },
    },
    {
      name: 'get_revenue_breakdown',
      description: 'Get revenue breakdown by segment',
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
  ],
};
