// TODO: Add Sync CTABar
import { fixturaContentHubAccountDetails } from "@/types/fixturaContentHubAccountDetails";
import Button_GoToPlayHQ from "../actions/button_goToPlayHq";
//import Button_SyncAccount from "../actions/Button_SyncAccount";

type AccountTitleProps = {
  titleProps: fixturaContentHubAccountDetails;
};

export default function SyncCTABar({ titleProps }: AccountTitleProps) {
  return (
    <div className="flex flex-row gap-1 justify-end">
      <Button_GoToPlayHQ
        LinktoPlayHQ={titleProps.accountOrganisationDetails.href}
      />
      {/*  <Button_SyncAccount syncCompetitionsID={titleProps.id} /> */}
    </div>
  );
}
