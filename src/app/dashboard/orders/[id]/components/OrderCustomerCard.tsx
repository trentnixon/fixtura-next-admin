"use client";

import { OrderDetail } from "@/types/orderDetail";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface OrderCustomerCardProps {
  customer: OrderDetail["customer"];
}

export default function OrderCustomerCard({
  customer,
}: OrderCustomerCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Customer</CardTitle>
        <CardDescription>
          Stripe customer information linked to this order.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div>
          <p className="text-muted-foreground">Name</p>
          <p className="font-medium">{customer.name ?? "—"}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Email</p>
          <p className="font-medium">{customer.email ?? "—"}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Stripe customer ID</p>
          <p className="font-medium">{customer.stripeCustomerId ?? "—"}</p>
        </div>
      </CardContent>
    </Card>
  );
}

