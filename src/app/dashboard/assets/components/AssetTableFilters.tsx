
import React from "react";
import { Search, X, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AssetSport } from "@/types/asset";

const SPORTS: AssetSport[] = [
    "Cricket",
    "AFL",
    "Hockey",
    "Netball",
    "Basketball",
];

interface AssetTableFiltersProps {
    searchTerm: string;
    setSearchTerm: (value: string) => void;
    selectedSport: string;
    onSportChange: (sport: string) => void;
    onClearSearch: () => void;
    onCreateClick: () => void;
    assetCount: number;
}

export function AssetTableFilters({
    searchTerm,
    setSearchTerm,
    selectedSport,
    onSportChange,
    onClearSearch,
    onCreateClick,
    assetCount,
}: AssetTableFiltersProps) {
    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h3 className="text-base font-semibold">Assets</h3>
                    <p className="text-sm text-muted-foreground">
                        Showing {assetCount} asset{assetCount !== 1 ? "s" : ""}
                        {selectedSport !== "all" ? ` for ${selectedSport}` : ""}
                    </p>
                </div>
            </div>

            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search by name or composition ID…"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-9"
                    />
                    {searchTerm && (
                        <Button
                            variant="primary"
                            size="sm"
                            onClick={onClearSearch}
                            className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                        >
                            <X className="h-3 w-3" />
                        </Button>
                    )}
                </div>

                <div className="flex flex-wrap gap-3">
                    <Button onClick={onCreateClick} variant="primary">
                        <Plus className="mr-2 h-4 w-4" />
                        Create New Asset
                    </Button>
                </div>
            </div>

            <Tabs
                value={selectedSport}
                onValueChange={onSportChange}
                className="w-full"
            >
                <TabsList variant="secondary" className="w-full justify-start">
                    {SPORTS.map((sport) => (
                        <TabsTrigger key={sport} value={sport}>
                            {sport}
                        </TabsTrigger>
                    ))}
                </TabsList>
            </Tabs>
        </div>
    );
}
