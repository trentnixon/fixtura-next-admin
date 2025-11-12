"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";

import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
import PageContainer from "@/components/scaffolding/containers/PageContainer";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import LoadingState from "@/components/ui-library/states/LoadingState";
import ErrorState from "@/components/ui-library/states/ErrorState";
import EmptyState from "@/components/ui-library/states/EmptyState";
import { useAdminOrderDetail } from "@/hooks/orders/useAdminOrderDetail";
import { useAdminOrderUpdate } from "@/hooks/orders/useAdminOrderUpdate";
import { OrderUpdatePayload } from "@/lib/services/orders/updateAdminOrder";
import OrderEditForm from "./components/OrderEditForm";
import OrderSummaryCard from "./components/OrderSummaryCard";
import OrderScheduleCard from "./components/OrderScheduleCard";
import OrderPaymentCard from "./components/OrderPaymentCard";
import OrderCustomerCard from "./components/OrderCustomerCard";
import RelatedOrdersTable from "./components/RelatedOrdersTable";
import { Button } from "@/components/ui/button";

export default function OrderDetailPage() {
  const params = useParams<{ id: string }>();
  const orderId = useMemo(() => params?.id ?? "", [params]);
  const [isEditMode, setIsEditMode] = useState(false);

  const { data, isLoading, error, refetch, isFetching } =
    useAdminOrderDetail(orderId);
  const { mutate: updateOrder, isPending: isSaving } = useAdminOrderUpdate();

  const pageTitle = orderId ? `Order #${orderId}` : "Order detail";

  const handleSave = async (updates: OrderUpdatePayload) => {
    if (!orderId || !data) return;

    updateOrder(
      {
        id: orderId,
        updates,
      },
      {
        onSuccess: () => {
          setIsEditMode(false);
          toast.success("Order updated successfully", {
            description: `Order #${orderId} has been updated.`,
          });
          // Response contains the updated order, refetch to ensure consistency
          refetch();
        },
        onError: (error) => {
          console.error("Failed to update order:", error);
          toast.error("Failed to update order", {
            description:
              error instanceof Error
                ? error.message
                : "An unexpected error occurred while updating the order. Please try again.",
          });
        },
      }
    );
  };

  const handleCancel = () => {
    setIsEditMode(false);
  };

  return (
    <>
      <CreatePageTitle
        title={pageTitle}
        byLine={
          isEditMode
            ? "Edit order information and settings"
            : "Detailed order information and activity"
        }
        byLineBottom={
          isEditMode
            ? "Update order status, payment details, and flags"
            : "Review payment history, schedules, and sibling orders"
        }
      />
      <PageContainer padding="md" spacing="lg">
        <div className="flex justify-end gap-2 pb-0">
          {isEditMode ? (
            <Button variant="accent" onClick={handleCancel}>
              Cancel
            </Button>
          ) : (
            <>
              <Button variant="accent" asChild>
                <Link href="/dashboard/orders">Back to Invoices</Link>
              </Button>
              <Button
                variant="secondary"
                onClick={() => setIsEditMode(true)}
                disabled={isLoading || !data}
              >
                Edit
              </Button>
            </>
          )}
        </div>
        {isLoading && !data ? (
          <SectionContainer
            title="Order overview"
            description="Core order metadata, payment status, and scheduling details."
          >
            <LoadingState message="Loading order detail…" />
          </SectionContainer>
        ) : error ? (
          <SectionContainer
            title="Order overview"
            description="Core order metadata, payment status, and scheduling details."
          >
            <ErrorState
              variant="card"
              title="Unable to load order detail"
              error={error}
              onRetry={() => refetch()}
            />
          </SectionContainer>
        ) : !data ? (
          <SectionContainer
            title="Order overview"
            description="Core order metadata, payment status, and scheduling details."
          >
            <EmptyState
              variant="card"
              title="Order not found"
              description="The requested order could not be located."
            />
          </SectionContainer>
        ) : isEditMode ? (
          <OrderEditForm
            order={data.order}
            onSave={handleSave}
            onCancel={handleCancel}
            isSaving={isSaving}
          />
        ) : (
          <>
            {isFetching && (
              <LoadingState variant="minimal" message="Refreshing data…" />
            )}

            <div className="grid gap-6">
              <OrderSummaryCard order={data.order} />
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              <OrderScheduleCard
                schedule={data.order.schedule}
                subscriptionTier={data.order.subscriptionTier}
              />
              <OrderPaymentCard payment={data.order.payment} />
              <OrderCustomerCard customer={data.order.customer} />
            </div>
          </>
        )}

        {!isEditMode && data && (
          <SectionContainer
            title="Related orders"
            description="Other orders for the same account, sorted by recency."
          >
            <RelatedOrdersTable relatedOrders={data.relatedOrders} />
          </SectionContainer>
        )}
      </PageContainer>
    </>
  );
}
