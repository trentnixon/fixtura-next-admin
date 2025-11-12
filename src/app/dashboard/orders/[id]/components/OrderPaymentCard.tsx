"use client";

import { OrderDetail } from "@/types/orderDetail";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface OrderPaymentCardProps {
  payment: OrderDetail["payment"];
}

export default function OrderPaymentCard({ payment }: OrderPaymentCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Payment information
        </CardTitle>
        <CardDescription>
          Stripe invoice and checkout session details.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div>
          <p className="text-muted-foreground">Payment status</p>
          <p className="font-medium">{payment.status ?? "—"}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Payment channel</p>
          <p className="font-medium">
            {payment.channel
              ? payment.channel.charAt(0).toUpperCase() +
                payment.channel.slice(1)
              : "—"}
          </p>
        </div>
        <div>
          <p className="text-muted-foreground">Payment method</p>
          <p className="font-medium">{payment.method ?? "—"}</p>
          {payment.methodTypes && (
            <p className="text-xs text-muted-foreground">
              {payment.methodTypes}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <p className="text-muted-foreground">Invoice</p>
          <div className="space-y-1">
            {payment.invoice?.id && (
              <div>
                <p className="text-xs text-muted-foreground">Invoice ID</p>
                <p className="font-medium font-mono text-sm">
                  {payment.invoice.id}
                </p>
              </div>
            )}
            <div>
              <p className="text-xs text-muted-foreground">Invoice Number</p>
              <p className="font-medium">{payment.invoice?.number ?? "—"}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {payment.hostedInvoiceUrl && (
              <Button variant="outline" size="sm" asChild>
                <a
                  href={payment.hostedInvoiceUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  View Hosted Invoice
                </a>
              </Button>
            )}
            {payment.invoicePdf && (
              <Button variant="outline" size="sm" asChild>
                <a href={payment.invoicePdf} target="_blank" rel="noreferrer">
                  Download PDF
                </a>
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
