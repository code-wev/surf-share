import { Input } from "@/components/ui/input";

type DashboardProfileInfoFieldProps = {
  label: string;
  defaultValue: string;
  className?: string;
};

export default function DashboardProfileInfoField({
  label,
  defaultValue,
  className,
}: DashboardProfileInfoFieldProps) {
  return (
    <label className={className}>
      <span className="mb-2 block text-base font-medium text-text-strong">{label}</span>
      <Input
        defaultValue={defaultValue}
        className="bg-surface-muted-100 px-3 py-2.5 text-sm text-text-weak"
      />
    </label>
  );
}
