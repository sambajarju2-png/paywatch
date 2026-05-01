import React from "react";
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Easing,
  Img,
  staticFile,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";

const { fontFamily } = loadFont("normal", {
  weights: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
});

// ============================================================
// REVOLUT-STYLE ENERGETIC COLOR PALETTE
// ============================================================
const C = {
  bg: "#F4F7FB",
  surface: "#FFFFFF",
  navy: "#0A2540",
  blue: "#2563EB",
  blueBright: "#3B82F6",
  blueLight: "#EFF6FF",
  text: "#0F172A",
  muted: "#64748B",
  border: "#E2E8F0",
  green: "#059669",
  greenBright: "#10B981",
  amber: "#D97706",
  orange: "#EA580C",
  red: "#DC2626",
  redBright: "#EF4444",
  darkRed: "#991B1B",
  purple: "#7C3AED",
  purpleBright: "#8B5CF6",
  dark: "#0A1628",
  darker: "#050B1A",
  darkSurface: "#1E293B",
  teal: "#14B8A6",
  tealBright: "#2DD4BF",
  pink: "#EC4899",
  yellow: "#F59E0B",
};

const FONT = fontFamily;

// ============================================================
// LUCIDE ICON SYSTEM (no emojis, ever)
// ============================================================
function LucideIcon({
  d,
  size = 24,
  color = C.navy,
  strokeWidth = 1.8,
  fill = "none",
  style = {},
}: {
  d: string | string[];
  size?: number;
  color?: string;
  strokeWidth?: number;
  fill?: string;
  style?: React.CSSProperties;
}) {
  const paths = Array.isArray(d) ? d : [d];
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={fill}
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={style}
    >
      {paths.map((p, i) => (
        <path key={i} d={p} />
      ))}
    </svg>
  );
}

const ICONS = {
  alertTriangle: [
    "M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z",
    "M12 9v4",
    "M12 17h.01",
  ],
  shield: ["M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"],
  shieldCheck: [
    "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
    "M9 12l2 2 4-4",
  ],
  creditCard: [
    "M21 4H3a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z",
    "M1 10h22",
  ],
  trendingUp: ["M23 6l-9.5 9.5-5-5L1 18", "M17 6h6v6"],
  trendingDown: ["M23 18l-9.5-9.5-5 5L1 6", "M17 18h6v-6"],
  layoutDashboard: [
    "M3 3h7v9H3z",
    "M14 3h7v5h-7z",
    "M14 12h7v9h-7z",
    "M3 16h7v5H3z",
  ],
  messageCircle: [
    "M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z",
  ],
  camera: [
    "M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z",
    "M12 13a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  ],
  check: ["M20 6L9 17l-5-5"],
  phone: [
    "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z",
  ],
  phoneOff: [
    "M5.19 5.19A19.563 19.563 0 0 0 2.12 4.18A2 2 0 0 0 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91",
    "M14.05 18.36a16.04 16.04 0 0 0 5.95-5.95",
    "M1 1l22 22",
  ],
  fileText: [
    "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z",
    "M14 2v6h6",
    "M16 13H8",
    "M16 17H8",
    "M10 9H8",
  ],
  zap: ["M13 2L3 14h9l-1 8 10-12h-9l1-8z"],
  users: [
    "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2",
    "M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
    "M23 21v-2a4 4 0 0 0-3-3.87",
    "M16 3.13a4 4 0 0 1 0 7.75",
  ],
  arrowRight: ["M5 12h14", "M12 5l7 7-7 7"],
  arrowDown: ["M12 5v14", "M19 12l-7 7-7-7"],
  arrowUp: ["M12 19V5", "M5 12l7-7 7 7"],
  euro: [
    "M18 8.5a6.5 6.5 0 0 0-11.24-1",
    "M18 15.5a6.5 6.5 0 0 1-11.24 1",
    "M3 10h12",
    "M3 14h12",
  ],
  mic: [
    "M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z",
    "M19 10v2a7 7 0 0 1-14 0v-2",
    "M12 19v4",
    "M8 23h8",
  ],
  bell: [
    "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9",
    "M13.73 21a2 2 0 0 1-3.46 0",
  ],
  sparkles: [
    "M12 3l1.9 5.8L20 11l-5.8 1.9L12 19l-1.9-5.8L4 11l5.8-1.9L12 3z",
    "M5 3v4",
    "M3 5h4",
    "M19 17v4",
    "M17 19h4",
  ],
  x: ["M18 6L6 18", "M6 6l12 12"],
  plus: ["M12 5v14", "M5 12h14"],
  scan: [
    "M3 7V5a2 2 0 0 1 2-2h2",
    "M17 3h2a2 2 0 0 1 2 2v2",
    "M21 17v2a2 2 0 0 1-2 2h-2",
    "M7 21H5a2 2 0 0 1-2-2v-2",
    "M7 12h10",
  ],
};

// ============================================================
// SPRING CONFIGS — REVOLUT FAST + SNAPPY
// ============================================================
const SPRING_SNAP = { stiffness: 200, damping: 18, mass: 0.6 };
const SPRING_BOUNCE = { stiffness: 220, damping: 12, mass: 0.6 };
const SPRING_ELASTIC = { stiffness: 320, damping: 11, mass: 0.5 };
const SPRING_GENTLE = { stiffness: 100, damping: 22, mass: 1.0 };

// ============================================================
// REVOLUT-STYLE GRADIENT MESH (vibrant, animated)
// ============================================================
function GradientMesh({
  colors = [C.blue, C.purple, C.teal],
  opacity = 0.25,
  bg = C.bg,
}: {
  colors?: string[];
  opacity?: number;
  bg?: string;
}) {
  const frame = useCurrentFrame();
  const positions = colors.map((_, i) => ({
    x: 30 + Math.sin(frame * 0.008 + i * 2) * 25,
    y: 30 + Math.cos(frame * 0.006 + i * 1.5) * 25,
  }));

  return (
    <AbsoluteFill style={{ backgroundColor: bg, overflow: "hidden" }}>
      {colors.map((color, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: 900 - i * 100,
            height: 900 - i * 100,
            borderRadius: "50%",
            background: color,
            filter: `blur(${180 - i * 20}px)`,
            opacity: opacity * (1 - i * 0.15),
            left: `${positions[i].x}%`,
            top: `${i === 0 ? positions[i].y : positions[i].y + 20}%`,
            transform: "translate(-50%, -50%)",
            mixBlendMode: "screen",
          }}
        />
      ))}
    </AbsoluteFill>
  );
}

