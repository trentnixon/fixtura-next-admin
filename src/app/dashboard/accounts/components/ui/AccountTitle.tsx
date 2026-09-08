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
  const contactByLine = buildAccountContactByLine(titleProps);

  return (
    <>
      <CreatePageTitle
        title={Name || "Account"}
        byLine={`${Sport || "Unknown"} - ${
          titleProps.account_type === 1 ? "Club" : "Association"
        }`}
        byLineBottom={contactByLine}
        image={ParentLogo}
      />
    </>
  );
}

function buildAccountContactByLine(
  account: fixturaContentHubAccountDetails,
): string | undefined {
  const holderName = [account.FirstName, account.LastName]
    .filter(Boolean)
    .join(" ")
    .trim();
  const deliveryAddress = account.DeliveryAddress?.trim();

  const parts = [holderName, deliveryAddress].filter(Boolean);
  return parts.length > 0 ? parts.join(" · ") : undefined;
}
