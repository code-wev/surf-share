import type { LucideIcon } from "lucide-react";

type ContributorStatCardProps = {
  value: string;
  label: string;
  Icon: LucideIcon;
};

export default function ContributorStatCard({
  value,
  label,
  Icon,
}: ContributorStatCardProps) {
  return (
    <article className="mx-auto w-full max-w-115 p-4 text-center sm:p-5">
      <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-surface-muted-100 p-3.5 text-brand-default sm:h-16 sm:w-16 sm:p-4">
        <Icon size={20} strokeWidth={2} />
      </span>

      <p className="mt-4 text-[32px] font-bold leading-tight text-text-inverse-strong sm:mt-6 sm:text-[40px] lg:text-[48px]">
        {value}
      </p>
      <p className="mt-2 text-xs text-text-inverse-weak sm:text-sm lg:text-base">{label}</p>
    </article>
  );
}
