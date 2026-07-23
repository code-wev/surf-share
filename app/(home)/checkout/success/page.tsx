"use client";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { useCartStore } from "@/store/cart.store";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function CheckoutSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id") || searchParams.get("session_id");
  const { clearCart } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTimeout(() => setMounted(true), 0);

    // We no longer verify the session here because the capture order is done
    // directly on the cart page before redirecting.
    // We just wipe the cart.
    clearCart();
  }, [orderId, clearCart]);

  const handleContinueExploring = () => {
    router.push("/gallery");
  };

  if (!mounted) return null;

  return (
    <section className="py-15 sm:py-20 lg:py-32">
      <Container className="max-w-2xl text-center">
        <div className="rounded-md border border-(--color-line-weaker) bg-white p-8 shadow-sm sm:p-12">
          <h1 className="text-5xl font-semibold text-(--color-text-strong)">Thank You!</h1>
          <p className="mt-3 text-xl text-(--color-text-weak)">
            Your payment has been successfully processed.
          </p>

          <div className="mx-auto mt-10 max-w-sm rounded-md border border-green-100 bg-green-50 p-4">
            <p className="text-lg text-(--color-text-weak)">
              Order ID: <br />
              <span className="mt-1 block font-mono text-sm break-all text-(--color-text-brand-strong)">
                {orderId || "N/A"}
              </span>
            </p>
          </div>

          <p className="mt-8 text-base text-(--color-text-weak)">
            You will receive a confirmation email shortly with your order details and
            high-resolution photo links.
          </p>

          <Button
            className="mt-10 h-12 w-full max-w-xs bg-(--color-fill-brand-strong) text-base text-(--color-text-inverse-strong) hover:opacity-95"
            onClick={handleContinueExploring}
          >
            Continue Exploring Gallery
          </Button>
        </div>
      </Container>
    </section>
  );
}
