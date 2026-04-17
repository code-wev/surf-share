import { ShoppingCart, WalletMinimal } from "lucide-react";

import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";

type CartBannerProps = {
  step?: "cart" | "checkout";
};

export default function CartBanner({ step = "cart" }: CartBannerProps) {
  const cartActive = true;
  const checkoutActive = step === "checkout";

  return (
    <section className="bg-[#d9e7fa]">
      <Container className="max-w-480 py-10 md:py-25">
        <div className="mx-auto flex w-fit items-center gap-3 sm:gap-5">
          <div className="flex flex-col items-center gap-1.5">
            <div
              className={cn(
                "inline-flex h-12 w-12 items-center justify-center rounded-lg border",
                cartActive
                  ? "border-(--color-line-brand-strong) bg-(--color-fill-brand-strong) text-(--color-text-inverse-strong)"
                  : "border-(--color-line-weaker) bg-white/75 text-(--color-text-weaker)",
              )}
            >
              <ShoppingCart className="h-6 w-6" />
            </div>
            <span
              className={cn(
                "text-sm font-semibold",
                cartActive ? "text-(--color-text-strong)" : "text-(--color-text-weaker)",
              )}
            >
              Cart
            </span>
          </div>

          <div
            className={cn(
              "mb-5 h-1 w-16 sm:w-20",
              checkoutActive ? "bg-(--color-fill-brand-strong)" : "bg-(--color-line-brand-strong)",
            )}
          />

          <div className="flex flex-col items-center gap-1.5">
            <div
              className={cn(
                "inline-flex h-12 w-12 items-center justify-center rounded-lg border",
                checkoutActive
                  ? "border-(--color-line-brand-strong) bg-(--color-fill-brand-strong) text-(--color-text-inverse-strong)"
                  : "border-(--color-line-weaker) bg-white/75 text-(--color-text-weaker)",
              )}
            >
              <WalletMinimal className="h-6 w-6" />
            </div>
            <span
              className={cn(
                "text-sm font-semibold",
                checkoutActive ? "text-(--color-text-strong)" : "text-(--color-text-weaker)",
              )}
            >
              Checkout
            </span>
          </div>
        </div>
      </Container>
    </section>
  );
}
