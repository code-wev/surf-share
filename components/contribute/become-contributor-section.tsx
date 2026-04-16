import ContributorPlanCard from "@/components/contribute/contributor-plan-card";

const contributorPlans = [
  {
    title: "Bronze Status",
    description: "Lorem Lorem LoremLorem LoremLorem LoremLoremLoremLorem Lorem Lorem Lorem",
    tone: "bronze",
    features: [
      { label: "Payment Split", value: "30% (Platform) / 70% (You)" },
      { label: "Max Photo Price", value: "$20" },
      { label: "Max Uploads", value: "10 per day" },
      { label: "Upload Limit", value: "First 10 upload" },
      { label: "Best for", value: "Beginners getting started" },
    ],
  },
  {
    title: "Silver Status",
    description: "Lorem Lorem LoremLorem LoremLorem LoremLoremLoremLorem Lorem Lorem Lorem",
    tone: "silver",
    highlighted: true,
    features: [
      { label: "Payment Split", value: "20% (Platform) / 80% (You)" },
      { label: "Max Photo Price", value: "Unlimited" },
      { label: "Max Uploads", value: "No daily limit" },
      { label: "Upload Limit", value: "No limit" },
      { label: "Best for", value: "Growing photographers" },
    ],
  },
  {
    title: "Gold Status",
    description: "Lorem Lorem LoremLorem LoremLorem LoremLoremLoremLorem Lorem Lorem Lorem",
    tone: "gold",
    features: [
      { label: "Payment Split", value: "10% (Platform) / 90% (You)" },
      { label: "Max Photo Price", value: "Unlimited" },
      { label: "Max Uploads", value: "No restrictions" },
      { label: "Upload Limit", value: "No limit" },
      { label: "Best for", value: "Professional photographers" },
    ],
  },
] as const;

export default function BecomeContributorSection() {
  return (
    <section className="bg-white">
      <div className="px-4 py-14 sm:px-6 md:px-12.5 md:py-25">
        <h2 className="text-center text-4xl font-bold text-text-strong sm:text-5xl lg:text-[64px]">
          Become A Contributor
        </h2>
        <p className="mt-9 text-center text-base text-text-weak lg:text-[28px]">
          Start with Bronze and get upgraded as you grow
        </p>

        <div className="mx-auto mt-16 grid max-w-325 grid-cols-1 gap-12 md:grid-cols-3">
          {contributorPlans.map((plan) => (
            <ContributorPlanCard
              key={plan.title}
              title={plan.title}
              description={plan.description}
              features={plan.features}
              tone={plan.tone}
              highlighted={"highlighted" in plan ? plan.highlighted : false}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
