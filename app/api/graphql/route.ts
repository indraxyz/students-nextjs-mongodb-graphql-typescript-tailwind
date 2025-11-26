import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { ApolloServer } from "@apollo/server";
import { NextRequest } from "next/server";
import { connectDB } from "@/server/shared/database/connectDB";
import { formatGraphQLError } from "@/server/shared/graphql/formatError";
import { ApolloContext } from "@/server/shared/graphql/types";
import Students from "@/server/features/students/datasources/Students";
import { StudentModel } from "@/server/features/students/models/Student";
import { studentResolvers } from "@/server/features/students/resolvers";
import { studentTypeDefs } from "@/server/features/students/schemas/graphql";
import { Model } from "mongoose";
import { StudentDocument } from "@/server/features/students/types";

const baseTypeDefs = `
  type Query {
    _empty: String
  }
  type Mutation {
    _empty: String
  }
`;

const server = new ApolloServer<ApolloContext>({
  typeDefs: [baseTypeDefs, studentTypeDefs],
  resolvers: studentResolvers,
  formatError: (formattedError, error) =>
    formatGraphQLError(formattedError, error),
});

const handler = startServerAndCreateNextHandler(server, {
  context: async (): Promise<ApolloContext> => {
    await connectDB();
    return {
      dataSources: {
        students: new Students({
          modelOrCollection: StudentModel as unknown as Model<StudentDocument>,
        }),
      },
    };
  },
});

const apolloHandler = handler as (request: NextRequest) => Promise<Response>;

export const GET = apolloHandler;
export const POST = apolloHandler;
