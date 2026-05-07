import { Input } from "@/components/ui/input";

type DashboardProfileInfoFieldProps = {
  label: string;
  defaultValue?: string;
  value?: string;
  isEditing?: boolean;
  onChange?: (value: string) => void;
  className?: string;
};

export default function DashboardProfileInfoField({
  label,
  defaultValue,
  value,
  isEditing,
  onChange,
  className,
}: DashboardProfileInfoFieldProps) {
  const displayValue = isEditing ? value : defaultValue;

  return (
    <label className={className}>
      <span className="text-text-strong mb-2 block text-base font-medium">{label}</span>
      <Input
        value={displayValue}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={!isEditing}
        className="bg-surface-muted-100 text-text-strong px-3 py-2.5 text-sm disabled:opacity-60"
      />
    </label>
  );
}
