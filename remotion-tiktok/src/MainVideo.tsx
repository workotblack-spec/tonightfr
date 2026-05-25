import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Sequence, Img, staticFile, Series } from "remotion";
import { loadFont as loadBebas } from "@remotion/google-fonts/BebasNeue";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadSpace } from "@remotion/google-fonts/SpaceGrotesk";

const bebas = loadBebas("normal", { weights: ["400"], subsets: ["latin"] });
const inter = loadInter("normal", { weights: ["400", "600", "800"], subsets: ["latin"] });
const space = loadSpace("normal", { weights: ["500", "700"], subsets: ["latin"] });

const FONT_DISPLAY = bebas.fontFamily;
const FONT_BODY = inter.fontFamily;
const FONT_MONO = space.fontFamily;

const PINK = "#ff2db8";
const PURPLE = "#a855f7";
const CYAN = "#22d3ee";
const GOLD = "#fbbf24";
const BG = "#07060f";

// ============ PERSISTENT BACKGROUND ============
const NoiseBg: React.FC = () => {
  const frame = useCurrentFrame();
  const drift = Math.sin(frame / 40) * 30;
  return (
    <AbsoluteFill style={{ background: BG, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          inset: -100,
          background: `radial-gradient(60% 50% at ${50 + drift}% 30%, ${PINK}22, transparent 70%), radial-gradient(50% 40% at ${50 - drift}% 80%, ${PURPLE}33, transparent 70%)`,
        }}
      />
      {/* grain */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.08,
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "3px 3px",
          mixBlendMode: "overlay",
        }}
      />
    </AbsoluteFill>
  );
};

