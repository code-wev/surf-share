"use client";

import { apiClient } from "@/lib/api/client";
import { getAbsoluteImageUrl } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Building,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock,
  Loader2,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

type PayoutStatus = "PENDING" | "MANUAL_SUCCESS" | "AUTOMATED_SUCCESS";

type PayoutItem = {
  id: string;
  photoId: string;
  photoTitle: string;
  photoUrl: string;
  earnedAmount: number;
  payoutStatus: PayoutStatus;
  soldAt: string;
  photographer: {
    id: string;
    name: string;
    email: string;
    manualBankDetails: string | null;
  };
};

type FilterStatus = "PENDING" | "ALL" | "MANUAL_SUCCESS" | "AUTOMATED_SUCCESS";

const FILTER_OPTIONS: { label: string; value: FilterStatus }[] = [
  { label: "All Statuses", value: "ALL" },
  { label: "Pending", value: "PENDING" },
  { label: "Paid Manually", value: "MANUAL_SUCCESS" },
  { label: "Paid via PayPal", value: "AUTOMATED_SUCCESS" },
];

export default function PayoutsContent() {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<FilterStatus>("PENDING");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const filterDropdownRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterDropdownRef.current &&
        !filterDropdownRef.current.contains(event.target as Node)
      ) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-payouts", selectedStatus, debouncedSearch],
    queryFn: async () => {
      const params: Record<string, string> = {};
      if (selectedStatus !== "ALL") {
        params.status = selectedStatus;
      }
      if (debouncedSearch.trim()) {
        params.search = debouncedSearch.trim();
      }
      const response = await apiClient.get("/payouts", { params });
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
      queryClient.invalidateQueries({ queryKey: ["admin-payouts"] });
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to mark items as paid.");
    },
  });

  const payouts = (data?.data || []) as PayoutItem[];

  // Group payouts by photographer for easier administration
  const groupedPayouts = payouts.reduce(
    (acc, item) => {
      if (!acc[item.photographer.id]) {
        acc[item.photographer.id] = {
          photographer: item.photographer,
          items: [],
          totalOwed: 0,
          totalPaid: 0,
        };
      }
      acc[item.photographer.id].items.push(item);
      if (item.payoutStatus === "PENDING") {
        acc[item.photographer.id].totalOwed += item.earnedAmount;
      } else {
        acc[item.photographer.id].totalPaid += item.earnedAmount;
      }
      return acc;
    },
    {} as Record<
      string,
      {
        photographer: PayoutItem["photographer"];
        items: PayoutItem[];
        totalOwed: number;
        totalPaid: number;
      }
    >,
  );

  const toggleSelectAll = (photographerId: string) => {
    const pendingItemIds = groupedPayouts[photographerId].items
      .filter((i) => i.payoutStatus === "PENDING")
      .map((i) => i.id);

    if (pendingItemIds.length === 0) return;

    const allSelected = pendingItemIds.every((id) => selectedItems.includes(id));

    if (allSelected) {
      setSelectedItems(selectedItems.filter((id) => !pendingItemIds.includes(id)));
    } else {
      const newSelected = [...selectedItems];
      pendingItemIds.forEach((id) => {
        if (!newSelected.includes(id)) newSelected.push(id);
      });
      setSelectedItems(newSelected);
    }
  };

  const toggleItem = (id: string, isPending: boolean) => {
    if (!isPending) return;
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((i) => i !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const handleMarkPaid = () => {
    if (selectedItems.length === 0) return;
    setShowConfirmModal(true);
  };

  const executeMarkPaid = () => {
    setShowConfirmModal(false);
    markPaidMutation.mutate(selectedItems);
  };

  const renderStatusBadge = (status: PayoutStatus) => {
    switch (status) {
      case "AUTOMATED_SUCCESS":
        return (
          <span className="inline-flex items-center gap-1 rounded-sm border border-blue-200 bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
            <CheckCircle2 size={12} /> Paid via PayPal
          </span>
        );
      case "MANUAL_SUCCESS":
        return (
          <span className="inline-flex items-center gap-1 rounded-sm border border-green-200 bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700">
            <CheckCircle2 size={12} /> Paid Manually
          </span>
        );
      case "PENDING":
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-sm border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
            <Clock size={12} /> Pending
          </span>
        );
    }
  };

  return (
    <section className="px-3 pb-5 [font-family:var(--font-sf-pro)] sm:px-4 sm:pb-6 md:px-6 md:pb-8 lg:px-0 lg:pr-10 lg:pb-10 xl:pr-12.5 xl:pb-12.5">
      <div className="mx-auto flex w-full max-w-5xl flex-col">
        {/* Header */}
        <div className="border-brand-default flex flex-col gap-4 border-b pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-brand-default text-xl font-medium sm:text-2xl">
              Payouts Ledger
            </h1>
            <p className="text-text-weak mt-1 text-xs sm:text-sm">
              Review and manage photographer payouts, verify bank details, and record manual payments.
            </p>
          </div>
          <button
            onClick={handleMarkPaid}
            disabled={selectedItems.length === 0 || markPaidMutation.isPending}
            className="flex items-center justify-center gap-2 rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white transition-opacity hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {markPaidMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <CheckCircle2 className="h-4 w-4" />
            )}
            Mark {selectedItems.length} Selected as Paid
          </button>
        </div>

        {/* Top Controls: Search box and Filter button */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search
              size={15}
              className="text-text-weak pointer-events-none absolute top-1/2 left-3 -translate-y-1/2"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search photographer, email, photo..."
              className="border-line-weaker bg-white text-text-strong placeholder:text-text-weaker focus:border-brand-default focus:ring-brand-default/20 h-9 w-full rounded-md border pl-9 pr-8 text-xs focus:ring-2 focus:outline-none"
            />
            {searchQuery ? (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="text-text-weak hover:text-text-strong absolute top-1/2 right-2.5 -translate-y-1/2 cursor-pointer"
              >
                <X size={14} />
              </button>
            ) : null}
          </div>

          <div className="relative w-full sm:w-auto" ref={filterDropdownRef}>
            <button
              type="button"
              onClick={() => setIsFilterOpen((prev) => !prev)}
              className="border-line-weaker bg-white text-text-strong hover:bg-fill-hover inline-flex h-9 w-full items-center justify-between gap-2 rounded-md border px-3 text-xs font-medium transition-colors sm:w-auto cursor-pointer"
            >
              <span className="flex items-center gap-1.5">
                <SlidersHorizontal size={14} className="text-text-weak" />
                Status:{" "}
                <span className="font-semibold text-brand-default">
                  {FILTER_OPTIONS.find((f) => f.value === selectedStatus)?.label || "Pending"}
                </span>
              </span>
              <ChevronDown size={14} className="text-text-weak" />
            </button>

            {isFilterOpen && (
              <div className="border-line-weaker bg-white absolute right-0 z-30 mt-1 w-48 overflow-hidden rounded-md border shadow-[0_10px_28px_rgba(15,23,42,0.12)]">
                <div className="border-line-weaker border-b px-3 py-2 text-[11px] font-semibold tracking-wider text-text-weak uppercase">
                  Filter by Payout Status
                </div>
                <ul className="py-1">
                  {FILTER_OPTIONS.map((opt) => (
                    <li key={opt.value}>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedStatus(opt.value);
                          setSelectedItems([]);
                          setIsFilterOpen(false);
                        }}
                        className={`flex w-full items-center justify-between px-3 py-2 text-left text-xs transition-colors cursor-pointer ${
                          selectedStatus === opt.value
                            ? "bg-fill-disable font-medium text-brand-default"
                            : "text-text-strong hover:bg-fill-hover"
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span
                            className={`h-2 w-2 rounded-full ${
                              opt.value === "PENDING"
                                ? "bg-amber-500"
                                : opt.value === "MANUAL_SUCCESS"
                                ? "bg-emerald-500"
                                : opt.value === "AUTOMATED_SUCCESS"
                                ? "bg-blue-500"
                                : "bg-gray-400"
                            }`}
                          />
                          {opt.label}
                        </span>
                        {selectedStatus === opt.value ? (
                          <Check size={13} className="text-brand-default" />
                        ) : null}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Content list */}
        <div className="mt-6">
          {isLoading ? (
            <div className="text-text-weak py-20 text-center">Loading payouts...</div>
          ) : isError ? (
            <div className="py-20 text-center text-red-500">Failed to load payouts.</div>
          ) : Object.keys(groupedPayouts).length === 0 ? (
            <div className="rounded-md border border-dashed border-gray-200 bg-gray-50 py-16 text-center">
              <p className="text-sm text-gray-500">
                {selectedStatus === "PENDING" && !debouncedSearch
                  ? "All caught up! There are no pending payouts."
                  : "No payout records found matching your filters."}
              </p>
              {(debouncedSearch || selectedStatus !== "PENDING") && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedStatus("PENDING");
                    setSelectedItems([]);
                  }}
                  className="text-brand-default mt-3 text-xs font-medium hover:underline cursor-pointer"
                >
                  Reset filters
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-8">
              {Object.values(groupedPayouts).map((group) => {
                const pendingItems = group.items.filter((i) => i.payoutStatus === "PENDING");
                const allPendingSelected =
                  pendingItems.length > 0 &&
                  pendingItems.every((i) => selectedItems.includes(i.id));

                return (
                  <div
                    key={group.photographer.id}
                    className="border-line-weaker overflow-hidden rounded-lg border bg-white shadow-sm"
                  >
                    <div className="border-line-weaker border-b bg-gray-50 p-4 sm:p-5">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <h3 className="text-text-strong text-lg font-semibold">
                            {group.photographer.name}
                          </h3>
                          <p className="text-text-weak text-sm">{group.photographer.email}</p>
                        </div>
                        <div className="flex flex-col sm:items-end">
                          {group.totalOwed > 0 ? (
                            <>
                              <span className="text-text-weak block text-xs sm:text-sm">
                                Total Pending
                              </span>
                              <span className="text-2xl font-bold text-amber-600">
                                ${group.totalOwed.toFixed(2)}
                              </span>
                            </>
                          ) : (
                            <>
                              <span className="text-text-weak block text-xs sm:text-sm">
                                Total Paid
                              </span>
                              <span className="text-2xl font-bold text-emerald-600">
                                ${group.totalPaid.toFixed(2)}
                              </span>
                            </>
                          )}
                          {group.totalOwed > 0 && group.totalPaid > 0 && (
                            <span className="text-text-weaker mt-0.5 text-xs">
                              Paid to date: ${group.totalPaid.toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="mt-4 rounded-md border border-amber-200 bg-amber-50 p-4">
                        <div className="mb-2 flex items-center justify-between">
                          <h4 className="flex items-center gap-2 text-sm font-semibold text-amber-800">
                            <Building size={16} /> Manual Bank Details provided by user:
                          </h4>
                          {group.photographer.manualBankDetails && (
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText(
                                  group.photographer.manualBankDetails || "",
                                );
                                toast.success("Bank details copied to clipboard!");
                              }}
                              className="inline-flex items-center gap-1 rounded border border-amber-300 bg-white px-2 py-1 text-xs font-medium text-amber-900 transition-colors hover:bg-amber-100/50 cursor-pointer"
                            >
                              Copy Bank Details
                            </button>
                          )}
                        </div>
                        {group.photographer.manualBankDetails ? (
                          <pre className="rounded border border-amber-200/50 bg-amber-100/50 p-3 font-mono text-sm whitespace-pre-wrap text-amber-900">
                            {group.photographer.manualBankDetails}
                          </pre>
                        ) : (
                          <p className="text-sm text-amber-700 italic">
                            No bank details provided. You must contact the user.
                          </p>
                        )}
                      </div>
                    </div>

                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="border-line-weaker text-text-weak border-b bg-white">
                          <th className="w-12 px-4 py-3 text-center">
                            {pendingItems.length > 0 ? (
                              <input
                                type="checkbox"
                                checked={allPendingSelected}
                                onChange={() => toggleSelectAll(group.photographer.id)}
                                className="text-brand-default focus:ring-brand-default h-4 w-4 rounded border-gray-300 cursor-pointer"
                                title="Select all pending"
                              />
                            ) : (
                              <span className="text-text-weaker text-xs">-</span>
                            )}
                          </th>
                          <th className="px-4 py-3 font-medium">Photo</th>
                          <th className="px-4 py-3 font-medium">Status</th>
                          <th className="px-4 py-3 font-medium">Sale Date</th>
                          <th className="px-4 py-3 text-right font-medium">Owed Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-line-weaker divide-y">
                        {group.items.map((item) => {
                          const isPending = item.payoutStatus === "PENDING";
                          const isSelected = selectedItems.includes(item.id);

                          return (
                            <tr
                              key={item.id}
                              className={`transition-colors ${
                                isSelected
                                  ? "bg-blue-50/50"
                                  : isPending
                                  ? "hover:bg-gray-50"
                                  : "bg-gray-50/30 hover:bg-gray-50/60"
                              }`}
                            >
                              <td className="px-4 py-3 text-center">
                                {isPending ? (
                                  <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={() => toggleItem(item.id, true)}
                                    className="text-brand-default focus:ring-brand-default h-4 w-4 rounded border-gray-300 cursor-pointer"
                                  />
                                ) : (
                                  <span
                                    className="text-emerald-600 inline-flex items-center justify-center"
                                    title="Already Paid"
                                  >
                                    <CheckCircle2 size={15} />
                                  </span>
                                )}
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-3">
                                  <Image
                                    src={getAbsoluteImageUrl(item.photoUrl)}
                                    alt={item.photoTitle}
                                    width={48}
                                    height={32}
                                    className="h-8 w-12 rounded border border-gray-200 object-cover"
                                    unoptimized
                                  />
                                  <span className="text-text-strong font-medium">
                                    {item.photoTitle}
                                  </span>
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                {renderStatusBadge(item.payoutStatus)}
                              </td>
                              <td className="text-text-weak px-4 py-3">
                                {new Date(item.soldAt).toLocaleString()}
                              </td>
                              <td className="text-text-strong px-4 py-3 text-right font-semibold">
                                ${item.earnedAmount.toFixed(2)}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Confirmation modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h2 className="mb-2 text-xl font-bold text-gray-900">Confirm Manual Payout</h2>
            <p className="mb-6 text-sm text-gray-600">
              You are about to mark <strong>{selectedItems.length} items</strong> as Paid. Please
              confirm that you have successfully wired the funds to the photographer&apos;s bank
              account. This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="focus:ring-brand-default/20 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:ring-2 focus:outline-none cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={executeMarkPaid}
                className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700 focus:ring-2 focus:ring-green-500/20 focus:outline-none cursor-pointer"
              >
                Confirm &amp; Mark as Paid
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