// ============================================================
// VIGNETTE
// ============================================================
function Vignette({ intensity = 0.4 }: { intensity?: number }) {
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 50% 50%, transparent 35%, rgba(0,0,0,${intensity}) 100%)`,
        pointerEvents: "none",
        zIndex: 999,
      }}
    />
  );
}

// ============================================================
// FILM GRAIN OVERLAY (subtle texture)
// ============================================================
function FilmGrain() {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        opacity: 0.04,
        mixBlendMode: "overlay",
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        transform: `translate(${(frame % 7) - 3}px, ${(frame % 5) - 2}px)`,
        pointerEvents: "none",
        zIndex: 998,
      }}
    />
  );
}

// ============================================================
// FLOATING PARTICLES
// ============================================================
function Particles({
  count = 25,
  color = C.blue,
  area,
}: {
  count?: number;
  color?: string;
  area?: { x: number; y: number; w: number; h: number };
}) {
  const frame = useCurrentFrame();
  const a = area || { x: 0, y: 0, w: 1080, h: 1920 };
  const particles = React.useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        x: ((i * 73) % 100) / 100 * a.w + a.x,
        y: ((i * 137) % 100) / 100 * a.h + a.y,
        size: 3 + ((i * 17) % 5),
        speed: 0.5 + ((i * 11) % 100) / 100,
        phase: ((i * 31) % 100) / 100 * Math.PI * 2,
      })),
    [count, a.w, a.h, a.x, a.y]
  );

  return (
    <>
      {particles.map((p, i) => {
        const cycle = (frame * p.speed + p.phase * 60) % 200;
        const op = interpolate(cycle, [0, 60, 140, 200], [0, 0.6, 0.6, 0]);
        const scale = interpolate(cycle, [0, 60, 140, 200], [0, 1, 1, 0]);
        const yOff = Math.sin((frame * 0.02 + p.phase) * p.speed) * 40;
        const xOff = Math.cos((frame * 0.015 + p.phase) * p.speed) * 25;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              width: p.size,
              height: p.size,
              borderRadius: "50%",
              backgroundColor: color,
              left: p.x + xOff,
              top: p.y + yOff,
              opacity: op,
              transform: `scale(${scale})`,
              boxShadow: `0 0 ${p.size * 4}px ${color}80`,
            }}
          />
        );
      })}
    </>
  );
}

// ============================================================
// MASSIVE BACKGROUND TEXT (the "behind phone" hero text)
// ============================================================
function BehindText({
  text,
  fontSize = 480,
  color = C.blue,
  opacity = 0.12,
  x = 0,
  y = 0,
  rotation = 0,
  from = 0,
  fontWeight = 900,
  italic = false,
  gradient,
}: {
  text: string;
  fontSize?: number;
  color?: string;
  opacity?: number;
  x?: number;
  y?: number;
  rotation?: number;
  from?: number;
  fontWeight?: number;
  italic?: boolean;
  gradient?: { from: string; to: string };
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({
    frame: frame - from,
    fps,
    config: SPRING_GENTLE,
    durationInFrames: 50,
  });
  const finalOp = interpolate(s, [0, 1], [0, opacity]);
  const scale = interpolate(s, [0, 1], [0.85, 1]);

  const baseStyle: React.CSSProperties = {
    position: "absolute",
    left: x,
    top: y,
    fontSize,
    fontWeight,
    fontFamily: FONT,
    opacity: finalOp,
    transform: `scale(${scale}) rotate(${rotation}deg)`,
    letterSpacing: "-0.04em",
    lineHeight: 0.85,
    whiteSpace: "nowrap",
    pointerEvents: "none",
    fontStyle: italic ? "italic" : "normal",
    zIndex: 0,
  };

  if (gradient) {
    return (
      <div
        style={{
          ...baseStyle,
          background: `linear-gradient(135deg, ${gradient.from} 0%, ${gradient.to} 100%)`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        {text}
      </div>
    );
  }

  return <div style={{ ...baseStyle, color }}>{text}</div>;
}

// ============================================================
// LETTER-BY-LETTER BOLD REVEAL
// ============================================================
function WordReveal({
  text,
  from,
  fontSize = 56,
  color = C.navy,
  fontWeight = 800,
  letterSpacing = "-0.02em",
  staggerSpeed = 1.5,
  style = {},
}: {
  text: string;
  from: number;
  fontSize?: number;
  color?: string;
  fontWeight?: number;
  letterSpacing?: string;
  staggerSpeed?: number;
  style?: React.CSSProperties;
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const chars = text.split("");
  return (
    <div
      style={{
        display: "flex",
        fontFamily: FONT,
        fontSize,
        fontWeight,
        color,
        letterSpacing,
        lineHeight: 1.05,
        ...style,
      }}
    >
      {chars.map((ch, i) => {
        const s = spring({
          frame: frame - from - i * staggerSpeed,
          fps,
          config: SPRING_BOUNCE,
          durationInFrames: 25,
        });
        const y = interpolate(s, [0, 1], [50, 0]);
        const op = interpolate(s, [0, 0.4], [0, 1], { extrapolateRight: "clamp" });
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              transform: `translateY(${y}px)`,
              opacity: op,
            }}
          >
            {ch === " " ? "\u00A0" : ch}
          </span>
        );
      })}
    </div>
  );
}

// ============================================================
// ROLLING NUMBER COUNTER
// ============================================================
function RollingNumber({
  target,
  decimals = 0,
  prefix = "",
  suffix = "",
  duration = 50,
  from = 0,
  thousandSep = ".",
  decimalSep = ",",
  style = {},
}: {
  target: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  from?: number;
  thousandSep?: string;
  decimalSep?: string;
  style?: React.CSSProperties;
}) {
  const frame = useCurrentFrame() - from;
  if (frame < 0) return <span style={style}>{prefix}0{suffix}</span>;
  const progress = Math.min(frame / duration, 1);
  const eased = Easing.bezier(0.25, 1.5, 0.45, 1)(progress);
  const value = target * Math.min(eased, 1);
  const fixed = value.toFixed(decimals);
  const [intPart, decPart] = fixed.split(".");
  const intFormatted = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, thousandSep);
  const formatted = decimals > 0 ? `${intFormatted}${decimalSep}${decPart}` : intFormatted;
  return (
    <span
      style={{ fontFamily: FONT, fontVariantNumeric: "tabular-nums", ...style }}
    >
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}

// ============================================================
// SPRING-IN WRAPPER
// ============================================================
function SpringIn({
  children,
  from,
  delay = 0,
  config = SPRING_SNAP,
  fromY = 30,
  fromScale = 0.85,
  style = {},
}: {
  children: React.ReactNode;
  from: number;
  delay?: number;
  config?: { stiffness: number; damping: number; mass: number };
  fromY?: number;
  fromScale?: number;
  style?: React.CSSProperties;
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({
    frame: frame - from - delay,
    fps,
    config,
    durationInFrames: 35,
  });
  return (
    <div
      style={{
        transform: `translateY(${interpolate(s, [0, 1], [fromY, 0])}px) scale(${interpolate(s, [0, 1], [fromScale, 1])})`,
        opacity: interpolate(s, [0, 0.4], [0, 1], { extrapolateRight: "clamp" }),
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ============================================================
// IPHONE 15 PRO MOCKUP — BALANCED SCALE 1.55 (~65% frame height)
// ============================================================
const PHONE_W = 375;
const PHONE_H = 812;
const PHONE_SCALE = 1.55;

function IPhoneMockup({
  children,
  from = 0,
  cam = {},
}: {
  children: React.ReactNode;
  from?: number;
  cam?: {
    scaleFrom?: number;
    scaleTo?: number;
    rotateY?: [number, number];
    rotateX?: [number, number];
    translateX?: [number, number];
    translateY?: [number, number];
    duration?: number;
  };
}) {
  const frame = useCurrentFrame();
  const localFrame = frame - from;

  // Constant gentle floating (always)
  const floatY = Math.sin(frame * 0.014) * 6;
  const floatRotY = Math.sin(frame * 0.009) * 1.5;
  const floatRotX = Math.cos(frame * 0.011) * 0.8;

  // Scene-specific camera animation
  const dur = cam.duration || 100;
  const camProgress = Math.min(Math.max(localFrame / dur, 0), 1);
  const eased = Easing.bezier(0.4, 0, 0.2, 1)(camProgress);

  const scale = interpolate(eased, [0, 1], [cam.scaleFrom ?? 1, cam.scaleTo ?? 1]);
  const ry = interpolate(eased, [0, 1], cam.rotateY ?? [0, 0]) + floatRotY;
  const rx = interpolate(eased, [0, 1], cam.rotateX ?? [0, 0]) + floatRotX;
  const tx = interpolate(eased, [0, 1], cam.translateX ?? [0, 0]);
  const ty = interpolate(eased, [0, 1], cam.translateY ?? [0, 0]) + floatY;

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: `
          translate(-50%, -50%)
          perspective(1500px)
          translateX(${tx}px)
          translateY(${ty}px)
          rotateY(${ry}deg)
          rotateX(${rx}deg)
          scale(${scale * PHONE_SCALE})
        `,
        transformStyle: "preserve-3d",
        zIndex: 10,
      }}
    >
      <div
        style={{
          width: PHONE_W,
          height: PHONE_H,
          borderRadius: 56,
          background: "#000",
          boxShadow:
            "0 60px 140px -20px rgba(0,0,0,0.45), 0 0 0 11px #1a1a2e, 0 0 0 13px #2d2d44, inset 0 0 0 2px rgba(255,255,255,0.08)",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Dynamic Island */}
        <div
          style={{
            position: "absolute",
            top: 11,
            left: "50%",
            transform: "translateX(-50%)",
            width: 124,
            height: 36,
            background: "#000",
            borderRadius: 20,
            zIndex: 60,
          }}
        />

        {/* Status bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 56,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 32px",
            zIndex: 50,
            color: C.text,
            fontSize: 15,
            fontWeight: 600,
            fontFamily: FONT,
          }}
        >
          <span>9:41</span>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <svg width="18" height="13" viewBox="0 0 16 12">
              <path d="M1 8h2v4H1zM5 5h2v7H5zM9 2h2v10H9zM13 0h2v12h-2z" fill={C.text} opacity="0.9" />
            </svg>
            <svg width="26" height="13" viewBox="0 0 24 12">
              <rect x="0" y="1" width="20" height="10" rx="2.5" stroke={C.text} strokeWidth="1" fill="none" opacity="0.6" />
              <rect x="21" y="4" width="2" height="4" rx="0.5" fill={C.text} opacity="0.4" />
              <rect x="2" y="3" width="14" height="6" rx="1" fill={C.green} />
            </svg>
          </div>
        </div>

        {/* Screen content */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            overflow: "hidden",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// APP TOPBAR (matches real PayWatch app)
// ============================================================
function AppTopbar() {
  return (
    <div
      style={{
        height: 88,
        padding: "62px 18px 8px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "rgba(255,255,255,0.85)",
        backdropFilter: "blur(12px)",
        borderBottom: `1px solid ${C.border}`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <Img
          src={staticFile("/logo.svg")}
          style={{ height: 22, width: "auto" }}
        />
      </div>
      <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
        <div style={{ position: "relative" }}>
          <LucideIcon d={ICONS.bell} size={20} color={C.muted} strokeWidth={1.5} />
          <div
            style={{
              position: "absolute",
              top: -2,
              right: -2,
              width: 8,
              height: 8,
              borderRadius: 4,
              background: C.red,
              border: "2px solid #fff",
            }}
          />
        </div>
      </div>
    </div>
  );
}

// ============================================================
// BOTTOM TAB BAR
// ============================================================
function BottomTabBar({ activeIndex = 0 }: { activeIndex?: number }) {
  const tabs = [
    { label: "Overzicht", icon: ICONS.layoutDashboard },
    { label: "Betalingen", icon: ICONS.creditCard },
    { label: "Feed", icon: ICONS.users },
    { label: "Stats", icon: ICONS.trendingUp },
    { label: "Buddy", icon: ICONS.messageCircle },
  ];
  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: 86,
        background: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(20px)",
        borderTop: `1px solid ${C.border}`,
        display: "flex",
        justifyContent: "space-around",
        alignItems: "flex-start",
        paddingTop: 10,
        zIndex: 40,
      }}
    >
      {tabs.map((t, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 3,
          }}
        >
          <LucideIcon
            d={t.icon}
            size={i === 2 ? 28 : 22}
            color={i === activeIndex ? C.blue : C.muted}
            strokeWidth={i === activeIndex ? 2 : 1.5}
          />
          <span
            style={{
              fontSize: 10,
              fontWeight: i === activeIndex ? 700 : 500,
              color: i === activeIndex ? C.blue : C.muted,
              fontFamily: FONT,
            }}
          >
            {t.label}
          </span>
          {i === activeIndex && (
            <div
              style={{
                width: 4,
                height: 4,
                borderRadius: 2,
                background: C.blue,
                marginTop: 1,
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

// ============================================================
// REALISTIC BILL / LETTER (paper feel)
// ============================================================
function RealisticLetter({
  vendor,
  amount,
  stage,
  stageColor,
  from,
  delay = 0,
  startX = 600,
  startY = -300,
  endX = 0,
  endY = 0,
  startRotation = 15,
  endRotation = -3,
  showStamp = false,
  width = 340,
}: {
  vendor: string;
  amount: string;
  stage: string;
  stageColor: string;
  from: number;
  delay?: number;
  startX?: number;
  startY?: number;
  endX?: number;
  endY?: number;
  startRotation?: number;
  endRotation?: number;
  showStamp?: boolean;
  width?: number;
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({
    frame: frame - from - delay,
    fps,
    config: { stiffness: 140, damping: 16, mass: 0.85 },
    durationInFrames: 50,
  });
  const x = interpolate(s, [0, 1], [startX, endX]);
  const y = interpolate(s, [0, 1], [startY, endY]);
  const rot = interpolate(s, [0, 1], [startRotation, endRotation]);
  const scale = interpolate(s, [0, 1], [0.7, 1]);
  const op = interpolate(s, [0, 0.3], [0, 1], { extrapolateRight: "clamp" });

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        width,
        transform: `translate(-50%, -50%) translate(${x}px, ${y}px) rotate(${rot}deg) scale(${scale})`,
        opacity: op,
        zIndex: 5,
      }}
    >
      <div
        style={{
          background: "#FEFEFE",
          borderRadius: 6,
          padding: "26px 28px",
          boxShadow:
            "0 30px 90px rgba(0,0,0,0.18), 0 8px 24px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.95)",
          border: "1px solid #E5E5E5",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: 6,
            background: stageColor,
          }}
        />

        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: stageColor,
            fontFamily: FONT,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            marginBottom: 10,
          }}
        >
          {stage}
        </div>

        <div
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: C.navy,
            fontFamily: FONT,
            marginBottom: 8,
          }}
        >
          {vendor}
        </div>

        <div
          style={{
            fontSize: 42,
            fontWeight: 800,
            color: C.navy,
            fontFamily: FONT,
            letterSpacing: "-0.03em",
            marginBottom: 14,
          }}
        >
          {amount}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ width: "85%", height: 5, borderRadius: 3, background: "#E8E8E8" }} />
          <div style={{ width: "65%", height: 5, borderRadius: 3, background: "#E8E8E8" }} />
          <div style={{ width: "75%", height: 5, borderRadius: 3, background: "#E8E8E8" }} />
        </div>

        {showStamp && (
          <div
            style={{
              position: "absolute",
              top: 22,
              right: 18,
              padding: "4px 14px",
              border: `3px solid ${C.red}`,
              color: C.red,
              fontSize: 13,
              fontWeight: 800,
              fontFamily: FONT,
              transform: "rotate(12deg)",
              opacity: 0.88,
              letterSpacing: "0.12em",
            }}
          >
            URGENT
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// PAYBUDDY ORB — MULTI-LAYER ENERGY
// ============================================================
function PayBuddyOrb({
  size = 220,
  from = 0,
}: {
  size?: number;
  from?: number;
}) {
  const frame = useCurrentFrame();
  const localFrame = frame - from;
  if (localFrame < 0) return null;

  const pulse = 1 + Math.sin(localFrame * 0.07) * 0.05;
  const glow = 0.6 + Math.sin(localFrame * 0.09) * 0.25;

  const ringCount = 5;
  const rings = Array.from({ length: ringCount }, (_, i) => {
    const cycle = ((localFrame + i * 18) % 100) / 100;
    return {
      scale: 1 + cycle * 0.7,
      opacity: (1 - cycle) * 0.35,
      rotation: localFrame * (0.4 + i * 0.12),
    };
  });

  const orbParticles = Array.from({ length: 18 }, (_, i) => {
    const angle = (i / 18) * Math.PI * 2 + localFrame * 0.025;
    const r = size * 0.55 + Math.sin(localFrame * 0.04 + i) * 25;
    return {
      x: Math.cos(angle) * r,
      y: Math.sin(angle) * r,
      size: 3 + Math.sin(localFrame * 0.06 + i * 0.7) * 2,
      opacity: 0.5 + Math.sin(localFrame * 0.05 + i * 1.1) * 0.3,
    };
  });

  return (
    <div
      style={{
        position: "relative",
        width: size * 2.8,
        height: size * 2.8,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Expanding rings */}
      {rings.map((ring, i) => (
        <div
          key={`ring-${i}`}
          style={{
            position: "absolute",
            width: size,
            height: size,
            borderRadius: "50%",
            border: `2px solid ${C.teal}`,
            opacity: ring.opacity,
            transform: `scale(${ring.scale}) rotate(${ring.rotation}deg)`,
          }}
        />
      ))}

      {/* Outer glow */}
      <div
        style={{
          position: "absolute",
          width: size * 2,
          height: size * 2,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${C.teal}40 0%, transparent 70%)`,
          filter: "blur(50px)",
          opacity: glow,
          transform: `scale(${pulse})`,
        }}
      />

      <div
        style={{
          position: "absolute",
          width: size * 1.3,
          height: size * 1.3,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${C.purple}25 0%, ${C.teal}20 50%, transparent 70%)`,
          filter: "blur(30px)",
          opacity: 0.7 + Math.sin(localFrame * 0.05) * 0.2,
        }}
      />

      {/* Core sphere */}
      <div
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          background: `radial-gradient(circle at 35% 30%, #4ADE80, ${C.teal}, #0D9488)`,
          boxShadow: `
            0 0 80px ${C.teal}80,
            0 0 160px ${C.teal}40,
            inset 0 -20px 40px rgba(0,0,0,0.25),
            inset 0 10px 25px rgba(255,255,255,0.2)
          `,
          transform: `scale(${pulse})`,
          position: "relative",
          zIndex: 2,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "12%",
            left: "20%",
            width: "40%",
            height: "30%",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* Orbital particles */}
      {orbParticles.map((p, i) => (
        <div
          key={`op-${i}`}
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            background: i % 3 === 0 ? C.teal : i % 3 === 1 ? C.greenBright : "#4ADE80",
            transform: `translate(${p.x}px, ${p.y}px) translate(-50%, -50%)`,
            opacity: p.opacity,
            boxShadow: `0 0 ${p.size * 4}px ${C.teal}80`,
          }}
        />
      ))}
    </div>
  );
}

