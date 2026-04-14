import Link from "next/link";
import { ArrowRight } from "lucide-react";

const codeSlots = [1, 2, 3, 4, 5, 6];

export function VerifyIdentityForm() {
  return (
    <form className="mt-8 space-y-5 sm:mt-10 md:mt-12 [font-family:var(--font-sf-pro)]" noValidate>
      <div className="space-y-2">
        <label className="text-sm font-medium text-text-strong">Enter verification code</label>
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-[36px]">
            {codeSlots.slice(0, 3).map((slot) => (
              <input
                key={slot}
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={1}
                aria-label={`Verification digit ${slot}`}
                className="h-16 w-16 rounded-md border border-line-weaker bg-surface-muted-100 p-[28px] text-center text-[24px] leading-none font-semibold text-text-strong outline-none transition-colors focus:border-brand-default focus:ring-2 focus:ring-brand-default/20"
              />
            ))}
          </div>

          <div className="flex items-center gap-[36px]">
            {codeSlots.slice(3).map((slot) => (
              <input
                key={slot}
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={1}
                aria-label={`Verification digit ${slot}`}
                className="h-16 w-16 rounded-md border border-line-weaker bg-surface-muted-100 p-[28px] text-center text-[24px] leading-none font-semibold text-text-strong outline-none transition-colors focus:border-brand-default focus:ring-2 focus:ring-brand-default/20"
              />
            ))}
          </div>
        </div>
        <p className="text-xs text-text-weaker">
          Please enter the verification code sent to your email.
        </p>
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
          Confirm
          <ArrowRight size={18} />
        </button>
      </div>
    </form>
  );
}
