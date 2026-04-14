import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Input } from "@/components/ui/input";

export function ForgotPasswordForm() {
  return (
    <form
      action="/verify-identity"
      className="mt-8 space-y-5 sm:mt-10 md:mt-12 [font-family:var(--font-sf-pro)]"
      noValidate
    >
      <div className="space-y-2">
        <label htmlFor="forgot-email" className="text-base font-medium text-text-strong">
          Email
        </label>
        <Input id="forgot-email" type="email" placeholder="Enter your email address" />
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
          Send Reset Link
          <ArrowRight size={18} />
        </button>
      </div>
    </form>
  );
}
