"use client";

import Image from "next/image";
import { useGoogleLogin } from "@react-oauth/google";
import { useGoogleLoginMutation } from "@/hooks/api/useAuth";
import { Role } from "@/lib/auth";

type SocialLoginProps = {
  buttonText?: string;
  role?: Role;
  shouldCreate?: boolean;
};

export function SocialLogin({
  buttonText = "Continue with Google",
  role,
  shouldCreate = true,
}: SocialLoginProps) {
  const googleLoginMutation = useGoogleLoginMutation();

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => {
      googleLoginMutation.mutate({
        code: codeResponse.code,
        role,
        shouldCreate,
      });
    },
    flow: "auth-code",
  });

  return (
    <div className="flex items-center justify-center">
      <button
        type="button"
        aria-label={buttonText}
        onClick={() => login()}
        disabled={googleLoginMutation.isPending}
        className="border-line-weaker text-text-strong hover:bg-fill-weak inline-flex cursor-pointer items-center justify-center gap-3 rounded-full border bg-transparent px-7 py-3.5 text-sm font-medium transition-colors sm:px-6 disabled:opacity-50"
      >
        <Image src="/auth/Google.svg" alt="Google" width={20} height={20} priority />
        <span>{googleLoginMutation.isPending ? "Connecting..." : buttonText}</span>
      </button>
    </div>
  );
}
