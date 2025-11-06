"use client";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import ElementContainer from "@/components/scaffolding/containers/ElementContainer";
import {
  formatDuration,
  formatMemory,
  formatPercentage,
  formatNumber,
  formatRelativeTime,
  formatDate,
  formatDateShort,
  formatDateISO,
  formatCurrency,
  formatAbbreviatedNumber,
} from "@/utils/chart-formatters";
import CodeExample from "./CodeExample";

/**
 * Chart Formatting Utilities Showcase
 *
 * Displays examples of chart formatting utilities
 */
export default function ChartFormattingShowcase() {
  const now = new Date();
  const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
  const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);

  return (
    <SectionContainer
      title="Chart Formatting Utilities"
      description="Shared formatting functions for consistent data display across all chart components"
    >
      <div className="space-y-6">
        <ElementContainer
          title="Duration Formatting"
          subtitle="Format duration values in seconds or milliseconds"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">500ms</div>
                <div className="text-lg font-semibold">
                  {formatDuration(500, "milliseconds")}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">2.5s</div>
                <div className="text-lg font-semibold">
                  {formatDuration(2.5)}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">90s</div>
                <div className="text-lg font-semibold">
                  {formatDuration(90)}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">3600s</div>
                <div className="text-lg font-semibold">
                  {formatDuration(3600)}
                </div>
              </div>
            </div>
            <CodeExample
              code={`import { formatDuration } from "@/utils/chart-formatters";

formatDuration(500, "milliseconds") // "500ms"
formatDuration(2.5) // "2.5s"
formatDuration(90) // "1.5m"
formatDuration(3600) // "1.0h"`}
            />
          </div>
        </ElementContainer>

        <ElementContainer
          title="Memory Formatting"
          subtitle="Format memory values in MB or bytes"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">512 bytes</div>
                <div className="text-lg font-semibold">
                  {formatMemory(512, "bytes")}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">1.5 MB</div>
                <div className="text-lg font-semibold">{formatMemory(1.5)}</div>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">128 MB</div>
                <div className="text-lg font-semibold">{formatMemory(128)}</div>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">2048 MB</div>
                <div className="text-lg font-semibold">
                  {formatMemory(2048)}
                </div>
              </div>
            </div>
            <CodeExample
              code={`import { formatMemory } from "@/utils/chart-formatters";

formatMemory(512, "bytes") // "512.0 B"
formatMemory(1.5) // "1.5MB"
formatMemory(128) // "128.0MB"
formatMemory(2048) // "2.0GB"`}
            />
          </div>
        </ElementContainer>

        <ElementContainer
          title="Number Formatting"
          subtitle="Format numbers with locale-specific formatting"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">1,234</div>
                <div className="text-lg font-semibold">
                  {formatNumber(1234)}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">1,234.56</div>
                <div className="text-lg font-semibold">
                  {formatNumber(1234.56)}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Abbreviated</div>
                <div className="text-lg font-semibold">
                  {formatAbbreviatedNumber(1234567)}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Percentage</div>
                <div className="text-lg font-semibold">
                  {formatPercentage(85.5)}
                </div>
              </div>
            </div>
            <CodeExample
              code={`import { formatNumber, formatAbbreviatedNumber, formatPercentage } from "@/utils/chart-formatters";

formatNumber(1234) // "1,234"
formatNumber(1234.56) // "1,234.56"
formatAbbreviatedNumber(1234567) // "1.2M"
formatPercentage(85.5) // "85.5%"`}
            />
          </div>
        </ElementContainer>

        <ElementContainer
          title="Date Formatting"
          subtitle="Format dates in various formats"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Short Date</div>
                <div className="text-lg font-semibold">
                  {formatDateShort(now)}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Full Date</div>
                <div className="text-lg font-semibold">{formatDate(now)}</div>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">ISO Date</div>
                <div className="text-lg font-semibold">
                  {formatDateISO(now)}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Relative</div>
                <div className="text-lg font-semibold">
                  {formatRelativeTime(twoHoursAgo)}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Days Ago</div>
                <div className="text-lg font-semibold">
                  {formatRelativeTime(threeDaysAgo)}
                </div>
              </div>
            </div>
            <CodeExample
              code={`import { formatDateShort, formatDate, formatDateISO, formatRelativeTime } from "@/utils/chart-formatters";

formatDateShort(new Date()) // "Jan 15"
formatDate(new Date()) // "Jan 15, 2024, 10:30 AM"
formatDateISO(new Date()) // "2024-01-15"
formatRelativeTime(date) // "2 hours ago" or "3 days ago"`}
            />
          </div>
        </ElementContainer>

        <ElementContainer
          title="Currency Formatting"
          subtitle="Format currency values"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">USD</div>
                <div className="text-lg font-semibold">
                  {formatCurrency(1234.56)}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">EUR</div>
                <div className="text-lg font-semibold">
                  {formatCurrency(1234.56, "EUR")}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">No Decimals</div>
                <div className="text-lg font-semibold">
                  {formatCurrency(1234.56, "USD", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })}
                </div>
              </div>
            </div>
            <CodeExample
              code={`import { formatCurrency } from "@/utils/chart-formatters";

formatCurrency(1234.56) // "$1,234.56"
formatCurrency(1234.56, "EUR") // "€1,234.56"
formatCurrency(1234.56, "USD", { minimumFractionDigits: 0 }) // "$1,235"`}
            />
          </div>
        </ElementContainer>
      </div>
    </SectionContainer>
  );
}
