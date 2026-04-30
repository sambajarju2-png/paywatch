"use client";

import React from "react";

interface ShimmerProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: number | string;
  className?: string;
}

/** Single shimmer bar */
export function Shimmer({ width = "100%", height = 16, borderRadius = 6, className }: ShimmerProps) {
  return (
    <div
      className={className}
      style={{
        width,
        height,
        borderRadius,
        background: "linear-gradient(90deg, #F1F5F9 25%, #E2E8F0 50%, #F1F5F9 75%)",
        backgroundSize: "200% 100%",
        animation: "shimmer 1.5s infinite",
      }}
    />
  );
}

/** Full table row skeleton */
export function TableRowSkeleton({ cols = 5 }: { cols?: number }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} style={{ padding: "14px 16px", borderBottom: "1px solid #F1F5F9" }}>
          <Shimmer width={i === 0 ? 140 : i === cols - 1 ? 60 : 80 + Math.random() * 40} height={13} />
        </td>
      ))}
    </tr>
  );
}

/** KPI card skeleton */
export function KpiSkeleton() {
  return (
    <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #E2E8F0", padding: 20 }}>
      <Shimmer width={80} height={11} borderRadius={4} />
      <div style={{ marginTop: 10 }}>
        <Shimmer width={56} height={28} borderRadius={4} />
      </div>
    </div>
  );
}

/** Table loading skeleton */
export function TableSkeleton({ rows = 8, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <TableRowSkeleton key={i} cols={cols} />
      ))}
    </>
  );
}

export const shimmerStyle = `
  @keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
`;
