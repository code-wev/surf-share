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
      className={`mx-auto h-full max-w-100 rounded-lg border border-[#D1D5DB] px-5 py-12 ${
        highlighted ? "bg-[#EFF6FF] shadow-[0_8px_16px_rgba(15,23,42,0.08)]" : "bg-white"
      }`}
    >
      <span className={`flex items-center justify-center h-12 w-12 ${toneStyles[tone]}`}>
        <Crown size={36} strokeWidth={2} />
      </span>

      <h3 className="mt-12 text-[28px] font-medium leading-tight text-brand-default">{title}</h3>
      <p className="my-6 text-sm leading-5 text-text-weak lg:text-base">{description}</p>

      <div className="border-t border-[#E5E7EB] pt-6">
        <ul className="space-y-6">
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
