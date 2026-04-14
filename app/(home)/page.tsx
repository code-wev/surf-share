import FeaturedLocation from "@/components/home/featured-location";
import HomeBanner from "@/components/home/home-banner";
import LatestUpload from "@/components/home/latest-upload";

export default function Home() {
  return (
    <>
      <HomeBanner />
      <FeaturedLocation />
      <LatestUpload />
    </>
  );
}
