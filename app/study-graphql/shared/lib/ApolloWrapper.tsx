"use client";

import { HttpLink } from "@apollo/client";
import {
  ApolloNextAppProvider,
  ApolloClient,
  InMemoryCache,
} from "@apollo/client-integration-nextjs";

const graphqlUrl = "/api/graphql";

function makeClient() {
  const httpLink = new HttpLink({
    uri: graphqlUrl,
    fetchOptions: {
      cache: "default",
    },
  });

  return new ApolloClient({
    cache: new InMemoryCache({
      typePolicies: {
        Student: {
          keyFields: ["id"],
        },
      },
    }),
    link: httpLink,
  });
}

export function ApolloWrapper({ children }: React.PropsWithChildren) {
  return (
    <ApolloNextAppProvider makeClient={makeClient}>
      {children}
    </ApolloNextAppProvider>
  );
}
