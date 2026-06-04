"use client";

import CardView from "@/components/shared/card-view";
import { useMyFavoritesQuery } from "@/hooks/api/useFavorites";
import { Loader2 } from "lucide-react";
import { getAbsoluteImageUrl } from "@/lib/utils";

type ApiPhoto = {
  id: string;
  imageUrl: string;
  price: number;
  photographer?: { name?: string };
  location?: { name?: string };
};

export default function FavoriteImages() {
  const { data: favoritesResponse, isLoading } = useMyFavoritesQuery();
  const photos = favoritesResponse?.data || [];

  const mappedPhotos = photos.map((p: ApiPhoto) => ({
    id: p.id,
    slug: p.id,
    src: getAbsoluteImageUrl(p.imageUrl),
    alt: `Photo by ${p.photographer?.name}`,
    userName: p.photographer?.name || "Unknown",
    location: p.location?.name || "Unknown Location",
    price: `$${p.price.toFixed(2)}`,
    avatarSrc: "/home/logo.png",
    favoriteActive: true, // They are definitely favorite on this page!
  }));

  return (
    <section className="h-full px-4 py-4 sm:px-6 sm:py-6 md:px-0 md:py-0">
      <div className="flex h-full flex-col">
        <h1 className="inline-flex w-fit border-b-2 border-[#0C3173] pb-2.5 text-lg font-semibold text-(--color-text-brand-strong) md:text-[18px] md:leading-tight">
          Favourite Photos
        </h1>

        <p className="mt-6 text-sm leading-relaxed text-(--color-text-weak) md:mt-10 md:max-w-140">
          Save your preferred photos here so you can access them quickly anytime.
        </p>

        <div className="mt-8 px-4">
          {isLoading ? (
            <div className="flex justify-center p-10">
              <Loader2 className="h-6 w-6 animate-spin text-(--color-text-brand-strong)" />
            </div>
          ) : mappedPhotos.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-(--color-line-weaker) py-20 text-center">
              <p className="font-medium text-(--color-text-strong)">No favourites yet</p>
              <p className="mt-1 text-sm text-(--color-text-weak)">
                Photos you favourite will appear here.
              </p>
            </div>
          ) : (
            <CardView items={mappedPhotos} desktopColumns={3} />
          )}
        </div>
      </div>
    </section>
  );
}
