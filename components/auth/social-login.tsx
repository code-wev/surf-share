import Image from "next/image";

type SocialLoginProps = {
  onGoogleClick?: () => void;
  buttonText?: string;
};

export function SocialLogin({
  onGoogleClick,
  buttonText = "Continue with Google",
}: SocialLoginProps) {
  return (
    <div className="flex items-center justify-center">
      <button
        type="button"
        aria-label={buttonText}
        onClick={onGoogleClick}
        className="border-line-weaker text-text-strong hover:bg-fill-weak inline-flex cursor-pointer items-center justify-center gap-3 rounded-full border bg-transparent px-7 py-3.5 text-sm font-medium transition-colors sm:px-6"
      >
        <Image src="/auth/Google.svg" alt="Google" width={20} height={20} priority />
        <span>{buttonText}</span>
      </button>
    </div>
  );
}
