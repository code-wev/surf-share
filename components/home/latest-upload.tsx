"use client";

import { usePublicPhotosQuery } from "@/hooks/api/usePhotos";
import { ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import CardView, { type CardViewItem } from "../shared/card-view";
import { PageTitle } from "../shared/page-title";
import { Button } from "../ui/button";

type PublicPhoto = {
  id: string;
  imageUrl: string;
  photographer?: {
    name?: string;
  };
  location?: {
    name?: string;
  };
  price: number;
};

export default function LatestUpload() {
  const { data, isLoading, isError } = usePublicPhotosQuery({
    sort: "latest",
    page: 1,
    limit: 8,
  });

  const photos = data?.data || [];

  const latestUploadItems: CardViewItem[] = (photos as PublicPhoto[]).map((p) => ({
    id: p.id,
    slug: p.id,
    src: p.imageUrl,
    alt: `Photo by ${p.photographer?.name}`,
    userName: p.photographer?.name || "Unknown",
    location: p.location?.name || "Unknown Location",
    price: `$${p.price.toFixed(2)}`,
    avatarSrc: "/home/logo.png",
  }));

  return (
    <section className="mb-10 bg-(--color-fill-hover) md:mb-25">
      <div className="mx-auto max-w-480 py-12 sm:px-6 md:px-8 lg:py-21">
        <div className="flex flex-col gap-5 px-4 sm:flex-row sm:items-end sm:justify-between">
          <PageTitle
            subtitle="Trending Now"
            subtitlePosition="top"
            title="Latest Uploads"
            titleClassName="mt-2 text-4xl text-(--color-text-strong) sm:text-[42px] md:text-5xl lg:text-[64px]"
            subtitleClassName="text-lg text-(--color-text-weak) sm:text-xl md:text-2xl lg:text-[34px]"
          />

          <Link href="/gallery">
            <Button className="cursor-pointer border border-(--color-line-weaker) bg-transparent font-medium text-(--color-text-brand-strong) transition-colors hover:bg-(--color-fill-hover)">
              View All <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="mt-8 px-4">
          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            </div>
          ) : isError ? (
            <div className="flex h-64 items-center justify-center">
              <p className="text-sm text-red-500">Failed to load photos.</p>
            </div>
          ) : (
            <CardView items={latestUploadItems} />
          )}
        </div>
        <div className="flex items-center justify-center text-center">
          <Link href="/gallery">
            <Button className="mt-12 cursor-pointer rounded-lg border border-(--color-icon-weaker) bg-(--color-fill-brand-strong) px-5 py-2 text-sm text-white shadow-md transition-colors duration-200 hover:bg-(--color-brand-hover) hover:shadow-lg">
              Browse More Photos <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
