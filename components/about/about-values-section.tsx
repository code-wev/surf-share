import { Camera, Heart, Target, Users } from "lucide-react";

const valueCards = [
  {
    title: "Exceptional Imagery",
    description: "Only the best surf moments — captured by Australia's most talented photographers.",
    Icon: Camera,
  },
  {
    title: "Built for the Community",
    description: "A platform shaped by surfers and creators, celebrating the culture that brings us together.",
    Icon: Users,
  },
  {
    title: "Creator Powered, Creator Paid",
    description: "Fair, transparent earnings that respect the craft and sustain the people behind the lens.",
    Icon: Heart,
  },
  {
    title: "Simple by Design",
    description: "Clean, intuitive tools that make uploading, browsing, and buying feel effortless.",
    Icon: Target,
  },
] as const;

export default function AboutValuesSection() {
  return (
    <section className="">
      <div className="px-4 py-14 sm:px-6 sm:py-16 md:px-10 md:py-20 lg:px-12.5 lg:py-22 2xl:py-25">
        <h2 className="text-center text-4xl font-bold text-text-strong sm:text-5xl lg:text-[64px]">
          Our Values
        </h2>

        <div className="mt-4 mx-auto max-w-360 grid grid-cols-1 gap-4 sm:mt-6 sm:grid-cols-2 sm:gap-5 lg:mt-9 lg:grid-cols-4 lg:gap-4 xl:gap-6">
          {valueCards.map((item) => (
            <article
              key={item.title}
              className="rounded-md border border-line-weaker bg-fill-hover px-4 py-5 text-center sm:px-5"
            >
              <span className="mx-auto inline-flex h-11 w-11 items-center justify-center rounded-full bg-brand-default text-text-inverse-strong">
                <item.Icon size={18} strokeWidth={2.1} />
              </span>

              <h3 className="mt-4 text-base font-semibold text-text-strong">{item.title}</h3>
              <p className="mt-2 text-sm leading-5 text-text-weak">{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
