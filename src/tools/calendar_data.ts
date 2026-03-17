import { z } from 'zod';
import * as calendar from '../api/endpoints/calendar.js';
import { getLogger } from '../utils/logger.js';
import { createSmartResult, createErrorResult, SymbolSchema, type ToolResult } from './_common.js';

const logger = getLogger('CalendarDataTool');

const GetIPOCalendarSchema = z.object({
  from: z.string(),
  to: z.string(),
  project: z.string().optional(),
  export: z.boolean().optional(),
});

const GetEarningsCalendarSchema = z.object({
  from: z.string(),
  to: z.string(),
  symbol: SymbolSchema.optional(),
  project: z.string().optional(),
  export: z.boolean().optional(),
});

const GetEconomicCalendarSchema = z.object({
  from: z.string(),
  to: z.string(),
  project: z.string().optional(),
  export: z.boolean().optional(),
});

const GetFDACalendarSchema = z.object({
  from: z.string(),
  to: z.string(),
  project: z.string().optional(),
  export: z.boolean().optional(),
});

export async function getIPOCalendar(args: unknown): Promise<ToolResult> {
  try {
    const { from, to, project, export: forceExport } = GetIPOCalendarSchema.parse(args);
    logger.info(`Getting IPO calendar from ${from} to ${to}`);
    const data = await calendar.getIPOCalendar(from, to);
    return createSmartResult(data, {
      project,
      export: forceExport,
      subdir: 'market-data',
      filename: `ipo-calendar-${from}-${to}.json`,
    });
  } catch (error) {
    logger.error('Error:', error);
    return createErrorResult(error instanceof Error ? error.message : 'Unknown error');
  }
}

export async function getEarningsCalendar(args: unknown): Promise<ToolResult> {
  try {
    const { from, to, symbol, project, export: forceExport } = GetEarningsCalendarSchema.parse(args);
    logger.info(`Getting earnings calendar`);
    const data = await calendar.getEarningsCalendar(from, to, symbol);
    return createSmartResult(data, {
      project,
      export: forceExport,
      subdir: 'market-data',
      filename: `earnings-calendar-${from}-${to}${symbol ? `-${symbol.toLowerCase()}` : ''}.json`,
    });
  } catch (error) {
    logger.error('Error:', error);
    return createErrorResult(error instanceof Error ? error.message : 'Unknown error');
  }
}

export async function getEconomicCalendar(args: unknown): Promise<ToolResult> {
  try {
    const { from, to, project, export: forceExport } = GetEconomicCalendarSchema.parse(args);
    logger.info(`Getting economic calendar from ${from} to ${to}`);
    const data = await calendar.getEconomicCalendar(from, to);
    return createSmartResult(data, {
      project,
      export: forceExport,
      subdir: 'market-data',
      filename: `economic-calendar-${from}-${to}.json`,
    });
  } catch (error) {
    logger.error('Error:', error);
    return createErrorResult(error instanceof Error ? error.message : 'Unknown error');
  }
}

export async function getFDACalendar(args: unknown): Promise<ToolResult> {
  try {
    const { from, to, project, export: forceExport } = GetFDACalendarSchema.parse(args);
    logger.info(`Getting FDA calendar from ${from} to ${to}`);
    const data = await calendar.getFDACalendar(from, to);
    return createSmartResult(data, {
      project,
      export: forceExport,
      subdir: 'market-data',
      filename: `fda-calendar-${from}-${to}.json`,
    });
  } catch (error) {
    logger.error('Error:', error);
    return createErrorResult(error instanceof Error ? error.message : 'Unknown error');
  }
}

export const calendarDataTool = {
  name: 'finnhub_calendar_data',
  description: 'Access IPO, earnings, economic, and FDA calendars. Supports JSON export for large datasets.',
  operations: [
    {
      name: 'get_ipo_calendar',
      description: 'Get IPO calendar',
      parameters: {
        type: 'object',
        properties: {
          from: { type: 'string' },
          to: { type: 'string' },
          project: { type: 'string', description: 'Project name for saving data' },
          export: { type: 'boolean', description: 'Force export to JSON file' },
        },
        required: ['from', 'to'],
      },
    },
    {
      name: 'get_earnings_calendar',
      description: 'Get earnings calendar',
      parameters: {
        type: 'object',
        properties: {
          from: { type: 'string' },
          to: { type: 'string' },
          symbol: { type: 'string' },
          project: { type: 'string', description: 'Project name for saving data' },
          export: { type: 'boolean', description: 'Force export to JSON file' },
        },
        required: ['from', 'to'],
      },
    },
    {
      name: 'get_economic_calendar',
      description: 'Get economic events calendar',
      parameters: {
        type: 'object',
        properties: {
          from: { type: 'string' },
          to: { type: 'string' },
          project: { type: 'string', description: 'Project name for saving data' },
          export: { type: 'boolean', description: 'Force export to JSON file' },
        },
        required: ['from', 'to'],
      },
    },
    {
      name: 'get_fda_calendar',
      description: 'Get FDA events calendar',
      parameters: {
        type: 'object',
        properties: {
          from: { type: 'string' },
          to: { type: 'string' },
          project: { type: 'string', description: 'Project name for saving data' },
          export: { type: 'boolean', description: 'Force export to JSON file' },
        },
        required: ['from', 'to'],
      },
    },
  ],
};
