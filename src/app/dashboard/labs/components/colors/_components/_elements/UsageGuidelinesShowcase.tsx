"use client";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import Code from "@/components/ui-library/foundation/Code";

/**
 * Usage Guidelines Showcase
 *
 * Displays best practices for using colors in the UI
 */
export default function UsageGuidelinesShowcase() {
  return (
    <SectionContainer
      title="Color Usage Guidelines"
      description="Best practices for using colors in the UI"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h4 className="font-semibold text-lg">Color Scale Usage</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <strong className="text-foreground">50-100:</strong> Lightest
              backgrounds, subtle highlights
            </li>
            <li>
              <strong className="text-foreground">200-300:</strong> Hover
              states, light fills
            </li>
            <li>
              <strong className="text-foreground">400-500:</strong> Base colors
              for buttons, badges, icons
            </li>
            <li>
              <strong className="text-foreground">600-700:</strong> Hover
              states, active states, emphasis
            </li>
            <li>
              <strong className="text-foreground">800-900:</strong> Text on
              light backgrounds, strong emphasis
            </li>
            <li>
              <strong className="text-foreground">950:</strong> Maximum
              contrast, darkest text
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <h4 className="font-semibold text-lg">Semantic Color Mapping</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <strong className="text-foreground">brandSuccess:</strong> Use{" "}
              <Code className="text-xs">brandSuccess-500</Code> for primary
              actions,
              <Code className="text-xs">brandSuccess-100</Code> for backgrounds
            </li>
            <li>
              <strong className="text-foreground">brandError:</strong> Use{" "}
              <Code className="text-xs">brandError-500</Code> for alerts,
              <Code className="text-xs">brandError-50</Code> for error
              backgrounds
            </li>
            <li>
              <strong className="text-foreground">brandWarning:</strong> Use{" "}
              <Code className="text-xs">brandWarning-500</Code> for warnings,
              <Code className="text-xs">brandWarning-100</Code> for backgrounds
            </li>
            <li>
              <strong className="text-foreground">brandInfo:</strong> Use{" "}
              <Code className="text-xs">brandInfo-500</Code> for info messages,
              <Code className="text-xs">brandInfo-50</Code> for backgrounds
            </li>
            <li>
              <strong className="text-foreground">brandPrimary:</strong> Use{" "}
              <Code className="text-xs">brandPrimary-500</Code> for primary
              brand actions,
              <Code className="text-xs">brandPrimary-100</Code> for backgrounds
            </li>
            <li>
              <strong className="text-foreground">brandSecondary:</strong> Use{" "}
              <Code className="text-xs">brandSecondary-500</Code> for secondary
              actions,
              <Code className="text-xs">brandSecondary-100</Code> for
              backgrounds
            </li>
            <li>
              <strong className="text-foreground">brandAccent:</strong> Use{" "}
              <Code className="text-xs">brandAccent-500</Code> for accent
              highlights,
              <Code className="text-xs">brandAccent-100</Code> for backgrounds
            </li>
          </ul>
        </div>
      </div>
    </SectionContainer>
  );
}
