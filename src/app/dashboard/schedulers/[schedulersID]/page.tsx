// TODO: Add scheduler details page

import CreatePage from "@/components/scaffolding/containers/createPage";
import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
import PageContainer from "@/components/scaffolding/containers/PageContainer";
import SchedulerPage from "./components/SchedulerPage";
import TableOfRenders from "./components/TableofRenders";

export default function SchedulerDetailsPage() {
  return (
    <CreatePage>
      <CreatePageTitle
        title="Scheduler Details"
        byLine="Monitor individual scheduler performance and render history"
      />
      <PageContainer padding="xs" spacing="lg">
        <SchedulerPage />
        <TableOfRenders />
      </PageContainer>
    </CreatePage>
  );
}
