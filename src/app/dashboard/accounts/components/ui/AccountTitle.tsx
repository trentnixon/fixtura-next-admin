import { fixturaContentHubAccountDetails } from "@/types/fixturaContentHubAccountDetails";
import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";

type AccountTitleProps = {
  titleProps: fixturaContentHubAccountDetails;
};

export default function AccountTitle({ titleProps }: AccountTitleProps) {
  // Guard against null/undefined accountOrganisationDetails
  if (!titleProps?.accountOrganisationDetails) {
    return null;
  }

  const { Name, Sport, ParentLogo } = titleProps.accountOrganisationDetails;

  return (
    <>
      <CreatePageTitle
        title={Name || "Account"}
        byLine={`${Sport || "Unknown"} - ${
          titleProps.account_type === 1 ? "Club" : "Association"
        }`}
        byLineBottom={`Account ID: ${titleProps.id}`}
        image={ParentLogo}
      />
    </>
  );
}
