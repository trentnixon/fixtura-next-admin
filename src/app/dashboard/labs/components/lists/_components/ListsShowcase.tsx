"use client";

import BasicListsShowcase from "./_elements/BasicListsShowcase";
import InteractiveListsShowcase from "./_elements/InteractiveListsShowcase";
import MediaListsShowcase from "./_elements/MediaListsShowcase";
import FeedListsShowcase from "./_elements/FeedListsShowcase";
import UsageGuidelinesShowcase from "./_elements/UsageGuidelinesShowcase";

/**
 * Lists showcase — basic, interactive, media, and feed list patterns
 */
export default function ListsShowcase() {
  return (
    <>
      <BasicListsShowcase />
      <InteractiveListsShowcase />
      <MediaListsShowcase />
      <FeedListsShowcase />
      <UsageGuidelinesShowcase />
    </>
  );
}
