import { z } from 'zod';
import * as estimates from '../api/endpoints/estimates.js';
import { getLogger } from '../utils/logger.js';
import { createSuccessResult, createErrorResult, SymbolSchema, type ToolResult } from './_common.js';

const logger = getLogger('StockEstimatesTool');

const GetEarningsEstimatesSchema = z.object({ symbol: SymbolSchema });
const GetRevenueEstimatesSchema = z.object({ symbol: SymbolSchema });
const GetEbitdaEstimatesSchema = z.object({ symbol: SymbolSchema });
const GetPriceTargetSchema = z.object({ symbol: SymbolSchema });
const GetRecommendationTrendsSchema = z.object({ symbol: SymbolSchema });

export async function getEarningsEstimates(args: unknown): Promise<ToolResult> {
  try {
    const { symbol } = GetEarningsEstimatesSchema.parse(args);
    logger.info(`Getting earnings estimates for ${symbol}`);
    const data = await estimates.getEarningsEstimates(symbol);
    return createSuccessResult(data);
  } catch (error) {
    logger.error('Error:', error);
    return createErrorResult(error instanceof Error ? error.message : 'Unknown error');
  }
}

export async function getRevenueEstimates(args: unknown): Promise<ToolResult> {
  try {
    const { symbol } = GetRevenueEstimatesSchema.parse(args);
    logger.info(`Getting revenue estimates for ${symbol}`);
    const data = await estimates.getRevenueEstimates(symbol);
    return createSuccessResult(data);
  } catch (error) {
    logger.error('Error:', error);
    return createErrorResult(error instanceof Error ? error.message : 'Unknown error');
  }
}

export async function getEbitdaEstimates(args: unknown): Promise<ToolResult> {
  try {
    const { symbol } = GetEbitdaEstimatesSchema.parse(args);
    logger.info(`Getting EBITDA estimates for ${symbol}`);
    const data = await estimates.getEbitdaEstimates(symbol);
    return createSuccessResult(data);
  } catch (error) {
    logger.error('Error:', error);
    return createErrorResult(error instanceof Error ? error.message : 'Unknown error');
  }
}

export async function getPriceTarget(args: unknown): Promise<ToolResult> {
  try {
    const { symbol } = GetPriceTargetSchema.parse(args);
    logger.info(`Getting price target for ${symbol}`);
    const data = await estimates.getPriceTarget(symbol);
    return createSuccessResult(data);
  } catch (error) {
    logger.error('Error:', error);
    return createErrorResult(error instanceof Error ? error.message : 'Unknown error');
  }
}

export async function getRecommendationTrends(args: unknown): Promise<ToolResult> {
  try {
    const { symbol } = GetRecommendationTrendsSchema.parse(args);
    logger.info(`Getting recommendation trends for ${symbol}`);
    const data = await estimates.getRecommendationTrends(symbol);
    return createSuccessResult(data);
  } catch (error) {
    logger.error('Error:', error);
    return createErrorResult(error instanceof Error ? error.message : 'Unknown error');
  }
}

export const stockEstimatesTool = {
  name: 'finnhub_stock_estimates',
  description: 'Access analyst estimates and recommendations',
  operations: [
    { name: 'get_earnings_estimates', description: 'Get earnings per share estimates', parameters: { type: 'object', properties: { symbol: { type: 'string' } }, required: ['symbol'] } },
    { name: 'get_revenue_estimates', description: 'Get revenue estimates', parameters: { type: 'object', properties: { symbol: { type: 'string' } }, required: ['symbol'] } },
    { name: 'get_ebitda_estimates', description: 'Get EBITDA estimates', parameters: { type: 'object', properties: { symbol: { type: 'string' } }, required: ['symbol'] } },
    { name: 'get_price_target', description: 'Get analyst price targets', parameters: { type: 'object', properties: { symbol: { type: 'string' } }, required: ['symbol'] } },
    { name: 'get_recommendation_trends', description: 'Get buy/hold/sell recommendations', parameters: { type: 'object', properties: { symbol: { type: 'string' } }, required: ['symbol'] } },
  ],
};
