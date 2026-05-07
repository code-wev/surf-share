import { EyeOff, Eye } from "lucide-react";
import { useState } from "react";

import { Input } from "@/components/ui/input";

type DashboardProfilePasswordFieldProps = {
  label: string;
  placeholder: string;
  value?: string;
  onChange?: (value: string) => void;
};

export default function DashboardProfilePasswordField({
  label,
  placeholder,
  value,
  onChange,
}: DashboardProfilePasswordFieldProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <label>
      <span className="text-text-strong mb-2 block text-sm font-medium">{label}</span>
      <div className="relative">
        <Input
          type={isVisible ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className="bg-surface-muted-100 text-text-weak h-10 pr-9 text-sm"
        />
        <button
          type="button"
          onClick={() => setIsVisible(!isVisible)}
          aria-label={`Toggle ${label.toLowerCase()} visibility`}
          className="text-text-weaker hover:text-text-weak absolute top-1/2 right-3 -translate-y-1/2 transition-colors"
        >
          {isVisible ? <Eye size={14} /> : <EyeOff size={14} />}
        </button>
      </div>
    </label>
  );
}
