"use client";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import ElementContainer from "@/components/scaffolding/containers/ElementContainer";
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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import CodeExample from "./CodeExample";

/**
 * Tables Showcase
 *
 * Displays Table component examples
 */
export default function TablesShowcase() {
  return (
    <SectionContainer
      title="Tables"
      description="Data table components for displaying structured data"
    >
      <div className="space-y-6">
        <ElementContainer title="Basic Table">
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
          <div className="mt-6">
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
        </ElementContainer>

        <ElementContainer title="Table with Caption">
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
          <div className="mt-6">
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
        </ElementContainer>

        <ElementContainer title="Table with Footer">
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
          <div className="mt-6">
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
        </ElementContainer>
      </div>
    </SectionContainer>
  );
}
