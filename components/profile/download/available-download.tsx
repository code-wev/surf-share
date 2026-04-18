import { Button } from "@/components/ui/button";
import { CircleAlert, Clock, Download } from "lucide-react";
import Image from "next/image";

export default function AvailableDownload() {
  const downloadableItems = [
    {
      id: 1,
      imageSrc: "/home/latest/latest16.jpg",
      title: "John Doe",
      location: "Teahupo'o, Tahiti",
      expiresIn: "5 days",
      downloadLink: "/downloads/john-doe.zip",
    },
    {
      id: 2,
      imageSrc: "/home/latest/latest17.jpg",
      title: "Sarah Smith",
      location: "Teahupo'o, Tahiti",
      expiresIn: "10 days",
      downloadLink: "/downloads/sarah-smith.zip",
    },
    {
      id: 3,
      imageSrc: "/home/latest/latest18.jpg",
      title: "Thomas Anderson",
      location: "Teahupo'o, Tahiti",
      expiresIn: "15 days",
      downloadLink: "/downloads/thomas-anderson.zip",
    },
  ];
  return (
    <section className="h-full px-2 py-4 sm:py-6 md:px-0 md:py-0">
      <div className="flex h-full flex-col">
        <h1 className="text-text-brand-strong inline-flex w-fit border-b-2 border-[#0C3173] pb-2.5 text-lg font-semibold md:text-[18px] md:leading-tight">
          Available Downloads
        </h1>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {downloadableItems.map((item) => (
            <div
              key={item.id}
              className="flex flex-col overflow-hidden rounded-md border border-(--color-line-weaker) bg-(--color-fill-hover)"
            >
              <div className="relative h-70 w-full md:h-85 lg:h-85 xl:h-115">
                <Image
                  src={item.imageSrc}
                  alt={item.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>

              <div className="px-3 py-3 sm:px-4 sm:py-4">
                <h2 className="truncate text-[22px] font-medium text-(--color-text-strong)">
                  {item.title} |{" "}
                  <span className="text-[18px] text-(--color-text-weak)">{item.location}</span>
                </h2>
                <p className="inline-flex items-center gap-x-2 text-base text-(--color-text-weak)">
                  <Clock className="h-4 w-4" color="#0D1420" /> Expires in: {item.expiresIn}
                </p>

                <div className="mt-3 w-full">
                  <Button className="bg-brand-default text-text-inverse-strong flex w-full cursor-pointer items-center justify-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:opacity-95">
                    Download <Download size={16} color="#FDFDFE" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 flex items-center gap-2">
          <CircleAlert className="h-4 w-4" color="#D97706" />
          <p className="text-sm text-(--color-alert-strong)">
            <span className="font-bold">Note:</span> Downloads expire 30 days after purchase. Make
            sure to download your photos before they expire.
          </p>
        </div>
      </div>
    </section>
  );
}
