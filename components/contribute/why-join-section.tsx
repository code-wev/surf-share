import WhyJoinBenefitItem from "@/components/contribute/why-join-benefit-item";

const leftColumnBenefits = [
  "Earn 70% commission on all sales",
  "Instant PayPal payouts",
  "Analytics and sales tracking",
  "Reach thousands of surfers",
] as const;

const rightColumnBenefits = [
  "Automatic watermarking for protection",
  "Professional photographer profile",
  "No upfront costs or subscription fees",
  "Easy-to-use upload system",
] as const;

export default function WhyJoinSection() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-470 px-4 py-14 sm:px-6 sm:py-16 md:px-10 md:py-20 lg:px-12.5 lg:py-22 2xl:py-25">
        <h2 className="text-center text-4xl font-bold text-text-strong sm:text-5xl lg:text-[64px]">
          Why Join SURFSHARE?
        </h2>

        <div className="mx-auto mt-10 grid max-w-275 grid-cols-1 gap-x-12 gap-y-6 sm:mt-12 md:mt-16 md:grid-cols-2 lg:gap-x-24 2xl:gap-x-75">
          <ul className="space-y-4 sm:space-y-5 lg:space-y-6">
            {leftColumnBenefits.map((benefit) => (
              <WhyJoinBenefitItem key={benefit} text={benefit} />
            ))}
          </ul>

          <ul className="space-y-4 sm:space-y-5 lg:space-y-6">
            {rightColumnBenefits.map((benefit) => (
              <WhyJoinBenefitItem key={benefit} text={benefit} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
