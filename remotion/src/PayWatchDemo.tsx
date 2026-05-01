import React from "react";
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";

const { fontFamily } = loadFont();

// ─── DESIGN TOKENS ───────────────────────────────────────────
const C = {
  bg: "#F4F7FB",
  card: "#FFFFFF",
  navy: "#0A2540",
  blue: "#2563EB",
  blueTint: "#EFF6FF",
  text: "#0F172A",
  muted: "#64748B",
  border: "#E2E8F0",
  green: "#059669",
  greenLight: "#F0FDF4",
  amber: "#D97706",
  amberLight: "#FEF3C7",
  orange: "#EA580C",
  red: "#DC2626",
  redLight: "#FEF2F2",
  darkRed: "#991B1B",
  purple: "#7C3AED",
  purpleLight: "#F5F3FF",
};

const FONT = fontFamily;

// ─── ANIMATION HELPERS ───────────────────────────────────────
function easeOut(t: number) {
  return 1 - Math.pow(1 - t, 5);
}

function useSpring(delay: number, config = { damping: 12, stiffness: 200, mass: 0.8 }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: Math.max(0, frame - delay), fps, config });
}

function useFadeSlide(delay: number, distance = 40) {
  const s = useSpring(delay);
  return {
    opacity: s,
    transform: `translateY(${(1 - s) * distance}px)`,
  };
}

function useCounter(target: number, startFrame: number, duration = 40) {
  const frame = useCurrentFrame();
  const progress = Math.min(1, Math.max(0, (frame - startFrame) / duration));
  return Math.round(target * easeOut(progress));
}

function formatEuro(cents: number): string {
  const euros = cents / 100;
  return `€${euros.toLocaleString("nl-NL", { minimumFractionDigits: 2 })}`;
}

// ─── PHONE MOCKUP ────────────────────────────────────────────
const PhoneMockup: React.FC<{
  children: React.ReactNode;
  rotateX?: number;
  rotateY?: number;
  scale?: number;
}> = ({ children, rotateX = 0, rotateY = 0, scale = 1 }) => (
  <div
    style={{
      width: 380,
      height: 780,
      borderRadius: 48,
      background: "#1a1a2e",
      padding: 10,
      boxShadow: "0 40px 80px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.08)",
      transform: `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`,
      position: "relative",
    }}
  >
    {/* Dynamic Island */}
    <div
      style={{
        position: "absolute",
        top: 12,
        left: "50%",
        transform: "translateX(-50%)",
        width: 110,
        height: 30,
        background: "#000",
        borderRadius: 20,
        zIndex: 30,
      }}
    />
    {/* Screen */}
    <div
      style={{
        width: "100%",
        height: "100%",
        borderRadius: 38,
        overflow: "hidden",
        background: C.bg,
        position: "relative",
      }}
    >
      {children}
    </div>
    {/* Home indicator */}
    <div
      style={{
        position: "absolute",
        bottom: 16,
        left: "50%",
        transform: "translateX(-50%)",
        width: 120,
        height: 5,
        borderRadius: 3,
        background: "rgba(255,255,255,0.25)",
      }}
    />
  </div>
);

