"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, ShoppingCart, X } from "lucide-react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

import { getRoleHomePath, useAuth, getDemoUserProfile } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";
import { getUserById } from "@/src/actions/user.action";
import { useCartStore } from "@/store/cart.store";

const navItems = [
  { label: "Map", href: "/map" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contribute", href: "/contribute" },
  { label: "About", href: "/about" },
  { label: "Contact us", href: "/contact" },
];

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { session, isHydrated } = useAuth();
  const { data: fullProfile } = useQuery({
    queryKey: ["nav-profile", session?.id],
    queryFn: async () => (session?.id ? getUserById(session.id) : Promise.reject("No session")),
    enabled: Boolean(session?.id),
    staleTime: 5 * 60 * 1000,
  });

  const avatarSrc =
    fullProfile?.data?.profileImageUrl ||
    getDemoUserProfile(session)?.avatarSrc ||
    "/home/logo.png";

  const { items } = useCartStore();
  const cartItemCount = items.length;
  const [cartHydrated, setCartHydrated] = useState(false);

  useEffect(() => {
    setTimeout(() => setCartHydrated(true), 0);
  }, []);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);
  const isDashboardRoute = pathname === "/dashboard" || pathname.startsWith("/dashboard/");
  const isNavItemActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);
  const isProfileActive = pathname === "/profile" || pathname.startsWith("/profile/");
  const isProfileIconActive = isProfileActive || isDashboardRoute;
  const profileHref = session ? getRoleHomePath(session.role) : "/profile";

  return (
    <header
      className={`font-sf-pro relative z-30 bg-(--color-surface-muted-100) ${
        isDashboardRoute ? "" : "border-b border-(--color-line-weak)"
      }`}
    >
      <div className="mx-2 md:mx-12.5">
        <div className="flex h-17 w-full items-center justify-between">
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

          {!isDashboardRoute ? (
            <nav className="hidden items-center gap-7 lg:flex">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  aria-current={isNavItemActive(item.href) ? "page" : undefined}
                  className={`text-sm transition-colors ${
                    isNavItemActive(item.href)
                      ? "text-text-brand-strong text-2xl font-bold"
                      : "hover:text-text-brand-strong font-normal text-gray-900"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          ) : null}

          <div className="hidden items-center gap-3 sm:gap-4 lg:flex">
            {!isHydrated ? null : isDashboardRoute ? (
              <>
                {session?.role === "SURFER" && (
                  <Link
                    href="/cart"
                    aria-label="Cart"
                    className="relative flex items-center text-(--color-text-strong) transition-colors hover:text-[#0c3173]"
                  >
                    <ShoppingCart size={20} />
                    {cartHydrated && cartItemCount > 0 && (
                      <span className="absolute -top-1.5 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                        {cartItemCount}
                      </span>
                    )}
                  </Link>
                )}
                <Link
                  href={profileHref}
                  aria-label="Go to profile"
                  className={`inline-flex h-9 w-9 overflow-hidden rounded-full border transition-colors ${
                    isProfileIconActive
                      ? "border-brand-default"
                      : "border-line-weaker hover:border-brand-default/60"
                  }`}
                >
                  <Image
                    src={avatarSrc}
                    alt="Profile"
                    width={36}
                    height={36}
                    className="h-full w-full object-cover"
                  />
                </Link>
              </>
            ) : session ? (
              <>
                {session.role === "SURFER" && (
                  <Link
                    href="/cart"
                    aria-label="Cart"
                    className="relative flex items-center text-(--color-text-strong) transition-colors hover:text-[#0c3173]"
                  >
                    <ShoppingCart size={20} />
                    {cartHydrated && cartItemCount > 0 && (
                      <span className="absolute -top-1.5 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                        {cartItemCount}
                      </span>
                    )}
                  </Link>
                )}
                <Link
                  href={profileHref}
                  aria-label="Go to profile"
                  className={`inline-flex h-9 w-9 overflow-hidden rounded-full border transition-colors ${
                    isProfileIconActive
                      ? "border-brand-default"
                      : "border-line-weaker hover:border-brand-default/60"
                  }`}
                >
                  <Image
                    src={avatarSrc}
                    alt="Profile"
                    width={36}
                    height={36}
                    className="h-full w-full object-cover"
                  />
                </Link>
              </>
            ) : (
              <>
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
              </>
            )}
          </div>

          <div className="flex items-center gap-3 lg:hidden">
            {isHydrated && (isDashboardRoute || session) ? (
              <>
                {session?.role === "SURFER" && (
                  <Link
                    href="/cart"
                    aria-label="Cart"
                    className="relative flex items-center text-(--color-text-strong) transition-colors hover:text-[#0c3173]"
                  >
                    <ShoppingCart size={20} />
                    {cartHydrated && cartItemCount > 0 && (
                      <span className="absolute -top-1.5 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                        {cartItemCount}
                      </span>
                    )}
                  </Link>
                )}
                <Link
                  href={profileHref}
                  aria-label="Go to profile"
                  className={`inline-flex h-8 w-8 overflow-hidden rounded-full border transition-colors ${
                    isProfileIconActive
                      ? "border-brand-default"
                      : "border-line-weaker hover:border-brand-default/60"
                  }`}
                >
                  <Image
                    src={avatarSrc}
                    alt="Profile"
                    width={32}
                    height={32}
                    className="h-full w-full object-cover"
                  />
                </Link>
              </>
            ) : null}

            {!isDashboardRoute ? (
              <button
                type="button"
                aria-expanded={isMobileMenuOpen}
                aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
                onClick={() => setIsMobileMenuOpen((prevState) => !prevState)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-sm border border-(--color-line-weaker) text-(--color-text-strong)"
              >
                {isMobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
              </button>
            ) : null}
          </div>
        </div>

        {!isDashboardRoute && isMobileMenuOpen && (
          <div className="absolute top-full right-0 left-0 border-t border-black/5 bg-white px-4 py-4 shadow-[0_14px_30px_rgba(0,0,0,0.08)] sm:px-6">
            <nav className="flex flex-col">
              {navItems.map((item) => (
                <Link
                  key={`mobile-${item.label}`}
                  href={item.href}
                  onClick={closeMobileMenu}
                  aria-current={isNavItemActive(item.href) ? "page" : undefined}
                  className={`rounded-sm px-2 py-2 text-sm transition-colors ${
                    isNavItemActive(item.href)
                      ? "text-text-brand-strong font-bold"
                      : "hover:text-text-brand-strong font-normal text-gray-900 hover:bg-(--color-fill-hover)"
                  }`}
                >
                  {item.label}
                </Link>
              ))}

              {isHydrated && !session ? (
                <>
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
                </>
              ) : null}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
