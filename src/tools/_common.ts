import { z } from 'zod';
import { getFileStorage } from '../utils/file_storage.js';
import { getConfig } from '../config.js';
import { getLogger } from '../utils/logger.js';

const logger = getLogger('Common');

// Common operation result
export interface ToolResult {
  success: boolean;
  data?: unknown;
  error?: string;
  metadata?: {
    exportedTo?: string;
    truncated?: boolean;
    tokenCount?: number;
    estimatedTokens?: number;
  };
}

// Calculate estimated tokens (rough approximation: 1 token ≈ 4 characters)
export function estimateTokens(data: unknown): number {
  const jsonString = JSON.stringify(data);
  return Math.ceil(jsonString.length / 4);
}

// Check if data should be exported based on token limit
export function shouldExportToFile(data: unknown, forceExport?: boolean): boolean {
  if (forceExport) return true;
  const config = getConfig();
  const estimatedTokens = estimateTokens(data);
  return estimatedTokens > config.performance.safeTokenLimit;
}

// Export data to JSON file
export async function exportToFile(
  project: string | undefined,
  subdir: string,
  filename: string,
  data: unknown
): Promise<string> {
  const storage = getFileStorage();
  
  // If no project specified, use 'default' project
  const projectName = project || 'default';
  
  // Ensure project exists
  const exists = await storage.projectExists(projectName);
  if (!exists) {
    await storage.createProject(projectName);
  }
  
  const filePath = await storage.saveFile(projectName, subdir, filename, data);
  logger.info(`Data exported to: ${filePath}`);
  return filePath;
}

// Smart result creator - automatically exports to file if data is large
export async function createSmartResult(
  data: unknown,
  options: {
    project?: string;
    subdir?: string;
    filename?: string;
    export?: boolean; // force export
  } = {}
): Promise<ToolResult> {
  const estimatedTokens = estimateTokens(data);
  const needsExport = shouldExportToFile(data, options.export);
  
  if (needsExport) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const defaultFilename = options.filename || `data-${timestamp}.json`;
    const subdir = options.subdir || 'market-data';
    
    try {
      const filePath = await exportToFile(options.project, subdir, defaultFilename, data);
      
      return {
        success: true,
        data: {
          message: '数据已导出到JSON文件',
          filePath,
          summary: Array.isArray(data) ? `共 ${data.length} 条记录` : '数据已保存',
          preview: Array.isArray(data) && data.length > 0
            ? data.slice(0, 3)
            : typeof data === 'object' && data !== null
              ? Object.fromEntries(Object.entries(data).slice(0, 5))
              : data,
        },
        metadata: {
          exportedTo: filePath,
          estimatedTokens,
        },
      };
    } catch (error) {
      logger.error('Failed to export data:', error);
      // Fall back to returning data directly
    }
  }
  
  return {
    success: true,
    data,
    metadata: {
      estimatedTokens,
    },
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
export const SymbolSchema = z.string().min(1).transform((s: string) => s.toUpperCase());

export const ResolutionSchema = z.enum(['1', '5', '15', '30', '60', 'D', 'W', 'M']);

export const DateRangeSchema = z.object({
  from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
});
