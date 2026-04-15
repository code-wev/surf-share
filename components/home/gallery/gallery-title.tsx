import { PageTitle } from "@/components/shared/page-title";

export default function GalleryTitle() {
  return (
    <section className="px-4 py-10 sm:px-6 md:mx-12.5 md:px-0 md:py-25">
      <div className="flex justify-between md:flex-row">
        <div>
          <PageTitle
            subtitle="Trigg Beach, WA Photos"
            subtitleClassName="mt-2 text-[22px]! text-(--color-text-weak)! sm:text-lg!"
          />
        </div>
        <div>
          <p>Tabs</p>
        </div>
        <div className="flex flex-row">
          <p>Images count</p>
          <p>Filter</p>
        </div>
      </div>
    </section>
  );
}
