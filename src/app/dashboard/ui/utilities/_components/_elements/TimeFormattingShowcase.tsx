"use client";

import { useEffect, useState } from "react";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import ElementContainer from "@/components/scaffolding/containers/ElementContainer";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import CodeExample from "./CodeExample";

/**
 * Time Formatting Showcase
 *
 * Displays various time formatting patterns
 */
export default function TimeFormattingShowcase() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Format relative time
  const formatRelativeTime = (date: Date): string => {
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (seconds < 60) return "just now";
    if (minutes < 60) return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
    if (hours < 24) return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
    if (days < 7) return `${days} day${days !== 1 ? "s" : ""} ago`;
    if (weeks < 4) return `${weeks} week${weeks !== 1 ? "s" : ""} ago`;
    if (months < 12) return `${months} month${months !== 1 ? "s" : ""} ago`;
    return `${years} year${years !== 1 ? "s" : ""} ago`;
  };

  // Format date
  const formatDate = (
    date: Date,
    format: "short" | "long" = "short"
  ): string => {
    if (format === "short") {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  // Format time
  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const pastTimes = [
    { date: new Date(now.getTime() - 30 * 1000), label: "30 seconds ago" },
    { date: new Date(now.getTime() - 5 * 60 * 1000), label: "5 minutes ago" },
    {
      date: new Date(now.getTime() - 2 * 60 * 60 * 1000),
      label: "2 hours ago",
    },
    {
      date: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
      label: "3 days ago",
    },
    {
      date: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
      label: "30 days ago",
    },
  ];

  return (
    <SectionContainer
      title="Time Formatting"
      description="Relative time, formatted dates, and time formatting utilities"
    >
      <div className="space-y-6">
        <ElementContainer title="Relative Time (Time Ago)">
          <div className="space-y-2">
            {pastTimes.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {formatRelativeTime(item.date)}
                  </span>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {item.label}
                </Badge>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <CodeExample
              code={`const formatRelativeTime = (date: Date): string => {
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return "just now";
  if (minutes < 60) return \`\${minutes} minute\${minutes !== 1 ? "s" : ""} ago\`;
  if (hours < 24) return \`\${hours} hour\${hours !== 1 ? "s" : ""} ago\`;
  if (days < 7) return \`\${days} day\${days !== 1 ? "s" : ""} ago\`;
  return date.toLocaleDateString();
};

<span>{formatRelativeTime(date)}</span>`}
            />
          </div>
        </ElementContainer>

        <ElementContainer title="Formatted Dates">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground mb-1">
                Short Format
              </div>
              {[
                new Date(),
                new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
                new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
              ].map((date, index) => (
                <div key={index} className="text-sm font-medium">
                  {formatDate(date, "short")}
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground mb-1">
                Long Format
              </div>
              {[
                new Date(),
                new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
                new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
              ].map((date, index) => (
                <div key={index} className="text-sm font-medium">
                  {formatDate(date, "long")}
                </div>
              ))}
            </div>
          </div>
          <div className="mt-6">
            <CodeExample
              code={`const formatDate = (date: Date, format: "short" | "long" = "short"): string => {
  if (format === "short") {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

<span>{formatDate(date, "short")}</span>
<span>{formatDate(date, "long")}</span>`}
            />
          </div>
        </ElementContainer>

        <ElementContainer title="Time Formatting">
          <div className="space-y-2">
            {[
              { date: new Date(), label: "Current time" },
              {
                date: new Date(now.getTime() - 2 * 60 * 60 * 1000),
                label: "2 hours ago",
              },
              {
                date: new Date(now.getTime() + 3 * 60 * 60 * 1000),
                label: "3 hours from now",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
              >
                <span className="text-sm font-medium">
                  {formatTime(item.date)}
                </span>
                <span className="text-xs text-muted-foreground">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <CodeExample
              code={`const formatTime = (date: Date): string => {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

<span>{formatTime(date)}</span>`}
            />
          </div>
        </ElementContainer>
      </div>
    </SectionContainer>
  );
}
