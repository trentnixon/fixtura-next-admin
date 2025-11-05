"use client";

import { SubsectionTitle } from "@/components/type/titles";
import CodeExample from "./CodeExample";

/**
 * Dividers Showcase
 *
 * Displays examples of divider components
 */
export default function DividersShowcase() {
  return (
    <div className="space-y-6">
      <div>
        <SubsectionTitle>Horizontal Divider</SubsectionTitle>
        <div className="space-y-4 mt-4">
          <div>Content above</div>
          <hr className="border-slate-200" />
          <div>Content below</div>
        </div>
        <div className="mt-6">
          <CodeExample
            code={`<div>
  <div>Content above</div>
  <hr className="border-slate-200" />
  <div>Content below</div>
</div>`}
          />
        </div>
      </div>

      <div>
        <SubsectionTitle>Divider with Text</SubsectionTitle>
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        <div className="mt-6">
          <CodeExample
            code={`<div className="relative">
  <div className="absolute inset-0 flex items-center">
    <span className="w-full border-t border-slate-200" />
  </div>
  <div className="relative flex justify-center text-xs uppercase">
    <span className="bg-white px-2 text-muted-foreground">
      Divider Text
    </span>
  </div>
</div>`}
          />
        </div>
      </div>

      <div>
        <SubsectionTitle>Vertical Divider</SubsectionTitle>
        <div className="flex items-center gap-4 mt-4">
          <div className="flex-1 p-4 bg-slate-100 border rounded-md">
            Left Content
          </div>
          <div className="h-12 w-px bg-slate-200" />
          <div className="flex-1 p-4 bg-slate-100 border rounded-md">
            Right Content
          </div>
        </div>
        <div className="mt-6">
          <CodeExample
            code={`<div className="flex items-center gap-4">
  <div className="flex-1">Left Content</div>
  <div className="h-12 w-px bg-slate-200" />
  <div className="flex-1">Right Content</div>
</div>`}
          />
        </div>
      </div>
    </div>
  );
}

