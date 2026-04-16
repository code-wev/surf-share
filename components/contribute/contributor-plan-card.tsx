import { Crown } from "lucide-react";

import ContributorPlanFeatureItem from "@/components/contribute/contributor-plan-feature-item";

type PlanFeature = {
  label: string;
  value: string;
};

type ContributorPlanCardProps = {
  title: string;
  description: string;
  features: readonly PlanFeature[];
  tone: "bronze" | "silver" | "gold";
  highlighted?: boolean;
};

const toneStyles = {
  bronze: "text-[#A16207]",
  silver: "text-[#94A3B8]",
  gold: "text-[#EAB308]",
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
      className={`mx-auto h-full w-full max-w-100 rounded-lg border border-[#D1D5DB] p-5 sm:p-6 md:p-4 lg:px-5 lg:py-12 ${
        highlighted ? "bg-[#EFF6FF] shadow-[0_8px_16px_rgba(15,23,42,0.08)]" : "bg-white"
      }`}
    >
      <span className={`flex h-10 w-10 items-center justify-center sm:h-12 sm:w-12 ${toneStyles[tone]}`}>
        <Crown size={36} strokeWidth={2} />
      </span>

      <h3 className="mt-6 text-2xl font-medium leading-tight text-brand-default sm:mt-8 sm:text-[26px] lg:mt-12 lg:text-[28px]">
        {title}
      </h3>
      <p className="my-4 text-sm leading-5 text-text-weak sm:my-5 lg:my-6 lg:text-base">
        {description}
      </p>

      <div className="border-t border-[#E5E7EB] pt-4 sm:pt-5 lg:pt-6">
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
