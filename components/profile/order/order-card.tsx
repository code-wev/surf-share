import Image from "next/image";
import { formatPrice } from "./order-model";
import type { OrderListItem } from "./order-types";

export default function OrderCard({
  order,
  onClick,
}: {
  order: OrderListItem;
  onClick: () => void;
}) {
  return (
    <div
      className="flex cursor-pointer flex-col overflow-hidden rounded-md border border-(--color-line-weaker) bg-(--color-fill-hover) sm:flex-row"
      onClick={onClick}
    >
      <div className="relative h-48 w-full sm:h-auto sm:w-60">
        <Image
          src={order.imageSrc}
          alt={order.title}
          fill
          sizes="(max-width: 640px) 100vw, 240px"
          className="object-cover"
        />
      </div>

      <div className="flex flex-1 flex-col justify-between px-4 py-4 sm:flex-row sm:items-center sm:px-6">
        <div className="space-y-1">
          <h2 className="text-[18px] font-medium text-(--color-text-strong)">
            {order.title} |{" "}
            <span className="text-[16px] text-(--color-text-weak)">{order.location}</span>
          </h2>
          <p className="text-sm text-(--color-text-weak)">
            Order #{order.orderNo} • Placed on {order.placedOn}
          </p>
        </div>

        <div className="mt-4 flex items-center justify-between sm:mt-0 sm:flex-col sm:items-end sm:gap-1">
          <p className="text-xl font-semibold text-(--color-text-strong)">
            {formatPrice(order.price)}
          </p>
          <span
            className={`rounded-sm px-2 py-1 text-xs font-medium ${
              order.status === "Completed"
                ? "bg-[#EAF8EE] text-[#2AA65C]"
                : order.status === "Cancelled"
                  ? "bg-[#FDE7E7] text-[#D85B5B]"
                  : "bg-[#FEF9C3] text-[#CA8A04]"
            }`}
          >
            {order.status}
          </span>
        </div>
      </div>
    </div>
  );
}
