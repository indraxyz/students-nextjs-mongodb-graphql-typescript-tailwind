# Students Management - Next.js + MongoDB + GraphQL

A modern full-stack application built with Next.js 15, MongoDB, and GraphQL using Apollo Server and Client. Features a feature-based architecture for optimal maintainability and scalability.

## Tech Stack

- **Next.js 15.5.2** (App Router with Turbopack)
- **React 19.1.0**
- **TypeScript 5** (Strict mode)
- **Apollo Server & Client** (GraphQL)
- **MongoDB** (with Mongoose)
- **Zod** (Runtime validation)
- **Tailwind CSS 4**
- **date-fns** (Date utilities)
- **Zustand** (State management)
- **Jest** (Testing)

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
- ✅ Feature-based architecture (frontend & backend)
- ✅ Modular component structure
- ✅ Custom hooks for separation of concerns
- ✅ Enhanced UI/UX with toasts and modals

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
├── app/                           # Next.js App Router
│   ├── api/
│   │   └── graphql/              # GraphQL API route
│   ├── src/                      # Student management feature 
│   │   ├── features/             # Feature-based modules
│   │   │   └── students/         # Student feature
│   │   │       ├── components/   # Feature components
│   │   │       ├── hooks/        # Feature hooks
│   │   │       ├── graphql/      # GraphQL operations
│   │   │       └── types/        # Feature types
│   │   ├── shared/               # Shared utilities
│   │   │   ├── hooks/            # Reusable hooks
│   │   │   ├── lib/              # Shared libraries
│   │   │   └── utils/            # Shared utilities
│   │   └── page.tsx              # Route page
│   └── layout.tsx                # Root layout
│
├── server/                        # Server-side code
│   ├── features/                 # Feature-based modules
│   │   └── students/             # Student feature
│   │       ├── datasources/      # Apollo DataSources
│   │       ├── models/           # Mongoose models
│   │       ├── resolvers/        # GraphQL resolvers
│   │       ├── schemas/          # GraphQL & validation schemas
│   │       └── types/            # Feature types
│   └── shared/                   # Shared utilities
│       ├── config/               # Environment configuration
│       ├── database/             # Database connection
│       ├── errors/               # Custom error classes
│       └── graphql/              # GraphQL utilities
│
└── public/                       # Static assets
```

## Architecture

### Feature-Based Organization

Both frontend and backend follow a feature-based architecture:

- **Features**: Self-contained modules with all related code (components, hooks, models, resolvers, etc.)
- **Shared**: Reusable utilities, configurations, and libraries
- **Benefits**: Better maintainability, scalability, and team collaboration

See detailed documentation:

- Frontend: [`app/src/README.md`](app/src/README.md) - Includes architecture details 
- Backend: [`server/README.md`](server/README.md) - Includes architecture details

## Key Improvements

### Type Safety

- All `any` types replaced with proper TypeScript interfaces
- GraphQL resolvers fully typed
- Zod schemas with type inference
- Strict TypeScript configuration

### Error Handling

- Custom error classes (`ValidationError`, `NotFoundError`, `DatabaseError`)
- Proper error codes and status codes
- GraphQL error formatting
- User-friendly error messages

### Validation

- Zod schemas for all inputs
- Runtime validation at API boundaries
- Environment variable validation at startup
- Form validation with real-time feedback

### Database

- Lazy connection initialization
- Connection pooling optimized
- Proper connection state management
- Event handlers registered only once

### Frontend Architecture

- Feature-based component organization
- Custom hooks for separation of concerns
- Modular, reusable components
- Enhanced UI/UX with toasts and modals
- Accessibility improvements

## Development

### Scripts

- `pnpm dev` - Start development server with Turbopack
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm test` - Run tests

## Best Practices

1. **Type Safety**: All code is strictly typed - avoid `any` types
2. **Validation**: Use Zod schemas for all inputs
3. **Error Handling**: Use custom error classes for better error messages
4. **Database**: Connection is lazy-loaded, don't call at module level
5. **Code Organization**: Follow the feature-based folder structure
6. **Components**: Keep components small and focused
7. **Hooks**: Extract reusable logic into custom hooks
8. **Testing**: Write tests for critical paths

## Documentation

- [Frontend README](app/src/README.md) - Frontend feature documentation and architecture
- [Backend README](server/README.md) - Backend architecture documentation

## License

MIT
