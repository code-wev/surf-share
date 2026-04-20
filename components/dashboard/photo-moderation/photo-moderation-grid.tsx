import PhotoModerationCard from "@/components/dashboard/photo-moderation/photo-moderation-card";
import type {
  ModerationAction,
  PhotoModerationItem,
} from "@/components/dashboard/photo-moderation/photo-moderation-types";

type PhotoModerationGridProps = {
  items: PhotoModerationItem[];
  selectedIds: Set<number>;
  onToggleSelected: (id: number) => void;
  onAction: (id: number, action: ModerationAction) => void;
};

export default function PhotoModerationGrid({
  items,
  selectedIds,
  onToggleSelected,
  onAction,
}: PhotoModerationGridProps) {
  return (
    <div className="mt-4 grid grid-cols-1 gap-3 md:gap-6 sm:mt-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <PhotoModerationCard
          key={item.id}
          item={item}
          selected={selectedIds.has(item.id)}
          onToggleSelected={onToggleSelected}
          onAction={onAction}
        />
      ))}
    </div>
  );
}
