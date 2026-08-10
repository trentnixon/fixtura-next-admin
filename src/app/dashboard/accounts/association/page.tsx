import PageContainer from "@/components/scaffolding/containers/PageContainer";
import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
import AccountsBreadcrumbHeader from "../components/AccountsBreadcrumbHeader";
import DisplayAssociationsTable from "./components/AssociationsTable";

export default function AssociationsPage() {
  return (
    <>
      <CreatePageTitle
        title="Association Accounts"
        byLine="Operational account directory for association subscriptions"
        byLineBottom="Subscription status, contacts, setup state, and account actions"
      />
      <PageContainer padding="xs" spacing="lg">
        <AccountsBreadcrumbHeader currentPage="Association accounts" />
        <DisplayAssociationsTable />
      </PageContainer>
    </>
  );
}
