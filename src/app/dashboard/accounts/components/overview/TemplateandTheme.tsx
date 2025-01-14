// TODO: Add Template and Theme

import { Template, Theme } from "@/types";

export default function TemplateAndTheme({
  theme,
  template,
}: {
  theme: Theme;
  template: Template;
}) {
  return (
    <section>
      <h2 className="text-xl font-semibold mb-2">Template and Theme</h2>
      <p>
        <strong>Template:</strong> {template?.attributes?.Name || "N/A"}
      </p>
      <p>
        <strong>Theme:</strong> {theme?.attributes?.Name || "N/A"}
      </p>
    </section>
  );
}
