import { Flame } from "lucide-react";

export default function AnnouncementBar() {
  return (
    <div className="flex h-10 items-center justify-center bg-[#080c12] px-4 text-sm text-white">
      <div className="flex items-center gap-2">
        <Flame className="h-4 w-4 text-pink-500" />

        <span className="font-medium">
          FINAL SALE: UP TO 49% OFF ON ALL ITEMS!
        </span>

        <span className="hidden text-gray-400 sm:inline">
          Limited time only.
        </span>
      </div>
    </div>
  );
}