"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Camera } from "lucide-react";

import { cn } from "@/lib/utils";
import ImageCard from "../shared/image-card";
import { PageTitle } from "../shared/page-title";
import { Button } from "../ui/button";

type FeaturedCard = {
  id: number;
  src: string;
  alt: string;
  title: string;
  photoCount: number;
};

const featuredCards: FeaturedCard[] = [
  {
    id: 1,
    src: "/home/featured/feat1.jpg",
    alt: "Australia beach location 1",
    title: "Australia Beach",
    photoCount: 1516,
  },
  {
    id: 2,
    src: "/home/featured/feat2.jpg",
    alt: "Australia beach location 2",
    title: "Australia Beach",
    photoCount: 1516,
  },
  {
    id: 3,
    src: "/home/featured/feat3.jpg",
    alt: "Australia beach location 3",
    title: "Australia Beach",
    photoCount: 1516,
  },
  {
    id: 4,
    src: "/home/featured/feat4.jpg",
    alt: "Australia beach location 4",
    title: "Australia Beach",
    photoCount: 1516,
  },
  {
    id: 5,
    src: "/home/featured/feat1.jpg",
    alt: "Australia beach location 5",
    title: "Australia Beach",
    photoCount: 1516,
  },
  {
    id: 6,
    src: "/home/featured/feat2.jpg",
    alt: "Australia beach location 6",
    title: "Australia Beach",
    photoCount: 1516,
  },
  {
    id: 7,
    src: "/home/featured/feat3.jpg",
    alt: "Australia beach location 7",
    title: "Australia Beach",
    photoCount: 1516,
  },
  {
    id: 8,
    src: "/home/featured/feat4.jpg",
    alt: "Australia beach location 8",
    title: "Australia Beach",
    photoCount: 1516,
  },
];

function getCardsPerView(width: number) {
  if (width >= 1024) return 4;
  if (width >= 640) return 2;

  return 1;
}

export default function FeaturedLocation() {
  const [cardsPerView, setCardsPerView] = useState(4);
  const [activeIndex, setActiveIndex] = useState(0);

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

  const maxIndex = useMemo(() => Math.max(0, featuredCards.length - cardsPerView), [cardsPerView]);

  const dotCount = maxIndex + 1;
  const clampedActiveIndex = Math.min(activeIndex, maxIndex);
  const translatePercent = (clampedActiveIndex * 100) / cardsPerView;

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

      <div className="mt-12 overflow-hidden">
        <div
          className="-mx-2.5 flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${translatePercent}%)` }}
        >
          {featuredCards.map((card) => (
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
                    <div className="flex items-center gap-1.5 text-sm text-white/90">
                      <Camera className="h-3.5 w-3.5" />
                      <span>{card.photoCount}</span>
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
    </section>
  );
}
