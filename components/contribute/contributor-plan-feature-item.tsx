import { Sparkles } from "lucide-react";

type ContributorPlanFeatureItemProps = {
  label: string;
  value: string;
};

export default function ContributorPlanFeatureItem({
  label,
  value,
}: ContributorPlanFeatureItemProps) {
  return (
    <li className="flex items-start gap-4">
      <span className="mt-0.5 inline-flex shrink-0 text-brand-default">
        <Sparkles size={12} strokeWidth={2.4} />
      </span>

      <p className="text-sm leading-5 text-text-weak lg:text-base">
        <span className="text-brand-default">{label}</span>: {value}
      </p>
    </li>
  );
}
