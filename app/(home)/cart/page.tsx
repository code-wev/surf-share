import CartBanner from "@/components/cart/cart-banner";
import CartContent from "@/components/cart/cart-content";

export default function CartPage() {
  return (
    <>
      <CartBanner step="cart" />
      <CartContent />
    </>
  );
}