// ─── BOTTOM TAB BAR ──────────────────────────────────────────
const BottomTabBar: React.FC<{ active: string }> = ({ active }) => {
  const tabs = [
    { id: "overzicht", label: "Overzicht" },
    { id: "betalingen", label: "Betalingen" },
    { id: "feed", label: "Feed" },
    { id: "stats", label: "Stats" },
    { id: "buddy", label: "Buddy" },
  ];
  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        background: C.card,
        borderTop: `1px solid ${C.border}`,
        padding: "8px 0 24px",
        display: "flex",
        justifyContent: "space-around",
        zIndex: 10,
      }}
    >
      {tabs.map((t) => {
        const isActive = t.id === active;
        const isFeed = t.id === "feed";
        return (
          <div key={t.id} style={{ textAlign: "center", position: "relative" }}>
            <div
              style={{
                width: isFeed ? 36 : 22,
                height: isFeed ? 36 : 22,
                margin: "0 auto 3px",
                borderRadius: isFeed ? 18 : 5,
                background: isActive ? C.blue : isFeed ? C.blue : C.border,
                opacity: isActive || isFeed ? 1 : 0.5,
              }}
            />
            <div
              style={{
                fontFamily: FONT,
                fontSize: 10,
                fontWeight: isActive ? 600 : 400,
                color: isActive ? C.blue : C.muted,
              }}
            >
              {t.label}
            </div>
            {isActive && (
              <div
                style={{
                  width: 4,
                  height: 4,
                  borderRadius: 2,
                  background: C.blue,
                  margin: "3px auto 0",
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

// ─── SCENE 1: HERO INTRO ────────────────────────────────────
const HeroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const logoScale = spring({ frame, fps, config: { damping: 10, stiffness: 80 }, from: 0.6, to: 1 });
  const logoOpacity = interpolate(frame, [0, 25], [0, 1], { extrapolateRight: "clamp" });
  const taglineOpacity = interpolate(frame, [40, 65], [0, 1], { extrapolateRight: "clamp" });
  const taglineY = interpolate(frame, [40, 65], [30, 0], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: C.navy,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Gradient mesh BG */}
      <div
        style={{
          position: "absolute",
          width: "150%",
          height: "150%",
          background: `radial-gradient(circle at 35% 35%, ${C.blue}18 0%, transparent 50%),
                       radial-gradient(circle at 65% 65%, ${C.purple}15 0%, transparent 50%)`,
          filter: "blur(80px)",
        }}
      />

      {/* Logo — actual PayWatch SVG */}
      <div
        style={{
          transform: `scale(${logoScale})`,
          opacity: logoOpacity,
          textAlign: "center",
          filter: `blur(${interpolate(frame, [0, 20], [8, 0], { extrapolateRight: "clamp" })}px)`,
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="380" viewBox="0 0 384 75" style={{ filter: "brightness(0) invert(1)" }}>
          <g transform="matrix(1, 0, 0, 1, 22, 5)">
            <g clipPath="url(#a23)">
              <path fill="#fff" d="M 44.359375 40.308594 L 44.359375 20.671875 C 20 20.671875 0.257812 40.414062 0.257812 64.773438 L 19.894531 64.773438 C 19.894531 51.261719 30.847656 40.308594 44.359375 40.308594Z"/>
              <path fill="#fff" d="M 42.011719 20.671875 L 62.46875 20.671875 L 62.46875 64.78125 L 42.011719 64.78125Z"/>
              <path fill="#fff" d="M 0.25 0.21875 L 42.003906 0.21875 L 42.003906 20.675781 L 0.25 20.675781Z"/>
              <path fill="#fff" d="M 48.746094 0.214844 L 62.46875 0.214844 L 62.46875 13.933594 L 48.746094 13.933594Z"/>
            </g>
          </g>
          <g transform="matrix(1, 0, 0, 1, 98, 0)">
            <g fill="#fff">
              <g transform="translate(0.45, 57.89)"><path d="M 29.25 -38.875 C 30.945312 -37.875 32.191406 -36.53125 32.984375 -34.84375 C 33.785156 -33.164062 34.1875 -31.15625 34.1875 -28.8125 C 34.1875 -26.488281 33.796875 -24.390625 33.015625 -22.515625 C 32.242188 -20.640625 31.035156 -19.132812 29.390625 -18 C 28.222656 -17.101562 26.800781 -16.425781 25.125 -15.96875 C 23.445312 -15.519531 21.378906 -15.296875 18.921875 -15.296875 L 12.734375 -15.296875 L 12.734375 0 L 5.859375 0 L 5.859375 -41 L 18.921875 -41 C 21.316406 -41 23.34375 -40.828125 25 -40.484375 C 26.65625 -40.140625 28.070312 -39.601562 29.25 -38.875Z M 25.296875 -23 C 25.910156 -23.5625 26.378906 -24.28125 26.703125 -25.15625 C 27.035156 -26.039062 27.203125 -27.132812 27.203125 -28.4375 C 27.203125 -29.71875 27.023438 -30.785156 26.671875 -31.640625 C 26.316406 -32.492188 25.832031 -33.160156 25.21875 -33.640625 C 24.414062 -34.273438 23.421875 -34.691406 22.234375 -34.890625 C 21.054688 -35.097656 19.644531 -35.203125 18 -35.203125 L 12.734375 -35.203125 L 12.734375 -21.15625 L 18 -21.15625 C 19.6875 -21.15625 21.132812 -21.285156 22.34375 -21.546875 C 23.550781 -21.804688 24.535156 -22.289062 25.296875 -23Z"/></g>
              <g transform="translate(35.69, 57.89)"><path d="M 11.5 0.546875 C 10.332031 0.546875 9.210938 0.394531 8.140625 0.09375 C 7.066406 -0.195312 6.113281 -0.65625 5.28125 -1.28125 C 4.445312 -1.90625 3.789062 -2.71875 3.3125 -3.71875 C 2.832031 -4.726562 2.59375 -5.929688 2.59375 -7.328125 C 2.59375 -8.878906 2.882812 -10.179688 3.46875 -11.234375 C 4.050781 -12.296875 4.847656 -13.164062 5.859375 -13.84375 C 6.878906 -14.519531 8.054688 -15.066406 9.390625 -15.484375 C 10.722656 -15.910156 12.144531 -16.257812 13.65625 -16.53125 L 18.03125 -17.34375 C 18.988281 -17.53125 19.671875 -17.835938 20.078125 -18.265625 C 20.492188 -18.703125 20.703125 -19.265625 20.703125 -19.953125 C 20.703125 -21.140625 20.425781 -22.078125 19.875 -22.765625 C 19.332031 -23.460938 18.628906 -23.957031 17.765625 -24.25 C 16.910156 -24.550781 16 -24.703125 15.03125 -24.703125 C 14 -24.703125 13.039062 -24.53125 12.15625 -24.1875 C 11.28125 -23.851562 10.554688 -23.316406 9.984375 -22.578125 C 9.421875 -21.847656 9.066406 -20.859375 8.921875 -19.609375 L 2.96875 -20.703125 C 3.457031 -23.691406 4.757812 -25.894531 6.875 -27.3125 C 9 -28.738281 11.851562 -29.453125 15.4375 -29.453125 C 16.875 -29.453125 18.28125 -29.296875 19.65625 -28.984375 C 21.039062 -28.679688 22.289062 -28.148438 23.40625 -27.390625 C 24.519531 -26.628906 25.40625 -25.585938 26.0625 -24.265625 C 26.726562 -22.941406 27.0625 -21.265625 27.0625 -19.234375 L 27.0625 -8.015625 C 27.0625 -6.660156 27.265625 -5.738281 27.671875 -5.25 C 28.085938 -4.757812 28.796875 -4.515625 29.796875 -4.515625 L 30.25 -4.515625 L 30.25 0 L 27.109375 0 C 25.484375 0 24.179688 -0.300781 23.203125 -0.90625 C 22.222656 -1.507812 21.570312 -2.484375 21.25 -3.828125 L 20.9375 -3.828125 C 20.1875 -2.773438 19.296875 -1.925781 18.265625 -1.28125 C 17.242188 -0.632812 16.148438 -0.171875 14.984375 0.109375 C 13.828125 0.398438 12.664062 0.546875 11.5 0.546875Z M 13.0625 -4.65625 C 14.570312 -4.65625 15.9375 -5.007812 17.15625 -5.71875 C 18.375 -6.425781 19.34375 -7.425781 20.0625 -8.71875 C 20.78125 -10.019531 21.140625 -11.550781 21.140625 -13.3125 L 13.75 -11.671875 C 12.226562 -11.390625 11.054688 -10.957031 10.234375 -10.375 C 9.410156 -9.800781 9 -8.96875 9 -7.875 C 9 -6.75 9.390625 -5.929688 10.171875 -5.421875 C 10.960938 -4.910156 11.925781 -4.65625 13.0625 -4.65625Z"/></g>
              <g transform="translate(66.36, 57.89)"><path d="M 23.0625 -28.921875 L 29.9375 -28.921875 L 12.3125 14.5 L 5.546875 14.5 L 12.078125 -0.953125 L 0.484375 -28.921875 L 7.765625 -28.921875 L 15.265625 -8.21875Z"/></g>
              <g transform="translate(95.51, 57.89)"><path d="M 40.546875 -28.921875 L 47.453125 -28.921875 L 37.375 0.03125 L 31.3125 0.03125 L 24.046875 -20.640625 L 16.765625 0.03125 L 10.609375 0.03125 L 0.75 -28.921875 L 7.59375 -28.921875 L 14.140625 -8.453125 L 21.453125 -28.921875 L 26.5625 -28.921875 L 33.875 -8.484375Z"/></g>
              <g transform="translate(142.33, 57.89)"><path d="M 11.5 0.546875 C 10.332031 0.546875 9.210938 0.394531 8.140625 0.09375 C 7.066406 -0.195312 6.113281 -0.65625 5.28125 -1.28125 C 4.445312 -1.90625 3.789062 -2.71875 3.3125 -3.71875 C 2.832031 -4.726562 2.59375 -5.929688 2.59375 -7.328125 C 2.59375 -8.878906 2.882812 -10.179688 3.46875 -11.234375 C 4.050781 -12.296875 4.847656 -13.164062 5.859375 -13.84375 C 6.878906 -14.519531 8.054688 -15.066406 9.390625 -15.484375 C 10.722656 -15.910156 12.144531 -16.257812 13.65625 -16.53125 L 18.03125 -17.34375 C 18.988281 -17.53125 19.671875 -17.835938 20.078125 -18.265625 C 20.492188 -18.703125 20.703125 -19.265625 20.703125 -19.953125 C 20.703125 -21.140625 20.425781 -22.078125 19.875 -22.765625 C 19.332031 -23.460938 18.628906 -23.957031 17.765625 -24.25 C 16.910156 -24.550781 16 -24.703125 15.03125 -24.703125 C 14 -24.703125 13.039062 -24.53125 12.15625 -24.1875 C 11.28125 -23.851562 10.554688 -23.316406 9.984375 -22.578125 C 9.421875 -21.847656 9.066406 -20.859375 8.921875 -19.609375 L 2.96875 -20.703125 C 3.457031 -23.691406 4.757812 -25.894531 6.875 -27.3125 C 9 -28.738281 11.851562 -29.453125 15.4375 -29.453125 C 16.875 -29.453125 18.28125 -29.296875 19.65625 -28.984375 C 21.039062 -28.679688 22.289062 -28.148438 23.40625 -27.390625 C 24.519531 -26.628906 25.40625 -25.585938 26.0625 -24.265625 C 26.726562 -22.941406 27.0625 -21.265625 27.0625 -19.234375 L 27.0625 -8.015625 C 27.0625 -6.660156 27.265625 -5.738281 27.671875 -5.25 C 28.085938 -4.757812 28.796875 -4.515625 29.796875 -4.515625 L 30.25 -4.515625 L 30.25 0 L 27.109375 0 C 25.484375 0 24.179688 -0.300781 23.203125 -0.90625 C 22.222656 -1.507812 21.570312 -2.484375 21.25 -3.828125 L 20.9375 -3.828125 C 20.1875 -2.773438 19.296875 -1.925781 18.265625 -1.28125 C 17.242188 -0.632812 16.148438 -0.171875 14.984375 0.109375 C 13.828125 0.398438 12.664062 0.546875 11.5 0.546875Z M 13.0625 -4.65625 C 14.570312 -4.65625 15.9375 -5.007812 17.15625 -5.71875 C 18.375 -6.425781 19.34375 -7.425781 20.0625 -8.71875 C 20.78125 -10.019531 21.140625 -11.550781 21.140625 -13.3125 L 13.75 -11.671875 C 12.226562 -11.390625 11.054688 -10.957031 10.234375 -10.375 C 9.410156 -9.800781 9 -8.96875 9 -7.875 C 9 -6.75 9.390625 -5.929688 10.171875 -5.421875 C 10.960938 -4.910156 11.925781 -4.65625 13.0625 -4.65625Z"/></g>
              <g transform="translate(173.01, 57.89)"><path d="M 14.6875 0 C 12.101562 0 10.078125 -0.734375 8.609375 -2.203125 C 7.140625 -3.671875 6.40625 -5.753906 6.40625 -8.453125 L 6.40625 -23.75 L 0.625 -23.75 L 0.625 -28.921875 L 2.609375 -28.921875 C 4.148438 -28.921875 5.28125 -29.28125 6 -30 C 6.71875 -30.71875 7.078125 -32.019531 7.078125 -33.90625 L 7.078125 -38.390625 L 13.109375 -38.390625 L 13.109375 -28.921875 L 19.40625 -28.921875 L 19.40625 -23.75 L 13.109375 -23.75 L 13.109375 -9.140625 C 13.109375 -7.796875 13.441406 -6.789062 14.109375 -6.125 C 14.785156 -5.457031 15.679688 -5.125 16.796875 -5.125 L 19.40625 -5.125 L 19.40625 0Z"/></g>
              <g transform="translate(193.24, 57.89)"><path d="M 17.21875 0.515625 C 15.050781 0.515625 13.050781 0.160156 11.21875 -0.546875 C 9.394531 -1.253906 7.8125 -2.269531 6.46875 -3.59375 C 5.125 -4.914062 4.082031 -6.492188 3.34375 -8.328125 C 2.613281 -10.171875 2.25 -12.226562 2.25 -14.5 C 2.25 -16.738281 2.613281 -18.773438 3.34375 -20.609375 C 4.082031 -22.453125 5.125 -24.035156 6.46875 -25.359375 C 7.8125 -26.679688 9.394531 -27.695312 11.21875 -28.40625 C 13.050781 -29.113281 15.050781 -29.46875 17.21875 -29.46875 C 19.519531 -29.46875 21.601562 -29.070312 23.46875 -28.28125 C 25.34375 -27.5 26.925781 -26.359375 28.21875 -24.859375 C 29.519531 -23.359375 30.425781 -21.53125 30.9375 -19.375 L 24.78125 -18.578125 C 24.226562 -20.421875 23.273438 -21.8125 21.921875 -22.75 C 20.578125 -23.6875 18.992188 -24.15625 17.171875 -24.15625 C 15.554688 -24.15625 14.125 -23.753906 12.875 -22.953125 C 11.632812 -22.160156 10.65625 -21.039062 9.9375 -19.59375 C 9.21875 -18.144531 8.859375 -16.445312 8.859375 -14.5 C 8.859375 -12.5625 9.21875 -10.863281 9.9375 -9.40625 C 10.65625 -7.945312 11.632812 -6.816406 12.875 -6.015625 C 14.125 -5.222656 15.554688 -4.828125 17.171875 -4.828125 C 18.992188 -4.828125 20.578125 -5.289062 21.921875 -6.21875 C 23.273438 -7.15625 24.226562 -8.539062 24.78125 -10.375 L 30.9375 -9.609375 C 30.425781 -7.460938 29.515625 -5.632812 28.203125 -4.125 C 26.898438 -2.625 25.3125 -1.472656 23.4375 -0.671875 C 21.5625 0.117188 19.488281 0.515625 17.21875 0.515625Z"/></g>
              <g transform="translate(224.83, 57.89)"><path d="M 20.390625 -29.46875 C 22.441406 -29.46875 24.21875 -29.070312 25.71875 -28.28125 C 27.226562 -27.5 28.398438 -26.320312 29.234375 -24.75 C 30.066406 -23.1875 30.484375 -21.222656 30.484375 -18.859375 L 30.484375 0 L 23.8125 0 L 23.8125 -17.71875 C 23.8125 -19.289062 23.546875 -20.535156 23.015625 -21.453125 C 22.492188 -22.367188 21.800781 -23.03125 20.9375 -23.4375 C 20.070312 -23.851562 19.113281 -24.0625 18.0625 -24.0625 C 16.925781 -24.0625 15.835938 -23.820312 14.796875 -23.34375 C 13.765625 -22.863281 12.925781 -22.082031 12.28125 -21 C 11.644531 -19.914062 11.316406 -18.457031 11.296875 -16.625 L 11.296875 0 L 4.6875 0 L 4.6875 -44.171875 L 11.296875 -44.171875 L 11.296875 -25.296875 C 12.273438 -26.609375 13.539062 -27.628906 15.09375 -28.359375 C 16.644531 -29.097656 18.410156 -29.46875 20.390625 -29.46875Z"/></g>
            </g>
          </g>
        </svg>
      </div>

      {/* Tagline */}
      <div
        style={{
          position: "absolute",
          bottom: 700,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: taglineOpacity,
          transform: `translateY(${taglineY}px)`,
          padding: "0 80px",
        }}
      >
        <div
          style={{
            fontFamily: FONT,
            fontSize: 28,
            fontWeight: 500,
            color: "rgba(255,255,255,0.65)",
            lineHeight: 1.4,
          }}
        >
          De slimme buffer tussen jou en incassokosten
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── SCENE 2: THE PROBLEM ───────────────────────────────────
const ProblemScene: React.FC = () => {
  const frame = useCurrentFrame();

  // Dutch government/utility letter cards that pile up then fade
  const letters = [
    { vendor: "Belastingdienst", amount: "€174,00", type: "Aanmaning", color: "#003082", delay: 5 },
    { vendor: "Ziggo", amount: "€89,95", type: "Incasso", color: C.red, delay: 20 },
    { vendor: "Vattenfall", amount: "€234,12", type: "Herinnering", color: C.amber, delay: 35 },
    { vendor: "DUO", amount: "€1.250,00", type: "Deurwaarder", color: C.darkRed, delay: 50 },
  ];

  // After letters pile up, they blur and fade away
  const fadeOutStart = 110;
  const lettersFading = frame > fadeOutStart;
  const globalBlur = lettersFading ? interpolate(frame, [fadeOutStart, fadeOutStart + 40], [0, 20], { extrapolateRight: "clamp" }) : 0;
  const globalFade = lettersFading ? interpolate(frame, [fadeOutStart, fadeOutStart + 40], [1, 0], { extrapolateRight: "clamp" }) : 1;

  const statOpacity = interpolate(frame, [130, 155], [0, 1], { extrapolateRight: "clamp" });
  const statY = interpolate(frame, [130, 155], [50, 0], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const statBlur = interpolate(frame, [130, 150], [6, 0], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: C.navy, justifyContent: "center", alignItems: "center" }}>
      {/* Subtle red stress gradient */}
      <div style={{
        position: "absolute", width: "200%", height: "200%",
        background: `radial-gradient(circle at 50% 40%, ${C.red}12 0%, transparent 60%)`,
        filter: "blur(80px)", opacity: lettersFading ? 1 - globalFade : 0.5,
      }} />

      {/* Pile of official letters */}
      <div style={{ position: "relative", width: 340, height: 500, filter: `blur(${globalBlur}px)`, opacity: globalFade }}>
        {letters.map((l, i) => {
          const enterOpacity = interpolate(frame, [l.delay, l.delay + 12], [0, 1], { extrapolateRight: "clamp" });
          const enterY = interpolate(frame, [l.delay, l.delay + 18], [-80, 0], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
          const enterScale = interpolate(frame, [l.delay, l.delay + 15], [1.1, 1], { extrapolateRight: "clamp" });
          const rotate = (i - 1.5) * 4 + Math.sin(frame * 0.03 + i) * 1.5;

          return (
            <div
              key={i}
              style={{
                position: "absolute",
                top: i * 30 + 40,
                left: 20 + i * 8,
                width: 280,
                background: "#FFFFFF",
                borderRadius: 8,
                padding: "20px 22px",
                boxShadow: `0 8px 30px rgba(0,0,0,0.15), inset 0 0 0 1px ${l.color}30`,
                opacity: enterOpacity,
                transform: `translateY(${enterY}px) scale(${enterScale}) rotate(${rotate}deg)`,
                zIndex: 10 - i,
              }}
            >
              {/* Blue government stripe on Belastingdienst */}
              {l.vendor === "Belastingdienst" && (
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: "#003082", borderRadius: "8px 8px 0 0" }} />
              )}
              <div style={{ fontFamily: FONT, fontSize: 9, fontWeight: 600, color: l.color, textTransform: "uppercase" as const, letterSpacing: 1, marginBottom: 6 }}>
                {l.type}
              </div>
              <div style={{ fontFamily: FONT, fontSize: 16, fontWeight: 700, color: C.navy }}>{l.vendor}</div>
              <div style={{ fontFamily: FONT, fontSize: 24, fontWeight: 800, color: C.text, marginTop: 6 }}>{l.amount}</div>
              <div style={{ fontFamily: FONT, fontSize: 10, color: C.muted, marginTop: 4 }}>Betaal binnen 14 dagen</div>
            </div>
          );
        })}
      </div>

      {/* Stat text — appears as letters fade */}
      <div
        style={{
          position: "absolute",
          bottom: 300,
          left: 0, right: 0,
          textAlign: "center",
          opacity: statOpacity,
          transform: `translateY(${statY}px)`,
          filter: `blur(${statBlur}px)`,
          padding: "0 60px",
        }}
      >
        <div style={{ fontFamily: FONT, fontSize: 38, fontWeight: 800, color: "#fff", lineHeight: 1.3 }}>
          3.1 miljoen huishoudens
        </div>
        <div style={{ fontFamily: FONT, fontSize: 22, fontWeight: 500, color: "rgba(255,255,255,0.5)", marginTop: 12 }}>
          kampen met schulden in Nederland
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── SCENE 3: DASHBOARD ─────────────────────────────────────
const DashboardScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const phoneX = spring({ frame, fps, config: { damping: 14, stiffness: 100 }, from: 600, to: 0 });
  const phoneRotateY = interpolate(Math.sin(frame * 0.02), [-1, 1], [-2, 2]);
  const income = useCounter(463716, 30, 50);
  const expenses = useCounter(475983, 35, 50);
  const net = useCounter(12267, 40, 50);
  const vrij = useCounter(4100, 60, 40);
  const open = useCounter(57400, 70, 40);

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg, justifyContent: "center", alignItems: "center" }}>
      <div style={{ transform: `translateX(${phoneX}px)` }}>
        <PhoneMockup rotateY={phoneRotateY} scale={1.15}>
          <div style={{ padding: "50px 16px 100px", height: "100%", overflow: "hidden" }}>
            {/* Topbar */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, ...useFadeSlide(5) }}>
              <span style={{ fontFamily: FONT, fontSize: 18, fontWeight: 800, color: C.navy }}>Paywatch</span>
              <div style={{ display: "flex", gap: 8 }}>
                {[1, 2, 3].map((i) => (
                  <div key={i} style={{ width: 24, height: 24, borderRadius: 6, background: C.border, position: "relative" }}>
                    {i === 3 && <div style={{ position: "absolute", top: -3, right: -3, width: 10, height: 10, background: C.red, borderRadius: 5, border: "2px solid " + C.card }} />}
                  </div>
                ))}
              </div>
            </div>

            {/* Financieel inzicht card */}
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 14, marginBottom: 12, ...useFadeSlide(15) }}>
              <div style={{ fontFamily: FONT, fontSize: 11, fontWeight: 600, color: C.muted, marginBottom: 10 }}>Financieel inzicht</div>
              <div style={{ display: "flex", gap: 8 }}>
                {[
                  { label: "Bank inkomen", value: formatEuro(income), color: C.green },
                  { label: "Bank uitgaven", value: formatEuro(expenses), color: C.red },
                  { label: "Netto", value: `↘ ${formatEuro(net)}`, color: C.red },
                ].map((item, i) => (
                  <div key={i} style={{ flex: 1, background: C.bg, borderRadius: 8, padding: "8px 10px" }}>
                    <div style={{ fontFamily: FONT, fontSize: 10, color: C.muted }}>{item.label}</div>
                    <div style={{ fontFamily: FONT, fontSize: 14, fontWeight: 700, color: item.color, marginTop: 2 }}>{item.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tab toggle */}
            <div style={{ display: "flex", background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 3, marginBottom: 12, ...useFadeSlide(25) }}>
              <div style={{ flex: 1, background: C.blueTint, borderRadius: 9, padding: 8, textAlign: "center" }}>
                <span style={{ fontFamily: FONT, fontSize: 12, fontWeight: 600, color: C.blue }}>Overzicht</span>
              </div>
              <div style={{ flex: 1, padding: 8, textAlign: "center" }}>
                <span style={{ fontFamily: FONT, fontSize: 12, color: C.muted }}>AI Inzicht</span>
              </div>
            </div>

            {/* Vrij besteedbaar */}
            <div style={{ background: C.card, border: `2px solid ${C.amber}40`, borderRadius: 14, padding: 14, marginBottom: 12, ...useFadeSlide(35) }}>
              <div style={{ fontFamily: FONT, fontSize: 11, fontWeight: 600, color: C.text }}>Vrij besteedbaar deze maand</div>
              <div style={{ fontFamily: FONT, fontSize: 36, fontWeight: 800, color: C.navy, marginTop: 4, letterSpacing: -1 }}>{formatEuro(vrij)}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 8 }}>
                <div style={{ fontFamily: FONT, fontSize: 11, color: C.muted, display: "flex", justifyContent: "space-between" }}>
                  <span>Inkomen</span><span>€2.400,00</span>
                </div>
                <div style={{ fontFamily: FONT, fontSize: 11, color: C.muted, display: "flex", justifyContent: "space-between" }}>
                  <span>Vaste lasten (8)</span><span>-€1.785,00</span>
                </div>
                <div style={{ fontFamily: FONT, fontSize: 11, color: C.red, display: "flex", justifyContent: "space-between" }}>
                  <span>Open rekeningen (2)</span><span>-€574,00</span>
                </div>
              </div>
              <div style={{ marginTop: 8, background: `${C.amber}15`, padding: "4px 10px", borderRadius: 4, display: "inline-flex", alignItems: "center", gap: 4 }}>
                <span style={{ fontFamily: FONT, fontSize: 10, fontWeight: 600, color: C.amber }}>⚠ 1 vaste last in incasso</span>
              </div>
            </div>

            {/* Stats grid */}
            <div style={{ display: "flex", gap: 10, ...useFadeSlide(50) }}>
              <div style={{ flex: 1, background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 14 }}>
                <div style={{ fontFamily: FONT, fontSize: 10, color: C.muted }}>Openstaand</div>
                <div style={{ fontFamily: FONT, fontSize: 26, fontWeight: 800, color: C.navy, marginTop: 4 }}>{formatEuro(open)}</div>
                <div style={{ fontFamily: FONT, fontSize: 10, color: C.muted, marginTop: 2 }}>2 rekeningen</div>
              </div>
              <div style={{ flex: 1, background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 14 }}>
                <div style={{ fontFamily: FONT, fontSize: 10, color: C.red }}>Achterstallig</div>
                <div style={{ fontFamily: FONT, fontSize: 26, fontWeight: 800, color: C.red, marginTop: 4 }}>2</div>
                <div style={{ fontFamily: FONT, fontSize: 10, color: C.muted, marginTop: 2 }}>Direct betalen</div>
              </div>
            </div>
          </div>
          <BottomTabBar active="overzicht" />
        </PhoneMockup>
      </div>
    </AbsoluteFill>
  );
};

// ─── SCENE 4: BILL DETAIL ───────────────────────────────────
const BillDetailScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const drawerY = spring({ frame, fps, config: { damping: 14, stiffness: 80 }, from: 500, to: 0 });

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg, justifyContent: "center", alignItems: "center" }}>
      <PhoneMockup rotateY={-2} scale={1.15}>
        <div style={{ height: "100%", position: "relative" }}>
          {/* Background list */}
          <div style={{ padding: "50px 16px", opacity: 0.3 }}>
            <div style={{ fontFamily: FONT, fontSize: 16, fontWeight: 700, color: C.navy }}>Betalingen</div>
          </div>

          {/* Bill drawer */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              background: C.card,
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              boxShadow: "0 -8px 30px rgba(0,0,0,0.12)",
              transform: `translateY(${drawerY}px)`,
              height: 620,
            }}
          >
            {/* Drag handle */}
            <div style={{ width: 40, height: 4, background: C.border, borderRadius: 2, margin: "10px auto 0" }} />

            {/* Dark header */}
            <div style={{ background: C.navy, margin: "12px 12px 0", borderRadius: 16, padding: 20, ...useFadeSlide(15) }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontFamily: FONT, fontSize: 16, color: "#fff" }}>🏛</span>
                  </div>
                  <span style={{ fontFamily: FONT, fontSize: 16, fontWeight: 700, color: "#fff" }}>Belastingdienst</span>
                </div>
                <div style={{ background: "rgba(255,255,255,0.2)", borderRadius: 4, padding: "3px 8px" }}>
                  <span style={{ fontFamily: FONT, fontSize: 9, fontWeight: 600, color: "#fff" }}>PRIORITEIT</span>
                </div>
              </div>
              <div style={{ fontFamily: FONT, fontSize: 36, fontWeight: 800, color: "#fff", letterSpacing: -1 }}>€174,00</div>
              <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
                <div style={{ background: `${C.orange}30`, borderRadius: 4, padding: "2px 8px" }}>
                  <span style={{ fontFamily: FONT, fontSize: 10, fontWeight: 600, color: C.orange }}>Aanmaning</span>
                </div>
                <div style={{ background: `${C.red}30`, borderRadius: 4, padding: "2px 8px" }}>
                  <span style={{ fontFamily: FONT, fontSize: 10, fontWeight: 600, color: C.red }}>Achterstallig</span>
                </div>
              </div>
              {/* Progress bar */}
              <div style={{ marginTop: 12, ...useFadeSlide(30) }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontFamily: FONT, fontSize: 11, color: "rgba(255,255,255,0.6)" }}>Betalingsregeling</span>
                  <span style={{ fontFamily: FONT, fontSize: 11, fontWeight: 600, color: "#fff" }}>1/3</span>
                </div>
                <div style={{ width: "100%", height: 6, background: "rgba(255,255,255,0.15)", borderRadius: 3, marginTop: 6 }}>
                  <div style={{ width: "33%", height: "100%", background: C.blue, borderRadius: 3 }} />
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div style={{ display: "flex", margin: "12px 12px", background: C.bg, borderRadius: 10, padding: 3, ...useFadeSlide(40) }}>
              {["Details", "Escalatie", "Acties", "Regeling"].map((t, i) => (
                <div key={t} style={{ flex: 1, padding: 8, textAlign: "center", background: i === 0 ? C.card : "transparent", borderRadius: 7 }}>
                  <span style={{ fontFamily: FONT, fontSize: 11, fontWeight: i === 0 ? 600 : 400, color: i === 0 ? C.navy : C.muted }}>{t}</span>
                </div>
              ))}
            </div>

            {/* Detail rows */}
            <div style={{ padding: "0 16px" }}>
              {[
                { label: "Vervaldatum", value: "donderdag 30 april 2026" },
                { label: "Ontvangstdatum", value: "25 maart 2026" },
                { label: "Categorie", value: "Overheid" },
                { label: "Bron", value: "Camera scan" },
              ].map((row, i) => (
                <div key={i} style={{ background: C.bg, borderRadius: 12, padding: "10px 14px", marginBottom: 8, ...useFadeSlide(50 + i * 8) }}>
                  <div style={{ fontFamily: FONT, fontSize: 10, color: C.muted }}>{row.label}</div>
                  <div style={{ fontFamily: FONT, fontSize: 13, fontWeight: 600, color: C.text, marginTop: 2 }}>{row.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </PhoneMockup>
    </AbsoluteFill>
  );
};

// ─── SCENE 5: PAYBUDDY VOICE CALL (HERO) ────────────────────
const VoiceCallScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const phase = Math.floor(frame / 75); // ~2.5s per phase

  // Orb animation
  const orbScale = 1 + Math.sin(frame * 0.06) * 0.04;
  const ring1 = (frame % 90) / 90;
  const ring2 = ((frame + 45) % 90) / 90;

  const messages: { from: string; text: string; startFrame: number }[] = [
    { from: "paybuddy", text: "Hoi! Fijn dat je belt. Waar kan ik je mee helpen?", startFrame: 30 },
    { from: "user", text: "Ik heb een brief, kun je meekijken?", startFrame: 100 },
    { from: "paybuddy", text: "Natuurlijk, ik open de camera...", startFrame: 170 },
    { from: "paybuddy", text: "Dit is een aanmaning van Ziggo voor negenentachtig euro en vijfennegentig cent. De vervaldatum is vijftien mei.", startFrame: 310 },
    { from: "paybuddy", text: "Wil je deze toevoegen?", startFrame: 400 },
    { from: "user", text: "Ja, doe maar.", startFrame: 440 },
    { from: "paybuddy", text: "Top, de rekening staat erin!", startFrame: 480 },
  ];

  // Find the last 2 visible messages
  const visibleMsgs = messages.filter((m) => frame >= m.startFrame).slice(-2);
  const showCamera = frame >= 200 && frame < 280;
  const showProcessing = frame >= 280 && frame < 310;

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg, justifyContent: "center", alignItems: "center" }}>
      <PhoneMockup scale={1.15}>
        <div style={{ width: "100%", height: "100%", background: "#0A1628", position: "relative" }}>
          {/* Orb */}
          <div
            style={{
              position: "absolute",
              top: "28%",
              left: "50%",
              transform: `translate(-50%, -50%) scale(${orbScale})`,
              width: 160,
              height: 160,
            }}
          >
            {/* Outer ring 1 */}
            <div
              style={{
                position: "absolute",
                inset: -20,
                borderRadius: "50%",
                border: `2px solid ${C.green}`,
                opacity: 1 - ring1,
                transform: `scale(${1 + ring1 * 0.4})`,
              }}
            />
            {/* Outer ring 2 */}
            <div
              style={{
                position: "absolute",
                inset: -20,
                borderRadius: "50%",
                border: `2px solid ${C.purple}`,
                opacity: 1 - ring2,
                transform: `scale(${1 + ring2 * 0.4})`,
              }}
            />
            {/* Middle ring */}
            <div
              style={{
                position: "absolute",
                inset: 10,
                borderRadius: "50%",
                background: `linear-gradient(135deg, ${C.green}40, ${C.purple}30)`,
              }}
            />
            {/* Core orb */}
            <div
              style={{
                position: "absolute",
                inset: 30,
                borderRadius: "50%",
                background: `radial-gradient(circle at 35% 35%, #5EEAD4, #14B8A6, #0D9488)`,
                boxShadow: `0 0 60px ${C.green}60, 0 0 120px ${C.green}20`,
              }}
            />
            {/* Floating particles */}
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: 80 + Math.cos((frame * 0.03 + i) * 1.2) * 90,
                  top: 80 + Math.sin((frame * 0.04 + i) * 0.9) * 90,
                  width: 4,
                  height: 4,
                  borderRadius: 2,
                  background: C.green,
                  opacity: 0.3 + Math.sin(frame * 0.1 + i) * 0.3,
                }}
              />
            ))}
          </div>

          {/* Label */}
          <div style={{ position: "absolute", top: "50%", left: 0, right: 0, textAlign: "center" }}>
            <div style={{ fontFamily: FONT, fontSize: 20, fontWeight: 700, color: "#fff" }}>PayBuddy</div>
            <div style={{ fontFamily: FONT, fontSize: 12, color: C.muted, marginTop: 4 }}>
              {showProcessing ? "Foto analyseren..." : phase < 1 ? "Verbinden..." : "Aan het praten"}
            </div>
          </div>

          {/* Camera overlay */}
          {showCamera && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "rgba(0,0,0,0.85)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: 24,
                zIndex: 20,
              }}
            >
              <div style={{ width: 240, height: 180, borderRadius: 16, border: `2px dashed ${C.blue}`, background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontFamily: FONT, fontSize: 28, marginBottom: 4 }}>📸</div>
                  <div style={{ fontFamily: FONT, fontSize: 12, color: "rgba(255,255,255,0.7)" }}>Maak een foto van je rekening</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 12, width: "80%" }}>
                <div style={{ flex: 1, background: C.blue, borderRadius: 10, padding: "12px 0", textAlign: "center" }}>
                  <span style={{ fontFamily: FONT, fontSize: 13, fontWeight: 600, color: "#fff" }}>Camera</span>
                </div>
                <div style={{ flex: 1, background: "rgba(255,255,255,0.15)", borderRadius: 10, padding: "12px 0", textAlign: "center" }}>
                  <span style={{ fontFamily: FONT, fontSize: 13, fontWeight: 600, color: "#fff" }}>Galerij</span>
                </div>
              </div>
            </div>
          )}

          {/* Processing */}
          {showProcessing && (
            <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 20 }}>
              <div style={{ width: 40, height: 40, border: `3px solid rgba(255,255,255,0.2)`, borderTopColor: C.blue, borderRadius: "50%", transform: `rotate(${frame * 8}deg)` }} />
            </div>
          )}

          {/* Message bubbles */}
          <div style={{ position: "absolute", bottom: 100, left: 16, right: 16, display: "flex", flexDirection: "column", gap: 8, zIndex: 15 }}>
            {visibleMsgs.map((m, i) => {
              const msgOpacity = interpolate(frame, [m.startFrame, m.startFrame + 15], [0, 1], { extrapolateRight: "clamp" });
              const msgY = interpolate(frame, [m.startFrame, m.startFrame + 15], [20, 0], { extrapolateRight: "clamp" });
              return (
                <div
                  key={m.startFrame}
                  style={{
                    alignSelf: m.from === "user" ? "flex-end" : "flex-start",
                    maxWidth: "85%",
                    background: m.from === "user" ? C.blue : "rgba(255,255,255,0.12)",
                    borderRadius: m.from === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
                    padding: "10px 14px",
                    opacity: msgOpacity,
                    transform: `translateY(${msgY}px)`,
                    backdropFilter: "blur(8px)",
                  }}
                >
                  <div style={{ fontFamily: FONT, fontSize: 9, fontWeight: 700, color: m.from === "user" ? "rgba(255,255,255,0.6)" : C.muted, marginBottom: 3, textTransform: "uppercase" as const }}>
                    {m.from === "user" ? "Jij" : "PayBuddy"}
                  </div>
                  <div style={{ fontFamily: FONT, fontSize: 12, color: "#fff", lineHeight: 1.45 }}>{m.text}</div>
                </div>
              );
            })}
          </div>

          {/* Controls */}
          <div style={{ position: "absolute", bottom: 30, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 20 }}>
            <div style={{ width: 48, height: 48, borderRadius: 24, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 18 }}>📷</span>
            </div>
            <div style={{ width: 56, height: 56, borderRadius: 28, background: C.red, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 20, color: "#fff", transform: "rotate(135deg)" }}>📞</span>
            </div>
          </div>
        </div>
      </PhoneMockup>
    </AbsoluteFill>
  );
};

