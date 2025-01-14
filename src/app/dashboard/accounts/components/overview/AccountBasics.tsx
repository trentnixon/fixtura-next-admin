// TODO: Add Association Basics

import { Button } from "@/components/ui/button";
import { Account } from "@/types";
import Link from "next/link";

export default function AccountBasics({ account }: { account: Account }) {
  return (
    <section>
      <Button variant="outline">
        <Link
          target="_blank"
          href={`https://fixtura-backend.herokuapp.com/admin/content-manager/collection-types/api::account.account/${account?.id}`}>
          View of Strapi
        </Link>
      </Button>

      <p>
        <strong>Account Holder:</strong> {account?.attributes.FirstName}
      </p>
      <p>
        <strong>Delivery Address:</strong> {account?.attributes.DeliveryAddress}
      </p>
    </section>
  );
}
