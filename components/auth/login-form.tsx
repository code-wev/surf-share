"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, EyeOff } from "lucide-react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { DEMO_CREDENTIALS, useDemoAuth } from "@/lib/demo-auth";

export function LoginForm() {
  const router = useRouter();
  const { login } = useDemoAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const session = login(email, password);
    if (!session) {
      toast.error("Invalid demo email or password.");
      return;
    }

    toast.success(`Logged in as ${session.role}.`);
    router.push("/profile");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-8 space-y-5 sm:mt-10 md:mt-12 [font-family:var(--font-sf-pro)]"
      noValidate
    >
      <div className="space-y-2">
        <label htmlFor="email" className="text-base font-medium text-text-strong">
          Email
        </label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email address"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="text-base font-medium text-text-strong">
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
          />
          <button
            type="button"
            onClick={() => setShowPassword((previousValue) => !previousValue)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-icon-weaker"
            aria-label="Toggle password visibility"
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
          Login
          <ArrowRight size={18} />
        </button>
      </div>

      <div className="rounded-md border border-line-weaker bg-surface-muted-100 p-3 text-xs text-text-weak">
        <p className="font-semibold text-text-strong">Demo credentials</p>
        <ul className="mt-2 space-y-1">
          {DEMO_CREDENTIALS.map((credential) => (
            <li key={credential.email}>
              {credential.role}: {credential.email} / {credential.password}
            </li>
          ))}
        </ul>
      </div>
    </form>
  );
}
