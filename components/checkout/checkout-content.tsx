"use client";

import { ShieldCheck, WalletCards } from "lucide-react";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import CartOrderSummary from "@/components/cart/cart-order-summary";
import {
  defaultCartItems,
  normalizeCartItems,
  parseSelectedItemIds,
  type CartLineItem,
  type CheckoutCustomer,
} from "@/components/cart/cart-model";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Input } from "@/components/ui/input";

type CheckoutContentProps = {
  items?: CartLineItem[];
  onSubmit?: (payload: { customer: CheckoutCustomer; items: CartLineItem[] }) => void;
};

export default function CheckoutContent({
  items = defaultCartItems,
  onSubmit,
}: CheckoutContentProps) {
  const searchParams = useSearchParams();

  const normalizedItems = useMemo(() => normalizeCartItems(items), [items]);
  const requestedIds = useMemo(
    () => parseSelectedItemIds(searchParams.get("items")),
    [searchParams],
  );

  const checkoutItems = useMemo(() => {
    if (requestedIds.length === 0) {
      return normalizedItems.slice(0, Math.min(2, normalizedItems.length));
    }

    const requestedIdSet = new Set(requestedIds);
    const matchedItems = normalizedItems.filter((item) => requestedIdSet.has(String(item.id)));

    if (matchedItems.length > 0) {
      return matchedItems;
    }

    return normalizedItems.slice(0, Math.min(2, normalizedItems.length));
  }, [normalizedItems, requestedIds]);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("+880");

  const handleSubmit = () => {
    if (!onSubmit) {
      return;
    }

    onSubmit({
      customer: {
        fullName,
        email,
        phone,
      },
      items: checkoutItems,
    });
  };

  return (
    <section className="bg-(--color-surface-muted-50) py-8 sm:py-10 lg:py-12">
      <Container className="max-w-480 lg:px-15">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.6fr)]">
          <div className="space-y-5">
            <section className="rounded-md border border-(--color-line-weaker) bg-(--color-surface-base) p-4 sm:p-5">
              <h2 className="text-[34px] font-semibold tracking-tight text-(--color-text-strong)">
                Purchase Details
              </h2>

              <div className="mt-4 space-y-3">
                <label className="block text-sm font-medium text-(--color-text-weak)">
                  Full name
                  <Input
                    className="mt-1"
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                  />
                </label>

                <label className="block text-sm font-medium text-(--color-text-weak)">
                  Email
                  <Input
                    type="email"
                    className="mt-1"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                </label>

                <label className="block text-sm font-medium text-(--color-text-weak)">
                  Phone
                  <Input
                    className="mt-1"
                    placeholder="+880"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                  />
                </label>
              </div>
            </section>

            <section className="rounded-md bg-(--color-fill-weak) p-4 sm:p-5">
              <h3 className="text-[34px] font-semibold tracking-tight text-(--color-text-strong)">
                Payment Method
              </h3>

              <p className="mt-5 text-center text-sm font-medium text-(--color-text-strong)">
                Pay securely with PayPal
              </p>

              <Button className="mt-3 h-9 w-full bg-(--color-fill-brand-strong) text-(--color-text-inverse-strong) hover:opacity-95">
                <WalletCards className="h-4 w-4" />
                Pay with PayPal
              </Button>

              <div className="mt-4 flex items-start gap-2 rounded-md border border-green-200 bg-green-50 p-3 text-green-700">
                <ShieldCheck className="mt-0.5 h-4 w-4" />
                <div>
                  <p className="text-sm font-medium">Your payment is protected by PayPal</p>
                  <p className="text-xs">256 bit-SSL encryption</p>
                </div>
              </div>
            </section>
          </div>

          <CartOrderSummary
            mode="checkout"
            items={checkoutItems}
            proceedDisabled={checkoutItems.length === 0}
            onProceed={handleSubmit}
          />
        </div>
      </Container>
    </section>
  );
}
