import { z } from 'zod';
import * as ownership from '../api/endpoints/ownership.js';
import { getLogger } from '../utils/logger.js';
import { createSmartResult, createErrorResult, SymbolSchema, type ToolResult } from './_common.js';

const logger = getLogger('StockOwnershipTool');

const GetInsiderTransactionsSchema = z.object({
  symbol: SymbolSchema,
  from: z.string(),
  to: z.string(),
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
  from: z.string().optional(),
  to: z.string().optional(),
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
      filename: `${symbol.toLowerCase()}-insider-${from}-${to}.json`,
    });
  } catch (error) {
    logger.error('Error:', error);
    return createErrorResult(error instanceof Error ? error.message : 'Unknown error');
  }
}

export async function getInstitutionalOwnership(args: unknown): Promise<ToolResult> {
  try {
    const { symbol, project, export: forceExport } = GetInstitutionalOwnershipSchema.parse(args);
    logger.info(`Getting institutional ownership for ${symbol}`);
    const data = await ownership.getInstitutionalOwnership(symbol);
    return createSmartResult(data, {
      project,
      export: forceExport,
      subdir: 'ownership',
      filename: `${symbol.toLowerCase()}-institutional.json`,
    });
  } catch (error) {
    logger.error('Error:', error);
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
    logger.error('Error:', error);
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
      filename: `congress-${symbol?.toLowerCase() || 'all'}-${from || 'all'}-${to || 'all'}.json`,
    });
  } catch (error) {
    logger.error('Error:', error);
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
      name: 'get_institutional_ownership',
      description: 'Get institutional ownership data',
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
    {
      name: 'get_institutional_portfolio',
      description: 'Get portfolio by CIK',
      parameters: {
        type: 'object',
        properties: {
          cik: { type: 'string' },
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
          symbol: { type: 'string' },
          from: { type: 'string' },
          to: { type: 'string' },
          project: { type: 'string', description: 'Project name for saving data' },
          export: { type: 'boolean', description: 'Force export to JSON file' },
        },
      },
    },
  ],
};
