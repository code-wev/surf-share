"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, EyeOff } from "lucide-react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { useLoginMutation } from "@/hooks/api/useAuth";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const loginMutation = useLoginMutation();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields.");
      return;
    }
    loginMutation.mutate({ email, password });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-8 space-y-5 [font-family:var(--font-sf-pro)] sm:mt-10 md:mt-12"
      noValidate
    >
      <div className="space-y-2">
        <label htmlFor="email" className="text-text-strong text-base font-medium">
          Email
        </label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email address"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          disabled={loginMutation.isPending}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="text-text-strong text-base font-medium">
          Password
        </label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Type your password"
            className="pr-10"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            disabled={loginMutation.isPending}
          />
          <button
            type="button"
            onClick={() => setShowPassword((previousValue) => !previousValue)}
            className="text-icon-weaker absolute top-1/2 right-3 -translate-y-1/2"
            aria-label="Toggle password visibility"
            disabled={loginMutation.isPending}
          >
            <EyeOff size={16} />
          </button>
        </div>
        <div className="flex items-center justify-between text-xs">
          <p className="text-text-weaker">Atleast 8 characters</p>
          <Link href="/forgot-password" className="text-danger-strong hover:underline">
            Forget Password ?
          </Link>
        </div>
      </div>

      <div className="flex flex-col gap-4 pt-8 sm:pt-10 md:flex-row md:items-center md:justify-between md:pt-12">
        <p className="text-text-weak order-2 text-sm md:order-1">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-brand-default font-medium hover:underline">
            Sign Up
          </Link>
        </p>
        <button
          type="submit"
          disabled={loginMutation.isPending}
          className="bg-brand-default text-text-inverse-strong hover:bg-brand-hover disabled:opacity-50 order-1 inline-flex w-full items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors md:order-2 md:w-auto"
        >
          {loginMutation.isPending ? "Logging in..." : "Login"}
          <ArrowRight size={18} />
        </button>
      </div>
    </form>
  );
}
