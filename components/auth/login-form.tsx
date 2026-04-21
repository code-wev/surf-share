"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, EyeOff } from "lucide-react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { DEMO_CREDENTIALS, getRoleHomePath, useDemoAuth } from "@/lib/demo-auth";

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
    router.push(getRoleHomePath(session.role));
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
          />
          <button
            type="button"
            onClick={() => setShowPassword((previousValue) => !previousValue)}
            className="text-icon-weaker absolute top-1/2 right-3 -translate-y-1/2"
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
        <p className="text-text-weak order-2 text-sm md:order-1">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-brand-default font-medium hover:underline">
            Sign Up
          </Link>
        </p>
        <button
          type="submit"
          className="bg-brand-default text-text-inverse-strong hover:bg-brand-hover order-1 inline-flex w-full items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors md:order-2 md:w-auto"
        >
          Login
          <ArrowRight size={18} />
        </button>
      </div>

      <div className="border-line-weaker bg-surface-muted-100 text-text-weak rounded-md border p-3 text-xs">
        <p className="text-text-strong font-semibold">Demo credentials</p>
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
