export type CartLineItem = {
  id: string | number;
  title: string;
  location: string;
  imageSrc: string;
  price: number;
  detailsHref: string;
};

export type CheckoutCustomer = {
  fullName: string;
  email: string;
  phone: string;
};

export const checkoutTaxRate = 0.1;

export const defaultCartItems: CartLineItem[] = [
  {
    id: 1,
    title: "Saad Rayhan",
    location: "Teahupo'o, Tahiti",
    imageSrc: "/home/latest/latest3.jpg",
    price: 19.99,
    detailsHref: "/gallery/1-blue-sky-over-beach",
  },
  {
    id: 2,
    title: "Ishrat Jahan Rintu",
    location: "Teahupo'o, Tahiti",
    imageSrc: "/home/latest/latest7.jpg",
    price: 49.99,
    detailsHref: "/gallery/2-clouds-above-ocean",
  },
  {
    id: 3,
    title: "Syed Rakib Hasan",
    location: "Teahupo'o, Tahiti",
    imageSrc: "/home/latest/latest4.jpg",
    price: 8.99,
    detailsHref: "/gallery/3-golden-cloud-and-sea-horizon",
  },
];

export function normalizeCartItems(items: CartLineItem[]) {
  return items.map((item) => ({
    ...item,
    id: String(item.id),
  }));
}

export function formatPrice(price: number) {
  return `$${price.toFixed(2)}`;
}

export function parseSelectedItemIds(rawValue: string | null) {
  if (!rawValue) {
    return [] as string[];
  }

  return rawValue
    .split(",")
    .map((itemId) => itemId.trim())
    .filter(Boolean);
}
