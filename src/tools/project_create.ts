import { z } from 'zod';
import { getFileStorage } from '../utils/file_storage.js';
import { getLogger } from '../utils/logger.js';
import { createSuccessResult, createErrorResult, type ToolResult } from './_common.js';

const logger = getLogger('ProjectCreateTool');

const CreateProjectSchema = z.object({
  name: z.string().min(1).max(100).regex(/^[a-zA-Z0-9_-]+$/),
});

export async function createProject(args: unknown): Promise<ToolResult> {
  try {
    const { name } = CreateProjectSchema.parse(args);
    logger.info(`Creating project: ${name}`);

    const storage = getFileStorage();

    // Check if project already exists
    if (await storage.projectExists(name)) {
      return createErrorResult(`Project '${name}' already exists`);
    }

    const project = await storage.createProject(name);

    return createSuccessResult({
      message: `Project '${name}' created successfully`,
      project,
    });
  } catch (error) {
    logger.error('Error creating project:', error);
    if (error instanceof z.ZodError) {
      return createErrorResult(`Validation error: ${error.errors.map((e: z.ZodIssue) => e.message).join(', ')}`);
    }
    return createErrorResult(error instanceof Error ? error.message : 'Unknown error');
  }
}

export const projectCreateTool = {
  name: 'finnhub_project_create',
  description: 'Create a new project workspace for storing data',
  operations: [
    {
      name: 'create',
      description: 'Create a new project',
      parameters: {
        type: 'object',
        properties: {
          name: { type: 'string', description: 'Project name (alphanumeric, underscore, hyphen only)' },
        },
        required: ['name'],
      },
    },
  ],
};
