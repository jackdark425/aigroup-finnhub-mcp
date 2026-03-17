import { z } from 'zod';
import * as events from '../api/endpoints/events.js';
import { getLogger } from '../utils/logger.js';
import { createSuccessResult, createErrorResult, SymbolSchema, type ToolResult } from './_common.js';

const logger = getLogger('MarketEventsTool');

const GetMarketHolidaysSchema = z.object({ exchange: z.string() });
const GetAnalystRatingsSchema = z.object({ symbol: SymbolSchema });

export async function getMarketHolidays(args: unknown): Promise<ToolResult> {
  try {
    const { exchange } = GetMarketHolidaysSchema.parse(args);
    logger.info(`Getting market holidays for ${exchange}`);
    const data = await events.getMarketHolidays(exchange);
    return createSuccessResult(data);
  } catch (error) {
    logger.error('Error:', error);
    return createErrorResult(error instanceof Error ? error.message : 'Unknown error');
  }
}

export async function getAnalystRatings(args: unknown): Promise<ToolResult> {
  try {
    const { symbol } = GetAnalystRatingsSchema.parse(args);
    logger.info(`Getting analyst ratings for ${symbol}`);
    const data = await events.getAnalystRatings(symbol);
    return createSuccessResult(data);
  } catch (error) {
    logger.error('Error:', error);
    return createErrorResult(error instanceof Error ? error.message : 'Unknown error');
  }
}

export async function getMergerAcquisitions(): Promise<ToolResult> {
  try {
    logger.info('Getting merger and acquisitions data');
    const data = await events.getMergerAcquisitions();
    return createSuccessResult(data);
  } catch (error) {
    logger.error('Error:', error);
    return createErrorResult(error instanceof Error ? error.message : 'Unknown error');
  }
}

export const marketEventsTool = {
  name: 'finnhub_market_events',
  description: 'Access market holidays, analyst ratings, and M&A activity',
  operations: [
    { name: 'get_market_holidays', description: 'Get market holidays for an exchange', parameters: { type: 'object', properties: { exchange: { type: 'string' } }, required: ['exchange'] } },
    { name: 'get_analyst_ratings', description: 'Get analyst rating changes', parameters: { type: 'object', properties: { symbol: { type: 'string' } }, required: ['symbol'] } },
    { name: 'get_merger_acquisitions', description: 'Get merger and acquisition activity', parameters: { type: 'object', properties: {} } },
  ],
};
