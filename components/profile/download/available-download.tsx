"use client";

import { useQuery } from "@tanstack/react-query";
import { getDownloadablePhotos } from "@/src/actions/download.action";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Clock, Download, Loader2 } from "lucide-react";
import Image from "next/image";

export default function AvailableDownload() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["downloadable-photos"],
    queryFn: getDownloadablePhotos,
  });

  const handleDownload = async (imageUrl: string, fileName: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${fileName}.jpg`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Download started!");
    } catch (error) {
      toast.error("Failed to download image.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="text-brand-default h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (isError) {
    return <div className="text-danger-strong py-10 text-center">Failed to load downloads.</div>;
  }

  const items = data?.data || [];

  return (
    <section className="h-full px-2 py-4 sm:py-6 md:px-0 md:py-0">
      <div className="flex h-full flex-col">
        <h1 className="text-text-brand-strong inline-flex w-fit border-b-2 border-[#0C3173] pb-2.5 text-lg font-semibold md:text-[18px] md:leading-tight">
          Available Downloads
        </h1>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {items.length === 0 ? (
            <p className="text-text-weak mt-6">No downloadable items found.</p>
          ) : (
            items.map((item: any) => (
              <div
                key={item.id}
                className="flex flex-col overflow-hidden rounded-md border border-(--color-line-weaker) bg-(--color-fill-hover)"
              >
                <div className="relative h-70 w-full md:h-85 lg:h-85 xl:h-115">
                  <Image
                    src={item.imageUrl}
                    alt={item.photographer.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover"
                  />
                </div>

                <div className="px-3 py-3 sm:px-4 sm:py-4">
                  <h2 className="truncate text-[22px] font-medium text-(--color-text-strong)">
                    {item.photographer.name} |{" "}
                    <span className="text-[18px] text-(--color-text-weak)">
                      {item.location.name}
                    </span>
                  </h2>
                  <p className="inline-flex items-center gap-x-2 text-base text-(--color-text-weak)">
                    <Clock className="h-4 w-4" color="#0D1420" /> Expires in: 30 days
                  </p>

                  <div className="mt-3 w-full">
                    <Button
                      onClick={() =>
                        handleDownload(
                          item.imageUrl,
                          `${item.photographer.name}-${item.location.name}`,
                        )
                      }
                      className="bg-brand-default text-text-inverse-strong flex w-full cursor-pointer items-center justify-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:opacity-95"
                    >
                      Download <Download size={16} color="#FDFDFE" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
