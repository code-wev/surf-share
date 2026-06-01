"use client";

import { useAuth } from "@/lib/auth";

export default function DashboardOverviewHeader() {
  const { session } = useAuth();
  const userName = session?.name || "Admin";

  return (
    <>
      <div className="inline-flex items-center border-b border-brand-default pb-1 text-sm font-medium text-brand-default sm:text-base lg:text-lg">
        Overview
      </div>

      <h1 className="my-5 text-[27px] leading-tight font-bold tracking-tight text-text-strong sm:my-6 sm:text-[34px] md:my-7 md:text-[40px] lg:text-[44px] xl:my-8 2xl:text-[48px]">
        Welcome Back, {userName}
      </h1>
    </>
  );
}
