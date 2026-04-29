import { Camera, DollarSign, Upload } from "lucide-react";

import ContributorStepCard from "@/components/contribute/contributor-step-card";

const contributorSteps = [
  {
    title: "Sign Up as Contributor",
    description: "Create your photographer account and complete verification.",
    Icon: Camera,
  },
  {
    title: "Upload Your Shots",
    description: "Add metadata, select pricing tier, and submit for approval.",
    Icon: Upload,
  },
  {
    title: "Earn Money",
    description: "Receive a commission on every sale, paid directly to your PayPal account.",
    Icon: DollarSign,
  },
] as const;

export default function HowItWorksSection() {
  return (
    <section className="bg-surface-muted-100">
      <div className="mx-auto max-w-470 px-4 py-14 sm:px-6 sm:py-16 md:px-10 md:py-20 lg:px-12.5 lg:py-22 2xl:py-25">
        <h2 className="text-center text-4xl font-semibold text-text-strong sm:text-5xl lg:text-[64px]">
          How It Works
        </h2>
        <p className="mt-6 text-center text-sm text-text-weak sm:mt-7 sm:text-base lg:mt-9 lg:text-[28px]">
          Start selling your surf photography in three simple steps
        </p>

        <div className="mx-auto mt-10 grid max-w-360 grid-cols-1 gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-5 lg:mt-16 lg:grid-cols-3 lg:gap-6">
          {contributorSteps.map((step) => (
            <ContributorStepCard
              key={step.title}
              title={step.title}
              description={step.description}
              Icon={step.Icon}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
