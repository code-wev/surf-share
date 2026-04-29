const numberStats = [
  { value: "150+", label: "Surf Locations" },
  { value: "500+", label: "Photographers" },
  { value: "50K+", label: "Photos" },
  { value: "100K+", label: "Downloads" },
] as const;

export default function AboutNumbersSection() {
  return (
    <section className="bg-brand-default">
      <div className="mx-auto max-w-470 px-4 py-14 text-center sm:px-6 sm:py-16 md:px-10 md:py-18 lg:px-12.5 lg:py-22 2xl:py-25">
        <h2 className="text-4xl font-bold text-text-inverse-strong sm:text-5xl lg:text-[64px]">
          SurfShare by the Numbers
        </h2>

        <div className="mx-auto mt-4 grid max-w-275 grid-cols-2 gap-y-7 sm:mt-6 sm:grid-cols-4 lg:mt-9">
          {numberStats.map((item) => (
            <div key={item.label} className="p-2 sm:p-3 lg:p-5">
              <p className="text-3xl font-bold text-text-inverse-strong sm:text-4xl lg:text-[48px]">
                {item.value}
              </p>
              <p className="mt-1 text-sm font-medium text-text-inverse-weak sm:text-base">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
