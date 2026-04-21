import { EyeOff } from "lucide-react";

import { Input } from "@/components/ui/input";

type DashboardProfilePasswordFieldProps = {
  label: string;
  placeholder: string;
};

export default function DashboardProfilePasswordField({
  label,
  placeholder,
}: DashboardProfilePasswordFieldProps) {
  return (
    <label>
      <span className="mb-2 block text-sm font-medium text-text-strong">{label}</span>
      <div className="relative">
        <Input
          type="password"
          placeholder={placeholder}
          className="h-10 bg-surface-muted-100 pr-9 text-sm text-text-weak"
        />
        <button
          type="button"
          aria-label={`Toggle ${label.toLowerCase()} visibility`}
          className="absolute top-1/2 right-3 -translate-y-1/2 text-text-weaker transition-colors hover:text-text-weak"
        >
          <EyeOff size={14} />
        </button>
      </div>
    </label>
  );
}
