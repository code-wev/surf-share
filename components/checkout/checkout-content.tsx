"use client";

import { Loader2, ShieldCheck, WalletMinimal } from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

import CartOrderSummary from "@/components/cart/cart-order-summary";
import type { CartLineItem } from "@/components/cart/cart-model";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Input } from "@/components/ui/input";
import { useCartStore } from "@/store/cart.store";
import { useCreateCheckoutSessionMutation } from "@/hooks/api/useCheckout";

export default function CheckoutContent() {
  const searchParams = useSearchParams();
  const { items } = useCartStore();
  const createSessionMutation = useCreateCheckoutSessionMutation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTimeout(() => setMounted(true), 0);
  }, []);

  const requestedIdsParam = searchParams.get("items");
  
  const checkoutItems = useMemo(() => {
    if (!requestedIdsParam) {
      // Default to all items if no specific items are passed
      return items;
    }
    
    const requestedIds = requestedIdsParam.split(",");
    const requestedIdSet = new Set(requestedIds);
    return items.filter((item) => requestedIdSet.has(String(item.id)));
  }, [items, requestedIdsParam]);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = async () => {
    if (checkoutItems.length === 0 || createSessionMutation.isPending) {
      return;
    }

    const photoIds = checkoutItems.map(item => String(item.id));
    createSessionMutation.mutate(photoIds);
  };

  if (!mounted) return null;

  return (
    <section className="py-8 sm:py-10 lg:py-25">
      <Container className="max-w-480 lg:px-15">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.6fr)]">
          <div className="space-y-5">
            <section className="mb-12">
              <h2 className="flex items-center text-[28px] font-medium tracking-tight text-(--color-text-strong)">
                <WalletMinimal className="mr-2 inline-block h-6 w-6" color="#0C3173" />
                Purchase Details
              </h2>

              <div className="mt-4 space-y-6">
                <label className="block text-base font-medium text-(--color-text-weak)">
                  Full name
                  <Input
                    className="mt-1 placeholder:text-(--color-text-weaker)"
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                  />
                </label>

                <label className="block text-base font-medium text-(--color-text-weak)">
                  Email
                  <Input
                    type="email"
                    className="mt-1 placeholder:text-(--color-text-weaker)"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                </label>

                <label className="block text-base font-medium text-(--color-text-weak)">
                  Phone
                  <Input
                    className="mt-1 placeholder:text-(--color-text-weaker)"
                    placeholder="Enter your phone number"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                  />
                </label>
              </div>
            </section>

            <section className="rounded-md bg-(--color-fill-inverse-weak) p-4 sm:p-5">
              <h3 className="text-[28px] font-medium tracking-tight text-(--color-text-strong)">
                Payment Method
              </h3>

              <p className="mt-12 text-center text-base font-medium text-(--color-text-strong)">
                Pay securely with Stripe
              </p>

              <Button 
                onClick={handleSubmit}
                disabled={createSessionMutation.isPending || checkoutItems.length === 0}
                className="mt-3 h-11 w-full bg-(--color-fill-brand-strong) text-(--color-text-inverse-strong) hover:opacity-95"
              >
                {createSessionMutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                <span className="text-sm">Proceed to Payment</span>
              </Button>

              <div className="mt-12 flex items-center gap-2 rounded-md border border-(--color-line-weaker) bg-green-50 p-3 text-green-500">
                <ShieldCheck className="mt-0.5 h-5 w-5" />
                <div>
                  <p className="text-sm font-medium">Your payment is protected by Stripe</p>
                  <p className="text-xs">PCI-compliant 256-bit SSL encryption</p>
                </div>
              </div>
            </section>
          </div>

          <CartOrderSummary
            mode="checkout"
            items={checkoutItems.map((item) => ({ ...item, imageSrc: item.imageUrl, detailsHref: `/gallery/${item.id}` })) as CartLineItem[]}
            proceedDisabled={checkoutItems.length === 0 || createSessionMutation.isPending}
            onProceed={handleSubmit}
          />
        </div>
      </Container>
    </section>
  );
}
