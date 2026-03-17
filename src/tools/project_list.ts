import { getFileStorage } from '../utils/file_storage.js';
import { getLogger } from '../utils/logger.js';
import { createSuccessResult, createErrorResult, type ToolResult } from './_common.js';

const logger = getLogger('ProjectListTool');

export async function listProjects(): Promise<ToolResult> {
  try {
    logger.info('Listing projects');

    const storage = getFileStorage();
    const projects = await storage.listProjects();

    return createSuccessResult({
      projects,
      count: projects.length,
    });
  } catch (error) {
    logger.error('Error listing projects:', error);
    return createErrorResult(error instanceof Error ? error.message : 'Unknown error');
  }
}

export const projectListTool = {
  name: 'finnhub_project_list',
  description: 'List all available projects',
  operations: [
    {
      name: 'list',
      description: 'List all projects',
      parameters: {
        type: 'object',
        properties: {},
      },
    },
  ],
};
