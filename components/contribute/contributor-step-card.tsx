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
    <article className="mx-auto w-full max-w-115 rounded-lg border border-line-weak bg-fill-hover p-4 text-center sm:p-5 lg:p-6">
      <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-brand-default p-3.5 text-text-inverse-strong sm:h-16 sm:w-16 sm:p-4">
        <Icon size={20} strokeWidth={2.2} />
      </div>

      <h3 className="mt-5 text-xl font-medium leading-tight text-text-strong sm:mt-6 sm:text-[22px]">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-5 text-text-weak sm:text-base">{description}</p>
    </article>
  );
}
