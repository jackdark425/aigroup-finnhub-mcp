import { z } from 'zod';
import { getLogger } from '../utils/logger.js';
import { createSuccessResult, createErrorResult, type ToolResult } from './_common.js';

const logger = getLogger('JobStatusTool');

// Simple in-memory job store (in production, use Redis/BullMQ)
interface Job {
  job_id: string;
  tool_name: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  created_at: string;
  started_at?: string;
  completed_at?: string;
  result?: unknown;
  error?: string;
}

const jobStore = new Map<string, Job>();

const GetJobStatusSchema = z.object({
  job_id: z.string(),
});

export function createJob(jobId: string, toolName: string): Job {
  const job: Job = {
    job_id: jobId,
    tool_name: toolName,
    status: 'pending',
    progress: 0,
    created_at: new Date().toISOString(),
  };
  jobStore.set(jobId, job);
  return job;
}

export function updateJobStatus(
  jobId: string,
  status: Job['status'],
  progress?: number,
  result?: unknown,
  error?: string
): void {
  const job = jobStore.get(jobId);
  if (job) {
    job.status = status;
    if (progress !== undefined) job.progress = progress;
    if (result !== undefined) job.result = result;
    if (error !== undefined) job.error = error;

    if (status === 'running' && !job.started_at) {
      job.started_at = new Date().toISOString();
    }
    if ((status === 'completed' || status === 'failed') && !job.completed_at) {
      job.completed_at = new Date().toISOString();
    }
  }
}

export async function getJobStatus(args: unknown): Promise<ToolResult> {
  try {
    const { job_id } = GetJobStatusSchema.parse(args);
    logger.info(`Getting job status: ${job_id}`);

    const job = jobStore.get(job_id);
    if (!job) {
      return createErrorResult(`Job '${job_id}' not found`);
    }

    return createSuccessResult(job);
  } catch (error) {
    logger.error('Error getting job status:', error);
    if (error instanceof z.ZodError) {
      return createErrorResult(`Validation error: ${error.errors.map(e => e.message).join(', ')}`);
    }
    return createErrorResult(error instanceof Error ? error.message : 'Unknown error');
  }
}

export const jobStatusTool = {
  name: 'finnhub_job_status',
  description: 'Check the status of background jobs',
  operations: [
    {
      name: 'get',
      description: 'Get job status by ID',
      parameters: {
        type: 'object',
        properties: {
          job_id: { type: 'string', description: 'Job ID' },
        },
        required: ['job_id'],
      },
    },
  ],
};
