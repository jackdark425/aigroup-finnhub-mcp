import { z } from 'zod';
import * as alternative from '../api/endpoints/alternative.js';
import { getLogger } from '../utils/logger.js';
import { createSmartResult, createErrorResult, SymbolSchema, type ToolResult } from './_common.js';
import { FinnhubError } from '../api/errors.js';

const logger = getLogger('AlternativeDataTool');

const DateStringSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format');

const GetESGScoreSchema = z.object({
  symbol: SymbolSchema,
  project: z.string().optional(),
  export: z.boolean().optional(),
});

const GetSocialSentimentSchema = z.object({
  symbol: SymbolSchema,
  from: DateStringSchema.optional(),
  to: DateStringSchema.optional(),
  project: z.string().optional(),
  export: z.boolean().optional(),
});

const GetSupplyChainSchema = z.object({
  symbol: SymbolSchema,
  project: z.string().optional(),
  export: z.boolean().optional(),
});

const GetPatentsSchema = z.object({
  symbol: SymbolSchema,
  project: z.string().optional(),
  export: z.boolean().optional(),
});

export async function getESGScore(args: unknown): Promise<ToolResult> {
  try {
    const { symbol, project, export: forceExport } = GetESGScoreSchema.parse(args);
    logger.info(`Getting ESG score for ${symbol}`);
    const data = await alternative.getESGScore(symbol);
    
    // Check for empty data (ESG data often requires paid subscription)
    if (!data || (Array.isArray(data) && data.length === 0) || (typeof data === 'object' && Object.keys(data).length === 0)) {
      return createErrorResult('No ESG data available for the specified criteria. Note: ESG data may require a paid Finnhub subscription.');
    }
    
    return createSmartResult(data, {
      project,
      export: forceExport,
      subdir: 'alternative',
      filename: `${symbol.toLowerCase()}-esg.json`,
    });
  } catch (error) {
    logger.error('Error getting ESG score:', error);
    if (error instanceof z.ZodError) {
      return createErrorResult(`Validation error: ${error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')}`);
    }
    if (error instanceof FinnhubError) {
      return createErrorResult(`API error: ${error.message}`);
    }
    return createErrorResult(error instanceof Error ? error.message : 'Unknown error');
  }
}

export async function getSocialSentiment(args: unknown): Promise<ToolResult> {
  try {
    const { symbol, from, to, project, export: forceExport } = GetSocialSentimentSchema.parse(args);
    logger.info(`Getting social sentiment for ${symbol}`);
    const data = await alternative.getSocialSentiment(symbol, from, to);
    
    // Check for empty data (social sentiment often requires paid subscription)
    if (!data || (Array.isArray(data) && data.length === 0) || (typeof data === 'object' && Object.keys(data).length === 0)) {
      return createErrorResult('No social sentiment data available for the specified criteria. Note: Social sentiment data may require a paid Finnhub subscription.');
    }
    
    return createSmartResult(data, {
      project,
      export: forceExport,
      subdir: 'alternative',
      filename: `${symbol.toLowerCase()}-social-sentiment${from ? `-${from}` : ''}${to ? `-${to}` : ''}.json`,
    });
  } catch (error) {
    logger.error('Error getting social sentiment:', error);
    if (error instanceof z.ZodError) {
      return createErrorResult(`Validation error: ${error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')}`);
    }
    if (error instanceof FinnhubError) {
      return createErrorResult(`API error: ${error.message}`);
    }
    return createErrorResult(error instanceof Error ? error.message : 'Unknown error');
  }
}

export async function getSupplyChain(args: unknown): Promise<ToolResult> {
  try {
    const { symbol, project, export: forceExport } = GetSupplyChainSchema.parse(args);
    logger.info(`Getting supply chain for ${symbol}`);
    const data = await alternative.getSupplyChain(symbol);
    return createSmartResult(data, {
      project,
      export: forceExport,
      subdir: 'alternative',
      filename: `${symbol.toLowerCase()}-supply-chain.json`,
    });
  } catch (error) {
    logger.error('Error getting supply chain:', error);
    if (error instanceof z.ZodError) {
      return createErrorResult(`Validation error: ${error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')}`);
    }
    if (error instanceof FinnhubError) {
      return createErrorResult(`API error: ${error.message}`);
    }
    return createErrorResult(error instanceof Error ? error.message : 'Unknown error');
  }
}

export async function getPatents(args: unknown): Promise<ToolResult> {
  try {
    const { symbol, project, export: forceExport } = GetPatentsSchema.parse(args);
    logger.info(`Getting patents for ${symbol}`);
    const data = await alternative.getPatents(symbol);
    return createSmartResult(data, {
      project,
      export: forceExport,
      subdir: 'alternative',
      filename: `${symbol.toLowerCase()}-patents.json`,
    });
  } catch (error) {
    logger.error('Error getting patents:', error);
    if (error instanceof z.ZodError) {
      return createErrorResult(`Validation error: ${error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')}`);
    }
    if (error instanceof FinnhubError) {
      return createErrorResult(`API error: ${error.message}`);
    }
    return createErrorResult(error instanceof Error ? error.message : 'Unknown error');
  }
}

export const alternativeDataTool = {
  name: 'finnhub_alternative_data',
  description: 'Access alternative data including ESG scores, social sentiment, and patents. Supports JSON export for large datasets.',
  operations: [
    {
      name: 'get_esg_score',
      description: 'Get ESG (Environmental, Social, Governance) scores',
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
      name: 'get_social_sentiment',
      description: 'Get social media sentiment',
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
      name: 'get_supply_chain',
      description: 'Get supply chain relationships',
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
      name: 'get_patents',
      description: 'Get patent data',
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
