import { z } from 'zod';
import * as news from '../api/endpoints/news.js';
import { getLogger } from '../utils/logger.js';
import { 
  createSuccessResult, 
  createErrorResult, 
  SymbolSchema,
  formatDate,
  type ToolResult 
} from './_common.js';

const logger = getLogger('NewsSentimentTool');

// Schemas
const GetCompanyNewsSchema = z.object({
  symbol: SymbolSchema,
  from: z.string().optional(),
  to: z.string().optional(),
  days: z.number().default(7),
});

const GetMarketNewsSchema = z.object({
  category: z.enum(['general', 'forex', 'crypto', 'merger']).default('general'),
});

const GetNewsSentimentSchema = z.object({
  symbol: SymbolSchema,
});

const GetInsiderSentimentSchema = z.object({
  symbol: SymbolSchema,
  from: z.string(),
  to: z.string(),
});

export async function getCompanyNews(args: unknown): Promise<ToolResult> {
  try {
    const { symbol, from, to, days } = GetCompanyNewsSchema.parse(args);
    
    // Calculate date range
    const endDate = to ?? formatDate(new Date());
    const startDate = from ?? formatDate(new Date(Date.now() - days * 24 * 60 * 60 * 1000));
    
    logger.info(`Getting company news for ${symbol} from ${startDate} to ${endDate}`);
    
    const data = await news.getCompanyNews(symbol, startDate, endDate);
    return createSuccessResult(data);
  } catch (error) {
    logger.error('Error getting company news:', error);
    if (error instanceof z.ZodError) {
      return createErrorResult(`Validation error: ${error.errors.map((e: z.ZodIssue) => e.message).join(', ')}`);
    }
    return createErrorResult(error instanceof Error ? error.message : 'Unknown error');
  }
}

export async function getMarketNews(args: unknown): Promise<ToolResult> {
  try {
    const { category } = GetMarketNewsSchema.parse(args);
    logger.info(`Getting market news (${category})`);
    
    const data = await news.getMarketNews(category);
    return createSuccessResult(data);
  } catch (error) {
    logger.error('Error getting market news:', error);
    if (error instanceof z.ZodError) {
      return createErrorResult(`Validation error: ${error.errors.map((e: z.ZodIssue) => e.message).join(', ')}`);
    }
    return createErrorResult(error instanceof Error ? error.message : 'Unknown error');
  }
}

export async function getNewsSentiment(args: unknown): Promise<ToolResult> {
  try {
    const { symbol } = GetNewsSentimentSchema.parse(args);
    logger.info(`Getting news sentiment for ${symbol}`);
    
    const data = await news.getNewsSentiment(symbol);
    return createSuccessResult(data);
  } catch (error) {
    logger.error('Error getting news sentiment:', error);
    if (error instanceof z.ZodError) {
      return createErrorResult(`Validation error: ${error.errors.map((e: z.ZodIssue) => e.message).join(', ')}`);
    }
    return createErrorResult(error instanceof Error ? error.message : 'Unknown error');
  }
}

export async function getInsiderSentiment(args: unknown): Promise<ToolResult> {
  try {
    const { symbol, from, to } = GetInsiderSentimentSchema.parse(args);
    logger.info(`Getting insider sentiment for ${symbol}`);
    
    const data = await news.getInsiderSentiment(symbol, from, to);
    return createSuccessResult(data);
  } catch (error) {
    logger.error('Error getting insider sentiment:', error);
    if (error instanceof z.ZodError) {
      return createErrorResult(`Validation error: ${error.errors.map((e: z.ZodIssue) => e.message).join(', ')}`);
    }
    return createErrorResult(error instanceof Error ? error.message : 'Unknown error');
  }
}

// Tool definition for MCP
export const newsSentimentTool = {
  name: 'finnhub_news_sentiment',
  description: 'Access company news, market news, and sentiment analysis',
  operations: [
    {
      name: 'get_company_news',
      description: 'Get news articles for a specific company',
      parameters: {
        type: 'object',
        properties: {
          symbol: { type: 'string', description: 'Stock symbol' },
          from: { type: 'string', description: 'Start date (YYYY-MM-DD)' },
          to: { type: 'string', description: 'End date (YYYY-MM-DD)' },
          days: { type: 'number', default: 7, description: 'Number of days to fetch' },
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
          from: { type: 'string', description: 'Start date (YYYY-MM-DD)' },
          to: { type: 'string', description: 'End date (YYYY-MM-DD)' },
        },
        required: ['symbol', 'from', 'to'],
      },
    },
  ],
};
