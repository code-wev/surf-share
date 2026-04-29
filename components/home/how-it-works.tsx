import { Download, GalleryHorizontalEnd, MapPin } from "lucide-react";
import { PageTitle } from "../shared/page-title";
import Image from "next/image";

export default function HowItWorks() {
  const contentData = [
    {
      icon: <MapPin className="h-5 w-5 text-(--color-text-inverse-strong)" />,
      title: "Find your spot",
      description:
        "Explore our interactive map of Australia's best surf breaks. Filter by time, date and location to find the wave you scored.",
    },
    {
      icon: <GalleryHorizontalEnd className="h-5 w-5 text-(--color-text-inverse-strong)" />,
      title: "Pick your shot",
      description:
        "Browse quality watermarked previews from talented local photographers. Favourite your waves and add to cart.",
    },
    {
      icon: <Download className="h-5 w-5 text-(--color-text-inverse-strong)" />,
      title: "Purchase and ride",
      description:
        "Pay securely via PayPal and instantly download your high-resolution, watermark-free photo. Yours to keep, share, and relive.",
    },
  ];

  const stackedImages = [
    {
      src: "/home/how-it-works/how3.png",
      alt: "",
      className: "rotate-[0deg] opacity-75",
      zIndex: 1,
    },
    {
      src: "/home/how-it-works/how2.png",
      alt: "",
      className: "rotate-[8deg] opacity-90",
      zIndex: 2,
    },
    {
      src: "/home/how-it-works/how1.png",
      alt: "Photographer at surf break",
      className: "translate-x-0 translate-y-0 rotate-[3deg]",
      zIndex: 3,
    },
  ];

  return (
    <section className="mx-auto max-w-480 px-4 pb-8 sm:px-6 md:px-12.5 md:pb-20">
      <div className="grid grid-cols-1 items-center justify-between md:grid-cols-2 md:gap-x-17 lg:gap-x-37">
        <div className="relative hidden h-160 md:block lg:ml-10 lg:h-190">
          {stackedImages.map((image) => (
            <div
              key={image.src}
              className={`absolute top-0 left-0 overflow-hidden rounded-2xl shadow-xl transition-transform duration-300 ${image.className}`}
              style={{ zIndex: image.zIndex }}
            >
              <Image
                src={image.src}
                alt={image.alt}
                width={640}
                height={720}
                className="h-140 w-118 border-2 border-(--color-icon-inverse-strong) object-cover lg:h-180 lg:w-160"
              />
            </div>
          ))}
        </div>

        {/* Right content */}
        <div>
          <div className="flex flex-col justify-between bg-(--color-base-white) p-6">
            <div>
              <PageTitle
                title="How It Works"
                titleClassName="mt-2 text-4xl text-(--color-text-strong) sm:text-[42px] md:text-5xl lg:text-[64px]"
              />
            </div>
            <div className="mt-20 space-y-8 lg:mt-60">
              {contentData.map((item, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div>
                    <PageTitle
                      beforeTitle={item.icon}
                      subtitle={item.description}
                      title={item.title}
                      titleClassName="text-[28px]! text-(--color-text-strong)"
                      subtitleClassName="text-base! text-medium text-(--color-text-weak)"
                      beforeTitleClassName="bg-(--color-text-brand-strong) p-2 rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
