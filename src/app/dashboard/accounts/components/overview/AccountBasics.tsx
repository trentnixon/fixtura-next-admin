// TODO: Add Association Basics

import { Bold, P } from "@/components/type/type";
import { Button } from "@/components/ui/button";
import { Account } from "@/types";
import Link from "next/link";

export default function AccountBasics({ account }: { account: Account }) {
  return (
    <section>
      <P>
        <Bold>Account Holder:</Bold> {account?.attributes.FirstName}
      </P>
      <P>
        <Bold>Delivery Address:</Bold> {account?.attributes.DeliveryAddress}
      </P>
      <Button variant="outline">
        <Link
          target="_blank"
          href={`https://fixtura-backend.herokuapp.com/admin/content-manager/collection-types/api::account.account/${account?.id}`}>
          View in Strapi
        </Link>
      </Button>
    </section>
  );
}