// ============================================================
// HEALTH GAUGE (animated arc)
// ============================================================
function HealthGauge({
  score,
  size = 200,
  from = 0,
  color = C.red,
}: {
  score: number;
  size?: number;
  from?: number;
  color?: string;
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localFrame = frame - from;
  if (localFrame < 0) return null;

  const s = spring({
    frame: localFrame,
    fps,
    config: SPRING_GENTLE,
    durationInFrames: 60,
  });

  const radius = size / 2 - 14;
  const circ = 2 * Math.PI * radius;
  const dashTarget = (score / 100) * circ;
  const dash = dashTarget * s;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={C.border}
        strokeWidth="12"
        opacity="0.35"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth="12"
        strokeLinecap="round"
        strokeDasharray={`${dash} ${circ}`}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ filter: `drop-shadow(0 0 12px ${color}80)` }}
      />
      <text
        x={size / 2}
        y={size / 2 - 6}
        textAnchor="middle"
        fill={color}
        fontSize={size * 0.32}
        fontWeight="800"
        fontFamily={FONT}
      >
        {Math.round(score * s)}
      </text>
      <text
        x={size / 2}
        y={size / 2 + 24}
        textAnchor="middle"
        fill={C.muted}
        fontSize={size * 0.08}
        fontWeight="600"
        fontFamily={FONT}
      >
        Actie nodig
      </text>
    </svg>
  );
}

