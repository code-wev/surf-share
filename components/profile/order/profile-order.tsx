"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Clock, Check, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PageTitle } from "@/components/shared/page-title";
import { defaultOrderItems, formatPrice, normalizeOrderItems, OrderLineItem } from "./order-model";

type TabType = "All Orders" | "Completed" | "Ordered" | "Cancelled";

const tabs: TabType[] = ["All Orders", "Completed", "Ordered", "Cancelled"];

const statusConfig: Record<
  string,
  { bg: string; text: string; icon: React.ComponentType<{ size: number; className: string }> }
> = {
  Completed: {
    bg: "bg-success-disable",
    text: "text-success-strong",
    icon: Check,
  },
  Cancelled: {
    bg: "bg-danger-weaker",
    text: "text-danger-strong",
    icon: X,
  },
  Ordered: {
    bg: "bg-alert-disable",
    text: "text-alert-strong",
    icon: Clock,
  },
};

type CartContentProps = {
  items?: OrderLineItem[];
  onCheckout?: (selectedItems: OrderLineItem[]) => void;
  onDeleteSelected?: (deletedIds: string[]) => void;
};

export default function ProfileOrderPage({ items = defaultOrderItems }: CartContentProps) {
  const [activeTab, setActiveTab] = useState<TabType>("All Orders");
  const initialItems = useMemo(() => normalizeOrderItems(items), [items]);

  const filteredItems = useMemo(() => {
    if (activeTab === "All Orders") return initialItems;
    return initialItems.filter((item) => item.status === activeTab);
  }, [initialItems, activeTab]);

  const getStatusConfig = (status?: string) => {
    if (!status) return { bg: "", text: "text-text-weak", icon: null };
    return statusConfig[status] || { bg: "", text: "text-text-weak", icon: null };
  };

  const renderStatusIcon = (status?: string) => {
    const config = getStatusConfig(status);
    if (!config.icon) return null;
    const IconComponent = config.icon;
    return <IconComponent size={16} className="" />;
  };

  return (
    <section className="">
      {/* Tabs */}
      <div className="border-line-weaker mb-6 flex overflow-x-auto border-b">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-2.5 text-sm font-medium whitespace-nowrap transition-colors sm:px-4 sm:text-sm md:text-base ${
              activeTab === tab
                ? "border-text-brand-strong text-text-brand-strong inline-flex w-fit border-b-2 pb-2.5 md:text-lg md:leading-tight"
                : "text-text-weak hover:text-text-strong"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Cart Items */}
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
                    {item.status || "N/A"}
                  </p>
                </div>
                <div>
                  <PageTitle
                    align="start"
                    title={formatPrice(item.price)}
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
                      {formatPrice(item.price)}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
                  <div className="sm:hidden">
                    <p className="text-sm leading-none font-semibold text-(--color-text-strong)">
                      {formatPrice(item.price)}
                    </p>
                  </div>
                  <Link href={item.detailsHref} className="w-full sm:w-auto">
                    <Button className="h-8 w-full bg-(--color-fill-brand-strong) px-5 text-xs text-(--color-text-inverse-strong) hover:opacity-95 sm:h-8">
                      View Details
                    </Button>
                  </Link>
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
