import { Skeleton } from "@/components/ui/skeleton";

export function Loading() {
  return (
    <div className="flex flex-col gap-4">
      {[...Array(5)].map((_, index) => (
        <Skeleton key={index} className="h-48 rounded-lg w-full" />
      ))}
    </div>
  );
}
