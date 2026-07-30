"use client";

import { useState } from "react";
import { Crown, CheckCircle2, Loader2, Edit3 } from "lucide-react";
import { useSubscriptionsQuery } from "@/hooks/api/useSubscriptions";
import type { ISubscriptionConfig } from "@/lib/api/services/subscriptions.service";
import EditSubscriptionModal from "./edit-subscription-modal";

export default function DashboardSubscriptionContent() {
  const { data: response, isLoading, isError } = useSubscriptionsQuery();
  const [editingTier, setEditingTier] = useState<ISubscriptionConfig | null>(null);

  const configs = response?.data || [];

  return (
    <section className="px-3 pb-5 sm:px-4 sm:pb-6 md:px-6 md:pb-8 lg:px-0 lg:pr-10 lg:pb-10 xl:pr-12.5 xl:pb-12.5 [font-family:var(--font-sf-pro)]">
      <div className="mx-auto w-full max-w-6xl">
        <h1 className="inline-flex border-b border-[#0a2463] pb-1 text-base font-medium text-[#0a2463] sm:text-lg">
          Subscription Settings
        </h1>

        <p className="mt-4 text-sm text-gray-500 max-w-2xl leading-relaxed">
          Manage the economic limits and capabilities of the platform. Changes made here instantly alter the revenue split for new checkouts and control photographer upload boundaries.
        </p>

        {isLoading ? (
          <div className="mt-12 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-[#0a2463]" />
          </div>
        ) : isError ? (
          <div className="mt-12 flex items-center justify-center text-red-500">
            Failed to load subscription configurations.
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {configs.map((config) => (
              <div
                key={config.id}
                className="relative flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md"
              >
                <div className="flex items-center justify-between border-b border-gray-100 bg-[#EFF6FF] px-5 py-4">
                  <div className="flex items-center gap-2">
                    <Crown className="h-5 w-5 text-[#0a2463]" />
                    <h2 className="text-lg font-bold text-gray-900 tracking-tight">
                      {config.tier}
                    </h2>
                  </div>
                  <button
                    onClick={() => setEditingTier(config)}
                    className="inline-flex items-center gap-1 rounded-sm bg-white border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
                  >
                    <Edit3 className="h-3 w-3" /> Edit
                  </button>
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <div className="mb-6 rounded-lg bg-gray-50 p-4 border border-gray-100">
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Revenue Split
                    </p>
                    <div className="mt-2 flex items-baseline gap-1">
                      <span className="text-3xl font-extrabold text-[#0a2463]">
                        {config.photographerSplit}%
                      </span>
                      <span className="text-sm font-medium text-gray-500">Photographer</span>
                    </div>
                    <div className="mt-1 text-sm font-medium text-gray-500">
                      {config.platformSplit}% Platform Fee
                    </div>
                  </div>

                  <ul className="space-y-4">
                    <li className="flex items-start gap-3 text-sm">
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-[#2db36e]" />
                      <span className="text-gray-700">
                        Max Photo Price: <strong>{config.maxPrice === null ? "Unlimited" : `A$${config.maxPrice.toFixed(2)}`}</strong>
                      </span>
                    </li>
                    <li className="flex items-start gap-3 text-sm">
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-[#2db36e]" />
                      <span className="text-gray-700">
                        Daily Uploads: <strong>{config.dailyUploadLimit === null ? "Unlimited" : config.dailyUploadLimit}</strong>
                      </span>
                    </li>
                    <li className="flex items-start gap-3 text-sm">
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-[#2db36e]" />
                      <span className="text-gray-700">
                        Auto-Approval: <strong>{config.requiresApproval ? "No (Moderated)" : "Yes (Instant live)"}</strong>
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {editingTier && (
        <EditSubscriptionModal
          config={editingTier}
          onClose={() => setEditingTier(null)}
        />
      )}
    </section>
  );
}
