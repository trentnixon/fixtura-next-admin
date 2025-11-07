"use client";

import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
import PageContainer from "@/components/scaffolding/containers/PageContainer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DollarSign } from "lucide-react";

/**
 * Budget & Costings Page
 *
 * View global render costs and budget analysis.
 */
export default function BudgetPage() {
  return (
    <>
      <CreatePageTitle
        title="Budget & Costings"
        byLine="Global Render Cost Analysis"
        byLineBottom="View global render costs and budget analysis"
      />

      <PageContainer padding="xs" spacing="lg">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-100 rounded-md">
                <DollarSign className="h-5 w-5 text-slate-700" />
              </div>
              <div>
                <CardTitle>Coming Soon</CardTitle>
                <CardDescription>
                  Budget and costings dashboard will be available here
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-64 text-muted-foreground">
              <p>Budget & Costings dashboard coming soon...</p>
            </div>
          </CardContent>
        </Card>
      </PageContainer>
    </>
  );
}
