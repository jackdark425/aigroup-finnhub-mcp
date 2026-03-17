import { z } from 'zod';
import * as filings from '../api/endpoints/filings.js';
import { getLogger } from '../utils/logger.js';
import { createSuccessResult, createErrorResult, SymbolSchema, type ToolResult } from './_common.js';

const logger = getLogger('SECFilingsTool');

const GetSECFilingsSchema = z.object({
  symbol: SymbolSchema,
  form: z.string().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
});

const GetFilingSentimentSchema = z.object({ symbol: SymbolSchema });
const GetSimilarityIndexSchema = z.object({ symbol: SymbolSchema });

export async function getSECFilings(args: unknown): Promise<ToolResult> {
  try {
    const { symbol, form, from, to } = GetSECFilingsSchema.parse(args);
    logger.info(`Getting SEC filings for ${symbol}`);
    const data = await filings.getSECFilings(symbol, form, from, to);
    return createSuccessResult(data);
  } catch (error) {
    logger.error('Error:', error);
    return createErrorResult(error instanceof Error ? error.message : 'Unknown error');
  }
}

export async function getFilingSentiment(args: unknown): Promise<ToolResult> {
  try {
    const { symbol } = GetFilingSentimentSchema.parse(args);
    logger.info(`Getting filing sentiment for ${symbol}`);
    const data = await filings.getFilingSentiment(symbol);
    return createSuccessResult(data);
  } catch (error) {
    logger.error('Error:', error);
    return createErrorResult(error instanceof Error ? error.message : 'Unknown error');
  }
}

export async function getSimilarityIndex(args: unknown): Promise<ToolResult> {
  try {
    const { symbol } = GetSimilarityIndexSchema.parse(args);
    logger.info(`Getting similarity index for ${symbol}`);
    const data = await filings.getSimilarityIndex(symbol);
    return createSuccessResult(data);
  } catch (error) {
    logger.error('Error:', error);
    return createErrorResult(error instanceof Error ? error.message : 'Unknown error');
  }
}

export const secFilingsTool = {
  name: 'finnhub_sec_filings',
  description: 'Access SEC filings and filing sentiment analysis',
  operations: [
    { name: 'get_sec_filings', description: 'Get SEC filings (10-K, 10-Q, etc.)', parameters: { type: 'object', properties: { symbol: { type: 'string' }, form: { type: 'string' }, from: { type: 'string' }, to: { type: 'string' } }, required: ['symbol'] } },
    { name: 'get_filing_sentiment', description: 'Get sentiment analysis of filings', parameters: { type: 'object', properties: { symbol: { type: 'string' } }, required: ['symbol'] } },
    { name: 'get_similarity_index', description: 'Get filing similarity index', parameters: { type: 'object', properties: { symbol: { type: 'string' } }, required: ['symbol'] } },
  ],
};
