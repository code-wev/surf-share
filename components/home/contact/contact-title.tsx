import { PageTitle } from "@/components/shared/page-title";

export default function ContactTitle() {
  return (
    <section className="bg-(--color-brand-disabled)">
      <div className="px-4 py-10 md:py-43">
        <PageTitle
          align="center"
          title="Contact Us"
          subtitle="Have a question or need help? We're here for you."
          titleClassName="text-[34px]! lg:text-[64px]! text-(--color-text-brand-strong)!"
          subtitleClassName="text-[18px]! lg:text-[28px]! text-(--color-text-weak)!"
        />
      </div>
    </section>
  );
}
