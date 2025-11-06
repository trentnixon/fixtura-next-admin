import PageContainer from "@/components/scaffolding/containers/PageContainer";
import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
import DisplayAssociationsTable from "./components/AssociationsTable";

export default function AssociationsPage() {
  return (
    <>
      <CreatePageTitle
        title="Association Accounts"
        byLine="View, manage, and search all association accounts"
        byLineBottom="Includes association status, contact info, and management tools"
      />
      <PageContainer padding="xs" spacing="lg">
        <DisplayAssociationsTable />
      </PageContainer>
    </>
  );
}
