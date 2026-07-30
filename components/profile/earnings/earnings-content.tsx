"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { getAbsoluteImageUrl } from "@/lib/utils";
import Image from "next/image";
import { CheckCircle2, Clock } from "lucide-react";

type EarningsItem = {
  id: string;
  photoId: string;
  photoUrl: string;
  photoTitle: string;
  earnedAmount: number;
  payoutStatus: "PENDING" | "AUTOMATED_SUCCESS" | "MANUAL_SUCCESS";
  soldAt: string;
};

export default function EarningsContent() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["earnings-ledger"],
    queryFn: async () => {
      const response = await apiClient.get("/sales/earnings");
      return response.data;
    },
  });

  const earnings = (data?.data || []) as EarningsItem[];

  const renderStatusBadge = (status: EarningsItem["payoutStatus"]) => {
    switch (status) {
      case "AUTOMATED_SUCCESS":
        return (
          <span className="inline-flex items-center gap-1 rounded-sm bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
            <CheckCircle2 size={12} /> Paid via PayPal
          </span>
        );
      case "MANUAL_SUCCESS":
        return (
          <span className="inline-flex items-center gap-1 rounded-sm bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
            <CheckCircle2 size={12} /> Paid Manually
          </span>
        );
      case "PENDING":
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-sm bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700">
            <Clock size={12} /> Pending Manual Payment
          </span>
        );
    }
  };

  return (
    <div className="h-full px-4 py-4 sm:px-6 sm:py-6 md:px-0 md:py-0 [font-family:var(--font-sf-pro)]">
      <section className="flex h-full flex-col">
        <h1 className="text-text-brand-strong inline-flex w-fit border-b-2 border-[#0C3173] pb-2.5 text-lg font-semibold md:text-[18px] md:leading-tight">
          Earnings Ledger
        </h1>

        <div className="mt-4 sm:mt-6 md:mt-8">
          <p className="text-sm text-text-weak mb-6">
            Track the payout status of every photo you sell. If you connect your PayPal account in settings, future payouts will automatically process instantly.
          </p>

          {isLoading ? (
            <div className="py-20 text-center text-sm text-text-weak">Loading ledger...</div>
          ) : isError ? (
            <div className="py-20 text-center text-sm text-red-500">Failed to load earnings.</div>
          ) : earnings.length === 0 ? (
            <div className="rounded-md border border-dashed border-gray-200 bg-gray-50 py-20 text-center">
              <p className="text-sm text-gray-500">You haven&apos;t made any sales yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-md border border-line-weaker bg-white shadow-sm">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-line-weaker bg-gray-50">
                    <th className="px-4 py-3 font-medium text-text-strong">Photo</th>
                    <th className="px-4 py-3 font-medium text-text-strong">Title</th>
                    <th className="px-4 py-3 font-medium text-text-strong">Date Sold</th>
                    <th className="px-4 py-3 font-medium text-text-strong">Royalty Earned</th>
                    <th className="px-4 py-3 font-medium text-text-strong">Payout Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line-weaker">
                  {earnings.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50/50">
                      <td className="px-4 py-3">
                        <Image
                          src={getAbsoluteImageUrl(item.photoUrl)}
                          alt={item.photoTitle}
                          width={48}
                          height={32}
                          className="h-8 w-12 rounded object-cover border border-gray-200"
                          unoptimized
                        />
                      </td>
                      <td className="px-4 py-3 text-text-strong font-medium">
                        {item.photoTitle}
                      </td>
                      <td className="px-4 py-3 text-text-weak">
                        {new Date(item.soldAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 font-semibold text-text-strong">
                        A${item.earnedAmount.toFixed(2)}
                      </td>
                      <td className="px-4 py-3">
                        {renderStatusBadge(item.payoutStatus)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
