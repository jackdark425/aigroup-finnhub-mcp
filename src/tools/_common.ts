import { z } from 'zod';

// Common operation result
export interface ToolResult {
  success: boolean;
  data?: unknown;
  error?: string;
  metadata?: {
    exportedTo?: string;
    truncated?: boolean;
    tokenCount?: number;
  };
}

// Standard tool response
export function createSuccessResult(data: unknown, metadata?: ToolResult['metadata']): ToolResult {
  return {
    success: true,
    data,
    metadata,
  };
}

export function createErrorResult(error: string): ToolResult {
  return {
    success: false,
    error,
  };
}

// Date utility functions
export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function getDateDaysAgo(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return formatDate(date);
}

export function getUnixTimestamp(date: Date = new Date()): number {
  return Math.floor(date.getTime() / 1000);
}

export function getUnixDaysAgo(days: number): number {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return getUnixTimestamp(date);
}

// Symbol validation
export function validateSymbol(symbol: string): string {
  if (!symbol || symbol.trim().length === 0) {
    throw new Error('Symbol is required');
  }
  return symbol.trim().toUpperCase();
}

// Resolution validation
const validResolutions = ['1', '5', '15', '30', '60', 'D', 'W', 'M'];

export function validateResolution(resolution: string): string {
  const normalized = resolution.toUpperCase();
  if (!validResolutions.includes(normalized)) {
    throw new Error(`Invalid resolution: ${resolution}. Valid values: ${validResolutions.join(', ')}`);
  }
  return normalized;
}

// Common schemas
export const SymbolSchema = z.string().min(1).transform(s => s.toUpperCase());

export const ResolutionSchema = z.enum(['1', '5', '15', '30', '60', 'D', 'W', 'M']);

export const DateRangeSchema = z.object({
  from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
});
