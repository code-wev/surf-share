import AboutCommunityCtaSection from "@/components/about/about-community-cta-section";
import AboutHeroSection from "@/components/about/about-hero-section";
import AboutMissionSection from "@/components/about/about-mission-section";
// import AboutNumbersSection from "@/components/about/about-numbers-section";
import AboutStorySection from "@/components/about/about-story-section";
import AboutValuesSection from "@/components/about/about-values-section";

export default function AboutPage() {
  return (
    <>
      <AboutHeroSection />
      <AboutMissionSection />
      <AboutStorySection />
      <AboutValuesSection />
      {/* <AboutNumbersSection /> */}
      <AboutCommunityCtaSection />
    </>
  );
}
