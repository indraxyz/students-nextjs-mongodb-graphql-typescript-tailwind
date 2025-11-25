# Shared Hooks

Reusable custom hooks that can be used across multiple features in the application.

## Location

These hooks are located in `app/src/shared/hooks/` as part of the shared utilities that can be reused across features.

## Available Hooks

### `useDebounce`

Hook for debouncing values, useful for search input and performance optimization.

```typescript
import { useDebounce } from "@/app/src/shared/hooks";

function SearchComponent() {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // debouncedSearchTerm will update 500ms after user stops typing
  useEffect(() => {
    // Perform search with debouncedSearchTerm
  }, [debouncedSearchTerm]);

  return (
    <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
  );
}
```

**Parameters:**

- `value: T` - Value to be debounced
- `delay: number` - Delay in milliseconds (default: 500)

**Returns:**

- `debouncedValue: T` - Debounced value

## Usage

```typescript
import { useDebounce } from "@/app/src/shared/hooks";

function MyComponent() {
  const [input, setInput] = useState("");
  const debouncedInput = useDebounce(input, 500);

  // Use debouncedInput for API calls or expensive operations
  useEffect(() => {
    if (debouncedInput) {
      // Perform operation
    }
  }, [debouncedInput]);

  return <input value={input} onChange={(e) => setInput(e.target.value)} />;
}
```

## Architecture

These hooks are part of the `shared/` directory, which contains reusable code that can be used across multiple features. This follows the feature-based architecture pattern where:

- **Features** contain feature-specific code (e.g., `features/students/hooks/`)
- **Shared** contains reusable utilities, hooks, and libraries

### When to Use Shared Hooks

Use shared hooks when:

- The hook is generic and can be used by multiple features
- The hook doesn't depend on feature-specific logic
- The hook provides general-purpose functionality

### When to Use Feature Hooks

Use feature hooks when:

- The hook is specific to a feature's business logic
- The hook depends on feature-specific types or utilities
- The hook is tightly coupled to a feature's requirements

## Examples

### Search with Debounce

```typescript
import { useDebounce } from "@/app/src/shared/hooks";

function SearchBar() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    if (debouncedQuery) {
      // Perform search
      performSearch(debouncedQuery);
    }
  }, [debouncedQuery]);

  return (
    <input
      type="text"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Search..."
    />
  );
}
```

### Form Input with Debounce

```typescript
import { useDebounce } from "@/app/src/shared/hooks";

function FormInput() {
  const [value, setValue] = useState("");
  const debouncedValue = useDebounce(value, 300);

  useEffect(() => {
    // Validate or save debounced value
    validateInput(debouncedValue);
  }, [debouncedValue]);

  return <input value={value} onChange={(e) => setValue(e.target.value)} />;
}
```

## Best Practices

1. **Use appropriate delay**: Choose delay based on use case (search: 300-500ms, form: 500-1000ms)
2. **Cleanup**: The hook automatically cleans up timers on unmount
3. **Type safety**: The hook is fully typed with TypeScript
4. **Performance**: Use debouncing for expensive operations like API calls

## See Also

- [Frontend README](../README.md) - Architecture documentation
- [Feature Hooks](../../features/students/hooks/) - Feature-specific hooks
- [Root README](../../../../README.md) - Project documentation
