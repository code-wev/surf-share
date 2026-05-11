"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Camera, MapPin, RefreshCw } from "lucide-react";

import { useLocationsQuery } from "@/hooks/api/useLocations";
import { cn } from "@/lib/utils";
import ImageCard from "../shared/image-card";
import { PageTitle } from "../shared/page-title";
import { Button } from "../ui/button";

type FeaturedLocationCard = {
  id: string;
  src: string;
  alt: string;
  title: string;
  subtitle: string;
  photoCount: number;
};

type LocationApiItem = {
  id: string;
  name: string;
  parentSpot?: string | null;
  region: string;
  state: string;
  photosAvailable: number;
  previewImage: string;
};

function getCardsPerView(width: number) {
  if (width >= 1024) return 4;
  if (width >= 640) return 2;

  return 1;
}

export default function FeaturedLocation() {
  const [cardsPerView, setCardsPerView] = useState(4);
  const [activeIndex, setActiveIndex] = useState(0);
  const { data, isLoading, isError, refetch } = useLocationsQuery({
    page: 1,
    limit: 8,
  });

  useEffect(() => {
    const updateCardsPerView = () => {
      setCardsPerView(getCardsPerView(window.innerWidth));
    };

    updateCardsPerView();
    window.addEventListener("resize", updateCardsPerView);

    return () => {
      window.removeEventListener("resize", updateCardsPerView);
    };
  }, []);

  const featuredLocations = useMemo<FeaturedLocationCard[]>(() => {
    const locations = (data?.data ?? []) as LocationApiItem[];

    return locations.map((location) => ({
      id: location.id,
      src: location.previewImage,
      alt: `${location.name} location preview`,
      title: location.name,
      subtitle: location.parentSpot || `${location.region}, ${location.state}`,
      photoCount: location.photosAvailable,
    }));
  }, [data?.data]);

  const maxIndex = useMemo(
    () => Math.max(0, featuredLocations.length - cardsPerView),
    [cardsPerView, featuredLocations.length],
  );

  const dotCount = maxIndex + 1;
  const clampedActiveIndex = Math.min(activeIndex, maxIndex);
  const translatePercent = (clampedActiveIndex * 100) / cardsPerView;

  const isEmpty = !isLoading && !isError && featuredLocations.length === 0;

  return (
    <section className="mx-auto mb-24 max-w-480 px-4 sm:px-6 md:px-12.5">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <PageTitle
          subtitle="Surf Spots"
          subtitlePosition="top"
          title="Featured Locations"
          titleClassName="mt-2 text-2xl! md:text-[64px]! text-(--color-text-strong)"
          subtitleClassName="text-xl! text-(--color-text-weak) sm:text-[34px]!"
        />

        <Link href="/map">
          <Button className="border-(--color-line-weaker)font-medium cursor-pointer border bg-transparent text-(--color-text-brand-strong) transition-colors hover:bg-(--color-fill-hover)">
            View All <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="mt-12 overflow-hidden">
          <div className="-mx-2.5 flex">
            {Array.from({ length: cardsPerView }, (_, index) => (
              <div
                key={index}
                className="shrink-0 px-2.5"
                style={{ width: `${100 / cardsPerView}%` }}
              >
                <div className="group relative w-full overflow-hidden rounded-sm">
                  <div className="aspect-3/4 w-full animate-pulse bg-(--color-fill-hover)" />
                  <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/75 via-black/35 to-transparent p-4 sm:p-5">
                    <div className="h-7 w-3/4 animate-pulse rounded bg-white/20" />
                    <div className="mt-3 h-4 w-1/2 animate-pulse rounded bg-white/20" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : isError ? (
        <div className="mt-12 rounded-sm border border-(--color-line-weaker) bg-(--color-fill-hover) px-6 py-10 text-center">
          <p className="text-base text-(--color-text-weak)">
            Unable to load featured locations right now.
          </p>
          <Button
            type="button"
            onClick={() => refetch()}
            className="mt-4 border border-(--color-line-weaker) bg-transparent font-medium text-(--color-text-brand-strong) transition-colors hover:bg-(--color-fill-hover)"
          >
            <RefreshCw className="h-4 w-4" />
            Retry
          </Button>
        </div>
      ) : isEmpty ? (
        <div className="mt-12 rounded-sm border border-dashed border-(--color-line-weaker) bg-(--color-fill-hover) px-6 py-10 text-center">
          <p className="text-base text-(--color-text-weak)">No locations are available yet.</p>
        </div>
      ) : (
        <>
          <div className="mt-12 overflow-hidden">
            <div
              className="-mx-2.5 flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${translatePercent}%)` }}
            >
              {featuredLocations.map((card) => (
                <div
                  key={card.id}
                  className="shrink-0 px-2.5"
                  style={{ width: `${100 / cardsPerView}%` }}
                >
                  <ImageCard
                    src={card.src}
                    alt={card.alt}
                    width={960}
                    height={1280}
                    className="rounded-sm"
                    imageClassName="aspect-[3/4] w-full object-cover"
                    infoClassName="p-4 sm:p-5"
                    info={
                      <div className="space-y-1.5">
                        <p className="text-[22px]! leading-none font-medium sm:text-[36px]">
                          {card.title}
                        </p>
                        <p className="inline-flex items-center gap-1.5 text-sm text-white/90">
                          <MapPin className="h-3.5 w-3.5" />
                          <span>{card.subtitle}</span>
                        </p>
                        <div className="flex items-center gap-1.5 text-sm text-white/90">
                          <Camera className="h-3.5 w-3.5" />
                          <span>{card.photoCount.toLocaleString()} photos available</span>
                        </div>
                      </div>
                    }
                  />
                </div>
              ))}
            </div>
          </div>

          {dotCount > 1 ? (
            <div className="mt-8 flex items-center justify-center gap-3">
              {Array.from({ length: dotCount }, (_, index) => (
                <button
                  key={index}
                  type="button"
                  aria-label={`Go to location slide ${index + 1}`}
                  aria-current={index === clampedActiveIndex ? "true" : undefined}
                  onClick={() => setActiveIndex(index)}
                  className={cn(
                    "h-3.5 w-3.5 rounded-full transition-colors",
                    index === clampedActiveIndex
                      ? "bg-(--color-fill-brand-strong)"
                      : "bg-(--color-line-weaker) hover:bg-(--color-line-weak)",
                  )}
                />
              ))}
            </div>
          ) : null}
        </>
      )}
    </section>
  );
}
