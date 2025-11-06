"use client";

import { useState } from "react";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import ElementContainer from "@/components/scaffolding/containers/ElementContainer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import CodeExample from "./CodeExample";

/**
 * Search Components Showcase
 *
 * Displays search input patterns
 */
export default function SearchComponentsShowcase() {
  const [searchQuery, setSearchQuery] = useState("");

  const sampleResults = [
    "Dashboard",
    "Settings",
    "Users",
    "Reports",
    "Analytics",
  ].filter((item) =>
    searchQuery
      ? item.toLowerCase().includes(searchQuery.toLowerCase())
      : false
  );

  return (
    <SectionContainer
      title="Search Components"
      description="Search input patterns with filters and results"
    >
      <div className="space-y-6">
        <ElementContainer title="Basic Search Input">
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
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
            {searchQuery && sampleResults.length > 0 && (
              <div className="mt-2 border rounded-lg bg-white shadow-sm">
                {sampleResults.map((result, index) => (
                  <div
                    key={index}
                    className="px-4 py-2 hover:bg-muted/50 cursor-pointer text-sm"
                  >
                    {result}
                  </div>
                ))}
              </div>
            )}
            {searchQuery && sampleResults.length === 0 && (
              <div className="mt-2 text-sm text-muted-foreground px-2">
                No results found
              </div>
            )}
          </div>
          <div className="mt-6">
            <CodeExample
              code={`const [searchQuery, setSearchQuery] = useState("");

<div className="relative">
  <Search className="absolute left-3 top-1/2 h-4 w-4" />
  <Input
    type="search"
    placeholder="Search..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    className="pl-10"
  />
  {searchQuery && (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setSearchQuery("")}
      className="absolute right-2 top-1/2"
    >
      <X className="h-3 w-3" />
    </Button>
  )}
</div>`}
            />
          </div>
        </ElementContainer>

        <ElementContainer title="Search with Button">
          <div className="max-w-md">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
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
          <div className="mt-6">
            <CodeExample
              code={`<div className="flex gap-2">
  <div className="relative flex-1">
    <Search className="absolute left-3 top-1/2 h-4 w-4" />
    <Input
      type="search"
      placeholder="Search..."
      className="pl-10"
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          // Handle search
        }
      }}
    />
  </div>
  <Button variant="primary">Search</Button>
</div>`}
            />
          </div>
        </ElementContainer>
      </div>
    </SectionContainer>
  );
}

