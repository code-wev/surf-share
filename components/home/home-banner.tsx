"use client";

import Link from "next/link";
import { PageTitle } from "../shared/page-title";
import { ArrowRight } from "lucide-react";
const HomeBanner = () => {
  return (
    <section className="relative mb-20 w-full">
      {/* Hero container */}
      <div className="relative min-h-[calc(100svh-78px)] overflow-hidden bg-[#d9d9d9] sm:min-h-[calc(100vh-68px)]">
        {/* Video Background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          poster="/home/banner.png"
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src="/home/banner.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Dark overlay for text contrast */}
        <div className="absolute inset-0 bg-black/55 md:bg-black/35" />

        {/* Content overlay */}
        <div className="relative z-10 flex min-h-[calc(100svh-68px)] items-end justify-start px-6 pb-10 text-start sm:min-h-[calc(100vh-68px)] md:mx-12.5 lg:px-6 lg:pb-39">
          <div className="max-w-5xl">
            <PageTitle
              title="Find Your Waves, Captured Forever."
              titleClassName="text-(--color-text-inverse-strong)! text-[62px]! lg:text-[96px] xl:text-[122px]! max-w-[1300px]!"
              className=""
            />
            {/* Buttons */}
            <div className="mt-12 flex flex-col items-start justify-start gap-3 sm:flex-row sm:gap-6">
              <Link
                href="/properties"
                className="s inline-flex min-w-10 items-center justify-center gap-x-2 rounded-lg border border-(--color-icon-weaker) bg-(--color-fill-brand-strong) px-5 py-2 text-base text-white shadow-md transition-colors duration-200 hover:bg-(--color-brand-hover) hover:shadow-lg"
              >
                Browse Gallery
                <ArrowRight className="h-5 w-5" color="#FFFFFF" />
              </Link>

              <Link
                href="/services"
                className="inline-flex min-w-10 items-center justify-center gap-x-2 rounded-lg border border-(--color-line-brand-strong) bg-(--color-fill-inverse-weak) px-5 py-2.5 text-sm text-(--color-line-brand-strong) transition-colors duration-200 hover:bg-white/30"
              >
                Explore Location
                <ArrowRight className="h-5 w-5" color="#0C3173" />
              </Link>
            </div>
          </div>
        </div>

        {/* Full whitish shadow at the bottom of the banner */}
        <div
          aria-hidden
          className="pointer-events-none absolute right-0 bottom-0 left-0 h-36 bg-linear-to-b from-transparent via-white/45 to-white/90 sm:h-44"
        />

        <div
          aria-hidden
          className="pointer-events-none absolute right-0 bottom-5 left-0 mx-auto h-20 w-[96%] rounded-full bg-white/70 blur-3xl sm:bottom-8 sm:h-28 sm:w-[90%]"
        />
      </div>
    </section>
  );
};

export default HomeBanner;
