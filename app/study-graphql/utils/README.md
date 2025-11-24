# ⚠️ DEPRECATED

This directory has been moved to the new feature-based structure.

## New Location

**Shared utilities**: `app/study-graphql/shared/utils/`
- `dateUtils.ts`

## Documentation

- [Shared Utils README](../shared/utils/README.md) - Complete utilities documentation
- [Frontend README](../README.md) - Complete frontend documentation

## Migration

Update your imports:

```typescript
// Old
import { formatDateTime } from "@/app/study-graphql/utils/dateUtils";

// New
import { formatDateTime } from "@/app/study-graphql/shared/utils";
```

## Available Functions

All date utility functions are available in the new location:

- `formatDateTime(dateString)` - Format complete date and time
- `formatDate(dateString)` - Format date only
- `formatTime(dateString)` - Format time only
- `getRelativeTime(dateString)` - Format relative time
- `isValidDate(dateString)` - Validate date

See [Shared Utils README](../shared/utils/README.md) for complete documentation.

---

**Note**: This directory is kept for reference only. Please use the new structure.