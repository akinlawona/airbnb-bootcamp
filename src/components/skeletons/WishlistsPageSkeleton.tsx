import { Skeleton } from "@/components/ui/skeleton";

export function WishlistsPageSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <Skeleton className="h-10 w-40 mb-8" />

      {/* Wishlists Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="border rounded-lg overflow-hidden hover:shadow-lg transition"
          >
            {/* Image */}
            <Skeleton className="h-56 w-full" />

            {/* Content */}
            <div className="p-4 space-y-2">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
