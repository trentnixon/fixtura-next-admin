/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { Button } from "@/components/ui/button";
import { SubsectionTitle } from "@/components/type/titles";
import { toast } from "sonner";
import ComponentRef from "./ComponentRef";
import { FEEDBACK_TOKENS } from "./feedbackTokens";

/**
 * Toast showcase — Sonner notification patterns
 */
export default function ToastShowcase() {
  return (
    <SectionContainer
      title="Toast Notifications"
      description="Toast notifications for user feedback using Sonner"
    >
      <div className="space-y-8">
        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>Basic</SubsectionTitle>
            <span className="text-xs text-muted-foreground">
              default · success · error · info · warning
            </span>
          </div>
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
          <ComponentRef token={FEEDBACK_TOKENS.toast.basic} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>With Description</SubsectionTitle>
            <span className="text-xs text-muted-foreground">description prop</span>
          </div>
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
          <ComponentRef token={FEEDBACK_TOKENS.toast.withDescription} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>With Action</SubsectionTitle>
            <span className="text-xs text-muted-foreground">action button</span>
          </div>
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
          <ComponentRef token={FEEDBACK_TOKENS.toast.withAction} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>Custom Duration</SubsectionTitle>
            <span className="text-xs text-muted-foreground">
              5s · 10s · persistent
            </span>
          </div>
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
          <ComponentRef token={FEEDBACK_TOKENS.toast.customDuration} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>Promise</SubsectionTitle>
            <span className="text-xs text-muted-foreground">
              loading · success · error
            </span>
          </div>
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
          <ComponentRef token={FEEDBACK_TOKENS.toast.promise} />
        </div>
      </div>
    </SectionContainer>
  );
}
