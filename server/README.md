# Server Architecture

This directory contains the server-side code for the GraphQL API and database operations.

## Structure

```
server/
├── config/          # Configuration files (env validation)
├── datasources/     # Apollo DataSources for MongoDB
├── models/          # Mongoose models
├── resolvers/       # GraphQL resolvers
├── schemas/         # GraphQL type definitions and Zod validation schemas
├── types/           # TypeScript type definitions
└── utils/           # Utility functions (DB connection, errors)
```

## Key Features

### Environment Variable Validation

- All environment variables are validated at startup using Zod
- Located in `server/config/env.ts`
- Throws descriptive errors if required variables are missing

### Type Safety

- All GraphQL resolvers use proper TypeScript types (no `any`)
- Type definitions in `server/types/graphql.ts`
- Zod schemas for runtime validation with type inference

### Error Handling

- Custom error classes in `server/utils/errors.ts`:
  - `AppError` - Base error class
  - `ValidationError` - For input validation failures
  - `NotFoundError` - For resource not found scenarios
  - `DatabaseError` - For database operation failures
- GraphQL errors are properly formatted with error codes and status codes

### Database Connection

- Lazy connection initialization (connects on first request)
- Connection pooling configured for optimal performance
- Proper connection state management
- Event handlers registered only once to prevent duplicates

### Validation

- Zod schemas for all GraphQL inputs
- Validation happens at the resolver level
- Type-safe validation with automatic TypeScript type inference

## Best Practices

1. **Always validate inputs** using Zod schemas before database operations
2. **Use custom error classes** instead of generic Error
3. **Type everything** - avoid `any` types
4. **Handle errors gracefully** with proper error messages
5. **Lazy load connections** - don't connect at module level
