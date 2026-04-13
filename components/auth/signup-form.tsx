import Link from "next/link";
import { ArrowRight, Eye, EyeOff } from "lucide-react";

import { Input } from "@/components/ui/input";

export function SignUpForm() {
  return (
    <form className="mt-8 space-y-5 sm:mt-10 md:mt-12 [font-family:var(--font-sf-pro)]" noValidate>
      <fieldset className="space-y-2">
        <legend className="text-sm font-medium text-text-strong">Account Type</legend>
        <div className="flex flex-wrap items-center gap-3 sm:gap-5">
          <label className="inline-flex items-center gap-2 text-sm text-text-strong">
            <input
              type="radio"
              name="accountType"
              value="surfer"
              defaultChecked
              className="size-3.5 border-line-weak text-brand-default focus:ring-brand-default"
            />
            Surfer
          </label>
          <label className="inline-flex items-center gap-2 text-sm text-text-strong">
            <input
              type="radio"
              name="accountType"
              value="photographer"
              className="size-3.5 border-line-weak text-brand-default focus:ring-brand-default"
            />
            Photographer
          </label>
        </div>
      </fieldset>

      <div className="space-y-2">
        <label htmlFor="full-name" className="text-base font-medium text-text-strong">
          Full name
        </label>
        <Input id="full-name" type="text" placeholder="Enter your full name" />
      </div>

      <div className="space-y-2">
        <label htmlFor="signup-email" className="text-base font-medium text-text-strong">
          Email
        </label>
        <Input id="signup-email" type="email" placeholder="Enter your email address" />
      </div>

      <div className="space-y-2">
        <label htmlFor="signup-password" className="text-base font-medium text-text-strong">
          Password
        </label>
        <div className="relative">
          <Input
            id="signup-password"
            type="password"
            placeholder="Type your password"
            className="pr-10"
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-icon-weaker"
            aria-label="Toggle password visibility"
          >
            <EyeOff size={16} />
          </button>
        </div>
        <p className="text-xs text-text-weaker">Atleast 8 characters</p>
      </div>

      <div className="space-y-2">
        <label htmlFor="confirm-password" className="text-base font-medium text-text-strong">
          Confirm password
        </label>
        <div className="relative">
          <Input
            id="confirm-password"
            type="password"
            placeholder="Retype your password"
            className="pr-10"
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-icon-weaker"
            aria-label="Toggle confirm password visibility"
          >
            <Eye size={16} />
          </button>
        </div>
      </div>

      <label className="inline-flex items-center gap-2 text-xs text-text-weak">
        <input
          type="checkbox"
          defaultChecked
          className="size-3.5 rounded border-line-weak text-brand-default focus:ring-brand-default"
        />
        Allow promotions and updates to be sent via email.
      </label>

      <div className="flex flex-col gap-4 pt-8 sm:pt-10 md:flex-row md:items-center md:justify-between">
        <p className="text-sm text-text-weak">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-brand-default hover:underline">
            Log in
          </Link>
        </p>
        <button
          type="submit"
          className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-brand-default px-4 py-2 text-sm font-medium text-text-inverse-strong transition-colors hover:bg-brand-hover md:w-auto"
        >
          Sign up
          <ArrowRight size={18} />
        </button>
      </div>
    </form>
  );
}