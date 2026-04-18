import Image from "next/image";
import { Camera, ExternalLink, Heart, Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import ImageCard from "./image-card";

export type CardViewItem = {
  id: string | number;
  slug?: string;
  src: string;
  alt: string;
  title?: string;
  photoCount?: number;
  userName?: string;
  location?: string;
  price?: string;
  avatarSrc?: string;
  size?: "tall" | "short";
  favoriteActive?: boolean;
  plusActive?: boolean;
  showInfoByDefault?: boolean;
};

type CardViewProps = {
  items: CardViewItem[];
  className?: string;
  desktopColumns?: 3 | 4;
};

// Define How many grids will be in desktop
const desktopColumnPatternByCount: Record<3 | 4, Array<["tall" | "short", "tall" | "short"]>> = {
  3: [
    ["tall", "short"],
    ["short", "tall"],
    ["tall", "short"],
  ],
  4: [
    ["tall", "short"],
    ["short", "tall"],
    ["tall", "short"],
    ["short", "tall"],
  ],
};
const tabletColumnPattern: Array<{
  indices: [number, number, number, number];
  sizes: ["tall" | "short", "tall" | "short", "tall" | "short", "tall" | "short"];
}> = [
  { indices: [0, 2, 4, 6], sizes: ["tall", "short", "tall", "short"] },
  { indices: [1, 3, 5, 7], sizes: ["short", "tall", "short", "tall"] },
];

function getHeightClass(size: "tall" | "short") {
  return size === "tall" ? "h-[540px]" : "h-[380px]";
}

function getTabletHeightClass(size: "tall" | "short") {
  return size === "tall" ? "h-[420px] md:h-[500px]" : "h-[300px] md:h-[360px]";
}

function getDetailsHref(item: CardViewItem) {
  return `/gallery/${item.slug ?? item.id}`;
}

function buildInfo(item: CardViewItem) {
  const hasUserInfo = Boolean(item.userName && item.location && item.price);

  if (hasUserInfo) {
    return (
      <div className="flex items-end justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            {item.avatarSrc ? (
              <Image
                src={item.avatarSrc}
                alt={item.userName ?? "Uploader"}
                width={30}
                height={30}
                className="h-7 w-7 rounded-full border border-white/50 object-cover"
              />
            ) : null}
            <p className="truncate text-[20px] leading-none font-medium">{item.userName}</p>
          </div>

          <div className="mt-1 flex items-center gap-1 text-[13px] text-white/85">
            <span>{item.location}</span>
            <ExternalLink className="h-3 w-3" />
          </div>
        </div>

        <p className="text-[48px] leading-none font-semibold">{item.price}</p>
      </div>
    );
  }

  if (!item.title && !item.photoCount) {
    return undefined;
  }

  return (
    <div className="space-y-1.5">
      {item.title ? (
        <p className="text-[26px] leading-none font-medium sm:text-[36px]">{item.title}</p>
      ) : null}
      {typeof item.photoCount === "number" ? (
        <div className="flex items-center gap-1.5 text-sm text-white/90">
          <Camera className="h-3.5 w-3.5" />
          <span>{item.photoCount}</span>
        </div>
      ) : null}
    </div>
  );
}

function buildActions(item: CardViewItem) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        aria-label="Add to favorites"
        className={cn(
          "inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/55 bg-white text-(--color-fill-brand-strong) transition-colors hover:text-white",
          item.favoriteActive
            ? "bg-(--color-fill-brand-strong) text-white"
            : "bg-[#E7E5E4] hover:bg-(--color-fill-brand-strong)",
        )}
      >
        <Heart className="h-4 w-4" />
      </button>

      <button
        type="button"
        aria-label="Add card"
        className={cn(
          "inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/55 bg-white text-(--color-fill-brand-strong) transition-colors hover:text-white",
          item.plusActive
            ? "bg-white"
            : "bg-[#E7E5E4] hover:bg-(--color-fill-brand-strong) hover:text-white",
        )}
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}

