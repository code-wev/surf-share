import Link from "next/link";
import { PageTitle } from "../shared/page-title";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";
import CardView, { type CardViewItem } from "../shared/card-view";

const latestUploadItems: CardViewItem[] = [
  {
    id: 1,
    src: "/home/latest/latest1.jpg",
    alt: "Surfers in turquoise ocean",
    userName: "John Doe",
    location: "Oahu, Hawaii",
    price: "$10.60",
    avatarSrc: "/home/logo.png",
  },
  {
    id: 2,
    src: "/home/latest/latest2.jpg",
    alt: "Surfboard heading into sunset sea",
    userName: "John Doe",
    location: "Oahu, Hawaii",
    price: "$10.60",
    avatarSrc: "/home/logo.png",
  },
  {
    id: 3,
    src: "/home/latest/latest3.jpg",
    alt: "Surfer carving on a wave",
    userName: "John Doe",
    location: "Oahu, Hawaii",
    price: "$10.60",
    avatarSrc: "/home/logo.png",
  },
  {
    id: 4,
    src: "/home/latest/latest4.jpg",
    alt: "Surfer in a splashy wave",
    userName: "John Doe",
    location: "Oahu, Hawaii",
    price: "$10.60",
    avatarSrc: "/home/logo.png",
  },
  {
    id: 5,
    src: "/home/latest/latest5.jpg",
    alt: "Group of surfers in the water",
    userName: "John Doe",
    location: "Oahu, Hawaii",
    price: "$10.60",
    avatarSrc: "/home/logo.png",
  },
  {
    id: 6,
    src: "/home/latest/latest6.jpg",
    alt: "Surfer sitting on the beach",
    userName: "John Doe",
    location: "Oahu, Hawaii",
    price: "$10.60",
    avatarSrc: "/home/logo.png",
  },
  {
    id: 7,
    src: "/home/latest/latest7.jpg",
    alt: "Hand above ocean water",
    userName: "John Doe",
    location: "Oahu, Hawaii",
    price: "$10.60",
    avatarSrc: "/home/logo.png",
  },
  {
    id: 8,
    src: "/home/latest/latest8.jpg",
    alt: "Surfer riding at blue sky",
    userName: "John Doe",
    location: "Oahu, Hawaii",
    price: "$10.60",
    avatarSrc: "/home/logo.png",
  },
];

export default function LatestUpload() {
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

          <Link href="/properties">
            <Button className="cursor-pointer border border-(--color-line-weaker) bg-transparent font-medium text-(--color-text-brand-strong) transition-colors hover:bg-(--color-fill-hover)">
              View All <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="mt-8 px-4">
          <CardView items={latestUploadItems} />
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
