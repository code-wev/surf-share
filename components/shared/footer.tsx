"use client";

import Image from "next/image";
import Link from "next/link";

const platformLinks = [
  { label: "Map", href: "/map" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contribute", href: "/contribute" },
];

const companyLinks = [
  { label: "Our Story", href: "/about" },
  { label: "Partners", href: "/partners" },
];

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms and Conditions", href: "/terms" },
];

const Footer = () => {
  return (
    <footer className="w-full bg-(--color-fill-hover)">
      <div className="px-4 py-10 sm:px-6 md:mx-12.5 md:px-0 lg:pt-25">
        {/* TOP GRID */}
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr] lg:gap-20">
          {/* BRAND */}
          <div>
            <div className="mb-5">
              <Link href="/">
                <Image src="/logo.png" alt="Renewably UK" width={258} height={64} />
              </Link>
            </div>

            <div className="mt-17.5 flex gap-x-4">
              {/* Facebook */}
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
              >
                <Image src="/home/footer/facebook.png" alt="SurfShare" width={36} height={36} />
              </a>

              {/* Instagram */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <Image src="/home/footer/instagram.png" alt="SurfShare" width={36} height={36} />
              </a>

              {/* Twitter / X */}
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
              >
                <Image src="/home/footer/twitter.png" alt="SurfShare" width={36} height={36} />
              </a>
            </div>
          </div>

          {/* COMPANY */}
          <div>
            <h4 className="mb-4 text-xl font-medium text-(--color-text-strong) lg:text-2xl">
              Platform
            </h4>

            <ul className="text- flex flex-col gap-2.5 text-[14px]">
              {platformLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-lg text-(--color-text-weak) transition-colors duration-300 hover:text-(--color-icon-brand-strong) lg:text-[22px]"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* SERVICES */}
          <div>
            <h4 className="mb-4 text-xl font-medium text-(--color-text-strong) lg:text-2xl">
              Company
            </h4>

            <ul className="flex flex-col gap-2.5 text-[14px] md:max-w-55">
              {companyLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-lg text-(--color-text-weak) transition-colors duration-300 hover:text-(--color-icon-brand-strong) lg:text-[22px]"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CONNECT */}
          <div>
            <h4 className="mb-4 text-xl font-medium text-(--color-text-strong) lg:text-2xl">
              Legal
            </h4>

            <ul className="flex flex-col gap-3 text-[14px]">
              {legalLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-lg text-(--color-text-weak) transition-colors duration-300 hover:text-(--color-icon-brand-strong) lg:text-[22px]"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* DIVIDER */}
        <div className="mt-10 mb-10 h-px w-full bg-(--color-line-weak) md:mt-25" />

        {/* BOTTOM */}
        <div className="flex flex-row justify-center text-center text-[14px]">
          <p className="text-medium text-xl text-(--color-text-strong) lg:text-2xl">
            © 2026 SURFSHARE.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
