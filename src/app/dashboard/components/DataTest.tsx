"use client";

import { useDataQuery } from "@/hooks/useDataQuery";

export default function DataTest() {
  const { data, isLoading, error } = useDataQuery();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Something went wrong: {String(error)}</p>;

  return (
    <ul>
      {data?.map((item: { id: number; name: string }) => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
}
