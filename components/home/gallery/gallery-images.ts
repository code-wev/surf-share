import { CardViewItem } from "@/components/shared/card-view";

export const galleryTabs = ["all", "today", "yesterday", "thisWeek", "thisMonth"] as const;

export const galleryLocations = [
  "all",
  "trigg",
  "cottesloe",
  "scarborough",
  "margaretRiver",
  "bellsBeach",
  "burleighHeads",
  "snapperRocks",
  "byronBay",
  "bondi",
  "manly",
] as const;

export const galleryTimes = ["all", "sunrise", "afternoon", "sunset"] as const;

export const gallerySorts = ["latest", "priceLow", "priceHigh"] as const;

export type GalleryTab = (typeof galleryTabs)[number];
export type GalleryLocation = (typeof galleryLocations)[number];
export type GalleryTime = (typeof galleryTimes)[number];
export type GallerySort = (typeof gallerySorts)[number];

export const galleryTabLabels: Record<GalleryTab, string> = {
  all: "All",
  today: "Today",
  yesterday: "Yesterday",
  thisWeek: "This Week",
  thisMonth: "This Month",
};

export const galleryLocationLabels: Record<GalleryLocation, string> = {
  all: "All States",
  trigg: "Trigg Beach, WA",
  cottesloe: "Cottesloe Beach, WA",
  scarborough: "Scarborough Beach, WA",
  margaretRiver: "Margaret River, WA",
  bellsBeach: "Bells Beach, VIC",
  burleighHeads: "Burleigh Heads, QLD",
  snapperRocks: "Snapper Rocks, QLD",
  byronBay: "Byron Bay, NSW",
  bondi: "Bondi Beach, NSW",
  manly: "Manly Beach, NSW",
};

export const galleryTimeLabels: Record<GalleryTime, string> = {
  all: "Any Time",
  sunrise: "Sunrise",
  afternoon: "Afternoon",
  sunset: "Sunset",
};

export const gallerySortLabels: Record<GallerySort, string> = {
  latest: "Latest",
  priceLow: "Price Low to High",
  priceHigh: "Price High to Low",
};

export type GallerySeedImage = CardViewItem & {
  tab: GalleryTab;
  locationKey: GalleryLocation;
  timeKey: GalleryTime;
  uploadedAt: string;
  priceValue: number;
};

export type GalleryDetailSlide = {
  src: string;
  alt: string;
};

export type GalleryImageDetails = {
  title: string;
  dateTaken: string;
  photographer: string;
  resolution: string;
  format: string;
  size: string;
  detailSlides: GalleryDetailSlide[];
  promoImageSrc: string;
  promoImageAlt: string;
};

export type GalleryDetailItem = GallerySeedImage & {
  slug: string;
  details: GalleryImageDetails;
};

