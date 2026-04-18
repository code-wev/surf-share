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
      <div className="mb-9">
        <h1 className="text-text-brand-strong inline-flex w-fit border-b-2 border-[#0C3173] pb-2.5 text-lg font-semibold md:text-[18px] md:leading-tight">
          All Orders
        </h1>
      </div>

      {/* Tabs */}
      <div className="border-line-weaker mb-6 flex border-b">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-sm font-medium transition-colors ${
              activeTab === tab
                ? "border-text-brand-strong text-text-brand-strong border-b-2"
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
          <div className="rounded-md border border-(--color-line-weaker) bg-(--color-surface-base) p-6 text-center text-(--color-text-weak)">
            Your Order List is empty.
          </div>
        ) : (
          filteredItems.map((item) => (
            <article
              key={item.id}
              className="rounded-md border border-(--color-line-weaker) bg-(--color-surface-base) p-3 sm:p-4"
            >
              {/* Order Part */}
              <div className="mb-3 flex flex-row justify-between">
                <div className="flex items-center justify-center gap-x-5">
                  <PageTitle
                    title={`Order #${item.orderNo || "N/A"}`}
                    subtitle={`Placed on ${item.placedOn || "N/A"}`}
                    titleClassName="text-[22px]! text-(--color-text-strong) font-medium!"
                    subtitleClassName="text-sm! text-(--color-text-weak) -mt-2"
                  />
                  <p
                    className={`-mt-2 inline-flex items-start gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium ${getStatusConfig(item.status).bg} ${getStatusConfig(item.status).text}`}
                  >
                    {renderStatusIcon(item.status)}
                    {item.status || "N/A"}
                  </p>
                </div>
                <div>
                  <PageTitle
                    align="end"
                    title={formatPrice(item.price)}
                    subtitle={`${item.imageQuantity || "0"} Photos`}
                    titleClassName="text-2xl! text-(--color-text-brand-strong) font-medium!"
                    subtitleClassName="text-sm! text-(--color-text-weak) -mt-2"
                  />
                </div>
              </div>
              {/* Details Part */}
              <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                <div className="flex items-center gap-3">
                  <Image
                    src={item.imageSrc}
                    alt={item.title}
                    width={69}
                    height={69}
                    className="h-17 w-14 rounded-sm object-cover"
                  />
                  <PageTitle
                    title={item.title}
                    subtitle={item.location}
                    titleClassName="text-[22px]! text-(--color-text-strong) font-medium!"
                    subtitleClassName="text-sm! text-(--color-text-weak) -mt-2"
                  />
                </div>

                <div className="min-w-0">
                  <p className="text-sm leading-none font-semibold text-(--color-text-strong)">
                    {formatPrice(item.price)}
                  </p>
                </div>
              </div>

              <div className="mt-3 flex justify-end">
                <Link href={item.detailsHref} className="block">
                  <Button className="h-8 bg-(--color-fill-brand-strong) px-5 text-xs text-(--color-text-inverse-strong) hover:opacity-95">
                    View Details
                  </Button>
                </Link>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