// ============ SCENE 1: HOOK ============
const Scene1: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const heroScale = interpolate(frame, [0, 90], [1.15, 1.3]);
  const overlayOp = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const t1 = spring({ frame: frame - 10, fps, config: { damping: 18, stiffness: 140 } });
  const t2 = spring({ frame: frame - 28, fps, config: { damping: 18, stiffness: 140 } });
  const t3 = spring({ frame: frame - 46, fps, config: { damping: 14, stiffness: 120 } });
  const exitOp = interpolate(frame, [78, 90], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ opacity: exitOp }}>
      <Img
        src={staticFile("images/hero.jpg")}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${heroScale})`,
          filter: "saturate(1.2) contrast(1.1)",
        }}
      />
      <AbsoluteFill
        style={{
          background: `linear-gradient(180deg, ${BG}cc 0%, ${BG}55 40%, ${BG}ee 100%)`,
          opacity: overlayOp,
        }}
      />
      <AbsoluteFill style={{ padding: "180px 70px", justifyContent: "flex-start" }}>
        <div
          style={{
            display: "inline-flex",
            alignSelf: "flex-start",
            gap: 14,
            alignItems: "center",
            padding: "14px 26px",
            borderRadius: 999,
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.18)",
            backdropFilter: "none",
            opacity: t1,
            transform: `translateY(${(1 - t1) * 20}px)`,
            fontFamily: FONT_MONO,
            fontWeight: 700,
            fontSize: 28,
            color: "#fff",
            letterSpacing: 2,
          }}
        >
          <span style={{ width: 14, height: 14, borderRadius: 999, background: PINK, boxShadow: `0 0 24px ${PINK}` }} />
          LIVE · FRIBOURG
        </div>
        <div
          style={{
            marginTop: 60,
            fontFamily: FONT_DISPLAY,
            fontSize: 240,
            lineHeight: 0.88,
            color: "#fff",
            letterSpacing: -2,
            opacity: t2,
            transform: `translateY(${(1 - t2) * 40}px)`,
          }}
        >
          CE SOIR<br />ON FAIT<br />QUOI ?
        </div>
        <div
          style={{
            marginTop: 50,
            fontFamily: FONT_BODY,
            fontWeight: 600,
            fontSize: 44,
            color: "rgba(255,255,255,0.85)",
            opacity: t3,
            transform: `translateY(${(1 - t3) * 20}px)`,
            maxWidth: 800,
          }}
        >
          Toutes les soirées de Fribourg.<br />En un seul scroll.
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ============ FLYER COMPONENT ============
type FlyerProps = {
  badge: string;
  badgeColor: string;
  title: string;
  venue: string;
  date: string;
  time: string;
  category: string;
  gradient: string;
};

const Flyer: React.FC<FlyerProps & { progress: number }> = ({ badge, badgeColor, title, venue, date, time, category, gradient, progress }) => {
  return (
    <div
      style={{
        width: 820,
        height: 1180,
        borderRadius: 48,
        background: gradient,
        position: "relative",
        overflow: "hidden",
        boxShadow: `0 40px 120px ${badgeColor}55, 0 0 0 2px rgba(255,255,255,0.1) inset`,
        transform: `perspective(1400px) rotateY(${(1 - progress) * -20}deg) rotateX(${(1 - progress) * 8}deg)`,
      }}
    >
      {/* Texture overlay */}
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(80% 60% at 30% 20%, rgba(255,255,255,0.18), transparent 60%)" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.5) 100%)" }} />

      {/* Badge */}
      <div style={{ position: "absolute", top: 50, left: 50, display: "flex", gap: 14, alignItems: "center" }}>
        <div
          style={{
            padding: "12px 24px",
            borderRadius: 999,
            background: "#000",
            color: badgeColor,
            fontFamily: FONT_MONO,
            fontWeight: 700,
            fontSize: 26,
            letterSpacing: 3,
          }}
        >
          {badge}
        </div>
      </div>

      {/* Category mark */}
      <div
        style={{
          position: "absolute",
          top: 60,
          right: 60,
          fontFamily: FONT_MONO,
          fontWeight: 500,
          fontSize: 24,
          letterSpacing: 4,
          color: "rgba(255,255,255,0.85)",
          textTransform: "uppercase",
        }}
      >
        {category}
      </div>

      {/* Title */}
      <div
        style={{
          position: "absolute",
          left: 50,
          right: 50,
          bottom: 280,
          fontFamily: FONT_DISPLAY,
          fontSize: 180,
          lineHeight: 0.88,
          color: "#fff",
          letterSpacing: -1,
          textShadow: "0 4px 24px rgba(0,0,0,0.4)",
        }}
      >
        {title}
      </div>

      {/* Venue + date */}
      <div style={{ position: "absolute", left: 50, right: 50, bottom: 60, color: "#fff" }}>
        <div style={{ fontFamily: FONT_BODY, fontWeight: 800, fontSize: 42, marginBottom: 14 }}>
          {venue}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: FONT_MONO, fontSize: 30, fontWeight: 500, opacity: 0.92 }}>
          <span>{date}</span>
          <span style={{ padding: "8px 18px", background: "rgba(0,0,0,0.4)", borderRadius: 12 }}>{time}</span>
        </div>
      </div>
    </div>
  );
};

// ============ SCENES 2/3/4: FLYERS ============
const FlyerScene: React.FC<{ flyer: FlyerProps; phoneLabel: string }> = ({ flyer, phoneLabel }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 16, stiffness: 90 } });
  const exit = interpolate(frame, [78, 90], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ty = interpolate(enter, [0, 1], [120, 0]) + exit * -200;
  const op = interpolate(enter, [0, 1], [0, 1]) * (1 - exit);

  const labelEnter = spring({ frame: frame - 8, fps, config: { damping: 20 } });
  const stamp = spring({ frame: frame - 18, fps, config: { damping: 6, stiffness: 180, mass: 0.8 } });

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      {/* Top label */}
      <div
        style={{
          position: "absolute",
          top: 130,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: FONT_DISPLAY,
          fontSize: 90,
          color: "#fff",
          letterSpacing: 4,
          opacity: labelEnter * (1 - exit),
          transform: `translateY(${(1 - labelEnter) * -30}px)`,
        }}
      >
        {phoneLabel}
      </div>

      <div style={{ transform: `translateY(${ty}px)`, opacity: op }}>
        <Flyer {...flyer} progress={enter} />
      </div>

      {/* "Sponsorisé" stamp */}
      <div
        style={{
          position: "absolute",
          top: 360,
          right: 80,
          padding: "14px 28px",
          background: GOLD,
          color: "#1a1100",
          fontFamily: FONT_MONO,
          fontWeight: 700,
          fontSize: 28,
          letterSpacing: 3,
          borderRadius: 8,
          transform: `rotate(${interpolate(stamp, [0, 1], [-30, 8])}deg) scale(${stamp})`,
          opacity: stamp * (1 - exit),
          boxShadow: `0 12px 40px ${GOLD}66`,
        }}
      >
        ★ TÊTE DE LISTE
      </div>
    </AbsoluteFill>
  );
};

// ============ SCENE 5: CTA ============
const CTAScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const logoSpring = spring({ frame, fps, config: { damping: 12, stiffness: 90 } });
  const t1 = spring({ frame: frame - 18, fps, config: { damping: 18 } });
  const t2 = spring({ frame: frame - 36, fps, config: { damping: 18 } });
  const t3 = spring({ frame: frame - 54, fps, config: { damping: 14, stiffness: 120 } });
  const pulse = 1 + Math.sin(frame / 6) * 0.04;

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: 80 }}>
      <div style={{ transform: `scale(${logoSpring * pulse})`, marginBottom: 40 }}>
        <Img
          src={staticFile("images/logo.png")}
          style={{ width: 280, height: 280, filter: `drop-shadow(0 0 60px ${PINK})` }}
        />
      </div>

      <div
        style={{
          fontFamily: FONT_DISPLAY,
          fontSize: 220,
          lineHeight: 0.9,
          textAlign: "center",
          letterSpacing: -2,
          background: `linear-gradient(135deg, #fff 0%, ${PINK} 50%, ${PURPLE} 100%)`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          opacity: t1,
          transform: `translateY(${(1 - t1) * 30}px)`,
        }}
      >
        TONIGHT<br />.FR
      </div>

      <div
        style={{
          marginTop: 30,
          fontFamily: FONT_BODY,
          fontWeight: 600,
          fontSize: 42,
          color: "rgba(255,255,255,0.85)",
          textAlign: "center",
          opacity: t2,
          transform: `translateY(${(1 - t2) * 20}px)`,
        }}
      >
        Ouvre l'app. Choisis ta soirée.
      </div>

      <div
        style={{
          marginTop: 80,
          padding: "30px 60px",
          borderRadius: 999,
          background: `linear-gradient(90deg, ${PINK}, ${PURPLE})`,
          color: "#fff",
          fontFamily: FONT_BODY,
          fontWeight: 800,
          fontSize: 48,
          letterSpacing: 1,
          opacity: t3,
          transform: `scale(${0.8 + t3 * 0.2})`,
          boxShadow: `0 20px 60px ${PINK}88`,
        }}
      >
        tonightfr.lovable.app
      </div>
    </AbsoluteFill>
  );
};

