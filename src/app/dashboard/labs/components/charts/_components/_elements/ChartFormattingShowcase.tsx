"use client";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { SubsectionTitle } from "@/components/type/titles";
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
import ComponentRef from "./ComponentRef";
import { CHART_TOKENS } from "./chartTokens";

/**
 * Chart formatting utilities showcase — shared formatters for chart data
 */
export default function ChartFormattingShowcase() {
  const now = new Date();
  const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
  const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);

  return (
    <SectionContainer
      title="Chart Formatting Utilities"
      description="Shared formatting functions for consistent data display across chart components"
    >
      <div className="space-y-8">
        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>Duration</SubsectionTitle>
            <span className="text-xs text-muted-foreground">formatDuration</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">500ms</div>
              <div className="text-lg font-semibold">{formatDuration(500)}</div>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">2.5s</div>
              <div className="text-lg font-semibold">
                {formatDuration(2.5, "seconds")}
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">90s</div>
              <div className="text-lg font-semibold">
                {formatDuration(90, "seconds")}
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">3600s</div>
              <div className="text-lg font-semibold">
                {formatDuration(3600, "seconds")}
              </div>
            </div>
          </div>
          <ComponentRef token={CHART_TOKENS.format.duration} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>Memory</SubsectionTitle>
            <span className="text-xs text-muted-foreground">formatMemory</span>
          </div>
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
              <div className="text-lg font-semibold">{formatMemory(2048)}</div>
            </div>
          </div>
          <ComponentRef token={CHART_TOKENS.format.memory} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>Numbers</SubsectionTitle>
            <span className="text-xs text-muted-foreground">
              formatNumber · abbreviated · percentage
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">1,234</div>
              <div className="text-lg font-semibold">{formatNumber(1234)}</div>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">1,234.56</div>
              <div className="text-lg font-semibold">{formatNumber(1234.56)}</div>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">Abbreviated</div>
              <div className="text-lg font-semibold">
                {formatAbbreviatedNumber(1234567)}
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">Percentage</div>
              <div className="text-lg font-semibold">{formatPercentage(85.5)}</div>
            </div>
          </div>
          <ComponentRef token={CHART_TOKENS.format.number} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>Dates</SubsectionTitle>
            <span className="text-xs text-muted-foreground">
              short · full · ISO · relative
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">Short Date</div>
              <div className="text-lg font-semibold">{formatDateShort(now)}</div>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">Full Date</div>
              <div className="text-lg font-semibold">{formatDate(now)}</div>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">ISO Date</div>
              <div className="text-lg font-semibold">{formatDateISO(now)}</div>
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
          <ComponentRef token={CHART_TOKENS.format.date} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>Currency</SubsectionTitle>
            <span className="text-xs text-muted-foreground">formatCurrency</span>
          </div>
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
          <ComponentRef token={CHART_TOKENS.format.currency} />
        </div>
      </div>
    </SectionContainer>
  );
}
