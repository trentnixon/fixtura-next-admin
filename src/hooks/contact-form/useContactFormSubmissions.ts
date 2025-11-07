import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { ContactFormAdminResponse } from "@/types/contact-form";
import { fetchContactFormSubmissions } from "@/lib/services/contact-form/fetchContactFormSubmissions";

/**
 * React Query hook for fetching all contact form submissions for admin
 *
 * Provides all contact form submissions with metadata including total count.
 * Results are cached for 1 minute and refetched every 5 minutes for real-time updates.
 *
 * @returns UseQueryResult with contact form submissions data
 */
export function useContactFormSubmissions(): UseQueryResult<
  ContactFormAdminResponse,
  Error
> {
  return useQuery<ContactFormAdminResponse, Error>({
    queryKey: ["contactForms", "admin", "all"],
    queryFn: () => fetchContactFormSubmissions(),
    staleTime: 1 * 60 * 1000, // 1 minute
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    retry: 3, // Retry failed requests
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000), // Exponential backoff
  });
}

/**
 * Convenience hook that returns just the data array and total count
 *
 * @returns Object with data array, total count, and all query state properties
 */
export function useContactFormSubmissionsData() {
  const { data, ...rest } = useContactFormSubmissions();

  return {
    ...rest,
    data: data?.data ?? [],
    total: data?.meta.total ?? 0,
  };
}
