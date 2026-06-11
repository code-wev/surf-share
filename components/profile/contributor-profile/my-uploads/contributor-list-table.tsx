import Image from "next/image";
import { Check, Clock3, Eye, Pencil, Trash2, X, Loader2 } from "lucide-react";

import { type UploadStatus } from "./my-upload-data";

export type ContributorListTableRow = {
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
};

type ContributorListTableProps<T extends ContributorListTableRow> = {
  rows: T[];
  onViewDetails: (row: T) => void;
  onEdit: (row: T) => void;
  onDelete: (row: T) => void;
};

export default function ContributorListTable<T extends ContributorListTableRow>({
  rows,
  onViewDetails,
  onEdit,
  onDelete,
}: ContributorListTableProps<T>) {
  const statusStyleMap: Record<UploadStatus, string> = {
    approved: "bg-[#EAF9EF] text-[#22C55E]",
    rejected: "bg-[#FCEBEC] text-[#F87171]",
    pending: "bg-[#FFF7E9] text-[#F59E0B]",
    processing: "bg-blue-50 text-blue-500",
  };

  const statusIconMap: Record<UploadStatus, any> = {
    approved: Check,
    rejected: X,
    pending: Clock3,
    processing: Loader2,
  };

  const statusLabelMap: Record<UploadStatus, string> = {
    approved: "Approved",
    rejected: "Rejected",
    pending: "Pending",
    processing: "Processing...",
  };

  return (
    <div className="border-line-weaker bg-surface-muted-100 mt-5 overflow-x-auto border">
      <table className="text-text-weak w-full min-w-280 border-collapse text-left text-sm xl:min-w-0">
        <thead>
          <tr className="border-line-weaker text-text-strong border-b bg-[#F8FAFC] text-xs font-semibold">
            <th className="px-2 py-2.5">Photo</th>
            <th className="px-2 py-2.5">Name</th>
            <th className="px-2 py-2.5">Location</th>
            <th className="px-2 py-2.5">Date</th>
            <th className="px-2 py-2.5">Price</th>
            <th className="px-2 py-2.5">Status</th>
            <th className="px-2 py-2.5">Action</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((item) => {
            const StatusIcon = statusIconMap[item.status];

            return (
              <tr key={item.id} className="border-line-weaker border-b last:border-b-0">
                <td className="px-2 py-2">
                  {item.status === "processing" ? (
                    <div className="flex h-9 w-14 items-center justify-center rounded-xs bg-gray-100 border border-gray-200">
                      <Loader2 className="h-4 w-4 animate-spin text-brand-default" />
                    </div>
                  ) : (
                    <Image
                      src={item.photoUrl}
                      alt={item.name}
                      width={56}
                      height={36}
                      className="h-9 w-14 rounded-xs object-cover"
                    />
                  )}
                </td>

                <td className="text-text-strong px-2 py-2">{item.name}</td>
                <td className="px-2 py-2">{item.location}</td>
                <td className="px-2 py-2">{item.dateLabel}</td>
                <td className="text-text-strong px-2 py-2">{item.priceLabel}</td>

                <td className="px-2 py-2">
                  <span
                    className={`inline-flex items-center gap-1 rounded-sm px-2 py-1 text-xs font-medium ${statusStyleMap[item.status]}`}
                  >
                    <StatusIcon size={12} className={item.status === "processing" ? "animate-spin" : ""} />
                    {statusLabelMap[item.status]}
                  </span>
                </td>

                <td className="px-2 py-2">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => onViewDetails(item)}
                      className="inline-flex cursor-pointer items-center gap-1 text-sm text-[#0EA5E9] hover:underline"
                    >
                      <Eye size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => onEdit(item)}
                      className="text-brand-default inline-flex cursor-pointer items-center gap-1 text-sm hover:underline"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(item)}
                      className="text-danger-strong inline-flex cursor-pointer items-center gap-1 text-sm hover:underline"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
