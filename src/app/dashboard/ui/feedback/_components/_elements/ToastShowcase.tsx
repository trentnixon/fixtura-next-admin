/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import ElementContainer from "@/components/scaffolding/containers/ElementContainer";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import CodeExample from "./CodeExample";

/**
 * Toast Showcase
 *
 * Displays toast notification examples using Sonner
 */
export default function ToastShowcase() {
  return (
    <SectionContainer
      title="Toast Notifications"
      description="Toast notifications for user feedback using Sonner"
    >
      <div className="space-y-6">
        <ElementContainer title="Basic Toasts">
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => toast("Event has been created")}
              variant="primary"
            >
              Default Toast
            </Button>
            <Button
              onClick={() => toast.success("Account created successfully")}
              variant="secondary"
            >
              Success Toast
            </Button>
            <Button
              onClick={() => toast.error("Failed to save changes")}
              variant="accent"
            >
              Error Toast
            </Button>
            <Button
              onClick={() => toast.info("New update available")}
              variant="primary"
            >
              Info Toast
            </Button>
            <Button
              onClick={() => toast.warning("Please review your settings")}
              variant="secondary"
            >
              Warning Toast
            </Button>
          </div>
          <div className="mt-6">
            <CodeExample
              code={`import { toast } from "sonner";

// Basic toast
toast("Event has been created");

// Success toast
toast.success("Account created successfully");

// Error toast
toast.error("Failed to save changes");

// Info toast
toast.info("New update available");

// Warning toast
toast.warning("Please review your settings");`}
            />
          </div>
        </ElementContainer>

        <ElementContainer title="Toast with Description">
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() =>
                toast.success("Account created", {
                  description: "Your account has been successfully created.",
                })
              }
              variant="primary"
            >
              Success with Description
            </Button>
            <Button
              onClick={() =>
                toast.error("Failed to save", {
                  description:
                    "There was an error saving your changes. Please try again.",
                })
              }
              variant="secondary"
            >
              Error with Description
            </Button>
            <Button
              onClick={() =>
                toast.info("Update available", {
                  description:
                    "A new version of the app is available. Click to update.",
                })
              }
              variant="accent"
            >
              Info with Description
            </Button>
          </div>
          <div className="mt-6">
            <CodeExample
              code={`import { toast } from "sonner";

toast.success("Account created", {
  description: "Your account has been successfully created.",
});

toast.error("Failed to save", {
  description: "There was an error saving your changes. Please try again.",
});`}
            />
          </div>
        </ElementContainer>

        <ElementContainer title="Toast with Actions">
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() =>
                toast.success("Account created", {
                  description: "Your account has been successfully created.",
                  action: {
                    label: "View Account",
                    onClick: () => alert("View account clicked"),
                  },
                })
              }
              variant="primary"
            >
              Toast with Action
            </Button>
            <Button
              onClick={() =>
                toast.error("Failed to save", {
                  description: "There was an error saving your changes.",
                  action: {
                    label: "Retry",
                    onClick: () => alert("Retry clicked"),
                  },
                })
              }
              variant="secondary"
            >
              Error with Retry
            </Button>
          </div>
          <div className="mt-6">
            <CodeExample
              code={`import { toast } from "sonner";

toast.success("Account created", {
  description: "Your account has been successfully created.",
  action: {
    label: "View Account",
    onClick: () => navigateToAccount(),
  },
});

toast.error("Failed to save", {
  description: "There was an error saving your changes.",
  action: {
    label: "Retry",
    onClick: () => retrySave(),
  },
});`}
            />
          </div>
        </ElementContainer>

        <ElementContainer title="Toast with Custom Duration">
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() =>
                toast("This toast stays for 5 seconds", {
                  duration: 5000,
                })
              }
              variant="primary"
            >
              5 Second Toast
            </Button>
            <Button
              onClick={() =>
                toast("This toast stays for 10 seconds", {
                  duration: 10000,
                })
              }
              variant="secondary"
            >
              10 Second Toast
            </Button>
            <Button
              onClick={() =>
                toast("This toast stays until dismissed", {
                  duration: Infinity,
                })
              }
              variant="accent"
            >
              Persistent Toast
            </Button>
          </div>
          <div className="mt-6">
            <CodeExample
              code={`import { toast } from "sonner";

// Custom duration (milliseconds)
toast("This toast stays for 5 seconds", {
  duration: 5000,
});

// Stay until dismissed
toast("This toast stays until dismissed", {
  duration: Infinity,
});`}
            />
          </div>
        </ElementContainer>

        <ElementContainer title="Toast Variants">
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() =>
                toast.success("Success message", {
                  description: "Operation completed successfully",
                })
              }
              variant="primary"
            >
              Success
            </Button>
            <Button
              onClick={() =>
                toast.error("Error message", {
                  description: "Something went wrong",
                })
              }
              variant="secondary"
            >
              Error
            </Button>
            <Button
              onClick={() =>
                toast.info("Info message", {
                  description: "Here's some information",
                })
              }
              variant="accent"
            >
              Info
            </Button>
            <Button
              onClick={() =>
                toast.warning("Warning message", {
                  description: "Please be careful",
                })
              }
              variant="primary"
            >
              Warning
            </Button>
          </div>
          <div className="mt-6">
            <CodeExample
              code={`import { toast } from "sonner";

toast.success("Success message", {
  description: "Operation completed successfully",
});

toast.error("Error message", {
  description: "Something went wrong",
});

toast.info("Info message", {
  description: "Here's some information",
});

toast.warning("Warning message", {
  description: "Please be careful",
});`}
            />
          </div>
        </ElementContainer>

        <ElementContainer title="Promise Toast">
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => {
                const promise = new Promise((resolve) =>
                  setTimeout(() => resolve({ name: "Account" }), 2000)
                );

                toast.promise(promise, {
                  loading: "Creating account...",
                  success: (data: any) => `${data.name} created successfully`,
                  error: "Failed to create account",
                });
              }}
              variant="primary"
            >
              Promise Toast
            </Button>
            <Button
              onClick={() => {
                const promise = new Promise((_, reject) =>
                  setTimeout(() => reject(new Error("Network error")), 2000)
                );

                toast.promise(promise, {
                  loading: "Saving changes...",
                  success: "Changes saved successfully",
                  error: (err) => `Error: ${err.message}`,
                });
              }}
              variant="secondary"
            >
              Promise Error Toast
            </Button>
          </div>
          <div className="mt-6">
            <CodeExample
              code={`import { toast } from "sonner";

const promise = fetchData();

toast.promise(promise, {
  loading: "Loading...",
  success: (data) => \`\${data.name} loaded successfully\`,
  error: "Failed to load data",
});

// With error handling
toast.promise(promise, {
  loading: "Saving...",
  success: "Saved successfully",
  error: (err) => \`Error: \${err.message}\`,
});`}
            />
          </div>
        </ElementContainer>
      </div>
    </SectionContainer>
  );
}
