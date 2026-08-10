import PageContainer from "@/components/scaffolding/containers/PageContainer";
import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
import AccountsBreadcrumbHeader from "../components/AccountsBreadcrumbHeader";
import DisplayClubsTable from "./components/ClubsTable";

export default function ClubsPage() {
  return (
    <>
      <CreatePageTitle
        title="Club Accounts"
        byLine="Operational account directory for club subscriptions"
        byLineBottom="Subscription status, contacts, setup state, and account actions"
      />
      <PageContainer padding="xs" spacing="lg">
        <AccountsBreadcrumbHeader currentPage="Club accounts" />
        <DisplayClubsTable />
      </PageContainer>
    </>
  );
}
