import { Skeleton } from "@/components/ui/skeleton";

export function Loading() {
  return (
    <div className="grid lg:grid-cols-4  sm:grid-cols-2 gap-4">
      {[...Array(15)].map((_, index) => (
        <Skeleton key={index} className="h-52 rounded-lg w-full" />
      ))}
    </div>
  );
}
