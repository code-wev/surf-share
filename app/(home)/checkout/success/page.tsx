"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { useCartStore } from "@/store/cart.store";
import { checkoutService } from "@/lib/api/services/checkout.service";

export default function CheckoutSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { clearCart } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const verifyAttempted = useRef(false);

  useEffect(() => {
    setTimeout(() => setMounted(true), 0);
    
    if (sessionId && !verifyAttempted.current) {
      verifyAttempted.current = true;
      
      // Securely ask backend to verify the Stripe session directly
      // This is a bulletproof fallback if local webhooks didn't fire
      checkoutService.verifySession(sessionId)
        .then(() => {
           // On successful verification, wipe the local cart
           clearCart();
        })
        .catch(console.error);
    }
  }, [sessionId, clearCart]);

  const handleContinueExploring = () => {
    router.push("/gallery");
  };

  if (!mounted) return null;

  return (
    <section className="py-15 sm:py-20 lg:py-32">
      <Container className="max-w-2xl text-center">
        <div className="rounded-md border border-(--color-line-weaker) bg-white p-8 sm:p-12 shadow-sm">
          <h1 className="text-5xl font-semibold text-(--color-text-strong)">Thank You!</h1>
          <p className="mt-3 text-xl text-(--color-text-weak)">
            Your payment has been successfully processed.
          </p>

          <div className="mt-10 mx-auto max-w-sm rounded-md bg-green-50 p-4 border border-green-100">
            <p className="text-lg text-(--color-text-weak)">
              Session ID: <br />
              <span className="mt-1 block text-sm font-mono text-(--color-text-brand-strong) break-all">
                {sessionId || "N/A"}
              </span>
            </p>
          </div>

          <p className="mt-8 text-base text-(--color-text-weak)">
            You will receive a confirmation email shortly with your order details and high-resolution photo links.
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
