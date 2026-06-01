import BecomeContributorSection from "@/components/contribute/become-contributor-section";
import ContributeHeroSection from "@/components/contribute/contribute-hero-section";
import ContributorReadyCtaSection from "@/components/contribute/contributor-ready-cta-section";
// import ContributorStatsSection from "@/components/contribute/contributor-stats-section";
import HowItWorksSection from "@/components/contribute/how-it-works-section";
import WhyJoinSection from "@/components/contribute/why-join-section";

export default function ContributePage() {
  return (
    <>
      <ContributeHeroSection />
      <HowItWorksSection />
      <WhyJoinSection />
      {/* <ContributorStatsSection /> */}
      <BecomeContributorSection />
      <ContributorReadyCtaSection />
    </>
  );
}