// ─── SCENE 6: WIK SHIELD ────────────────────────────────────
const WikShieldScene: React.FC = () => {
  const frame = useCurrentFrame();
  const saved = useCounter(4000, 80, 30);
  const alertSlide = useFadeSlide(40);
  const shieldSlide = useFadeSlide(80);
  const letterSlide = useFadeSlide(120);

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg, justifyContent: "center", alignItems: "center" }}>
      <PhoneMockup scale={1.15}>
        <div style={{ padding: "50px 16px", height: "100%", overflow: "hidden" }}>
          <div style={{ fontFamily: FONT, fontSize: 18, fontWeight: 700, color: C.navy, marginBottom: 16, ...useFadeSlide(5) }}>WIK Shield</div>

          {/* Bill card */}
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 16, marginBottom: 14, ...useFadeSlide(10) }}>
            <div style={{ fontFamily: FONT, fontSize: 13, fontWeight: 600, color: C.text }}>Incassobureau De Jong</div>
            <div style={{ fontFamily: FONT, fontSize: 10, color: C.muted, marginTop: 4 }}>Oorspronkelijk: €200,00</div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
              <div>
                <div style={{ fontFamily: FONT, fontSize: 10, color: C.muted }}>Gevraagde kosten</div>
                <div style={{ fontFamily: FONT, fontSize: 24, fontWeight: 800, color: C.red }}>€80,00</div>
              </div>
              <div>
                <div style={{ fontFamily: FONT, fontSize: 10, color: C.muted }}>Wettelijk max</div>
                <div style={{ fontFamily: FONT, fontSize: 24, fontWeight: 800, color: C.green }}>€40,00</div>
              </div>
            </div>
          </div>

          {/* Alert */}
          <div style={{ background: C.redLight, border: `1px solid ${C.red}40`, borderRadius: 14, padding: 14, marginBottom: 14, ...alertSlide }}>
            <div style={{ fontFamily: FONT, fontSize: 14, fontWeight: 700, color: C.red }}>⚠ Te hoog!</div>
            <div style={{ fontFamily: FONT, fontSize: 12, color: C.text, marginTop: 4 }}>Wettelijk mogen ze maar €40 rekenen. Je betaalt €40 teveel.</div>
          </div>

          {/* Shield activated */}
          <div style={{ background: C.greenLight, border: `1px solid ${C.green}40`, borderRadius: 14, padding: 14, marginBottom: 14, textAlign: "center", ...shieldSlide }}>
            <div style={{ fontSize: 36, marginBottom: 6 }}>🛡️</div>
            <div style={{ fontFamily: FONT, fontSize: 14, fontWeight: 700, color: C.green }}>WIK Shield geactiveerd</div>
            <div style={{ fontFamily: FONT, fontSize: 28, fontWeight: 800, color: C.green, marginTop: 8 }}>+{formatEuro(saved)}</div>
            <div style={{ fontFamily: FONT, fontSize: 11, color: C.muted, marginTop: 2 }}>bespaard</div>
          </div>

          {/* Letter generation */}
          <div style={{ background: C.blue, borderRadius: 10, padding: "14px 0", textAlign: "center", ...letterSlide }}>
            <span style={{ fontFamily: FONT, fontSize: 13, fontWeight: 600, color: "#fff" }}>Bezwaarbrief gegenereerd →</span>
          </div>
        </div>
      </PhoneMockup>
    </AbsoluteFill>
  );
};

