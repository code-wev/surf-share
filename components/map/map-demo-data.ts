export const timeOptions = [
  { value: "all", label: "All Times" },
  { value: "05:00 AM-07:00 AM", label: "05:00 AM-07:00 AM" },
  { value: "07:00 AM-12:00 PM", label: "07:00 AM-12:00 PM" },
  { value: "12:00 PM-05:00 PM", label: "12:00 PM-05:00 PM" },
  { value: "05:00 PM-08:00 PM", label: "05:00 PM-08:00 PM" },
  { value: "08:00 PM-05:00 AM", label: "08:00 PM-05:00 AM" },
] as const;

export type TimeOptionValue = (typeof timeOptions)[number]["value"];

export type SurfSpot = {
  id: string;
  name: string;
  state: string;
  region: string;
  country: string;
  coordinates: [number, number];
  photoCount: number;
  image: string;
  availableFrom: string;
  availableTo: string;
  timeWindows: TimeOptionValue[];
};

export const defaultFromDate = "2026-10-12";
export const defaultToDate = "2026-10-28";

export const demoSurfSpots: SurfSpot[] = [
  {
    id: "byron-pass",
    name: "The Pass, Byron",
    state: "NSW",
    region: "Northern Rivers",
    country: "Australia",
    coordinates: [-28.6434, 153.612],
    photoCount: 142,
    image: "/home/latest/latest1.jpg",
    availableFrom: "2026-10-10",
    availableTo: "2026-11-03",
    timeWindows: [
      "05:00 AM-07:00 AM",
      "07:00 AM-12:00 PM",
      "12:00 PM-05:00 PM",
    ],
  },
  {
    id: "bondi-beach",
    name: "Bondi Break",
    state: "NSW",
    region: "Sydney Coast",
    country: "Australia",
    coordinates: [-33.8915, 151.2767],
    photoCount: 118,
    image: "/home/latest/latest2.jpg",
    availableFrom: "2026-10-05",
    availableTo: "2026-10-26",
    timeWindows: ["07:00 AM-12:00 PM", "12:00 PM-05:00 PM", "05:00 PM-08:00 PM"],
  },
  {
    id: "snapper-rocks",
    name: "Snapper Rocks",
    state: "QLD",
    region: "Gold Coast",
    country: "Australia",
    coordinates: [-28.1636, 153.5482],
    photoCount: 167,
    image: "/home/latest/latest3.jpg",
    availableFrom: "2026-10-08",
    availableTo: "2026-11-04",
    timeWindows: [
      "05:00 AM-07:00 AM",
      "07:00 AM-12:00 PM",
      "08:00 PM-05:00 AM",
    ],
  },
  {
    id: "noosa-heads",
    name: "Noosa Heads",
    state: "QLD",
    region: "Sunshine Coast",
    country: "Australia",
    coordinates: [-26.3918, 153.0904],
    photoCount: 96,
    image: "/home/latest/latest4.jpg",
    availableFrom: "2026-10-11",
    availableTo: "2026-10-30",
    timeWindows: ["07:00 AM-12:00 PM", "12:00 PM-05:00 PM", "05:00 PM-08:00 PM"],
  },
  {
    id: "bells-beach",
    name: "Bells Beach",
    state: "VIC",
    region: "Surf Coast",
    country: "Australia",
    coordinates: [-38.3714, 144.2838],
    photoCount: 88,
    image: "/home/latest/latest5.jpg",
    availableFrom: "2026-10-15",
    availableTo: "2026-11-05",
    timeWindows: ["05:00 AM-07:00 AM", "07:00 AM-12:00 PM", "12:00 PM-05:00 PM"],
  },
  {
    id: "margaret-river",
    name: "Margaret River",
    state: "WA",
    region: "South West",
    country: "Australia",
    coordinates: [-33.9506, 115.0736],
    photoCount: 101,
    image: "/home/latest/latest6.jpg",
    availableFrom: "2026-10-09",
    availableTo: "2026-10-24",
    timeWindows: ["05:00 AM-07:00 AM", "07:00 AM-12:00 PM", "08:00 PM-05:00 AM"],
  },
];
