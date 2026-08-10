"use client";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
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
import { SubsectionTitle } from "@/components/type/titles";
import ComponentRef from "./ComponentRef";
import { TABLE_TOKENS } from "./tableTokens";
import { getStatusBadgeClass } from "./tableSampleData";

/**
 * Basic table showcase — default, caption, and footer patterns
 */
export default function BasicTablesShowcase() {
  return (
    <SectionContainer
      title="Basic Tables"
      description="Standard table structure with headers, body, caption, and footer"
    >
      <div className="space-y-8">
        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>Default</SubsectionTitle>
            <span className="text-xs text-muted-foreground">
              header · body · badges
            </span>
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
                  <Badge className={getStatusBadgeClass("Active")}>Active</Badge>
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
                  <Badge className={getStatusBadgeClass("Active")}>Active</Badge>
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
                  <Badge className={getStatusBadgeClass("Inactive")}>
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
          <ComponentRef token={TABLE_TOKENS.basic} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>With Caption</SubsectionTitle>
            <span className="text-xs text-muted-foreground">TableCaption</span>
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
                  <Badge className={getStatusBadgeClass("Completed")}>
                    Completed
                  </Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>2024-01-14</TableCell>
                <TableCell>$987.65</TableCell>
                <TableCell>
                  <Badge className={getStatusBadgeClass("Pending")}>Pending</Badge>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <ComponentRef token={TABLE_TOKENS.caption} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>With Footer</SubsectionTitle>
            <span className="text-xs text-muted-foreground">TableFooter · totals</span>
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
                <TableCell className="text-right font-semibold">$80.00</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
          <ComponentRef token={TABLE_TOKENS.footer} />
        </div>
      </div>
    </SectionContainer>
  );
}