export const gallerySeedImages: GallerySeedImage[] = [
  // Original 20 images (kept as-is from your last version)
  {
    id: 1,
    src: "/home/latest/latest1.jpg",
    alt: "Blue sky over beach",
    userName: "John Doe",
    location: "Trigg Beach, WA",
    price: "$13.00",
    avatarSrc: "/home/logo.png",
    tab: "today",
    locationKey: "trigg",
    timeKey: "afternoon",
    uploadedAt: "2026-04-15T09:00:00.000Z",
    priceValue: 13.0,
  },
  {
    id: 2,
    src: "/home/latest/latest2.jpg",
    alt: "Clouds above ocean",
    userName: "John Doe",
    location: "Trigg Beach, WA",
    price: "$10.60",
    avatarSrc: "/home/logo.png",
    tab: "today",
    locationKey: "trigg",
    timeKey: "afternoon",
    uploadedAt: "2026-04-15T07:00:00.000Z",
    priceValue: 10.6,
  },
  {
    id: 3,
    src: "/home/latest/latest3.jpg",
    alt: "Golden cloud and sea horizon",
    userName: "John Doe",
    location: "Trigg Beach, WA",
    price: "$9.80",
    avatarSrc: "/home/logo.png",
    tab: "today",
    locationKey: "trigg",
    timeKey: "sunset",
    uploadedAt: "2026-04-15T06:00:00.000Z",
    priceValue: 9.8,
  },
  {
    id: 4,
    src: "/home/latest/latest4.jpg",
    alt: "Deep blue wave closeup",
    userName: "John Doe",
    location: "Scarborough, WA",
    price: "$11.30",
    avatarSrc: "/home/logo.png",
    tab: "today",
    locationKey: "scarborough",
    timeKey: "afternoon",
    uploadedAt: "2026-04-15T05:00:00.000Z",
    priceValue: 11.3,
  },
  {
    id: 5,
    src: "/home/latest/latest5.jpg",
    alt: "Surfers waiting on lineup",
    userName: "John Doe",
    location: "Trigg Beach, WA",
    price: "$10.20",
    avatarSrc: "/home/logo.png",
    tab: "today",
    locationKey: "trigg",
    timeKey: "sunrise",
    uploadedAt: "2026-04-15T04:00:00.000Z",
    priceValue: 10.2,
  },
  {
    id: 6,
    src: "/home/latest/latest6.jpg",
    alt: "Surfer resting near board",
    userName: "John Doe",
    location: "Trigg Beach, WA",
    price: "$10.00",
    avatarSrc: "/home/logo.png",
    tab: "yesterday",
    locationKey: "trigg",
    timeKey: "afternoon",
    uploadedAt: "2026-04-14T09:00:00.000Z",
    priceValue: 10,
  },
  {
    id: 7,
    src: "/home/latest/latest7.jpg",
    alt: "Hand touching ocean surface",
    userName: "John Doe",
    location: "Scarborough, WA",
    price: "$9.60",
    avatarSrc: "/home/logo.png",
    tab: "yesterday",
    locationKey: "scarborough",
    timeKey: "sunset",
    uploadedAt: "2026-04-14T08:00:00.000Z",
    priceValue: 9.6,
  },
  {
    id: 8,
    src: "/home/latest/latest8.jpg",
    alt: "Surfer under bright sky",
    userName: "John Doe",
    location: "Trigg Beach, WA",
    price: "$11.00",
    avatarSrc: "/home/logo.png",
    tab: "yesterday",
    locationKey: "trigg",
    timeKey: "sunrise",
    uploadedAt: "2026-04-14T07:00:00.000Z",
    priceValue: 11,
  },
  {
    id: 9,
    src: "/home/latest/latest9.jpg",
    alt: "Morning sky with blue tones",
    userName: "John Doe",
    location: "Trigg Beach, WA",
    price: "$10.40",
    avatarSrc: "/home/logo.png",
    tab: "thisWeek",
    locationKey: "trigg",
    timeKey: "sunrise",
    uploadedAt: "2026-04-12T07:00:00.000Z",
    priceValue: 10.4,
  },
  {
    id: 10,
    src: "/home/latest/latest10.jpg",
    alt: "Soft clouds and pale blue sky",
    userName: "John Doe",
    location: "Scarborough, WA",
    price: "$12.10",
    avatarSrc: "/home/logo.png",
    tab: "thisWeek",
    locationKey: "scarborough",
    timeKey: "afternoon",
    uploadedAt: "2026-04-11T07:00:00.000Z",
    priceValue: 12.1,
  },
  {
    id: 11,
    src: "/home/latest/latest11.jpg",
    alt: "Cream clouds before sunset",
    userName: "John Doe",
    location: "Trigg Beach, WA",
    price: "$8.90",
    avatarSrc: "/home/logo.png",
    tab: "thisWeek",
    locationKey: "trigg",
    timeKey: "sunset",
    uploadedAt: "2026-04-10T18:00:00.000Z",
    priceValue: 8.9,
  },
  {
    id: 12,
    src: "/home/latest/latest12.jpg",
    alt: "Open ocean texture",
    userName: "John Doe",
    location: "Trigg Beach, WA",
    price: "$10.90",
    avatarSrc: "/home/logo.png",
    tab: "thisWeek",
    locationKey: "trigg",
    timeKey: "afternoon",
    uploadedAt: "2026-04-09T14:00:00.000Z",
    priceValue: 10.9,
  },
  {
    id: 13,
    src: "/home/latest/latest13.jpg",
    alt: "Group waiting for clean wave",
    userName: "John Doe",
    location: "Scarborough, WA",
    price: "$9.70",
    avatarSrc: "/home/logo.png",
    tab: "thisMonth",
    locationKey: "scarborough",
    timeKey: "sunrise",
    uploadedAt: "2026-04-04T09:00:00.000Z",
    priceValue: 9.7,
  },
  {
    id: 14,
    src: "/home/latest/latest14.jpg",
    alt: "Surfer preparing on shore",
    userName: "John Doe",
    location: "Trigg Beach, WA",
    price: "$11.40",
    avatarSrc: "/home/logo.png",
    tab: "thisMonth",
    locationKey: "trigg",
    timeKey: "afternoon",
    uploadedAt: "2026-04-03T10:00:00.000Z",
    priceValue: 11.4,
  },
  {
    id: 15,
    src: "/home/latest/latest15.jpg",
    alt: "Ocean ripple closeup at dusk",
    userName: "John Doe",
    location: "Trigg Beach, WA",
    price: "$8.50",
    avatarSrc: "/home/logo.png",
    tab: "thisMonth",
    locationKey: "trigg",
    timeKey: "sunset",
    uploadedAt: "2026-04-02T16:00:00.000Z",
    priceValue: 8.5,
  },
  {
    id: 16,
    src: "/home/latest/latest1.jpg",
    alt: "Golden hour wave crash",
    userName: "Alex Rivera",
    location: "Scarborough, WA",
    price: "$10.30",
    avatarSrc: "/home/logo.png",
    tab: "thisMonth",
    locationKey: "scarborough",
    timeKey: "sunrise",
    uploadedAt: "2026-04-01T08:00:00.000Z",
    priceValue: 10.3,
  },
  {
    id: 17,
    src: "/home/latest/latest2.jpg",
    alt: "Dramatic stormy surf",
    userName: "Emma Thompson",
    location: "Trigg Beach, WA",
    price: "$14.50",
    avatarSrc: "/home/logo.png",
    tab: "today",
    locationKey: "trigg",
    timeKey: "sunrise",
    uploadedAt: "2026-04-15T04:00:00.000Z",
    priceValue: 14.5,
  },
  {
    id: 18,
    src: "/home/latest/latest3.jpg",
    alt: "Silhouette at sunrise",
    userName: "Marcus Chen",
    location: "Trigg Beach, WA",
    price: "$12.80",
    avatarSrc: "/home/logo.png",
    tab: "today",
    locationKey: "trigg",
    timeKey: "sunrise",
    uploadedAt: "2026-04-15T04:00:00.000Z",
    priceValue: 12.8,
  },
  {
    id: 19,
    src: "/home/latest/latest4.jpg",
    alt: "Perfect barrel wave",
    userName: "Sophie Laurent",
    location: "Trigg Beach, WA",
    price: "$15.20",
    avatarSrc: "/home/logo.png",
    tab: "today",
    locationKey: "trigg",
    timeKey: "sunset",
    uploadedAt: "2026-04-15T06:00:00.000Z",
    priceValue: 15.2,
  },
  {
    id: 20,
    src: "/home/latest/latest5.jpg",
    alt: "Morning mist over waves",
    userName: "Liam Harper",
    location: "Trigg Beach, WA",
    price: "$11.90",
    avatarSrc: "/home/logo.png",
    tab: "today",
    locationKey: "trigg",
    timeKey: "afternoon",
    uploadedAt: "2026-04-15T05:00:00.000Z",
    priceValue: 11.9,
  },

  // === Additional 20 images (duplicates with variations) ===
  {
    id: 21,
    src: "/home/latest/latest6.jpg",
    alt: "Peaceful dawn surf session",
    userName: "Olivia Reed",
    location: "Trigg Beach, WA",
    price: "$13.75",
    avatarSrc: "/home/logo.png",
    tab: "today",
    locationKey: "trigg",
    timeKey: "sunrise",
    uploadedAt: "2026-04-15T03:30:00.000Z",
    priceValue: 13.75,
  },
  {
    id: 22,
    src: "/home/latest/latest7.jpg",
    alt: "Vibrant sunset lines",
    userName: "Noah Patel",
    location: "Scarborough, WA",
    price: "$12.40",
    avatarSrc: "/home/logo.png",
    tab: "yesterday",
    locationKey: "scarborough",
    timeKey: "sunset",
    uploadedAt: "2026-04-14T17:45:00.000Z",
    priceValue: 12.4,
  },
  {
    id: 23,
    src: "/home/latest/latest8.jpg",
    alt: "Crystal clear water texture",
    userName: "Isabella Morales",
    location: "Trigg Beach, WA",
    price: "$9.90",
    avatarSrc: "/home/logo.png",
    tab: "thisWeek",
    locationKey: "trigg",
    timeKey: "afternoon",
    uploadedAt: "2026-04-13T14:20:00.000Z",
    priceValue: 9.9,
  },
  {
    id: 24,
    src: "/home/latest/latest9.jpg",
    alt: "Epic aerial wave view",
    userName: "Ethan Kowalski",
    location: "Trigg Beach, WA",
    price: "$16.80",
    avatarSrc: "/home/logo.png",
    tab: "thisWeek",
    locationKey: "trigg",
    timeKey: "sunset",
    uploadedAt: "2026-04-12T18:10:00.000Z",
    priceValue: 16.8,
  },
  {
    id: 25,
    src: "/home/latest/latest10.jpg",
    alt: "Lonely surfer at dawn",
    userName: "Mia Dubois",
    location: "Scarborough, WA",
    price: "$11.25",
    avatarSrc: "/home/logo.png",
    tab: "thisMonth",
    locationKey: "scarborough",
    timeKey: "sunrise",
    uploadedAt: "2026-04-05T05:55:00.000Z",
    priceValue: 11.25,
  },
  {
    id: 26,
    src: "/home/latest/latest11.jpg",
    alt: "Powerful breaking wave",
    userName: "Lucas Moreau",
    location: "Trigg Beach, WA",
    price: "$14.10",
    avatarSrc: "/home/logo.png",
    tab: "thisMonth",
    locationKey: "trigg",
    timeKey: "afternoon",
    uploadedAt: "2026-04-06T13:40:00.000Z",
    priceValue: 14.1,
  },
  {
    id: 27,
    src: "/home/latest/latest12.jpg",
    alt: "Golden reflections on wet sand",
    userName: "Ava Thompson",
    location: "Trigg Beach, WA",
    price: "$10.60",
    avatarSrc: "/home/logo.png",
    tab: "today",
    locationKey: "trigg",
    timeKey: "sunset",
    uploadedAt: "2026-04-15T17:30:00.000Z",
    priceValue: 10.6,
  },
  {
    id: 28,
    src: "/home/latest/latest13.jpg",
    alt: "Surfer carving the face",
    userName: "James O'Reilly",
    location: "Scarborough, WA",
    price: "$13.45",
    avatarSrc: "/home/logo.png",
    tab: "yesterday",
    locationKey: "scarborough",
    timeKey: "afternoon",
    uploadedAt: "2026-04-14T15:20:00.000Z",
    priceValue: 13.45,
  },
  {
    id: 29,
    src: "/home/latest/latest14.jpg",
    alt: "Calm morning ocean glow",
    userName: "Charlotte Kim",
    location: "Trigg Beach, WA",
    price: "$9.30",
    avatarSrc: "/home/logo.png",
    tab: "thisWeek",
    locationKey: "trigg",
    timeKey: "sunrise",
    uploadedAt: "2026-04-11T06:15:00.000Z",
    priceValue: 9.3,
  },
  {
    id: 30,
    src: "/home/latest/latest15.jpg",
    alt: "Stormy skies and wild surf",
    userName: "Henry Leclerc",
    location: "Trigg Beach, WA",
    price: "$15.90",
    avatarSrc: "/home/logo.png",
    tab: "thisMonth",
    locationKey: "trigg",
    timeKey: "afternoon",
    uploadedAt: "2026-04-08T16:50:00.000Z",
    priceValue: 15.9,
  },
  {
    id: 31,
    src: "/home/latest/latest1.jpg",
    alt: "Minimalist wave portrait",
    userName: "Amelia Santos",
    location: "Scarborough, WA",
    price: "$8.75",
    avatarSrc: "/home/logo.png",
    tab: "thisMonth",
    locationKey: "scarborough",
    timeKey: "sunset",
    uploadedAt: "2026-04-03T17:25:00.000Z",
    priceValue: 8.75,
  },
  {
    id: 32,
    src: "/home/latest/latest2.jpg",
    alt: "Family day at the beach",
    userName: "Oliver Berg",
    location: "Trigg Beach, WA",
    price: "$12.65",
    avatarSrc: "/home/logo.png",
    tab: "today",
    locationKey: "trigg",
    timeKey: "afternoon",
    uploadedAt: "2026-04-15T11:10:00.000Z",
    priceValue: 12.65,
  },
  {
    id: 33,
    src: "/home/latest/latest3.jpg",
    alt: "Sunrise silhouette session",
    userName: "Sophia Rossi",
    location: "Trigg Beach, WA",
    price: "$11.80",
    avatarSrc: "/home/logo.png",
    tab: "yesterday",
    locationKey: "trigg",
    timeKey: "sunrise",
    uploadedAt: "2026-04-14T05:40:00.000Z",
    priceValue: 11.8,
  },
  {
    id: 34,
    src: "/home/latest/latest4.jpg",
    alt: "Big swell rolling in",
    userName: "William Dubois",
    location: "Scarborough, WA",
    price: "$14.20",
    avatarSrc: "/home/logo.png",
    tab: "thisWeek",
    locationKey: "scarborough",
    timeKey: "afternoon",
    uploadedAt: "2026-04-10T14:30:00.000Z",
    priceValue: 14.2,
  },
  {
    id: 35,
    src: "/home/latest/latest5.jpg",
    alt: "Soft pastel evening light",
    userName: "Luna Moreau",
    location: "Trigg Beach, WA",
    price: "$10.15",
    avatarSrc: "/home/logo.png",
    tab: "thisMonth",
    locationKey: "trigg",
    timeKey: "sunset",
    uploadedAt: "2026-04-07T18:05:00.000Z",
    priceValue: 10.15,
  },
  {
    id: 36,
    src: "/home/latest/latest6.jpg",
    alt: "Close-up of curling lip",
    userName: "Benjamin Silva",
    location: "Trigg Beach, WA",
    price: "$13.30",
    avatarSrc: "/home/logo.png",
    tab: "today",
    locationKey: "trigg",
    timeKey: "afternoon",
    uploadedAt: "2026-04-15T13:25:00.000Z",
    priceValue: 13.3,
  },
  {
    id: 37,
    src: "/home/latest/latest7.jpg",
    alt: "Empty lineup at first light",
    userName: "Zoe Laurent",
    location: "Scarborough, WA",
    price: "$9.45",
    avatarSrc: "/home/logo.png",
    tab: "thisWeek",
    locationKey: "scarborough",
    timeKey: "sunrise",
    uploadedAt: "2026-04-09T06:00:00.000Z",
    priceValue: 9.45,
  },
  {
    id: 38,
    src: "/home/latest/latest8.jpg",
    alt: "Surfer dropping into wave",
    userName: "Jack Nguyen",
    location: "Trigg Beach, WA",
    price: "$12.95",
    avatarSrc: "/home/logo.png",
    tab: "yesterday",
    locationKey: "trigg",
    timeKey: "afternoon",
    uploadedAt: "2026-04-14T12:15:00.000Z",
    priceValue: 12.95,
  },
  {
    id: 39,
    src: "/home/latest/latest1.jpg",
    alt: "Reflections after the storm",
    userName: "Grace Kim",
    location: "Trigg Beach, WA",
    price: "$11.10",
    avatarSrc: "/home/logo.png",
    tab: "thisMonth",
    locationKey: "trigg",
    timeKey: "sunset",
    uploadedAt: "2026-04-04T17:50:00.000Z",
    priceValue: 11.1,
  },
  {
    id: 40,
    src: "/home/latest/latest2.jpg",
    alt: "Vivid blue hour ocean",
    userName: "Alexander Volkov",
    location: "Scarborough, WA",
    price: "$14.80",
    avatarSrc: "/home/logo.png",
    tab: "today",
    locationKey: "scarborough",
    timeKey: "afternoon",
    uploadedAt: "2026-04-15T16:40:00.000Z",
    priceValue: 14.8,
  },
];

