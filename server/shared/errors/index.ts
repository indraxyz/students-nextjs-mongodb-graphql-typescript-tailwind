export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, public fields?: Record<string, string>) {
    super(message, "VALIDATION_ERROR", 400);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string, id?: string) {
    const message = id
      ? `${resource} with id ${id} not found`
      : `${resource} not found`;
    super(message, "NOT_FOUND", 404);
  }
}

export class DatabaseError extends AppError {
  constructor(message: string, public originalError?: unknown) {
    super(message, "DATABASE_ERROR", 500);
  }
}

export class MongoDBConnectionError extends AppError {
  constructor(message: string = "Cannot connect to MongoDB. If you're using MongoDB Atlas M0 (free tier), the cluster may be paused after 30 days of inactivity. Please wait 10-30 seconds for it to wake up, then try again.", public originalError?: unknown) {
    super(message, "MONGODB_CONNECTION_ERROR", 503); // 503 Service Unavailable
  }
}