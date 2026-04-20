"use client";

import { Loader2, ShieldCheck, WalletMinimal } from "lucide-react";
import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

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
import Image from "next/image";

type CheckoutContentProps = {
  items?: CartLineItem[];
  onSubmit?: (payload: {
    customer: CheckoutCustomer;
    items: CartLineItem[];
  }) => void | { orderId?: string } | Promise<void | { orderId?: string }>;
};

type PaymentModalState = "idle" | "processing" | "success";

function delay(milliseconds: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

function generateOrderId() {
  const randomPart = Math.floor(10000 + Math.random() * 90000);
  return `#CRES${randomPart}`;
}

export default function CheckoutContent({
  items = defaultCartItems,
  onSubmit,
}: CheckoutContentProps) {
  const router = useRouter();
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalState, setModalState] = useState<PaymentModalState>("idle");
  const [orderId, setOrderId] = useState("");

  const handleSubmit = async () => {
    if (checkoutItems.length === 0 || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setModalState("processing");

    try {
      const payload = {
        customer: {
          fullName,
          email,
          phone,
        },
        items: checkoutItems,
      };

      let resolvedOrderId = "";

      if (onSubmit) {
        const result = await onSubmit(payload);
        resolvedOrderId = result?.orderId ?? "";
      } else {
        await delay(1600);
      }

      setOrderId(resolvedOrderId || generateOrderId());
      setModalState("success");
    } catch (error) {
      console.error("Failed to process checkout", error);
      setModalState("idle");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContinueExploring = () => {
    setModalState("idle");
    router.push("/gallery");
  };

  return (
    <>
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
                      placeholder="+880"
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
                  Pay securely with PayPal
                </p>

                <Button className="mt-3 h-11 w-full bg-(--color-fill-brand-strong) text-(--color-text-inverse-strong) hover:opacity-95">
                  <Image
                    src="/paypal.png"
                    alt="PayPal"
                    width={20}
                    height={30}
                    className="rounded-xs"
                  />
                  <span className="text-sm">Pay with PayPal</span>
                </Button>

                <div className="mt-12 flex items-center gap-2 rounded-md border border-(--color-line-weaker) bg-green-50 p-3 text-green-500">
                  <ShieldCheck className="mt-0.5 h-5 w-5" />
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
              proceedDisabled={checkoutItems.length === 0 || isSubmitting}
              onProceed={handleSubmit}
            />
          </div>
        </Container>
      </section>

      {modalState === "processing" ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-6">
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Processing payment"
            className="w-full max-w-3xl rounded-md border border-(--color-line-weaker) bg-white p-5 sm:p-8"
          >
            <Loader2 className="h-9 w-9 animate-spin text-(--color-fill-brand-strong)" />
            <h2 className="mt-5 text-4xl leading-tight font-semibold text-(--color-text-strong)">
              Processing Your Payment...
            </h2>
            <p className="mt-3 text-2xl text-(--color-text-weak)">Please wait...</p>
          </div>
        </div>
      ) : null}

      {modalState === "success" ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Payment successful"
            className="w-full max-w-3xl rounded-md border border-(--color-line-weaker) bg-white p-5 sm:p-8"
          >
            <h2 className="text-5xl font-semibold text-(--color-text-strong)">Thank You!</h2>
            <p className="mt-2 text-xl text-(--color-text-weak)">
              Your order has been successfully placed
            </p>

            <div className="mt-8 flex gap-4">
              <div className="mt-2 flex flex-col items-center">
                <span className="h-2.5 w-2.5 rounded-full bg-(--color-fill-brand-strong)" />
                <span className="mt-1 h-9 w-px bg-(--color-line-weak)" />
              </div>

              <div>
                <p className="text-lg text-(--color-text-weak)">
                  Order ID:{" "}
                  <span className="text-lg text-(--color-text-brand-strong)">{orderId}</span>
                </p>
                <p className="mt-4 text-base text-(--color-text-weak)">
                  You will receive a confirmation email shortly with your order details.
                </p>
              </div>
            </div>

            <Button
              className="mt-10 h-11 w-full bg-(--color-fill-brand-strong) text-(--color-text-inverse-strong) hover:opacity-95"
              onClick={handleContinueExploring}
            >
              Continue exploring
            </Button>
          </div>
        </div>
      ) : null}
    </>
  );
}
