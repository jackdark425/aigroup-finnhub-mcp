import axios, { AxiosInstance, AxiosError, AxiosRequestConfig } from 'axios';
import { getConfig } from '../config.js';
import { getLogger } from '../utils/logger.js';
import { RateLimitError, AuthenticationError, handleApiError } from './errors.js';

const logger = getLogger('FinnhubClient');

interface TokenBucket {
  tokens: number;
  lastRefill: number;
}

export class FinnhubClient {
  private readonly client: AxiosInstance;
  private readonly bucket: TokenBucket;
  private readonly rpm: number;
  private readonly maxRetries: number;

  constructor() {
    const config = getConfig();
    
    this.rpm = config.performance.rateLimitRpm;
    this.maxRetries = config.performance.maxRetries;
    this.bucket = {
      tokens: this.rpm,
      lastRefill: Date.now(),
    };

    this.client = axios.create({
      baseURL: config.finnhub.baseUrl,
      timeout: config.performance.requestTimeout * 1000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor for authentication
    this.client.interceptors.request.use(
      (config) => {
        this.checkRateLimit();
        const appConfig = getConfig();
        if (appConfig.finnhub.apiKey) {
          config.params = {
            ...config.params,
            token: appConfig.finnhub.apiKey,
          };
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        if (error.response?.status === 429) {
          throw new RateLimitError();
        }
        if (error.response?.status === 403) {
          throw new AuthenticationError();
        }
        return Promise.reject(error);
      }
    );
  }

  private checkRateLimit(): void {
    const now = Date.now();
    const elapsedMs = now - this.bucket.lastRefill;
    const refillRate = this.rpm / 60; // tokens per second
    const tokensToAdd = (elapsedMs / 1000) * refillRate;

    this.bucket.tokens = Math.min(this.rpm, this.bucket.tokens + tokensToAdd);
    this.bucket.lastRefill = now;

    if (this.bucket.tokens < 1) {
      const waitTime = Math.ceil((1 - this.bucket.tokens) / refillRate * 1000);
      logger.warn(`Rate limit approached, waiting ${waitTime}ms`);
      
      // Simple blocking wait for demo purposes
      const start = Date.now();
      while (Date.now() - start < waitTime) {
        // Busy wait
      }
      this.bucket.tokens = 1;
    }

    this.bucket.tokens -= 1;
  }

  private async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private calculateBackoff(attempt: number): number {
    const baseDelay = 1000; // 1 second
    const maxDelay = 30000; // 30 seconds
    const exponentialDelay = baseDelay * Math.pow(2, attempt);
    const jitter = Math.random() * 1000; // Add random jitter
    return Math.min(exponentialDelay + jitter, maxDelay);
  }

  async request<T>(config: AxiosRequestConfig): Promise<T> {
    let lastError: Error | undefined;

    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        if (attempt > 0) {
          const delay = this.calculateBackoff(attempt - 1);
          logger.info(`Retry attempt ${attempt}/${this.maxRetries}, waiting ${Math.round(delay)}ms`);
          await this.sleep(delay);
        }

        const response = await this.client.request<T>(config);
        return response.data;
      } catch (error) {
        lastError = error as Error;

        // Don't retry on auth errors or client errors (except rate limit)
        if (error instanceof AuthenticationError) {
          throw error;
        }

        if (axios.isAxiosError(error)) {
          const status = error.response?.status;
          if (status && status >= 400 && status < 500 && status !== 429) {
            throw handleApiError(error);
          }
        }

        if (attempt === this.maxRetries) {
          break;
        }
      }
    }

    throw handleApiError(lastError);
  }

  async get<T>(url: string, params?: Record<string, unknown>): Promise<T> {
    return this.request<T>({
      method: 'GET',
      url,
      params,
    });
  }
}

// Singleton instance
let clientInstance: FinnhubClient | null = null;

export function getFinnhubClient(): FinnhubClient {
  if (!clientInstance) {
    clientInstance = new FinnhubClient();
  }
  return clientInstance;
}

export function resetFinnhubClient(): void {
  clientInstance = null;
}
