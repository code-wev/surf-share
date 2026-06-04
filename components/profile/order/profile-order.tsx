"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { Clock, Check, X, Loader2, RotateCcw, Trash2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { PageTitle } from "@/components/shared/page-title";
import { getMyOrders, deleteOrder } from "@/src/actions/order.action";
import { checkoutService } from "@/lib/api/services/checkout.service";
import OrderDetailsModal from "./order-details-modal";
import type { OrderApi, OrderListItem } from "./order-types";
import { getAbsoluteImageUrl } from "@/lib/utils";

type TabType = "All Orders" | "PAID" | "PENDING" | "FAILED";

const tabs: { label: string; value: TabType }[] = [
  { label: "All Orders", value: "All Orders" },
  { label: "Completed", value: "PAID" },
  { label: "Pending", value: "PENDING" },
  { label: "Failed", value: "FAILED" },
];

const statusConfig: Record<
  string,
  {
    bg: string;
    text: string;
    icon: React.ComponentType<{ size: number; className: string }>;
    label: string;
  }
> = {
  PAID: {
    bg: "bg-success-disable",
    text: "text-success-strong",
    icon: Check,
    label: "Paid",
  },
  FAILED: {
    bg: "bg-danger-weaker",
    text: "text-danger-strong",
    icon: X,
    label: "Failed",
  },
  PENDING: {
    bg: "bg-alert-disable",
    text: "text-alert-strong",
    icon: Clock,
    label: "Pending",
  },
};

