"use client";

export function SkeletonLine({ width = "100%", height = 12 }: { width?: string | number; height?: number }) {
  return <div className="skeleton" style={{ width, height, borderRadius: 6 }} />;
}

export function SkeletonCard({ height = 160 }: { height?: number }) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
      <div className="skeleton" style={{ width: 40, height: 40, borderRadius: 10, marginBottom: 12 }} />
      <SkeletonLine width="60%" height={14} />
      <div style={{ height: 8 }} />
      <SkeletonLine width="100%" height={10} />
      <div style={{ height: 4 }} />
      <SkeletonLine width="80%" height={10} />
    </div>
  );
}

export function SkeletonPhone() {
  return (
    <div className="rounded-[36px] bg-[var(--border)] overflow-hidden" style={{ width: 200, height: 420, opacity: 0.4 }}>
      <div className="skeleton" style={{ width: "100%", height: "100%" }} />
    </div>
  );
}

export default function PageSkeleton() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="text-center mb-12">
        <SkeletonLine width={240} height={28} />
        <div style={{ height: 8 }} />
        <SkeletonLine width={360} height={14} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
}