export default function CardView({ items, className, desktopColumns = 4 }: CardViewProps) {
  const desktopItemsPerGroup = desktopColumns * 2;
  const desktopColumnPattern = desktopColumnPatternByCount[desktopColumns];

  const desktopGroups = Array.from(
    { length: Math.ceil(items.length / desktopItemsPerGroup) },
    (_, index) =>
      items.slice(
        index * desktopItemsPerGroup,
        index * desktopItemsPerGroup + desktopItemsPerGroup,
      ),
  );

  return (
    <div className={cn("space-y-6", className)}>
      <div className="grid grid-cols-1 gap-3 sm:hidden">
        {items.map((item) => {
          const info = buildInfo(item);

          return (
            <div key={item.id} className="h-80">
              <ImageCard
                src={item.src}
                alt={item.alt}
                width={960}
                height={1280}
                href={getDetailsHref(item)}
                revealOnHover={false}
                className="h-full rounded-sm"
                imageClassName="h-full w-full object-cover"
                info={info}
                actions={buildActions(item)}
                infoClassName={cn("p-3 sm:p-4", item.showInfoByDefault ? "opacity-100" : undefined)}
                actionsClassName="opacity-100"
              />
            </div>
          );
        })}
      </div>

      {desktopGroups.map((group, groupIndex) => (
        <div
          key={`tablet-group-${groupIndex}`}
          className="hidden sm:grid sm:grid-cols-2 sm:gap-3 lg:hidden"
        >
          {tabletColumnPattern.map((column, columnIndex) => (
            <div key={`tablet-column-${groupIndex}-${columnIndex}`} className="flex flex-col gap-3">
              {column.indices.map((itemIndex, stackIndex) => {
                const item = group[itemIndex];

                if (!item) {
                  return null;
                }

                const resolvedSize = item.size ?? column.sizes[stackIndex];

                return (
                  <div key={item.id} className={getTabletHeightClass(resolvedSize)}>
                    <ImageCard
                      src={item.src}
                      alt={item.alt}
                      width={960}
                      height={1280}
                      href={getDetailsHref(item)}
                      revealOnHover={false}
                      className="h-full rounded-sm"
                      imageClassName="h-full w-full object-cover"
                      info={buildInfo(item)}
                      actions={buildActions(item)}
                      infoClassName={cn(
                        "p-3 sm:p-4",
                        item.showInfoByDefault ? "opacity-100" : undefined,
                      )}
                      actionsClassName="opacity-100"
                    />
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      ))}

      {desktopGroups.map((group, groupIndex) => (
        <div
          key={`desktop-group-${groupIndex}`}
          className={cn(
            "hidden max-h-236 overflow-hidden lg:grid lg:gap-x-3",
            desktopColumns === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3",
          )}
        >
          {desktopColumnPattern.map(([topSize, bottomSize], columnIndex) => {
            const topItem = group[columnIndex];
            const bottomItem = group[columnIndex + desktopColumns];

            return (
              <div
                key={`column-${groupIndex}-${columnIndex}`}
                className="flex max-h-236 flex-col gap-y-6"
              >
                {topItem ? (
                  <div className={getHeightClass(topItem.size ?? topSize)}>
                    <ImageCard
                      src={topItem.src}
                      alt={topItem.alt}
                      width={960}
                      height={1280}
                      href={getDetailsHref(topItem)}
                      className="h-full rounded-sm"
                      imageClassName="h-full w-full object-cover"
                      info={buildInfo(topItem)}
                      actions={buildActions(topItem)}
                      infoClassName={cn(
                        "p-3 sm:p-4",
                        topItem.showInfoByDefault ? "opacity-100" : undefined,
                      )}
                      actionsClassName="opacity-100"
                    />
                  </div>
                ) : (
                  <div className={getHeightClass(topSize)} />
                )}

                {bottomItem ? (
                  <div className={getHeightClass(bottomItem.size ?? bottomSize)}>
                    <ImageCard
                      src={bottomItem.src}
                      alt={bottomItem.alt}
                      width={960}
                      height={1280}
                      href={getDetailsHref(bottomItem)}
                      className="h-full rounded-sm"
                      imageClassName="h-full w-full object-cover"
                      info={buildInfo(bottomItem)}
                      actions={buildActions(bottomItem)}
                      infoClassName={cn(
                        "p-3 sm:p-4",
                        bottomItem.showInfoByDefault ? "opacity-100" : undefined,
                      )}
                      actionsClassName="opacity-100"
                    />
                  </div>
                ) : (
                  <div className={getHeightClass(bottomSize)} />
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
