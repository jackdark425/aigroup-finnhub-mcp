import { z } from 'zod';
import * as ownership from '../api/endpoints/ownership.js';
import { getLogger } from '../utils/logger.js';
import { createSuccessResult, createErrorResult, SymbolSchema, type ToolResult } from './_common.js';

const logger = getLogger('StockOwnershipTool');

const GetInsiderTransactionsSchema = z.object({
  symbol: SymbolSchema,
  from: z.string(),
  to: z.string(),
});

const GetInstitutionalOwnershipSchema = z.object({ symbol: SymbolSchema });
const GetInstitutionalPortfolioSchema = z.object({ cik: z.string() });
const GetCongressTransactionsSchema = z.object({
  symbol: SymbolSchema.optional(),
  from: z.string().optional(),
  to: z.string().optional(),
});

export async function getInsiderTransactions(args: unknown): Promise<ToolResult> {
  try {
    const { symbol, from, to } = GetInsiderTransactionsSchema.parse(args);
    logger.info(`Getting insider transactions for ${symbol}`);
    const data = await ownership.getInsiderTransactions(symbol, from, to);
    return createSuccessResult(data);
  } catch (error) {
    logger.error('Error:', error);
    return createErrorResult(error instanceof Error ? error.message : 'Unknown error');
  }
}

export async function getInstitutionalOwnership(args: unknown): Promise<ToolResult> {
  try {
    const { symbol } = GetInstitutionalOwnershipSchema.parse(args);
    logger.info(`Getting institutional ownership for ${symbol}`);
    const data = await ownership.getInstitutionalOwnership(symbol);
    return createSuccessResult(data);
  } catch (error) {
    logger.error('Error:', error);
    return createErrorResult(error instanceof Error ? error.message : 'Unknown error');
  }
}

export async function getInstitutionalPortfolio(args: unknown): Promise<ToolResult> {
  try {
    const { cik } = GetInstitutionalPortfolioSchema.parse(args);
    logger.info(`Getting institutional portfolio for ${cik}`);
    const data = await ownership.getInstitutionalPortfolio(cik);
    return createSuccessResult(data);
  } catch (error) {
    logger.error('Error:', error);
    return createErrorResult(error instanceof Error ? error.message : 'Unknown error');
  }
}

export async function getCongressTransactions(args: unknown): Promise<ToolResult> {
  try {
    const { symbol, from, to } = GetCongressTransactionsSchema.parse(args);
    logger.info(`Getting congress transactions`);
    const data = await ownership.getCongressTransactions(symbol, from, to);
    return createSuccessResult(data);
  } catch (error) {
    logger.error('Error:', error);
    return createErrorResult(error instanceof Error ? error.message : 'Unknown error');
  }
}

export const stockOwnershipTool = {
  name: 'finnhub_stock_ownership',
  description: 'Access insider transactions and institutional ownership data',
  operations: [
    { name: 'get_insider_transactions', description: 'Get insider trading transactions', parameters: { type: 'object', properties: { symbol: { type: 'string' }, from: { type: 'string' }, to: { type: 'string' } }, required: ['symbol', 'from', 'to'] } },
    { name: 'get_institutional_ownership', description: 'Get institutional ownership data', parameters: { type: 'object', properties: { symbol: { type: 'string' } }, required: ['symbol'] } },
    { name: 'get_institutional_portfolio', description: 'Get portfolio by CIK', parameters: { type: 'object', properties: { cik: { type: 'string' } }, required: ['cik'] } },
    { name: 'get_congress_transactions', description: 'Get congressional trading transactions', parameters: { type: 'object', properties: { symbol: { type: 'string' }, from: { type: 'string' }, to: { type: 'string' } } } },
  ],
};
