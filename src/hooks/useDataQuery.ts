import { useQuery } from "@tanstack/react-query";
import { fetchData } from "@/lib/server-actions/fetchData";

export function useDataQuery() {
  return useQuery({
    queryKey: ["data"],
    queryFn: fetchData,
  });
}
