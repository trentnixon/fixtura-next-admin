// TODO: Add Associations page
import DisplayAssociationsTable from "./components/AssociationsTable";
import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
import CreatePage from "@/components/scaffolding/containers/createPage";

export default function AssociationsPage() {
  return (
    <CreatePage>
      <CreatePageTitle
        title="Associations"
        byLine="A list of all associations"
      />
      <DisplayAssociationsTable />
    </CreatePage>
  );
}
