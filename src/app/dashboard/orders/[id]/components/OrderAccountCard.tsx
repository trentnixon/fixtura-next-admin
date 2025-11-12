"use client";

import { OrderDetail } from "@/types/orderDetail";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface OrderAccountCardProps {
  account: OrderDetail["account"];
}

export default function OrderAccountCard({ account }: OrderAccountCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Account</CardTitle>
        <CardDescription>
          Account hierarchy associated with this order.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div>
          <p className="text-muted-foreground">Account</p>
          <p className="font-medium">{account.name ?? "—"}</p>
          <p className="text-xs text-muted-foreground">
            {account.accountType ?? ""}
          </p>
        </div>
        <div>
          <p className="text-muted-foreground">Sport</p>
          <p className="font-medium">{account.sport ?? "—"}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Contact</p>
          <p className="font-medium">{account.contact.email ?? "—"}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Clubs</p>
          <p className="font-medium">
            {account.clubs.length > 0
              ? account.clubs.map((club) => club.name ?? "—").join(", ")
              : "—"}
          </p>
        </div>
        <div>
          <p className="text-muted-foreground">Associations</p>
          <p className="font-medium">
            {account.associations.length > 0
              ? account.associations
                  .map((assoc) => assoc.name ?? "—")
                  .join(", ")
              : "—"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

