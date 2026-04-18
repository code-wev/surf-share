export default function ProfileDownloadPage() {
  return (
    <div className="h-full px-4 py-4 sm:px-6 sm:py-6 md:px-0 md:py-0">
      <section className="flex h-full flex-col">
        <h1 className="border-line-weaker text-text-brand-strong inline-flex w-fit border-b pb-2.5 text-lg font-semibold md:text-[18px] md:leading-tight">
          Downloads
        </h1>

        <p className="text-text-weak mt-6 text-sm leading-relaxed md:mt-10 md:max-w-140">
          All downloadable files from your purchases will be listed in this section.
        </p>
      </section>
    </div>
  );
}
