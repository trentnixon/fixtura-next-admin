// TODO: Add scheduler details page

import CreatePage from "@/components/scaffolding/containers/createPage";
import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
import SchedulerPage from "./components/SchedulerPage";
import TableOfRenders from "./components/TableofRenders";
export default function SchedulerDetailsPage() {
  return (
    <CreatePage>
      <CreatePageTitle title="Scheduler Details" byLine="Scheduler Details" />
      <SchedulerPage />
      <TableOfRenders />
    </CreatePage>
  );
}
