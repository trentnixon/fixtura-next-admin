"use client";

import { SubsectionTitle } from "@/components/type/titles";
import CodeExample from "./CodeExample";

/**
 * Grid Showcase
 *
 * Displays examples of CSS Grid layouts
 */
export default function GridShowcase() {
  return (
    <div className="space-y-6">
      <div>
        <SubsectionTitle>Basic Grid</SubsectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div
              key={item}
              className="p-4 bg-slate-100 border rounded-md text-center"
            >
              Grid Item {item}
            </div>
          ))}
        </div>
        <div className="mt-6">
          <CodeExample
            code={`<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {items.map((item) => (
    <div key={item.id} className="p-4 bg-slate-100 border rounded-md">
      {item.content}
    </div>
  ))}
</div>`}
          />
        </div>
      </div>

      <div>
        <SubsectionTitle>Auto-fit Grid</SubsectionTitle>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 mt-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="p-4 bg-slate-100 border rounded-md text-center"
            >
              Auto-fit Item {item}
            </div>
          ))}
        </div>
        <div className="mt-6">
          <CodeExample
            code={`<div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
  {items.map((item) => (
    <div key={item.id}>{item.content}</div>
  ))}
</div>`}
          />
        </div>
      </div>

      <div>
        <SubsectionTitle>Nested Grid</SubsectionTitle>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="p-4 bg-slate-100 border rounded-md">
            Parent Grid Item 1
          </div>
          <div className="p-4 bg-slate-100 border rounded-md">
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div className="p-2 bg-white border rounded text-xs">
                Nested 1
              </div>
              <div className="p-2 bg-white border rounded text-xs">
                Nested 2
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6">
          <CodeExample
            code={`<div className="grid grid-cols-2 gap-4">
  <div>Parent Item</div>
  <div className="grid grid-cols-2 gap-2">
    <div>Nested Item 1</div>
    <div>Nested Item 2</div>
  </div>
</div>`}
          />
        </div>
      </div>
    </div>
  );
}

