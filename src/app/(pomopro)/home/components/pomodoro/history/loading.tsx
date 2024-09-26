import { Skeleton } from "@/components/ui/skeleton";

export function Loading() {
  return (
    <div className="border-b pb-6 last:border-b-0">
      <div className="flex justify-between items-center mb-2">
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-6 w-20" />
      </div>
      <div className="flex justify-between text-sm text-gray-500">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-1/4" />
      </div>
      <div className="flex justify-between text-sm text-gray-500 mt-2">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-4 w-1/3" />
      </div>
    </div>
  );
}