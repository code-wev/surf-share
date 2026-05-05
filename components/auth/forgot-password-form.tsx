"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { forgotPassword } from "@/src/actions/auth.action";

export function ForgotPasswordForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email address.");
      return;
    }

    setIsLoading(true);
    try {
      const result = await forgotPassword(email);

      if (result.success) {
        toast.success(result.message);
        // Store email in session storage for next step
        sessionStorage.setItem("resetEmail", email);
        router.push("/verify-identity");
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

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-8 space-y-5 [font-family:var(--font-sf-pro)] sm:mt-10 md:mt-12"
      noValidate
    >
      <div className="space-y-2">
        <label htmlFor="forgot-email" className="text-text-strong text-base font-medium">
          Email
        </label>
        <Input
          id="forgot-email"
          type="email"
          placeholder="Enter your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
        />
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
              Sending...
            </>
          ) : (
            <>
              Send Reset Link
              <ArrowRight size={18} />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