// ─── SCENE 7: FINANCIAL OVERVIEW ────────────────────────────
const FinancialScene: React.FC = () => {
  const frame = useCurrentFrame();
  const total = useCounter(70517, 60, 40);

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg, justifyContent: "center", alignItems: "center" }}>
      <PhoneMockup rotateY={2} scale={1.15}>
        <div style={{ padding: "50px 16px", height: "100%", overflow: "hidden" }}>
          <div style={{ fontFamily: FONT, fontSize: 16, fontWeight: 700, color: C.navy, marginBottom: 14, ...useFadeSlide(5) }}>Toeslagen Check</div>

          {/* Toeslagen items */}
          {[
            { name: "Huurtoeslag", amount: "+€484,17/mnd", color: C.green },
            { name: "Zorgtoeslag", amount: "+€221,00/mnd", color: C.green, warning: "Mogelijk €1.779 te veel" },
            { name: "Kinderopvangtoeslag", amount: "€500,00/mnd", color: C.text },
          ].map((t, i) => (
            <div key={i} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 14, marginBottom: 10, ...useFadeSlide(15 + i * 12) }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontFamily: FONT, fontSize: 14, fontWeight: 600, color: C.text }}>{t.name}</div>
                <div style={{ fontFamily: FONT, fontSize: 16, fontWeight: 700, color: t.color }}>{t.amount}</div>
              </div>
              {t.warning && (
                <div style={{ fontFamily: FONT, fontSize: 10, color: C.amber, marginTop: 4, background: C.amberLight, padding: "3px 8px", borderRadius: 4, display: "inline-block" }}>
                  ⚠ {t.warning}
                </div>
              )}
            </div>
          ))}

          {/* Total */}
          <div style={{ background: C.greenLight, border: `1px solid ${C.green}40`, borderRadius: 14, padding: 20, textAlign: "center", marginTop: 10, ...useFadeSlide(55) }}>
            <div style={{ fontFamily: FONT, fontSize: 12, color: C.muted }}>Geschat totaal per maand</div>
            <div style={{ fontFamily: FONT, fontSize: 40, fontWeight: 800, color: C.green, marginTop: 4 }}>+{formatEuro(total)}</div>
            <div style={{ fontFamily: FONT, fontSize: 11, color: C.muted, marginTop: 4 }}>Extra inkomen gevonden</div>
          </div>
        </div>
      </PhoneMockup>
    </AbsoluteFill>
  );
};

