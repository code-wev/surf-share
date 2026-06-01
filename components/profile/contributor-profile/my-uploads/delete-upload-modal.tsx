"use client";

import { AlertTriangle, Loader2, X, Trash2 } from "lucide-react";
import { useDeletePhotoMutation } from "@/hooks/api/usePhotos";

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

  const handleDelete = () => {
    deleteMutation.mutate(upload.id, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-sm p-6 sm:p-4 transition-all duration-300"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Confirm delete"
        onClick={(event) => event.stopPropagation()}
        className="border-line-weaker bg-white w-full max-w-md overflow-hidden rounded-xl border shadow-[0_25px_60px_rgba(0,0,0,0.3)] animate-in zoom-in-95 duration-200"
      >
        {/* Themed Header with high visibility */}
        <div className="bg-red-50 border-b border-red-100 flex items-center justify-between px-5 py-4">
          <div className="flex items-center gap-2.5 text-red-700">
            <Trash2 size={20} className="shrink-0" />
            <h2 className="text-base font-bold tracking-tight">Confirm Deletion</h2>
          </div>
          <button
            type="button"
            aria-label="Close modal"
            onClick={onClose}
            className="text-red-400 hover:text-red-600 hover:bg-red-100/50 inline-flex h-8 w-8 items-center justify-center rounded-full transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-8 text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100 text-red-600 ring-8 ring-red-50">
            <AlertTriangle size={40} strokeWidth={2.5} />
          </div>
          
          <div className="space-y-3">
            <h3 className="text-text-strong text-xl font-bold">Delete this photo?</h3>
            <p className="text-text-weak text-[15px] leading-relaxed">
              You are about to permanently remove <span className="text-red-600 font-bold">"{upload.name}"</span>. 
              This action is irreversible and the file will be gone forever.
            </p>
          </div>

          <div className="mt-10 flex flex-col sm:flex-row items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={deleteMutation.isPending}
              className="w-full sm:flex-1 border-2 border-line-weaker text-text-strong hover:bg-fill-weak h-12 rounded-lg text-sm font-bold transition-all active:scale-95 disabled:opacity-50"
            >
              No, Keep it
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="w-full sm:flex-1 bg-red-600 text-white hover:bg-red-700 h-12 rounded-lg text-sm font-bold transition-all active:scale-95 shadow-lg shadow-red-200 disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {deleteMutation.isPending ? (
                <Loader2 size={18} className="animate-spin" />
              ) : null}
              {deleteMutation.isPending ? "Deleting..." : "Yes, Delete Now"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
