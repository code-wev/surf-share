import Link from "next/link";
import { ArrowRight } from "lucide-react";

const codeSlots = [1, 2, 3, 4, 5, 6];

function CodeInput({ slot }: { slot: number }) {
  return (
    <input
      inputMode="numeric"
      autoComplete="one-time-code"
      maxLength={1}
      aria-label={`Verification digit ${slot}`}
      className="h-10 w-10 rounded-md border border-line-weaker bg-surface-muted-100 text-center text-base leading-none font-semibold text-text-strong outline-none transition-colors focus:border-brand-default focus:ring-2 focus:ring-brand-default/20 sm:h-12 sm:w-12 sm:text-lg lg:h-16 lg:w-16 lg:px-5 lg:py-7 lg:text-[24px]"
    />
  );
}

export function VerifyIdentityForm() {
  return (
    <form
      action="/set-new-password"
      className="mt-8 space-y-5 sm:mt-10 md:mt-12 [font-family:var(--font-sf-pro)]"
      noValidate
    >
      <div className="space-y-2">
        <label className="text-sm font-medium text-text-strong">Enter verification code</label>
        <div className="flex w-full items-center justify-between gap-2 sm:gap-3 md:hidden">
          {codeSlots.map((slot) => (
            <CodeInput key={`mobile-${slot}`} slot={slot} />
          ))}
        </div>

        <div className="hidden w-full items-center justify-between md:flex">
          <div className="flex items-center gap-6 lg:gap-9">
            {codeSlots.slice(0, 3).map((slot) => (
              <CodeInput key={`left-${slot}`} slot={slot} />
            ))}
          </div>

          <div className="flex items-center gap-6 lg:gap-9">
            {codeSlots.slice(3).map((slot) => (
              <CodeInput key={`right-${slot}`} slot={slot} />
            ))}
          </div>
        </div>
        <p className="text-xs text-text-weaker">
          Please enter the verification code sent to your email.
        </p>
      </div>

      <div className="flex flex-col gap-4 pt-8 sm:pt-10 md:flex-row md:items-center md:justify-between">
        <p className="order-2 text-sm text-text-weak md:order-1">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-medium text-brand-default hover:underline">
            Sign Up
          </Link>
        </p>
        <button
          type="submit"
          className="order-1 inline-flex w-full items-center justify-center gap-2 rounded-md bg-brand-default px-4 py-2 text-sm font-medium text-text-inverse-strong transition-colors hover:bg-brand-hover md:order-2 md:w-auto"
        >
          Confirm
          <ArrowRight size={18} />
        </button>
      </div>
    </form>
  );
}
