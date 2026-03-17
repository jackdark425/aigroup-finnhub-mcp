import { z } from 'zod';
import * as technical from '../api/endpoints/technical.js';
import { getLogger } from '../utils/logger.js';
import { 
  createSuccessResult, 
  createErrorResult, 
  SymbolSchema, 
  getUnixDaysAgo,
  getUnixTimestamp,
  type ToolResult 
} from './_common.js';

const logger = getLogger('TechnicalAnalysisTool');

// Indicator types
const IndicatorTypeSchema = z.enum([
  'sma', 'ema', 'wma', 'dema', 'tema', 'trima', 'kama', 'mama', 't3',
  'rsi', 'macd', 'stoch', 'stochf', 'stochrsi', 'willr', 'adx', 'adxr',
  'apo', 'ppo', 'mom', 'bop', 'cci', 'cmo', 'roc', 'rocr', 'aroon',
  'aroonosc', 'mfi', 'trix', 'ultosc', 'dx', 'minus_di', 'plus_di',
  'minus_dm', 'plus_dm', 'bbands', 'midpoint', 'midprice', 'sar', 'trange',
  'atr', 'natr', 'ad', 'adosc', 'obv', 'ht_trendline', 'ht_sine',
  'ht_trendmode', 'ht_dcperiod', 'ht_dcphase', 'ht_phasor'
]);

// Schemas
const GetTechnicalIndicatorSchema = z.object({
  symbol: SymbolSchema,
  indicator: IndicatorTypeSchema,
  resolution: z.enum(['1', '5', '15', '30', '60', 'D', 'W', 'M']),
  timePeriod: z.number().default(14),
  from: z.number().optional(),
  to: z.number().optional(),
  days: z.number().default(180),
  // Indicator-specific parameters
  fastPeriod: z.number().optional(),
  slowPeriod: z.number().optional(),
  signalPeriod: z.number().optional(),
  stdDev: z.number().optional(),
});

const GetAggregateSignalsSchema = z.object({
  symbol: SymbolSchema,
});

const GetPatternRecognitionSchema = z.object({
  symbol: SymbolSchema,
  resolution: z.enum(['1', '5', '15', '30', '60', 'D', 'W', 'M']),
});

const GetSupportResistanceSchema = z.object({
  symbol: SymbolSchema,
  resolution: z.enum(['1', '5', '15', '30', '60', 'D', 'W', 'M']),
});

export async function getTechnicalIndicator(args: unknown): Promise<ToolResult> {
  try {
    const params = GetTechnicalIndicatorSchema.parse(args);
    
    // Set default date range if not provided
    const to = params.to ?? getUnixTimestamp();
    const from = params.from ?? getUnixDaysAgo(params.days);
    
    logger.info(`Getting ${params.indicator} for ${params.symbol}`);
    
    // Build indicator-specific fields
    const indicatorFields: Record<string, unknown> = {};
    if (params.fastPeriod) indicatorFields.fastperiod = params.fastPeriod;
    if (params.slowPeriod) indicatorFields.slowperiod = params.slowPeriod;
    if (params.signalPeriod) indicatorFields.signalperiod = params.signalPeriod;
    if (params.stdDev) indicatorFields.nbdevup = params.stdDev;
    
    const data = await technical.getTechnicalIndicator(
      params.symbol,
      params.resolution,
      params.indicator,
      params.timePeriod,
      from,
      to,
      indicatorFields
    );
    
    return createSuccessResult(data);
  } catch (error) {
    logger.error('Error getting technical indicator:', error);
    if (error instanceof z.ZodError) {
      return createErrorResult(`Validation error: ${error.errors.map(e => e.message).join(', ')}`);
    }
    return createErrorResult(error instanceof Error ? error.message : 'Unknown error');
  }
}