// ─── SCENE 8: STATS ─────────────────────────────────────────
const StatsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const score = useCounter(38, 20, 50);
  const saved = useCounter(68895, 40, 50);
  const circumference = 2 * Math.PI * 50;
  const dashOffset = circumference * (1 - score / 100);

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg, justifyContent: "center", alignItems: "center" }}>
      <PhoneMockup scale={1.15}>
        <div style={{ padding: "50px 16px", height: "100%", overflow: "hidden" }}>
          <div style={{ fontFamily: FONT, fontSize: 16, fontWeight: 700, color: C.navy, marginBottom: 14, ...useFadeSlide(5) }}>Statistieken</div>

          {/* Health gauge */}
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 20, display: "flex", alignItems: "center", gap: 20, marginBottom: 14, ...useFadeSlide(10) }}>
            <svg width={110} height={110} viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="50" fill="none" stroke={C.border} strokeWidth="10" />
              <circle cx="60" cy="60" r="50" fill="none" stroke={C.red} strokeWidth="10" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={dashOffset} transform="rotate(-90 60 60)" />
              <text x="60" y="55" textAnchor="middle" fill={C.red} fontFamily={FONT} fontWeight="800" fontSize="32">{score}</text>
              <text x="60" y="75" textAnchor="middle" fill={C.muted} fontFamily={FONT} fontWeight="500" fontSize="11">Actie nodig</text>
            </svg>
            <div>
              <div style={{ fontFamily: FONT, fontSize: 14, fontWeight: 700, color: C.text }}>Gezondheid</div>
              <div style={{ fontFamily: FONT, fontSize: 11, color: C.muted, marginTop: 4 }}>Op basis van betaalgedrag en escalaties</div>
            </div>
          </div>

          {/* Stats grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {[
              { label: "Op tijd betaald", value: "50%", sub: "12/24 op tijd", color: C.green, delay: 25 },
              { label: "Streak", value: "0", sub: "op rij op tijd betaald", color: C.navy, delay: 33 },
              { label: "Bespaard", value: formatEuro(saved), sub: "incassokosten vermeden", color: C.green, delay: 41 },
              { label: "Achterstallig", value: "2", sub: "Betaal zo snel mogelijk", color: C.red, delay: 49 },
            ].map((s, i) => (
              <div key={i} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 14, ...useFadeSlide(s.delay) }}>
                <div style={{ fontFamily: FONT, fontSize: 10, color: C.muted }}>{s.label}</div>
                <div style={{ fontFamily: FONT, fontSize: 24, fontWeight: 800, color: s.color, marginTop: 4 }}>{s.value}</div>
                <div style={{ fontFamily: FONT, fontSize: 10, color: C.muted, marginTop: 2 }}>{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
        <BottomTabBar active="stats" />
      </PhoneMockup>
    </AbsoluteFill>
  );
};

// ─── SCENE 9: CLOSING ───────────────────────────────────────
const ClosingScene: React.FC = () => {
  const frame = useCurrentFrame();
  const logoOpacity = interpolate(frame, [0, 40], [0, 1], { extrapolateRight: "clamp" });
  const logoScale = interpolate(frame, [0, 40], [0.85, 1], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const taglineOpacity = interpolate(frame, [40, 70], [0, 1], { extrapolateRight: "clamp" });
  const ctaOpacity = interpolate(frame, [70, 100], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: C.navy, justifyContent: "center", alignItems: "center" }}>
      <div style={{ position: "absolute", width: "200%", height: "200%", background: `radial-gradient(circle at 30% 30%, ${C.blue}15 0%, transparent 50%), radial-gradient(circle at 70% 70%, ${C.purple}15 0%, transparent 50%)`, filter: "blur(100px)" }} />

      <div style={{ textAlign: "center", opacity: logoOpacity, transform: `scale(${logoScale})` }}>
        <div style={{ fontFamily: FONT, fontSize: 72, fontWeight: 800, color: "#fff", letterSpacing: -3 }}>PayWatch</div>
      </div>

      <div style={{ position: "absolute", top: "55%", left: 0, right: 0, textAlign: "center", opacity: taglineOpacity, padding: "0 80px" }}>
        <div style={{ fontFamily: FONT, fontSize: 32, fontWeight: 700, color: "#fff", lineHeight: 1.3 }}>Grip op je rekeningen.</div>
        <div style={{ fontFamily: FONT, fontSize: 28, fontWeight: 500, color: "rgba(255,255,255,0.5)", marginTop: 12 }}>Beschermd tegen te hoge kosten.</div>
      </div>

      <div style={{ position: "absolute", bottom: 280, left: 0, right: 0, textAlign: "center", opacity: ctaOpacity }}>
        <div style={{ display: "inline-block", background: C.blue, borderRadius: 12, padding: "16px 40px" }}>
          <span style={{ fontFamily: FONT, fontSize: 18, fontWeight: 600, color: "#fff" }}>Download nu gratis</span>
        </div>
        <div style={{ fontFamily: FONT, fontSize: 16, color: "rgba(255,255,255,0.4)", marginTop: 16 }}>paywatch.app</div>
      </div>
    </AbsoluteFill>
  );
};

// ─── MAIN COMPOSITION ────────────────────────────────────────
export const PayWatchDemo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      {/* Scene 1: Hero (0-4s) */}
      <Sequence from={0} durationInFrames={120}>
        <HeroScene />
      </Sequence>

      {/* Scene 2: Problem (4-10s) */}
      <Sequence from={120} durationInFrames={180}>
        <ProblemScene />
      </Sequence>

      {/* Scene 3: Dashboard (10-20s) */}
      <Sequence from={300} durationInFrames={300}>
        <DashboardScene />
      </Sequence>

      {/* Scene 4: Bill Detail (20-28s) */}
      <Sequence from={600} durationInFrames={240}>
        <BillDetailScene />
      </Sequence>

      {/* Scene 5: Voice Call HERO (28-46s) */}
      <Sequence from={840} durationInFrames={540}>
        <VoiceCallScene />
      </Sequence>

      {/* Scene 6: WIK Shield (46-54s) */}
      <Sequence from={1380} durationInFrames={240}>
        <WikShieldScene />
      </Sequence>

      {/* Scene 7: Financial / Toeslagen (54-62s) */}
      <Sequence from={1620} durationInFrames={240}>
        <FinancialScene />
      </Sequence>

      {/* Scene 8: Stats (62-70s) */}
      <Sequence from={1860} durationInFrames={240}>
        <StatsScene />
      </Sequence>

      {/* Scene 9: Closing (70-90s) */}
      <Sequence from={2100} durationInFrames={600}>
        <ClosingScene />
      </Sequence>
    </AbsoluteFill>
  );
};
