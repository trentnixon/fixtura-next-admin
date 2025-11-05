"use client";

import { useState } from "react";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { SubsectionTitle } from "@/components/type/titles";
import StatCard from "@/components/ui-library/metrics/StatCard";
import MetricGrid from "@/components/ui-library/metrics/MetricGrid";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableCaption,
  TableFooter,
} from "@/components/ui/table";
import Code from "@/components/ui-library/foundation/Code";
import {
  Copy,
  Check,
  Database,
  AlertCircle,
  Clock,
  MemoryStick,
  Users,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

/**
 * Code Example Component
 */
function CodeExample({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
      <Code variant="block" className="text-xs">
        {code}
      </Code>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleCopy}
        className="absolute top-2 right-2 h-7 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        {copied ? (
          <>
            <Check className="h-3 w-3 mr-1" />
            Copied!
          </>
        ) : (
          <>
            <Copy className="h-3 w-3 mr-1" />
            Copy
          </>
        )}
      </Button>
    </div>
  );
}

/**
 * Data Display Showcase Component
 *
 * Displays all data display components with examples
 */
export default function DataDisplayShowcase() {
  return (
    <>
      {/* Stat Cards */}
      <SectionContainer
        title="Stat Cards"
        description="Enhanced metric cards with optional trend indicators"
      >
        <div className="space-y-8">
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <SubsectionTitle>Basic StatCard</SubsectionTitle>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard
                  title="Total Collections"
                  value={1234}
                  icon={<Database className="h-6 w-6 text-blue-500" />}
                  description="All time"
                />
                <StatCard
                  title="Active Users"
                  value={567}
                  icon={<Users className="h-6 w-6 text-green-500" />}
                  description="Currently online"
                />
                <StatCard
                  title="Error Rate"
                  value="2.5%"
                  icon={<AlertCircle className="h-6 w-6 text-red-500" />}
                  description="Last 24 hours"
                />
              </div>
              <CodeExample
                code={`import StatCard from "@/components/ui-library/metrics/StatCard";
import { Database } from "lucide-react";

<StatCard
  title="Total Collections"
  value={1234}
  icon={<Database className="h-6 w-6 text-blue-500" />}
  description="All time"
/>`}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <SubsectionTitle>With Trend Indicators</SubsectionTitle>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard
                  title="Total Collections"
                  value={1234}
                  trend={+5.2}
                  icon={<Database className="h-6 w-6 text-blue-500" />}
                  description="Last 30 days"
                />
                <StatCard
                  title="Active Users"
                  value={567}
                  trend={-2.1}
                  icon={<Users className="h-6 w-6 text-green-500" />}
                  description="Last 7 days"
                />
                <StatCard
                  title="Error Rate"
                  value="2.5%"
                  trend={0}
                  trendLabel="No change"
                  icon={<AlertCircle className="h-6 w-6 text-red-500" />}
                  description="Last 24 hours"
                />
              </div>
              <CodeExample
                code={`<StatCard
  title="Total Collections"
  value={1234}
  trend={+5.2}
  icon={<Database className="h-6 w-6 text-blue-500" />}
  description="Last 30 days"
/>`}
              />
            </div>
          </div>
        </div>
      </SectionContainer>

      {/* Metric Grid */}
      <SectionContainer
        title="Metric Grid"
        description="Responsive grid container for metric cards"
      >
        <div className="space-y-8">
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <SubsectionTitle>3 Column Grid</SubsectionTitle>
              </div>
              <MetricGrid columns={3} gap="lg">
                <StatCard
                  title="Collections"
                  value={1234}
                  icon={<Database className="h-6 w-6 text-blue-500" />}
                />
                <StatCard
                  title="Average Time"
                  value="45s"
                  icon={<Clock className="h-6 w-6 text-purple-500" />}
                />
                <StatCard
                  title="Memory Usage"
                  value="256MB"
                  icon={<MemoryStick className="h-6 w-6 text-cyan-500" />}
                />
              </MetricGrid>
              <CodeExample
                code={`import MetricGrid from "@/components/ui-library/metrics/MetricGrid";

<MetricGrid columns={3} gap="lg">
  <StatCard title="Collections" value={1234} />
  <StatCard title="Average Time" value="45s" />
  <StatCard title="Memory Usage" value="256MB" />
</MetricGrid>`}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <SubsectionTitle>4 Column Grid</SubsectionTitle>
              </div>
              <MetricGrid columns={4} gap="md">
                <StatCard title="Total" value={1000} />
                <StatCard title="Active" value={750} />
                <StatCard title="Pending" value={200} />
                <StatCard title="Failed" value={50} />
              </MetricGrid>
              <CodeExample
                code={`<MetricGrid columns={4} gap="md">
  <StatCard title="Total" value={1000} />
  <StatCard title="Active" value={750} />
  <StatCard title="Pending" value={200} />
  <StatCard title="Failed" value={50} />
</MetricGrid>`}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <SubsectionTitle>Grid Options</SubsectionTitle>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Columns: 1, 2, 3, or 4
                  </p>
                  <p className="text-sm text-muted-foreground mb-2">
                    Gap: sm, md, or lg
                  </p>
                </div>
                <MetricGrid columns={2} gap="sm">
                  <StatCard title="Column 1" value={100} />
                  <StatCard title="Column 2" value={200} />
                </MetricGrid>
              </div>
              <CodeExample
                code={`<MetricGrid columns={2} gap="sm">
  <StatCard title="Column 1" value={100} />
  <StatCard title="Column 2" value={200} />
</MetricGrid>`}
              />
            </div>
          </div>
        </div>
      </SectionContainer>

      {/* Base Card Component */}
      <SectionContainer
        title="Base Card Component"
        description="Standard card component from shadcn/ui with header, content, footer"
      >
        <div className="space-y-8">
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <SubsectionTitle>Basic Card</SubsectionTitle>
              </div>
              <Card className="max-w-md">
                <CardHeader>
                  <CardTitle>Card Title</CardTitle>
                  <CardDescription>Card description goes here</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">Card content area for main content.</p>
                </CardContent>
              </Card>
              <CodeExample
                code={`import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description goes here</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content area for main content.</p>
  </CardContent>
</Card>`}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <SubsectionTitle>Card with Footer</SubsectionTitle>
              </div>
              <Card className="max-w-md">
                <CardHeader>
                  <CardTitle>Card with Footer</CardTitle>
                  <CardDescription>
                    Action buttons go in the footer
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">Main content here.</p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" size="sm">
                    Cancel
                  </Button>
                  <Button size="sm">Save</Button>
                </CardFooter>
              </Card>
              <CodeExample
                code={`import { CardFooter } from "@/components/ui/card";

<Card>
  <CardHeader>
    <CardTitle>Card with Footer</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Main content here.</p>
  </CardContent>
  <CardFooter className="flex justify-between">
    <Button variant="outline" size="sm">Cancel</Button>
    <Button size="sm">Save</Button>
  </CardFooter>
</Card>`}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <SubsectionTitle>Card Variants</SubsectionTitle>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-2">
                  <CardHeader>
                    <CardTitle>Bordered Card</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">Card with thicker border</p>
                  </CardContent>
                </Card>
                <Card className="bg-slate-50">
                  <CardHeader>
                    <CardTitle>Background Card</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">Card with background color</p>
                  </CardContent>
                </Card>
              </div>
              <CodeExample
                code={`<Card className="border-2">
  <CardHeader>
    <CardTitle>Bordered Card</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Card with thicker border</p>
  </CardContent>
</Card>`}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <SubsectionTitle>Interactive Card</SubsectionTitle>
              </div>
              <Card className="max-w-md cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Interactive Card</CardTitle>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <CardDescription>Hover to see shadow effect</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">
                    Cards can be made interactive with hover effects.
                  </p>
                </CardContent>
              </Card>
              <CodeExample
                code={`<Card className="cursor-pointer hover:shadow-lg transition-shadow">
  <CardHeader>
    <CardTitle>Interactive Card</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Cards can be made interactive with hover effects.</p>
  </CardContent>
</Card>`}
              />
            </div>
          </div>
        </div>
      </SectionContainer>

      {/* Tables */}
      <SectionContainer
        title="Tables"
        description="Data table components for displaying structured data"
      >
        <div className="space-y-8">
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <SubsectionTitle>Basic Table</SubsectionTitle>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>John Doe</TableCell>
                    <TableCell>
                      <Badge className="bg-success-500 text-white border-0">
                        Active
                      </Badge>
                    </TableCell>
                    <TableCell>Admin</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Jane Smith</TableCell>
                    <TableCell>
                      <Badge className="bg-success-500 text-white border-0">
                        Active
                      </Badge>
                    </TableCell>
                    <TableCell>User</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Bob Johnson</TableCell>
                    <TableCell>
                      <Badge className="bg-error-500 text-white border-0">
                        Inactive
                      </Badge>
                    </TableCell>
                    <TableCell>User</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <CodeExample
                code={`import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Status</TableHead>
      <TableHead>Role</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>John Doe</TableCell>
      <TableCell>Active</TableCell>
      <TableCell>Admin</TableCell>
    </TableRow>
  </TableBody>
</Table>`}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <SubsectionTitle>Table with Caption</SubsectionTitle>
              </div>
              <Table>
                <TableCaption>A list of recent transactions</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>2024-01-15</TableCell>
                    <TableCell>$1,234.56</TableCell>
                    <TableCell>
                      <Badge className="bg-success-500 text-white border-0">
                        Completed
                      </Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>2024-01-14</TableCell>
                    <TableCell>$987.65</TableCell>
                    <TableCell>
                      <Badge className="bg-warning-500 text-white border-0">
                        Pending
                      </Badge>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <CodeExample
                code={`import { TableCaption } from "@/components/ui/table";

<Table>
  <TableCaption>A list of recent transactions</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead>Date</TableHead>
      <TableHead>Amount</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>2024-01-15</TableCell>
      <TableCell>$1,234.56</TableCell>
    </TableRow>
  </TableBody>
</Table>`}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <SubsectionTitle>Table with Footer</SubsectionTitle>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Product A</TableCell>
                    <TableCell>2</TableCell>
                    <TableCell className="text-right">$50.00</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Product B</TableCell>
                    <TableCell>1</TableCell>
                    <TableCell className="text-right">$30.00</TableCell>
                  </TableRow>
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={2}>Total</TableCell>
                    <TableCell className="text-right font-semibold">
                      $80.00
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
              <CodeExample
                code={`import { TableFooter } from "@/components/ui/table";

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Item</TableHead>
      <TableHead className="text-right">Price</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Product A</TableCell>
      <TableCell className="text-right">$50.00</TableCell>
    </TableRow>
  </TableBody>
  <TableFooter>
    <TableRow>
      <TableCell colSpan={1}>Total</TableCell>
      <TableCell className="text-right font-semibold">$80.00</TableCell>
    </TableRow>
  </TableFooter>
</Table>`}
              />
            </div>
          </div>
        </div>
      </SectionContainer>

      {/* Lists */}
      <SectionContainer
        title="Lists"
        description="List components for displaying ordered and unordered data"
      >
        <div className="space-y-8">
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <SubsectionTitle>Unordered List</SubsectionTitle>
              </div>
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li>First item</li>
                <li>Second item</li>
                <li>Third item</li>
              </ul>
              <CodeExample
                code={`<ul className="list-disc list-inside space-y-2">
  <li>First item</li>
  <li>Second item</li>
  <li>Third item</li>
</ul>`}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <SubsectionTitle>Ordered List</SubsectionTitle>
              </div>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>First step</li>
                <li>Second step</li>
                <li>Third step</li>
              </ol>
              <CodeExample
                code={`<ol className="list-decimal list-inside space-y-2">
  <li>First step</li>
  <li>Second step</li>
  <li>Third step</li>
</ol>`}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <SubsectionTitle>Description List</SubsectionTitle>
              </div>
              <dl className="space-y-2 text-sm">
                <div className="flex">
                  <dt className="font-semibold w-32">Name:</dt>
                  <dd className="text-muted-foreground">John Doe</dd>
                </div>
                <div className="flex">
                  <dt className="font-semibold w-32">Email:</dt>
                  <dd className="text-muted-foreground">john@example.com</dd>
                </div>
                <div className="flex">
                  <dt className="font-semibold w-32">Role:</dt>
                  <dd className="text-muted-foreground">Administrator</dd>
                </div>
              </dl>
              <CodeExample
                code={`<dl className="space-y-2">
  <div className="flex">
    <dt className="font-semibold w-32">Name:</dt>
    <dd className="text-muted-foreground">John Doe</dd>
  </div>
  <div className="flex">
    <dt className="font-semibold w-32">Email:</dt>
    <dd className="text-muted-foreground">john@example.com</dd>
  </div>
</dl>`}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <SubsectionTitle>List with Icons</SubsectionTitle>
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Database className="h-4 w-4 text-blue-500" />
                  <span>Database connection</span>
                </li>
                <li className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-green-500" />
                  <span>User management</span>
                </li>
                <li className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-red-500" />
                  <span>Error monitoring</span>
                </li>
              </ul>
              <CodeExample
                code={`import { Database, Users, AlertCircle } from "lucide-react";

<ul className="space-y-2">
  <li className="flex items-center gap-2">
    <Database className="h-4 w-4 text-blue-500" />
    <span>Database connection</span>
  </li>
  <li className="flex items-center gap-2">
    <Users className="h-4 w-4 text-green-500" />
    <span>User management</span>
  </li>
</ul>`}
              />
            </div>
          </div>
        </div>
      </SectionContainer>

      {/* Usage Guidelines */}
      <SectionContainer
        title="Usage Guidelines"
        description="Best practices for using data display components"
      >
        <div className="space-y-4 text-sm text-muted-foreground">
          <div>
            <h4 className="font-semibold text-foreground mb-2">StatCard</h4>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Use for displaying key metrics and statistics</li>
              <li>Include trend indicators when showing time-based data</li>
              <li>Use icons to provide visual context</li>
              <li>Provide descriptions for clarity</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-2">MetricGrid</h4>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Use for grouping related metric cards</li>
              <li>
                Responsive: automatically adjusts columns based on screen size
              </li>
              <li>
                Choose appropriate gap size (sm, md, lg) based on content
                density
              </li>
              <li>Limit to 4 columns maximum for readability</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-2">Cards</h4>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Use for grouping related content</li>
              <li>CardHeader for titles and descriptions</li>
              <li>CardContent for main content</li>
              <li>CardFooter for actions and additional info</li>
              <li>Can be made interactive with hover effects</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-2">Tables</h4>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Use for structured, tabular data</li>
              <li>Always include TableHeader for accessibility</li>
              <li>Use TableFooter for totals and summaries</li>
              <li>Use TableCaption for table descriptions</li>
              <li>Consider pagination for large datasets</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-2">Lists</h4>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Use unordered lists for non-sequential items</li>
              <li>Use ordered lists for steps or sequences</li>
              <li>Use description lists for key-value pairs</li>
              <li>Add icons for visual enhancement</li>
              <li>Use consistent spacing between items</li>
            </ul>
          </div>
        </div>
      </SectionContainer>
    </>
  );
}
