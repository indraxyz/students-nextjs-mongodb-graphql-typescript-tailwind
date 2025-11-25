# Student Management System with GraphQL

A student management system implementation using Apollo Client, Next.js App Router, TypeScript, and Tailwind CSS with feature-based architecture.

## Project Structure

```
app/src/
├── features/                    # Feature-based modules
│   └── students/               # Student management feature
│       ├── components/         # Feature-specific components
│       │   ├── StudentManagement.tsx
│       │   └── student-management/  # Sub-components
│       │       ├── PageHeader.tsx
│       │       ├── SearchToolbar.tsx
│       │       ├── StatsBar.tsx
│       │       ├── StudentCard.tsx
│       │       ├── StudentFormModal.tsx
│       │       ├── EmptyState.tsx
│       │       ├── ToastBanner.tsx
│       │       ├── ConfirmDialog.tsx
│       │       ├── StateOverlay.tsx
│       │       ├── FormField.tsx
│       │       ├── types.ts
│       │       └── index.ts
│       ├── hooks/              # Feature-specific hooks
│       │   ├── useStudentCRUD.ts
│       │   ├── useStudentForm.ts
│       │   ├── useStudentSearch.ts
│       │   ├── useStudentUI.ts
│       │   ├── useStudentManagement.ts
│       │   └── index.ts
│       ├── graphql/            # Feature-specific GraphQL operations
│       │   ├── queries.ts
│       │   ├── mutations.ts
│       │   └── index.ts
│       └── types/              # Feature-specific types
│           └── student.ts
│
├── shared/                     # Shared utilities and components
│   ├── hooks/                  # Reusable hooks
│   │   ├── useDebounce.ts
│   │   └── index.ts
│   ├── lib/                    # Shared libraries/config
│   │   └── ApolloWrapper.tsx
│   └── utils/                  # Shared utilities
│       ├── dateUtils.ts
│       └── index.ts
│
├── page.tsx                    # Route page
└── README.md                   # This file (includes architecture documentation)
```

## Main Features

### CRUD Operations

- **Create**: Add new student with validation
- **Read**: Display student list with pagination
- **Update**: Edit existing student data
- **Delete**: Delete student with confirmation dialog

### Search & Filter

- **Real-time search**: Search by name, email, or address
- **Debounced search**: Optimized for performance
- **Sorting**: Sort by any field
- **Pagination**: Limit and offset for large datasets

### UI Features

- **Responsive design**: Adaptive grid layout
- **Loading states**: Loading indicators for all operations
- **Error handling**: Error messages with retry options
- **Modal forms**: Form in modal overlay with ARIA support
- **Toast notifications**: Non-intrusive success/error notifications
- **Confirmation dialogs**: Custom dialog for delete confirmation
- **Empty states**: Informative UI when no data is available
- **Accessibility**: ARIA labels and keyboard navigation

## Main Components

### **StudentManagement** - Main Component

Main component that uses custom hooks for separation of concerns:

```typescript
import { StudentManagement } from "@/app/src/features/students/components/StudentManagement";

export default function Page() {
  return <StudentManagement />;
}
```

### Custom Hooks

#### **useStudentManagement** - Main Hook

Main hook that combines all functionality:

```typescript
const {
  // Data
  students,
  isLoading,
  error,

  // Search & Sort
  searchTerm,
  searchStats,
  sortBy,
  sortOrder,
  sortOptions,

  // Form
  formData,
  formErrors,
  isSubmitting,

  // UI State
  showForm,
  editingStudent,
  isEditing,
  isCreating,

  // Actions
  handleSearchChange,
  handleSortChange,
  toggleSortOrder,
  handleInputChange,
  handleSubmit,
  handleCreate,
  handleEdit,
  handleDelete,
  handleFormClose,

  // Utilities
  refetch,
} = useStudentManagement();
```

#### **useStudentForm** - Form Management

Handles form state, validation, and submit logic.

#### **useStudentCRUD** - Data Operations

Handles Create, Read, Update, Delete operations with GraphQL.

#### **useStudentSearch** - Search & Sorting

Handles search and sorting with debouncing.

#### **useStudentUI** - UI State Management

Handles UI state such as modals, loading, and interactions.

## UX Enhancements

- **Modal form** with full ARIA support and inline error feedback
- **Search toolbar** responsive with clear labels for screen readers
- **Notification banner** global replacement for `alert` to display success/error
- **Confirmation dialog** custom replacement for `window.confirm`
- **Separated components** (header, toolbar, cards, empty state) for better testable DX
- **Clear loading states** for each operation
- **Error boundaries** with user-friendly messages

## Usage

### 1. Access Pages

- **Homepage** (`/`): Landing page with real-time statistics and feature overview
- **Student Management** (`/src`): Full CRUD interface for managing students

### 2. CRUD Operations

- **Add**: Click "Add Student" button in header
- **Edit**: Click "Edit" button on student card
- **Delete**: Click "Delete" button with confirmation dialog
- **View**: Data displayed in responsive grid cards

### 3. Search & Sort

- Type in search bar to search by name, email, or address
- Select field for sorting from dropdown
- Toggle sort order (asc/desc) with button

## Benefits of Feature-Based Architecture

### Scalability

- Easy to add new features without affecting existing ones
- Each feature is self-contained
- Clear boundaries between features

### Maintainability

- Related code is grouped together
- Easy to find and modify code
- Changes in one feature don't affect others

### Testability

- Features can be tested in isolation
- Shared utilities can be tested separately
- Clear dependencies

### Team Collaboration

- Reduces merge conflicts with clear boundaries
- Multiple developers can work on different features
- Clear ownership

### Reusability

- Shared code is clearly separated
- Features can reuse shared utilities
- Components can be shared across features

## Tech Stack

- **Next.js 15.5.6** with App Router and Turbopack
- **React 19.1.0** with Server Components
- **Apollo Client** for GraphQL
- **TypeScript 5** (Strict mode) for type safety
- **Tailwind CSS 4** for styling
- **Zod** for validation
- **date-fns** for date utilities

## Error Handling

- GraphQL errors displayed clearly
- Network errors with retry options
- Real-time form validation
- Proper loading states
- User-friendly custom error messages

## Import Patterns

### Feature Imports

```typescript
// From within a feature
import { Student } from "../types/student";
import { useStudentCRUD } from "../hooks";

// From outside a feature
import { Student } from "@/app/src/features/students/types/student";
import { useStudentCRUD } from "@/app/src/features/students/hooks";
```

### Shared Imports

```typescript
// Shared utilities
import { useDebounce } from "@/app/src/shared/hooks";
import { formatDate } from "@/app/src/shared/utils";
import { ApolloWrapper } from "@/app/src/shared/lib";
```

## Documentation

- [Root README](../../README.md) - Project overview

## Best Practices

1. **Feature-Based Organization**: Keep feature code together
2. **Shared Code**: Use `shared/` for reusable utilities
3. **Type Safety**: Use TypeScript interfaces for all types
4. **Component Size**: Keep components small and focused
5. **Custom Hooks**: Extract reusable logic into hooks
6. **Error Handling**: Handle errors gracefully with user-friendly messages
7. **Accessibility**: Use ARIA labels and keyboard navigation
8. **Performance**: Use memoization and debouncing where appropriate

---

**Note**: This structure is designed to provide optimal developer experience with full TypeScript support, high maintainability, and scalability for growing projects.
