import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { fetchAccounts } from "@/lib/services/accounts/fetchAccounts";
import { Account } from "@/types/account";

interface CategorizedAccounts {
  clubs: {
    active: Account[];
    inactive: Account[];
  };
  associations: {
    active: Account[];
    inactive: Account[];
  };
  undefined: {
    active: Account[];
    inactive: Account[];
  };
}

export function useAccountsQuery(): UseQueryResult<CategorizedAccounts, Error> {
  return useQuery<CategorizedAccounts, Error>({
    queryKey: ["accounts"], // Cache key for the query
    queryFn: async () => {
      const { data: accounts } = await fetchAccounts();

      const categorizedAccounts: CategorizedAccounts = {
        clubs: { active: [], inactive: [] },
        associations: { active: [], inactive: [] },
        undefined: { active: [], inactive: [] },
      };

      // Categorize accounts
      accounts.forEach(account => {
        const accountType =
          account.attributes.account_type?.data?.attributes?.Name;

        if (accountType === "Club") {
          if (account.attributes.isActive) {
            categorizedAccounts.clubs.active.push(account);
          } else {
            categorizedAccounts.clubs.inactive.push(account);
          }
        } else if (accountType === "Association") {
          if (account.attributes.isActive) {
            categorizedAccounts.associations.active.push(account);
          } else {
            categorizedAccounts.associations.inactive.push(account);
          }
        } else {
          if (account.attributes.isActive) {
            categorizedAccounts.undefined.active.push(account);
          } else {
            categorizedAccounts.undefined.inactive.push(account);
          }
        }
      });

      return categorizedAccounts;
    },
    // Global `staleTime` and `cacheTime` from `queryClient` apply here
  });
}
