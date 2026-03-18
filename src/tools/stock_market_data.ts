import { z } from 'zod';
import * as market from '../api/endpoints/market.js';
import { getLogger } from '../utils/logger.js';
import {
  createSmartResult,
  createErrorResult,
  SymbolSchema,
  getUnixDaysAgo,
  getUnixTimestamp,
  type ToolResult
} from './_common.js';
import { FinnhubError } from '../api/errors.js';

const logger = getLogger('StockMarketDataTool');

// Operation schemas
const GetQuoteSchema = z.object({
  symbol: SymbolSchema,
  project: z.string().optional(),
  export: z.boolean().optional(),
});

const GetCandlesSchema = z.object({
  symbol: SymbolSchema,
  resolution: z.enum(['1', '5', '15', '30', '60', 'D', 'W', 'M']),
  from: z.number().optional(),
  to: z.number().optional(),
  days: z.number().default(30),
  project: z.string().optional(),
  export: z.boolean().optional(),
});

const GetCompanyProfileSchema = z.object({
  symbol: SymbolSchema,
  project: z.string().optional(),
  export: z.boolean().optional(),
});

const SymbolLookupSchema = z.object({
  query: z.string().min(1),
  project: z.string().optional(),
  export: z.boolean().optional(),
});

const GetBasicFinancialsSchema = z.object({
  symbol: SymbolSchema,
  metricType: z.enum(['all', 'price', 'valuation', 'growth']).default('all'),
  project: z.string().optional(),
  export: z.boolean().optional(),
});

const GetFinancialsAsReportedSchema = z.object({
  symbol: SymbolSchema,
  freq: z.enum(['annual', 'quarterly']).default('annual'),
  project: z.string().optional(),
  export: z.boolean().optional(),
});

const GetEarningsSurprisesSchema = z.object({
  symbol: SymbolSchema,
  project: z.string().optional(),
  export: z.boolean().optional(),
});

export async function getQuote(args: unknown): Promise<ToolResult> {
  try {
    const { symbol, project, export: forceExport } = GetQuoteSchema.parse(args);
    logger.info(`Getting quote for ${symbol}`);
    
    const data = await market.getQuote(symbol);
    return createSmartResult(data, {
      project,
      export: forceExport,
      subdir: 'market-data',
      filename: `${symbol.toLowerCase()}-quote.json`,
    });
  } catch (error) {
    logger.error('Error getting quote:', error);
    if (error instanceof z.ZodError) {
      return createErrorResult(`Validation error: ${error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')}`);
    }
    if (error instanceof FinnhubError) {
      return createErrorResult(`API error: ${error.message}`);
    }
    return createErrorResult(error instanceof Error ? error.message : 'Unknown error');
  }
}

export async function getCandles(args: unknown): Promise<ToolResult> {
  try {
    const { symbol, resolution, days, project, export: forceExport } = GetCandlesSchema.parse(args);
    let { from, to } = GetCandlesSchema.parse(args);
    
    // Set default date range if not provided
    if (!from || !to) {
      to = getUnixTimestamp();
      from = getUnixDaysAgo(days);
    }
    
    logger.info(`Getting candles for ${symbol} (${resolution}) from ${from} to ${to}`);
    
    const data = await market.getCandles(symbol, resolution, from, to);
    
    if (data.s === 'no_data') {
      return createErrorResult('No data available for the specified period');
    }
    
    return createSmartResult(data, {
      project,
      export: forceExport,
      subdir: 'market-data',
      filename: `${symbol.toLowerCase()}-candles-${resolution}.json`,
    });
  } catch (error) {
    logger.error('Error getting candles:', error);
    if (error instanceof z.ZodError) {
      return createErrorResult(`Validation error: ${error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')}`);
    }
    if (error instanceof FinnhubError) {
      return createErrorResult(`API error: ${error.message}`);
    }
    return createErrorResult(error instanceof Error ? error.message : 'Unknown error');
  }
}

export async function getCompanyProfile(args: unknown): Promise<ToolResult> {
  try {
    const { symbol, project, export: forceExport } = GetCompanyProfileSchema.parse(args);
    logger.info(`Getting company profile for ${symbol}`);
    
    const data = await market.getCompanyProfile(symbol);
    return createSmartResult(data, {
      project,
      export: forceExport,
      subdir: 'market-data',
      filename: `${symbol.toLowerCase()}-profile.json`,
    });
  } catch (error) {
    logger.error('Error getting company profile:', error);
    if (error instanceof z.ZodError) {
      return createErrorResult(`Validation error: ${error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')}`);
    }
    if (error instanceof FinnhubError) {
      return createErrorResult(`API error: ${error.message}`);
    }
    return createErrorResult(error instanceof Error ? error.message : 'Unknown error');
  }
}

export async function symbolLookup(args: unknown): Promise<ToolResult> {
  try {
    const { query, project, export: forceExport } = SymbolLookupSchema.parse(args);
    logger.info(`Looking up symbols for: ${query}`);
    
    const data = await market.symbolLookup(query);
    return createSmartResult(data, {
      project,
      export: forceExport,
      subdir: 'market-data',
      filename: `lookup-${query.toLowerCase().replace(/\s+/g, '-')}.json`,
    });
  } catch (error) {
    logger.error('Error looking up symbol:', error);
    if (error instanceof z.ZodError) {
      return createErrorResult(`Validation error: ${error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')}`);
    }
    if (error instanceof FinnhubError) {
      return createErrorResult(`API error: ${error.message}`);
    }
    return createErrorResult(error instanceof Error ? error.message : 'Unknown error');
  }
}

