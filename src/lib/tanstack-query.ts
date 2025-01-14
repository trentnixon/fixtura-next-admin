import { QueryClient } from "@tanstack/react-query";

const MINUTE = 1000 * 60;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3, // Retry failed requests
      retryDelay: attempt => Math.min(1000 * 2 ** attempt, 10000), // Exponential backoff
      staleTime: 5 * MINUTE, // Data is considered fresh for 5 minutes
      gcTime: 30 * MINUTE, // Data is retained in the cache for 30 minutes after being unused
    },
    mutations: {
      retry: 2, // Retry failed mutations up to 2 times
      retryDelay: attempt => Math.min(1000 * 2 ** attempt, 5000), // Exponential backoff for mutations
    },
  },
});

// Global error handling for queries
queryClient.getQueryCache().subscribe(event => {
  if (event?.type === "updated" && event?.query?.state?.error) {
    const { queryKey, state } = event.query;

    console.error("[React Query Global Error]", {
      queryKey,
      error: state.error,
    });

    // Optional: Log to monitoring tools like Sentry
    // Sentry.captureException(state.error, { extra: { queryKey } });
  }
});
