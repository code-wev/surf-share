import { AuthLogo } from "@/components/auth/auth-logo";
import { AuthShell } from "@/components/auth/auth-shell";
import { SignUpForm } from "@/components/auth/signup-form";
import { SocialLogin } from "@/components/auth/social-login";

export default function SignupPage() {
  return (
    <main className="bg-surface-muted-50 lg:h-screen lg:overflow-hidden">
      <AuthShell rightScrollable contentAlign="start">
        <div className="w-full py-4 sm:py-6 lg:py-8">
          <AuthLogo />

          <div className="mt-10 sm:mt-12 md:mt-14 lg:mt-16">
            <h1 className="text-4xl font-bold leading-[1.05] tracking-tight text-text-strong sm:text-5xl md:text-6xl 2xl:text-[64px]">
              Create Your Profile
            </h1>
          </div>

          <p className="mt-3 text-lg leading-tight font-medium text-text-weak sm:mt-4 sm:text-2xl md:text-[28px]">
            Fill in the information below to get started:
          </p>

          <SignUpForm />

          <div className="mt-10 pb-8 sm:mt-11 sm:pb-9 md:mt-12 md:pb-10">
            <div className="relative">
              <div className="absolute inset-0 flex items-center" aria-hidden>
                <span className="w-full border-t border-line-weaker" />
              </div>
              <p className="relative mx-auto w-fit bg-surface-muted-50 px-3 text-sm text-text-brand-strong">
                Or sign up with
              </p>
            </div>
            <div className="mt-4">
              <SocialLogin />
            </div>
          </div>
        </div>
      </AuthShell>
    </main>
  );
}