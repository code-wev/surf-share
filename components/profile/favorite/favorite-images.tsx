// export default function FavoriteImages() {
//   return (
// <section className="h-full px-4 py-4 sm:px-6 sm:py-6 md:px-0 md:py-0">
//   <div className="flex h-full flex-col">
//     <h1 className="text-text-brand-strong inline-flex w-fit border-b-2 border-[#0C3173] pb-2.5 text-lg font-semibold md:text-[18px] md:leading-tight">
//       Favorite Photos
//     </h1>

import CardView, { CardViewItem } from "@/components/shared/card-view";

const latestUploadItems: CardViewItem[] = [
  {
    id: 1,
    src: "/home/latest/latest20.jpg",
    alt: "Surfers in turquoise ocean",
    userName: "John Doe",
    location: "Oahu, Hawaii",
    price: "$10.60",
    avatarSrc: "/home/logo.png",
  },
  {
    id: 2,
    src: "/home/latest/latest19.jpg",
    alt: "Surfboard heading into sunset sea",
    userName: "John Doe",
    location: "Oahu, Hawaii",
    price: "$10.60",
    avatarSrc: "/home/logo.png",
  },
  {
    id: 3,
    src: "/home/latest/latest18.jpg",
    alt: "Surfer carving on a wave",
    userName: "John Doe",
    location: "Oahu, Hawaii",
    price: "$10.60",
    avatarSrc: "/home/logo.png",
  },
  {
    id: 4,
    src: "/home/latest/latest17.jpg",
    alt: "Surfer in a splashy wave",
    userName: "John Doe",
    location: "Oahu, Hawaii",
    price: "$10.60",
    avatarSrc: "/home/logo.png",
  },
  {
    id: 5,
    src: "/home/latest/latest16.jpg",
    alt: "Group of surfers in the water",
    userName: "John Doe",
    location: "Oahu, Hawaii",
    price: "$10.60",
    avatarSrc: "/home/logo.png",
  },
  {
    id: 6,
    src: "/home/latest/latest15.jpg",
    alt: "Surfer sitting on the beach",
    userName: "John Doe",
    location: "Oahu, Hawaii",
    price: "$10.60",
    avatarSrc: "/home/logo.png",
  },
];

export default function FavoriteImages() {
  return (
    <section className="h-full px-4 py-4 sm:px-6 sm:py-6 md:px-0 md:py-0">
      <div className="flex h-full flex-col">
        <h1 className="text-text-brand-strong inline-flex w-fit border-b-2 border-[#0C3173] pb-2.5 text-lg font-semibold md:text-[18px] md:leading-tight">
          Favorite Photos
        </h1>

        <p className="text-text-weak mt-6 text-sm leading-relaxed md:mt-10 md:max-w-140">
          Save your preferred photos here so you can access them quickly anytime.
        </p>
        <div className="mt-8 px-4">
          <CardView items={latestUploadItems} desktopColumns={3} />
        </div>
      </div>
    </section>
  );
}
