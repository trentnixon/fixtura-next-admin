// TODO: Add Association Basics

import { useGlobalContext } from "@/components/providers/GlobalContext";
import { Bold, P } from "@/components/type/type";
import { Button } from "@/components/ui/button";
import { Account } from "@/types";
import Link from "next/link";

export default function AccountBasics({ account }: { account: Account }) {
  const { strapiLocation } = useGlobalContext();

  return (
    <section>
      <P>
        <Bold>Account Holder:</Bold> {account?.attributes.FirstName}
      </P>
      <P>
        <Bold>Delivery Address:</Bold> {account?.attributes.DeliveryAddress}
      </P>
      <Button variant="outline">
        <Link target="_blank" href={`${strapiLocation.account}${account?.id}`}>
          View in Strapi
        </Link>
      </Button>
    </section>
  );
}
