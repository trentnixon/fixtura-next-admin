import PageContainer from "@/components/scaffolding/containers/PageContainer";
import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
import AccountOverview from "./components/AccountOverview";
import TestCharts from "./components/TestCharts";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";

export default function AccountsPage() {
  return (
    <>
      <CreatePageTitle
        title="Accounts"
        byLine="Overview of all accounts and analytics"
        byLineBottom="View account statistics, metrics, and charts"
      />
      <PageContainer padding="xs" spacing="lg">
        <SectionContainer
          title="Account Overview"
          description="Key metrics and statistics for all accounts"
        >
          <AccountOverview />
        </SectionContainer>
        <SectionContainer
          title="Analytics Charts"
          description="Visual representation of account data and trends"
        >
          <TestCharts />
        </SectionContainer>
      </PageContainer>
    </>
  );
}
