import FeaturedLocation from "@/components/home/featured-location";
import GetMoment from "@/components/home/get-moment";
import HomeBanner from "@/components/home/home-banner";
import HowItWorks from "@/components/home/how-it-works";
import IsPhotographer from "@/components/home/is-photographer";
import LatestUpload from "@/components/home/latest-upload";

export default function Home() {
  return (
    <>
      <HomeBanner />
      <FeaturedLocation />
      <LatestUpload />
      <HowItWorks />
      <IsPhotographer />
      <GetMoment />
    </>
  );
}
