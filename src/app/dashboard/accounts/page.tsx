// TODO: Add Accounts page

import CreatePage from "@/components/scaffolding/containers/createPage";
import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
import AccountOverview from "./components/AccountOverview";
import TestCharts from "./components/TestCharts";

export default function AccountsPage() {
  return (
    <CreatePage>
      <CreatePageTitle title="Accounts" byLine="Accounts" />
      <section className="flex flex-col gap-8 my-8">
        <AccountOverview />
        <TestCharts />
      </section>
    </CreatePage>
  );
}
