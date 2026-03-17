import { promises as fs } from 'fs';
import { join } from 'path';
import { getConfig } from '../config.js';
import { getLogger } from './logger.js';

const logger = getLogger('FileStorage');

export interface Project {
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectMetadata {
  name: string;
  created_at: string;
  updated_at: string;
}

export class FileStorage {
  private baseDir: string;

  constructor() {
    const config = getConfig();
    this.baseDir = config.storage.directory;
  }

  private async ensureDir(dir: string): Promise<void> {
    try {
      await fs.mkdir(dir, { recursive: true });
    } catch (error) {
      logger.error(`Failed to create directory: ${dir}`, error);
      throw error;
    }
  }

  async createProject(name: string): Promise<Project> {
    const projectDir = join(this.baseDir, name);
    await this.ensureDir(projectDir);

    // Create subdirectories
    const subdirs = ['market-data', 'technical', 'fundamentals', 'news', 'crypto', 'forex', 'filings', 'alternative'];
    for (const subdir of subdirs) {
      await this.ensureDir(join(projectDir, subdir));
    }

    const now = new Date().toISOString();
    const metadata: ProjectMetadata = {
      name,
      created_at: now,
      updated_at: now,
    };

    await fs.writeFile(
      join(projectDir, '.project.json'),
      JSON.stringify(metadata, null, 2)
    );

    logger.info(`Created project: ${name}`);
    return {
      name,
      createdAt: now,
      updatedAt: now,
    };
  }

  async listProjects(): Promise<Project[]> {
    try {
      const entries = await fs.readdir(this.baseDir, { withFileTypes: true });
      const projects: Project[] = [];

      for (const entry of entries) {
        if (entry.isDirectory()) {
          try {
            const metadataPath = join(this.baseDir, entry.name, '.project.json');
            const content = await fs.readFile(metadataPath, 'utf-8');
            const metadata: ProjectMetadata = JSON.parse(content);
            projects.push({
              name: metadata.name,
              createdAt: metadata.created_at,
              updatedAt: metadata.updated_at,
            });
          } catch {
            // Skip directories without valid metadata
          }
        }
      }

      return projects.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch (error) {
      logger.error('Failed to list projects', error);
      return [];
    }
  }

  async projectExists(name: string): Promise<boolean> {
    try {
      const projectDir = join(this.baseDir, name);
      await fs.access(join(projectDir, '.project.json'));
      return true;
    } catch {
      return false;
    }
  }

  async saveFile(projectName: string, subdir: string, filename: string, data: unknown): Promise<string> {
    const filePath = join(this.baseDir, projectName, subdir, filename);
    await this.ensureDir(join(this.baseDir, projectName, subdir));
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    return filePath;
  }

  async readFile(projectName: string, subdir: string, filename: string): Promise<unknown> {
    const filePath = join(this.baseDir, projectName, subdir, filename);
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content);
  }
}

let storageInstance: FileStorage | null = null;

export function getFileStorage(): FileStorage {
  if (!storageInstance) {
    storageInstance = new FileStorage();
  }
  return storageInstance;
}
