"use client";

import { OrderDetail } from "@/types/orderDetail";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/utils/chart-formatters";

interface OrderScheduleCardProps {
  schedule: OrderDetail["schedule"];
  subscriptionTier: OrderDetail["subscriptionTier"];
}

export default function OrderScheduleCard({
  schedule,
  subscriptionTier,
}: OrderScheduleCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Schedule</CardTitle>
        <CardDescription>
          Stripe expiry, fixtures, and order windows.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3 text-sm">
        <div>
          <p className="text-muted-foreground">Subscription</p>
          <p className="font-medium">{subscriptionTier.name ?? "—"}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {subscriptionTier.billingInterval ?? "Billing n/a"}
          </p>
        </div>
        <div>
          <p className="text-muted-foreground">Fixture window</p>
          <p className="font-medium">
            {[formatDate(schedule.fixtureStart), formatDate(schedule.fixtureEnd)]
              .filter(Boolean)
              .join(" → ") || "—"}
          </p>
        </div>
        <div>
          <p className="text-muted-foreground">Stripe expires</p>
          <p className="font-medium">
            {formatDate(schedule.stripeExpiresAt)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

