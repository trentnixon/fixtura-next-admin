"use client";

import { CalendarClock } from "lucide-react";
import { SingleFixtureDetailResponse } from "@/types/fixtureDetail";
import { format } from "date-fns";
import { Text } from "@/components/ui-library";

interface FixtureMetadataProps {
  data: SingleFixtureDetailResponse;
}

export default function FixtureMetadata({ data }: FixtureMetadataProps) {
  const { context } = data;

  // Format timestamp helper
  const formatTimestamp = (timestamp: string | null): string | null => {
    if (!timestamp) return null;
    try {
      return format(new Date(timestamp), "MMM d, yyyy, h:mm a");
    } catch {
      return timestamp;
    }
  };

  const createdDate = formatTimestamp(context.admin.createdAt);
  const updatedDate = formatTimestamp(context.admin.updatedAt);

  return (
    <div className="flex items-center gap-4">
      <CalendarClock className="w-4 h-4 text-muted-foreground" />
      {createdDate && (
        <Text variant="muted" as="span">
          Created: {createdDate}
        </Text>
      )}
      {updatedDate && createdDate && (
        <Text variant="muted" as="span">
          •
        </Text>
      )}
      {updatedDate && (
        <Text variant="muted" as="span">
          Updated: {updatedDate}
        </Text>
      )}
    </div>
  );
}
