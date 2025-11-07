// TODO: Add Association Basics

import { useGlobalContext } from "@/components/providers/GlobalContext";
import { H4, Label } from "@/components/type/titles";
import { Button } from "@/components/ui/button";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import ElementContainer from "@/components/scaffolding/containers/ElementContainer";
import { fixturaContentHubAccountDetails } from "@/types/fixturaContentHubAccountDetails";
import { Mail } from "lucide-react";
import Link from "next/link";

export default function AccountBasics({
  account,
}: {
  account: fixturaContentHubAccountDetails;
}) {
  const { strapiLocation } = useGlobalContext();

  return (
    <SectionContainer
      title="Account Information"
      description="Details about the account holder"
      variant="default"
    >
      <ElementContainer variant="light" padding="md">
        <div className="grid gap-4">
          <div className="flex items-center space-x-4">
            <Mail className="h-5 w-5 text-muted-foreground" />
            <div className="flex flex-col items-start justify-center space-y-1">
              <H4 className="leading-none m-0">{account.DeliveryAddress}</H4>
              <Label className="font-normal m-0 text-muted-foreground">
                Account Holder
              </Label>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Mail className="h-5 w-5 text-muted-foreground" />
            <div className="flex flex-col space-y-1">
              <H4 className="leading-none m-0">{account.DeliveryAddress}</H4>
              <Label className="font-normal m-0 text-muted-foreground">
                Delivery Address
              </Label>
            </div>
          </div>

          <Button variant="primary" asChild>
            <Link
              target="_blank"
              href={`${strapiLocation.account}${account?.id}`}
            >
              Go To Account
            </Link>
          </Button>
        </div>
      </ElementContainer>
    </SectionContainer>
  );
}
