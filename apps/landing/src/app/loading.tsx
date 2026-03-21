import PageSkeleton from "@/components/Skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <PageSkeleton />
    </div>
  );
}
