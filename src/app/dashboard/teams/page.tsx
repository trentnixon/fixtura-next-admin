import SearchForTeam from "./components/searchForTeam";
import CreatePage from "@/components/scaffolding/containers/createPage";
import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";

// TODO: Add teams page
export default function TeamsPage() {
  return (
    <CreatePage>
      <CreatePageTitle title="Teams" byLine="All Teams" />
      <SearchForTeam />
    </CreatePage>
  );
}