export default function ProfileOrderPage() {
  const [activeTab, setActiveTab] = useState<TabType>("All Orders");
  const [activeOrder, setActiveOrder] = useState<OrderListItem | null>(null);
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery<{ success: boolean; data?: OrderApi[] }, Error>({
    queryKey: ["my-orders"],
    queryFn: getMyOrders,
  });

  const orders = useMemo(() => {
    if (!data?.data) return [] as OrderListItem[];
    return data.data.map(
      (order) =>
        ({
          id: order.id,
          title: order.items[0]?.photo.photographer.name || "Unknown",
          location: order.items[0]?.photo.location.name || "Unknown",
          imageSrc: order.items[0]?.photo.imageUrl
            ? getAbsoluteImageUrl(order.items[0]?.photo.imageUrl)
            : "/default-photo.jpg",
          price: order.totalAmount,
          detailsHref: "#",
          orderNo: order.id.slice(-8).toUpperCase(),
          placedOn: new Date(order.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          }),
          imageQuantity: order.items.length,
          status: order.status,
          items: order.items,
        }) as OrderListItem,
    );
  }, [data]);

  const filteredItems = useMemo(() => {
    if (activeTab === "All Orders") return orders;
    return orders.filter((item) => item.status === activeTab);
  }, [orders, activeTab]);

  const repayMutation = useMutation({
    mutationFn: (orderId: string) => checkoutService.retryPayment(orderId),
    onSuccess: (data) => {
      // The backend returns { success, message, data: { url, sessionId } }
      if (data.data?.url) {
        window.location.href = data.data.url;
      }
    },
    onError: () => {
      toast.error("Failed to initiate repayment.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (orderId: string) => deleteOrder(orderId),
    onSuccess: () => {
      toast.success("Order deleted successfully.");
      queryClient.invalidateQueries({ queryKey: ["my-orders"] });
    },
    onError: () => {
      toast.error("Failed to delete order.");
    },
  });

  const handleRepay = (orderId: string) => {
    repayMutation.mutate(orderId);
  };

  const handleDelete = (orderId: string) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      deleteMutation.mutate(orderId);
    }
  };

  const getStatusConfig = (status?: string) => {
    if (!status) return { bg: "", text: "text-text-weak", icon: null, label: "N/A" };
    return statusConfig[status] || { bg: "", text: "text-text-weak", icon: null, label: status };
  };

  const renderStatusIcon = (status?: string) => {
    const config = getStatusConfig(status);
    if (!config.icon) return null;
    const IconComponent = config.icon;
    return <IconComponent size={16} className="" />;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="text-brand-default h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (isError) {
    return <div className="text-danger-strong py-10 text-center">Failed to load orders.</div>;
  }

  return (
    <section className="">
      {/* Tabs */}
      <div className="border-line-weaker mb-6 flex overflow-x-auto border-b">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`px-3 py-2.5 text-sm font-medium whitespace-nowrap transition-colors sm:px-4 sm:text-sm md:text-base ${
              activeTab === tab.value
                ? "border-text-brand-strong text-text-brand-strong inline-flex w-fit border-b-2 pb-2.5 md:text-lg md:leading-tight"
                : "text-text-weak hover:text-text-strong"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Items */}
      <div className="space-y-3">
        {filteredItems.length === 0 ? (
          <div className="rounded-md border border-(--color-line-weaker) bg-(--color-surface-base) p-4 text-center text-(--color-text-weak) sm:p-6">
            <p className="text-sm sm:text-base">Your Order List is empty.</p>
          </div>
        ) : (
          filteredItems.map((item) => (
            <article
              key={item.id}
              className="rounded-md border border-(--color-line-weaker) bg-(--color-surface-base) p-3 sm:p-4 md:p-5"
            >
              {/* Order Part */}
              <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-x-5">
                  <PageTitle
                    title={`Order #${item.orderNo || "N/A"}`}
                    subtitle={`Placed on ${item.placedOn || "N/A"}`}
                    titleClassName="text-base sm:text-[22px]! text-(--color-text-strong) font-medium!"
                    subtitleClassName="text-xs sm:text-sm! text-(--color-text-weak) -mt-1 sm:-mt-2"
                  />
                  <p
                    className={`inline-flex w-fit items-start gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium ${getStatusConfig(item.status).bg} ${getStatusConfig(item.status).text}`}
                  >
                    {renderStatusIcon(item.status)}
                    {getStatusConfig(item.status).label}
                  </p>
                </div>
                <div>
                  <PageTitle
                    align="start"
                    title={`$${item.price.toFixed(2)}`}
                    subtitle={`${item.imageQuantity || "0"} Photos`}
                    titleClassName="text-lg sm:text-2xl! text-(--color-text-brand-strong) font-medium!"
                    subtitleClassName="text-xs sm:text-sm! text-(--color-text-weak) -mt-1 sm:-mt-2"
                  />
                </div>
              </div>
              {/* Details Part */}
              <div className="flex flex-col gap-3 sm:gap-4">
                <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex w-full items-center gap-3 sm:flex-1">
                    <Image
                      src={item.imageSrc}
                      alt={item.title}
                      width={69}
                      height={69}
                      className="h-16 w-16 shrink-0 rounded-sm object-cover sm:h-17 sm:w-14"
                    />
                    <PageTitle
                      title={item.title}
                      subtitle={item.location}
                      titleClassName="text-base sm:text-[22px]! text-(--color-text-strong) font-medium!"
                      subtitleClassName="text-xs sm:text-sm! text-(--color-text-weak) -mt-1 sm:-mt-2"
                    />
                  </div>

                  <div className="hidden sm:block">
                    <p className="text-sm leading-none font-semibold text-(--color-text-strong)">
                      ${item.price.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
                  <div className="sm:hidden">
                    <p className="text-sm leading-none font-semibold text-(--color-text-strong)">
                      ${item.price.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {item.status !== "PAID" && (
                      <>
                        <Button
                          variant="secondary"
                          onClick={() => handleRepay(item.id)}
                          disabled={repayMutation.isPending}
                          className="text-brand-default border-line-weaker h-8 px-4 text-xs hover:bg-surface-muted-100 sm:h-8"
                        >
                          {repayMutation.isPending && repayMutation.variables === item.id ? (
                            <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                          ) : (
                            <RotateCcw className="mr-1 h-3 w-3" />
                          )}
                          Repay
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={() => handleDelete(item.id)}
                          disabled={deleteMutation.isPending}
                          className="text-danger-strong h-8 px-4 text-xs hover:bg-danger-weaker sm:h-8"
                        >
                          {deleteMutation.isPending && deleteMutation.variables === item.id ? (
                            <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                          ) : (
                            <Trash2 className="mr-1 h-3 w-3" />
                          )}
                          Delete
                        </Button>
                      </>
                    )}
                    <Button
                      onClick={() => setActiveOrder(item)}
                      className="bg-(--color-fill-brand-strong) text-(--color-text-inverse-strong) h-8 w-auto px-5 text-xs hover:opacity-95 sm:h-8"
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            </article>
          ))
        )}
      </div>

      {activeOrder && (
        <OrderDetailsModal order={activeOrder} onClose={() => setActiveOrder(null)} />
      )}
    </section>
  );
}