// ============================================================
// SCENE 1: LOGO REVEAL (0 - 120 / 0-4s)
// ============================================================
function Scene1Logo() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Logo entry
  const logoS = spring({ frame: frame - 15, fps, config: SPRING_ELASTIC, durationInFrames: 35 });
  const logoScale = interpolate(logoS, [0, 1], [0, 1]);
  const logoOp = interpolate(logoS, [0, 0.3], [0, 1], { extrapolateRight: "clamp" });

  // Tagline
  const taglineY = interpolate(frame, [55, 80], [40, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const taglineOp = interpolate(frame, [55, 80], [0, 1], { extrapolateRight: "clamp" });

  // Exit
  const exitOp = interpolate(frame, [100, 120], [1, 0], { extrapolateRight: "clamp" });
  const exitScale = interpolate(frame, [100, 120], [1, 1.2], { extrapolateRight: "clamp" });

  // Sweep light effect
  const sweepX = interpolate(frame, [40, 100], [-100, 1200]);

  return (
    <AbsoluteFill style={{ opacity: exitOp, transform: `scale(${exitScale})` }}>
      <GradientMesh
        colors={[C.blue, C.purple, C.teal]}
        opacity={0.35}
        bg={C.darker}
      />

      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div
          style={{
            transform: `scale(${logoScale})`,
            opacity: logoOp,
            filter: `drop-shadow(0 30px 80px ${C.blue}60)`,
          }}
        >
          <Img
            src={staticFile("/logo-dark.svg")}
            style={{ width: 700, height: "auto", display: "block" }}
          />
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 480,
            transform: `translateY(${taglineY}px)`,
            opacity: taglineOp,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
          }}
        >
          <div
            style={{
              fontSize: 42,
              fontWeight: 600,
              color: "rgba(255,255,255,0.85)",
              fontFamily: FONT,
              textAlign: "center",
              letterSpacing: "-0.02em",
            }}
          >
            De slimme buffer
          </div>
          <div
            style={{
              fontSize: 42,
              fontWeight: 600,
              color: "rgba(255,255,255,0.55)",
              fontFamily: FONT,
              textAlign: "center",
              letterSpacing: "-0.02em",
            }}
          >
            tussen jou en incassokosten
          </div>
        </div>
      </AbsoluteFill>

      {/* Light sweep */}
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          width: 200,
          left: sweepX,
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)",
          filter: "blur(40px)",
          pointerEvents: "none",
        }}
      />

      <Particles
        count={30}
        color="rgba(255,255,255,0.3)"
        area={{ x: 0, y: 0, w: 1080, h: 1920 }}
      />
      <Vignette intensity={0.55} />
      <FilmGrain />
    </AbsoluteFill>
  );
}

// ============================================================
// SCENE 2: PROBLEM (120 - 360 / 4-12s)
// FIXED: No overlapping text. Single flex column with frame-based opacity.
// ============================================================
function Scene2Problem() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entryOp = interpolate(frame, [0, 18], [0, 1], { extrapolateRight: "clamp" });
  const exitOp = interpolate(frame, [210, 240], [1, 0], { extrapolateRight: "clamp" });
  const exitBlur = interpolate(frame, [210, 240], [0, 14], { extrapolateRight: "clamp" });

  // Camera shake on letter impact
  const shakeFrame = 80;
  const shakeMag = frame >= shakeFrame && frame < shakeFrame + 12
    ? (12 - (frame - shakeFrame)) * 0.8
    : 0;
  const shakeX = Math.sin(frame * 6) * shakeMag;
  const shakeY = Math.cos(frame * 7) * shakeMag * 0.6;

  // Big "3.1" hero number entry — scale + bounce
  const heroS = spring({ frame: frame - 25, fps, config: SPRING_ELASTIC, durationInFrames: 35 });
  const heroScale = interpolate(heroS, [0, 1], [0, 1]);
  const heroOp = interpolate(heroS, [0, 0.3], [0, 1], { extrapolateRight: "clamp" });

  // "MILJOEN" label
  const subS = spring({ frame: frame - 50, fps, config: SPRING_BOUNCE, durationInFrames: 30 });
  const subScale = interpolate(subS, [0, 1], [0.6, 1]);
  const subOp = interpolate(subS, [0, 0.4], [0, 1], { extrapolateRight: "clamp" });

  // "huishoudens kampen met schulden" subtitle
  const captionOp = interpolate(frame, [85, 115], [0, 1], { extrapolateRight: "clamp" });
  const captionY = interpolate(frame, [85, 115], [40, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill
      style={{
        opacity: entryOp * exitOp,
        filter: `blur(${exitBlur}px)`,
        transform: `translate(${shakeX}px, ${shakeY}px)`,
      }}
    >
      <GradientMesh colors={[C.red, C.orange, C.amber]} opacity={0.18} bg={C.bg} />

      {/* Realistic letters flying in from corners */}
      <RealisticLetter
        vendor="Belastingdienst"
        amount="€174,00"
        stage="AANMANING"
        stageColor={C.orange}
        from={5}
        startX={500}
        startY={-700}
        endX={250}
        endY={-450}
        startRotation={28}
        endRotation={-7}
        showStamp
        width={300}
      />
      <RealisticLetter
        vendor="Vattenfall"
        amount="€400,00"
        stage="INCASSO"
        stageColor={C.red}
        from={5}
        delay={8}
        startX={-600}
        startY={-500}
        endX={-260}
        endY={-280}
        startRotation={-22}
        endRotation={5}
        width={300}
      />
      <RealisticLetter
        vendor="Ziggo"
        amount="€89,95"
        stage="HERINNERING"
        stageColor={C.amber}
        from={5}
        delay={16}
        startX={500}
        startY={700}
        endX={240}
        endY={580}
        startRotation={32}
        endRotation={-9}
        width={300}
      />
      <RealisticLetter
        vendor="Gemeente"
        amount="€310,05"
        stage="AANMANING"
        stageColor={C.orange}
        from={5}
        delay={24}
        startX={-500}
        startY={700}
        endX={-260}
        endY={420}
        startRotation={-30}
        endRotation={6}
        width={300}
      />

      {/* CENTER: Big text stack (single flex column, no nested Sequences) */}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", zIndex: 20, pointerEvents: "none" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          {/* "3.1" — gigantic hero */}
          <div
            style={{
              fontSize: 380,
              fontWeight: 900,
              fontFamily: FONT,
              letterSpacing: "-0.06em",
              lineHeight: 0.85,
              transform: `scale(${heroScale})`,
              opacity: heroOp,
              background: `linear-gradient(135deg, ${C.red} 0%, ${C.orange} 50%, ${C.amber} 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              filter: `drop-shadow(0 25px 60px ${C.red}30)`,
            }}
          >
            3.1
          </div>

          {/* MILJOEN */}
          <div
            style={{
              fontSize: 130,
              fontWeight: 800,
              fontFamily: FONT,
              color: C.navy,
              letterSpacing: "-0.04em",
              lineHeight: 1,
              transform: `scale(${subScale})`,
              opacity: subOp,
              marginTop: -10,
            }}
          >
            MILJOEN
          </div>

          {/* huishoudens kampen met schulden — proper spacing */}
          <div
            style={{
              fontSize: 36,
              fontWeight: 600,
              fontFamily: FONT,
              color: C.muted,
              letterSpacing: "-0.01em",
              opacity: captionOp,
              transform: `translateY(${captionY}px)`,
              marginTop: 24,
              textAlign: "center",
            }}
          >
            huishoudens
          </div>
          <div
            style={{
              fontSize: 36,
              fontWeight: 700,
              fontFamily: FONT,
              color: C.red,
              letterSpacing: "-0.01em",
              opacity: captionOp,
              transform: `translateY(${captionY}px)`,
              textAlign: "center",
            }}
          >
            kampen met schulden
          </div>
        </div>
      </AbsoluteFill>

      <Particles count={15} color={`${C.red}80`} area={{ x: 80, y: 200, w: 920, h: 1400 }} />
      <Vignette intensity={0.32} />
      <FilmGrain />
    </AbsoluteFill>
  );
}

// ============================================================
// SCENE 3: DASHBOARD (360 - 660 / 12-22s)
// FIXED: Phone bigger, content fits, real layout
// ============================================================
function Scene3Dashboard() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entryOp = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const exitOp = interpolate(frame, [270, 300], [1, 0], { extrapolateRight: "clamp" });

  // Hero "GRIP" tagline
  const gripOp = interpolate(frame, [10, 30], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ opacity: entryOp * exitOp }}>
      <GradientMesh colors={[C.blue, C.teal, C.purple]} opacity={0.18} bg={C.bg} />

      {/* MASSIVE background "€41" */}
      <BehindText
        text="€41"
        fontSize={620}
        gradient={{ from: C.blue, to: C.purple }}
        opacity={0.18}
        x={-30}
        y={400}
        from={20}
      />
      <BehindText
        text="GRIP"
        fontSize={300}
        color={C.navy}
        opacity={0.05}
        x={400}
        y={1450}
        from={50}
        rotation={-4}
      />

      {/* Top label */}
      <div
        style={{
          position: "absolute",
          top: 100,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: gripOp,
          zIndex: 5,
        }}
      >
        <div
          style={{
            fontSize: 24,
            fontWeight: 700,
            fontFamily: FONT,
            color: C.muted,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
          }}
        >
          Vrij besteedbaar
        </div>
      </div>

      {/* iPhone */}
      <IPhoneMockup
        from={0}
        cam={{
          translateX: [400, 0],
          rotateY: [-15, 0],
          scaleFrom: 0.9,
          scaleTo: 1,
          duration: 60,
        }}
      >
        <div style={{ background: C.bg, width: "100%", height: "100%" }}>
          <AppTopbar />

          <div style={{ padding: "12px 16px 100px", display: "flex", flexDirection: "column", gap: 10 }}>
            {/* Greeting */}
            <SpringIn from={50} fromY={20}>
              <div style={{ fontSize: 22, fontWeight: 700, color: C.navy, fontFamily: FONT, letterSpacing: "-0.02em" }}>
                Hoi, Samba
              </div>
            </SpringIn>

            {/* Financieel inzicht card */}
            <SpringIn from={62} fromY={20}>
              <div
                style={{
                  background: C.surface,
                  borderRadius: 14,
                  border: `1px solid ${C.border}`,
                  padding: "12px 14px",
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: 8,
                }}
              >
                <div>
                  <div style={{ fontSize: 9, color: C.muted, fontFamily: FONT, fontWeight: 500 }}>Inkomen</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: C.green, fontFamily: FONT }}>
                    €4.637
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 9, color: C.muted, fontFamily: FONT, fontWeight: 500 }}>Uitgaven</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: C.red, fontFamily: FONT }}>
                    €4.759
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 9, color: C.muted, fontFamily: FONT, fontWeight: 500 }}>Netto</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: C.red, fontFamily: FONT, display: "flex", alignItems: "center", gap: 2 }}>
                    <LucideIcon d={ICONS.trendingDown} size={11} color={C.red} strokeWidth={2.5} />
                    €123
                  </div>
                </div>
              </div>
            </SpringIn>

            {/* Vrij besteedbaar HERO card */}
            <SpringIn from={75} fromY={30} config={SPRING_BOUNCE}>
              <div
                style={{
                  background: `linear-gradient(135deg, ${C.blueLight} 0%, #FFFFFF 100%)`,
                  borderRadius: 16,
                  border: `1px solid ${C.border}`,
                  padding: "16px 18px",
                  borderTop: `3px solid ${C.blue}`,
                }}
              >
                <div style={{ fontSize: 11, color: C.muted, fontFamily: FONT, fontWeight: 500, marginBottom: 4 }}>
                  Vrij besteedbaar deze maand
                </div>
                <div
                  style={{
                    fontSize: 48,
                    fontWeight: 800,
                    color: C.navy,
                    fontFamily: FONT,
                    letterSpacing: "-0.03em",
                    lineHeight: 1,
                  }}
                >
                  <RollingNumber target={41} from={75} prefix="€" suffix=",00" duration={40} />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 5, marginTop: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontFamily: FONT }}>
                    <span style={{ color: C.muted }}>Inkomen</span>
                    <span style={{ color: C.green, fontWeight: 700 }}>€2.400</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontFamily: FONT }}>
                    <span style={{ color: C.muted }}>Vaste lasten</span>
                    <span style={{ color: C.text, fontWeight: 700 }}>−€1.785</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontFamily: FONT }}>
                    <span style={{ color: C.muted }}>Open rekeningen</span>
                    <span style={{ color: C.red, fontWeight: 700 }}>−€574</span>
                  </div>
                </div>

                <div
                  style={{
                    marginTop: 10,
                    padding: "8px 10px",
                    background: `${C.amber}12`,
                    borderRadius: 8,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <LucideIcon d={ICONS.alertTriangle} size={14} color={C.amber} strokeWidth={2} />
                  <span style={{ fontSize: 11, color: C.amber, fontWeight: 700, fontFamily: FONT }}>
                    1 vaste last in incasso
                  </span>
                </div>
              </div>
            </SpringIn>

            {/* Stat cards */}
            <SpringIn from={100} fromY={20}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <div
                  style={{
                    background: C.surface,
                    borderRadius: 12,
                    border: `1px solid ${C.border}`,
                    padding: "12px 14px",
                    borderTop: `3px solid ${C.blue}`,
                  }}
                >
                  <div style={{ fontSize: 10, color: C.muted, fontFamily: FONT, fontWeight: 500 }}>
                    Openstaand
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: C.blue, fontFamily: FONT, letterSpacing: "-0.02em" }}>
                    €574
                  </div>
                  <div style={{ fontSize: 10, color: C.muted, fontFamily: FONT }}>2 rekeningen</div>
                </div>
                <div
                  style={{
                    background: C.surface,
                    borderRadius: 12,
                    border: `1px solid ${C.border}`,
                    padding: "12px 14px",
                    borderTop: `3px solid ${C.red}`,
                  }}
                >
                  <div style={{ fontSize: 10, color: C.muted, fontFamily: FONT, fontWeight: 500 }}>
                    Achterstallig
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: C.red, fontFamily: FONT, letterSpacing: "-0.02em" }}>
                    2
                  </div>
                  <div style={{ fontSize: 10, color: C.muted, fontFamily: FONT }}>Direct betalen</div>
                </div>
              </div>
            </SpringIn>

            {/* Bills */}
            {[
              { vendor: "Belastingdienst", amount: "€174,00", stage: "Aanmaning", color: C.orange },
              { vendor: "Vattenfall", amount: "€400,00", stage: "Incasso", color: C.red },
            ].map((b, i) => (
              <SpringIn key={i} from={120 + i * 6} fromY={20}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px 12px",
                    background: C.surface,
                    borderRadius: 12,
                    border: `1px solid ${C.border}`,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 8,
                        background: `${b.color}12`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <LucideIcon d={ICONS.fileText} size={18} color={b.color} strokeWidth={1.8} />
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: C.text, fontFamily: FONT }}>
                        {b.vendor}
                      </div>
                      <div style={{ fontSize: 10, fontWeight: 700, color: b.color, fontFamily: FONT, marginTop: 1 }}>
                        {b.stage}
                      </div>
                    </div>
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: C.text, fontFamily: FONT }}>
                    {b.amount}
                  </div>
                </div>
              </SpringIn>
            ))}
          </div>

          <BottomTabBar activeIndex={0} />
        </div>
      </IPhoneMockup>

      <Particles count={12} color={`${C.blue}40`} area={{ x: 0, y: 0, w: 1080, h: 1920 }} />
      <Vignette intensity={0.18} />
      <FilmGrain />
    </AbsoluteFill>
  );
}

