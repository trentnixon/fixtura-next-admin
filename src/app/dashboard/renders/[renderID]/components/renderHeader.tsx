// create a render header component that displays the render details
"use client";
import { DatabaseIcon } from "lucide-react";
import { Label } from "@/components/type/titles";
import { ByLine } from "@/components/type/titles";
import { Title } from "@/components/type/titles";
import { Button } from "@/components/ui/button";
import { ExternalLinkIcon } from "lucide-react";
import StatusFlags from "./StatusFlags";
import { useGlobalContext } from "@/components/providers/GlobalContext";
import { useParams } from "next/navigation";

import Link from "next/link";
import { useRendersQuery } from "@/hooks/renders/useRendersQuery";
import DeleteRenderButton from "../../../accounts/components/actions/button_delete_Render";
import { useGetAccountDetailsFromRenderId } from "@/hooks/renders/useGetAccountDetailsFromRenderId";

export default function RenderHeader() {
  const { Domain, strapiLocation } = useGlobalContext();
  const { contentHub } = Domain;
  const { renderID } = useParams();

  // Fetch data
  const { data: render } = useRendersQuery(renderID as string);

  const { data: accountDetails } = useGetAccountDetailsFromRenderId(
    renderID as string
  );

  return (
    <>
      <Title>Render Details</Title>
      <ByLine>
        {render?.Name} - {renderID}
      </ByLine>

      {/* Links */}
      <div className="flex justify-end gap-2 items-center">
        <Label>Actions</Label>

        <Link
          href={`${contentHub}/${
            accountDetails?.account?.id
          }/${accountDetails?.account?.Sport.toLowerCase()}/${renderID}`}
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
        <DeleteRenderButton />
      </div>
      <StatusFlags
        flags={{
          Processing: render?.Processing || false,
          Complete: render?.Complete || false,
          forceRerender: render?.forceRerender || false,
          EmailSent: render?.EmailSent || false,
        }}
      />
    </>
  );
}
