"use client";

import { useRendersQuery } from "@/hooks/renders/useRendersQuery";

export default function DisplayRenderId({ renderID }: { renderID: string }) {
  const { data, isLoading, error } = useRendersQuery(renderID);

  if (isLoading) return <p>Loading render data...</p>;
  if (error) {
    return (
      <div>
        <p>Error loading render data: {error.message}</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Render Details</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
