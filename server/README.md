# Server Architecture

This directory contains the server-side code for the GraphQL API and database operations. The architecture follows a feature-based organization pattern for optimal maintainability and scalability.

## Structure

```
server/
├── features/                    # Feature-based modules
│   └── students/               # Student management feature
│       ├── datasources/       # Apollo DataSources
│       │   └── Students.ts
│       ├── models/            # Mongoose models
│       │   └── Student.ts
│       ├── resolvers/         # GraphQL resolvers
│       │   └── index.ts
│       ├── schemas/           # GraphQL & validation schemas
│       │   ├── graphql.ts     # GraphQL typeDefs
│       │   └── validation.ts  # Zod validation schemas
│       └── types/             # TypeScript types
│           └── index.ts
│
├── shared/                     # Shared utilities and configurations
│   ├── config/                # Environment configuration
│   │   └── env.ts
│   ├── database/              # Database connection
│   │   └── connectDB.ts
│   ├── errors/                # Custom error classes
│   │   └── index.ts
│   └── graphql/               # GraphQL utilities
│       ├── formatError.ts
│       └── types.ts
│
└── README.md                   # This file (includes architecture documentation)
```

## Architecture Principles

### 1. Feature-Based Organization

- Each feature is self-contained in its own directory
- All feature-related code (models, resolvers, schemas, datasources, types) is colocated
- Makes it easy to understand, maintain, and scale
- Clear boundaries between features

### 2. Shared Code Separation

- Reusable utilities, configurations, and error classes are in `shared/`
- Clear distinction between feature-specific and shared code
- Promotes code reuse across features
- Single source of truth for shared functionality

### 3. Type Safety

- Types are colocated with their features
- Shared GraphQL types in `shared/graphql/types.ts`
- Full TypeScript support throughout
- No `any` types allowed

### 4. Validation

- Zod schemas for runtime validation
- Validation happens at resolver level
- Type-safe validation with automatic TypeScript type inference
- Consistent validation across all inputs

## Key Features

### Environment Variable Validation

- All environment variables are validated at startup using Zod
- Located in `server/shared/config/env.ts`
- Throws descriptive errors if required variables are missing
- Type-safe environment configuration

### Error Handling

- Custom error classes in `server/shared/errors/index.ts`:
  - `AppError` - Base error class
  - `ValidationError` - For input validation failures (400)
  - `NotFoundError` - For resource not found scenarios (404)
  - `DatabaseError` - For database operation failures (500)
- GraphQL errors are properly formatted with error codes and status codes
- User-friendly error messages

### Database Connection

- Lazy connection initialization (connects on first request)
- Connection pooling configured for optimal performance
- Proper connection state management
- Event handlers registered only once to prevent duplicates
- Graceful error handling and reconnection

### GraphQL Setup

- Apollo Server with Next.js integration
- Type-safe resolvers with TypeScript
- Custom error formatting
- DataSources for database operations
- Schema-first approach with typeDefs

## Adding a New Feature

1. Create a new directory under `features/`

   ```bash
   mkdir -p server/features/your-feature/{datasources,models,resolvers,schemas,types}
   ```

2. Add feature-specific code:

   - `models/` - Mongoose models
   - `datasources/` - Apollo DataSources
   - `resolvers/` - GraphQL resolvers
   - `schemas/` - GraphQL typeDefs and Zod validation schemas
   - `types/` - TypeScript types

3. Update `app/api/graphql/route.ts`:

   - Import new typeDefs and add to `typeDefs` array
   - Import new resolvers and merge with existing resolvers
   - Add new dataSource to context

4. Update `server/shared/graphql/types.ts`:
   - Add new dataSource to `ApolloContext` interface

## Import Patterns

### Feature Imports

```typescript
// From within a feature
import { StudentDocument } from "../types";
import { studentInputSchema } from "../schemas/validation";
import Student from "../models/Student";

// From outside a feature
import { StudentDocument } from "@/server/features/students/types";
import { studentInputSchema } from "@/server/features/students/schemas/validation";
```

### Shared Imports

```typescript
// Shared utilities
import { connectDB } from "@/server/shared/database/connectDB";
import {
  ValidationError,
  NotFoundError,
  DatabaseError,
} from "@/server/shared/errors";
import { env } from "@/server/shared/config/env";
import { ApolloContext } from "@/server/shared/graphql/types";
```

## Best Practices

1. **Always validate inputs** using Zod schemas before database operations
2. **Use custom error classes** instead of generic Error
3. **Type everything** - avoid `any` types
4. **Handle errors gracefully** with proper error messages
5. **Lazy load connections** - don't connect at module level
6. **Colocate related code** - keep feature code together
7. **Use DataSources** for database operations, not direct model access
8. **Validate at boundaries** - validate inputs at resolver level
9. **Document complex logic** - add comments for non-obvious code
10. **Test features in isolation** - each feature should be testable independently

## Example: Student Feature

### Model (`features/students/models/Student.ts`)

```typescript
import mongoose from "mongoose";

const studentSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    // ...
  },
  { timestamps: true }
);

export default mongoose.models.Student ||
  mongoose.model("Student", studentSchema);
```

### Validation Schema (`features/students/schemas/validation.ts`)

```typescript
import { z } from "zod";

export const studentInputSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  // ...
});

export type StudentInput = z.infer<typeof studentInputSchema>;
```

### DataSource (`features/students/datasources/Students.ts`)

```typescript
import { MongoDataSource } from "apollo-datasource-mongodb";
import Student from "../models/Student";
import { StudentDocument } from "../types";

export default class Students extends MongoDataSource<StudentDocument> {
  async getAllStudents(input: SearchStudentInput): Promise<StudentDocument[]> {
    // Implementation
  }
}
```

### Resolver (`features/students/resolvers/index.ts`)

```typescript
import { studentInputSchema } from "../schemas/validation";
import { ValidationError } from "@/server/shared/errors";

export const studentResolvers = {
  Query: {
    students: async (_, args, context) => {
      const validatedInput = studentInputSchema.parse(args.input);
      return await context.dataSources.students.getAllStudents(validatedInput);
    },
  },
};
```

## Testing

- Unit tests for resolvers
- Integration tests for DataSources
- Validation schema tests
- Error handling tests

## Documentation

- [Root README](../../README.md) - Project overview

---

This architecture provides a scalable, maintainable foundation for building GraphQL APIs with MongoDB and Next.js.
