export type UploadStatus = "approved" | "rejected" | "pending";

export type ContributorUploadApiItem = {
  id: string;
  photoUrl: string;
  name: string;
  location: string;
  uploadedAt: string;
  priceUsd: number;
  status: UploadStatus;
  photographer?: string;
  resolution?: string;
  format?: string;
  size?: string;
};

export type ContributorUploadsApiResponse = {
  totalImages: number;
  page: number;
  pageSize: number;
  totalPages: number;
  items: ContributorUploadApiItem[];
};

export type ContributorUploadRow = {
  id: string;
  photoUrl: string;
  name: string;
  location: string;
  dateLabel: string;
  priceLabel: string;
  status: UploadStatus;
};

export const mockApiResponse: ContributorUploadsApiResponse = {
  totalImages: 150,
  page: 1,
  pageSize: 10,
  totalPages: 100,
  items: [
    {
      id: "up-001",
      photoUrl: "/home/latest/latest11.jpg",
      name: "Barrel Wave",
      location: "Manly Beach, NSW",
      uploadedAt: "2026-03-28",
      priceUsd: 45,
      status: "approved",
    },
    {
      id: "up-002",
      photoUrl: "/home/latest/latest22.jpg",
      name: "Ripple Effect",
      location: "Bondi Beach, NSW",
      uploadedAt: "2026-03-12",
      priceUsd: 55,
      status: "rejected",
    },
    {
      id: "up-003",
      photoUrl: "/home/latest/latest3.jpg",
      name: "Cresting Wave",
      location: "Byron Bay, NSW",
      uploadedAt: "2026-03-10",
      priceUsd: 60,
      status: "pending",
    },
    {
      id: "up-004",
      photoUrl: "/home/latest/latest4.jpg",
      name: "Barrel Wave",
      location: "Cottesloe Beach, WA",
      uploadedAt: "2026-02-29",
      priceUsd: 50,
      status: "approved",
    },
    {
      id: "up-005",
      photoUrl: "/home/latest/latest5.jpg",
      name: "Liquid Surge",
      location: "Noosa Beach, QLD",
      uploadedAt: "2026-02-22",
      priceUsd: 65,
      status: "approved",
    },
    {
      id: "up-006",
      photoUrl: "/home/latest/latest6.jpg",
      name: "Tidal Flow",
      location: "Trigg Beach, WA",
      uploadedAt: "2026-02-18",
      priceUsd: 75,
      status: "approved",
    },
    {
      id: "up-007",
      photoUrl: "/home/latest/latest7.jpg",
      name: "Oceanic Rhythm",
      location: "Fremantle Beach, WA",
      uploadedAt: "2026-01-15",
      priceUsd: 70,
      status: "approved",
    },
    {
      id: "up-008",
      photoUrl: "/home/latest/latest22.jpg",
      name: "Surfing Swell",
      location: "Hastings Point, NSW",
      uploadedAt: "2026-01-10",
      priceUsd: 80,
      status: "approved",
    },
    {
      id: "up-009",
      photoUrl: "/home/latest/latest9.jpg",
      name: "Whitecap Dance",
      location: "Mettam's Pool, WA",
      uploadedAt: "2025-12-25",
      priceUsd: 85,
      status: "pending",
    },
    {
      id: "up-010",
      photoUrl: "/home/latest/latest10.jpg",
      name: "Breakers' Embrace",
      location: "Kings Beach, QLD",
      uploadedAt: "2025-12-15",
      priceUsd: 90,
      status: "approved",
    },
    {
      id: "up-011",
      photoUrl: "/home/latest/latest11.jpg",
      name: "Splash Cascade",
      location: "Scarborough Beach, WA",
      uploadedAt: "2025-11-30",
      priceUsd: 95,
      status: "approved",
    },
    {
      id: "up-012",
      photoUrl: "/home/latest/latest12.jpg",
      name: "Ebb and Flow",
      location: "Bells Beach, VIC",
      uploadedAt: "2025-11-12",
      priceUsd: 100,
      status: "pending",
    },
    {
      id: "up-013",
      photoUrl: "/home/latest/latest13.jpg",
      name: "Wave Cradle",
      location: "Palm Cove, QLD",
      uploadedAt: "2025-10-22",
      priceUsd: 110,
      status: "approved",
    },
    {
      id: "up-014",
      photoUrl: "/home/latest/latest22.jpg",
      name: "Aquatic Harmony",
      location: "Tamarama Beach, NSW",
      uploadedAt: "2025-10-05",
      priceUsd: 120,
      status: "approved",
    },
    {
      id: "up-015",
      photoUrl: "/home/latest/latest14.jpg",
      name: "Aquatic Harmony",
      location: "Tamarama Beach, NSW",
      uploadedAt: "2025-10-05",
      priceUsd: 120,
      status: "approved",
    },
    {
      id: "up-016",
      photoUrl: "/home/latest/latest15.jpg",
      name: "Aquatic Harmony",
      location: "Tamarama Beach, NSW",
      uploadedAt: "2025-10-05",
      priceUsd: 120,
      status: "approved",
    },
    {
      id: "up-017",
      photoUrl: "/home/latest/latest16.jpg",
      name: "Aquatic Harmony",
      location: "Tamarama Beach, NSW",
      uploadedAt: "2025-10-05",
      priceUsd: 120,
      status: "approved",
    },
    {
      id: "up-018",
      photoUrl: "/home/latest/latest17.jpg",
      name: "Aquatic Harmony",
      location: "Tamarama Beach, NSW",
      uploadedAt: "2025-10-05",
      priceUsd: 120,
      status: "pending",
    },
    {
      id: "up-019",
      photoUrl: "/home/latest/latest18.jpg",
      name: "Aquatic Harmony",
      location: "Tamarama Beach, NSW",
      uploadedAt: "2025-10-05",
      priceUsd: 120,
      status: "approved",
    },
    {
      id: "up-020",
      photoUrl: "/home/latest/latest19.jpg",
      name: "Aquatic Harmony",
      location: "Tamarama Beach, NSW",
      uploadedAt: "2025-10-05",
      priceUsd: 120,
      status: "approved",
    },
    {
      id: "up-021",
      photoUrl: "/home/latest/latest20.jpg",
      name: "Aquatic Harmony",
      location: "Tamarama Beach, NSW",
      uploadedAt: "2025-10-05",
      priceUsd: 120,
      status: "approved",
    },
    {
      id: "up-022",
      photoUrl: "/home/latest/latest21.jpg",
      name: "Aquatic Harmony",
      location: "Tamarama Beach, NSW",
      uploadedAt: "2025-10-05",
      priceUsd: 120,
      status: "approved",
    },
    {
      id: "up-023",
      photoUrl: "/home/latest/latest22.jpg",
      name: "Aquatic Harmony",
      location: "Tamarama Beach, NSW",
      uploadedAt: "2025-10-05",
      priceUsd: 120,
      status: "rejected",
    },
  ],
};
