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
    <article className="text-center max-w-115 mx-auto p-5">
      <span className="inline-flex h-16 w-16 p-4 items-center justify-center rounded-full bg-surface-muted-100 text-brand-default">
        <Icon size={20} strokeWidth={2} />
      </span>

      <p className="mt-6 text-[28px] font-bold leading-tight text-text-inverse-strong sm:text-[48px]">
        {value}
      </p>
      <p className="mt-2 text-sm text-text-inverse-weak lg:text-base">{label}</p>
    </article>
  );
}
