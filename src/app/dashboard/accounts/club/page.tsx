// TODO: Add Clubs page

import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
import DisplayClubsTable from "./components/ClubsTable";
import CreatePage from "@/components/scaffolding/containers/createPage";
export default function ClubsPage() {
  return (
    <CreatePage>
      <CreatePageTitle title="Clubs" byLine="A list of all clubs" />
      <DisplayClubsTable />
    </CreatePage>
  );
}
