// TODO: Add Sync CTABar

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { P } from "@/components/type/type";
import { fixturaContentHubAccountDetails } from "@/types/fixturaContentHubAccountDetails";

type AccountTitleProps = {
  titleProps: fixturaContentHubAccountDetails;
};

export default function SyncCTABar({ titleProps }: AccountTitleProps) {
  return (
    <div className="flex flex-row gap-1 justify-end">
      <Button variant="outline">
        <Link
          target="_blank"
          rel="noopener noreferrer"
          href={titleProps.accountOrganisationDetails.href}>
          <P>Go To PlayHQ</P>
        </Link>
      </Button>
      <Button variant="outline">
        <Link target="_blank" rel="noopener noreferrer" href={""}>
          <P>Sync Competitions</P>
        </Link>
      </Button>
      <Button variant="outline">
        <Link target="_blank" rel="noopener noreferrer" href={""}>
          <P>Sync Clubs</P>
        </Link>
      </Button>
      <Button variant="outline">
        <Link target="_blank" rel="noopener noreferrer" href={""}>
          <P>Sync Grades</P>
        </Link>
      </Button>
      <Button variant="outline">
        <Link target="_blank" rel="noopener noreferrer" href={""}>
          <P>Sync Fixtures</P>
        </Link>
      </Button>
    </div>
  );
}
