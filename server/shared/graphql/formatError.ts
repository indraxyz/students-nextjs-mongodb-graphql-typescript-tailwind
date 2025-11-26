import { GraphQLError, GraphQLFormattedError } from "graphql";
import { AppError, MongoDBConnectionError } from "../errors";

// Check if error is a MongoDB connection error
const isMongoConnectionError = (error: unknown): boolean => {
  if (!error || typeof error !== "object") return false;

  const errorMessage = error instanceof Error ? error.message : String(error);
  const errorName = error instanceof Error ? error.name : "";

  const connectionErrorPatterns = [
    "ECONNREFUSED",
    "ENOTFOUND",
    "ETIMEDOUT",
    "MongoServerSelectionError",
    "MongoNetworkError",
    "MongoTimeoutError",
    "Server selection timed out",
    "connection timed out",
  ];

  return (
    connectionErrorPatterns.some(
      (pattern) => errorMessage.includes(pattern) || errorName.includes(pattern)
    ) || errorName === "MongoServerSelectionError"
  );
};

export function formatGraphQLError(
  formattedError: GraphQLFormattedError,
  error: unknown
): GraphQLFormattedError {
  // Check for MongoDB connection errors first
  if (isMongoConnectionError(error)) {
    const mongoError = new MongoDBConnectionError(undefined, error);
    return {
      ...formattedError,
      message: mongoError.message,
      extensions: {
        ...formattedError.extensions,
        code: mongoError.code,
        statusCode: mongoError.statusCode,
      },
    };
  }

  if (error instanceof AppError) {
    return {
      ...formattedError,
      message: error.message,
      extensions: {
        ...formattedError.extensions,
        code: error.code,
        statusCode: error.statusCode,
        ...(error instanceof Error && "fields" in error
          ? { fields: (error as { fields?: Record<string, string> }).fields }
          : {}),
      },
    };
  }

  if (error instanceof GraphQLError) {
    return {
      ...formattedError,
      message: error.message,
      extensions: {
        ...formattedError.extensions,
        ...error.extensions,
      },
    };
  }

  if (
    error &&
    typeof error === "object" &&
    "originalError" in error &&
    error.originalError instanceof AppError
  ) {
    return {
      ...formattedError,
      message: error.originalError.message,
      extensions: {
        ...formattedError.extensions,
        code: error.originalError.code,
        statusCode: error.originalError.statusCode,
      },
    };
  }

  return formattedError;
}
