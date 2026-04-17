import CartBanner from "@/components/cart/cart-banner";
import CheckoutContent from "@/components/checkout/checkout-content";

export default function CheckoutPage() {
  return (
    <>
      <CartBanner step="checkout" />
      <CheckoutContent />
    </>
  );
}
