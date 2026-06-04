export interface Photo {
  id?: string;
  imageUrl: string;
  location: {
    id?: string;
    name: string;
  };
  photographer: {
    id?: string;
    name: string;
  };
}

export interface OrderItemApi {
  id?: string;
  photo: Photo;
  price?: number;
}

export interface OrderApi {
  id: string;
  items: OrderItemApi[];
  totalAmount: number;
  createdAt: string;
  status: "PENDING" | "PAID" | "FAILED" | string;
}

export type OrderStatus = "PENDING" | "PAID" | "FAILED" | string;

export interface OrderListItem {
  id: string;
  title: string;
  location: string;
  imageSrc: string;
  price: number;
  detailsHref: string;
  orderNo: string;
  placedOn: string;
  imageQuantity: number;
  status: OrderStatus;
  items: OrderItemApi[];
}
