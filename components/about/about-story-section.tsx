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

            <div className="text-text-weak mt-3 sm:mt-4 md:mt-5 lg:mt-6 space-y-4 text-sm leading-6 sm:space-y-6 sm:text-base sm:leading-7 lg:space-y-8 lg:text-[24px] lg:leading-tight">
              <p>
                SurfShare began in 2012 with a simple frustration and no real way to solve it. After years in the water, the same problem kept showing up: you&apos;d have a great session, maybe your best wave in weeks, and wonder if anyone caught it. Then came the awkward part trying to find the photographer, swap details, and hope the shot existed. Most of the time, it didn&apos;t go anywhere.
              </p>

              <p>
                Photographers faced their own challenge: hundreds of images, dozens of surfers, and everyone looking identical once they&apos;re in black wetsuits and white boards.
              </p>

              <p>
                Years later — with more experience, better tools, and a clearer vision — SurfShare returned with a purpose: one place where surfers can find their waves, and photographers can share their craft without the hassle.
              </p>

              <p>
                We built a platform that removes the friction on both sides. Surfers can search by location, date, and time. Photographers can upload, price, and get paid — no chasing, no guessing, no lost moments.
              </p>
              
              <p>
                SurfShare exists to make the connection effortless.
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
