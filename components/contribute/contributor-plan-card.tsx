import { Crown } from "lucide-react";

import ContributorPlanFeatureItem from "@/components/contribute/contributor-plan-feature-item";

type PlanFeature = {
  label: string;
  value: string;
};

type ContributorPlanCardProps = {
  title: string;
  description?: string;
  features: readonly PlanFeature[];
  tone: "bronze" | "silver" | "gold" | "gold-plus";
  highlighted?: boolean;
};

const toneStyles = {
  bronze: "text-contribute-tier-bronze",
  silver: "text-contribute-tier-silver",
  gold: "text-contribute-tier-gold",
  "gold-plus": "text-[#4B0082]",
} as const;

export default function ContributorPlanCard({
  title,
  description,
  features,
  tone,
  highlighted = false,
}: ContributorPlanCardProps) {
  return (
    <article
      className={`border-line-weak mx-auto h-full w-full max-w-100 rounded-lg border p-5 sm:p-6 md:p-4 lg:px-5 lg:py-12 ${
        highlighted ? "bg-fill-hover contribute-plan-highlight-shadow" : "bg-white"
      }`}
    >
      <span
        className={`flex h-10 w-10 items-center justify-center sm:h-12 sm:w-12 ${toneStyles[tone]}`}
      >
        <Crown size={36} strokeWidth={2} />
      </span>

      <h3 className="text-brand-default mt-6 text-2xl leading-tight font-medium sm:mt-8 sm:text-[26px] lg:mt-12 lg:text-[28px]">
        {title}
      </h3>
      <p className="text-text-weak my-4 text-sm leading-5 sm:my-5 lg:my-6 lg:text-base">
        {description}
      </p>

      <div className="border-line-weaker border-t pt-4 sm:pt-5 lg:pt-6">
        <ul className="space-y-4 lg:space-y-6">
          {features.map((feature) => (
            <ContributorPlanFeatureItem
              key={feature.label}
              label={feature.label}
              value={feature.value}
            />
          ))}
        </ul>
      </div>
    </article>
  );
}
