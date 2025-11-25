# Date Utilities

Utility functions for handling date and time formatting in the Student Management application.

## Location

These utilities are located in `app/src/shared/utils/` as part of the shared utilities that can be reused across features.

## Features

- ✅ Format date and time with Indonesia timezone (Asia/Jakarta)
- ✅ Robust error handling for various input formats
- ✅ Support for relative time (e.g., "2 hours ago")
- ✅ Comprehensive date validation
- ✅ Full TypeScript support

## Functions

### `formatDateTime(dateString)`

Format complete date and time with Indonesia timezone.

```typescript
import { formatDateTime } from "@/app/src/shared/utils";

formatDateTime("2024-01-15T10:30:00.000Z");
// Output: "15 Jan 2024, 17.30"
```

### `formatDate(dateString)`

Format date only without time.

```typescript
import { formatDate } from "@/app/src/shared/utils";

formatDate("2024-01-15T10:30:00.000Z");
// Output: "15 January 2024"
```

### `formatTime(dateString)`

Format time only without date.

```typescript
import { formatTime } from "@/app/src/shared/utils";

formatTime("2024-01-15T10:30:00.000Z");
// Output: "17.30"
```

### `getRelativeTime(dateString)`

Format relative time (e.g., "2 hours ago").

```typescript
import { getRelativeTime } from "@/app/src/shared/utils";

getRelativeTime("2024-01-15T10:30:00.000Z");
// Output: "2 hours ago" or "15 January 2024" (if more than 30 days)
```

### `isValidDate(dateString)`

Validate whether a string is a valid date.

```typescript
import { isValidDate } from "@/app/src/shared/utils";

isValidDate("2024-01-15T10:30:00.000Z");
// Output: true

isValidDate("invalid-date");
// Output: false
```

## Usage

```typescript
import {
  formatDateTime,
  formatDate,
  getRelativeTime,
} from "@/app/src/shared/utils";

// In component
const createdAt = formatDateTime(student.createdAt);
const joinDate = formatDate(student.createdAt);
const lastUpdate = getRelativeTime(student.updatedAt);
```

## Error Handling

All functions have robust error handling:

- If input is `null` or `undefined` → returns "N/A"
- If date is invalid → returns "Invalid date"
- If parsing error occurs → returns "Error parsing date"

## Timezone

All functions use `Asia/Jakarta` timezone for consistency with Indonesian users.

## Supported Input Formats

- ISO 8601: `2024-01-15T10:30:00.000Z`
- ISO with timezone offset: `2024-01-15T10:30:00+07:00`
- Date string: `"2024-01-15"`
- Timestamp: `1705312200000`

## Architecture

These utilities are part of the `shared/` directory, which contains reusable code that can be used across multiple features. This follows the feature-based architecture pattern where:

- **Features** contain feature-specific code
- **Shared** contains reusable utilities, hooks, and libraries

See [Frontend README](../README.md) for more details on the architecture.
