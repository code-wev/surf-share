import Link from "next/link";
import { ArrowRight, Eye, EyeOff } from "lucide-react";

import { Input } from "@/components/ui/input";

export function SetNewPasswordForm() {
  return (
    <form className="mt-8 space-y-5 sm:mt-10 md:mt-12 [font-family:var(--font-sf-pro)]" noValidate>
      <div className="space-y-2">
        <label htmlFor="new-password" className="text-base font-medium text-text-strong">
          New Password
        </label>
        <div className="relative">
          <Input
            id="new-password"
            type="password"
            placeholder="Type your new password"
            className="pr-10"
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-icon-weaker"
            aria-label="Toggle new password visibility"
          >
            <EyeOff size={16} />
          </button>
        </div>
        <p className="text-xs text-text-weaker">Atleast 8 characters</p>
      </div>

      <div className="space-y-2">
        <label htmlFor="confirm-new-password" className="text-base font-medium text-text-strong">
          Confirm new password
        </label>
        <div className="relative">
          <Input
            id="confirm-new-password"
            type="password"
            placeholder="Retype your new password"
            className="pr-10"
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-icon-weaker"
            aria-label="Toggle confirm new password visibility"
          >
            <Eye size={16} />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-4 pt-8 sm:pt-10 md:flex-row md:items-center md:justify-between">
        <p className="text-sm text-text-weak">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-medium text-brand-default hover:underline">
            Sign Up
          </Link>
        </p>
        <button
          type="submit"
          className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-brand-default px-4 py-2 text-sm font-medium text-text-inverse-strong transition-colors hover:bg-brand-hover md:w-auto"
        >
          Confirm Password
          <ArrowRight size={18} />
        </button>
      </div>
    </form>
  );
}
