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
  };
}) {
  return (
    <div className="flex flex-col gap-2">
      <Title>
        {titleProps.Name} ({titleProps.id})
      </Title>
      <ByLine>{titleProps.Sport}</ByLine>

      <CheckBooleanStatus account={titleProps.account as Account} />
    </div>
  );
}
