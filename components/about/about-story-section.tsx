import Image from "next/image";

export default function AboutStorySection() {
  return (
    <section className="">
      <div className="mx-auto max-w-470 px-4 py-14 sm:px-6 sm:py-16 md:px-10 md:py-20 lg:px-12.5 lg:py-22 2xl:py-25">
        <div className="grid grid-cols-1 items-start gap-10 md:grid-cols-[1.3fr_0.7fr] md:gap-8 lg:gap-12 xl:gap-16">
          <div className="max-w-230">
            <h2 className="text-text-strong text-4xl font-bold sm:text-5xl lg:text-[64px]">
              Our Story
            </h2>

            <div className="text-text-weak mt-8 space-y-4 text-sm leading-6 sm:mt-10 sm:space-y-6 sm:text-base sm:leading-7 lg:space-y-8 lg:text-[28px] lg:leading-tight xl:mt-45">
              <p>
                Every surfer knows the thrill of catching the perfect wave and wondering if it was
                captured. At the same time, photographers create amazing shots but struggle to
                connect with the surfers in them.
              </p>

              <p>
                SURFSHARE bridges that gap, making it easy to find surf photos by location, date,
                and time. For photographers, we handle everything from hosting to payments so you
                can upload, set your price, and earn from every sale.
              </p>
            </div>
          </div>

          {/* Improved Image Container */}
          <div className="mx-auto w-full max-w-153.75 md:justify-self-end">
            {" "}
            {/* Increased max-w for better effect */}
            <div className="relative aspect-41/40 w-full overflow-visible">
              {/* Background Decorative Layer */}
              <div className="bg-[#09A3DC] absolute -top-1 right-1 bottom-1 -left-1 z-0 rotate-[3.95deg] rounded-2xl shadow-sm md:rotate-[4deg]" />

              {/* Main Image Container */}
              <div className="border-base-white bg-surface-muted-100 relative z-10 h-full w-full overflow-hidden rounded-2xl border">
                <Image
                  src="/home/about/about-story.jpg"
                  alt="Surfboards by a van"
                  fill
                  className="object-cover"
                  sizes="(min-width: 1536px) 615px, (min-width: 1280px) 38vw, (min-width: 768px) 42vw, 90vw"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
