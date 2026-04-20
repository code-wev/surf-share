import { Check, X } from "lucide-react";

type PhotoModerationHeaderProps = {
  selectedCount: number;
  allSelected: boolean;
  onToggleSelectAll: () => void;
  onBulkApprove: () => void;
  onBulkReject: () => void;
};

export default function PhotoModerationHeader({
  selectedCount,
  allSelected,
  onToggleSelectAll,
  onBulkApprove,
  onBulkReject,
}: PhotoModerationHeaderProps) {
  const isBulkActionDisabled = selectedCount === 0;

  return (
    <header>
      <h1 className="inline-flex border-b border-brand-default pb-1 text-base font-medium text-brand-default sm:text-lg">
        Photo Moderation
      </h1>

      <div className="mt-5 flex flex-col gap-3 sm:mt-6 md:mt-9 sm:flex-row sm:items-center sm:justify-between">
        <label className="inline-flex w-fit cursor-pointer items-center gap-2 text-xs text-text-weak">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={onToggleSelectAll}
            className="h-3.5 w-3.5 rounded-[3px] border border-line-weaker bg-white accent-text-strong"
          />
          Select All
        </label>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={onBulkReject}
            disabled={isBulkActionDisabled}
            className="inline-flex h-8 items-center gap-1 rounded-sm bg-[#FCE7E7] px-4 text-[11px] font-medium text-[#D85B5B] transition-opacity disabled:cursor-not-allowed disabled:opacity-55"
          >
            Reject Selected
            <X size={11} />
          </button>

          <button
            type="button"
            onClick={onBulkApprove}
            disabled={isBulkActionDisabled}
            className="inline-flex h-8 items-center gap-1 rounded-sm bg-[#EAF8EE] px-4 text-[11px] font-medium text-[#2AA65C] transition-opacity disabled:cursor-not-allowed disabled:opacity-55"
          >
            Approve Selected
            <Check size={11} />
          </button>
        </div>
      </div>
    </header>
  );
}
