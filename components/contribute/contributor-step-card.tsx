import type { LucideIcon } from "lucide-react";

type ContributorStepCardProps = {
  title: string;
  description: string;
  Icon: LucideIcon;
};

export default function ContributorStepCard({
  title,
  description,
  Icon,
}: ContributorStepCardProps) {
  return (
    <article className="rounded-lg border border-[#D1D5DB] bg-[#EFF6FF] p-5 text-center max-w-115">
      <div className="mx-auto inline-flex h-16 w-16 p-4 items-center justify-center rounded-full bg-brand-default text-text-inverse-strong">
        <Icon size={20} strokeWidth={2.2} />
      </div>

      <h3 className="mt-6 text-[22px] font-medium leading-tight text-text-strong">{title}</h3>
      <p className="mt-2 text-base leading-5 text-text-weak">{description}</p>
    </article>
  );
}
