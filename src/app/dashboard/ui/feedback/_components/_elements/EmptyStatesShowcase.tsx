"use client";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import ElementContainer from "@/components/scaffolding/containers/ElementContainer";
import EmptyState from "@/components/ui-library/states/EmptyState";
import { Button } from "@/components/ui/button";
import { Inbox } from "lucide-react";
import CodeExample from "./CodeExample";

/**
 * Empty States Showcase
 *
 * Displays empty state component examples
 */
export default function EmptyStatesShowcase() {
  return (
    <SectionContainer
      title="Empty States"
      description="Show when no data is available with optional actions"
    >
      <div className="space-y-6">
        <ElementContainer title="Default Empty State">
          <div className="border rounded-md p-4 bg-slate-50 min-h-[250px] flex items-center">
            <EmptyState
              title="No accounts found"
              description="Start by creating your first account to get started"
              actionLabel="Create Account"
              onAction={() => alert("Create clicked")}
            />
          </div>
          <div className="mt-6">
            <CodeExample
              code={`import EmptyState from "@/components/ui-library/states/EmptyState";

<EmptyState
  title="No accounts found"
  description="Start by creating your first account"
  actionLabel="Create Account"
  onAction={handleCreate}
/>`}
            />
          </div>
        </ElementContainer>

        <ElementContainer title="Card Empty State">
          <div className="border rounded-md p-4 bg-slate-50">
            <EmptyState
              variant="card"
              title="No collections yet"
              description="Collections will appear here once created"
              actionLabel="Create Collection"
              onAction={() => alert("Create clicked")}
            />
          </div>
          <div className="mt-6">
            <CodeExample
              code={`<EmptyState
  variant="card"
  title="No collections yet"
  description="Collections will appear here once created"
  actionLabel="Create Collection"
  onAction={handleCreate}
/>`}
            />
          </div>
        </ElementContainer>

        <ElementContainer title="Minimal Empty State">
          <div className="border rounded-md p-4 bg-slate-50">
            <EmptyState variant="minimal" description="No data available" />
          </div>
          <div className="mt-6">
            <CodeExample
              code={`<EmptyState
  variant="minimal"
  description="No data available"
/>`}
            />
          </div>
        </ElementContainer>

        <ElementContainer title="Custom Icon Empty State">
          <div className="border rounded-md p-4 bg-slate-50 min-h-[250px] flex items-center">
            <EmptyState
              title="No search results"
              description="Try adjusting your search criteria"
              icon={<Inbox className="h-12 w-12 text-muted-foreground" />}
              actionLabel="Clear Filters"
              onAction={() => alert("Clear clicked")}
            />
          </div>
          <div className="mt-6">
            <CodeExample
              code={`import { Inbox } from "lucide-react";

<EmptyState
  title="No search results"
  description="Try adjusting your search criteria"
  icon={<Inbox className="h-12 w-12 text-muted-foreground" />}
  actionLabel="Clear Filters"
  onAction={handleClearFilters}
/>`}
            />
          </div>
        </ElementContainer>

        <ElementContainer title="Custom Action Empty State">
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
          <div className="mt-6">
            <CodeExample
              code={`<EmptyState
  title="No notifications"
  description="You're all caught up!"
  action={
    <div className="flex gap-2">
      <Button variant="outline">Settings</Button>
      <Button>Learn More</Button>
    </div>
  }
/>`}
            />
          </div>
        </ElementContainer>
      </div>
    </SectionContainer>
  );
}

