import { Input } from "@/components/ui/input";

type ProfileInfoFieldProps = {
  label: string;
  defaultValue?: string;
  value?: string;
  isEditing?: boolean;
  onChange?: (value: string) => void;
  className?: string;
};

export default function ProfileInfoField({
  label,
  defaultValue = "",
  value,
  isEditing = false,
  onChange,
  className,
}: ProfileInfoFieldProps) {
  return (
    <label className={className}>
      <span className="text-text-strong mb-2 block text-base font-medium">{label}</span>
      <Input
        value={value ?? undefined}
        defaultValue={value == null ? defaultValue : undefined}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={!isEditing}
        className="bg-surface-muted-100 text-text-weak px-3 py-2.5 text-sm"
      />
    </label>
  );
}
