import { z } from 'zod';
import { getFileStorage } from '../utils/file_storage.js';
import { getLogger } from '../utils/logger.js';
import { createSuccessResult, createErrorResult, type ToolResult } from './_common.js';

const logger = getLogger('ProjectListTool');

// Schema for list projects parameters
const ListProjectsSchema = z.object({
  verbose: z.boolean().optional().default(false),
});

export async function listProjects(args: unknown): Promise<ToolResult> {
  try {
    const { verbose } = ListProjectsSchema.parse(args);
    logger.info('Listing projects', { verbose });

    const storage = getFileStorage();
    const projects = await storage.listProjects();

    // Build JSON response data
    const jsonData = {
      projects,
      count: projects.length,
    };

    // If verbose mode, include formatted text output
    if (verbose) {
      let formattedText = `Projects (${projects.length} total):\n\n`;
      
      if (projects.length === 0) {
        formattedText += 'No projects found.\n';
      } else {
        projects.forEach((project, index) => {
          formattedText += `${index + 1}. ${project.name}\n`;
          formattedText += `   Created: ${new Date(project.createdAt).toLocaleString()}\n`;
          formattedText += `   Updated: ${new Date(project.updatedAt).toLocaleString()}\n\n`;
        });
      }

      return createSuccessResult({
        ...jsonData,
        formattedText,
      });
    }

    // Default: return JSON format only
    return createSuccessResult(jsonData);
  } catch (error) {
    logger.error('Error listing projects:', error);
    if (error instanceof z.ZodError) {
      return createErrorResult(`Validation error: ${error.errors.map((e: z.ZodIssue) => e.message).join(', ')}`);
    }
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
        properties: {
          verbose: {
            type: 'boolean',
            description: 'Include formatted text output in addition to JSON (default: false)',
            default: false,
          },
        },
      },
    },
  ],
};
