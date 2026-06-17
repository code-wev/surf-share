import ContributorPlanCard from "@/components/contribute/contributor-plan-card";

const contributorPlans = [
  {
    title: "Bronze Status",
    // description:
    //   "Bronze status is perfect for new contributors starting out on their surf photography journey.",
    tone: "bronze",
    features: [
      { label: "Payment Split", value: "70% (You) / 30% (Platform)" },
      { label: "Max Photo Price", value: "$20" },
      { label: "Max Uploads", value: "10 per day" },
      { label: "Upload Limit", value: "First 10 upload" },
    ],
  },
  {
    title: "Silver Status",
    // description:
    //   "Silver status is ideal for contributors who have established themselves in the surf photography community.",
    tone: "silver",
    // highlighted: true,
    features: [
      { label: "Payment Split", value: "80% (You) / 20% (Platform)" },
      { label: "Max Photo Price", value: "$50" },
      { label: "Max Uploads", value: "No daily limit" },
      { label: "Upload Limit", value: "No limit" },
    ],
  },
  {
    title: "Gold Status",
    // description:
    //   "Gold status is for top-tier contributors who have made significant impact in the surf photography community.",
    tone: "gold",
    features: [
      { label: "Payment Split", value: "90% (You) / 10% (Platform)" },
      { label: "Max Photo Price", value: "$50" },
      { label: "Max Uploads", value: "No restrictions" },
      { label: "Upload Limit", value: "No limit" },
    ],
  },
  // {
  //   title: "Gold Plus Status",
  //   // description:
  //   //   "The ultimate tier reserved for legendary contributors.",
  //   tone: "gold-plus",
  //   highlighted: true,
  //   features: [
  //     { label: "Payment Split", value: "100% (You) / 0% (Platform)" },
  //     { label: "Max Photo Price", value: "$50" },
  //     { label: "Max Uploads", value: "No restrictions" },
  //     { label: "Upload Limit", value: "No limit" },
  //   ],
  // },
] as const;

export default function BecomeContributorSection() {
  return (
    <section className="bg-white">
      {/* border-t border-brand-default */}
      <div className="mx-auto max-w-470 px-4 py-14 sm:px-6 sm:py-16 md:px-8 md:py-20 lg:px-12.5 lg:py-22 2xl:py-25">
        <h2 className="text-text-strong text-center text-4xl font-bold sm:text-5xl lg:text-[64px]">
          Become A Contributor
        </h2>
        <p className="text-text-weak mt-6 text-center text-sm sm:mt-7 sm:text-base lg:mt-9 lg:text-[28px]">
          Start with Bronze and get upgraded as you grow
        </p>

        <div className="mx-auto mt-10 grid max-w-325 grid-cols-1 gap-6 sm:mt-12 md:mt-10 md:grid-cols-2 lg:grid-cols-3 md:gap-4 lg:mt-12 lg:gap-7 xl:mt-16 xl:gap-8">
          {contributorPlans.map((plan) => (
            <ContributorPlanCard
              key={plan.title}
              title={plan.title}
              // description={plan.description}
              features={plan.features}
              tone={plan.tone}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
