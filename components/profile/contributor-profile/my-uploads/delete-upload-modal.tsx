"use client";

import { useDeletePhotoMutation } from "@/hooks/api/usePhotos";
import { AlertTriangle, Loader2, Trash2, X } from "lucide-react";

type DeleteUploadModalProps = {
  upload: {
    id: string;
    name: string;
  } | null;
  onClose: () => void;
};

export default function DeleteUploadModal({ upload, onClose }: DeleteUploadModalProps) {
  const deleteMutation = useDeletePhotoMutation();

  if (!upload) return null;

  const handleClose = () => {
    deleteMutation.reset();
    onClose();
  };

  const handleDelete = () => {
    deleteMutation.mutate(upload.id, {
      onSuccess: () => {
        handleClose();
      },
    });
  };

  const isAlreadyPurchasedError =
    deleteMutation.error &&
    (deleteMutation.error as { response?: { data?: { message?: string } } }).response?.data?.message === "PHOTO_ALREADY_PURCHASED";

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 p-6 backdrop-blur-sm transition-all duration-300 sm:p-4"
      onClick={handleClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={isAlreadyPurchasedError ? "Cannot delete photo" : "Confirm delete"}
        onClick={(event) => event.stopPropagation()}
        className="border-line-weaker animate-in zoom-in-95 w-full max-w-md overflow-hidden rounded-xl border bg-white shadow-[0_25px_60px_rgba(0,0,0,0.3)] duration-200"
      >
        {/* Themed Header with high visibility */}
        <div
          className={`flex items-center justify-between border-b px-5 py-4 ${isAlreadyPurchasedError ? "border-orange-100 bg-orange-50" : "border-red-100 bg-red-50"}`}
        >
          <div
            className={`flex items-center gap-2.5 ${isAlreadyPurchasedError ? "text-orange-700" : "text-red-700"}`}
          >
            {isAlreadyPurchasedError ? (
              <AlertTriangle size={20} className="shrink-0" />
            ) : (
              <Trash2 size={20} className="shrink-0" />
            )}
            <h2 className="text-base font-bold tracking-tight">
              {isAlreadyPurchasedError ? "Action Blocked" : "Confirm Deletion"}
            </h2>
          </div>
          <button
            type="button"
            aria-label="Close modal"
            onClick={handleClose}
            className={`${isAlreadyPurchasedError ? "text-orange-400 hover:bg-orange-100/50 hover:text-orange-600" : "text-red-400 hover:bg-red-100/50 hover:text-red-600"} inline-flex h-8 w-8 items-center justify-center rounded-full transition-colors`}
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-8 text-center">
          {isAlreadyPurchasedError ? (
            <>
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-orange-100 text-orange-600 ring-8 ring-orange-50">
                <AlertTriangle size={40} strokeWidth={2.5} />
              </div>

              <div className="space-y-3">
                <h3 className="text-text-strong text-xl font-bold">Cannot Delete Photo</h3>
                <p className="text-text-weak text-[15px] leading-relaxed">
                  You cannot delete the photo as it was already bought by someone. If you want to
                  delete it, email the moderator at: <br />
                  <a
                    href="mailto:admin@surfshare.com.au"
                    className="mt-2 inline-block font-bold text-[#0a2463] hover:underline"
                  >
                    admin@surfshare.com.au
                  </a>
                </p>
              </div>

              <div className="mt-10 flex flex-col items-center gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="h-12 w-full rounded-lg bg-[#0a2463] text-sm font-bold text-white shadow-lg shadow-[#0a2463]/20 transition-all hover:bg-[#0c3173] active:scale-95"
                >
                  Close
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100 text-red-600 ring-8 ring-red-50">
                <AlertTriangle size={40} strokeWidth={2.5} />
              </div>

              <div className="space-y-3">
                <h3 className="text-text-strong text-xl font-bold">Delete this photo?</h3>
                <p className="text-text-weak text-[15px] leading-relaxed">
                  You are about to permanently remove{" "}
                  <span className="font-bold text-red-600">{upload.name}</span>. This action is
                  irreversible and the file will be gone forever.
                </p>
              </div>

              <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={deleteMutation.isPending}
                  className="border-line-weaker text-text-strong hover:bg-fill-weak h-12 w-full rounded-lg border-2 text-sm font-bold transition-all active:scale-95 disabled:opacity-50 sm:flex-1"
                >
                  No, Keep it
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleteMutation.isPending}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-red-600 text-sm font-bold text-white shadow-lg shadow-red-200 transition-all hover:bg-red-700 active:scale-95 disabled:opacity-60 sm:flex-1"
                >
                  {deleteMutation.isPending ? <Loader2 size={18} className="animate-spin" /> : null}
                  {deleteMutation.isPending ? "Deleting..." : "Yes, Delete Now"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
