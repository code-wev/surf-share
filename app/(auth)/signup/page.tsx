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
            <h1 className="text-text-strong text-4xl leading-[1.05] font-bold tracking-tight sm:text-5xl md:text-6xl 2xl:text-[64px]">
              Create Your Profile
            </h1>
          </div>

          <p className="text-text-weak mt-3 text-lg leading-tight font-medium sm:mt-4 sm:text-2xl md:text-[28px]">
            Fill in the information below to get started:
          </p>

          <SignUpForm />

          <div className="mt-10 pb-8 sm:mt-11 sm:pb-9 md:mt-12 md:pb-10">
            <div className="relative">
              <div className="absolute inset-0 flex items-center" aria-hidden>
                <span className="border-line-weaker w-full border-t" />
              </div>
              <p className="bg-surface-muted-50 text-text-brand-strong relative mx-auto w-fit px-3 text-sm">
                Or sign up with
              </p>
            </div>
            <div className="mt-6">
              <SocialLogin buttonText="Signup with Google" />
            </div>
          </div>
        </div>
      </AuthShell>
    </main>
  );
}
