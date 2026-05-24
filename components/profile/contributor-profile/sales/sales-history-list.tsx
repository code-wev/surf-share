import Image from "next/image";
import { UploadStatus } from "../my-uploads/my-upload-data";
import { getAbsoluteImageUrl } from "@/lib/utils";

export type SaleHistoryTableRow = {
  id: string;
  photoUrl: string;
  name: string;
  location: string;
  dateLabel: string;
  priceLabel: string;
  status: UploadStatus;
  uploadedAt: string;
  priceValue: number;
  photographer: string;
  resolution: string;
  format: string;
  size: string;
  commissionUsd: number;
  totalDownloads: number;
  earningsUsd: number;
};

type SaleHistoryTableProps<T extends SaleHistoryTableRow> = {
  rows: T[];
};

export default function SaleHistoryTable<T extends SaleHistoryTableRow>({
  rows,
}: SaleHistoryTableProps<T>) {
  return (
    <div className="border-line-weaker bg-surface-muted-100 mt-5 overflow-x-auto border">
      <table className="text-text-weak w-full min-w-280 border-collapse text-left text-sm xl:min-w-0">
        <thead>
          <tr className="border-line-weaker text-text-strong border-b bg-[#F8FAFC] text-xs font-semibold">
            <th className="px-2 py-2.5">Photo</th>
            <th className="px-2 py-2.5">Name</th>
            <th className="px-2 py-2.5">Date</th>
            <th className="px-2 py-2.5">Price</th>
            <th className="px-2 py-2.5">Commission</th>
            <th className="px-2 py-2.5">Total downloads</th>
            <th className="px-2 py-2.5">Your Earnings</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((item) => {
            return (
              <tr key={item.id} className="border-line-weaker border-b last:border-b-0">
                <td className="px-2 py-2">
                  <Image
                    src={getAbsoluteImageUrl(item.photoUrl)}
                    alt={item.name}
                    width={56}
                    height={36}
                    className="h-9 w-14 rounded-xs object-cover"
                  />
                </td>

                <td className="text-text-strong px-2 py-2">{item.name}</td>
                <td className="px-2 py-2">{item.dateLabel}</td>
                <td className="text-text-strong px-2 py-2">${item.priceValue.toFixed(2)}</td>
                <td className="text-text-strong px-2 py-2">${item.commissionUsd.toFixed(2)}</td>
                <td className="text-text-strong px-2 py-2">{item.totalDownloads}</td>
                <td className="px-2 py-2 text-(--color-text-brand-strong)">
                  ${item.earningsUsd.toFixed(2)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
