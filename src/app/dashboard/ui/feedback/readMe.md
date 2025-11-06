# Feedback Components

Reusable feedback and state components for user feedback, loading states, errors, empty states, and toast notifications.

## Components

### Loading States

Loading state components for async operations and data loading.

#### `LoadingState`

Provides feedback during async operations and data loading.

**Props:**

- `message?: string` - Loading message to display
- `variant?: "default" | "minimal" | "skeleton"` - Loading variant (default: "default")
- `children?: React.ReactNode` - For skeleton variant, provides skeleton content

**Usage:**

```tsx
import LoadingState from "@/components/ui-library/states/LoadingState";

// Default loading
<LoadingState message="Loading accounts..." />

// Minimal loading
<LoadingState variant="minimal" />

// Skeleton loading
<LoadingState variant="skeleton">
  <Skeleton className="h-20 w-full mb-2" />
  <Skeleton className="h-20 w-full mb-2" />
</LoadingState>
```

### Error States

Error state components for displaying errors with optional retry functionality.

#### `ErrorState`

Displays errors with optional retry functionality.

**Props:**

- `error: string | Error` - Error message or Error object
- `variant?: "default" | "card" | "minimal"` - Error variant (default: "default")
- `title?: string` - Error title (for card variant)
- `description?: string` - Error description (for card variant)
- `onRetry?: () => void` - Retry callback function

**Usage:**

```tsx
import ErrorState from "@/components/ui-library/states/ErrorState";

// Default error
<ErrorState
  error="Failed to load data"
  onRetry={() => refetch()}
/>

// Card error
<ErrorState
  variant="card"
  title="Error Loading Data"
  description="Unable to fetch account information"
  onRetry={() => refetch()}
/>

// Minimal error
<ErrorState variant="minimal" error="Something went wrong" />
```

### Empty States

Empty state components for when no data is available.

#### `EmptyState`

Shows when no data is available with optional actions.

**Props:**

- `title?: string` - Empty state title
- `description?: string` - Empty state description
- `variant?: "default" | "card" | "minimal"` - Empty state variant (default: "default")
- `icon?: React.ReactNode` - Custom icon component
- `actionLabel?: string` - Action button label
- `onAction?: () => void` - Action callback function
- `action?: React.ReactNode` - Custom action component

**Usage:**

```tsx
import EmptyState from "@/components/ui-library/states/EmptyState";
import { Inbox } from "lucide-react";

// Default empty state
<EmptyState
  title="No accounts found"
  description="Start by creating your first account"
  actionLabel="Create Account"
  onAction={handleCreate}
/>

// With custom icon
<EmptyState
  title="No search results"
  description="Try adjusting your search criteria"
  icon={<Inbox className="h-12 w-12 text-muted-foreground" />}
  actionLabel="Clear Filters"
  onAction={handleClearFilters}
/>

// With custom action
<EmptyState
  title="No notifications"
  description="You're all caught up!"
  action={
    <div className="flex gap-2">
      <Button variant="outline">Settings</Button>
      <Button>Learn More</Button>
    </div>
  }
/>
```

### Toast Notifications

Toast notification system using Sonner.

#### Setup

The `Toaster` component is already added to the root layout (`src/app/layout.tsx`), so toasts work globally across the application.

#### `toast` API

Import and use the `toast` function from `sonner`:

```tsx
import { toast } from "sonner";

// Basic toast
toast("Event has been created");

// Success toast
toast.success("Account created successfully");

// Error toast
toast.error("Failed to save changes");

// Info toast
toast.info("New update available");

// Warning toast
toast.warning("Please review your settings");
```

#### Toast with Description

```tsx
toast.success("Account created", {
  description: "Your account has been successfully created.",
});

toast.error("Failed to save", {
  description: "There was an error saving your changes. Please try again.",
});
```

#### Toast with Actions

```tsx
toast.success("Account created", {
  description: "Your account has been successfully created.",
  action: {
    label: "View Account",
    onClick: () => navigateToAccount(),
  },
});

toast.error("Failed to save", {
  description: "There was an error saving your changes.",
  action: {
    label: "Retry",
    onClick: () => retrySave(),
  },
});
```

#### Custom Duration

```tsx
// Custom duration (milliseconds)
toast("This toast stays for 5 seconds", {
  duration: 5000,
});

// Stay until dismissed
toast("This toast stays until dismissed", {
  duration: Infinity,
});
```

#### Promise Toast

For async operations with automatic loading/success/error states:

```tsx
const promise = fetchData();

toast.promise(promise, {
  loading: "Loading...",
  success: (data) => `${data.name} loaded successfully`,
  error: "Failed to load data",
});

// With error handling
toast.promise(promise, {
  loading: "Saving...",
  success: "Saved successfully",
  error: (err) => `Error: ${err.message}`,
});
```

## File Locations

- Components:
  - `src/components/ui-library/states/LoadingState.tsx`
  - `src/components/ui-library/states/ErrorState.tsx`
  - `src/components/ui-library/states/EmptyState.tsx`
  - `src/components/ui/sonner.tsx` (Toaster wrapper)
- Showcase: `src/app/dashboard/ui/feedback/_components/_elements/`
- Documentation: This file

## Dependencies

- `sonner` - Toast notification library
- `@radix-ui/react-progress` - Progress indicators (for loading states)
- `lucide-react` - Icons

## Usage Guidelines

### Loading States

- Use `variant="default"` for full-page or section loading
- Use `variant="minimal"` for inline loading indicators
- Use `variant="skeleton"` for content placeholders
- Always provide a descriptive message when possible

### Error States

- Use `variant="default"` for full-page errors
- Use `variant="card"` for section-level errors
- Use `variant="minimal"` for inline error messages
- Always provide a retry option when the error is recoverable
- Use descriptive error messages that help users understand the issue

### Empty States

- Use `variant="default"` for full-page empty states
- Use `variant="card"` for section-level empty states
- Use `variant="minimal"` for compact empty states
- Always provide a clear call-to-action when applicable
- Use custom icons to match the context (search, filters, etc.)

### Toast Notifications

- Use `toast.success()` for successful operations
- Use `toast.error()` for error messages
- Use `toast.info()` for informational messages
- Use `toast.warning()` for warnings
- Use `toast.promise()` for async operations with loading states
- Always provide descriptive messages
- Add descriptions for context when helpful
- Use action buttons for important toasts
- Set custom duration for time-sensitive messages
