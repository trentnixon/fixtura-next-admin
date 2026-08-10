"use client";

import LoadingStatesShowcase from "./_elements/LoadingStatesShowcase";
import ErrorStatesShowcase from "./_elements/ErrorStatesShowcase";
import EmptyStatesShowcase from "./_elements/EmptyStatesShowcase";
import ToastShowcase from "./_elements/ToastShowcase";
import UsageGuidelinesShowcase from "./_elements/UsageGuidelinesShowcase";

/**
 * Feedback Showcase Component
 *
 * Displays all feedback and state components with examples
 */
export default function FeedbackShowcase() {
  return (
    <>
      <LoadingStatesShowcase />
      <ErrorStatesShowcase />
      <EmptyStatesShowcase />
      <ToastShowcase />
      <UsageGuidelinesShowcase />
    </>
  );
}
