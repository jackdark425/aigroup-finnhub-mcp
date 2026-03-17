import { z } from 'zod';
import * as fundamentals from '../api/endpoints/fundamentals.js';
import { getLogger } from '../utils/logger.js';
import { createSuccessResult, createErrorResult, SymbolSchema, type ToolResult } from './_common.js';

const logger = getLogger('FundamentalsTool');

const GetBasicFinancialsSchema = z.object({ symbol: SymbolSchema, metricType: z.enum(['all', 'price', 'valuation', 'growth']).default('all') });
const GetFinancialsAsReportedSchema = z.object({ symbol: SymbolSchema, freq: z.enum(['annual', 'quarterly']).default('annual') });
const GetDividendsSchema = z.object({ symbol: SymbolSchema, from: z.string(), to: z.string() });
const GetStockSplitsSchema = z.object({ symbol: SymbolSchema, from: z.string(), to: z.string() });
const GetRevenueBreakdownSchema = z.object({ symbol: SymbolSchema });

export async function getBasicFinancials(args: unknown): Promise<ToolResult> {
  try {
    const { symbol, metricType } = GetBasicFinancialsSchema.parse(args);
    logger.info(`Getting basic financials for ${symbol}`);
    const data = await fundamentals.getBasicFinancials(symbol, metricType);
    return createSuccessResult(data);
  } catch (error) {
    logger.error('Error:', error);
    return createErrorResult(error instanceof Error ? error.message : 'Unknown error');
  }
}

export async function getFinancialsAsReported(args: unknown): Promise<ToolResult> {
  try {
    const { symbol, freq } = GetFinancialsAsReportedSchema.parse(args);
    logger.info(`Getting financials as reported for ${symbol}`);
    const data = await fundamentals.getFinancialsAsReported(symbol, freq);
    return createSuccessResult(data);
  } catch (error) {
    logger.error('Error:', error);
    return createErrorResult(error instanceof Error ? error.message : 'Unknown error');
  }
}

export async function getDividends(args: unknown): Promise<ToolResult> {
  try {
    const { symbol, from, to } = GetDividendsSchema.parse(args);
    logger.info(`Getting dividends for ${symbol}`);
    const data = await fundamentals.getDividends(symbol, from, to);
    return createSuccessResult(data);
  } catch (error) {
    logger.error('Error:', error);
    return createErrorResult(error instanceof Error ? error.message : 'Unknown error');
  }
}

export async function getStockSplits(args: unknown): Promise<ToolResult> {
  try {
    const { symbol, from, to } = GetStockSplitsSchema.parse(args);
    logger.info(`Getting stock splits for ${symbol}`);
    const data = await fundamentals.getStockSplits(symbol, from, to);
    return createSuccessResult(data);
  } catch (error) {
    logger.error('Error:', error);
    return createErrorResult(error instanceof Error ? error.message : 'Unknown error');
  }
}

export async function getRevenueBreakdown(args: unknown): Promise<ToolResult> {
  try {
    const { symbol } = GetRevenueBreakdownSchema.parse(args);
    logger.info(`Getting revenue breakdown for ${symbol}`);
    const data = await fundamentals.getRevenueBreakdown(symbol);
    return createSuccessResult(data);
  } catch (error) {
    logger.error('Error:', error);
    return createErrorResult(error instanceof Error ? error.message : 'Unknown error');
  }
}

export const fundamentalsTool = {
  name: 'finnhub_stock_fundamentals',
  description: 'Access fundamental financial data including metrics, dividends, and revenue breakdown',
  operations: [
    { name: 'get_basic_financials', description: 'Get basic financial metrics', parameters: { type: 'object', properties: { symbol: { type: 'string' }, metricType: { type: 'string', enum: ['all', 'price', 'valuation', 'growth'], default: 'all' } }, required: ['symbol'] } },
    { name: 'get_financials_as_reported', description: 'Get financial statements', parameters: { type: 'object', properties: { symbol: { type: 'string' }, freq: { type: 'string', enum: ['annual', 'quarterly'], default: 'annual' } }, required: ['symbol'] } },
    { name: 'get_dividends', description: 'Get dividend history', parameters: { type: 'object', properties: { symbol: { type: 'string' }, from: { type: 'string' }, to: { type: 'string' } }, required: ['symbol', 'from', 'to'] } },
    { name: 'get_stock_splits', description: 'Get stock split history', parameters: { type: 'object', properties: { symbol: { type: 'string' }, from: { type: 'string' }, to: { type: 'string' } }, required: ['symbol', 'from', 'to'] } },
    { name: 'get_revenue_breakdown', description: 'Get revenue breakdown by segment', parameters: { type: 'object', properties: { symbol: { type: 'string' } }, required: ['symbol'] } },
  ],
};
