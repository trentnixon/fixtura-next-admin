"use client";

import { Hash } from "lucide-react";

import { Text } from "@/components/ui-library";

interface FixtureMetadataProps {
  fixtureId: number;
}

export default function FixtureMetadata({ fixtureId }: FixtureMetadataProps) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <Hash className="h-3.5 w-3.5 text-muted-foreground" />
      <Text variant="muted" as="span">
        CMS fixture {fixtureId}
      </Text>
    </div>
  );
}
