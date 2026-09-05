import Image from "next/image";
import { Check, ChevronsRight, Copy, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { getUserById, getUserPhotos } from "@/src/actions/user.action";
import {
  useUpdateSubscriptionMutation,
  useUpdateUserStatusMutation,
  useUpdateUserMutation,
} from "@/hooks/api/useUsers";
import { getAbsoluteImageUrl } from "@/lib/utils";
import { useAuth } from "@/lib/auth";

type UserDetailsModalProps = {
  userId: string | null;
  onClose: () => void;
};

type UserDetailRowProps = {
  label: string;
  value: React.ReactNode;
};

function UserDetailRow({ label, value }: UserDetailRowProps) {
  return (
    <div className="grid grid-cols-[100px_minmax(0,1fr)] gap-x-6 gap-y-1 py-1 [font-family:var(--font-sf-pro)] text-xs leading-tight sm:grid-cols-[125px_minmax(0,1fr)] sm:gap-x-8 sm:text-sm">
      <span className="text-text-strong font-medium">{label}</span>
      <div className="text-text-weak min-w-0">{value}</div>
    </div>
  );
}

export default function UserDetailsModal({ userId, onClose }: UserDetailsModalProps) {
  const { session } = useAuth();
  const {
    data: userResponse,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => (userId ? getUserById(userId) : Promise.reject("No user ID")),
    enabled: !!userId,
  });

  const { data: photosData, isLoading: isLoadingPhotos } = useQuery({
    queryKey: ["user-photos", userId],
    queryFn: () => (userId ? getUserPhotos(userId, 100) : Promise.reject("No user ID")),
    enabled: !!userId,
  });

  const updateSubscriptionMutation = useUpdateSubscriptionMutation();
  const updateStatusMutation = useUpdateUserStatusMutation();
  const updateUserMutation = useUpdateUserMutation();

  const handleSubscriptionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!userId) return;
    const newTier = e.target.value;
    updateSubscriptionMutation.mutate({ userId, tier: newTier });
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!userId) return;
    const newStatus = e.target.value;
    updateStatusMutation.mutate({ userId, status: newStatus });
  };

  const handleTogglePromotion = () => {
    if (!userId || !user) return;
    updateUserMutation.mutate({
      userId,
      payload: { promotionEmail: !user.promotionEmail },
    });
  };

  const [copiedBankDetails, setCopiedBankDetails] = useState(false);

  const handleCopyBankDetails = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedBankDetails(true);
    toast.success("Manual payment details copied!");
    setTimeout(() => setCopiedBankDetails(false), 2000);
  };

  const user = userResponse?.data;
  const isPhotographer = user?.role === "PHOTOGRAPHER" || user?.role === "Photographer";
  const photos = photosData?.data ?? [];
  const displayPhotos = photos.slice(0, 4);
  const remainingPhotos = Math.max(0, photos.length - 4);

  if (!userId) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-100 bg-[#0d1420]/30" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="User details"
        className="border-line-weaker absolute right-0 bottom-0 flex h-[80vh] w-full max-w-105 flex-col overflow-hidden rounded-lg border-t border-l bg-white shadow-[-18px_0_40px_rgba(15,23,42,0.14)] sm:max-w-140"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="border-line-weaker flex items-center justify-between border-b bg-white px-4.5 py-3">
          <div className="text-text-strong flex items-center gap-2">
            <button
              type="button"
              aria-label="Close user details"
              onClick={onClose}
              className="hover:bg-fill-hover inline-flex h-5 w-5 items-center justify-center rounded-sm transition-colors"
            >
              <ChevronsRight size={24} />
            </button>
          </div>
        </div>

        <div className="no-scrollbar flex-1 overflow-y-auto bg-[#FAFAFA] px-6 pt-6">
          {isLoading ? (
            <div className="flex h-full items-center justify-center">
              <Loader2 className="text-text-weak animate-spin" />
            </div>
          ) : isError || !user ? (
            <div className="flex h-full items-center justify-center">
              <p className="text-danger-strong">Failed to load user details.</p>
            </div>
          ) : (
            <>
              <div className="relative">
                <div className="border-line-weaker bg-fill-hover h-16 w-16 overflow-hidden rounded-full border">
                  <Image
                    src={user.profileImageUrl ? getAbsoluteImageUrl(user.profileImageUrl) : "/home/logo.png"}
                    alt={`${user.name} thumbnail`}
                    width={64}
                    height={64}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <UserDetailRow label="Name" value={user.name} />
                <UserDetailRow label="Email" value={user.email} />
                <UserDetailRow label="Role" value={user.role} />

                <UserDetailRow
                  label="Status"
                  value={
                    <div className="flex items-center gap-2">
                      <select
                        className="border-line-weaker text-text-strong focus:ring-brand-default h-8 rounded-sm border bg-white px-2 text-sm focus:ring-1 focus:outline-none"
                        value={user.status}
                        onChange={handleStatusChange}
                        disabled={updateStatusMutation.isPending}
                      >
                        <option value="ACTIVE">ACTIVE</option>
                        <option value="SUSPENDED">SUSPENDED</option>
                      </select>
                      {updateStatusMutation.isPending && (
                        <Loader2 className="text-brand-default h-4 w-4 animate-spin" />
                      )}
                    </div>
                  }
                />

                <UserDetailRow
                  label="Promotion Email"
                  value={
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleTogglePromotion}
                        disabled={updateUserMutation.isPending}
                        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          user.promotionEmail ? "bg-brand-default" : "bg-gray-200"
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            user.promotionEmail ? "translate-x-4" : "translate-x-0"
                          }`}
                        />
                      </button>
                      {updateUserMutation.isPending && (
                        <Loader2 className="text-brand-default h-4 w-4 animate-spin" />
                      )}
                    </div>
                  }
                />

                {isPhotographer && (
                  <>
                    <UserDetailRow
                      label="Subscription"
                      value={
                        <div className="flex items-center gap-2">
                          {session?.role === "MODERATOR" ? (
                            <span className="text-sm font-medium text-text-strong">
                              {user.subscriptionTier || "BRONZE"}
                            </span>
                          ) : (
                            <>
                              <select
                                className="border-line-weaker text-text-strong focus:ring-brand-default h-8 rounded-sm border bg-white px-2 text-sm focus:ring-1 focus:outline-none"
                                value={user.subscriptionTier || "BRONZE"}
                                onChange={handleSubscriptionChange}
                                disabled={updateSubscriptionMutation.isPending}
                              >
                                <option value="BRONZE">BRONZE</option>
                                <option value="SILVER">SILVER</option>
                                <option value="GOLD">GOLD</option>
                                <option value="GOLD_PLUS">GOLD PLUS</option>
                              </select>
                              {updateSubscriptionMutation.isPending && (
                                <Loader2 className="text-brand-default h-4 w-4 animate-spin" />
                              )}
                            </>
                          )}
                        </div>
                      }
                    />

                    <UserDetailRow
                      label="PayPal Email"
                      value={
                        user.paypalEmail ? (
                          <div className="flex items-center gap-2">
                            <span className="text-text-strong">{user.paypalEmail}</span>
                            {user.paypalConnected ? (
                              <span className="rounded border border-emerald-200 bg-emerald-50 px-1.5 py-0.5 text-[10px] font-medium text-emerald-700">
                                Connected
                              </span>
                            ) : null}
                          </div>
                        ) : (
                          <span className="text-text-weaker italic">Not connected</span>
                        )
                      }
                    />

                    <UserDetailRow
                      label="Manual Payment Details"
                      value={
                        user.manualBankDetails ? (
                          <div className="border-line-weaker bg-surface-muted-100 relative rounded-md border p-2.5">
                            <div className="flex items-start justify-between gap-2">
                              <pre className="text-text-strong font-mono text-xs whitespace-pre-wrap break-all leading-relaxed">
                                {user.manualBankDetails}
                              </pre>
                              <button
                                type="button"
                                onClick={() => handleCopyBankDetails(user.manualBankDetails || "")}
                                title="Copy manual payment details"
                                className="text-text-weak hover:text-text-strong inline-flex shrink-0 cursor-pointer items-center justify-center rounded p-1 transition-colors hover:bg-fill-hover"
                              >
                                {copiedBankDetails ? (
                                  <Check size={14} className="text-emerald-600" />
                                ) : (
                                  <Copy size={14} />
                                )}
                              </button>
                            </div>
                          </div>
                        ) : (
                          <span className="text-text-weaker italic">No manual payment details provided</span>
                        )
                      }
                    />
                  </>
                )}

                <UserDetailRow label="Phone Number" value={user.phoneNumber ?? "--"} />
                <UserDetailRow label="Country" value={user.countryName ?? "--"} />
                <UserDetailRow label="Address" value={user.address ?? "--"} />
                <UserDetailRow
                  label="Created At"
                  value={new Date(user.createdAt).toLocaleDateString()}
                />
                <UserDetailRow
                  label="Photos"
                  value={
                    isLoadingPhotos ? (
                      <Loader2 className="text-text-weak animate-spin" />
                    ) : (
                      <div className="flex items-center gap-3">
                        {displayPhotos.map((photo, index) => (
                          <div
                            key={index}
                            className="border-line-weaker bg-fill-hover h-10 w-14 overflow-hidden rounded-xs border"
                          >
                            <Image
                              src={photo.imageUrl}
                              alt={`Submitted photo ${index + 1}`}
                              width={56}
                              height={40}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        ))}
                        {remainingPhotos > 0 && (
                          <span className="bg-brand-default inline-flex h-10 w-10 items-center justify-center rounded-full text-xs font-medium text-white">
                            {remainingPhotos}+
                          </span>
                        )}
                      </div>
                    )
                  }
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
