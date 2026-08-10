"use client";

import { useState } from "react";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SubsectionTitle } from "@/components/type/titles";
import { Search, X } from "lucide-react";
import ComponentRef from "./ComponentRef";
import { UTILITY_TOKENS } from "./utilityTokens";

const SAMPLE_RESULTS = ["Dashboard", "Settings", "Users", "Reports", "Analytics"];

/**
 * Search components showcase — basic with results and search-with-button patterns
 */
export default function SearchComponentsShowcase() {
  const [searchQuery, setSearchQuery] = useState("");
  const [buttonSearchQuery, setButtonSearchQuery] = useState("");

  const filteredResults = SAMPLE_RESULTS.filter((item) =>
    searchQuery ? item.toLowerCase().includes(searchQuery.toLowerCase()) : false
  );

  return (
    <SectionContainer
      title="Search Components"
      description="Search input patterns with filters and results"
    >
      <div className="space-y-8">
        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>Basic Search</SubsectionTitle>
            <span className="text-xs text-muted-foreground">
              icon · clear · live results
            </span>
          </div>
          <div className="max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
              {searchQuery ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                >
                  <X className="h-3 w-3" />
                </Button>
              ) : null}
            </div>
            {searchQuery && filteredResults.length > 0 ? (
              <div className="mt-2 border rounded-lg bg-white shadow-sm">
                {filteredResults.map((result) => (
                  <div
                    key={result}
                    className="px-4 py-2 hover:bg-muted/50 cursor-pointer text-sm"
                  >
                    {result}
                  </div>
                ))}
              </div>
            ) : null}
            {searchQuery && filteredResults.length === 0 ? (
              <div className="mt-2 text-sm text-muted-foreground px-2">
                No results found
              </div>
            ) : null}
          </div>
          <ComponentRef token={UTILITY_TOKENS.search.basic} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>With Button</SubsectionTitle>
            <span className="text-xs text-muted-foreground">Enter key · submit</span>
          </div>
          <div className="max-w-md">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  value={buttonSearchQuery}
                  onChange={(e) => setButtonSearchQuery(e.target.value)}
                  className="pl-10"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      // Handle search
                    }
                  }}
                />
              </div>
              <Button variant="primary">Search</Button>
            </div>
          </div>
          <ComponentRef token={UTILITY_TOKENS.search.withButton} />
        </div>
      </div>
    </SectionContainer>
  );
}
