export const timeOptions = [
  { value: "all", label: "All Times" },
  { value: "first_light", label: "First Light (4-8 AM)" },
  { value: "morning", label: "Morning (8-11 AM)" },
  { value: "lunch", label: "Lunch (11 AM-2 PM)" },
  { value: "afternoon", label: "Afternoon (2-7 PM)" },
] as const;

export type TimeOptionValue = (typeof timeOptions)[number]["value"];

export type SurfSpot = {
  id: string;
  name: string;
  state: string;
  region: string;
  country?: string;
  coordinates: [number, number];
  photoCount?: number;
  imageSrc: string;
  availableFrom: string;
  availableTo: string;
  timeWindows: TimeOptionValue[];
};

export const defaultFromDate = new Date().toISOString().split("T")[0];
export const defaultToDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
