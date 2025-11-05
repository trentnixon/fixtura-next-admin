"use client";

import { SubsectionTitle } from "@/components/type/titles";
import CodeExample from "./CodeExample";

/**
 * Flex Showcase
 *
 * Displays examples of CSS Flexbox layouts
 */
export default function FlexShowcase() {
  return (
    <div className="space-y-6">
      <div>
        <SubsectionTitle>Flex Row</SubsectionTitle>
        <div className="flex flex-row gap-4 mt-4">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="p-4 bg-slate-100 border rounded-md flex-1"
            >
              Flex Item {item}
            </div>
          ))}
        </div>
        <div className="mt-6">
          <CodeExample
            code={`<div className="flex flex-row gap-4">
  <div className="flex-1">Item 1</div>
  <div className="flex-1">Item 2</div>
  <div className="flex-1">Item 3</div>
</div>`}
          />
        </div>
      </div>

      <div>
        <SubsectionTitle>Flex Column</SubsectionTitle>
        <div className="flex flex-col gap-4 mt-4 max-w-xs">
          {[1, 2, 3].map((item) => (
            <div key={item} className="p-4 bg-slate-100 border rounded-md">
              Flex Column Item {item}
            </div>
          ))}
        </div>
        <div className="mt-6">
          <CodeExample
            code={`<div className="flex flex-col gap-4">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>`}
          />
        </div>
      </div>

      <div>
        <SubsectionTitle>Flex Center</SubsectionTitle>
        <div className="flex items-center justify-center h-24 bg-slate-100 border rounded-md mt-4">
          Centered Content
        </div>
        <div className="mt-6">
          <CodeExample
            code={`<div className="flex items-center justify-center h-24">
  Centered Content
</div>`}
          />
        </div>
      </div>

      <div>
        <SubsectionTitle>Flex Between</SubsectionTitle>
        <div className="flex items-center justify-between p-4 bg-slate-100 border rounded-md mt-4">
          <span>Left Content</span>
          <span>Right Content</span>
        </div>
        <div className="mt-6">
          <CodeExample
            code={`<div className="flex items-center justify-between">
  <span>Left Content</span>
  <span>Right Content</span>
</div>`}
          />
        </div>
      </div>

      <div>
        <SubsectionTitle>Flex Around</SubsectionTitle>
        <div className="flex items-center justify-around p-4 bg-slate-100 border rounded-md mt-4">
          <span>Item 1</span>
          <span>Item 2</span>
          <span>Item 3</span>
        </div>
        <div className="mt-6">
          <CodeExample
            code={`<div className="flex items-center justify-around">
  <span>Item 1</span>
  <span>Item 2</span>
  <span>Item 3</span>
</div>`}
          />
        </div>
      </div>
    </div>
  );
}

