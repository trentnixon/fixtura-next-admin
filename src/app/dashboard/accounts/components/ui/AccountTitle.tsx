// TODO: Add Account Title

import CheckBooleanStatus from "../overview/CheckBooleanStatus";
import { fixturaContentHubAccountDetails } from "@/types/fixturaContentHubAccountDetails";
import CreatePage from "@/components/scaffolding/containers/createPage";
import SyncCTABar from "./SyncCTABar";
import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";

type AccountTitleProps = {
  titleProps: fixturaContentHubAccountDetails;
};

export default function AccountTitle({ titleProps }: AccountTitleProps) {
  return (
    <CreatePage>
      <CreatePageTitle
        title={titleProps.accountOrganisationDetails.Name}
        byLine={`${titleProps.accountOrganisationDetails.Sport} - ${
          titleProps.account_type === 1 ? "Club" : "Association"
        }`}
        image={titleProps.accountOrganisationDetails.ParentLogo}
      />

      <CheckBooleanStatus titleProps={titleProps} />
      <SyncCTABar titleProps={titleProps} />
    </CreatePage>
  );
}
