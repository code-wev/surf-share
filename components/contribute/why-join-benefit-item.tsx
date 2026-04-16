import { Check } from "lucide-react";

type WhyJoinBenefitItemProps = {
  text: string;
};

export default function WhyJoinBenefitItem({ text }: WhyJoinBenefitItemProps) {
  return (
    <li className="flex items-center gap-2 sm:gap-2.5">
      <span className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-brand-default text-text-inverse-strong sm:h-5 sm:w-5">
        <Check size={12} strokeWidth={2.5} />
      </span>
      <span className="text-xs leading-5 text-text-weak sm:text-sm lg:text-base">{text}</span>
    </li>
  );
}
