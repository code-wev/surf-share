"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

import { Input } from "@/components/ui/input";

type ProfilePasswordFieldProps = {
  label: string;
  placeholder: string;
};

export default function ProfilePasswordField({ label, placeholder }: ProfilePasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <label>
      <span className="text-text-strong mb-2 block text-sm font-medium">{label}</span>
      <div className="relative">
        <Input
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          className="bg-surface-muted-100 text-text-weak h-10 pr-9 text-sm"
        />
        <button
          type="button"
          aria-label={`Toggle ${label.toLowerCase()} visibility`}
          onClick={togglePasswordVisibility}
          className="text-text-weaker hover:text-text-weak absolute top-1/2 right-3 -translate-y-1/2 transition-colors"
        >
          {showPassword ? <Eye size={14} /> : <EyeOff size={14} />}
        </button>
      </div>
    </label>
  );
}