const detailSlidePool: GalleryDetailSlide[] = gallerySeedImages.map((image) => ({
  src: image.src,
  alt: image.alt,
}));

function toSlug(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function buildDetailSlides(startIndex: number) {
  return Array.from({ length: 8 }, (_, offset) => {
    const slide = detailSlidePool[(startIndex + offset) % detailSlidePool.length];
    return {
      src: slide.src,
      alt: slide.alt,
    };
  });
}

export const galleryDetailItems: GalleryDetailItem[] = gallerySeedImages.map((item, index) => {
  const locationName = item.location ?? galleryLocationLabels[item.locationKey];
  const title = item.alt;
  const slug = `${item.id}-${toSlug(title)}`;
  const takenDate = new Date(item.uploadedAt);
  const formattedDate = takenDate.toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return {
    ...item,
    slug,
    details: {
      title,
      dateTaken: formattedDate,
      photographer: item.userName ?? "Unknown Photographer",
      resolution: "7860 x 4370 px",
      format: "RAW / JPEG",
      size: `${(24 + (index % 7) * 0.6).toFixed(1)} MB`,
      detailSlides: buildDetailSlides(index),
      promoImageSrc: "/home/gallery/add.png",
      promoImageAlt: `${locationName} promo banner`,
    },
  };
});

export function findGalleryDetailItemBySlugOrId(slugOrId: string) {
  return galleryDetailItems.find((item) => item.slug === slugOrId || String(item.id) === slugOrId);
}

export function getMoreGalleryImagesBySlugOrId(slugOrId: string, count = 8) {
  const currentIndex = galleryDetailItems.findIndex(
    (item) => item.slug === slugOrId || String(item.id) === slugOrId,
  );

  if (currentIndex === -1) {
    return galleryDetailItems.slice(0, count);
  }

  return Array.from({ length: Math.min(count, galleryDetailItems.length) }, (_, offset) => {
    const nextIndex = (currentIndex + offset) % galleryDetailItems.length;
    return galleryDetailItems[nextIndex];
  });
}

export function getRelatedGalleryImagesBySlugOrId(slugOrId: string, count = 8) {
  const current = findGalleryDetailItemBySlugOrId(slugOrId);

  if (!current) {
    return galleryDetailItems.slice(0, count);
  }

  const sameLocation = galleryDetailItems.filter(
    (item) => item.id !== current.id && item.locationKey === current.locationKey,
  );
  const remaining = galleryDetailItems.filter(
    (item) => item.id !== current.id && item.locationKey !== current.locationKey,
  );

  return [...sameLocation, ...remaining].slice(0, count);
}
