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

const { fontFamily } = loadFont();

// ============================================================
// DESIGN TOKENS
// ============================================================
const C = {
  bg: "#F4F7FB",
  surface: "#FFFFFF",
  navy: "#0A2540",
  blue: "#2563EB",
  blueLight: "#EFF6FF",
  text: "#0F172A",
  muted: "#64748B",
  border: "#E2E8F0",
  green: "#059669",
  amber: "#D97706",
  orange: "#EA580C",
  red: "#DC2626",
  darkRed: "#991B1B",
  purple: "#7C3AED",
  dark: "#0A1628",
  darkSurface: "#1E293B",
  teal: "#14B8A6",
};

const FONT = fontFamily;

// ============================================================
// LUCIDE ICON SVG PATHS (outline, 24x24, stroke 1.5-2)
// ============================================================
function LucideIcon({
  d,
  size = 24,
  color = C.navy,
  strokeWidth = 1.5,
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

// Lucide icon paths
const ICONS = {
  alertTriangle: [
    "M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z",
    "M12 9v4",
    "M12 17h.01",
  ],
  shield: [
    "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  ],
  shieldCheck: [
    "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
    "M9 12l2 2 4-4",
  ],
  creditCard: [
    "M21 4H3a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z",
    "M1 10h22",
  ],
  trendingUp: [
    "M23 6l-9.5 9.5-5-5L1 18",
    "M17 6h6v6",
  ],
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
  mail: [
    "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z",
    "M22 6l-10 7L2 6",
  ],
  fileText: [
    "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z",
    "M14 2v6h6",
    "M16 13H8",
    "M16 17H8",
    "M10 9H8",
  ],
  zap: ["M13 2L3 14h9l-1 8 10-12h-9l1-8z"],
  flame: [
    "M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z",
  ],
  users: [
    "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2",
    "M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
    "M23 21v-2a4 4 0 0 0-3-3.87",
    "M16 3.13a4 4 0 0 1 0 7.75",
  ],
  arrowRight: ["M5 12h14", "M12 5l7 7-7 7"],
  download: ["M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", "M7 10l5 5 5-5", "M12 15V3"],
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
  home: [
    "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
    "M9 22V12h6v10",
  ],
  scan: [
    "M4 7V4h3",
    "M20 7V4h-3",
    "M4 17v3h3",
    "M20 17v3h-3",
  ],
};

// ============================================================
// UTILITY: SPRING CONFIGS
// ============================================================
const SPRING_APPLE = { stiffness: 150, damping: 15, mass: 0.8 };
const SPRING_BOUNCY = { stiffness: 200, damping: 12, mass: 0.6 };
const SPRING_GENTLE = { stiffness: 80, damping: 20, mass: 1.0 };
const SPRING_ELASTIC = { stiffness: 300, damping: 10, mass: 0.5 };

// ============================================================
// UTILITY: ROLLING NUMBER COUNTER
// ============================================================
function RollingNumber({
  target,
  from = 0,
  decimals = 0,
  prefix = "",
  suffix = "",
  duration = 60,
  style = {},
}: {
  target: number;
  from?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  style?: React.CSSProperties;
}) {
  const frame = useCurrentFrame() - from;
  const { fps } = useVideoConfig();
  if (frame < 0) return null;
  const progress = Math.min(frame / duration, 1);
  const eased = Easing.bezier(0.34, 1.56, 0.64, 1)(progress);
  const value = target * Math.min(eased, 1);
  const formatted = value.toFixed(decimals).replace(".", ",");
  return (
    <span style={{ fontFamily: FONT, fontVariantNumeric: "tabular-nums", ...style }}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}

// ============================================================
// UTILITY: SPRING-IN WRAPPER
// ============================================================
function SpringIn({
  children,
  from,
  delay = 0,
  config = SPRING_APPLE,
  style = {},
}: {
  children: React.ReactNode;
  from: number;
  delay?: number;
  config?: { stiffness: number; damping: number; mass: number };
  style?: React.CSSProperties;
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({
    frame: frame - from - delay,
    fps,
    config,
    durationInFrames: 40,
  });
  return (
    <div
      style={{
        transform: `scale(${interpolate(s, [0, 1], [0.6, 1])})`,
        opacity: interpolate(s, [0, 0.3], [0, 1], {
          extrapolateRight: "clamp",
        }),
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ============================================================
// COMPONENT: ANIMATED GRADIENT MESH BACKGROUND
// ============================================================
function GradientMesh({
  color1 = "#2563EB",
  color2 = "#7C3AED",
  color3 = "#14B8A6",
  opacity = 0.15,
  dark = false,
}: {
  color1?: string;
  color2?: string;
  color3?: string;
  opacity?: number;
  dark?: boolean;
}) {
  const frame = useCurrentFrame();
  const bg = dark ? C.dark : C.bg;
  const x1 = 30 + Math.sin(frame * 0.008) * 20;
  const y1 = 30 + Math.cos(frame * 0.006) * 20;
  const x2 = 70 + Math.sin(frame * 0.01 + 2) * 15;
  const y2 = 60 + Math.cos(frame * 0.007 + 1) * 20;
  const x3 = 50 + Math.sin(frame * 0.012 + 4) * 25;
  const y3 = 80 + Math.cos(frame * 0.009 + 3) * 15;
  return (
    <AbsoluteFill style={{ backgroundColor: bg }}>
      <div
        style={{
          position: "absolute",
          width: 800,
          height: 800,
          borderRadius: "50%",
          background: color1,
          filter: "blur(180px)",
          opacity,
          left: `${x1}%`,
          top: `${y1}%`,
          transform: "translate(-50%, -50%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: color2,
          filter: "blur(160px)",
          opacity: opacity * 0.8,
          left: `${x2}%`,
          top: `${y2}%`,
          transform: "translate(-50%, -50%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: color3,
          filter: "blur(140px)",
          opacity: opacity * 0.6,
          left: `${x3}%`,
          top: `${y3}%`,
          transform: "translate(-50%, -50%)",
        }}
      />
    </AbsoluteFill>
  );
}

// ============================================================
// COMPONENT: VIGNETTE OVERLAY
// ============================================================
function Vignette({ intensity = 0.4 }: { intensity?: number }) {
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 50% 50%, transparent 40%, rgba(0,0,0,${intensity}) 100%)`,
        pointerEvents: "none",
        zIndex: 999,
      }}
    />
  );
}

// ============================================================
// COMPONENT: FLOATING PARTICLES
// ============================================================
function Particles({
  count = 20,
  color = C.blue,
  area = { x: 0, y: 0, w: 1080, h: 1920 },
}: {
  count?: number;
  color?: string;
  area?: { x: number; y: number; w: number; h: number };
}) {
  const frame = useCurrentFrame();
  const particles = React.useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        x: Math.random() * area.w + area.x,
        y: Math.random() * area.h + area.y,
        size: 3 + Math.random() * 5,
        speed: 0.5 + Math.random() * 1.5,
        phase: Math.random() * Math.PI * 2,
      })),
    [count, area.w, area.h, area.x, area.y]
  );

  return (
    <>
      {particles.map((p, i) => {
        const cycle = (frame * p.speed + p.phase * 60) % 180;
        const op = interpolate(cycle, [0, 60, 120, 180], [0, 0.7, 0.7, 0]);
        const scale = interpolate(cycle, [0, 60, 120, 180], [0, 1, 1, 0]);
        const yOff = Math.sin((frame * 0.02 + p.phase) * p.speed) * 30;
        const xOff = Math.cos((frame * 0.015 + p.phase) * p.speed) * 20;
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
              filter: `blur(${p.size > 5 ? 1 : 0}px)`,
              boxShadow: `0 0 ${p.size * 2}px ${color}40`,
            }}
          />
        );
      })}
    </>
  );
}

// ============================================================
// COMPONENT: GIANT BACKGROUND TEXT
// ============================================================
function BackgroundText({
  text,
  fontSize = 280,
  color = C.border,
  opacity = 0.3,
  x = 0,
  y = 0,
  rotation = 0,
  from = 0,
}: {
  text: string;
  fontSize?: number;
  color?: string;
  opacity?: number;
  x?: number;
  y?: number;
  rotation?: number;
  from?: number;
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - from, fps, config: SPRING_GENTLE, durationInFrames: 60 });
  const textOp = interpolate(s, [0, 1], [0, opacity]);
  const textScale = interpolate(s, [0, 1], [0.85, 1]);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        fontSize,
        fontWeight: 800,
        fontFamily: FONT,
        color,
        opacity: textOp,
        transform: `scale(${textScale}) rotate(${rotation}deg)`,
        letterSpacing: "-0.04em",
        lineHeight: 0.85,
        whiteSpace: "nowrap",
        pointerEvents: "none",
        zIndex: 0,
      }}
    >
      {text}
    </div>
  );
}

// ============================================================
// COMPONENT: LETTER-BY-LETTER REVEAL
// ============================================================
function LetterReveal({
  text,
  from,
  fontSize = 48,
  color = C.navy,
  fontWeight = 700,
  center = true,
  style = {},
}: {
  text: string;
  from: number;
  fontSize?: number;
  color?: string;
  fontWeight?: number;
  center?: boolean;
  style?: React.CSSProperties;
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const chars = text.split("");
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: center ? "center" : "flex-start",
        fontFamily: FONT,
        fontSize,
        fontWeight,
        color,
        gap: 0,
        ...style,
      }}
    >
      {chars.map((ch, i) => {
        const s = spring({
          frame: frame - from - i * 2,
          fps,
          config: SPRING_BOUNCY,
          durationInFrames: 25,
        });
        const y = interpolate(s, [0, 1], [40, 0]);
        const op = interpolate(s, [0, 0.4], [0, 1], {
          extrapolateRight: "clamp",
        });
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
// COMPONENT: IPHONE 15 PRO MOCKUP WITH 3D MOTION
// ============================================================
function IPhoneMockup({
  children,
  from = 0,
  sceneCamera = {},
  showStatusBar = true,
}: {
  children: React.ReactNode;
  from?: number;
  sceneCamera?: {
    scaleFrom?: number;
    scaleTo?: number;
    rotateYFrom?: number;
    rotateYTo?: number;
    rotateXFrom?: number;
    rotateXTo?: number;
    translateXFrom?: number;
    translateXTo?: number;
    translateYFrom?: number;
    translateYTo?: number;
    duration?: number;
  };
  showStatusBar?: boolean;
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localFrame = frame - from;

  // Gentle floating — always active
  const floatY = Math.sin(frame * 0.012) * 8;
  const floatRotY = Math.sin(frame * 0.008) * 2;
  const floatRotX = Math.cos(frame * 0.01) * 1;

  // Scene-specific camera
  const dur = sceneCamera.duration || 120;
  const camProgress = Math.min(Math.max(localFrame / dur, 0), 1);
  const eased = Easing.bezier(0.4, 0, 0.2, 1)(camProgress);
  const scale = interpolate(
    eased,
    [0, 1],
    [sceneCamera.scaleFrom ?? 1, sceneCamera.scaleTo ?? 1]
  );
  const rotY =
    interpolate(eased, [0, 1], [sceneCamera.rotateYFrom ?? 0, sceneCamera.rotateYTo ?? 0]) +
    floatRotY;
  const rotX =
    interpolate(eased, [0, 1], [sceneCamera.rotateXFrom ?? 0, sceneCamera.rotateXTo ?? 0]) +
    floatRotX;
  const transX = interpolate(
    eased,
    [0, 1],
    [sceneCamera.translateXFrom ?? 0, sceneCamera.translateXTo ?? 0]
  );
  const transY =
    interpolate(eased, [0, 1], [sceneCamera.translateYFrom ?? 0, sceneCamera.translateYTo ?? 0]) +
    floatY;

  const PHONE_W = 375;
  const PHONE_H = 812;
  const SCALE = 1.15; // fill more of the vertical frame

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: `
          translate(-50%, -50%)
          perspective(1200px)
          translateX(${transX}px)
          translateY(${transY}px)
          rotateY(${rotY}deg)
          rotateX(${rotX}deg)
          scale(${scale * SCALE})
        `,
        transformStyle: "preserve-3d",
        zIndex: 10,
      }}
    >
      {/* Phone frame */}
      <div
        style={{
          width: PHONE_W,
          height: PHONE_H,
          borderRadius: 52,
          background: "#000",
          boxShadow:
            "0 50px 100px -20px rgba(0,0,0,0.4), 0 0 0 10px #1a1a2e, 0 0 0 12px #2d2d44, inset 0 0 0 2px #333",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Dynamic Island */}
        <div
          style={{
            position: "absolute",
            top: 10,
            left: "50%",
            transform: "translateX(-50%)",
            width: 126,
            height: 36,
            background: "#000",
            borderRadius: 20,
            zIndex: 60,
          }}
        />

        {/* Status bar */}
        {showStatusBar && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 54,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 28px",
              zIndex: 50,
              color: C.text,
              fontSize: 14,
              fontWeight: 600,
              fontFamily: FONT,
            }}
          >
            <span>09:41</span>
            <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
              <svg width="16" height="12" viewBox="0 0 16 12">
                <path
                  d="M1 8h2v4H1zM5 5h2v7H5zM9 2h2v10H9zM13 0h2v12h-2z"
                  fill={C.text}
                  opacity="0.8"
                />
              </svg>
              <svg width="24" height="12" viewBox="0 0 24 12">
                <rect
                  x="0"
                  y="1"
                  width="20"
                  height="10"
                  rx="2"
                  stroke={C.text}
                  strokeWidth="1"
                  fill="none"
                  opacity="0.6"
                />
                <rect
                  x="21"
                  y="4"
                  width="2"
                  height="4"
                  rx="0.5"
                  fill={C.text}
                  opacity="0.4"
                />
                <rect x="2" y="3" width="14" height="6" rx="1" fill={C.green} />
              </svg>
            </div>
          </div>
        )}

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
// COMPONENT: BOTTOM TAB BAR
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
        height: 82,
        background: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(20px)",
        borderTop: `1px solid ${C.border}`,
        display: "flex",
        justifyContent: "space-around",
        alignItems: "flex-start",
        paddingTop: 8,
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
            gap: 2,
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
              fontWeight: i === activeIndex ? 600 : 400,
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
// COMPONENT: PAYWATCH TOPBAR
// ============================================================
function AppTopbar() {
  return (
    <div
      style={{
        height: 96,
        padding: "54px 20px 0",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "rgba(255,255,255,0.85)",
        backdropFilter: "blur(12px)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {/* PayWatch mini logo mark */}
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <rect x="2" y="2" width="10" height="24" rx="2" fill={C.navy} />
          <path
            d="M12 2h14a0 0 0 0 1 0 0v14a14 14 0 0 1-14-14z"
            fill={C.blue}
          />
        </svg>
        <span
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: C.navy,
            fontFamily: FONT,
            letterSpacing: "-0.02em",
          }}
        >
          Paywatch
        </span>
      </div>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <div style={{ position: "relative" }}>
          <LucideIcon d={ICONS.bell} size={20} color={C.muted} />
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
// COMPONENT: STAT CARD
// ============================================================
function StatCard({
  label,
  value,
  sub,
  color = C.blue,
  from,
  delay = 0,
}: {
  label: string;
  value: string;
  sub: string;
  color?: string;
  from: number;
  delay?: number;
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({
    frame: frame - from - delay,
    fps,
    config: SPRING_APPLE,
    durationInFrames: 30,
  });
  const scale = interpolate(s, [0, 1], [0.7, 1]);
  const op = interpolate(s, [0, 0.3], [0, 1], { extrapolateRight: "clamp" });
  return (
    <div
      style={{
        background: C.surface,
        borderRadius: 12,
        border: `1px solid ${C.border}`,
        padding: "14px 16px",
        transform: `scale(${scale})`,
        opacity: op,
        borderTop: `3px solid ${color}`,
      }}
    >
      <div
        style={{
          fontSize: 11,
          color: C.muted,
          fontFamily: FONT,
          fontWeight: 500,
          marginBottom: 4,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 24,
          fontWeight: 800,
          color,
          fontFamily: FONT,
          letterSpacing: "-0.02em",
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontSize: 10,
          color: C.muted,
          fontFamily: FONT,
          marginTop: 2,
        }}
      >
        {sub}
      </div>
    </div>
  );
}

// ============================================================
// COMPONENT: BILL ROW
// ============================================================
function BillRow({
  vendor,
  amount,
  stage,
  stageColor,
  from,
  delay = 0,
}: {
  vendor: string;
  amount: string;
  stage: string;
  stageColor: string;
  from: number;
  delay?: number;
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({
    frame: frame - from - delay,
    fps,
    config: SPRING_APPLE,
    durationInFrames: 25,
  });
  const x = interpolate(s, [0, 1], [60, 0]);
  const op = interpolate(s, [0, 0.4], [0, 1], { extrapolateRight: "clamp" });
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 16px",
        background: C.surface,
        borderRadius: 12,
        border: `1px solid ${C.border}`,
        transform: `translateX(${x}px)`,
        opacity: op,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 8,
            background: `${stageColor}10`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <LucideIcon d={ICONS.fileText} size={18} color={stageColor} />
        </div>
        <div>
          <div
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: C.text,
              fontFamily: FONT,
            }}
          >
            {vendor}
          </div>
          <div
            style={{
              fontSize: 10,
              fontWeight: 600,
              color: stageColor,
              fontFamily: FONT,
              marginTop: 2,
            }}
          >
            {stage}
          </div>
        </div>
      </div>
      <div
        style={{
          fontSize: 16,
          fontWeight: 700,
          color: C.text,
          fontFamily: FONT,
        }}
      >
        {amount}
      </div>
    </div>
  );
}

// ============================================================
// COMPONENT: PAYBUDDY ORB (MULTI-LAYER)
// ============================================================
function PayBuddyOrb({
  size = 240,
  from = 0,
  intensity = 1,
}: {
  size?: number;
  from?: number;
  intensity?: number;
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localFrame = frame - from;
  if (localFrame < 0) return null;

  const pulse = 1 + Math.sin(localFrame * 0.06) * 0.04 * intensity;
  const glow = 0.5 + Math.sin(localFrame * 0.08) * 0.2 * intensity;

  // Ring expansion
  const ringCount = 4;
  const rings = Array.from({ length: ringCount }, (_, i) => {
    const cycle = ((localFrame + i * 22) % 90) / 90;
    return {
      scale: 1 + cycle * 0.6,
      opacity: (1 - cycle) * 0.3,
      rotation: localFrame * (0.3 + i * 0.15),
    };
  });

  // Orbital particles
  const orbParticles = Array.from({ length: 16 }, (_, i) => {
    const angle = (i / 16) * Math.PI * 2 + localFrame * 0.02;
    const r = size * 0.55 + Math.sin(localFrame * 0.03 + i) * 20;
    return {
      x: Math.cos(angle) * r,
      y: Math.sin(angle) * r,
      size: 3 + Math.sin(localFrame * 0.05 + i * 0.7) * 2,
      opacity: 0.4 + Math.sin(localFrame * 0.04 + i * 1.1) * 0.3,
    };
  });

  return (
    <div
      style={{
        position: "relative",
        width: size * 2.5,
        height: size * 2.5,
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
          width: size * 1.8,
          height: size * 1.8,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${C.teal}30 0%, transparent 70%)`,
          filter: "blur(40px)",
          opacity: glow,
          transform: `scale(${pulse})`,
        }}
      />

      {/* Mid glow layer */}
      <div
        style={{
          position: "absolute",
          width: size * 1.2,
          height: size * 1.2,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${C.purple}20 0%, ${C.teal}15 50%, transparent 70%)`,
          filter: "blur(25px)",
          opacity: 0.6 + Math.sin(localFrame * 0.05) * 0.2,
        }}
      />

      {/* Core sphere */}
      <div
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          background: `radial-gradient(circle at 35% 35%, #34D399, ${C.teal}, #0D9488)`,
          boxShadow: `0 0 ${60 * intensity}px ${C.teal}60, 0 0 ${120 * intensity}px ${C.teal}30, inset 0 -20px 40px rgba(0,0,0,0.2), inset 0 10px 20px rgba(255,255,255,0.15)`,
          transform: `scale(${pulse})`,
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* Highlight */}
        <div
          style={{
            position: "absolute",
            top: "15%",
            left: "20%",
            width: "35%",
            height: "25%",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)",
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
            background: i % 3 === 0 ? C.teal : i % 3 === 1 ? C.green : "#34D399",
            transform: `translate(${p.x}px, ${p.y}px) translate(-50%, -50%)`,
            opacity: p.opacity,
            boxShadow: `0 0 ${p.size * 3}px ${C.teal}40`,
          }}
        />
      ))}
    </div>
  );
}

// ============================================================
// COMPONENT: REALISTIC LETTER / BILL PAPER
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
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({
    frame: frame - from - delay,
    fps,
    config: { stiffness: 120, damping: 16, mass: 0.9 },
    durationInFrames: 45,
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
        width: 320,
        transform: `translate(-50%, -50%) translate(${x}px, ${y}px) rotate(${rot}deg) scale(${scale})`,
        opacity: op,
        zIndex: 5,
      }}
    >
      <div
        style={{
          background: "#FEFEFE",
          borderRadius: 8,
          padding: 28,
          boxShadow:
            "0 25px 80px rgba(0,0,0,0.15), 0 8px 24px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.9)",
          border: "1px solid #E8E8E8",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Left color strip */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: 5,
            background: stageColor,
          }}
        />

        {/* Header line */}
        <div
          style={{
            fontSize: 10,
            fontWeight: 600,
            color: stageColor,
            fontFamily: FONT,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
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
            marginBottom: 6,
          }}
        >
          {vendor}
        </div>

        <div
          style={{
            fontSize: 36,
            fontWeight: 800,
            color: C.navy,
            fontFamily: FONT,
            letterSpacing: "-0.02em",
            marginBottom: 12,
          }}
        >
          {amount}
        </div>

        {/* Fake text lines */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <div
            style={{
              width: "80%",
              height: 6,
              borderRadius: 3,
              background: "#E8E8E8",
            }}
          />
          <div
            style={{
              width: "60%",
              height: 6,
              borderRadius: 3,
              background: "#E8E8E8",
            }}
          />
          <div
            style={{
              width: "70%",
              height: 6,
              borderRadius: 3,
              background: "#E8E8E8",
            }}
          />
        </div>

        {/* URGENT stamp */}
        {showStamp && (
          <div
            style={{
              position: "absolute",
              top: 20,
              right: 15,
              padding: "4px 14px",
              border: `3px solid ${C.red}`,
              color: C.red,
              fontSize: 12,
              fontWeight: 800,
              fontFamily: FONT,
              transform: "rotate(12deg)",
              opacity: 0.85,
              letterSpacing: "0.1em",
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
// COMPONENT: GRADIENT TEXT
// ============================================================
function GradientText({
  children,
  fontSize = 280,
  from1 = C.blue,
  to1 = C.purple,
  style = {},
}: {
  children: React.ReactNode;
  fontSize?: number;
  from1?: string;
  to1?: string;
  style?: React.CSSProperties;
}) {
  return (
    <span
      style={{
        fontSize,
        fontWeight: 900,
        fontFamily: FONT,
        letterSpacing: "-0.04em",
        lineHeight: 0.9,
        background: `linear-gradient(135deg, ${from1} 0%, ${to1} 100%)`,
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        filter: `drop-shadow(0 20px 60px ${from1}40)`,
        ...style,
      }}
    >
      {children}
    </span>
  );
}

// ============================================================
// COMPONENT: HEALTH GAUGE
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

  const radius = size / 2 - 12;
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
        strokeWidth="10"
        opacity="0.3"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth="10"
        strokeLinecap="round"
        strokeDasharray={`${dash} ${circ}`}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ filter: `drop-shadow(0 0 8px ${color}60)` }}
      />
      <text
        x={size / 2}
        y={size / 2 - 10}
        textAnchor="middle"
        fill={color}
        fontSize={size * 0.28}
        fontWeight="800"
        fontFamily={FONT}
      >
        {Math.round(score * s)}
      </text>
      <text
        x={size / 2}
        y={size / 2 + 20}
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
// SCENE 1: LOGO REVEAL (0 - 150 frames / 0-5s)
// ============================================================
function Scene1LogoReveal() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoS = spring({ frame: frame - 20, fps, config: SPRING_ELASTIC, durationInFrames: 40 });
  const logoScale = interpolate(logoS, [0, 1], [0, 1]);
  const logoOp = interpolate(logoS, [0, 0.3], [0, 1], { extrapolateRight: "clamp" });

  // Focus blur effect
  const blur = interpolate(frame, [0, 30, 60], [12, 4, 0], { extrapolateRight: "clamp" });

  // Tagline
  const taglineOp = interpolate(frame, [80, 100], [0, 1], { extrapolateRight: "clamp" });
  const taglineY = interpolate(frame, [80, 110], [30, 0], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });

  // Exit
  const exitOp = interpolate(frame, [120, 150], [1, 0], { extrapolateRight: "clamp" });
  const exitScale = interpolate(frame, [120, 150], [1, 1.15], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        opacity: exitOp,
        transform: `scale(${exitScale})`,
      }}
    >
      <GradientMesh dark opacity={0.2} color1="#2563EB" color2="#7C3AED" color3="#14B8A6" />

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          filter: `blur(${blur}px)`,
        }}
      >
        {/* Logo mark */}
        <div
          style={{
            transform: `scale(${logoScale})`,
            opacity: logoOp,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 24,
          }}
        >
          <svg width="120" height="120" viewBox="0 0 28 28" fill="none">
            <rect x="2" y="2" width="10" height="24" rx="2" fill="#FFFFFF" />
            <path d="M12 2h14a0 0 0 0 1 0 0v14a14 14 0 0 1-14-14z" fill={C.blue} />
          </svg>
          <span
            style={{
              fontSize: 72,
              fontWeight: 800,
              color: "#FFFFFF",
              fontFamily: FONT,
              letterSpacing: "-0.03em",
            }}
          >
            Paywatch
          </span>
        </div>

        {/* Tagline */}
        <div
          style={{
            position: "absolute",
            bottom: 500,
            opacity: taglineOp,
            transform: `translateY(${taglineY}px)`,
          }}
        >
          <span
            style={{
              fontSize: 32,
              fontWeight: 500,
              color: "rgba(255,255,255,0.7)",
              fontFamily: FONT,
              textAlign: "center",
            }}
          >
            De slimme buffer tussen jou
          </span>
          <br />
          <span
            style={{
              fontSize: 32,
              fontWeight: 500,
              color: "rgba(255,255,255,0.7)",
              fontFamily: FONT,
              textAlign: "center",
            }}
          >
            en incassokosten
          </span>
        </div>
      </AbsoluteFill>

      <Particles count={25} color="rgba(255,255,255,0.3)" area={{ x: 0, y: 0, w: 1080, h: 1920 }} />
      <Vignette intensity={0.5} />
    </AbsoluteFill>
  );
}

