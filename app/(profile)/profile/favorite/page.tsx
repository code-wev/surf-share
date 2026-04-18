export default function ProfileFavoritePage() {
  return (
    <div className="h-full px-4 py-4 sm:px-6 sm:py-6 md:px-0 md:py-0">
      <section className="flex h-full flex-col">
        <h1 className="border-line-weaker text-text-brand-strong inline-flex w-fit border-b pb-2.5 text-lg font-semibold md:text-[18px] md:leading-tight">
          Favorites
        </h1>

        <p className="text-text-weak mt-6 text-sm leading-relaxed md:mt-10 md:max-w-140">
          Save your preferred photos here so you can access them quickly anytime.
        </p>
      </section>
    </div>
  );
}
