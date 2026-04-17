import { Input } from "@/components/ui/input";

type ProfileInfoFieldProps = {
  label: string;
  defaultValue: string;
  className?: string;
};

export default function ProfileInfoField({
  label,
  defaultValue,
  className,
}: ProfileInfoFieldProps) {
  return (
    <label className={className}>
      <span className="mb-2 block text-base font-medium text-text-strong">{label}</span>
      <Input defaultValue={defaultValue} className="bg-surface-muted-100 text-sm px-3 py-2.5 text-text-weak" />
    </label>
  );
}