export async function getBasicFinancials(args: unknown): Promise<ToolResult> {
  try {
    const { symbol, metricType, project, export: forceExport } = GetBasicFinancialsSchema.parse(args);
    logger.info(`Getting basic financials for ${symbol} (${metricType})`);
    
    const data = await market.getBasicFinancials(symbol, metricType);
    return createSmartResult(data, {
      project,
      export: forceExport,
      subdir: 'fundamentals',
      filename: `${symbol.toLowerCase()}-financials-${metricType}.json`,
    });
  } catch (error) {
    logger.error('Error getting basic financials:', error);
    if (error instanceof z.ZodError) {
      return createErrorResult(`Validation error: ${error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')}`);
    }
    if (error instanceof FinnhubError) {
      return createErrorResult(`API error: ${error.message}`);
    }
    return createErrorResult(error instanceof Error ? error.message : 'Unknown error');
  }
}

export async function getFinancialsAsReported(args: unknown): Promise<ToolResult> {
  try {
    const { symbol, freq, project, export: forceExport } = GetFinancialsAsReportedSchema.parse(args);
    logger.info(`Getting financials as reported for ${symbol} (${freq})`);
    
    const data = await market.getFinancialsAsReported(symbol, freq);
    return createSmartResult(data, {
      project,
      export: forceExport,
      subdir: 'fundamentals',
      filename: `${symbol.toLowerCase()}-financials-reported-${freq}.json`,
    });
  } catch (error) {
    logger.error('Error getting financials as reported:', error);
    if (error instanceof z.ZodError) {
      return createErrorResult(`Validation error: ${error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')}`);
    }
    if (error instanceof FinnhubError) {
      return createErrorResult(`API error: ${error.message}`);
    }
    return createErrorResult(error instanceof Error ? error.message : 'Unknown error');
  }
}

export async function getEarningsSurprises(args: unknown): Promise<ToolResult> {
  try {
    const { symbol, project, export: forceExport } = GetEarningsSurprisesSchema.parse(args);
    logger.info(`Getting earnings surprises for ${symbol}`);
    
    const data = await market.getEarningsSurprises(symbol);
    return createSmartResult(data, {
      project,
      export: forceExport,
      subdir: 'fundamentals',
      filename: `${symbol.toLowerCase()}-earnings-surprises.json`,
    });
  } catch (error) {
    logger.error('Error getting earnings surprises:', error);
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
export const stockMarketDataTool = {
  name: 'finnhub_stock_market_data',
  description: 'Access stock market data including real-time quotes, historical candles, company profiles, and financial data. Supports JSON export for large datasets.',
  operations: [
    {
      name: 'get_quote',
      description: 'Get real-time quote for a stock symbol',
      parameters: {
        type: 'object',
        properties: {
          symbol: { type: 'string', description: 'Stock symbol (e.g., AAPL)' },
          project: { type: 'string', description: 'Project name for saving data' },
          export: { type: 'boolean', description: 'Force export to JSON file' },
        },
        required: ['symbol'],
      },
    },
    {
      name: 'get_candles',
      description: 'Get historical OHLCV candle data',
      parameters: {
        type: 'object',
        properties: {
          symbol: { type: 'string', description: 'Stock symbol' },
          resolution: { type: 'string', enum: ['1', '5', '15', '30', '60', 'D', 'W', 'M'], description: 'Time resolution' },
          from: { type: 'number', description: 'Unix timestamp (optional)' },
          to: { type: 'number', description: 'Unix timestamp (optional)' },
          days: { type: 'number', default: 30, description: 'Number of days to fetch (if from/to not provided)' },
          project: { type: 'string', description: 'Project name for saving data' },
          export: { type: 'boolean', description: 'Force export to JSON file' },
        },
        required: ['symbol', 'resolution'],
      },
    },
    {
      name: 'get_company_profile',
      description: 'Get company profile information',
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
      name: 'symbol_lookup',
      description: 'Search for symbols by company name',
      parameters: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'Search query' },
          project: { type: 'string', description: 'Project name for saving data' },
          export: { type: 'boolean', description: 'Force export to JSON file' },
        },
        required: ['query'],
      },
    },
    {
      name: 'get_basic_financials',
      description: 'Get basic financial metrics',
      parameters: {
        type: 'object',
        properties: {
          symbol: { type: 'string', description: 'Stock symbol' },
          metricType: { type: 'string', enum: ['all', 'price', 'valuation', 'growth'], default: 'all' },
          project: { type: 'string', description: 'Project name for saving data' },
          export: { type: 'boolean', description: 'Force export to JSON file' },
        },
        required: ['symbol'],
      },
    },
    {
      name: 'get_financials_as_reported',
      description: 'Get financial statements as reported',
      parameters: {
        type: 'object',
        properties: {
          symbol: { type: 'string', description: 'Stock symbol' },
          freq: { type: 'string', enum: ['annual', 'quarterly'], default: 'annual' },
          project: { type: 'string', description: 'Project name for saving data' },
          export: { type: 'boolean', description: 'Force export to JSON file' },
        },
        required: ['symbol'],
      },
    },
    {
      name: 'get_earnings_surprises',
      description: 'Get historical earnings surprises',
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
