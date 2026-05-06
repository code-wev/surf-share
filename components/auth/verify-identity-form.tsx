"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { verifyOtp, forgotPassword } from "@/src/actions/auth.action";

const codeSlots = [1, 2, 3, 4, 5, 6];

interface CodeInputProps {
  slot: number;
  value: string;
  onChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  inputRef?: (el: HTMLInputElement | null) => void;
  disabled: boolean;
}

function CodeInput({ slot, value, onChange, onKeyDown, inputRef, disabled }: CodeInputProps) {
  return (
    <input
      ref={inputRef}
      inputMode="numeric"
      autoComplete="one-time-code"
      maxLength={1}
      aria-label={`Verification digit ${slot}`}
      value={value}
      onChange={(e) => {
        if (/^\d?$/.test(e.target.value)) {
          onChange(e.target.value);
        }
      }}
      onKeyDown={onKeyDown}
      disabled={disabled}
      className="border-line-weaker bg-surface-muted-100 text-text-strong focus:border-brand-default focus:ring-brand-default/20 h-10 w-10 rounded-md border text-center text-base leading-none font-semibold transition-colors outline-none focus:ring-2 disabled:opacity-50 sm:h-12 sm:w-12 sm:text-lg lg:h-16 lg:w-16 lg:px-5 lg:py-7 lg:text-[24px]"
    />
  );
}

export function VerifyIdentityForm() {
  const router = useRouter();
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [email, setEmail] = useState("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const storedEmail = sessionStorage.getItem("resetEmail");
    if (!storedEmail) {
      router.push("/forgot-password");
    } else {
      setTimeout(() => setEmail(storedEmail), 0);
    }
  }, [router]);

  // Resend timer logic
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleOtpChange = (index: number, value: string) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      toast.error("Please enter a valid 6-digit code.");
      return;
    }

    setIsLoading(true);
    try {
      const result = await verifyOtp(email, otpCode);

      if (result.success && result.data?.resetToken) {
        toast.success(result.message);
        // Store reset token in session storage
        sessionStorage.setItem("resetToken", result.data.resetToken);
        router.push("/set-new-password");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;

    setIsResending(true);
    try {
      const result = await forgotPassword(email);
      if (result.success) {
        toast.success("OTP resent successfully. Check your email.");
        setResendTimer(60); // 60 seconds before can resend again
        setOtp(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to resend OTP. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-8 space-y-5 [font-family:var(--font-sf-pro)] sm:mt-10 md:mt-12"
      noValidate
    >
      <div className="space-y-2">
        <label className="text-text-strong text-sm font-medium">Enter verification code</label>
        <div className="flex w-full items-center justify-between gap-2 sm:gap-3 md:hidden">
          {codeSlots.map((slot, index) => (
            <CodeInput
              key={`mobile-${slot}`}
              slot={slot}
              value={otp[index]}
              onChange={(value) => handleOtpChange(index, value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              inputRef={(el) => {
                inputRefs.current[index] = el;
              }}
              disabled={isLoading}
            />
          ))}
        </div>

        <div className="hidden w-full items-center justify-between md:flex">
          <div className="flex items-center gap-6 lg:gap-9">
            {codeSlots.slice(0, 3).map((slot, index) => (
              <CodeInput
                key={`left-${slot}`}
                slot={slot}
                value={otp[index]}
                onChange={(value) => handleOtpChange(index, value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                inputRef={(el) => {
                  inputRefs.current[index] = el;
                }}
                disabled={isLoading}
              />
            ))}
          </div>

          <div className="flex items-center gap-6 lg:gap-9">
            {codeSlots.slice(3).map((slot, index) => (
              <CodeInput
                key={`right-${slot}`}
                slot={slot}
                value={otp[index + 3]}
                onChange={(value) => handleOtpChange(index + 3, value)}
                onKeyDown={(e) => handleKeyDown(index + 3, e)}
                inputRef={(el) => {
                  inputRefs.current[index + 3] = el;
                }}
                disabled={isLoading}
              />
            ))}
          </div>
        </div>
        <p className="text-text-weaker text-xs">
          Please enter the verification code sent to your email.
        </p>

        <div className="pt-2">
          <button
            type="button"
            onClick={handleResend}
            disabled={resendTimer > 0 || isResending}
            className="text-brand-default text-xs font-medium hover:underline disabled:opacity-50"
          >
            {isResending
              ? "Resending..."
              : resendTimer > 0
                ? `Resend code in ${resendTimer}s`
                : "Resend OTP"}
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-4 pt-8 sm:pt-10 md:flex-row md:items-center md:justify-between">
        <p className="text-text-weak order-2 text-sm md:order-1">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-brand-default font-medium hover:underline">
            Sign Up
          </Link>
        </p>
        <button
          type="submit"
          disabled={isLoading}
          className="bg-brand-default text-text-inverse-strong hover:bg-brand-hover order-1 inline-flex w-full items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 md:order-2 md:w-auto"
        >
          {isLoading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Verifying...
            </>
          ) : (
            <>
              Confirm
              <ArrowRight size={18} />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
