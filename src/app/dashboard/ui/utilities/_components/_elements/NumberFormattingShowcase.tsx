"use client";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import ElementContainer from "@/components/scaffolding/containers/ElementContainer";
import { Badge } from "@/components/ui/badge";
import CodeExample from "./CodeExample";

/**
 * Number Formatting Showcase
 *
 * Displays number formatting patterns (percentages, file sizes, large numbers)
 */
export default function NumberFormattingShowcase() {
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

  return (
    <SectionContainer
      title="Number Formatting"
      description="Format numbers, percentages, file sizes, and large numbers"
    >
      <div className="space-y-6">
        <ElementContainer title="Large Number Formatting">
          <div className="space-y-2">
            {[
              { value: 1234, label: "Thousand" },
              { value: 1234567, label: "Million" },
              { value: 1234567890, label: "Billion" },
              { value: 1234567890123, label: "Trillion" },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
              >
                <span className="text-sm font-medium">{item.label}</span>
                <span className="text-sm font-mono">{formatNumber(item.value)}</span>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <CodeExample
              code={`const formatNumber = (value: number, locale: string = "en-US"): string => {
  return new Intl.NumberFormat(locale).format(value);
};

<span>{formatNumber(1234567)}</span>
// Output: 1,234,567`}
            />
          </div>
        </ElementContainer>

        <ElementContainer title="Compact Number Format">
          <div className="space-y-2">
            {[
              { value: 1234, label: "Thousand" },
              { value: 1234567, label: "Million" },
              { value: 1234567890, label: "Billion" },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
              >
                <span className="text-sm font-medium">{item.label}</span>
                <span className="text-sm font-mono">{formatCompact(item.value)}</span>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <CodeExample
              code={`const formatCompact = (value: number): string => {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
};

<span>{formatCompact(1234567)}</span>
// Output: 1.2M`}
            />
          </div>
        </ElementContainer>

        <ElementContainer title="Percentage Formatting">
          <div className="space-y-2">
            {[
              { value: 0.95, label: "95%", badge: "success" },
              { value: 0.75, label: "75%", badge: "info" },
              { value: 0.45, label: "45%", badge: "warning" },
              { value: 0.15, label: "15%", badge: "error" },
            ].map((item, index) => (
              <div
                key={index}
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
          <div className="mt-6">
            <CodeExample
              code={`const formatPercentage = (value: number, decimals: number = 1): string => {
  return \`\${(value * 100).toFixed(decimals)}%\`;
};

<span>{formatPercentage(0.95)}</span>
// Output: 95.0%`}
            />
          </div>
        </ElementContainer>

        <ElementContainer title="File Size Formatting">
          <div className="space-y-2">
            {[
              { bytes: 512, label: "Small file" },
              { bytes: 1024 * 500, label: "Medium file" },
              { bytes: 1024 * 1024 * 250, label: "Large file" },
              { bytes: 1024 * 1024 * 1024 * 5, label: "Very large file" },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
              >
                <span className="text-sm font-medium">{item.label}</span>
                <span className="text-sm font-mono">{formatFileSize(item.bytes)}</span>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <CodeExample
              code={`const formatFileSize = (bytes: number): string => {
  const units = ["B", "KB", "MB", "GB", "TB"];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return \`\${size.toFixed(unitIndex === 0 ? 0 : 2)} \${units[unitIndex]}\`;
};

<span>{formatFileSize(1024 * 1024 * 250)}</span>
// Output: 250.00 MB`}
            />
          </div>
        </ElementContainer>
      </div>
    </SectionContainer>
  );
}

