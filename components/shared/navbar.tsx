"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const navItems = [
  { label: "Map", href: "/map" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contribute", href: "/contribute" },
  { label: "About", href: "/about" },
  { label: "Contact us", href: "/contact" },
];

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className="font-sf-pro relative z-30 mx-2 border-b border-(--color-line-weak) bg-(--color-surface-muted-100) md:mx-12.5">
      <div className="flex h-17 w-full items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="shrink-0" onClick={closeMobileMenu}>
          <Image
            src="/home/logo.png"
            alt="Surf Share"
            width={194}
            height={40}
            priority
            className="h-8 w-auto sm:h-9"
          />
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-sm font-medium text-(--color-text-strong) transition-colors hover:text-[#0c3173]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 sm:gap-4 lg:flex">
          <Link
            href="/login"
            className="text-sm font-medium text-(--color-text-strong) transition-colors hover:text-[#0c3173]"
          >
            Log in
          </Link>

          <Link
            href="/signup"
            className="inline-flex h-8 items-center rounded-sm bg-(--color-fill-brand-strong) px-4 text-sm font-medium text-white transition-colors hover:bg-[#12418f]"
          >
            Sign up
          </Link>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <button
            type="button"
            aria-expanded={isMobileMenuOpen}
            aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            onClick={() => setIsMobileMenuOpen((prevState) => !prevState)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-sm border border-(--color-line-weaker) text-(--color-text-strong)"
          >
            {isMobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="absolute top-full right-0 left-0 border-t border-black/5 bg-white px-4 py-4 shadow-[0_14px_30px_rgba(0,0,0,0.08)] sm:px-6">
          <nav className="flex flex-col">
            {navItems.map((item) => (
              <Link
                key={`mobile-${item.label}`}
                href={item.href}
                onClick={closeMobileMenu}
                className="rounded-sm px-2 py-2 text-sm font-medium text-(--color-text-strong) transition-colors hover:bg-(--color-fill-hover)"
              >
                {item.label}
              </Link>
            ))}

            <Link
              href="/signup"
              onClick={closeMobileMenu}
              className="mt-2 inline-flex h-10 items-center justify-center rounded-sm bg-(--color-fill-brand-strong) px-2 text-sm font-medium text-white transition-colors hover:bg-[#12418f]"
            >
              Sign up
            </Link>

            <Link
              href="/login"
              onClick={closeMobileMenu}
              className="mt-2 inline-flex h-10 items-center justify-center rounded-sm border border-(--color-line-weaker) px-2 py-2 text-sm font-medium text-(--color-text-strong) transition-colors hover:bg-(--color-fill-hover)"
            >
              Log in
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
