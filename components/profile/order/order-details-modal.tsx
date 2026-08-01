import { getAbsoluteImageUrl } from "@/lib/utils";
import { Camera, X } from "lucide-react";
import Image from "next/image";
import type { OrderItemApi, OrderListItem } from "./order-types";

const statusConfig: Record<string, { color: string; label: string }> = {
  PAID: {
    color: "text-success-strong",
    label: "Paid",
  },
  FAILED: {
    color: "text-danger-strong",
    label: "Failed",
  },
  PENDING: {
    color: "text-alert-strong",
    label: "Pending",
  },
};

export default function OrderDetailsModal({
  order,
  onClose,
}: {
  order: OrderListItem;
  onClose: () => void;
}) {
  const config = statusConfig[order.status] || { color: "text-text-weak", label: order.status };

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/45 p-4"
      onClick={onClose}
    >
      <div
        className="border-line-weaker relative w-full max-w-2xl rounded-sm border bg-white shadow-[0_24px_60px_rgba(15,23,42,0.28)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="border-line-weaker flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-text-strong text-lg font-semibold">Order Details #{order.orderNo}</h2>
          <button
            onClick={onClose}
            className="hover:bg-fill-hover text-text-weak rounded-full p-1 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[70vh] space-y-6 overflow-y-auto px-6 py-5">
          <div className="space-y-4">
            <h3 className="text-text-weak text-sm font-semibold tracking-wide uppercase">
              Items ({order.items.length})
            </h3>
            <div className="grid gap-3">
              {order.items.map((item: OrderItemApi) => (
                <div
                  key={item.id}
                  className="border-line-weaker bg-surface-muted-100 flex items-center gap-4 rounded-sm border p-3"
                >
                  <Image
                    src={getAbsoluteImageUrl(item.photo.imageUrl)}
                    alt={item.photo.location.name}
                    width={80}
                    height={80}
                    className="h-16 w-16 rounded-sm object-cover"
                  />
                  <div className="flex-1">
                    <p className="text-text-strong text-sm font-medium">
                      {item.photo.location.name}
                    </p>
                    <p className="text-text-weak mt-1 flex items-center gap-1 text-xs">
                      <Camera size={12} /> {item.photo.photographer.name}
                    </p>
                  </div>
                  <div className="text-brand-default font-bold">${item?.price?.toFixed(2)}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-line-weaker space-y-3 border-t pt-4">
            <div className="flex items-center justify-between text-sm">
              <p className="text-text-weak">Status</p>
              <p className={`font-medium ${config.color}`}>{config.label}</p>
            </div>
            <div className="flex items-center justify-between text-sm">
              <p className="text-text-weak">Placed On</p>
              <p className="text-text-strong">{order.placedOn}</p>
            </div>
            <div className="border-line-weaker flex items-center justify-between border-t pt-4 text-lg font-bold">
              <p className="text-text-strong">Total Amount</p>
              <p className="text-brand-default">${order.price.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
