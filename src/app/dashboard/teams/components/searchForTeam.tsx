// TODO: Add search for team
"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useGetTeamsOnSearchTerm } from "@/hooks/teams/useGetTeamsOnSearchTerm";
import DisplayTeams from "./displayTeams";
import { P } from "@/components/type/type";

export default function SearchForTeam() {
  const [searchTerm, setSearchTerm] = useState("");

  useGetTeamsOnSearchTerm(searchTerm);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  return (
    <>
      <div className="flex flex-row gap-2 items-center justify-between">
        <P>Search</P>
        <div className="flex flex-row gap-2 items-center justify-between">
          <Input value={searchTerm} onChange={handleSearch} />
          <Button onClick={clearSearch}>Clear</Button>
        </div>
      </div>

      <DisplayTeams searchTerm={searchTerm} />
    </>
  );
}
