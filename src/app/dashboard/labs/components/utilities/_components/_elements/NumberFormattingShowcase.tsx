"use client";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { Badge } from "@/components/ui/badge";
import { SubsectionTitle } from "@/components/type/titles";
import ComponentRef from "./ComponentRef";
import { UTILITY_TOKENS } from "./utilityTokens";

const formatNumber = (value: number, locale: string = "en-US"): string => {
  return new Intl.NumberFormat(locale).format(value);
};

const formatPercentage = (value: number, decimals: number = 1): string => {
  return `${(value * 100).toFixed(decimals)}%`;
};

const formatFileSize = (bytes: number): string => {
  const units = ["B", "KB", "MB", "GB", "TB"];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(unitIndex === 0 ? 0 : 2)} ${units[unitIndex]}`;
};

const formatCompact = (value: number): string => {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
};

/**
 * Number formatting showcase — large, compact, percentage, and file size patterns
 */
export default function NumberFormattingShowcase() {
  return (
    <SectionContainer
      title="Number Formatting"
      description="Format numbers, percentages, file sizes, and large numbers"
    >
      <div className="space-y-8">
        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>Large Numbers</SubsectionTitle>
            <span className="text-xs text-muted-foreground">Intl.NumberFormat</span>
          </div>
          <div className="space-y-2">
            {[
              { value: 1234, label: "Thousand" },
              { value: 1234567, label: "Million" },
              { value: 1234567890, label: "Billion" },
              { value: 1234567890123, label: "Trillion" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
              >
                <span className="text-sm font-medium">{item.label}</span>
                <span className="text-sm font-mono">{formatNumber(item.value)}</span>
              </div>
            ))}
          </div>
          <ComponentRef token={UTILITY_TOKENS.number.large} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>Compact Notation</SubsectionTitle>
            <span className="text-xs text-muted-foreground">notation: compact</span>
          </div>
          <div className="space-y-2">
            {[
              { value: 1234, label: "Thousand" },
              { value: 1234567, label: "Million" },
              { value: 1234567890, label: "Billion" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
              >
                <span className="text-sm font-medium">{item.label}</span>
                <span className="text-sm font-mono">{formatCompact(item.value)}</span>
              </div>
            ))}
          </div>
          <ComponentRef token={UTILITY_TOKENS.number.compact} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>Percentages</SubsectionTitle>
            <span className="text-xs text-muted-foreground">Badge · status colors</span>
          </div>
          <div className="space-y-2">
            {[
              { value: 0.95, label: "95%", badge: "success" as const },
              { value: 0.75, label: "75%", badge: "info" as const },
              { value: 0.45, label: "45%", badge: "warning" as const },
              { value: 0.15, label: "15%", badge: "error" as const },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
              >
                <span className="text-sm font-medium">{item.label}</span>
                <Badge
                  className={
                    item.badge === "success"
                      ? "bg-success-500 text-white border-0"
                      : item.badge === "info"
                        ? "bg-brandPrimary-600 text-white border-0"
                        : item.badge === "warning"
                          ? "bg-warning-500 text-white border-0"
                          : "bg-error-500 text-white border-0"
                  }
                >
                  {formatPercentage(item.value)}
                </Badge>
              </div>
            ))}
          </div>
          <ComponentRef token={UTILITY_TOKENS.number.percentage} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>File Sizes</SubsectionTitle>
            <span className="text-xs text-muted-foreground">binary units · 1024</span>
          </div>
          <div className="space-y-2">
            {[
              { bytes: 512, label: "Small file" },
              { bytes: 1024 * 500, label: "Medium file" },
              { bytes: 1024 * 1024 * 250, label: "Large file" },
              { bytes: 1024 * 1024 * 1024 * 5, label: "Very large file" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
              >
                <span className="text-sm font-medium">{item.label}</span>
                <span className="text-sm font-mono">{formatFileSize(item.bytes)}</span>
              </div>
            ))}
          </div>
          <ComponentRef token={UTILITY_TOKENS.number.fileSize} />
        </div>
      </div>
    </SectionContainer>
  );
}
