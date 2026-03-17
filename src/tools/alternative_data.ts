import { z } from 'zod';
import * as alternative from '../api/endpoints/alternative.js';
import { getLogger } from '../utils/logger.js';
import { createSuccessResult, createErrorResult, SymbolSchema, type ToolResult } from './_common.js';

const logger = getLogger('AlternativeDataTool');

const GetESGScoreSchema = z.object({ symbol: SymbolSchema });
const GetSocialSentimentSchema = z.object({
  symbol: SymbolSchema,
  from: z.string().optional(),
  to: z.string().optional(),
});
const GetSupplyChainSchema = z.object({ symbol: SymbolSchema });
const GetPatentsSchema = z.object({ symbol: SymbolSchema });

export async function getESGScore(args: unknown): Promise<ToolResult> {
  try {
    const { symbol } = GetESGScoreSchema.parse(args);
    logger.info(`Getting ESG score for ${symbol}`);
    const data = await alternative.getESGScore(symbol);
    return createSuccessResult(data);
  } catch (error) {
    logger.error('Error:', error);
    return createErrorResult(error instanceof Error ? error.message : 'Unknown error');
  }
}

export async function getSocialSentiment(args: unknown): Promise<ToolResult> {
  try {
    const { symbol, from, to } = GetSocialSentimentSchema.parse(args);
    logger.info(`Getting social sentiment for ${symbol}`);
    const data = await alternative.getSocialSentiment(symbol, from, to);
    return createSuccessResult(data);
  } catch (error) {
    logger.error('Error:', error);
    return createErrorResult(error instanceof Error ? error.message : 'Unknown error');
  }
}

export async function getSupplyChain(args: unknown): Promise<ToolResult> {
  try {
    const { symbol } = GetSupplyChainSchema.parse(args);
    logger.info(`Getting supply chain for ${symbol}`);
    const data = await alternative.getSupplyChain(symbol);
    return createSuccessResult(data);
  } catch (error) {
    logger.error('Error:', error);
    return createErrorResult(error instanceof Error ? error.message : 'Unknown error');
  }
}

export async function getPatents(args: unknown): Promise<ToolResult> {
  try {
    const { symbol } = GetPatentsSchema.parse(args);
    logger.info(`Getting patents for ${symbol}`);
    const data = await alternative.getPatents(symbol);
    return createSuccessResult(data);
  } catch (error) {
    logger.error('Error:', error);
    return createErrorResult(error instanceof Error ? error.message : 'Unknown error');
  }
}

export const alternativeDataTool = {
  name: 'finnhub_alternative_data',
  description: 'Access alternative data including ESG scores, social sentiment, and patents',
  operations: [
    { name: 'get_esg_score', description: 'Get ESG (Environmental, Social, Governance) scores', parameters: { type: 'object', properties: { symbol: { type: 'string' } }, required: ['symbol'] } },
    { name: 'get_social_sentiment', description: 'Get social media sentiment', parameters: { type: 'object', properties: { symbol: { type: 'string' }, from: { type: 'string' }, to: { type: 'string' } }, required: ['symbol'] } },
    { name: 'get_supply_chain', description: 'Get supply chain relationships', parameters: { type: 'object', properties: { symbol: { type: 'string' } }, required: ['symbol'] } },
    { name: 'get_patents', description: 'Get patent data', parameters: { type: 'object', properties: { symbol: { type: 'string' } }, required: ['symbol'] } },
  ],
};
