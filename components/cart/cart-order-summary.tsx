import Image from "next/image";

import { Button } from "@/components/ui/button";

import { checkoutTaxRate, formatPrice, type CartLineItem } from "@/components/cart/cart-model";

type CartOrderSummaryProps = {
  mode: "cart" | "checkout";
  items: CartLineItem[];
  onProceed: () => void;
  proceedDisabled?: boolean;
};

export default function CartOrderSummary({
  mode,
  items,
  onProceed,
  proceedDisabled = false,
}: CartOrderSummaryProps) {
  const subtotal = items.reduce((total, item) => total + item.price, 0);
  const tax = mode === "checkout" ? subtotal * checkoutTaxRate : 0;
  const total = subtotal + tax;

  return (
    <aside className="h-fit rounded-[4px] bg-(--color-fill-brand-strong) p-4 text-(--color-text-inverse-strong) sm:p-5 xl:sticky xl:top-24">
      <h2 className="text-[28px] font-medium tracking-tight">
        {mode === "checkout" ? "Purchase Summary" : "Order Summary"}
      </h2>

      <div className="mt-2 h-px bg-white/40" />

      <div className="mt-9 space-y-3">
        {items.length === 0 ? (
          <p className="text-sm text-white/80">No selected items yet.</p>
        ) : (
          items.map((item) => (
            <div key={`summary-${item.id}`} className="mt-9 flex items-center gap-3">
              <Image
                src={item.imageSrc}
                alt={item.title}
                width={64}
                height={64}
                className="h-11 w-11 rounded-sm object-cover"
              />

              <div className="min-w-0 flex-1">
                <p className="truncate text-xl text-(--color-text-inverse-strong)">{item.title}</p>
                <p className="truncate text-xs text-(--color-text-inverse-weak)">{item.location}</p>
              </div>

              <p className="text-2xl text-(--color-text-inverse-strong)">
                {formatPrice(item.price)}
              </p>
            </div>
          ))
        )}
      </div>

      <div className="mt-5 space-y-1.5 text-sm text-white/85">
        <div className="flex items-center justify-between">
          <span className="text-base">Subtotal</span>
          <span className="text-sm">{formatPrice(subtotal)}</span>
        </div>

        {mode === "checkout" ? (
          <div className="flex items-center justify-between">
            <span>Tax(10%)</span>
            <span>{formatPrice(tax)}</span>
          </div>
        ) : null}
      </div>

      <div className="mt-2.5 flex items-end justify-between">
        <p className="text-[22px] font-semibold text-(--color-text-inverse-strong)">Total</p>
        <p className="text-[32px] leading-none font-semibold text-(--color-text-inverse-strong)">
          {formatPrice(total)}
        </p>
      </div>

      <Button
        className="mt-16 h-10 w-full cursor-pointer bg-(--color-fill-inverse-strong) text-(--color-fill-brand-strong) hover:opacity-95"
        disabled={proceedDisabled}
        onClick={onProceed}
      >
        Proceed To Checkout ({items.length})
      </Button>

      {mode === "checkout" ? (
        <div className="mt-5 text-center">
          <p className="text-xs text-white/85">100% secure and encrypted payment.</p>
          <p className="mt-1 text-xs text-white/85">Accepted payment methods</p>
          <div className="mx-auto mt-2 w-fit rounded-sm bg-white px-2 py-1 text-[11px] font-semibold text-[#003087]">
            PayPal
          </div>
        </div>
      ) : null}
    </aside>
  );
}
