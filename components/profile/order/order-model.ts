export type OrderLineItem = {
  id: string | number;
  title: string;
  location: string;
  imageSrc: string;
  price: number;
  detailsHref: string;
  orderNo?: string;
  placedOn?: string;
  imageQuantity?: number;
  status?: "Ordered" | "Completed" | "Cancelled";
};

export const defaultOrderItems: OrderLineItem[] = [
  {
    id: 1,
    title: "Saad Rayhan",
    location: "Teahupo'o, Tahiti",
    imageSrc: "/home/latest/latest2.jpg",
    price: 19.99,
    detailsHref: "/gallery/2-clouds-above-ocean",
    orderNo: "CRDF5814",
    placedOn: "Aug 23, 2024",
    imageQuantity: 1,
    status: "Cancelled",
  },
  {
    id: 2,
    title: "Ishrat Jahan Rintu",
    location: "Teahupo'o, Tahiti",
    imageSrc: "/home/latest/latest7.jpg",
    price: 49.99,
    detailsHref: "/gallery/7-hand-touching-ocean-surface",
    orderNo: "CRDF5111",
    placedOn: "Jun 23, 2025",
    imageQuantity: 1,
    status: "Completed",
  },
  {
    id: 3,
    title: "Syed Rakib Hasan",
    location: "Teahupo'o, Tahiti",
    imageSrc: "/home/latest/latest4.jpg",
    price: 8.99,
    detailsHref: "/gallery/4-deep-blue-wave-closeup",
    orderNo: "CRDF3324",
    placedOn: "Aug 29, 2025",
    imageQuantity: 1,
    status: "Ordered",
  },
  {
    id: 4,
    title: "Faysal Ahmed Patwary",
    location: "Teahupo'o, Tahiti",
    imageSrc: "/home/latest/latest9.jpg",
    price: 10.99,
    detailsHref: "/gallery/9-morning-sky-with-blue-tones",
    orderNo: "CRDF3904",
    placedOn: "April 17, 2026",
    imageQuantity: 1,
    status: "Ordered",
  },
];

export function normalizeOrderItems(items: OrderLineItem[]) {
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