// ============================================================
// SCENE 2: PROBLEM (150 - 360 frames / 5-12s)
// ============================================================
function Scene2Problem() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entry
  const entryOp = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });

  // Exit
  const exitOp = interpolate(frame, [180, 210], [1, 0], { extrapolateRight: "clamp" });
  const exitBlur = interpolate(frame, [180, 210], [0, 10], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ opacity: entryOp * exitOp, filter: `blur(${exitBlur}px)` }}>
      <GradientMesh opacity={0.08} color1={C.red} color2={C.orange} color3={C.amber} />

      {/* GIANT "3.1" background text */}
      <BackgroundText text="3.1" fontSize={480} color={C.red} opacity={0.06} x={-80} y={200} from={10} />
      <BackgroundText text="MILJOEN" fontSize={180} color={C.red} opacity={0.05} x={40} y={650} from={20} />

      {/* Flying letters (realistic bills) */}
      <RealisticLetter
        vendor="Belastingdienst"
        amount="€174,00"
        stage="AANMANING"
        stageColor={C.orange}
        from={20}
        startX={500}
        startY={-500}
        endX={120}
        endY={-180}
        startRotation={25}
        endRotation={-5}
        showStamp
      />
      <RealisticLetter
        vendor="Vattenfall"
        amount="€400,00"
        stage="INCASSO"
        stageColor={C.red}
        from={20}
        delay={10}
        startX={-500}
        startY={-400}
        endX={-140}
        endY={60}
        startRotation={-20}
        endRotation={4}
      />
      <RealisticLetter
        vendor="Ziggo"
        amount="€89,95"
        stage="HERINNERING"
        stageColor={C.amber}
        from={20}
        delay={20}
        startX={400}
        startY={500}
        endX={100}
        endY={280}
        startRotation={30}
        endRotation={-8}
      />

      {/* Central text - MASSIVE */}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", zIndex: 20 }}>
        <Sequence from={60}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <LetterReveal
              text="3.1 MILJOEN"
              from={0}
              fontSize={120}
              color={C.navy}
              fontWeight={900}
            />
            <Sequence from={20}>
              <LetterReveal
                text="huishoudens"
                from={0}
                fontSize={72}
                color={C.muted}
                fontWeight={600}
              />
            </Sequence>
            <Sequence from={40}>
              <LetterReveal
                text="kampen met schulden"
                from={0}
                fontSize={52}
                color={C.red}
                fontWeight={700}
              />
            </Sequence>
          </div>
        </Sequence>
      </AbsoluteFill>

      <Particles count={12} color={`${C.red}60`} area={{ x: 100, y: 200, w: 880, h: 1200 }} />
      <Vignette intensity={0.3} />
    </AbsoluteFill>
  );
}

