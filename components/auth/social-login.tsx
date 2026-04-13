import Image from "next/image";

type SocialLoginProps = {
  onGoogleClick?: () => void;
  onInstagramClick?: () => void;
  onAppleClick?: () => void;
};

function SocialButton({
  onClick,
  children,
  label,
}: {
  onClick?: () => void;
  children: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="inline-flex h-12 w-12 items-center justify-center rounded-full text-icon-strong transition-colors hover:bg-fill-weak"
    >
      {children}
    </button>
  );
}

export function SocialLogin({
  onGoogleClick,
  onInstagramClick,
  onAppleClick,
}: SocialLoginProps) {
  return (
    <div className="flex items-center justify-center gap-2">
      <SocialButton label="Continue with Google" onClick={onGoogleClick}>
        <Image
          src="/auth/Google.svg"
          alt="Google"
          width={22}
          height={22}
          priority
        />
      </SocialButton>
      <SocialButton label="Continue with Instagram" onClick={onInstagramClick}>
        <Image
          src="/auth/Instagram.svg"
          alt="Instagram"
          width={22}
          height={22}
          priority
        />
      </SocialButton>
      <SocialButton label="Continue with Apple" onClick={onAppleClick}>
        <Image
          src="/auth/Apple.svg"
          alt="Apple"
          width={22}
          height={22}
          priority
        />
      </SocialButton>
    </div>
  );
}
