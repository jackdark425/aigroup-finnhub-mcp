import convict from 'convict';
import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

// Tool configuration schema
const ToolConfigSchema = z.object({
  technical_analysis: z.boolean().default(true),
  stock_market_data: z.boolean().default(true),
  news_sentiment: z.boolean().default(true),
  stock_fundamentals: z.boolean().default(true),
  stock_estimates: z.boolean().default(true),
  stock_ownership: z.boolean().default(true),
  alternative_data: z.boolean().default(true),
  sec_filings: z.boolean().default(true),
  crypto_data: z.boolean().default(true),
  forex_data: z.boolean().default(true),
  calendar_data: z.boolean().default(true),
  market_events: z.boolean().default(true),
  project_create: z.boolean().default(true),
  project_list: z.boolean().default(true),
  job_status: z.boolean().default(true),
});

export type ToolConfig = z.infer<typeof ToolConfigSchema>;

// Main configuration schema
const config = convict({
  finnhub: {
    apiKey: {
      doc: 'Finnhub API key',
      format: String,
      default: '',
      env: 'FINNHUB_API_KEY',
    },
    baseUrl: {
      doc: 'Finnhub API base URL',
      format: String,
      default: 'https://finnhub.io/api/v1',
      env: 'FINNHUB_BASE_URL',
    },
  },
  storage: {
    directory: {
      doc: 'Storage directory for data files',
      format: String,
      default: './finnhub-data',
      env: 'FINNHUB_STORAGE_DIR',
    },
  },
  performance: {
    rateLimitRpm: {
      doc: 'Rate limit in requests per minute',
      format: 'int',
      default: 60,
      env: 'FINNHUB_RATE_LIMIT_RPM',
    },
    requestTimeout: {
      doc: 'Request timeout in seconds',
      format: 'int',
      default: 30,
      env: 'FINNHUB_REQUEST_TIMEOUT',
    },
    maxRetries: {
      doc: 'Maximum number of retries',
      format: 'int',
      default: 3,
      env: 'FINNHUB_MAX_RETRIES',
    },
    safeTokenLimit: {
      doc: 'Safe token limit for output',
      format: 'int',
      default: 75000,
      env: 'FINNHUB_SAFE_TOKEN_LIMIT',
    },
  },
  jobs: {
    maxConcurrent: {
      doc: 'Maximum concurrent jobs',
      format: 'int',
      default: 5,
      env: 'FINNHUB_MAX_CONCURRENT_JOBS',
    },
    timeout: {
      doc: 'Job timeout in seconds',
      format: 'int',
      default: 300,
      env: 'FINNHUB_JOB_TIMEOUT',
    },
  },
  tools: {
    technical_analysis: {
      format: Boolean,
      default: true,
      env: 'FINNHUB_ENABLE_TECHNICAL_ANALYSIS',
    },
    stock_market_data: {
      format: Boolean,
      default: true,
      env: 'FINNHUB_ENABLE_STOCK_MARKET_DATA',
    },
    news_sentiment: {
      format: Boolean,
      default: true,
      env: 'FINNHUB_ENABLE_NEWS_SENTIMENT',
    },
    stock_fundamentals: {
      format: Boolean,
      default: true,
      env: 'FINNHUB_ENABLE_STOCK_FUNDAMENTALS',
    },
    stock_estimates: {
      format: Boolean,
      default: true,
      env: 'FINNHUB_ENABLE_STOCK_ESTIMATES',
    },
    stock_ownership: {
      format: Boolean,
      default: true,
      env: 'FINNHUB_ENABLE_STOCK_OWNERSHIP',
    },
    alternative_data: {
      format: Boolean,
      default: true,
      env: 'FINNHUB_ENABLE_ALTERNATIVE_DATA',
    },
    sec_filings: {
      format: Boolean,
      default: true,
      env: 'FINNHUB_ENABLE_SEC_FILINGS',
    },
    crypto_data: {
      format: Boolean,
      default: true,
      env: 'FINNHUB_ENABLE_CRYPTO_DATA',
    },
    forex_data: {
      format: Boolean,
      default: true,
      env: 'FINNHUB_ENABLE_FOREX_DATA',
    },
    calendar_data: {
      format: Boolean,
      default: true,
      env: 'FINNHUB_ENABLE_CALENDAR_DATA',
    },
    market_events: {
      format: Boolean,
      default: true,
      env: 'FINNHUB_ENABLE_MARKET_EVENTS',
    },
    project_create: {
      format: Boolean,
      default: true,
      env: 'FINNHUB_ENABLE_PROJECT_CREATE',
    },
    project_list: {
      format: Boolean,
      default: true,
      env: 'FINNHUB_ENABLE_PROJECT_LIST',
    },
    job_status: {
      format: Boolean,
      default: true,
      env: 'FINNHUB_ENABLE_JOB_STATUS',
    },
  },
  log: {
    level: {
      doc: 'Log level',
      format: ['debug', 'info', 'warn', 'error'],
      default: 'info',
      env: 'LOG_LEVEL',
    },
  },
});

config.validate({ allowed: 'strict' });

export type Config = {
  finnhub: {
    apiKey: string;
    baseUrl: string;
  };
  storage: {
    directory: string;
  };
  performance: {
    rateLimitRpm: number;
    requestTimeout: number;
    maxRetries: number;
    safeTokenLimit: number;
  };
  jobs: {
    maxConcurrent: number;
    timeout: number;
  };
  tools: ToolConfig;
  log: {
    level: string;
  };
};

export function getConfig(): Config {
  return config.get() as Config;
}

export function isToolEnabled(toolName: keyof ToolConfig): boolean {
  return config.get(`tools.${toolName}`) as boolean;
}
