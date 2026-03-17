import { z } from 'zod';
import * as fundamentals from '../api/endpoints/fundamentals.js';
import { getLogger } from '../utils/logger.js';
import { createSmartResult, createErrorResult, SymbolSchema, type ToolResult } from './_common.js';

const logger = getLogger('FundamentalsTool');

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
  from: z.string(),
  to: z.string(),
  project: z.string().optional(),
  export: z.boolean().optional(),
});

const GetStockSplitsSchema = z.object({
  symbol: SymbolSchema,
  from: z.string(),
  to: z.string(),
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
      return createErrorResult(`Validation error: ${error.errors.map((e: z.ZodIssue) => e.message).join(', ')}`);
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
      return createErrorResult(`Validation error: ${error.errors.map((e: z.ZodIssue) => e.message).join(', ')}`);
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
      filename: `${symbol.toLowerCase()}-dividends-${from}-${to}.json`,
    });
  } catch (error) {
    logger.error('Error getting dividends:', error);
    if (error instanceof z.ZodError) {
      return createErrorResult(`Validation error: ${error.errors.map((e: z.ZodIssue) => e.message).join(', ')}`);
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
      filename: `${symbol.toLowerCase()}-splits-${from}-${to}.json`,
    });
  } catch (error) {
    logger.error('Error getting stock splits:', error);
    if (error instanceof z.ZodError) {
      return createErrorResult(`Validation error: ${error.errors.map((e: z.ZodIssue) => e.message).join(', ')}`);
    }
    return createErrorResult(error instanceof Error ? error.message : 'Unknown error');
  }
}

export async function getRevenueBreakdown(args: unknown): Promise<ToolResult> {
  try {
    const { symbol, project, export: forceExport } = GetRevenueBreakdownSchema.parse(args);
    logger.info(`Getting revenue breakdown for ${symbol}`);
    const data = await fundamentals.getRevenueBreakdown(symbol);
    return createSmartResult(data, {
      project,
      export: forceExport,
      subdir: 'fundamentals',
      filename: `${symbol.toLowerCase()}-revenue-breakdown.json`,
    });
  } catch (error) {
    logger.error('Error getting revenue breakdown:', error);
    if (error instanceof z.ZodError) {
      return createErrorResult(`Validation error: ${error.errors.map((e: z.ZodIssue) => e.message).join(', ')}`);
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
          symbol: { type: 'string' },
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
          symbol: { type: 'string' },
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
          symbol: { type: 'string' },
          from: { type: 'string' },
          to: { type: 'string' },
          project: { type: 'string', description: 'Project name for saving data' },
          export: { type: 'boolean', description: 'Force export to JSON file' },
        },
        required: ['symbol', 'from', 'to'],
      },
    },
    {
      name: 'get_stock_splits',
      description: 'Get stock split history',
      parameters: {
        type: 'object',
        properties: {
          symbol: { type: 'string' },
          from: { type: 'string' },
          to: { type: 'string' },
          project: { type: 'string', description: 'Project name for saving data' },
          export: { type: 'boolean', description: 'Force export to JSON file' },
        },
        required: ['symbol', 'from', 'to'],
      },
    },
    {
      name: 'get_revenue_breakdown',
      description: 'Get revenue breakdown by segment',
      parameters: {
        type: 'object',
        properties: {
          symbol: { type: 'string' },
          project: { type: 'string', description: 'Project name for saving data' },
          export: { type: 'boolean', description: 'Force export to JSON file' },
        },
        required: ['symbol'],
      },
    },
  ],
};
