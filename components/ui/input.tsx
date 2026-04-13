import * as React from "react";

import { cn } from "@/lib/utils";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={cn(
          "flex w-full rounded-md border border-line-weaker bg-surface-muted-100 px-3 py-2.5 text-sm text-text-strong placeholder:text-text-disable focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-default/30",
          className,
        )}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";

export { Input };
