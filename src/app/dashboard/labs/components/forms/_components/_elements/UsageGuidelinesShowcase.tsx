"use client";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";

/**
 * Usage Guidelines Showcase
 *
 * Displays best practices for using form components
 */
export default function UsageGuidelinesShowcase() {
  return (
    <SectionContainer
      title="Usage Guidelines"
      description="Best practices for using form components"
    >
      <div className="space-y-4 text-sm text-muted-foreground">
        <div>
          <h4 className="font-semibold text-foreground mb-2">Input Types</h4>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Use appropriate input types for better UX (email, password, number, etc.)</li>
            <li>Always provide labels for accessibility</li>
            <li>Use placeholders to guide users</li>
            <li>Show validation states (error, success) with helper text</li>
            <li>Disable inputs when not applicable</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-foreground mb-2">Select Components</h4>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Use for single selection from a list</li>
            <li>Group related options with SelectGroup and SelectLabel</li>
            <li>Use SelectSeparator to visually separate groups</li>
            <li>Always provide a placeholder when no value is selected</li>
            <li>Limit options to reasonable number (use searchable select for many options)</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-foreground mb-2">Switch Components</h4>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Use for boolean on/off settings</li>
            <li>Always pair with a label</li>
            <li>Show current state clearly</li>
            <li>Disable when setting cannot be changed</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-foreground mb-2">Checkboxes & Radio</h4>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Use checkboxes for multiple selections</li>
            <li>Use radio buttons for single selection from a group</li>
            <li>Always group radio buttons with the same name attribute</li>
            <li>Provide clear labels for each option</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-foreground mb-2">Form Layout</h4>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Use consistent spacing between form fields</li>
            <li>Group related fields together</li>
            <li>Use labels above inputs for better readability</li>
            <li>Provide clear submit buttons</li>
            <li>Show validation feedback immediately when possible</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-foreground mb-2">Accessibility</h4>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Always associate labels with inputs using htmlFor/id</li>
            <li>Provide error messages that are accessible to screen readers</li>
            <li>Ensure sufficient color contrast</li>
            <li>Support keyboard navigation</li>
            <li>Use appropriate ARIA attributes when needed</li>
          </ul>
        </div>
      </div>
    </SectionContainer>
  );
}

