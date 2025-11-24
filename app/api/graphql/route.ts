import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { ApolloServer } from "@apollo/server";
import { NextRequest } from "next/server";
import { GraphQLError } from "graphql";
import Students from "@/server/datasources/students";
import Student from "@/server/models/student";
import resolvers from "@/server/resolvers/student";
import typeDefs from "@/server/schemas/student";
import { connectDB } from "@/server/utils/connectDB";
import { Collection } from "mongodb";
import { StudentDocument } from "@/app/study-graphql/types/student";
import { ApolloContext } from "@/server/types/graphql";
import { AppError } from "@/server/utils/errors";

const server = new ApolloServer<ApolloContext>({
  resolvers,
  typeDefs,
  formatError: (formattedError, error) => {
    if (error instanceof AppError) {
      return new GraphQLError(error.message, {
        extensions: {
          code: error.code,
          statusCode: error.statusCode,
          ...(error instanceof Error && "fields" in error
            ? { fields: (error as { fields?: Record<string, string> }).fields }
            : {}),
        },
      });
    }

    if (error instanceof GraphQLError) {
      return error;
    }

    if (
      error &&
      typeof error === "object" &&
      "originalError" in error &&
      error.originalError instanceof AppError
    ) {
      return new GraphQLError(error.originalError.message, {
        extensions: {
          code: error.originalError.code,
          statusCode: error.originalError.statusCode,
        },
      });
    }

    return formattedError;
  },
});

const handler = startServerAndCreateNextHandler(server, {
  context: async (): Promise<ApolloContext> => {
    await connectDB();
    return {
      dataSources: {
        students: new Students({
          modelOrCollection: Student as unknown as Collection<StudentDocument>,
        }),
      },
    };
  },
});

// Type assertion to fix Next.js 15 compatibility
const apolloHandler = handler as (request: NextRequest) => Promise<Response>;

export const GET = apolloHandler;
export const POST = apolloHandler;