// ============================================================
// SCENE 3: DASHBOARD (360 - 660 frames / 12-22s)
// ============================================================
function Scene3Dashboard() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entryOp = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const exitOp = interpolate(frame, [270, 300], [1, 0], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ opacity: entryOp * exitOp }}>
      <GradientMesh opacity={0.06} />

      {/* MASSIVE background "€41" */}
      <BackgroundText text="€41" fontSize={400} color={C.blue} opacity={0.05} x={-40} y={300} from={30} />
      <BackgroundText text="GRIP" fontSize={220} color={C.navy} opacity={0.04} x={500} y={1300} from={50} rotation={-5} />

      {/* iPhone slides in from right */}
      <IPhoneMockup
        from={0}
        sceneCamera={{
          translateXFrom: 400,
          translateXTo: 0,
          rotateYFrom: -12,
          rotateYTo: 0,
          scaleFrom: 0.85,
          scaleTo: 1,
          duration: 60,
        }}
      >
        {/* Dashboard screen content */}
        <div style={{ background: C.bg, width: "100%", height: "100%" }}>
          <AppTopbar />

          <div style={{ padding: "8px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
            {/* Greeting */}
            <Sequence from={40}>
              <SpringIn from={40}>
                <div style={{ fontSize: 20, fontWeight: 700, color: C.navy, fontFamily: FONT }}>
                  Hoi, Samba
                </div>
              </SpringIn>
            </Sequence>

            {/* Vrij besteedbaar card */}
            <Sequence from={55}>
              <SpringIn from={55}>
                <div
                  style={{
                    background: C.surface,
                    borderRadius: 16,
                    border: `1px solid ${C.border}`,
                    padding: "16px 18px",
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
                      marginTop: 4,
                    }}
                  >
                    <RollingNumber target={41} from={55} prefix="€" suffix=",00" duration={45} style={{}} />
                  </div>
                  {/* Breakdown */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontFamily: FONT }}>
                      <span style={{ color: C.muted }}>Inkomen</span>
                      <span style={{ color: C.green, fontWeight: 600 }}>€2.400</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontFamily: FONT }}>
                      <span style={{ color: C.muted }}>Vaste lasten</span>
                      <span style={{ color: C.text, fontWeight: 600 }}>-€1.785</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontFamily: FONT }}>
                      <span style={{ color: C.muted }}>Open rekeningen</span>
                      <span style={{ color: C.red, fontWeight: 600 }}>-€574</span>
                    </div>
                  </div>
                  {/* Warning */}
                  <div
                    style={{
                      marginTop: 10,
                      padding: "8px 10px",
                      background: `${C.amber}10`,
                      borderRadius: 8,
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <LucideIcon d={ICONS.alertTriangle} size={14} color={C.amber} />
                    <span style={{ fontSize: 11, color: C.amber, fontWeight: 600, fontFamily: FONT }}>
                      1 vaste last in incasso
                    </span>
                  </div>
                </div>
              </SpringIn>
            </Sequence>

            {/* Stat cards */}
            <Sequence from={80}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <StatCard label="Openstaand" value="€574" sub="2 rekeningen" color={C.blue} from={80} delay={0} />
                <StatCard label="Achterstallig" value="2" sub="Direct betalen" color={C.red} from={80} delay={5} />
              </div>
            </Sequence>

            {/* Bills */}
            <Sequence from={110}>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <BillRow vendor="Belastingdienst" amount="€174,00" stage="Aanmaning" stageColor={C.orange} from={110} delay={0} />
                <BillRow vendor="Vattenfall" amount="€400,00" stage="Incasso" stageColor={C.red} from={110} delay={6} />
              </div>
            </Sequence>
          </div>

          <BottomTabBar activeIndex={0} />
        </div>
      </IPhoneMockup>

      <Particles count={10} color={`${C.blue}30`} area={{ x: 50, y: 400, w: 980, h: 800 }} />
      <Vignette intensity={0.2} />
    </AbsoluteFill>
  );
}

