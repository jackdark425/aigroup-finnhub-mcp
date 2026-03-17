export class FinnhubError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number,
    public readonly code?: string
  ) {
    super(message);
    this.name = 'FinnhubError';
    Object.setPrototypeOf(this, FinnhubError.prototype);
  }
}

export class RateLimitError extends FinnhubError {
  constructor(message = 'Rate limit exceeded') {
    super(message, 429, 'RATE_LIMIT_EXCEEDED');
    this.name = 'RateLimitError';
    Object.setPrototypeOf(this, RateLimitError.prototype);
  }
}

export class AuthenticationError extends FinnhubError {
  constructor(message = 'Invalid API key') {
    super(message, 403, 'AUTHENTICATION_ERROR');
    this.name = 'AuthenticationError';
    Object.setPrototypeOf(this, AuthenticationError.prototype);
  }
}

export class NotFoundError extends FinnhubError {
  constructor(resource: string) {
    super(`${resource} not found`, 404, 'NOT_FOUND');
    this.name = 'NotFoundError';
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

export class ValidationError extends FinnhubError {
  constructor(message: string) {
    super(message, 400, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

export function handleApiError(error: unknown): FinnhubError {
  if (error instanceof FinnhubError) {
    return error;
  }

  if (error instanceof Error) {
    // Check for HTTP status codes in error message
    const statusMatch = error.message.match(/status\s*(\d+)/i);
    const statusCode = statusMatch ? parseInt(statusMatch[1], 10) : undefined;

    if (statusCode === 429) {
      return new RateLimitError(error.message);
    }
    if (statusCode === 403) {
      return new AuthenticationError(error.message);
    }
    if (statusCode === 404) {
      return new NotFoundError('Resource');
    }

    return new FinnhubError(error.message, statusCode);
  }

  return new FinnhubError('Unknown error occurred');
}
