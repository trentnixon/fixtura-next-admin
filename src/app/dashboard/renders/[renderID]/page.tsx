"use client";

import { useParams } from "next/navigation";
import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
import PageContainer from "@/components/scaffolding/containers/PageContainer";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import RenderHeader from "./components/renderHeader";
import RenderOverview from "./components/renderOverview";
import { RenderTabs } from "./components/renderTabs";
import { useRendersQuery } from "@/hooks/renders/useRendersQuery";
import { useGetAccountDetailsFromRenderId } from "@/hooks/renders/useGetAccountDetailsFromRenderId";
import { formatDate } from "@/lib/utils";

export default function RenderID() {
  const { renderID } = useParams();
  const { data: render } = useRendersQuery(renderID as string);
  const { data: accountDetails } = useGetAccountDetailsFromRenderId(
    renderID as string
  );

  // Build account name from FirstName and LastName
  const accountName =
    accountDetails?.account?.FirstName && accountDetails?.account?.LastName
      ? `${accountDetails.account.FirstName} ${accountDetails.account.LastName}`
      : accountDetails?.account?.FirstName || null;

  // Build page title with org/account name first, then render name
  const pageTitle = accountName
    ? render?.Name
      ? `${accountName} - ${render.Name}`
      : `${accountName} - Render Details`
    : render?.Name
    ? `Render Details - ${render.Name}`
    : "Render Details";

  // Build byLine with Render ID and account info
  const byLineParts = [];
  if (renderID) {
    byLineParts.push(`Render ID: ${renderID}`);
  }
  if (accountDetails?.account?.Sport) {
    byLineParts.push(accountDetails.account.Sport);
  }
  const byLine = byLineParts.join(" · ");

  // Build byLineBottom with description and last updated date
  const description = render?.Name
    ? `View and manage render information, downloads, and game data`
    : "";
  const lastUpdated = render?.updatedAt ? formatDate(render.updatedAt) : null;
  const byLineBottom = lastUpdated
    ? `Last Updated: ${lastUpdated}`
    : description;

  return (
    <>
      <CreatePageTitle
        title={pageTitle}
        byLine={byLine}
        byLineBottom={byLineBottom}
      />
      <PageContainer padding="md" spacing="lg">
        <RenderHeader render={render} />
        <RenderOverview />
        <SectionContainer
          title="Render Data"
          description="Downloads, game results, upcoming games, and grades associated with this render."
        >
          <RenderTabs />
        </SectionContainer>
      </PageContainer>
    </>
  );
}
