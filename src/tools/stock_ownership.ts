import { z } from 'zod';
import * as ownership from '../api/endpoints/ownership.js';
import { getLogger } from '../utils/logger.js';
import { createSmartResult, createErrorResult, SymbolSchema, type ToolResult } from './_common.js';
import { FinnhubError } from '../api/errors.js';

const logger = getLogger('StockOwnershipTool');

const DateStringSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format');

const GetInsiderTransactionsSchema = z.object({
  symbol: SymbolSchema,
  from: DateStringSchema.optional(),
  to: DateStringSchema.optional(),
  project: z.string().optional(),
  export: z.boolean().optional(),
});

const GetInstitutionalOwnershipSchema = z.object({
  symbol: SymbolSchema,
  project: z.string().optional(),
  export: z.boolean().optional(),
});

const GetInstitutionalPortfolioSchema = z.object({
  cik: z.string(),
  project: z.string().optional(),
  export: z.boolean().optional(),
});

const GetCongressTransactionsSchema = z.object({
  symbol: SymbolSchema.optional(),
  from: DateStringSchema.optional(),
  to: DateStringSchema.optional(),
  project: z.string().optional(),
  export: z.boolean().optional(),
});

export async function getInsiderTransactions(args: unknown): Promise<ToolResult> {
  try {
    const { symbol, from, to, project, export: forceExport } = GetInsiderTransactionsSchema.parse(args);
    logger.info(`Getting insider transactions for ${symbol}`);
    const data = await ownership.getInsiderTransactions(symbol, from, to);
    return createSmartResult(data, {
      project,
      export: forceExport,
      subdir: 'ownership',
      filename: `${symbol.toLowerCase()}-insider-${from ?? 'all'}-${to ?? 'all'}.json`,
    });
  } catch (error) {
    logger.error('Error getting insider transactions:', error);
    if (error instanceof z.ZodError) {
      return createErrorResult(`Validation error: ${error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')}`);
    }
    if (error instanceof FinnhubError) {
      return createErrorResult(`API error: ${error.message}`);
    }
    return createErrorResult(error instanceof Error ? error.message : 'Unknown error');
  }
}

export async function getInstitutionalOwnership(args: unknown): Promise<ToolResult> {
  try {
    const { symbol, project, export: forceExport } = GetInstitutionalOwnershipSchema.parse(args);
    logger.info(`Getting institutional ownership for ${symbol}`);
    const data = await ownership.getInstitutionalOwnership(symbol);
    
    // Check for empty data (institutional ownership often requires paid subscription)
    if (!data || (Array.isArray(data) && data.length === 0) || (typeof data === 'object' && Object.keys(data).length === 0)) {
      return createErrorResult('No institutional ownership data available for the specified criteria. Note: Institutional ownership data may require a paid Finnhub subscription.');
    }
    
    return createSmartResult(data, {
      project,
      export: forceExport,
      subdir: 'ownership',
      filename: `${symbol.toLowerCase()}-institutional.json`,
    });
  } catch (error) {
    logger.error('Error getting institutional ownership:', error);
    if (error instanceof z.ZodError) {
      return createErrorResult(`Validation error: ${error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')}`);
    }
    if (error instanceof FinnhubError) {
      return createErrorResult(`API error: ${error.message}`);
    }
    return createErrorResult(error instanceof Error ? error.message : 'Unknown error');
  }
}

export async function getInstitutionalPortfolio(args: unknown): Promise<ToolResult> {
  try {
    const { cik, project, export: forceExport } = GetInstitutionalPortfolioSchema.parse(args);
    logger.info(`Getting institutional portfolio for ${cik}`);
    const data = await ownership.getInstitutionalPortfolio(cik);
    return createSmartResult(data, {
      project,
      export: forceExport,
      subdir: 'ownership',
      filename: `portfolio-${cik}.json`,
    });
  } catch (error) {
    logger.error('Error getting institutional portfolio:', error);
    if (error instanceof z.ZodError) {
      return createErrorResult(`Validation error: ${error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')}`);
    }
    if (error instanceof FinnhubError) {
      return createErrorResult(`API error: ${error.message}`);
    }
    return createErrorResult(error instanceof Error ? error.message : 'Unknown error');
  }
}

export async function getCongressTransactions(args: unknown): Promise<ToolResult> {
  try {
    const { symbol, from, to, project, export: forceExport } = GetCongressTransactionsSchema.parse(args);
    logger.info(`Getting congress transactions`);
    const data = await ownership.getCongressTransactions(symbol, from, to);
    return createSmartResult(data, {
      project,
      export: forceExport,
      subdir: 'ownership',
      filename: `congress-${symbol?.toLowerCase() ?? 'all'}-${from ?? 'all'}-${to ?? 'all'}.json`,
    });
  } catch (error) {
    logger.error('Error getting congress transactions:', error);
    if (error instanceof z.ZodError) {
      return createErrorResult(`Validation error: ${error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')}`);
    }
    if (error instanceof FinnhubError) {
      return createErrorResult(`API error: ${error.message}`);
    }
    return createErrorResult(error instanceof Error ? error.message : 'Unknown error');
  }
}

export const stockOwnershipTool = {
  name: 'finnhub_stock_ownership',
  description: 'Access insider transactions and institutional ownership data. Supports JSON export for large datasets.',
  operations: [
    {
      name: 'get_insider_transactions',
      description: 'Get insider trading transactions',
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
      name: 'get_institutional_ownership',
      description: 'Get institutional ownership data',
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
      name: 'get_institutional_portfolio',
      description: 'Get portfolio by CIK',
      parameters: {
        type: 'object',
        properties: {
          cik: { type: 'string', description: 'CIK identifier' },
          project: { type: 'string', description: 'Project name for saving data' },
          export: { type: 'boolean', description: 'Force export to JSON file' },
        },
        required: ['cik'],
      },
    },
    {
      name: 'get_congress_transactions',
      description: 'Get congressional trading transactions',
      parameters: {
        type: 'object',
        properties: {
          symbol: { type: 'string', description: 'Stock symbol (optional)' },
          from: { type: 'string', description: 'Start date in YYYY-MM-DD format (optional)' },
          to: { type: 'string', description: 'End date in YYYY-MM-DD format (optional)' },
          project: { type: 'string', description: 'Project name for saving data' },
          export: { type: 'boolean', description: 'Force export to JSON file' },
        },
      },
    },
  ],
};
