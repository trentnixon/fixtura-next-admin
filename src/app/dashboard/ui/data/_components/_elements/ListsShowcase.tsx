"use client";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import ElementContainer from "@/components/scaffolding/containers/ElementContainer";
import { Database, Users, AlertCircle } from "lucide-react";
import CodeExample from "./CodeExample";

/**
 * Lists Showcase
 *
 * Displays list component examples
 */
export default function ListsShowcase() {
  return (
    <SectionContainer
      title="Lists"
      description="List components for displaying ordered and unordered data"
    >
      <div className="space-y-6">
        <ElementContainer title="Unordered List">
          <ul className="list-disc list-inside space-y-2 text-sm">
            <li>First item</li>
            <li>Second item</li>
            <li>Third item</li>
          </ul>
          <div className="mt-6">
            <CodeExample
              code={`<ul className="list-disc list-inside space-y-2">
  <li>First item</li>
  <li>Second item</li>
  <li>Third item</li>
</ul>`}
            />
          </div>
        </ElementContainer>

        <ElementContainer title="Ordered List">
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>First step</li>
            <li>Second step</li>
            <li>Third step</li>
          </ol>
          <div className="mt-6">
            <CodeExample
              code={`<ol className="list-decimal list-inside space-y-2">
  <li>First step</li>
  <li>Second step</li>
  <li>Third step</li>
</ol>`}
            />
          </div>
        </ElementContainer>

        <ElementContainer title="Description List">
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
          <div className="mt-6">
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
        </ElementContainer>

        <ElementContainer title="List with Icons">
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
          <div className="mt-6">
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
        </ElementContainer>
      </div>
    </SectionContainer>
  );
}
