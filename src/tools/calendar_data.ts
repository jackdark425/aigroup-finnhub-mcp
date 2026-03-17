import { z } from 'zod';
import * as calendar from '../api/endpoints/calendar.js';
import { getLogger } from '../utils/logger.js';
import { createSuccessResult, createErrorResult, SymbolSchema, type ToolResult } from './_common.js';

const logger = getLogger('CalendarDataTool');

const GetIPOCalendarSchema = z.object({ from: z.string(), to: z.string() });
const GetEarningsCalendarSchema = z.object({
  from: z.string(),
  to: z.string(),
  symbol: SymbolSchema.optional(),
});
const GetEconomicCalendarSchema = z.object({ from: z.string(), to: z.string() });
const GetFDACalendarSchema = z.object({ from: z.string(), to: z.string() });

export async function getIPOCalendar(args: unknown): Promise<ToolResult> {
  try {
    const { from, to } = GetIPOCalendarSchema.parse(args);
    logger.info(`Getting IPO calendar from ${from} to ${to}`);
    const data = await calendar.getIPOCalendar(from, to);
    return createSuccessResult(data);
  } catch (error) {
    logger.error('Error:', error);
    return createErrorResult(error instanceof Error ? error.message : 'Unknown error');
  }
}

export async function getEarningsCalendar(args: unknown): Promise<ToolResult> {
  try {
    const { from, to, symbol } = GetEarningsCalendarSchema.parse(args);
    logger.info(`Getting earnings calendar`);
    const data = await calendar.getEarningsCalendar(from, to, symbol);
    return createSuccessResult(data);
  } catch (error) {
    logger.error('Error:', error);
    return createErrorResult(error instanceof Error ? error.message : 'Unknown error');
  }
}

export async function getEconomicCalendar(args: unknown): Promise<ToolResult> {
  try {
    const { from, to } = GetEconomicCalendarSchema.parse(args);
    logger.info(`Getting economic calendar from ${from} to ${to}`);
    const data = await calendar.getEconomicCalendar(from, to);
    return createSuccessResult(data);
  } catch (error) {
    logger.error('Error:', error);
    return createErrorResult(error instanceof Error ? error.message : 'Unknown error');
  }
}

export async function getFDACalendar(args: unknown): Promise<ToolResult> {
  try {
    const { from, to } = GetFDACalendarSchema.parse(args);
    logger.info(`Getting FDA calendar from ${from} to ${to}`);
    const data = await calendar.getFDACalendar(from, to);
    return createSuccessResult(data);
  } catch (error) {
    logger.error('Error:', error);
    return createErrorResult(error instanceof Error ? error.message : 'Unknown error');
  }
}

export const calendarDataTool = {
  name: 'finnhub_calendar_data',
  description: 'Access IPO, earnings, economic, and FDA calendars',
  operations: [
    { name: 'get_ipo_calendar', description: 'Get IPO calendar', parameters: { type: 'object', properties: { from: { type: 'string' }, to: { type: 'string' } }, required: ['from', 'to'] } },
    { name: 'get_earnings_calendar', description: 'Get earnings calendar', parameters: { type: 'object', properties: { from: { type: 'string' }, to: { type: 'string' }, symbol: { type: 'string' } }, required: ['from', 'to'] } },
    { name: 'get_economic_calendar', description: 'Get economic events calendar', parameters: { type: 'object', properties: { from: { type: 'string' }, to: { type: 'string' } }, required: ['from', 'to'] } },
    { name: 'get_fda_calendar', description: 'Get FDA events calendar', parameters: { type: 'object', properties: { from: { type: 'string' }, to: { type: 'string' } }, required: ['from', 'to'] } },
  ],
};
