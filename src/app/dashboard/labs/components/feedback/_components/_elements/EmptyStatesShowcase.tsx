"use client";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import EmptyState from "@/components/ui-library/states/EmptyState";
import { Button } from "@/components/ui/button";
import { SubsectionTitle } from "@/components/type/titles";
import { Inbox } from "lucide-react";
import ComponentRef from "./ComponentRef";
import { FEEDBACK_TOKENS } from "./feedbackTokens";

/**
 * Empty state showcase — default, card, minimal, and custom patterns
 */
export default function EmptyStatesShowcase() {
  return (
    <SectionContainer
      title="Empty States"
      description="Show when no data is available with optional actions"
    >
      <div className="space-y-8">
        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>Default</SubsectionTitle>
            <span className="text-xs text-muted-foreground">with action</span>
          </div>
          <div className="border rounded-md p-4 bg-slate-50 min-h-[250px] flex items-center">
            <EmptyState
              title="No accounts found"
              description="Start by creating your first account to get started"
              actionLabel="Create Account"
              onAction={() => alert("Create clicked")}
            />
          </div>
          <ComponentRef token={FEEDBACK_TOKENS.empty.default} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>Card</SubsectionTitle>
            <span className="text-xs text-muted-foreground">variant card</span>
          </div>
          <div className="border rounded-md p-4 bg-slate-50">
            <EmptyState
              variant="card"
              title="No collections yet"
              description="Collections will appear here once created"
              actionLabel="Create Collection"
              onAction={() => alert("Create clicked")}
            />
          </div>
          <ComponentRef token={FEEDBACK_TOKENS.empty.card} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>Minimal</SubsectionTitle>
            <span className="text-xs text-muted-foreground">variant minimal</span>
          </div>
          <div className="border rounded-md p-4 bg-slate-50">
            <EmptyState variant="minimal" description="No data available" />
          </div>
          <ComponentRef token={FEEDBACK_TOKENS.empty.minimal} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>Custom Icon</SubsectionTitle>
            <span className="text-xs text-muted-foreground">icon prop</span>
          </div>
          <div className="border rounded-md p-4 bg-slate-50 min-h-[250px] flex items-center">
            <EmptyState
              title="No search results"
              description="Try adjusting your search criteria"
              icon={<Inbox className="h-12 w-12 text-muted-foreground" />}
              actionLabel="Clear Filters"
              onAction={() => alert("Clear clicked")}
            />
          </div>
          <ComponentRef token={FEEDBACK_TOKENS.empty.customIcon} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>Custom Action</SubsectionTitle>
            <span className="text-xs text-muted-foreground">action slot</span>
          </div>
          <div className="border rounded-md p-4 bg-slate-50 min-h-[250px] flex items-center">
            <EmptyState
              title="No notifications"
              description="You're all caught up!"
              action={
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Settings
                  </Button>
                  <Button size="sm">Learn More</Button>
                </div>
              }
            />
          </div>
          <ComponentRef token={FEEDBACK_TOKENS.empty.customAction} />
        </div>
      </div>
    </SectionContainer>
  );
}