// ============================================================
// SCENE 4: BILL DETAIL (660 - 900 frames / 22-30s)
// ============================================================
function Scene4BillDetail() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entryOp = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const exitOp = interpolate(frame, [210, 240], [1, 0], { extrapolateRight: "clamp" });

  // Letter flies into phone and morphs
  const letterPhase = interpolate(frame, [0, 60], [0, 1], { extrapolateRight: "clamp" });
  const letterOp = interpolate(frame, [40, 70], [1, 0], { extrapolateRight: "clamp" });
  const drawerOp = interpolate(frame, [60, 80], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ opacity: entryOp * exitOp }}>
      <GradientMesh opacity={0.06} />

      {/* Background text */}
      <BackgroundText text="€174" fontSize={320} color={C.orange} opacity={0.05} x={-20} y={400} from={20} />

      {/* Floating letter that morphs into phone UI */}
      {frame < 70 && (
        <RealisticLetter
          vendor="Belastingdienst"
          amount="€174,00"
          stage="AANMANING"
          stageColor={C.orange}
          from={0}
          startX={300}
          startY={-200}
          endX={0}
          endY={0}
          startRotation={15}
          endRotation={0}
          showStamp
        />
      )}

      {/* Scan line effect */}
      {frame >= 35 && frame < 65 && (
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: `${30 + ((frame - 35) / 30) * 40}%`,
            transform: "translateX(-50%)",
            width: 340,
            height: 3,
            background: `linear-gradient(90deg, transparent, ${C.blue}, transparent)`,
            boxShadow: `0 0 20px ${C.blue}80`,
            zIndex: 15,
          }}
        />
      )}

      {/* Phone with bill detail */}
      <div style={{ opacity: drawerOp }}>
        <IPhoneMockup
          from={60}
          sceneCamera={{
            scaleFrom: 1.3,
            scaleTo: 1,
            duration: 60,
          }}
        >
          <div style={{ background: C.bg, width: "100%", height: "100%" }}>
            {/* Dark navy header */}
            <div
              style={{
                background: C.navy,
                padding: "54px 20px 24px",
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ fontSize: 9, fontWeight: 700, color: C.amber, fontFamily: FONT, padding: "3px 8px", background: `${C.amber}20`, borderRadius: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  PRIORITEIT
                </div>
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,0.7)", fontFamily: FONT }}>
                Belastingdienst
              </div>
              <div style={{ fontSize: 48, fontWeight: 800, color: "#FFFFFF", fontFamily: FONT, letterSpacing: "-0.03em" }}>
                <RollingNumber target={174} from={0} prefix="€" suffix=",00" duration={40} style={{}} />
              </div>
              {/* Badges */}
              <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
                <div style={{ fontSize: 10, fontWeight: 600, color: C.orange, background: `${C.orange}20`, padding: "3px 10px", borderRadius: 4, fontFamily: FONT }}>
                  Aanmaning
                </div>
                <div style={{ fontSize: 10, fontWeight: 600, color: C.red, background: `${C.red}20`, padding: "3px 10px", borderRadius: 4, fontFamily: FONT }}>
                  Achterstallig
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div style={{ display: "flex", padding: "0 16px", gap: 0, marginTop: 12 }}>
              {["Details", "Escalatie", "Acties", "Regeling"].map((t, i) => (
                <div key={i} style={{ flex: 1, textAlign: "center", padding: "10px 0", fontSize: 12, fontWeight: i === 0 ? 700 : 500, color: i === 0 ? C.blue : C.muted, borderBottom: i === 0 ? `2px solid ${C.blue}` : `1px solid ${C.border}`, fontFamily: FONT }}>
                  {t}
                </div>
              ))}
            </div>

            {/* Detail rows */}
            <div style={{ padding: "12px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { label: "Vervaldatum", value: "30 april 2026" },
                { label: "Ontvangstdatum", value: "15 maart 2026" },
                { label: "Categorie", value: "Overheid" },
                { label: "Bron", value: "Camera scan" },
                { label: "Referentie", value: "BEL-2026-0174" },
              ].map((row, i) => (
                <Sequence key={i} from={80 + i * 6}>
                  <SpringIn from={80 + i * 6} delay={0}>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${C.border}` }}>
                      <span style={{ fontSize: 13, color: C.muted, fontFamily: FONT }}>{row.label}</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: C.text, fontFamily: FONT }}>{row.value}</span>
                    </div>
                  </SpringIn>
                </Sequence>
              ))}
            </div>
          </div>
        </IPhoneMockup>
      </div>

      <Vignette intensity={0.2} />
    </AbsoluteFill>
  );
}

// ============================================================
// SCENE 5: PAYBUDDY VOICE CALL (900 - 1440 / 30-48s)
// ============================================================
function Scene5PayBuddy() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entryOp = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" });
  const exitOp = interpolate(frame, [510, 540], [1, 0], { extrapolateRight: "clamp" });

  // Camera push into orb
  const pushScale = interpolate(frame, [0, 300], [1, 1.15], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });

  // Conversation flow
  const msg1From = 90;
  const msg2From = 180;
  const msg3From = 270;
  const cameraFrom = 340;
  const resultFrom = 420;

  return (
    <AbsoluteFill style={{ opacity: entryOp * exitOp, transform: `scale(${pushScale})` }}>
      <GradientMesh dark opacity={0.25} color1={C.teal} color2={C.purple} color3="#0D9488" />

      {/* Orb - centered and hero */}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div style={{ marginTop: -200 }}>
          <PayBuddyOrb size={200} from={0} intensity={1.2} />
        </div>
      </AbsoluteFill>

      {/* PayBuddy label */}
      <Sequence from={20}>
        <div
          style={{
            position: "absolute",
            top: 260,
            left: 0,
            right: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 6,
          }}
        >
          <SpringIn from={20}>
            <span style={{ fontSize: 36, fontWeight: 800, color: "#FFFFFF", fontFamily: FONT }}>
              PayBuddy
            </span>
          </SpringIn>
          <Sequence from={30}>
            <SpringIn from={30}>
              <span style={{ fontSize: 16, color: `${C.teal}`, fontWeight: 500, fontFamily: FONT }}>
                Aan het praten
              </span>
            </SpringIn>
          </Sequence>
        </div>
      </Sequence>

      {/* Conversation bubbles */}
      <div
        style={{
          position: "absolute",
          bottom: 350,
          left: 80,
          right: 80,
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        {/* PayBuddy greeting */}
        <Sequence from={msg1From}>
          <SpringIn from={msg1From} config={SPRING_BOUNCY}>
            <div
              style={{
                background: "rgba(255,255,255,0.1)",
                backdropFilter: "blur(20px)",
                borderRadius: "20px 20px 20px 4px",
                padding: "14px 18px",
                maxWidth: 340,
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <LetterReveal
                text="Hoi! Fijn dat je belt."
                from={msg1From + 5}
                fontSize={18}
                color="rgba(255,255,255,0.9)"
                fontWeight={500}
                center={false}
              />
              <Sequence from={30}>
                <LetterReveal
                  text="Waar kan ik je mee helpen?"
                  from={msg1From + 35}
                  fontSize={18}
                  color="rgba(255,255,255,0.9)"
                  fontWeight={500}
                  center={false}
                  style={{ marginTop: 4 }}
                />
              </Sequence>
            </div>
          </SpringIn>
        </Sequence>

        {/* User message */}
        <Sequence from={msg2From}>
          <SpringIn from={msg2From} config={SPRING_BOUNCY}>
            <div
              style={{
                background: C.blue,
                borderRadius: "20px 20px 4px 20px",
                padding: "14px 18px",
                maxWidth: 300,
                alignSelf: "flex-end",
                marginLeft: "auto",
              }}
            >
              <LetterReveal
                text="Ik heb een brief, kun je meekijken?"
                from={msg2From + 5}
                fontSize={18}
                color="#FFFFFF"
                fontWeight={500}
                center={false}
              />
            </div>
          </SpringIn>
        </Sequence>

        {/* PayBuddy response */}
        <Sequence from={msg3From}>
          <SpringIn from={msg3From} config={SPRING_BOUNCY}>
            <div
              style={{
                background: "rgba(255,255,255,0.1)",
                backdropFilter: "blur(20px)",
                borderRadius: "20px 20px 20px 4px",
                padding: "14px 18px",
                maxWidth: 340,
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <LetterReveal
                text="Natuurlijk! Maak een foto van je rekening."
                from={msg3From + 5}
                fontSize={18}
                color="rgba(255,255,255,0.9)"
                fontWeight={500}
                center={false}
              />
            </div>
          </SpringIn>
        </Sequence>

        {/* Camera action */}
        <Sequence from={cameraFrom}>
          <SpringIn from={cameraFrom} config={SPRING_APPLE}>
            <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 8 }}>
              <div
                style={{
                  padding: "12px 24px",
                  background: C.blue,
                  borderRadius: 12,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <LucideIcon d={ICONS.camera} size={18} color="#FFF" />
                <span style={{ fontSize: 14, fontWeight: 600, color: "#FFF", fontFamily: FONT }}>
                  Camera
                </span>
              </div>
            </div>
          </SpringIn>
        </Sequence>

        {/* Processing + result */}
        <Sequence from={resultFrom}>
          <SpringIn from={resultFrom} config={SPRING_BOUNCY}>
            <div
              style={{
                background: `${C.green}20`,
                backdropFilter: "blur(20px)",
                borderRadius: 16,
                padding: "16px 20px",
                border: `1px solid ${C.green}30`,
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <LucideIcon d={ICONS.check} size={24} color={C.green} strokeWidth={3} />
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#FFF", fontFamily: FONT }}>
                  Top, de rekening staat erin!
                </div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", fontFamily: FONT, marginTop: 2 }}>
                  Ziggo - €89,95
                </div>
              </div>
            </div>
          </SpringIn>
        </Sequence>
      </div>

      {/* Call controls */}
      <Sequence from={50}>
        <div
          style={{
            position: "absolute",
            bottom: 120,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
            gap: 40,
          }}
        >
          <SpringIn from={50} delay={0}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 32,
                background: "rgba(255,255,255,0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <LucideIcon d={ICONS.mic} size={24} color="rgba(255,255,255,0.7)" />
            </div>
          </SpringIn>
          <SpringIn from={50} delay={5}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 32,
                background: C.red,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: `0 8px 24px ${C.red}40`,
              }}
            >
              <LucideIcon d={ICONS.phoneOff} size={24} color="#FFF" />
            </div>
          </SpringIn>
          <SpringIn from={50} delay={10}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 32,
                background: "rgba(255,255,255,0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <LucideIcon d={ICONS.camera} size={24} color="rgba(255,255,255,0.7)" />
            </div>
          </SpringIn>
        </div>
      </Sequence>

      <Particles count={15} color={`${C.teal}40`} area={{ x: 100, y: 100, w: 880, h: 1700 }} />
      <Vignette intensity={0.5} />
    </AbsoluteFill>
  );
}

// ============================================================
// SCENE 6: WIK SHIELD (1440 - 1680 / 48-56s)
// ============================================================
function Scene6WIKShield() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entryOp = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const exitOp = interpolate(frame, [210, 240], [1, 0], { extrapolateRight: "clamp" });

  // Shield slam animation
  const shieldS = spring({ frame: frame - 30, fps, config: SPRING_ELASTIC, durationInFrames: 30 });
  const shieldScale = interpolate(shieldS, [0, 1], [3, 1]);
  const shieldOp = interpolate(shieldS, [0, 0.2], [0, 1], { extrapolateRight: "clamp" });

  // Impact shake
  const shakeX = frame >= 30 && frame < 45 ? Math.sin(frame * 4) * (45 - frame) * 0.5 : 0;
  const shakeY = frame >= 30 && frame < 45 ? Math.cos(frame * 5) * (45 - frame) * 0.3 : 0;

  return (
    <AbsoluteFill
      style={{
        opacity: entryOp * exitOp,
        transform: `translate(${shakeX}px, ${shakeY}px)`,
      }}
    >
      <GradientMesh opacity={0.08} color1={C.purple} color2={C.blue} color3={C.green} />

      {/* Background text */}
      <BackgroundText text="TE HOOG" fontSize={200} color={C.red} opacity={0.04} x={60} y={250} from={60} rotation={-3} />

      {/* Shield slam */}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div
          style={{
            transform: `scale(${shieldScale})`,
            opacity: shieldOp,
            filter: `drop-shadow(0 20px 60px ${C.purple}40)`,
          }}
        >
          <LucideIcon d={ICONS.shieldCheck} size={180} color={C.purple} strokeWidth={1.2} />
        </div>
      </AbsoluteFill>

      {/* Cost comparison */}
      <Sequence from={60}>
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 20,
              marginTop: 300,
            }}
          >
            {/* Overcharged amount */}
            <SpringIn from={60}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <span style={{ fontSize: 18, color: C.muted, fontFamily: FONT, fontWeight: 500 }}>
                  Berekend door incassobureau
                </span>
                <span
                  style={{
                    fontSize: 72,
                    fontWeight: 800,
                    color: C.red,
                    fontFamily: FONT,
                    textDecoration: "line-through",
                    textDecorationColor: C.red,
                    letterSpacing: "-0.03em",
                  }}
                >
                  €145
                </span>
              </div>
            </SpringIn>

            {/* Legal max */}
            <Sequence from={90}>
              <SpringIn from={90} config={SPRING_BOUNCY}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <span style={{ fontSize: 18, color: C.muted, fontFamily: FONT, fontWeight: 500 }}>
                    Wettelijk maximum (WIK)
                  </span>
                  <GradientText fontSize={96} from1={C.green} to1="#34D399">
                    €40
                  </GradientText>
                </div>
              </SpringIn>
            </Sequence>

            {/* Savings message */}
            <Sequence from={130}>
              <SpringIn from={130}>
                <div
                  style={{
                    background: `${C.green}15`,
                    borderRadius: 16,
                    padding: "14px 28px",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    border: `1px solid ${C.green}30`,
                  }}
                >
                  <LucideIcon d={ICONS.shieldCheck} size={24} color={C.green} />
                  <span
                    style={{
                      fontSize: 20,
                      fontWeight: 700,
                      color: C.green,
                      fontFamily: FONT,
                    }}
                  >
                    €105 bespaard
                  </span>
                </div>
              </SpringIn>
            </Sequence>
          </div>
        </AbsoluteFill>
      </Sequence>

      <Particles count={8} color={`${C.purple}40`} area={{ x: 200, y: 200, w: 680, h: 1200 }} />
      <Vignette intensity={0.25} />
    </AbsoluteFill>
  );
}

// ============================================================
// SCENE 7: TOESLAGEN (1680 - 1920 / 56-64s)
// ============================================================
function Scene7Toeslagen() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entryOp = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const exitOp = interpolate(frame, [210, 240], [1, 0], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ opacity: entryOp * exitOp }}>
      <GradientMesh opacity={0.08} color1={C.green} color2={C.teal} color3={C.blue} />

      {/* Giant +€705 */}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <Sequence from={20}>
          <SpringIn from={20} config={SPRING_ELASTIC}>
            <GradientText fontSize={220} from1={C.green} to1="#34D399" style={{ textAlign: "center" }}>
              +€705
            </GradientText>
          </SpringIn>
        </Sequence>

        <div style={{ position: "absolute", top: 620, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Sequence from={40}>
            <LetterReveal text="per maand" from={40} fontSize={48} color={C.muted} fontWeight={600} />
          </Sequence>
          <Sequence from={55}>
            <LetterReveal text="aan toeslagen gevonden" from={55} fontSize={36} color={C.muted} fontWeight={400} />
          </Sequence>
        </div>
      </AbsoluteFill>

      {/* Benefit cards floating */}
      <div style={{ position: "absolute", bottom: 300, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
        {[
          { name: "Huurtoeslag", amount: "+€484,17/mnd", color: C.green },
          { name: "Zorgtoeslag", amount: "+€221,00/mnd", color: C.teal },
          { name: "Kinderopvangtoeslag", amount: "+€500,00/mnd", color: C.blue },
        ].map((b, i) => (
          <Sequence key={i} from={80 + i * 15}>
            <SpringIn from={80 + i * 15} config={SPRING_BOUNCY}>
              <div
                style={{
                  background: "rgba(255,255,255,0.95)",
                  borderRadius: 16,
                  padding: "16px 28px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: 420,
                  border: `1px solid ${C.border}`,
                  boxShadow: `0 12px 40px rgba(0,0,0,0.06)`,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      background: `${b.color}12`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <LucideIcon d={ICONS.euro} size={20} color={b.color} />
                  </div>
                  <span style={{ fontSize: 16, fontWeight: 600, color: C.navy, fontFamily: FONT }}>
                    {b.name}
                  </span>
                </div>
                <span style={{ fontSize: 18, fontWeight: 800, color: b.color, fontFamily: FONT }}>
                  {b.amount}
                </span>
              </div>
            </SpringIn>
          </Sequence>
        ))}
      </div>

      <Particles count={12} color={`${C.green}40`} area={{ x: 100, y: 100, w: 880, h: 1700 }} />
      <Vignette intensity={0.2} />
    </AbsoluteFill>
  );
}

// ============================================================
// SCENE 8: STATS (1920 - 2160 / 64-72s)
// ============================================================
function Scene8Stats() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entryOp = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const exitOp = interpolate(frame, [210, 240], [1, 0], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ opacity: entryOp * exitOp }}>
      <GradientMesh opacity={0.06} />

      <BackgroundText text="38" fontSize={500} color={C.red} opacity={0.04} x={200} y={200} from={10} />

      <IPhoneMockup
        from={0}
        sceneCamera={{
          scaleFrom: 0.9,
          scaleTo: 1.05,
          duration: 120,
        }}
      >
        <div style={{ background: C.bg, width: "100%", height: "100%" }}>
          <AppTopbar />

          <div style={{ padding: "8px 16px", display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
            <Sequence from={20}>
              <SpringIn from={20}>
                <div style={{ fontSize: 18, fontWeight: 700, color: C.navy, fontFamily: FONT }}>
                  Financiele gezondheid
                </div>
              </SpringIn>
            </Sequence>

            {/* Health gauge */}
            <Sequence from={30}>
              <HealthGauge score={38} size={180} from={30} color={C.red} />
            </Sequence>

            {/* Stat cards */}
            <Sequence from={70}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, width: "100%" }}>
                <StatCard label="Op tijd betaald" value="50%" sub="12/24" color={C.blue} from={70} delay={0} />
                <StatCard label="Streak" value="0" sub="dagen" color={C.amber} from={70} delay={5} />
                <StatCard label="Bespaard" value="€688,95" sub="incassokosten" color={C.green} from={70} delay={10} />
                <StatCard label="Achterstallig" value="2" sub="Direct betalen" color={C.red} from={70} delay={15} />
              </div>
            </Sequence>
          </div>

          <BottomTabBar activeIndex={3} />
        </div>
      </IPhoneMockup>

      <Vignette intensity={0.2} />
    </AbsoluteFill>
  );
}

// ============================================================
// SCENE 9: CLOSING (2160 - 2700 / 72-90s)
// ============================================================
function Scene9Closing() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phone pull back
  const pullS = spring({ frame, fps, config: SPRING_GENTLE, durationInFrames: 60 });
  const phoneScale = interpolate(pullS, [0, 1], [1.15, 0.7]);
  const phoneOp = interpolate(frame, [0, 30, 90, 120], [1, 1, 1, 0], { extrapolateRight: "clamp" });

  // Logo reveal
  const logoFrom = 150;
  const logoS = spring({ frame: frame - logoFrom, fps, config: SPRING_ELASTIC, durationInFrames: 40 });
  const logoScale = interpolate(logoS, [0, 1], [0, 1]);
  const logoOp = interpolate(logoS, [0, 0.3], [0, 1], { extrapolateRight: "clamp" });

  // CTA
  const ctaFrom = 300;
  const ctaS = spring({ frame: frame - ctaFrom, fps, config: SPRING_BOUNCY, durationInFrames: 30 });
  const ctaScale = interpolate(ctaS, [0, 1], [0.8, 1]);
  const ctaOp = interpolate(ctaS, [0, 0.3], [0, 1], { extrapolateRight: "clamp" });

  // Pulse on CTA
  const ctaPulse = frame >= ctaFrom + 60 ? 1 + Math.sin((frame - ctaFrom - 60) * 0.08) * 0.03 : 1;

  return (
    <AbsoluteFill>
      <GradientMesh dark opacity={0.25} color1={C.blue} color2={C.purple} color3={C.teal} />

      {/* Background text */}
      <BackgroundText text="GRIP" fontSize={320} color="rgba(255,255,255,0.03)" x={-60} y={300} from={150} />
      <BackgroundText text="CONTROLE" fontSize={200} color="rgba(255,255,255,0.02)" x={100} y={1200} from={180} rotation={-3} />

      {/* Phone pulling back */}
      <div style={{ opacity: phoneOp }}>
        <IPhoneMockup
          from={0}
          sceneCamera={{
            scaleFrom: 1 / 1.15,
            scaleTo: 0.6,
            duration: 90,
          }}
        >
          <div style={{ background: C.bg, width: "100%", height: "100%" }}>
            <AppTopbar />
            <div style={{ padding: "8px 16px" }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: C.navy, fontFamily: FONT }}>Hoi, Samba</div>
              <div style={{ background: C.surface, borderRadius: 16, border: `1px solid ${C.border}`, padding: "16px 18px", marginTop: 10 }}>
                <div style={{ fontSize: 11, color: C.muted, fontFamily: FONT, fontWeight: 500 }}>Vrij besteedbaar deze maand</div>
                <div style={{ fontSize: 48, fontWeight: 800, color: C.navy, fontFamily: FONT, letterSpacing: "-0.03em" }}>€41,00</div>
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
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 30,
            transform: `scale(${logoScale})`,
            opacity: logoOp,
          }}
        >
          <svg width="100" height="100" viewBox="0 0 28 28" fill="none">
            <rect x="2" y="2" width="10" height="24" rx="2" fill="#FFFFFF" />
            <path d="M12 2h14a0 0 0 0 1 0 0v14a14 14 0 0 1-14-14z" fill={C.blue} />
          </svg>
          <span
            style={{
              fontSize: 64,
              fontWeight: 800,
              color: "#FFFFFF",
              fontFamily: FONT,
              letterSpacing: "-0.03em",
            }}
          >
            Paywatch
          </span>
        </div>
      </AbsoluteFill>

      {/* Taglines */}
      <div
        style={{
          position: "absolute",
          bottom: 420,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 12,
        }}
      >
        <Sequence from={200}>
          <LetterReveal
            text="Grip op je rekeningen"
            from={200}
            fontSize={40}
            color="rgba(255,255,255,0.9)"
            fontWeight={700}
          />
        </Sequence>
        <Sequence from={230}>
          <LetterReveal
            text="Beschermd tegen te hoge kosten"
            from={230}
            fontSize={28}
            color="rgba(255,255,255,0.5)"
            fontWeight={500}
          />
        </Sequence>
      </div>

      {/* CTA Button */}
      <Sequence from={ctaFrom}>
        <div
          style={{
            position: "absolute",
            bottom: 280,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              padding: "18px 48px",
              background: C.blue,
              borderRadius: 16,
              transform: `scale(${ctaScale * ctaPulse})`,
              opacity: ctaOp,
              boxShadow: `0 16px 48px ${C.blue}50, inset 0 2px 0 rgba(255,255,255,0.2)`,
            }}
          >
            <span
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: "#FFFFFF",
                fontFamily: FONT,
              }}
            >
              Download nu gratis
            </span>
          </div>
        </div>
      </Sequence>

      {/* URL */}
      <Sequence from={350}>
        <SpringIn from={350}>
          <div
            style={{
              position: "absolute",
              bottom: 200,
              left: 0,
              right: 0,
              textAlign: "center",
            }}
          >
            <span
              style={{
                fontSize: 20,
                fontWeight: 600,
                color: "rgba(255,255,255,0.4)",
                fontFamily: FONT,
                letterSpacing: "0.05em",
              }}
            >
              paywatch.app
            </span>
          </div>
        </SpringIn>
      </Sequence>

      {/* Investor pitch date */}
      <Sequence from={400}>
        <SpringIn from={400}>
          <div
            style={{
              position: "absolute",
              bottom: 100,
              left: 0,
              right: 0,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                padding: "10px 20px",
                background: "rgba(255,255,255,0.06)",
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <span
                style={{
                  fontSize: 14,
                  color: "rgba(255,255,255,0.4)",
                  fontFamily: FONT,
                  fontWeight: 500,
                }}
              >
                28 mei 2026 — Hogeschool Rotterdam
              </span>
            </div>
          </div>
        </SpringIn>
      </Sequence>

      <Particles count={20} color="rgba(255,255,255,0.15)" area={{ x: 0, y: 0, w: 1080, h: 1920 }} />
      <Vignette intensity={0.5} />
    </AbsoluteFill>
  );
}

// ============================================================
// MAIN COMPOSITION
// ============================================================
export const PayWatchDemo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg, fontFamily: FONT }}>
      {/* Scene 1: Logo Reveal (0-150) */}
      <Sequence from={0} durationInFrames={150}>
        <Scene1LogoReveal />
      </Sequence>

      {/* Scene 2: Problem (150-360) */}
      <Sequence from={150} durationInFrames={210}>
        <Scene2Problem />
      </Sequence>

      {/* Scene 3: Dashboard (360-660) */}
      <Sequence from={360} durationInFrames={300}>
        <Scene3Dashboard />
      </Sequence>

      {/* Scene 4: Bill Detail (660-900) */}
      <Sequence from={660} durationInFrames={240}>
        <Scene4BillDetail />
      </Sequence>

      {/* Scene 5: PayBuddy Voice Call (900-1440) */}
      <Sequence from={900} durationInFrames={540}>
        <Scene5PayBuddy />
      </Sequence>

      {/* Scene 6: WIK Shield (1440-1680) */}
      <Sequence from={1440} durationInFrames={240}>
        <Scene6WIKShield />
      </Sequence>

      {/* Scene 7: Toeslagen (1680-1920) */}
      <Sequence from={1680} durationInFrames={240}>
        <Scene7Toeslagen />
      </Sequence>

      {/* Scene 8: Stats (1920-2160) */}
      <Sequence from={1920} durationInFrames={240}>
        <Scene8Stats />
      </Sequence>

      {/* Scene 9: Closing (2160-2700) */}
      <Sequence from={2160} durationInFrames={540}>
        <Scene9Closing />
      </Sequence>
    </AbsoluteFill>
  );
};
