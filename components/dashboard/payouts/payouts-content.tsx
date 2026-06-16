"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { getAbsoluteImageUrl } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Building, CheckCircle2 } from "lucide-react";

type PayoutItem = {
  id: string;
  photoId: string;
  photoTitle: string;
  photoUrl: string;
  earnedAmount: number;
  soldAt: string;
  photographer: {
    id: string;
    name: string;
    email: string;
    manualBankDetails: string | null;
  };
};

export default function PayoutsContent() {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-pending-payouts"],
    queryFn: async () => {
      const response = await apiClient.get("/payouts/pending");
      return response.data;
    },
  });

  const markPaidMutation = useMutation({
    mutationFn: async (itemIds: string[]) => {
      const response = await apiClient.patch("/payouts/mark-paid", { itemIds });
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Successfully marked items as paid!");
      setSelectedItems([]);
      queryClient.invalidateQueries({ queryKey: ["admin-pending-payouts"] });
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to mark items as paid.");
    },
  });

  const payouts = (data?.data || []) as PayoutItem[];

  // Group payouts by photographer for easier administration
  const groupedPayouts = payouts.reduce((acc, item) => {
    if (!acc[item.photographer.id]) {
      acc[item.photographer.id] = {
        photographer: item.photographer,
        items: [],
        totalOwed: 0,
      };
    }
    acc[item.photographer.id].items.push(item);
    acc[item.photographer.id].totalOwed += item.earnedAmount;
    return acc;
  }, {} as Record<string, { photographer: PayoutItem["photographer"]; items: PayoutItem[]; totalOwed: number }>);

  const toggleSelectAll = (photographerId: string) => {
    const groupItems = groupedPayouts[photographerId].items.map((i) => i.id);
    const allSelected = groupItems.every((id) => selectedItems.includes(id));
    
    if (allSelected) {
      setSelectedItems(selectedItems.filter((id) => !groupItems.includes(id)));
    } else {
      const newSelected = [...selectedItems];
      groupItems.forEach((id) => {
        if (!newSelected.includes(id)) newSelected.push(id);
      });
      setSelectedItems(newSelected);
    }
  };

  const toggleItem = (id: string) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((i) => i !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const handleMarkPaid = () => {
    if (selectedItems.length === 0) return;
    if (confirm(`Are you sure you want to mark ${selectedItems.length} items as paid?`)) {
      markPaidMutation.mutate(selectedItems);
    }
  };

  return (
    <section className="px-3 pb-5 [font-family:var(--font-sf-pro)] sm:px-4 sm:pb-6 md:px-6 md:pb-8 lg:px-0 lg:pr-10 lg:pb-10 xl:pr-12.5 xl:pb-12.5">
      <div className="mx-auto w-full max-w-5xl flex flex-col">
        <div className="flex items-center justify-between border-b border-brand-default pb-4">
          <h1 className="text-xl font-medium text-brand-default sm:text-2xl">
            Pending Manual Payouts
          </h1>
          <button
            onClick={handleMarkPaid}
            disabled={selectedItems.length === 0 || markPaidMutation.isPending}
            className="flex items-center gap-2 rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white transition-opacity hover:bg-green-700 disabled:opacity-50"
          >
            {markPaidMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
            Mark {selectedItems.length} Selected as Paid
          </button>
        </div>

        <div className="mt-6">
          <p className="text-sm text-text-weak mb-8">
            This ledger displays all photo sales belonging to photographers who have not connected a Stripe account. You must manually transfer funds to the bank accounts listed below, then select the items and mark them as Paid to clear the ledger.
          </p>

          {isLoading ? (
            <div className="py-20 text-center text-text-weak">Loading pending payouts...</div>
          ) : isError ? (
            <div className="py-20 text-center text-red-500">Failed to load payouts.</div>
          ) : Object.keys(groupedPayouts).length === 0 ? (
            <div className="rounded-md border border-dashed border-gray-200 bg-gray-50 py-20 text-center">
              <p className="text-sm text-gray-500">All caught up! There are no pending manual payouts.</p>
            </div>
          ) : (
            <div className="space-y-8">
              {Object.values(groupedPayouts).map((group) => (
                <div key={group.photographer.id} className="overflow-hidden rounded-lg border border-line-weaker bg-white shadow-sm">
                  <div className="border-b border-line-weaker bg-gray-50 p-4 sm:p-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-text-strong">{group.photographer.name}</h3>
                        <p className="text-sm text-text-weak">{group.photographer.email}</p>
                      </div>
                      <div className="text-left sm:text-right">
                        <span className="block text-sm text-text-weak">Total Owed</span>
                        <span className="text-2xl font-bold text-green-600">${group.totalOwed.toFixed(2)}</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 rounded-md border border-amber-200 bg-amber-50 p-4">
                      <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-amber-800">
                        <Building size={16} /> Manual Bank Details provided by user:
                      </h4>
                      {group.photographer.manualBankDetails ? (
                        <pre className="whitespace-pre-wrap text-sm text-amber-900 font-mono bg-amber-100/50 p-3 rounded border border-amber-200/50">
                          {group.photographer.manualBankDetails}
                        </pre>
                      ) : (
                        <p className="text-sm text-amber-700 italic">No bank details provided. You must contact the user.</p>
                      )}
                    </div>
                  </div>

                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-line-weaker bg-white text-text-weak">
                        <th className="px-4 py-3 w-12 text-center">
                          <input 
                            type="checkbox" 
                            checked={group.items.every(i => selectedItems.includes(i.id))}
                            onChange={() => toggleSelectAll(group.photographer.id)}
                            className="h-4 w-4 rounded border-gray-300 text-brand-default focus:ring-brand-default"
                          />
                        </th>
                        <th className="px-4 py-3 font-medium">Photo</th>
                        <th className="px-4 py-3 font-medium">Sale Date</th>
                        <th className="px-4 py-3 font-medium text-right">Owed Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-line-weaker">
                      {group.items.map((item) => (
                        <tr key={item.id} className={`transition-colors ${selectedItems.includes(item.id) ? 'bg-blue-50/50' : 'hover:bg-gray-50'}`}>
                          <td className="px-4 py-3 text-center">
                            <input 
                              type="checkbox" 
                              checked={selectedItems.includes(item.id)}
                              onChange={() => toggleItem(item.id)}
                              className="h-4 w-4 rounded border-gray-300 text-brand-default focus:ring-brand-default"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <Image
                                src={getAbsoluteImageUrl(item.photoUrl)}
                                alt={item.photoTitle}
                                width={48}
                                height={32}
                                className="h-8 w-12 rounded object-cover border border-gray-200"
                                unoptimized
                              />
                              <span className="font-medium text-text-strong">{item.photoTitle}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-text-weak">
                            {new Date(item.soldAt).toLocaleString()}
                          </td>
                          <td className="px-4 py-3 text-right font-semibold text-text-strong">
                            ${item.earnedAmount.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
