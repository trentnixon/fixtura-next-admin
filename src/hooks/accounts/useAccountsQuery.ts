import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { fetchAdminAccountLookup } from "@/lib/services/accounts/fetchAdminAccountLookup";
import { AccountLookupItem } from "@/types/adminAccountLookup";

interface CategorizedAccounts {
  clubs: {
    active: AccountLookupItem[];
    inactive: AccountLookupItem[];
  };
  associations: {
    active: AccountLookupItem[];
    inactive: AccountLookupItem[];
  };
  undefined: {
    active: AccountLookupItem[];
    inactive: AccountLookupItem[];
  };
}

/**
 * React Query hook for fetching and categorizing all accounts from the admin lookup endpoint.
 *
 * Fetches all accounts and categorizes them into clubs/associations and active/inactive groups.
 * Active accounts have an active subscription (hasActiveOrder === true).
 * Inactive accounts have no active subscription (hasActiveOrder === false).
 * Uses the optimized admin lookup endpoint which provides formatted account data including
 * subscription information, account status, and related entities.
 *
 * @returns UseQueryResult with categorized accounts data
 */
export function useAccountsQuery(): UseQueryResult<CategorizedAccounts, Error> {
  return useQuery<CategorizedAccounts, Error>({
    queryKey: ["admin", "account-lookup"], // Cache key for the query
    queryFn: async () => {
      const response = await fetchAdminAccountLookup();

      const categorizedAccounts: CategorizedAccounts = {
        clubs: { active: [], inactive: [] },
        associations: { active: [], inactive: [] },
        undefined: { active: [], inactive: [] },
      };

      // Categorize accounts based on account_type and subscription status (hasActiveOrder)
      response.data.forEach((account) => {
        const accountType = account.account_type;
        const hasActiveSubscription = account.hasActiveOrder;

        if (accountType === "Club") {
          if (hasActiveSubscription) {
            categorizedAccounts.clubs.active.push(account);
          } else {
            categorizedAccounts.clubs.inactive.push(account);
          }
        } else if (accountType === "Association") {
          if (hasActiveSubscription) {
            categorizedAccounts.associations.active.push(account);
          } else {
            categorizedAccounts.associations.inactive.push(account);
          }
        } else {
          // Handle accounts with null or undefined account_type
          if (hasActiveSubscription) {
            categorizedAccounts.undefined.active.push(account);
          } else {
            categorizedAccounts.undefined.inactive.push(account);
          }
        }
      });

      return categorizedAccounts;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes - as recommended in API docs
    refetchOnWindowFocus: false, // Prevent unnecessary API calls on window focus
    retry: 3, // Retry failed requests
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000), // Exponential backoff (up to 10 seconds)
  });
}
