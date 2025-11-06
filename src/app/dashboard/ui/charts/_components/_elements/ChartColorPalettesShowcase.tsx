"use client";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import ElementContainer from "@/components/scaffolding/containers/ElementContainer";
import { ChartContainer } from "@/components/ui/chart";
import { BarChart, Bar, CartesianGrid, XAxis, YAxis } from "recharts";
import CodeExample from "./CodeExample";
import {
  getBrandThemeColorArray,
  getPrimaryShadesColorArray,
  getStandardChartColorArray,
  getChartConfigByPalette,
  brandThemeColors,
  primaryShadesColors,
  standardChartColors,
} from "@/utils/chart-colors";

/**
 * Chart Color Palettes Showcase
 *
 * Displays examples of different color palette options for charts
 */
export default function ChartColorPalettesShowcase() {
  const sampleData = [
    { name: "Jan", value: 400 },
    { name: "Feb", value: 300 },
    { name: "Mar", value: 200 },
    { name: "Apr", value: 278 },
    { name: "May", value: 189 },
    { name: "Jun", value: 239 },
  ];

  const brandThemeConfig = getChartConfigByPalette("brand-theme");
  const primaryShadesConfig = getChartConfigByPalette("primary-shades");
  const standardConfig = getChartConfigByPalette("standard");

  return (
    <SectionContainer
      title="Chart Color Palettes"
      description="Different color palette options for charts"
    >
      <div className="space-y-6">
        <ElementContainer
          title="Brand Theme Colors"
          subtitle="Option 1: Different colors based on brand theme (primary, secondary, accent, etc.)"
        >
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {getBrandThemeColorArray().map((color, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 p-2 border rounded"
                >
                  <div
                    className="w-8 h-8 rounded border"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-xs">
                    {Object.values(brandThemeColors)[index]?.label ||
                      `Color ${index + 1}`}
                  </span>
                </div>
              ))}
            </div>
            <ChartContainer config={brandThemeConfig} className="h-[200px]">
              <BarChart data={sampleData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Bar
                  dataKey="value"
                  fill={getBrandThemeColorArray()[0]}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          </div>
          <div className="mt-6">
            <CodeExample
              code={`import { getChartConfigByPalette, getBrandThemeColorArray } from "@/utils/chart-colors";

// Get brand theme color configuration
const chartConfig = getChartConfigByPalette("brand-theme");

// Or use individual colors
const colors = getBrandThemeColorArray();
// Returns: [
//   "hsl(var(--primary))",
//   "hsl(var(--secondary))",
//   "hsl(var(--accent))",
//   "hsl(221, 83%, 53%)", // Info blue
//   "hsl(142, 76%, 36%)", // Success green
//   ... etc
// ]

<ChartContainer config={chartConfig}>
  <BarChart data={data}>
    <Bar dataKey="value" fill={colors[0]} />
  </BarChart>
</ChartContainer>`}
            />
          </div>
        </ElementContainer>

        <ElementContainer
          title="Primary Color Shades"
          subtitle="Option 2: Different shades of the primary brand color"
        >
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {getPrimaryShadesColorArray().map((color, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 p-2 border rounded"
                >
                  <div
                    className="w-8 h-8 rounded border"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-xs">
                    {Object.values(primaryShadesColors)[index]?.label ||
                      `Shade ${index + 1}`}
                  </span>
                </div>
              ))}
            </div>
            <ChartContainer config={primaryShadesConfig} className="h-[200px]">
              <BarChart data={sampleData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Bar
                  dataKey="value"
                  fill={getPrimaryShadesColorArray()[2]}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          </div>
          <div className="mt-6">
            <CodeExample
              code={`import { getChartConfigByPalette, getPrimaryShadesColorArray } from "@/utils/chart-colors";

// Get primary shades color configuration
const chartConfig = getChartConfigByPalette("primary-shades");

// Or use individual colors
const colors = getPrimaryShadesColorArray();
// Returns different shades of primary color:
// [
//   "hsl(222.2, 47.4%, 85%)", // Very light
//   "hsl(222.2, 47.4%, 70%)", // Light
//   "hsl(var(--primary))",     // Base
//   "hsl(222.2, 47.4%, 20%)",  // Dark
//   ... etc
// ]

<ChartContainer config={chartConfig}>
  <BarChart data={data}>
    <Bar dataKey="value" fill={colors[2]} />
  </BarChart>
</ChartContainer>`}
            />
          </div>
        </ElementContainer>

        <ElementContainer
          title="Standard Chart Colors"
          subtitle="Default chart colors (--chart-1 through --chart-5) for backward compatibility"
        >
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {getStandardChartColorArray().map((color, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 p-2 border rounded"
                >
                  <div
                    className="w-8 h-8 rounded border"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-xs">
                    {Object.values(standardChartColors)[index]?.label ||
                      `Chart ${index + 1}`}
                  </span>
                </div>
              ))}
            </div>
            <ChartContainer config={standardConfig} className="h-[200px]">
              <BarChart data={sampleData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Bar
                  dataKey="value"
                  fill={getStandardChartColorArray()[0]}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          </div>
          <div className="mt-6">
            <CodeExample
              code={`import { getChartConfigByPalette, getStandardChartColorArray } from "@/utils/chart-colors";

// Get standard chart colors
const chartConfig = getChartConfigByPalette("standard");

// Or use individual colors
const colors = getStandardChartColorArray();
// Returns: [
//   "hsl(var(--chart-1))",
//   "hsl(var(--chart-2))",
//   "hsl(var(--chart-3))",
//   "hsl(var(--chart-4))",
//   "hsl(var(--chart-5))",
// ]`}
            />
          </div>
        </ElementContainer>

        <ElementContainer
          title="Usage in Multi-Series Charts"
          subtitle="Using color palettes with multiple series"
        >
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Brand Theme Colors</h4>
              <ChartContainer config={brandThemeConfig} className="h-[200px]">
                <BarChart data={sampleData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Bar
                    dataKey="value"
                    fill={getBrandThemeColorArray()[0]}
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="value"
                    fill={getBrandThemeColorArray()[1]}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ChartContainer>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-2">Primary Shades</h4>
              <ChartContainer
                config={primaryShadesConfig}
                className="h-[200px]"
              >
                <BarChart data={sampleData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Bar
                    dataKey="value"
                    fill={getPrimaryShadesColorArray()[1]}
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="value"
                    fill={getPrimaryShadesColorArray()[6]}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ChartContainer>
            </div>
          </div>
          <div className="mt-6">
            <CodeExample
              code={`// Using color arrays with multiple series
const brandColors = getBrandThemeColorArray();

<BarChart data={data}>
  <Bar dataKey="sales" fill={brandColors[0]} />
  <Bar dataKey="orders" fill={brandColors[1]} />
  <Bar dataKey="returns" fill={brandColors[2]} />
</BarChart>`}
            />
          </div>
        </ElementContainer>
      </div>
    </SectionContainer>
  );
}
