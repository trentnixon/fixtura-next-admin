// TODO: Add scheduler details page

import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
import PageContainer from "@/components/scaffolding/containers/PageContainer";
import SchedulerPage from "./components/SchedulerPage";
import TableOfRenders from "./components/TableofRenders";

export default function SchedulerDetailsPage() {
  return (
    <>
      <CreatePageTitle
        title="Scheduler Details"
        byLine="Monitor individual scheduler performance and render history"
      />
      <PageContainer padding="xs" spacing="lg">
        <SchedulerPage />
        <TableOfRenders />
      </PageContainer>
    </>
  );
}
