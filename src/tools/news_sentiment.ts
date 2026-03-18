import { z } from 'zod';
import * as news from '../api/endpoints/news.js';
import { getLogger } from '../utils/logger.js';
import {
  createSmartResult,
  createErrorResult,
  SymbolSchema,
  formatDate,
  getDateDaysAgo,
  type ToolResult
} from './_common.js';
import { FinnhubError } from '../api/errors.js';

const logger = getLogger('NewsSentimentTool');

const DateStringSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format');

// Schemas
const GetCompanyNewsSchema = z.object({
  symbol: SymbolSchema,
  from: DateStringSchema.optional(),
  to: DateStringSchema.optional(),
  days: z.number().default(7),
  project: z.string().optional(),
  export: z.boolean().optional(),
});

const GetMarketNewsSchema = z.object({
  category: z.enum(['general', 'forex', 'crypto', 'merger']).default('general'),
  project: z.string().optional(),
  export: z.boolean().optional(),
});

const GetNewsSentimentSchema = z.object({
  symbol: SymbolSchema,
  project: z.string().optional(),
  export: z.boolean().optional(),
});

const GetInsiderSentimentSchema = z.object({
  symbol: SymbolSchema,
  from: DateStringSchema.optional(),
  to: DateStringSchema.optional(),
  project: z.string().optional(),
  export: z.boolean().optional(),
});

export async function getCompanyNews(args: unknown): Promise<ToolResult> {
  try {
    const { symbol, from, to, days, project, export: forceExport } = GetCompanyNewsSchema.parse(args);

    // Calculate date range
    const endDate = to ?? formatDate(new Date());
    const startDate = from ?? getDateDaysAgo(days);

    logger.info(`Getting company news for ${symbol} from ${startDate} to ${endDate}`);

    const data = await news.getCompanyNews(symbol, startDate, endDate);
    return createSmartResult(data, {
      project,
      export: forceExport,
      subdir: 'news',
      filename: `${symbol.toLowerCase()}-news-${startDate}-${endDate}.json`,
    });
  } catch (error) {
    logger.error('Error getting company news:', error);
    if (error instanceof z.ZodError) {
      return createErrorResult(`Validation error: ${error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')}`);
    }
    if (error instanceof FinnhubError) {
      return createErrorResult(`API error: ${error.message}`);
    }
    return createErrorResult(error instanceof Error ? error.message : 'Unknown error');
  }
}

export async function getMarketNews(args: unknown): Promise<ToolResult> {
  try {
    const { category, project, export: forceExport } = GetMarketNewsSchema.parse(args);
    logger.info(`Getting market news (${category})`);

    const data = await news.getMarketNews(category);
    return createSmartResult(data, {
      project,
      export: forceExport,
      subdir: 'news',
      filename: `market-news-${category}.json`,
    });
  } catch (error) {
    logger.error('Error getting market news:', error);
    if (error instanceof z.ZodError) {
      return createErrorResult(`Validation error: ${error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')}`);
    }
    if (error instanceof FinnhubError) {
      return createErrorResult(`API error: ${error.message}`);
    }
    return createErrorResult(error instanceof Error ? error.message : 'Unknown error');
  }
}

export async function getNewsSentiment(args: unknown): Promise<ToolResult> {
  try {
    const { symbol, project, export: forceExport } = GetNewsSentimentSchema.parse(args);
    logger.info(`Getting news sentiment for ${symbol}`);

    const data = await news.getNewsSentiment(symbol);
    return createSmartResult(data, {
      project,
      export: forceExport,
      subdir: 'news',
      filename: `${symbol.toLowerCase()}-sentiment.json`,
    });
  } catch (error) {
    logger.error('Error getting news sentiment:', error);
    if (error instanceof z.ZodError) {
      return createErrorResult(`Validation error: ${error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')}`);
    }
    if (error instanceof FinnhubError) {
      return createErrorResult(`API error: ${error.message}`);
    }
    return createErrorResult(error instanceof Error ? error.message : 'Unknown error');
  }
}

export async function getInsiderSentiment(args: unknown): Promise<ToolResult> {
  try {
    const { symbol, from, to, project, export: forceExport } = GetInsiderSentimentSchema.parse(args);
    logger.info(`Getting insider sentiment for ${symbol}`);

    const data = await news.getInsiderSentiment(symbol, from, to);
    return createSmartResult(data, {
      project,
      export: forceExport,
      subdir: 'news',
      filename: `${symbol.toLowerCase()}-insider-sentiment-${from ?? 'all'}-${to ?? 'all'}.json`,
    });
  } catch (error) {
    logger.error('Error getting insider sentiment:', error);
    if (error instanceof z.ZodError) {
      return createErrorResult(`Validation error: ${error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')}`);
    }
    if (error instanceof FinnhubError) {
      return createErrorResult(`API error: ${error.message}`);
    }
    return createErrorResult(error instanceof Error ? error.message : 'Unknown error');
  }
}

// Tool definition for MCP
export const newsSentimentTool = {
  name: 'finnhub_news_sentiment',
  description: 'Access company news, market news, and sentiment analysis. Supports JSON export for large datasets.',
  operations: [
    {
      name: 'get_company_news',
      description: 'Get news articles for a specific company',
      parameters: {
        type: 'object',
        properties: {
          symbol: { type: 'string', description: 'Stock symbol' },
          from: { type: 'string', description: 'Start date in YYYY-MM-DD format (optional)' },
          to: { type: 'string', description: 'End date in YYYY-MM-DD format (optional)' },
          days: { type: 'number', default: 7, description: 'Number of days to fetch' },
          project: { type: 'string', description: 'Project name for saving data' },
          export: { type: 'boolean', description: 'Force export to JSON file' },
        },
        required: ['symbol'],
      },
    },
    {
      name: 'get_market_news',
      description: 'Get general market news',
      parameters: {
        type: 'object',
        properties: {
          category: { type: 'string', enum: ['general', 'forex', 'crypto', 'merger'], default: 'general' },
          project: { type: 'string', description: 'Project name for saving data' },
          export: { type: 'boolean', description: 'Force export to JSON file' },
        },
      },
    },
    {
      name: 'get_news_sentiment',
      description: 'Get news sentiment score for a company',
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
      name: 'get_insider_sentiment',
      description: 'Get insider trading sentiment',
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
  ],
};
