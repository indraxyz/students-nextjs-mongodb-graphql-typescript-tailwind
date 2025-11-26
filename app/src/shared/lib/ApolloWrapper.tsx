"use client";

import { HttpLink } from "@apollo/client";
import { ErrorLink } from "@apollo/client/link/error";
import { RetryLink } from "@apollo/client/link/retry";
import {
  ApolloNextAppProvider,
  ApolloClient,
  InMemoryCache,
} from "@apollo/client-integration-nextjs";

const graphqlUrl = "/api/graphql";

/**
 * Error link for handling GraphQL and network errors
 * Using ErrorLink class directly
 */
const errorLink = new ErrorLink((errorHandler) => {
  // Type assertion to access error properties
  const { graphQLErrors, networkError } = errorHandler as {
    graphQLErrors?: Array<{
      message: string;
      locations?: Array<{ line: number; column: number }>;
      path?: Array<string | number>;
      extensions?: Record<string, any>;
    }>;
    networkError?: Error & { statusCode?: number };
  };
  if (graphQLErrors) {
    graphQLErrors.forEach((error: any) => {
      const { message, locations, path, extensions } = error;
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      );

      // Log error code if available
      if (extensions?.code) {
        console.error(`Error code: ${extensions.code}`);
      }

      // Handle specific error types
      if (extensions?.code === "UNAUTHENTICATED") {
        // Handle authentication errors
        console.warn("User authentication required");
      }
    });
  }

  if (networkError) {
    console.error(`[Network error]: ${networkError}`);

    // Handle specific network errors
    if (
      "statusCode" in networkError &&
      (networkError as any).statusCode === 401
    ) {
      console.warn("Unauthorized request");
    }
  }
});

/**
 * Retry link for automatic retry of failed requests
 */
const retryLink = new RetryLink({
  delay: {
    initial: 300,
    max: Infinity,
    jitter: true,
  },
  attempts: {
    max: 3,
    retryIf: (error: any) => {
      // Retry on network errors, but not on GraphQL errors
      return !!error && !!error.networkError;
    },
  },
});

/**
 * HTTP link for GraphQL requests
 */
const httpLink = new HttpLink({
  uri: graphqlUrl,
  fetchOptions: {
    cache: "no-store", // Let Apollo Client handle caching
  },
  // Include credentials for authenticated requests if needed
  credentials: "same-origin",
});

/**
 * Create Apollo Client instance with enhanced configuration
 */
function makeClient() {
  // Chain links: error -> retry -> http
  // Use type assertion to handle version mismatch between packages
  const link = errorLink.concat(retryLink).concat(httpLink) as any;

  return new ApolloClient({
    link,
    cache: new InMemoryCache({
      typePolicies: {
        Student: {
          keyFields: ["id"],
          fields: {
            // Merge arrays when updating cache
            students: {
              merge(existing = [], incoming) {
                return incoming;
              },
            },
          },
        },
        Query: {
          fields: {
            students: {
              // Merge function for pagination support
              merge(existing = [], incoming) {
                return incoming;
              },
            },
          },
        },
      },
      // Optimize cache performance
      possibleTypes: {},
    }),
    // Default options for all queries
    defaultOptions: {
      watchQuery: {
        errorPolicy: "all", // Return partial data even if there are errors
        fetchPolicy: "cache-and-network", // Check cache first, then network
      },
      query: {
        errorPolicy: "all",
        fetchPolicy: "cache-first", // Use cache if available
      },
      mutate: {
        errorPolicy: "all",
        // Automatically refetch queries after mutations
        refetchQueries: "active",
      },
    },
    // Note: connectToDevTools is handled automatically by Apollo Client
  });
}

export function ApolloWrapper({ children }: React.PropsWithChildren) {
  return (
    <ApolloNextAppProvider makeClient={makeClient}>
      {children}
    </ApolloNextAppProvider>
  );
}
