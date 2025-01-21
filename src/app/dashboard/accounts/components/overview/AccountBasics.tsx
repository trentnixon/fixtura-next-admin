// TODO: Add Association Basics

import { useGlobalContext } from "@/components/providers/GlobalContext";
import { H4, Label } from "@/components/type/titles";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Account } from "@/types";
import { Mail } from "lucide-react";
import Link from "next/link";

export default function AccountBasics({ account }: { account: Account }) {
  const { strapiLocation } = useGlobalContext();

  return (
    <Card className="w-full shadow-none bg-slate-50 border-b-4 border-b-emerald-500">
      <CardHeader>
        <CardTitle>Account Information</CardTitle>
        <CardDescription>Details about the account holder</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex items-center space-x-4">
          <Mail className="h-5 w-5 text-gray-500" />
          <div className="flex flex-col items-start justify-center">
            <H4 className="leading-none">
              {account?.attributes.DeliveryAddress}
            </H4>
            <Label className=" font-normal my-0 text-gray-500 ">
              Account Holder
            </Label>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Mail className="h-5 w-5 text-gray-500" />
          <div className="flex flex-col">
            <H4 className="leading-none">
              {account?.attributes.DeliveryAddress}
            </H4>
            <Label className=" font-normal my-0 text-gray-500">
              Delivery Address
            </Label>
          </div>
        </div>

        <Button variant="outline">
          <Link
            target="_blank"
            href={`${strapiLocation.account}${account?.id}`}>
            Go To Account
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

{
  /* <section>
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
</section> */
}
