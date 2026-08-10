import Image from "next/image";

export default function AboutStorySection() {
  return (
    <section className="">
      <div className="mx-auto max-w-470 px-4 py-14 sm:px-6 sm:py-16 md:px-10 md:py-20 lg:px-12.5 lg:py-22 2xl:py-25">
        <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-[1.3fr_0.7fr] md:gap-8 lg:gap-12 xl:gap-16">
          <div className="max-w-230">
            <h2 className="text-text-strong text-4xl font-bold sm:text-5xl lg:text-[64px]">
              Our Story
            </h2>

            <div className="text-text-weak mt-3 space-y-4 text-sm leading-6 sm:mt-4 sm:space-y-6 sm:text-base sm:leading-7 md:mt-5 lg:mt-6 lg:space-y-8 lg:text-[24px] lg:leading-tight">
              <p>
                SurfShare began in 2012 with a common problem but with no solution. We have a few
                mates who are surf photographers and they would always get hassled by surfers to try
                see if they had shots.
              </p>

              <p>
                For surfers - it&apos;s awkward walking or paddling up to the guy with the camera
                hoping that he might have got the shot. Then trying to sort out details, risky cash
                transfer and maybe you&apos;d get a good photo.{" "}
              </p>

              <p>
                From the photographer&apos;s perspective, they are no real incentives to take photos
                of random punters who often just want to pay in good vibes or shakas. Even if
                someone is willing to pay you have to sift through hundreds of images, dozens of
                surfers, all to find out the person doesn&apos;t want the shot because it
                didn&apos;t quite live up to the image they had in their head.
              </p>

              <p>
                The idea of a platform was always there but the ability to create it was not. Years
                later — with more experience, better tools, and a clearer vision — SurfShare
                returned with a purpose: one place where surfers can find their waves, and
                photographers can share their craft without the hassle.
              </p>

              <p>
                We built a platform that removes the friction on both sides. Surfers can search by
                location, date, and time. Photographers can upload, price, and get paid — no
                chasing, no guessing, no lost moments.
              </p>

              <p>SurfShare exists to make the connection effortless.</p>
            </div>
          </div>

          {/* Improved Image Container */}
          <div className="mx-auto w-full max-w-153.75 md:justify-self-end">
            {" "}
            {/* Increased max-w for better effect */}
            <div className="relative aspect-41/40 w-full overflow-visible">
              {/* Background Decorative Layer */}
              <div className="absolute -top-1 right-1 bottom-1 -left-1 z-0 rotate-[3.95deg] rounded-2xl bg-[#0C3173] shadow-sm md:rotate-[4deg]" />

              {/* Main Image Container */}
              <div className="border-base-white bg-surface-muted-100 relative z-10 h-full w-full overflow-hidden rounded-2xl border">
                <Image
                  src="/about.jpg"
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
