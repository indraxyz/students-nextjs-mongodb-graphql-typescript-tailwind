import { GraphQLError, GraphQLFormattedError } from "graphql";
import { AppError } from "../errors";

export function formatGraphQLError(
  formattedError: GraphQLFormattedError,
  error: unknown
): GraphQLFormattedError {
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