// ============================================================
// SCENE 4: BILL DETAIL (660 - 900 / 22-30s)
// ============================================================
function Scene4BillDetail() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entryOp = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const exitOp = interpolate(frame, [210, 240], [1, 0], { extrapolateRight: "clamp" });

  // Letter morphs into phone UI
  const letterOp = interpolate(frame, [40, 70], [1, 0], { extrapolateRight: "clamp" });
  const drawerOp = interpolate(frame, [60, 85], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ opacity: entryOp * exitOp }}>
      <GradientMesh colors={[C.orange, C.red, C.amber]} opacity={0.15} bg={C.bg} />

      <BehindText
        text="€174"
        fontSize={500}
        gradient={{ from: C.orange, to: C.red }}
        opacity={0.18}
        x={-20}
        y={350}
        from={15}
      />
      <BehindText
        text="AANMANING"
        fontSize={140}
        color={C.navy}
        opacity={0.05}
        x={60}
        y={1500}
        from={40}
      />

      {/* Floating letter — flies in then fades into phone */}
      {frame < 75 && (
        <div style={{ opacity: letterOp }}>
          <RealisticLetter
            vendor="Belastingdienst"
            amount="€174,00"
            stage="AANMANING"
            stageColor={C.orange}
            from={0}
            startX={250}
            startY={-200}
            endX={0}
            endY={0}
            startRotation={20}
            endRotation={0}
            showStamp
          />
        </div>
      )}

      {/* Scan line */}
      {frame >= 35 && frame < 70 && (
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: `${30 + ((frame - 35) / 35) * 35}%`,
            transform: "translateX(-50%)",
            width: 380,
            height: 4,
            background: `linear-gradient(90deg, transparent, ${C.blue}, transparent)`,
            boxShadow: `0 0 30px ${C.blue}, 0 0 60px ${C.blue}80`,
            zIndex: 15,
          }}
        />
      )}

      {/* Phone with bill detail */}
      <div style={{ opacity: drawerOp }}>
        <IPhoneMockup
          from={60}
          cam={{
            scaleFrom: 1.15,
            scaleTo: 1,
            duration: 50,
          }}
        >
          <div style={{ background: C.bg, width: "100%", height: "100%" }}>
            {/* Dark navy header */}
            <div
              style={{
                background: C.navy,
                padding: "62px 20px 24px",
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div
                  style={{
                    fontSize: 9,
                    fontWeight: 800,
                    color: C.amber,
                    fontFamily: FONT,
                    padding: "3px 10px",
                    background: `${C.amber}20`,
                    borderRadius: 4,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                  }}
                >
                  PRIORITEIT
                </div>
              </div>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: "rgba(255,255,255,0.7)",
                  fontFamily: FONT,
                }}
              >
                Belastingdienst
              </div>
              <div
                style={{
                  fontSize: 52,
                  fontWeight: 800,
                  color: "#FFFFFF",
                  fontFamily: FONT,
                  letterSpacing: "-0.03em",
                  lineHeight: 1,
                }}
              >
                <RollingNumber target={174} from={60} prefix="€" suffix=",00" duration={40} />
              </div>
              <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: C.orange,
                    background: `${C.orange}20`,
                    padding: "3px 10px",
                    borderRadius: 4,
                    fontFamily: FONT,
                  }}
                >
                  Aanmaning
                </div>
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: C.red,
                    background: `${C.red}20`,
                    padding: "3px 10px",
                    borderRadius: 4,
                    fontFamily: FONT,
                  }}
                >
                  Achterstallig
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div style={{ display: "flex", padding: "0 16px", marginTop: 14 }}>
              {["Details", "Escalatie", "Acties", "Regeling"].map((t, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    textAlign: "center",
                    padding: "10px 0",
                    fontSize: 12,
                    fontWeight: i === 0 ? 700 : 500,
                    color: i === 0 ? C.blue : C.muted,
                    borderBottom: i === 0 ? `2px solid ${C.blue}` : `1px solid ${C.border}`,
                    fontFamily: FONT,
                  }}
                >
                  {t}
                </div>
              ))}
            </div>

            {/* Detail rows */}
            <div style={{ padding: "14px 18px", display: "flex", flexDirection: "column", gap: 4 }}>
              {[
                { label: "Vervaldatum", value: "30 april 2026" },
                { label: "Ontvangstdatum", value: "15 maart 2026" },
                { label: "Categorie", value: "Overheid" },
                { label: "Bron", value: "Camera scan" },
                { label: "Referentie", value: "BEL-2026-0174" },
              ].map((row, i) => (
                <SpringIn key={i} from={90 + i * 6} fromY={15}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "10px 0",
                      borderBottom: `1px solid ${C.border}`,
                    }}
                  >
                    <span style={{ fontSize: 13, color: C.muted, fontFamily: FONT }}>{row.label}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: C.text, fontFamily: FONT }}>
                      {row.value}
                    </span>
                  </div>
                </SpringIn>
              ))}
            </div>
          </div>
        </IPhoneMockup>
      </div>

      <Vignette intensity={0.2} />
      <FilmGrain />
    </AbsoluteFill>
  );
}

