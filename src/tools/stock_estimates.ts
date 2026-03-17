import { z } from 'zod';
import * as estimates from '../api/endpoints/estimates.js';
import { getLogger } from '../utils/logger.js';
import { createSmartResult, createErrorResult, SymbolSchema, type ToolResult } from './_common.js';

const logger = getLogger('StockEstimatesTool');

const GetEarningsEstimatesSchema = z.object({
  symbol: SymbolSchema,
  project: z.string().optional(),
  export: z.boolean().optional(),
});

const GetRevenueEstimatesSchema = z.object({
  symbol: SymbolSchema,
  project: z.string().optional(),
  export: z.boolean().optional(),
});

const GetEbitdaEstimatesSchema = z.object({
  symbol: SymbolSchema,
  project: z.string().optional(),
  export: z.boolean().optional(),
});

const GetPriceTargetSchema = z.object({
  symbol: SymbolSchema,
  project: z.string().optional(),
  export: z.boolean().optional(),
});

const GetRecommendationTrendsSchema = z.object({
  symbol: SymbolSchema,
  project: z.string().optional(),
  export: z.boolean().optional(),
});

export async function getEarningsEstimates(args: unknown): Promise<ToolResult> {
  try {
    const { symbol, project, export: forceExport } = GetEarningsEstimatesSchema.parse(args);
    logger.info(`Getting earnings estimates for ${symbol}`);
    const data = await estimates.getEarningsEstimates(symbol);
    return createSmartResult(data, {
      project,
      export: forceExport,
      subdir: 'market-data',
      filename: `${symbol.toLowerCase()}-earnings-estimates.json`,
    });
  } catch (error) {
    logger.error('Error:', error);
    return createErrorResult(error instanceof Error ? error.message : 'Unknown error');
  }
}

export async function getRevenueEstimates(args: unknown): Promise<ToolResult> {
  try {
    const { symbol, project, export: forceExport } = GetRevenueEstimatesSchema.parse(args);
    logger.info(`Getting revenue estimates for ${symbol}`);
    const data = await estimates.getRevenueEstimates(symbol);
    return createSmartResult(data, {
      project,
      export: forceExport,
      subdir: 'market-data',
      filename: `${symbol.toLowerCase()}-revenue-estimates.json`,
    });
  } catch (error) {
    logger.error('Error:', error);
    return createErrorResult(error instanceof Error ? error.message : 'Unknown error');
  }
}

export async function getEbitdaEstimates(args: unknown): Promise<ToolResult> {
  try {
    const { symbol, project, export: forceExport } = GetEbitdaEstimatesSchema.parse(args);
    logger.info(`Getting EBITDA estimates for ${symbol}`);
    const data = await estimates.getEbitdaEstimates(symbol);
    return createSmartResult(data, {
      project,
      export: forceExport,
      subdir: 'market-data',
      filename: `${symbol.toLowerCase()}-ebitda-estimates.json`,
    });
  } catch (error) {
    logger.error('Error:', error);
    return createErrorResult(error instanceof Error ? error.message : 'Unknown error');
  }
}

export async function getPriceTarget(args: unknown): Promise<ToolResult> {
  try {
    const { symbol, project, export: forceExport } = GetPriceTargetSchema.parse(args);
    logger.info(`Getting price target for ${symbol}`);
    const data = await estimates.getPriceTarget(symbol);
    return createSmartResult(data, {
      project,
      export: forceExport,
      subdir: 'market-data',
      filename: `${symbol.toLowerCase()}-price-target.json`,
    });
  } catch (error) {
    logger.error('Error:', error);
    return createErrorResult(error instanceof Error ? error.message : 'Unknown error');
  }
}

export async function getRecommendationTrends(args: unknown): Promise<ToolResult> {
  try {
    const { symbol, project, export: forceExport } = GetRecommendationTrendsSchema.parse(args);
    logger.info(`Getting recommendation trends for ${symbol}`);
    const data = await estimates.getRecommendationTrends(symbol);
    return createSmartResult(data, {
      project,
      export: forceExport,
      subdir: 'market-data',
      filename: `${symbol.toLowerCase()}-recommendations.json`,
    });
  } catch (error) {
    logger.error('Error:', error);
    return createErrorResult(error instanceof Error ? error.message : 'Unknown error');
  }
}

export const stockEstimatesTool = {
  name: 'finnhub_stock_estimates',
  description: 'Access analyst estimates and recommendations. Supports JSON export for large datasets.',
  operations: [
    {
      name: 'get_earnings_estimates',
      description: 'Get earnings per share estimates',
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
      name: 'get_revenue_estimates',
      description: 'Get revenue estimates',
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
      name: 'get_ebitda_estimates',
      description: 'Get EBITDA estimates',
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
      name: 'get_price_target',
      description: 'Get analyst price targets',
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
      name: 'get_recommendation_trends',
      description: 'Get buy/hold/sell recommendations',
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
