import Image from "next/image";
import { Calendar, Check, X } from "lucide-react";

import type {
  ModerationAction,
  PhotoModerationItem,
} from "@/components/dashboard/photo-moderation/photo-moderation-types";

type PhotoModerationCardProps = {
  item: PhotoModerationItem;
  selected: boolean;
  onToggleSelected: (id: number) => void;
  onAction: (id: number, action: ModerationAction) => void;
};

export default function PhotoModerationCard({
  item,
  selected,
  onToggleSelected,
  onAction,
}: PhotoModerationCardProps) {
  return (
    <article className="overflow-hidden rounded-sm border border-line-weaker bg-surface-muted-100">
      <div className="relative overflow-hidden">
        <label className="absolute top-1.5 left-1.5 z-10 inline-flex cursor-pointer items-center">
          <input
            type="checkbox"
            checked={selected}
            onChange={() => onToggleSelected(item.id)}
            className="h-3 w-3 rounded-xs border border-line-weaker bg-white accent-text-strong"
            aria-label={`Select ${item.photographer} submission`}
          />
        </label>

        <Image
          src={item.imageSrc}
          alt={`${item.photographer} surf photo from ${item.location}`}
          width={600}
          height={440}
          className="h-80 w-full object-cover md:h-90 xl:h-100"
        />
      </div>

      <div className="px-5 py-4">
        <p className="text-[22px] text-text-strong">
          <span className="font-semibold">{item.photographer}</span>
          <span className="text-text-weak"> | {item.location} | {item.imageCount} Images</span>
        </p>

        <div className="text-text-weak mt-2 flex items-center gap-2 text-[16px]">
          <Calendar size={16} color="black"/>
          <span>{item.submittedAt}</span>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => onAction(item.id, "reject")}
            className="inline-flex h-7 items-center justify-center gap-1 rounded-sm bg-[#FCE7E7] px-2 text-[11px] font-medium text-[#D85B5B]"
          >
            Reject
            <X size={10} />
          </button>

          <button
            type="button"
            onClick={() => onAction(item.id, "approve")}
            className="inline-flex h-7 items-center justify-center gap-1 rounded-sm bg-[#EAF8EE] px-2 text-[11px] font-medium text-[#2AA65C]"
          >
            Approve
            <Check size={10} />
          </button>
        </div>
      </div>
    </article>
  );
}
