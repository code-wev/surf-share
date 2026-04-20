export default function DashboardProfileActions() {
  return (
    <div className="mt-6 flex items-center justify-end gap-3">
      <button
        type="button"
        className="border-line-weaker bg-fill-weak text-text-weak hover:bg-surface-muted-100 inline-flex h-10 items-center rounded-sm border px-4 text-sm font-medium transition-colors"
      >
        Discard
      </button>
      <button
        type="button"
        className="bg-brand-default text-text-inverse-strong hover:bg-brand-hover inline-flex h-10 items-center rounded-sm px-4 text-sm font-medium transition-colors"
      >
        Save changes
      </button>
    </div>
  );
}
