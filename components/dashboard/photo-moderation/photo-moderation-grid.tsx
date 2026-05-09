import PhotoModerationCard from "@/components/dashboard/photo-moderation/photo-moderation-card";
import type {
  ModerationAction,
  PhotoModerationItem,
} from "@/components/dashboard/photo-moderation/photo-moderation-types";

type PhotoModerationGridProps = {
  items: PhotoModerationItem[];
  selectedIds: Set<string>;
  onToggleSelected: (id: string) => void;
  onAction: (id: string, action: ModerationAction) => void;
  onOpenItem: (item: PhotoModerationItem) => void;
};

export default function PhotoModerationGrid({
  items,
  selectedIds,
  onToggleSelected,
  onAction,
  onOpenItem,
}: PhotoModerationGridProps) {
  return (
    <div className="mt-4 grid grid-cols-1 gap-3 sm:mt-6 sm:grid-cols-2 md:gap-6 lg:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <PhotoModerationCard
          key={item.id}
          item={item}
          selected={selectedIds.has(item.id)}
          onToggleSelected={onToggleSelected}
          onAction={onAction}
          onOpenItem={onOpenItem}
        />
      ))}
    </div>
  );
}