export async function getAggregateSignals(args: unknown): Promise<ToolResult> {
  try {
    const { symbol } = GetAggregateSignalsSchema.parse(args);
    logger.info(`Getting aggregate signals for ${symbol}`);
    
    const data = await technical.getAggregateSignals(symbol);
    return createSuccessResult(data);
  } catch (error) {
    logger.error('Error getting aggregate signals:', error);
    if (error instanceof z.ZodError) {
      return createErrorResult(`Validation error: ${error.errors.map(e => e.message).join(', ')}`);
    }
    return createErrorResult(error instanceof Error ? error.message : 'Unknown error');
  }
}

export async function getPatternRecognition(args: unknown): Promise<ToolResult> {
  try {
    const { symbol, resolution } = GetPatternRecognitionSchema.parse(args);
    logger.info(`Getting pattern recognition for ${symbol} (${resolution})`);
    
    const data = await technical.getPatternRecognition(symbol, resolution);
    return createSuccessResult(data);
  } catch (error) {
    logger.error('Error getting pattern recognition:', error);
    if (error instanceof z.ZodError) {
      return createErrorResult(`Validation error: ${error.errors.map(e => e.message).join(', ')}`);
    }
    return createErrorResult(error instanceof Error ? error.message : 'Unknown error');
  }
}

export async function getSupportResistance(args: unknown): Promise<ToolResult> {
  try {
    const { symbol, resolution } = GetSupportResistanceSchema.parse(args);
    logger.info(`Getting support/resistance for ${symbol} (${resolution})`);
    
    const data = await technical.getSupportResistance(symbol, resolution);
    return createSuccessResult(data);
  } catch (error) {
    logger.error('Error getting support/resistance:', error);
    if (error instanceof z.ZodError) {
      return createErrorResult(`Validation error: ${error.errors.map(e => e.message).join(', ')}`);
    }
    return createErrorResult(error instanceof Error ? error.message : 'Unknown error');
  }
}

// Tool definition for MCP
export const technicalAnalysisTool = {
  name: 'finnhub_technical_analysis',
  description: 'Technical analysis tools including 50+ indicators, pattern recognition, and support/resistance levels',
  operations: [
    {
      name: 'get_indicator',
      description: 'Get technical indicator values (SMA, EMA, RSI, MACD, etc.)',
      parameters: {
        type: 'object',
        properties: {
          symbol: { type: 'string', description: 'Stock symbol' },
          indicator: { 
            type: 'string', 
            enum: ['sma', 'ema', 'rsi', 'macd', 'bbands', 'stoch', 'adx', 'atr'],
            description: 'Indicator type' 
          },
          resolution: { type: 'string', enum: ['1', '5', '15', '30', '60', 'D', 'W', 'M'] },
          timePeriod: { type: 'number', default: 14 },
          days: { type: 'number', default: 180 },
          fastPeriod: { type: 'number' },
          slowPeriod: { type: 'number' },
          signalPeriod: { type: 'number' },
          stdDev: { type: 'number' },
        },
        required: ['symbol', 'indicator', 'resolution'],
      },
    },
    {
      name: 'get_aggregate_signals',
      description: 'Get aggregate buy/sell/neutral signals from multiple indicators',
      parameters: {
        type: 'object',
        properties: {
          symbol: { type: 'string', description: 'Stock symbol' },
        },
        required: ['symbol'],
      },
    },
    {
      name: 'get_pattern_recognition',
      description: 'Detect chart patterns (head and shoulders, triangles, etc.)',
      parameters: {
        type: 'object',
        properties: {
          symbol: { type: 'string', description: 'Stock symbol' },
          resolution: { type: 'string', enum: ['1', '5', '15', '30', '60', 'D', 'W', 'M'] },
        },
        required: ['symbol', 'resolution'],
      },
    },
    {
      name: 'get_support_resistance',
      description: 'Calculate support and resistance levels',
      parameters: {
        type: 'object',
        properties: {
          symbol: { type: 'string', description: 'Stock symbol' },
          resolution: { type: 'string', enum: ['1', '5', '15', '30', '60', 'D', 'W', 'M'] },
        },
        required: ['symbol', 'resolution'],
      },
    },
  ],
};
