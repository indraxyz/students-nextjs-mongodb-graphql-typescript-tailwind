# Students Management - Next.js + MongoDB + GraphQL

A modern full-stack application built with Next.js 15, MongoDB, and GraphQL using Apollo Server and Client.

## Tech Stack

- **Next.js 15.5.2** (App Router with Turbopack)
- **React 19.1.0**
- **TypeScript 5** (Strict mode)
- **Apollo Server & Client** (GraphQL)
- **MongoDB** (with Mongoose)
- **Zod** (Runtime validation)
- **Tailwind CSS 4**
- **date-fns** (Date utilities)

## Features

- ✅ Type-safe GraphQL API with proper TypeScript types
- ✅ Runtime validation with Zod schemas
- ✅ Environment variable validation
- ✅ Custom error handling with proper error codes
- ✅ Optimized database connection pooling
- ✅ Lazy database connection initialization
- ✅ Comprehensive error messages
- ✅ Student CRUD operations
- ✅ Search and filtering capabilities
- ✅ Sorting and pagination

## Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB (local or cloud instance)
- pnpm (recommended) or npm

### Installation

1. Clone the repository
2. Install dependencies:
```bash
pnpm install
```

3. Create a `.env` file in the root directory:
```env
MONGODB_URI=mongodb://localhost:27017/students-db
NODE_ENV=development
```

4. Start the development server:
```bash
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
├── app/                    # Next.js App Router
│   ├── api/graphql/       # GraphQL API route
│   └── study-graphql/     # Student management pages
├── server/                 # Server-side code
│   ├── config/            # Configuration (env validation)
│   ├── datasources/       # Apollo DataSources
│   ├── models/            # Mongoose models
│   ├── resolvers/         # GraphQL resolvers
│   ├── schemas/           # GraphQL schemas & Zod validation
│   ├── types/             # TypeScript types
│   └── utils/             # Utilities (DB, errors)
└── public/                # Static assets
```

## Key Improvements

### Type Safety
- All `any` types replaced with proper TypeScript interfaces
- GraphQL resolvers fully typed
- Zod schemas with type inference

### Error Handling
- Custom error classes (`ValidationError`, `NotFoundError`, `DatabaseError`)
- Proper error codes and status codes
- GraphQL error formatting

### Validation
- Zod schemas for all inputs
- Runtime validation at API boundaries
- Environment variable validation at startup

### Database
- Lazy connection initialization
- Connection pooling optimized
- Proper connection state management
- Event handlers registered only once

## Development

### Scripts

- `pnpm dev` - Start development server with Turbopack
- `pnpm build` - Build for production
- `pnpm start` - Start production server

## Best Practices

1. **Type Safety**: All code is strictly typed - avoid `any` types
2. **Validation**: Use Zod schemas for all inputs
3. **Error Handling**: Use custom error classes for better error messages
4. **Database**: Connection is lazy-loaded, don't call at module level
5. **Code Organization**: Follow the established folder structure

## License

MIT