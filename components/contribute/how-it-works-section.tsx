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
    description: "Receive 70% commission on every sale, paid directly to your PayPal.",
    Icon: DollarSign,
  },
] as const;

export default function HowItWorksSection() {
  return (
    <section className="bg-surface-muted-100">
      <div className="px-12.5 py-25">
        <h2 className="text-center text-4xl font-semibold text-text-strong sm:text-5xl lg:text-[64px]">
          How It Works
        </h2>
        <p className="mt-9 text-center text-base text-text-weak lg:text-[28px]">
          Start selling your surf photography in three simple steps
        </p>

        <div className="max-w-360 mx-auto mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
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
