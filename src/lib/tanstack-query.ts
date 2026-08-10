import { QueryClient } from "@tanstack/react-query";

const MINUTE = 1000 * 60;

const queryClientDefaults = {
  defaultOptions: {
    queries: {
      retry: 3, // Retry failed requests
      retryDelay: (attempt: number) => Math.min(1000 * 2 ** attempt, 10000), // Exponential backoff
      staleTime: 5 * MINUTE, // Data is considered fresh for 5 minutes
      gcTime: 30 * MINUTE, // Data is retained in the cache for 30 minutes after being unused
    },
    mutations: {
      retry: 2, // Retry failed mutations up to 2 times
      retryDelay: (attempt: number) => Math.min(1000 * 2 ** attempt, 5000), // Exponential backoff for mutations
    },
  },
} as const;

export function createQueryClient() {
  const client = new QueryClient(queryClientDefaults);

  client.getQueryCache().subscribe((event) => {
    if (event?.type === "updated" && event?.query?.state?.error) {
      const { queryKey, state } = event.query;

      console.error("[React Query Global Error]", {
        queryKey,
        error: state.error,
      });
    }
  });

  return client;
}

/** @deprecated Prefer createQueryClient() inside QueryProvider for SSR-safe isolation. */
export const queryClient = createQueryClient();
