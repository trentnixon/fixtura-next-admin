// create a render header component that displays the render details

import { DatabaseIcon } from "lucide-react";

import { Label } from "@/components/type/titles";

import { ByLine } from "@/components/type/titles";

import { Title } from "@/components/type/titles";
import { Button } from "@/components/ui/button";
import { ExternalLinkIcon } from "lucide-react";
import StatusFlags from "../StatusFlags";
import { useGlobalContext } from "@/components/providers/GlobalContext";
import { useParams } from "next/navigation";
import { useAccountQuery } from "@/hooks/accounts/useAccountQuery";
import Link from "next/link";
import { useRendersQuery } from "@/hooks/renders/useRendersQuery";

export default function RenderHeader() {
  const { Domain, strapiLocation } = useGlobalContext();
  const { contentHub } = Domain;
  const { renderID, accountID } = useParams();

  // Fetch data
  const { data: render } = useRendersQuery(renderID as string);
  const { data: account } = useAccountQuery(accountID as string);

  // Extract account and render details
  const accountData = account?.data;
  const sport = accountData?.Sport || "";

  return (
    <div className="flex flex-col gap-2 border-b border-slate-200 pb-3 mb-2">
      <div className="border-b border-slate-200 pb-2 mb-2">
        <Title>Render Details</Title>
        <ByLine>
          {render?.Name} - {renderID}
        </ByLine>
      </div>

      {/* Links */}
      <div className="flex justify-end gap-2 items-center">
        <Label>Actions</Label>
        [Queue] [Rendering]
        <Label>Links</Label>
        <Link
          href={`${contentHub}/${accountID}/${sport.toLowerCase()}/${renderID}`}
          target="_blank"
          rel="noopener noreferrer">
          <Button variant="outline">
            <ExternalLinkIcon size="16" />
          </Button>
        </Link>
        <Link
          href={`${strapiLocation.render}${renderID}`}
          target="_blank"
          rel="noopener noreferrer">
          <Button variant="outline">
            <DatabaseIcon size="16" />
          </Button>
        </Link>
      </div>
      <StatusFlags
        flags={{
          Processing: render?.Processing || false,
          Complete: render?.Complete || false,
          forceRerender: render?.forceRerender || false,
          EmailSent: render?.EmailSent || false,
        }}
      />
    </div>
  );
}
