"use client";

import { useEffect, useState } from "react";
import { X, Loader2, DollarSign, Percent, UploadCloud, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { useUpdateSubscriptionMutation } from "@/hooks/api/useSubscriptions";
import type { ISubscriptionConfig } from "@/lib/api/services/subscriptions.service";

type EditSubscriptionModalProps = {
  config: ISubscriptionConfig;
  onClose: () => void;
};

export default function EditSubscriptionModal({ config, onClose }: EditSubscriptionModalProps) {
  const [photographerSplit, setPhotographerSplit] = useState(config.photographerSplit.toString());
  const [platformSplit, setPlatformSplit] = useState(config.platformSplit.toString());
  
  const [maxPrice, setMaxPrice] = useState(config.maxPrice === null ? "" : config.maxPrice.toString());
  const [isUnlimitedPrice, setIsUnlimitedPrice] = useState(config.maxPrice === null);

  const [dailyUploadLimit, setDailyUploadLimit] = useState(config.dailyUploadLimit === null ? "" : config.dailyUploadLimit.toString());
  const [isUnlimitedUploads, setIsUnlimitedUploads] = useState(config.dailyUploadLimit === null);

  const [requiresApproval, setRequiresApproval] = useState(config.requiresApproval);

  const updateMutation = useUpdateSubscriptionMutation();

  useEffect(() => {
    const photo = parseInt(photographerSplit, 10);
    if (!isNaN(photo)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPlatformSplit(Math.max(0, 100 - photo).toString());
    }
  }, [photographerSplit]);

  const handleSave = () => {
    const photoSplit = parseInt(photographerSplit, 10);
    const platSplit = parseInt(platformSplit, 10);

    if (isNaN(photoSplit) || isNaN(platSplit) || photoSplit + platSplit !== 100) {
      toast.error("Splits must equal exactly 100%.");
      return;
    }

    if (!isUnlimitedPrice && (maxPrice === "" || parseFloat(maxPrice) < 0)) {
      toast.error("Please enter a valid max price.");
      return;
    }

    if (!isUnlimitedUploads && (dailyUploadLimit === "" || parseInt(dailyUploadLimit, 10) < 0)) {
      toast.error("Please enter a valid daily upload limit.");
      return;
    }

    updateMutation.mutate(
      {
        tier: config.tier,
        payload: {
          photographerSplit: photoSplit,
          platformSplit: platSplit,
          maxPrice: isUnlimitedPrice ? null : parseFloat(maxPrice),
          dailyUploadLimit: isUnlimitedUploads ? null : parseInt(dailyUploadLimit, 10),
          requiresApproval,
        },
      },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  return (
    <div
      className="fixed inset-0 z-1200 flex items-center justify-center bg-black/45 p-6 sm:p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-md overflow-hidden rounded-xl border border-line-weaker bg-white shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-gray-100 bg-[#EFF6FF] px-6 py-4">
          <h2 className="text-lg font-bold text-gray-900 tracking-tight">Edit {config.tier} Tier</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-900 hover:bg-white inline-flex h-8 w-8 items-center justify-center rounded-sm transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-6 p-6">
          
          <div className="space-y-4 rounded-lg border border-gray-100 bg-gray-50 p-4">
            <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <Percent size={16} className="text-[#0a2463]" /> Revenue Split (%)
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-600">Photographer Takes</label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={photographerSplit}
                    onChange={(e) => setPhotographerSplit(e.target.value)}
                    disabled={updateMutation.isPending}
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-[#0a2463] focus:ring-1 focus:ring-[#0a2463] focus:outline-none disabled:opacity-50"
                  />
                  <span className="absolute right-3 top-2.5 text-xs font-medium text-gray-400">%</span>
                </div>
              </div>
              
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-600">Platform Fee</label>
                <div className="relative">
                  <input
                    type="number"
                    value={platformSplit}
                    readOnly
                    className="w-full rounded-md border border-transparent bg-gray-200 px-3 py-2 text-sm text-gray-500 font-semibold cursor-not-allowed"
                  />
                  <span className="absolute right-3 top-2.5 text-xs font-medium text-gray-500">%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <DollarSign size={16} className="text-[#0a2463]" /> Maximum Photo Price
            </h3>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min="0"
                step="0.01"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                disabled={isUnlimitedPrice || updateMutation.isPending}
                className="flex-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-[#0a2463] focus:ring-1 focus:ring-[#0a2463] focus:outline-none disabled:bg-gray-100 disabled:opacity-50"
                placeholder={isUnlimitedPrice ? "Unlimited" : "e.g. 19.99"}
              />
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isUnlimitedPrice}
                  onChange={(e) => {
                    setIsUnlimitedPrice(e.target.checked);
                    if (e.target.checked) setMaxPrice("");
                  }}
                  disabled={updateMutation.isPending}
                  className="rounded border-gray-300 text-[#0a2463] focus:ring-[#0a2463]"
                />
                Unlimited
              </label>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <UploadCloud size={16} className="text-[#0a2463]" /> Daily Upload Limit
            </h3>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min="1"
                step="1"
                value={dailyUploadLimit}
                onChange={(e) => setDailyUploadLimit(e.target.value)}
                disabled={isUnlimitedUploads || updateMutation.isPending}
                className="flex-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-[#0a2463] focus:ring-1 focus:ring-[#0a2463] focus:outline-none disabled:bg-gray-100 disabled:opacity-50"
                placeholder={isUnlimitedUploads ? "Unlimited" : "e.g. 10"}
              />
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isUnlimitedUploads}
                  onChange={(e) => {
                    setIsUnlimitedUploads(e.target.checked);
                    if (e.target.checked) setDailyUploadLimit("");
                  }}
                  disabled={updateMutation.isPending}
                  className="rounded border-gray-300 text-[#0a2463] focus:ring-[#0a2463]"
                />
                Unlimited
              </label>
            </div>
          </div>

          <div className="space-y-3 border-t border-gray-100 pt-5">
            <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <ShieldCheck size={16} className="text-[#0a2463]" /> Quality Assurance
            </h3>
            <label className="flex items-center justify-between p-3 border border-gray-200 rounded-md cursor-pointer hover:bg-gray-50 transition-colors">
              <div className="pr-4">
                <span className="block text-sm font-medium text-gray-900">Require Moderation</span>
                <span className="block text-xs text-gray-500 mt-0.5">If active, photos must be manually approved by a moderator. If inactive, photos go live instantly.</span>
              </div>
              <input
                type="checkbox"
                checked={requiresApproval}
                onChange={(e) => setRequiresApproval(e.target.checked)}
                disabled={updateMutation.isPending}
                className="h-5 w-5 rounded border-gray-300 text-[#0a2463] focus:ring-[#0a2463]"
              />
            </label>
          </div>

        </div>

        <div className="flex items-center justify-end gap-3 border-t border-gray-100 bg-gray-50 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={updateMutation.isPending}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={updateMutation.isPending}
            className="inline-flex min-w-28 items-center justify-center gap-2 rounded-md bg-[#0a2463] px-4 py-2 text-sm font-medium text-white transition-colors hover:opacity-90 disabled:opacity-60"
          >
            {updateMutation.isPending && <Loader2 size={16} className="animate-spin" />}
            {updateMutation.isPending ? "Saving..." : "Save Config"}
          </button>
        </div>
      </div>
    </div>
  );
}