// ============================================================
// SCENE 5: PAYBUDDY VOICE CALL (900 - 1410 / 30-47s)
// ============================================================
function Scene5PayBuddy() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entryOp = interpolate(frame, [0, 25], [0, 1], { extrapolateRight: "clamp" });
  const exitOp = interpolate(frame, [480, 510], [1, 0], { extrapolateRight: "clamp" });

  // Camera push into orb
  const pushScale = interpolate(frame, [0, 360], [1, 1.18], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });

  return (
    <AbsoluteFill style={{ opacity: entryOp * exitOp, transform: `scale(${pushScale})` }}>
      <GradientMesh
        colors={[C.teal, C.purple, C.blue]}
        opacity={0.45}
        bg={C.darker}
      />

      {/* Orb — centered hero */}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div style={{ marginTop: -260 }}>
          <PayBuddyOrb size={240} from={0} />
        </div>
      </AbsoluteFill>

      {/* PayBuddy label */}
      <div
        style={{
          position: "absolute",
          top: 380,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
        }}
      >
        <SpringIn from={20} fromY={25}>
          <span
            style={{
              fontSize: 56,
              fontWeight: 800,
              color: "#FFFFFF",
              fontFamily: FONT,
              letterSpacing: "-0.03em",
              filter: `drop-shadow(0 6px 20px ${C.teal}80)`,
            }}
          >
            PayBuddy
          </span>
        </SpringIn>
        <SpringIn from={32} fromY={15}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                background: C.tealBright,
                boxShadow: `0 0 12px ${C.tealBright}`,
              }}
            />
            <span style={{ fontSize: 18, color: C.tealBright, fontWeight: 600, fontFamily: FONT }}>
              Aan het praten
            </span>
          </div>
        </SpringIn>
      </div>

      {/* Conversation bubbles */}
      <div
        style={{
          position: "absolute",
          bottom: 360,
          left: 70,
          right: 70,
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        {/* PayBuddy message */}
        <SpringIn from={80} fromY={30} config={SPRING_BOUNCE}>
          <div
            style={{
              background: "rgba(255,255,255,0.08)",
              backdropFilter: "blur(20px)",
              borderRadius: "24px 24px 24px 6px",
              padding: "16px 22px",
              maxWidth: 380,
              border: "1px solid rgba(255,255,255,0.12)",
            }}
          >
            <WordReveal
              text="Hoi! Waar kan ik je mee helpen?"
              from={92}
              fontSize={22}
              color="rgba(255,255,255,0.92)"
              fontWeight={500}
              staggerSpeed={1.2}
            />
          </div>
        </SpringIn>

        {/* User message */}
        <SpringIn from={170} fromY={30} config={SPRING_BOUNCE}>
          <div
            style={{
              background: C.blue,
              borderRadius: "24px 24px 6px 24px",
              padding: "16px 22px",
              maxWidth: 360,
              alignSelf: "flex-end",
              marginLeft: "auto",
              boxShadow: `0 8px 32px ${C.blue}50`,
            }}
          >
            <WordReveal
              text="Ik heb een brief, kun je meekijken?"
              from={182}
              fontSize={22}
              color="#FFFFFF"
              fontWeight={500}
              staggerSpeed={1.2}
            />
          </div>
        </SpringIn>

        {/* PayBuddy response */}
        <SpringIn from={270} fromY={30} config={SPRING_BOUNCE}>
          <div
            style={{
              background: "rgba(255,255,255,0.08)",
              backdropFilter: "blur(20px)",
              borderRadius: "24px 24px 24px 6px",
              padding: "16px 22px",
              maxWidth: 380,
              border: "1px solid rgba(255,255,255,0.12)",
            }}
          >
            <WordReveal
              text="Maak een foto van de rekening."
              from={282}
              fontSize={22}
              color="rgba(255,255,255,0.92)"
              fontWeight={500}
              staggerSpeed={1.2}
            />
          </div>
        </SpringIn>

        {/* Camera badge */}
        <SpringIn from={350} fromY={20} config={SPRING_BOUNCE}>
          <div
            style={{
              display: "flex",
              gap: 10,
              justifyContent: "center",
              marginTop: 4,
            }}
          >
            <div
              style={{
                padding: "12px 24px",
                background: C.blue,
                borderRadius: 12,
                display: "flex",
                alignItems: "center",
                gap: 10,
                boxShadow: `0 8px 32px ${C.blue}60`,
              }}
            >
              <LucideIcon d={ICONS.camera} size={20} color="#FFF" strokeWidth={2} />
              <span style={{ fontSize: 16, fontWeight: 700, color: "#FFF", fontFamily: FONT }}>
                Camera
              </span>
            </div>
          </div>
        </SpringIn>

        {/* Result */}
        <SpringIn from={420} fromY={30} config={SPRING_BOUNCE}>
          <div
            style={{
              background: `${C.green}25`,
              backdropFilter: "blur(20px)",
              borderRadius: 16,
              padding: "16px 20px",
              border: `1px solid ${C.green}40`,
              display: "flex",
              alignItems: "center",
              gap: 14,
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                background: C.green,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: `0 0 20px ${C.green}80`,
              }}
            >
              <LucideIcon d={ICONS.check} size={22} color="#FFF" strokeWidth={3} />
            </div>
            <div>
              <div style={{ fontSize: 17, fontWeight: 800, color: "#FFF", fontFamily: FONT }}>
                Toegevoegd!
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: "rgba(255,255,255,0.7)",
                  fontFamily: FONT,
                  marginTop: 2,
                }}
              >
                Ziggo · €89,95
              </div>
            </div>
          </div>
        </SpringIn>
      </div>

      {/* Call controls */}
      <SpringIn from={50} fromY={20}>
        <div
          style={{
            position: "absolute",
            bottom: 130,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
            gap: 50,
          }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 36,
              background: "rgba(255,255,255,0.1)",
              backdropFilter: "blur(10px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <LucideIcon d={ICONS.mic} size={28} color="rgba(255,255,255,0.85)" strokeWidth={1.8} />
          </div>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 36,
              background: C.red,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: `0 12px 40px ${C.red}80`,
            }}
          >
            <LucideIcon d={ICONS.phoneOff} size={28} color="#FFF" strokeWidth={2} />
          </div>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 36,
              background: "rgba(255,255,255,0.1)",
              backdropFilter: "blur(10px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <LucideIcon d={ICONS.camera} size={28} color="rgba(255,255,255,0.85)" strokeWidth={1.8} />
          </div>
        </div>
      </SpringIn>

      <Particles count={20} color={`${C.teal}60`} area={{ x: 50, y: 50, w: 980, h: 1820 }} />
      <Vignette intensity={0.55} />
      <FilmGrain />
    </AbsoluteFill>
  );
}

