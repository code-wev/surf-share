"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { useMemo, useState, useEffect } from "react";

import CartOrderSummary from "@/components/cart/cart-order-summary";
import { formatPrice, type CartLineItem } from "@/components/cart/cart-model";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { PageTitle } from "../shared/page-title";
import { useCartStore } from "@/store/cart.store";
import { useCreateCheckoutSessionMutation } from "@/hooks/api/useCheckout";

export default function CartContent() {
  const { items, removeItems } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const createSessionMutation = useCreateCheckoutSessionMutation();

  // Avoid hydration mismatch for Zustand persistence
  useEffect(() => {
    setTimeout(() => setMounted(true), 0);
  }, []);

  const [selectedIds, setSelectedIds] = useState<string[]>(() =>
    items.length > 0 ? [String(items[0].id)] : [],
  );

  const selectedCartItems = useMemo(
    () => items.filter((item) => selectedIds.includes(String(item.id))),
    [items, selectedIds],
  );

  const isAllSelected = items.length > 0 && selectedIds.length === items.length;

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
      return;
    }

    setSelectedIds(items.map((item) => item.id));
  };

  const toggleItem = (itemId: string) => {
    setSelectedIds((previousIds) => {
      if (previousIds.includes(itemId)) {
        return previousIds.filter((selectedId) => selectedId !== itemId);
      }

      return [...previousIds, itemId];
    });
  };

  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) {
      return;
    }

    removeItems(selectedIds);
    setSelectedIds([]);
  };

  const handleProceed = () => {
    if (selectedCartItems.length === 0 || createSessionMutation.isPending) {
      return;
    }

    // Direct Stripe integration! Pass selected IDs directly to backend
    const photoIds = selectedCartItems.map((item) => String(item.id));
    createSessionMutation.mutate(photoIds);
  };

  if (!mounted) return null;

  // We map state items slightly to fit the CartLineItem UI requirements (adding imageSrc property)
  const mappedSelectedCartItems = selectedCartItems.map((item) => ({
    ...item,
    imageSrc: item.imageUrl,
    detailsHref: `/gallery/${item.id}`,
  })) as CartLineItem[];

  return (
    <section className="py-8 sm:py-10 lg:py-25">
      <Container className="max-w-480 lg:px-15">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.6fr)]">
          {/* Left Side */}
          <div>
            {/* Upper Section */}
            <div className="mb-3 flex items-center justify-between border-b border-(--color-line-weaker) pb-2">
              <label className="inline-flex cursor-pointer items-center gap-2 text-xs text-(--color-text-weak) sm:text-sm">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={toggleSelectAll}
                  className="h-4 w-4 rounded border border-(--color-line-weak)"
                />
                <span>Select All ({items.length} Items)</span>
              </label>

              <button
                type="button"
                onClick={handleDeleteSelected}
                className="inline-flex items-center gap-1 text-xs text-(--color-danger-strong) hover:opacity-80 sm:text-sm"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </button>
            </div>
            {/* Cart Items */}
            <div className="space-y-3">
              {items.length === 0 ? (
                <div className="rounded-md border border-(--color-line-weaker) bg-(--color-surface-base) p-6 text-center text-(--color-text-weak)">
                  Your cart is empty.
                </div>
              ) : (
                items.map((item) => (
                  <article
                    key={item.id}
                    className="rounded-md border border-(--color-line-weaker) bg-(--color-surface-base) p-3 sm:p-4"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(String(item.id))}
                          onChange={() => toggleItem(String(item.id))}
                          className="h-4 w-4 rounded border border-(--color-line-weak)"
                        />

                        <Image
                          src={item.imageUrl}
                          alt={item.title}
                          width={120}
                          height={120}
                          className="h-20 w-24 rounded-sm object-cover sm:h-24 sm:w-24"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div className="mt-2">
                            <PageTitle
                              title={item.title}
                              subtitle={item.location}
                              titleClassName="text-lg! md:text-[32px]! text-(--color-text-strong)"
                              subtitleClassName="text-sm! text-(--color-text-weak) -mt-4"
                            />
                          </div>

                          <p className="text-4xl leading-none font-semibold text-(--color-text-brand-strong)">
                            {formatPrice(item.price)}
                          </p>
                        </div>

                        <div className="mt-3 flex justify-end">
                          <Link href={`/gallery/${item.id}`} className="block">
                            <Button className="h-8 bg-(--color-fill-brand-strong) px-5 text-xs text-(--color-text-inverse-strong) hover:opacity-95">
                              View Details
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </article>
                ))
              )}
            </div>
          </div>
          {/* Right Side Order Summary */}
          <CartOrderSummary
            mode="checkout"
            items={mappedSelectedCartItems}
            proceedDisabled={mappedSelectedCartItems.length === 0 || createSessionMutation.isPending}
            onProceed={handleProceed}
          />
        </div>
      </Container>
    </section>
  );
}
