import { Check } from "lucide-react";

type WhyJoinBenefitItemProps = {
  text: string;
};

export default function WhyJoinBenefitItem({ text }: WhyJoinBenefitItemProps) {
  return (
    <li className="flex items-center gap-2.5">
      <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-default text-text-inverse-strong">
        <Check size={12} strokeWidth={2.5} />
      </span>
      <span className="text-sm text-text-weak lg:text-base">{text}</span>
    </li>
  );
}
