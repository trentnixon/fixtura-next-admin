// TODO: Add Account Title

import { ByLine, Title } from "@/components/type/titles";
import { Account } from "@/types";
import CheckBooleanStatus from "../overview/CheckBooleanStatus";

export default function AccountTitle({
  titleProps,
}: {
  titleProps: {
    account: Account;
    Name: string;
    Sport: string;
    id: string;
    accountType: string;
  };
}) {
  return (
    <div className="flex flex-col gap-2 border-b border-slate-200 pb-3 mb-2">
      <div className="border-b border-slate-200 pb-2 mb-2">
        <Title>{titleProps.Name}</Title>
        <ByLine>
          {titleProps.Sport} - {titleProps.accountType}
        </ByLine>
      </div>

      <CheckBooleanStatus account={titleProps.account as Account} />
    </div>
  );
}
