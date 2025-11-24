# ⚠️ DEPRECATED

This directory has been moved to the new feature-based structure.

## New Locations

- **Feature-specific hooks**: `app/study-graphql/features/students/hooks/`
  - `useStudentCRUD.ts`
  - `useStudentForm.ts`
  - `useStudentSearch.ts`
  - `useStudentUI.ts`
  - `useStudentManagement.ts`

- **Shared hooks**: `app/study-graphql/shared/hooks/`
  - `useDebounce.ts`

## Documentation

- [Feature Hooks README](../features/students/hooks/) - Feature-specific hooks documentation
- [Shared Hooks README](../shared/hooks/README.md) - Shared hooks documentation
- [Frontend README](../README.md) - Complete frontend documentation

## Migration

Update your imports:

```typescript
// Old
import { useStudentCRUD } from "@/app/study-graphql/hooks";

// New - Feature hooks
import { useStudentCRUD } from "@/app/study-graphql/features/students/hooks";

// New - Shared hooks
import { useDebounce } from "@/app/study-graphql/shared/hooks";
```

---

**Note**: This directory is kept for reference only. Please use the new structure.