"use client";

import { useEffect, useState } from "react";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { Badge } from "@/components/ui/badge";
import { SubsectionTitle } from "@/components/type/titles";
import { Clock } from "lucide-react";
import ComponentRef from "./ComponentRef";
import { UTILITY_TOKENS } from "./utilityTokens";

/**
 * Time formatting showcase — relative, date, and clock patterns
 */
export default function TimeFormattingShowcase() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

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

  const formatDate = (date: Date, format: "short" | "long" = "short"): string => {
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

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const pastTimes = [
    { date: new Date(now.getTime() - 30 * 1000), label: "30 seconds ago" },
    { date: new Date(now.getTime() - 5 * 60 * 1000), label: "5 minutes ago" },
    { date: new Date(now.getTime() - 2 * 60 * 60 * 1000), label: "2 hours ago" },
    { date: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), label: "3 days ago" },
    { date: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000), label: "30 days ago" },
  ];

  return (
    <SectionContainer
      title="Time Formatting"
      description="Relative time, formatted dates, and time formatting utilities"
    >
      <div className="space-y-8">
        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>Relative Time</SubsectionTitle>
            <span className="text-xs text-muted-foreground">time ago · live update</span>
          </div>
          <div className="space-y-2">
            {pastTimes.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{formatRelativeTime(item.date)}</span>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {item.label}
                </Badge>
              </div>
            ))}
          </div>
          <ComponentRef token={UTILITY_TOKENS.time.relative} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>Formatted Dates</SubsectionTitle>
            <span className="text-xs text-muted-foreground">short · long locale</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground mb-1">Short Format</div>
              {[
                new Date(),
                new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
                new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
              ].map((date) => (
                <div key={date.toISOString()} className="text-sm font-medium">
                  {formatDate(date, "short")}
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground mb-1">Long Format</div>
              {[
                new Date(),
                new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
                new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
              ].map((date) => (
                <div key={date.toISOString()} className="text-sm font-medium">
                  {formatDate(date, "long")}
                </div>
              ))}
            </div>
          </div>
          <ComponentRef token={UTILITY_TOKENS.time.dates} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>Time of Day</SubsectionTitle>
            <span className="text-xs text-muted-foreground">toLocaleTimeString</span>
          </div>
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
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
              >
                <span className="text-sm font-medium">{formatTime(item.date)}</span>
                <span className="text-xs text-muted-foreground">{item.label}</span>
              </div>
            ))}
          </div>
          <ComponentRef token={UTILITY_TOKENS.time.clock} />
        </div>
      </div>
    </SectionContainer>
  );
}
