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
      <div className="md:px-12.5 md:py-25">
        <h2 className="text-center text-4xl font-bold text-text-strong sm:text-5xl lg:text-[64px]">
          Why Join SURFSHARE?
        </h2>

        <div className="mx-auto grid max-w-275 grid-cols-1 gap-x-20 gap-y-6 md:mt-16 md:grid-cols-2 lg:gap-x-75">
          <ul className="space-y-6">
            {leftColumnBenefits.map((benefit) => (
              <WhyJoinBenefitItem key={benefit} text={benefit} />
            ))}
          </ul>

          <ul className="space-y-6">
            {rightColumnBenefits.map((benefit) => (
              <WhyJoinBenefitItem key={benefit} text={benefit} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
