// TODO: Add Account Title

import { ByLine, Title } from "@/components/type/titles";
import CheckBooleanStatus from "../overview/CheckBooleanStatus";
import { fixturaContentHubAccountDetails } from "@/types/fixturaContentHubAccountDetails";
import Image from "next/image";

import SyncCTABar from "./SyncCTABar";

type AccountTitleProps = {
  titleProps: fixturaContentHubAccountDetails;
};

export default function AccountTitle({ titleProps }: AccountTitleProps) {
  return (
    <div className="flex flex-col gap-2 border-b border-slate-200 pb-3 mb-2">
      <div className="border-b border-slate-200 pb-2 mb-2">
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col gap-0">
            <Title>{titleProps.accountOrganisationDetails.Name}</Title>
            <ByLine>
              {titleProps.accountOrganisationDetails.Sport} -{" "}
              {titleProps.account_type === 1 ? "Club" : "Association"}
            </ByLine>
          </div>
          <Image
            src={titleProps.accountOrganisationDetails.ParentLogo}
            alt={titleProps.accountOrganisationDetails.Name}
            width={80}
            height={80}
          />
        </div>
      </div>
      <CheckBooleanStatus titleProps={titleProps} />
      <SyncCTABar titleProps={titleProps} />
    </div>
  );
}
