import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type DashboardProfileInfoFieldProps = {
  label: string;
  defaultValue?: string;
  value?: string;
  isEditing?: boolean;
  disabled?: boolean;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  helperText?: string;
  errorMessage?: string;
  className?: string;
};

export default function DashboardProfileInfoField({
  label,
  defaultValue = "",
  value,
  isEditing = true,
  disabled = false,
  onChange,
  onBlur,
  placeholder,
  helperText,
  errorMessage,
  className,
}: DashboardProfileInfoFieldProps) {
  const isDisabled = disabled || !isEditing;
  const displayValue = value !== undefined ? value : defaultValue;

  return (
    <label className={cn("block", className)}>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-text-strong block text-base font-medium">{label}</span>
        {helperText && <span className="text-text-weaker text-xs">{helperText}</span>}
      </div>
      <Input
        value={displayValue}
        placeholder={placeholder}
        onChange={(e) => onChange?.(e.target.value)}
        onBlur={onBlur}
        disabled={isDisabled}
        className={cn(
          "bg-surface-muted-100 px-3 py-2.5 text-sm transition-all duration-150",
          isDisabled
            ? "cursor-not-allowed text-text-weak opacity-60"
            : "text-text-strong hover:border-gray-300 focus:border-brand-default focus:bg-white",
          errorMessage && "border-rose-500 focus-visible:ring-rose-400 text-rose-900",
        )}
      />
      {errorMessage && (
        <span className="mt-1 block text-xs font-medium text-rose-600">{errorMessage}</span>
      )}
    </label>
  );
}
