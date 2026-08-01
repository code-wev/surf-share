"use client";

import { apiClient } from "@/lib/api/client";
import { getAbsoluteImageUrl } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, Clock } from "lucide-react";
import Image from "next/image";

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
    <div className="h-full px-4 py-4 [font-family:var(--font-sf-pro)] sm:px-6 sm:py-6 md:px-0 md:py-0">
      <section className="flex h-full flex-col">
        <h1 className="text-text-brand-strong inline-flex w-fit border-b-2 border-[#0C3173] pb-2.5 text-lg font-semibold md:text-[18px] md:leading-tight">
          Earnings Ledger
        </h1>

        <div className="mt-4 sm:mt-6 md:mt-8">
          <p className="text-text-weak mb-6 text-sm">
            Track the payout status of every photo you sell. If you connect your PayPal account in
            settings, future payouts will automatically process instantly.
          </p>

          {isLoading ? (
            <div className="text-text-weak py-20 text-center text-sm">Loading ledger...</div>
          ) : isError ? (
            <div className="py-20 text-center text-sm text-red-500">Failed to load earnings.</div>
          ) : earnings.length === 0 ? (
            <div className="rounded-md border border-dashed border-gray-200 bg-gray-50 py-20 text-center">
              <p className="text-sm text-gray-500">You haven&apos;t made any sales yet.</p>
            </div>
          ) : (
            <div className="border-line-weaker overflow-x-auto rounded-md border bg-white shadow-sm">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-line-weaker border-b bg-gray-50">
                    <th className="text-text-strong px-4 py-3 font-medium">Photo</th>
                    <th className="text-text-strong px-4 py-3 font-medium">Title</th>
                    <th className="text-text-strong px-4 py-3 font-medium">Date Sold</th>
                    <th className="text-text-strong px-4 py-3 font-medium">Royalty Earned</th>
                    <th className="text-text-strong px-4 py-3 font-medium">Payout Status</th>
                  </tr>
                </thead>
                <tbody className="divide-line-weaker divide-y">
                  {earnings.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50/50">
                      <td className="px-4 py-3">
                        <Image
                          src={getAbsoluteImageUrl(item.photoUrl)}
                          alt={item.photoTitle}
                          width={48}
                          height={32}
                          className="h-8 w-12 rounded border border-gray-200 object-cover"
                          unoptimized
                        />
                      </td>
                      <td className="text-text-strong px-4 py-3 font-medium">{item.photoTitle}</td>
                      <td className="text-text-weak px-4 py-3">
                        {new Date(item.soldAt).toLocaleDateString()}
                      </td>
                      <td className="text-text-strong px-4 py-3 font-semibold">
                        ${item.earnedAmount.toFixed(2)}
                      </td>
                      <td className="px-4 py-3">{renderStatusBadge(item.payoutStatus)}</td>
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