// ============ MAIN ============
export const MainVideo: React.FC = () => {
  return (
    <AbsoluteFill>
      <NoiseBg />
      <Series>
        <Series.Sequence durationInFrames={90}>
          <Scene1 />
        </Series.Sequence>
        <Series.Sequence durationInFrames={90}>
          <FlyerScene
            phoneLabel="CONCERT"
            flyer={{
              badge: "20H30",
              badgeColor: PINK,
              category: "Live music",
              title: "NEON\nNIGHTS",
              venue: "Fri-Son · Fribourg",
              date: "Vendredi 24 mai",
              time: "20€",
              gradient: `linear-gradient(135deg, #4c1d95 0%, ${PINK} 100%)`,
            }}
          />
        </Series.Sequence>
        <Series.Sequence durationInFrames={90}>
          <FlyerScene
            phoneLabel="CLUBBING"
            flyer={{
              badge: "23H00",
              badgeColor: CYAN,
              category: "House · Techno",
              title: "DEEP\nROOM",
              venue: "XXL Club · Fribourg",
              date: "Samedi 25 mai",
              time: "Free b/12",
              gradient: `linear-gradient(135deg, #0c2340 0%, ${CYAN} 100%)`,
            }}
          />
        </Series.Sequence>
        <Series.Sequence durationInFrames={90}>
          <FlyerScene
            phoneLabel="LOUNGE"
            flyer={{
              badge: "19H00",
              badgeColor: GOLD,
              category: "Shisha · Cocktails",
              title: "AFTER\nWORK",
              venue: "Le Coccon · Pérolles",
              date: "Jeudi 23 mai",
              time: "Happy h.",
              gradient: `linear-gradient(135deg, #1f1306 0%, ${GOLD} 100%)`,
            }}
          />
        </Series.Sequence>
        <Series.Sequence durationInFrames={90}>
          <CTAScene />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