// ============================================================
// SCENE 6: WIK SHIELD (1410 - 1650 / 47-55s)
// ============================================================
function Scene6WIKShield() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entryOp = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const exitOp = interpolate(frame, [210, 240], [1, 0], { extrapolateRight: "clamp" });

  // Shield slam
  const shieldS = spring({ frame: frame - 25, fps, config: SPRING_ELASTIC, durationInFrames: 30 });
  const shieldScale = interpolate(shieldS, [0, 1], [3.5, 1]);
  const shieldOp = interpolate(shieldS, [0, 0.2], [0, 1], { extrapolateRight: "clamp" });

  // Impact shake
  const shakeX =
    frame >= 25 && frame < 42 ? Math.sin(frame * 5) * (42 - frame) * 0.6 : 0;
  const shakeY =
    frame >= 25 && frame < 42 ? Math.cos(frame * 6) * (42 - frame) * 0.4 : 0;

  return (
    <AbsoluteFill
      style={{
        opacity: entryOp * exitOp,
        transform: `translate(${shakeX}px, ${shakeY}px)`,
      }}
    >
      <GradientMesh colors={[C.purple, C.blue, C.green]} opacity={0.22} bg={C.bg} />

      <BehindText
        text="TE HOOG"
        fontSize={300}
        color={C.red}
        opacity={0.07}
        x={-30}
        y={250}
        from={40}
        rotation={-4}
      />
      <BehindText
        text="WIK"
        fontSize={500}
        color={C.purple}
        opacity={0.08}
        x={300}
        y={1300}
        from={60}
      />

      {/* Top label */}
      <div
        style={{
          position: "absolute",
          top: 150,
          left: 0,
          right: 0,
          textAlign: "center",
          zIndex: 5,
        }}
      >
        <SpringIn from={70} fromY={20}>
          <div
            style={{
              fontSize: 22,
              fontWeight: 700,
              fontFamily: FONT,
              color: C.muted,
              letterSpacing: "0.25em",
              textTransform: "uppercase",
            }}
          >
            WIK Shield
          </div>
        </SpringIn>
      </div>

      {/* Shield */}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", marginTop: -200 }}>
        <div
          style={{
            transform: `scale(${shieldScale})`,
            opacity: shieldOp,
            filter: `drop-shadow(0 25px 80px ${C.purple}50)`,
          }}
        >
          <LucideIcon d={ICONS.shieldCheck} size={220} color={C.purple} strokeWidth={1.4} />
        </div>
      </AbsoluteFill>

      {/* Cost comparison stack */}
      <div
        style={{
          position: "absolute",
          bottom: 280,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 20,
        }}
      >
        {/* Overcharged */}
        <SpringIn from={60} fromY={20}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <span
              style={{
                fontSize: 18,
                color: C.muted,
                fontFamily: FONT,
                fontWeight: 500,
                letterSpacing: "0.05em",
              }}
            >
              Berekend door incassobureau
            </span>
            <span
              style={{
                fontSize: 96,
                fontWeight: 900,
                color: C.red,
                fontFamily: FONT,
                textDecoration: "line-through",
                textDecorationColor: C.red,
                textDecorationThickness: 5,
                letterSpacing: "-0.03em",
                lineHeight: 1,
              }}
            >
              €145
            </span>
          </div>
        </SpringIn>

        {/* Arrow down */}
        <SpringIn from={95}>
          <LucideIcon d={ICONS.arrowDown} size={48} color={C.purple} strokeWidth={3} />
        </SpringIn>

        {/* Legal max */}
        <SpringIn from={115} fromY={25} config={SPRING_BOUNCE}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <span
              style={{
                fontSize: 18,
                color: C.muted,
                fontFamily: FONT,
                fontWeight: 500,
                letterSpacing: "0.05em",
              }}
            >
              Wettelijk maximum
            </span>
            <span
              style={{
                fontSize: 144,
                fontWeight: 900,
                fontFamily: FONT,
                letterSpacing: "-0.04em",
                lineHeight: 1,
                background: `linear-gradient(135deg, ${C.green} 0%, ${C.tealBright} 100%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                filter: `drop-shadow(0 15px 40px ${C.green}50)`,
              }}
            >
              €40
            </span>
          </div>
        </SpringIn>

        {/* Saved badge */}
        <SpringIn from={155} fromY={20} config={SPRING_BOUNCE}>
          <div
            style={{
              background: `${C.green}15`,
              borderRadius: 14,
              padding: "12px 26px",
              display: "flex",
              alignItems: "center",
              gap: 10,
              border: `1px solid ${C.green}40`,
            }}
          >
            <LucideIcon d={ICONS.shieldCheck} size={22} color={C.green} strokeWidth={2.2} />
            <span style={{ fontSize: 22, fontWeight: 800, color: C.green, fontFamily: FONT }}>
              €105 bespaard
            </span>
          </div>
        </SpringIn>
      </div>

      <Particles count={12} color={`${C.purple}60`} area={{ x: 100, y: 200, w: 880, h: 1500 }} />
      <Vignette intensity={0.25} />
      <FilmGrain />
    </AbsoluteFill>
  );
}

// ============================================================
// SCENE 7: TOESLAGEN (1650 - 1890 / 55-63s)
// ============================================================
function Scene7Toeslagen() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entryOp = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const exitOp = interpolate(frame, [210, 240], [1, 0], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ opacity: entryOp * exitOp }}>
      <GradientMesh colors={[C.green, C.tealBright, C.blue]} opacity={0.28} bg={C.bg} />

      <BehindText
        text="TOESLAGEN"
        fontSize={180}
        color={C.green}
        opacity={0.06}
        x={-20}
        y={1500}
        from={40}
      />

      {/* Top label */}
      <div
        style={{
          position: "absolute",
          top: 240,
          left: 0,
          right: 0,
          textAlign: "center",
          zIndex: 5,
        }}
      >
        <SpringIn from={15} fromY={20}>
          <div
            style={{
              fontSize: 24,
              fontWeight: 700,
              fontFamily: FONT,
              color: C.muted,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
            }}
          >
            Gevonden voor jou
          </div>
        </SpringIn>
      </div>

      {/* MASSIVE +€705 */}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", marginTop: -260 }}>
        <SpringIn from={25} fromY={50} fromScale={0.4} config={SPRING_ELASTIC}>
          <div
            style={{
              fontSize: 360,
              fontWeight: 900,
              fontFamily: FONT,
              letterSpacing: "-0.06em",
              lineHeight: 0.9,
              background: `linear-gradient(135deg, ${C.green} 0%, ${C.tealBright} 50%, ${C.blue} 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              filter: `drop-shadow(0 30px 80px ${C.green}40)`,
              textAlign: "center",
            }}
          >
            +€705
          </div>
        </SpringIn>
      </AbsoluteFill>

      {/* "per maand" subtitle */}
      <div
        style={{
          position: "absolute",
          top: 1080,
          left: 0,
          right: 0,
          textAlign: "center",
        }}
      >
        <SpringIn from={50} fromY={20}>
          <div
            style={{
              fontSize: 56,
              fontWeight: 700,
              fontFamily: FONT,
              color: C.navy,
              letterSpacing: "-0.02em",
            }}
          >
            per maand
          </div>
        </SpringIn>
      </div>

      {/* Benefit cards */}
      <div
        style={{
          position: "absolute",
          bottom: 260,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 14,
        }}
      >
        {[
          { name: "Huurtoeslag", amount: "+€484", color: C.green, icon: ICONS.euro },
          { name: "Zorgtoeslag", amount: "+€221", color: C.teal, icon: ICONS.shield },
          { name: "Kinderopvangtoeslag", amount: "+€500", color: C.blue, icon: ICONS.users },
        ].map((b, i) => (
          <SpringIn key={i} from={75 + i * 12} fromY={40} fromScale={0.85} config={SPRING_BOUNCE}>
            <div
              style={{
                background: "rgba(255,255,255,0.95)",
                backdropFilter: "blur(8px)",
                borderRadius: 18,
                padding: "16px 28px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: 540,
                border: `1px solid ${C.border}`,
                boxShadow: `0 16px 50px rgba(0,0,0,0.08)`,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: `${b.color}15`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <LucideIcon d={b.icon} size={22} color={b.color} strokeWidth={2} />
                </div>
                <span style={{ fontSize: 20, fontWeight: 700, color: C.navy, fontFamily: FONT, letterSpacing: "-0.01em" }}>
                  {b.name}
                </span>
              </div>
              <span
                style={{
                  fontSize: 26,
                  fontWeight: 800,
                  color: b.color,
                  fontFamily: FONT,
                  letterSpacing: "-0.02em",
                }}
              >
                {b.amount}
              </span>
            </div>
          </SpringIn>
        ))}
      </div>

      <Particles count={20} color={`${C.green}60`} area={{ x: 50, y: 100, w: 980, h: 1700 }} />
      <Vignette intensity={0.22} />
      <FilmGrain />
    </AbsoluteFill>
  );
}

// ============================================================
// SCENE 8: STATS (1890 - 2130 / 63-71s)
// ============================================================
function Scene8Stats() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entryOp = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const exitOp = interpolate(frame, [210, 240], [1, 0], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ opacity: entryOp * exitOp }}>
      <GradientMesh colors={[C.amber, C.red, C.purple]} opacity={0.18} bg={C.bg} />

      <BehindText
        text="€688"
        fontSize={580}
        gradient={{ from: C.green, to: C.tealBright }}
        opacity={0.18}
        x={-50}
        y={400}
        from={20}
      />
      <BehindText
        text="BESPAARD"
        fontSize={150}
        color={C.green}
        opacity={0.06}
        x={120}
        y={1500}
        from={50}
      />

      <IPhoneMockup
        from={0}
        cam={{
          scaleFrom: 0.95,
          scaleTo: 1.05,
          duration: 200,
        }}
      >
        <div style={{ background: C.bg, width: "100%", height: "100%" }}>
          <AppTopbar />

          <div
            style={{
              padding: "16px 16px 100px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 14,
            }}
          >
            <SpringIn from={20} fromY={20}>
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: C.navy,
                  fontFamily: FONT,
                  letterSpacing: "-0.02em",
                }}
              >
                Financiële gezondheid
              </div>
            </SpringIn>

            <SpringIn from={32} fromScale={0.8}>
              <HealthGauge score={38} size={170} from={32} color={C.red} />
            </SpringIn>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, width: "100%" }}>
              {[
                { label: "Op tijd", value: "50%", sub: "12/24", color: C.blue },
                { label: "Streak", value: "0", sub: "dagen", color: C.amber },
                { label: "Bespaard", value: "€688", sub: "incasso", color: C.green },
                { label: "Achterstallig", value: "2", sub: "Direct", color: C.red },
              ].map((s, i) => (
                <SpringIn key={i} from={70 + i * 6} fromY={20}>
                  <div
                    style={{
                      background: C.surface,
                      borderRadius: 12,
                      border: `1px solid ${C.border}`,
                      padding: "12px 14px",
                      borderTop: `3px solid ${s.color}`,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 11,
                        color: C.muted,
                        fontFamily: FONT,
                        fontWeight: 500,
                      }}
                    >
                      {s.label}
                    </div>
                    <div
                      style={{
                        fontSize: 26,
                        fontWeight: 800,
                        color: s.color,
                        fontFamily: FONT,
                        letterSpacing: "-0.02em",
                      }}
                    >
                      {s.value}
                    </div>
                    <div style={{ fontSize: 10, color: C.muted, fontFamily: FONT, marginTop: 1 }}>
                      {s.sub}
                    </div>
                  </div>
                </SpringIn>
              ))}
            </div>

            {/* Bottom: total saved highlight */}
            <SpringIn from={120} fromY={25} config={SPRING_BOUNCE}>
              <div
                style={{
                  background: `linear-gradient(135deg, ${C.green}15 0%, ${C.tealBright}10 100%)`,
                  borderRadius: 14,
                  border: `1px solid ${C.green}40`,
                  padding: "14px 18px",
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <LucideIcon d={ICONS.shieldCheck} size={22} color={C.green} strokeWidth={2} />
                <div>
                  <div
                    style={{
                      fontSize: 11,
                      color: C.muted,
                      fontFamily: FONT,
                      fontWeight: 500,
                    }}
                  >
                    Totaal bespaard dit jaar
                  </div>
                  <div
                    style={{
                      fontSize: 22,
                      fontWeight: 800,
                      color: C.green,
                      fontFamily: FONT,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    <RollingNumber target={688.95} from={120} prefix="€" decimals={2} duration={45} />
                  </div>
                </div>
              </div>
            </SpringIn>
          </div>

          <BottomTabBar activeIndex={3} />
        </div>
      </IPhoneMockup>

      <Vignette intensity={0.2} />
      <FilmGrain />
    </AbsoluteFill>
  );
}

// ============================================================
// SCENE 9: CLOSING (2130 - 2700 / 71-90s)
// ============================================================
function Scene9Closing() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phone pulls back
  const phoneScale = interpolate(frame, [0, 80], [1, 0.45], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  const phoneOp = interpolate(frame, [0, 30, 100, 130], [1, 1, 1, 0], {
    extrapolateRight: "clamp",
  });

  // Logo reveal
  const logoFrom = 130;
  const logoS = spring({
    frame: frame - logoFrom,
    fps,
    config: SPRING_ELASTIC,
    durationInFrames: 35,
  });
  const logoScale = interpolate(logoS, [0, 1], [0, 1]);
  const logoOp = interpolate(logoS, [0, 0.3], [0, 1], { extrapolateRight: "clamp" });

  // CTA
  const ctaFrom = 280;
  const ctaS = spring({
    frame: frame - ctaFrom,
    fps,
    config: SPRING_BOUNCE,
    durationInFrames: 30,
  });
  const ctaScale = interpolate(ctaS, [0, 1], [0.8, 1]);
  const ctaOp = interpolate(ctaS, [0, 0.3], [0, 1], { extrapolateRight: "clamp" });

  // CTA pulse
  const ctaPulse = frame >= ctaFrom + 50 ? 1 + Math.sin((frame - ctaFrom - 50) * 0.1) * 0.04 : 1;

  return (
    <AbsoluteFill>
      <GradientMesh
        colors={[C.blue, C.purple, C.teal]}
        opacity={0.4}
        bg={C.darker}
      />

      <BehindText
        text="GRIP"
        fontSize={400}
        color="rgba(255,255,255,0.04)"
        x={-30}
        y={300}
        from={140}
      />
      <BehindText
        text="CONTROLE"
        fontSize={220}
        color="rgba(255,255,255,0.03)"
        x={120}
        y={1300}
        from={170}
        rotation={-3}
      />

      {/* Phone pulling back */}
      <div style={{ opacity: phoneOp }}>
        <IPhoneMockup
          from={0}
          cam={{
            scaleFrom: 1,
            scaleTo: 0.5,
            duration: 80,
          }}
        >
          <div style={{ background: C.bg, width: "100%", height: "100%" }}>
            <AppTopbar />
            <div style={{ padding: "12px 16px" }}>
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  color: C.navy,
                  fontFamily: FONT,
                  letterSpacing: "-0.02em",
                }}
              >
                Hoi, Samba
              </div>
              <div
                style={{
                  background: `linear-gradient(135deg, ${C.blueLight} 0%, #FFFFFF 100%)`,
                  borderRadius: 16,
                  border: `1px solid ${C.border}`,
                  padding: "16px 18px",
                  marginTop: 10,
                  borderTop: `3px solid ${C.blue}`,
                }}
              >
                <div style={{ fontSize: 11, color: C.muted, fontFamily: FONT, fontWeight: 500 }}>
                  Vrij besteedbaar deze maand
                </div>
                <div
                  style={{
                    fontSize: 48,
                    fontWeight: 800,
                    color: C.navy,
                    fontFamily: FONT,
                    letterSpacing: "-0.03em",
                  }}
                >
                  €41,00
                </div>
              </div>
            </div>
            <BottomTabBar activeIndex={0} />
          </div>
        </IPhoneMockup>
      </div>

      {/* Logo */}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div
          style={{
            transform: `scale(${logoScale})`,
            opacity: logoOp,
            filter: `drop-shadow(0 30px 80px ${C.blue}50)`,
          }}
        >
          <Img
            src={staticFile("/logo-dark.svg")}
            style={{ width: 600, height: "auto", display: "block" }}
          />
        </div>
      </AbsoluteFill>

      {/* Taglines */}
      <div
        style={{
          position: "absolute",
          bottom: 480,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 12,
        }}
      >
        <Sequence from={200}>
          <WordReveal
            text="Grip op je rekeningen"
            from={0}
            fontSize={48}
            color="rgba(255,255,255,0.95)"
            fontWeight={700}
            staggerSpeed={1.5}
          />
        </Sequence>
        <Sequence from={240}>
          <WordReveal
            text="Beschermd tegen te hoge kosten"
            from={0}
            fontSize={32}
            color="rgba(255,255,255,0.55)"
            fontWeight={500}
            staggerSpeed={1.2}
          />
        </Sequence>
      </div>

      {/* CTA Button */}
      <div
        style={{
          position: "absolute",
          bottom: 320,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            padding: "20px 56px",
            background: `linear-gradient(135deg, ${C.blue} 0%, ${C.purple} 100%)`,
            borderRadius: 16,
            transform: `scale(${ctaScale * ctaPulse})`,
            opacity: ctaOp,
            boxShadow: `0 20px 60px ${C.blue}70, inset 0 2px 0 rgba(255,255,255,0.25)`,
          }}
        >
          <span
            style={{
              fontSize: 26,
              fontWeight: 800,
              color: "#FFFFFF",
              fontFamily: FONT,
              letterSpacing: "-0.02em",
            }}
          >
            Download nu gratis
          </span>
        </div>
      </div>

      {/* URL */}
      <Sequence from={340}>
        <SpringIn from={0} fromY={15}>
          <div
            style={{
              position: "absolute",
              bottom: 240,
              left: 0,
              right: 0,
              textAlign: "center",
            }}
          >
            <span
              style={{
                fontSize: 22,
                fontWeight: 600,
                color: "rgba(255,255,255,0.45)",
                fontFamily: FONT,
                letterSpacing: "0.1em",
              }}
            >
              paywatch.app
            </span>
          </div>
        </SpringIn>
      </Sequence>

      {/* Investor pitch badge */}
      <Sequence from={400}>
        <SpringIn from={0} fromY={15}>
          <div
            style={{
              position: "absolute",
              bottom: 130,
              left: 0,
              right: 0,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                padding: "12px 24px",
                background: "rgba(255,255,255,0.06)",
                backdropFilter: "blur(10px)",
                borderRadius: 14,
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <span
                style={{
                  fontSize: 16,
                  color: "rgba(255,255,255,0.5)",
                  fontFamily: FONT,
                  fontWeight: 600,
                }}
              >
                28 mei 2026 · Hogeschool Rotterdam
              </span>
            </div>
          </div>
        </SpringIn>
      </Sequence>

      <Particles
        count={25}
        color="rgba(255,255,255,0.2)"
        area={{ x: 0, y: 0, w: 1080, h: 1920 }}
      />
      <Vignette intensity={0.55} />
      <FilmGrain />
    </AbsoluteFill>
  );
}

// ============================================================
// MAIN COMPOSITION
// 90s @ 30fps = 2700 frames
// ============================================================
export const PayWatchDemo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg, fontFamily: FONT }}>
      <Sequence from={0} durationInFrames={120}>
        <Scene1Logo />
      </Sequence>

      <Sequence from={120} durationInFrames={240}>
        <Scene2Problem />
      </Sequence>

      <Sequence from={360} durationInFrames={300}>
        <Scene3Dashboard />
      </Sequence>

      <Sequence from={660} durationInFrames={240}>
        <Scene4BillDetail />
      </Sequence>

      <Sequence from={900} durationInFrames={510}>
        <Scene5PayBuddy />
      </Sequence>

      <Sequence from={1410} durationInFrames={240}>
        <Scene6WIKShield />
      </Sequence>

      <Sequence from={1650} durationInFrames={240}>
        <Scene7Toeslagen />
      </Sequence>

      <Sequence from={1890} durationInFrames={240}>
        <Scene8Stats />
      </Sequence>

      <Sequence from={2130} durationInFrames={570}>
        <Scene9Closing />
      </Sequence>
    </AbsoluteFill>
  );
};
