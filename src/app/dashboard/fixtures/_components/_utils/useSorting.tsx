import { useState, useCallback, type ReactElement } from "react";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import type { SortField, SortDirection } from "./types";

interface UseSortingOptions {
  /**
   * If true, allows clearing sort by clicking the same field when descending
   */
  allowClear?: boolean;
}

interface UseSortingReturn<T extends string> {
  sortField: SortField<T>;
  sortDirection: SortDirection;
  handleSort: (field: SortField<T>) => void;
  getSortIcon: (field: SortField<T>) => ReactElement;
  clearSort: () => void;
}

/**
 * Custom hook for managing table sorting state and logic
 */
export function useSorting<T extends string>(
  options: UseSortingOptions = {}
): UseSortingReturn<T> {
  const { allowClear = false } = options;
  const [sortField, setSortField] = useState<SortField<T>>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const handleSort = useCallback(
    (field: SortField<T>) => {
      if (sortField === field) {
        if (sortDirection === "asc") {
          setSortDirection("desc");
        } else if (sortDirection === "desc" && allowClear) {
          // Clear sort if descending and allowClear is true
          setSortField(null);
          setSortDirection(null);
        } else {
          setSortDirection("asc");
        }
      } else {
        // New field, start with ascending
        setSortField(field);
        setSortDirection("asc");
      }
    },
    [sortField, sortDirection, allowClear]
  );

  const getSortIcon = useCallback(
    (field: SortField<T>) => {
      if (sortField !== field) {
        return <ArrowUpDown className="h-4 w-4 ml-1 text-muted-foreground" />;
      }
      if (sortDirection === "asc") {
        return <ArrowUp className="h-4 w-4 ml-1" />;
      }
      return <ArrowDown className="h-4 w-4 ml-1" />;
    },
    [sortField, sortDirection]
  );

  const clearSort = useCallback(() => {
    setSortField(null);
    setSortDirection(null);
  }, []);

  return {
    sortField,
    sortDirection,
    handleSort,
    getSortIcon,
    clearSort,
  };
}
