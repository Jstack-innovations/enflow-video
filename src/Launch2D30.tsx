import React, { memo } from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadSerif } from "@remotion/google-fonts/CormorantGaramond";
import { loadFont as loadSans } from "@remotion/google-fonts/SpaceGrotesk";
import { loadFont as loadMono } from "@remotion/google-fonts/SpaceMono";
import { IPhoneFrame } from "./IPhoneFrame";

/* ------------------------------------------------------------------ */
/*  Enflow Discovery – 30s 2D film (1080x1920, 30fps, 900 frames)      */
/*  Night Ojo -> failing apps -> tired cook -> Enflow -> real order     */
/*  flow inside an iPhone -> delivery at the door -> offer + logo.      */
/*  All art is vector (SVG/CSS). Nothing here replaces your old files.  */
/* ------------------------------------------------------------------ */

const { fontFamily: INTER } = loadInter("normal", {
  weights: ["500", "700", "800"],
  subsets: ["latin"],
});
const { fontFamily: SERIF } = loadSerif("normal", {
  weights: ["400", "600", "700"],
  subsets: ["latin"],
});
const { fontFamily: SANS } = loadSans("normal", {
  weights: ["400", "500", "700"],
  subsets: ["latin"],
});
const { fontFamily: MONO } = loadMono("normal", {
  weights: ["400", "700"],
  subsets: ["latin"],
});

export type Launch2D30Props = {
  area: string;
  discountLabel: string;
  ctaLink: string;
  dishImages: string[];
  studentName: string;
  music: boolean;
  voice: boolean;
  sfx: boolean;
};

export const LAUNCH2D30_LEN = 900;

export const launch2D30Defaults: Launch2D30Props = {
  area: "Ojo",
  discountLabel: "special discount",
  ctaLink: "order.getenflowai.online",
  dishImages: ["wings.jpg", "pie.jpg"],
  studentName: "Amaka",
  music: true,
  voice: true,
  sfx: true,
};

const C = {
  night: "#0e1330",
  night2: "#2b1b52",
  gold: "#d4a853",
  cream: "#f5ead6",
  ink: "#14100a",
  red: "#ff4d5e",
  orange: "#ff8a3d",
  yellow: "#ffc933",
  teal: "#2fd1b0",
  skinA: "#8d5a3b",
  skinB: "#6b3f27",
  skinC: "#c58c5f",
};

const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;
const EASE = Easing.bezier(0.22, 1, 0.36, 1);
const EIO = Easing.bezier(0.65, 0, 0.35, 1);
const pr = (f: number, a: number, b: number, e = EASE) =>
  interpolate(f, [a, b], [0, 1], { ...clamp, easing: e });
const sp = (f: number, delay: number, damping = 13) =>
  spring({ frame: f - delay, fps: 30, config: { damping, stiffness: 120 } });
const rnd = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

/* ----------------------------- primitives ---------------------------- */

const Iris: React.FC<{
  dur?: number;
  cx?: number;
  cy?: number;
  children: React.ReactNode;
}> = ({ dur = 14, cx = 540, cy = 960, children }) => {
  const f = useCurrentFrame();
  const r = pr(f, 0, dur, EIO) * 2300;
  return (
    <AbsoluteFill
      style={{
        clipPath: r >= 2290 ? undefined : `circle(${r}px at ${cx}px ${cy}px)`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

const Line: React.FC<{
  text: string;
  at: number;
  y: number;
  size?: number;
  color?: string;
  weight?: number;
  out?: number;
  align?: "center" | "left";
  x?: number;
}> = ({ text, at, y, size = 110, color = "#fff", weight = 800, out, x }) => {
  const f = useCurrentFrame();
  const words = text.split(" ");
  const o = out === undefined ? 1 : 1 - pr(f, out, out + 12, EIO);
  return (
    <div
      style={{
        position: "absolute",
        left: x ?? 60,
        width: x === undefined ? 900 : undefined,
        top: y,
        textAlign: x === undefined ? "center" : "left",
        fontFamily: INTER,
        fontWeight: weight,
        fontSize: size,
        lineHeight: 1.05,
        letterSpacing: -2,
        color,
        opacity: o,
        transform: `translate3d(0,${(1 - o) * -40}px,0)`,
      }}
    >
      {words.map((w, i) => {
        const p = sp(f, at + i * 4, 15);
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              marginRight: size * 0.26,
              opacity: Math.min(1, p * 1.4),
              transform: `translate3d(0,${(1 - p) * 70}px,0)`,
            }}
          >
            {w}
          </span>
        );
      })}
    </div>
  );
};

const Mark: React.FC<{ color: string; s?: number }> = ({ color, s = 1 }) => (
  <div
    style={{
      width: 70 * s,
      height: 82 * s,
      border: `${3 * s}px solid ${color}`,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: 8 * s,
      boxSizing: "border-box",
    }}
  >
    {[0, 1, 2].map((i) => (
      <div
        key={i}
        style={{ width: 7 * s, height: 38 * s, background: color }}
      />
    ))}
  </div>
);

/* ------------------------------ people ------------------------------- */

type Mood = "hungry" | "confused" | "tired" | "happy";

const Person: React.FC<{
  skin: string;
  shirt: string;
  hair: string;
  mood: Mood;
  f: number;
  phone?: boolean;
  apron?: boolean;
  scarf?: boolean;
  bag?: boolean;
}> = ({ skin, shirt, hair, mood, f, phone, apron, scarf, bag }) => {
  const blink = f % 90 > 84 ? 0.1 : 1;
  const eyeY = mood === "tired" ? 84 : 82;
  return (
    <svg width={200} height={340} viewBox="0 0 200 340">
      {/* legs */}
      <rect x={66} y={250} width={30} height={76} rx={12} fill="#232846" />
      <rect x={104} y={250} width={30} height={76} rx={12} fill="#232846" />
      <rect x={58} y={316} width={44} height={16} rx={8} fill="#f5ead6" />
      <rect x={98} y={316} width={44} height={16} rx={8} fill="#f5ead6" />
      {/* arms */}
      {phone ? (
        <>
          <line x1={62} y1={168} x2={84} y2={222} stroke={shirt} strokeWidth={26} strokeLinecap="round" />
          <line x1={138} y1={168} x2={116} y2={222} stroke={shirt} strokeWidth={26} strokeLinecap="round" />
        </>
      ) : bag ? (
        <>
          <line x1={62} y1={168} x2={50} y2={250} stroke={shirt} strokeWidth={26} strokeLinecap="round" />
          <line x1={138} y1={168} x2={150} y2={222} stroke={shirt} strokeWidth={26} strokeLinecap="round" />
        </>
      ) : (
        <>
          <line x1={62} y1={168} x2={48} y2={250} stroke={shirt} strokeWidth={26} strokeLinecap="round" />
          <line x1={138} y1={168} x2={152} y2={250} stroke={shirt} strokeWidth={26} strokeLinecap="round" />
        </>
      )}
      {/* torso */}
      <rect x={52} y={140} width={96} height={128} rx={38} fill={shirt} />
      {apron && (
        <>
          <rect x={64} y={176} width={72} height={92} rx={18} fill="#f5ead6" />
          <rect x={92} y={146} width={16} height={34} fill="#f5ead6" />
        </>
      )}
      {/* neck + head */}
      <rect x={88} y={116} width={24} height={34} rx={8} fill={skin} />
      <circle cx={100} cy={80} r={46} fill={skin} />
      {scarf ? (
        <path d="M52 78 Q50 26 100 26 Q150 26 148 78 Q124 54 100 58 Q76 54 52 78Z" fill={hair} />
      ) : (
        <path d="M54 74 Q54 30 100 30 Q146 30 146 74 Q124 50 100 54 Q76 50 54 74Z" fill={hair} />
      )}
      {/* eyes */}
      <g transform={`translate(0 ${eyeY - 82})`}>
        <ellipse cx={82} cy={82} rx={6} ry={7 * blink} fill="#1a1020" />
        <ellipse cx={118} cy={82} rx={6} ry={7 * blink} fill="#1a1020" />
      </g>
      {mood === "tired" && (
        <>
          <path d="M72 80 Q82 70 92 80Z" fill={skin} stroke="#1a1020" strokeWidth={3} />
          <path d="M108 80 Q118 70 128 80Z" fill={skin} stroke="#1a1020" strokeWidth={3} />
          <path d="M72 94 Q82 100 92 94" stroke="#3a2030" strokeWidth={4} fill="none" strokeLinecap="round" />
          <path d="M108 94 Q118 100 128 94" stroke="#3a2030" strokeWidth={4} fill="none" strokeLinecap="round" />
          <path d="M88 114 Q100 108 112 114" stroke="#3a1a1a" strokeWidth={5} fill="none" strokeLinecap="round" />
        </>
      )}
      {mood === "hungry" && (
        <>
          <path d="M70 62 Q82 54 94 62" stroke="#1a1020" strokeWidth={5} fill="none" strokeLinecap="round" />
          <path d="M106 62 Q118 54 130 62" stroke="#1a1020" strokeWidth={5} fill="none" strokeLinecap="round" />
          <ellipse cx={100} cy={112} rx={13} ry={11 + Math.sin(f / 4) * 2} fill="#3a1a1a" />
          <ellipse cx={100} cy={118} rx={8} ry={4} fill="#ff7a8a" />
          <path d="M148 52 q10 16 0 24 q-10 -8 0 -24z" fill="#7fd6ff" />
        </>
      )}
      {mood === "confused" && (
        <>
          <path d="M70 66 Q82 56 94 64" stroke="#1a1020" strokeWidth={5} fill="none" strokeLinecap="round" />
          <path d="M106 60 Q118 66 130 72" stroke="#1a1020" strokeWidth={5} fill="none" strokeLinecap="round" />
          <path d="M84 114 q8 -8 16 0 t16 0" stroke="#3a1a1a" strokeWidth={5} fill="none" strokeLinecap="round" />
          <path d="M148 46 q10 16 0 24 q-10 -8 0 -24z" fill="#7fd6ff" />
        </>
      )}
      {mood === "happy" && (
        <>
          <path d="M70 66 Q82 58 94 66" stroke="#1a1020" strokeWidth={5} fill="none" strokeLinecap="round" />
          <path d="M106 66 Q118 58 130 66" stroke="#1a1020" strokeWidth={5} fill="none" strokeLinecap="round" />
          <path d="M80 104 Q100 128 120 104Z" fill="#3a1a1a" />
          <path d="M88 112 Q100 120 112 112Z" fill="#ff7a8a" />
        </>
      )}
      {/* hands */}
      {phone ? (
        <>
          <circle cx={84} cy={224} r={13} fill={skin} />
          <circle cx={116} cy={224} r={13} fill={skin} />
          <rect x={78} y={176} width={44} height={76} rx={9} fill="#1c1c24" />
          <rect x={82} y={181} width={36} height={66} rx={6} fill={C.red} opacity={0.85} />
          <text x={100} y={226} fontFamily={INTER} fontWeight={800} fontSize={34} fill="#fff" textAnchor="middle">!</text>
        </>
      ) : bag ? (
        <>
          <circle cx={50} cy={252} r={13} fill={skin} />
          <circle cx={150} cy={224} r={13} fill={skin} />
          <rect x={138} y={222} width={44} height={52} rx={6} fill="#e9c58a" />
          <path d="M138 232 h44" stroke="#c9a15a" strokeWidth={5} />
        </>
      ) : (
        <>
          <circle cx={48} cy={252} r={13} fill={skin} />
          <circle cx={152} cy={252} r={13} fill={skin} />
        </>
      )}
    </svg>
  );
};

const Stand: React.FC<{
  cx: number;
  bottom: number;
  s: number;
  rot?: number;
  children: React.ReactNode;
}> = ({ cx, bottom, s, rot = 0, children }) => (
  <div
    style={{
      position: "absolute",
      left: cx - 100 * s,
      top: bottom - 332 * s,
      width: 200,
      height: 340,
      transform: `scale(${s}) rotate(${rot}deg)`,
      transformOrigin: "100px 332px",
    }}
  >
    {children}
  </div>
);

/* --------------------------- city / scenery -------------------------- */

const Skyline: React.FC<{
  w: number;
  h: number;
  seed: number;
  body: string;
  win: string;
  lit: number;
}> = memo(({ w, h, seed, body, win, lit }) => {
  const rects: React.ReactNode[] = [];
  let x = -20;
  let b = 0;
  while (x < w) {
    const bw = 90 + Math.floor(rnd(seed + b) * 70);
    const bh = h * (0.4 + rnd(seed + b + 50) * 0.6);
    rects.push(
      <rect key={`b${b}`} x={x} y={h - bh} width={bw} height={bh} fill={body} />
    );
    const cols = Math.floor((bw - 20) / 26);
    const rows = Math.floor((bh - 30) / 38);
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (rnd(seed + b * 31 + r * 7 + c) < lit) {
          rects.push(
            <rect
              key={`w${b}-${r}-${c}`}
              x={x + 12 + c * 26}
              y={h - bh + 18 + r * 38}
              width={14}
              height={20}
              rx={2}
              fill={win}
            />
          );
        }
      }
    }
    x += bw + 6;
    b++;
  }
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      {rects}
    </svg>
  );
});

const Danfo: React.FC<{ f: number }> = ({ f }) => (
  <svg width={400} height={200} viewBox="0 0 400 200">
    <rect x={10} y={30} width={380} height={120} rx={26} fill={C.yellow} />
    <rect x={10} y={84} width={380} height={26} fill="#1a1a22" />
    {[0, 1, 2, 3].map((i) => (
      <rect key={i} x={36 + i * 82} y={44} width={64} height={34} rx={8} fill="#a8e2ff" />
    ))}
    <rect x={352} y={44} width={30} height={34} rx={8} fill="#a8e2ff" />
    <circle cx={376} cy={124} r={9} fill="#fff6b0" />
    {[96, 306].map((cx) => (
      <g key={cx} transform={`translate(${cx} 152) rotate(${f * 22})`}>
        <circle r={32} fill="#1a1a22" />
        <circle r={14} fill="#c8c8d4" />
        <rect x={-3} y={-30} width={6} height={60} fill="#c8c8d4" />
      </g>
    ))}
  </svg>
);

/* ============================ SCENE 1 =============================== */
/* Night. "Ojo never sleeps." then "Everybody is hungry."               */

const STARS = Array.from({ length: 30 }, (_, i) => ({
  x: rnd(i + 1) * 1080,
  y: rnd(i + 90) * 900,
  r: 2 + rnd(i + 5) * 3,
  p: rnd(i + 17) * 6,
}));

const Scene1: React.FC = () => {
  const f = useCurrentFrame();
  const drift = f * 0.28;
  const busX = -480 + f * 9.5;
  const landmarks = ["Alaba", "Trade Fair", "LASU", "Unique", "Ecowas Rd"];
  const swap = pr(f, 66, 80, EIO);
  return (
    <AbsoluteFill
      style={{ background: `linear-gradient(180deg, ${C.night} 0%, ${C.night2} 70%, #5b2c6f 100%)` }}
    >
      {STARS.map((s, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: s.x,
            top: s.y,
            width: s.r * 2,
            height: s.r * 2,
            borderRadius: "50%",
            background: "#fff",
            opacity: 0.35 + 0.65 * Math.abs(Math.sin(f / 14 + s.p)),
          }}
        />
      ))}
      {/* moon */}
      <div
        style={{
          position: "absolute",
          left: 780,
          top: 140,
          width: 150,
          height: 150,
          borderRadius: "50%",
          background: "#fff3c4",
          transform: `translate3d(0,${Math.sin(f / 40) * 6}px,0)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 820,
          top: 120,
          width: 150,
          height: 150,
          borderRadius: "50%",
          background: C.night,
          transform: `translate3d(0,${Math.sin(f / 40) * 6}px,0)`,
        }}
      />
      {/* skyline layers */}
      <div style={{ position: "absolute", left: -drift * 0.5, top: 820 }}>
        <Skyline w={1500} h={520} seed={3} body="#1a1d45" win="#6d6aa8" lit={0.25} />
      </div>
      <div style={{ position: "absolute", left: -drift, top: 940 }}>
        <Skyline w={1500} h={420} seed={11} body="#0b0e26" win="#ffd36b" lit={0.4} />
      </div>
      {/* road + sidewalk */}
      <div style={{ position: "absolute", left: 0, top: 1360, width: 1080, height: 140, background: "#12122a" }} />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: 1424,
            left: ((i * 220 - f * 14) % 1320) - 120,
            width: 120,
            height: 10,
            borderRadius: 5,
            background: "#ffd36b",
            opacity: 0.8,
          }}
        />
      ))}
      <div style={{ position: "absolute", left: busX, top: 1200 }}>
        <Danfo f={f} />
      </div>
      <div style={{ position: "absolute", left: 0, top: 1500, width: 1080, height: 420, background: "#1c1a3a" }} />
      {/* hungry crowd */}
      {[
        { cx: 190, s: 1.05, skin: C.skinA, shirt: C.orange, hair: "#14100a", d: 76 },
        { cx: 500, s: 1.18, skin: C.skinB, shirt: C.teal, hair: "#2a1a10", d: 82 },
        { cx: 810, s: 1.05, skin: C.skinC, shirt: "#8f7bff", hair: "#14100a", d: 88 },
      ].map((p, i) => {
        const a = sp(f, p.d, 14);
        return (
          <div key={i} style={{ opacity: a, transform: `translate3d(0,${(1 - a) * 120}px,0)` }}>
            <Stand cx={p.cx} bottom={1620} s={p.s} rot={Math.sin(f / 7 + i) * 2}>
              <Person skin={p.skin} shirt={p.shirt} hair={p.hair} mood="hungry" f={f + i * 20} />
            </Stand>
            {/* tummy rumble */}
            <svg
              style={{ position: "absolute", left: p.cx - 110, top: 1620 - 332 * p.s + 190 * p.s, opacity: pr(f, p.d + 10, p.d + 18) }}
              width={220}
              height={60}
            >
              {[0, 1].map((k) => (
                <path
                  key={k}
                  d={`M${20 + k * 140} 30 q10 -${14 + Math.sin(f / 3 + k) * 6} 20 0 t20 0`}
                  stroke="#ffd36b"
                  strokeWidth={5}
                  fill="none"
                  strokeLinecap="round"
                />
              ))}
            </svg>
          </div>
        );
      })}
      {/* text */}
      <div style={{ opacity: 1 - swap, transform: `translate3d(0,${-swap * 60}px,0)` }}>
        <Line text="Hungry in Ojo?" at={4} y={250} size={130} />
      </div>
      {f >= 64 && (
        <div style={{ opacity: swap, transform: `translate3d(0,${(1 - swap) * 60}px,0)` }}>
          <Line text="Ojo never sleeps." at={68} y={250} size={118} color={C.yellow} />
        </div>
      )}
      {/* landmark ticker */}
      <div
        style={{
          position: "absolute",
          top: 640,
          left: 0,
          width: 1080,
          display: "flex",
          justifyContent: "center",
          gap: 14,
          opacity: 1 - swap,
        }}
      >
        {landmarks.map((l, i) => {
          const p = sp(f, 20 + i * 6, 14);
          return (
            <div
              key={l}
              style={{
                fontFamily: INTER,
                fontWeight: 700,
                fontSize: 30,
                color: C.cream,
                padding: "10px 20px",
                borderRadius: 40,
                background: "rgba(255,255,255,0.12)",
                border: "2px solid rgba(255,255,255,0.25)",
                opacity: p,
                transform: `translate3d(0,${(1 - p) * 40}px,0)`,
                whiteSpace: "nowrap",
              }}
            >
              {l}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/* ============================ SCENE 2 =============================== */
/* Failing apps + confused person -> tired cook                         */

const ErrCard: React.FC<{
  f: number;
  at: number;
  x: number;
  y: number;
  rot: number;
  title: string;
  sub: string;
  tint: string;
}> = ({ f, at, x, y, rot, title, sub, tint }) => {
  const p = sp(f, at, 10);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y + Math.sin((f + at * 3) / 12) * 8,
        width: 470,
        height: 124,
        borderRadius: 30,
        background: "#fff",
        display: "flex",
        alignItems: "center",
        gap: 20,
        padding: "0 24px",
        boxSizing: "border-box",
        transform: `scale(${p}) rotate(${rot}deg)`,
        opacity: Math.min(1, p * 2),
        boxShadow: "0 14px 0 rgba(0,0,0,0.18)",
      }}
    >
      <div style={{ width: 62, height: 62, borderRadius: 18, background: tint, flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 32, color: "#1a1a22" }}>{title}</div>
        <div style={{ fontFamily: INTER, fontWeight: 500, fontSize: 24, color: "#777" }}>{sub}</div>
      </div>
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: "50%",
          background: C.red,
          color: "#fff",
          fontFamily: INTER,
          fontWeight: 800,
          fontSize: 32,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        !
      </div>
    </div>
  );
};

const Clock: React.FC<{ f: number; size: number }> = ({ f, size }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <circle cx={50} cy={50} r={46} fill="#fff" />
    <circle cx={50} cy={50} r={46} fill="none" stroke="#1a1a22" strokeWidth={6} />
    <line x1={50} y1={50} x2={50} y2={18} stroke="#1a1a22" strokeWidth={6} strokeLinecap="round" transform={`rotate(${f * 14} 50 50)`} />
    <line x1={50} y1={50} x2={50} y2={30} stroke={C.red} strokeWidth={6} strokeLinecap="round" transform={`rotate(${f * 1.2} 50 50)`} />
    <circle cx={50} cy={50} r={5} fill="#1a1a22" />
  </svg>
);

const Scene2: React.FC = () => {
  const f = useCurrentFrame();
  const sw = pr(f, 90, 112, EIO);
  return (
    <AbsoluteFill style={{ background: "#1d1b2e" }}>
      {/* diagonal stripes for flat texture */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "repeating-linear-gradient(135deg, rgba(255,255,255,0.03) 0 60px, transparent 60px 120px)",
        }}
      />
      {/* 2a: confused person + failing apps */}
      <div style={{ position: "absolute", inset: 0, transform: `translate3d(${-sw * 1200}px,0,0)` }}>
        <Line text="Too many apps." at={2} y={170} size={104} />
        <Line text="Nothing works." at={14} y={290} size={104} color={C.red} />
        <ErrCard f={f} at={20} x={50} y={470} rot={-4} title="Order failed" sub="Something went wrong" tint="#ff8a3d" />
        <ErrCard f={f} at={32} x={540} y={600} rot={3} title="No riders" sub="Try again later" tint="#7a6bff" />
        <ErrCard f={f} at={44} x={60} y={760} rot={2} title="Payment error" sub="Transaction declined" tint="#2fd1b0" />
        <ErrCard f={f} at={56} x={520} y={900} rot={-3} title="Restaurant closed" sub="Nothing available" tint="#ffc933" />
        <Stand cx={300} bottom={1480} s={1.5} rot={Math.sin(f / 6) * 3}>
          <Person skin={C.skinB} shirt="#7a6bff" hair="#14100a" mood="confused" f={f} phone />
        </Stand>
        <div
          style={{
            position: "absolute",
            left: 640,
            top: 1120,
            display: "flex",
            alignItems: "center",
            gap: 20,
            opacity: sp(f, 60, 14),
            transform: `scale(${sp(f, 60, 10)})`,
            transformOrigin: "left center",
          }}
        >
          <Clock f={f} size={130} />
          <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 46, color: "#fff", lineHeight: 1.05 }}>
            Time
            <br />
            wasted.
          </div>
        </div>
      </div>
      {/* 2b: tired cook */}
      <div style={{ position: "absolute", inset: 0, transform: `translate3d(${(1 - sw) * 1200}px,0,0)` }}>
        <KitchenScene f={Math.max(0, f - 100)} />
      </div>
    </AbsoluteFill>
  );
};

const KitchenScene: React.FC<{ f: number }> = ({ f }) => (
  <AbsoluteFill>
    <div style={{ position: "absolute", inset: 0, background: "#2b2540" }} />
    {/* shelf + jars */}
    <div style={{ position: "absolute", left: 80, top: 640, width: 520, height: 18, borderRadius: 9, background: "#5a4a70" }} />
    {[0, 1, 2, 3].map((i) => (
      <div
        key={i}
        style={{
          position: "absolute",
          left: 110 + i * 120,
          top: 560 + (i % 2) * 14,
          width: 80,
          height: 80 - (i % 2) * 14,
          borderRadius: 14,
          background: ["#ff8a3d", "#ffc933", "#2fd1b0", "#ff4d5e"][i],
          opacity: 0.75,
        }}
      />
    ))}
    <div style={{ position: "absolute", left: 760, top: 560, opacity: 1 }}>
      <Clock f={f * 0.5} size={150} />
    </div>
    {/* counter */}
    <div style={{ position: "absolute", left: 0, top: 1240, width: 1080, height: 260, background: "#4a3a5a" }} />
    <div style={{ position: "absolute", left: 0, top: 1226, width: 1080, height: 22, background: "#6c5a82" }} />
    {/* pot (empty, no fire) */}
    <div style={{ position: "absolute", left: 700, top: 1080, width: 220, height: 150, borderRadius: "10px 10px 40px 40px", background: "#9aa0b4" }} />
    <div style={{ position: "absolute", left: 680, top: 1060, width: 260, height: 26, borderRadius: 13, background: "#c3c8d8" }} />
    {[0, 1, 2].map((i) => (
      <div
        key={i}
        style={{
          position: "absolute",
          left: 740 + i * 50,
          top: 1010 - ((f * 1.6 + i * 28) % 90),
          width: 18,
          height: 60,
          borderRadius: 9,
          background: "#fff",
          opacity: 0.3 * (1 - ((f * 1.6 + i * 28) % 90) / 90),
        }}
      />
    ))}
    <Stand cx={400} bottom={1500} s={1.55} rot={4 + Math.sin(f / 18) * 3}>
      <Person skin={C.skinA} shirt="#ff8a3d" hair="#c1285a" mood="tired" f={f} apron scarf />
    </Stand>
    {["z", "Z", "Z"].map((ch, i) => {
      const t = (f * 1.2 + i * 22) % 90;
      return (
        <div
          key={i}
          style={{
            position: "absolute",
            left: 520 + i * 34 + t * 0.4,
            top: 760 - t * 1.6,
            fontFamily: INTER,
            fontWeight: 800,
            fontSize: 44 + i * 16,
            color: "#fff",
            opacity: 1 - t / 90,
          }}
        >
          {ch}
        </div>
      );
    })}
    <Line text="Too tired" at={4} y={190} size={112} />
    <Line text="to cook." at={12} y={316} size={112} color={C.yellow} />
  </AbsoluteFill>
);

/* ============================ SCENE 3 =============================== */
/* "Meet Enflow." on gold                                               */

const Scene3: React.FC = () => {
  const f = useCurrentFrame();
  const m = sp(f, 16, 9);
  return (
    <AbsoluteFill style={{ background: C.gold }}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: 540 - 300 - i * 170,
            top: 960 - 300 - i * 170,
            width: 600 + i * 340,
            height: 600 + i * 340,
            borderRadius: "50%",
            border: `3px solid rgba(20,16,10,${0.16 - i * 0.04})`,
            transform: `scale(${0.7 + 0.3 * pr(f, 4 + i * 4, 40)})`,
          }}
        />
      ))}
      <div style={{ position: "absolute", left: 0, top: 640, width: 1080, display: "flex", justifyContent: "center", transform: `scale(${m})`, opacity: Math.min(1, m * 2) }}>
        <Mark color={C.ink} s={1.7} />
      </div>
      <Line text="Meet Enflow." at={20} y={820} size={124} color={C.ink} />
    </AbsoluteFill>
  );
};

/* ============================ SCENE 4 =============================== */
/* The real ordering flow inside an iPhone (400 x 872 screen).          */

const GOLD = C.gold;
const CREAM = C.cream;
const S4 = 1.36; // phone scale
const PHONE_X = Math.round((1080 - 438 * S4) / 2);
const PHONE_Y = 300;

const DISHES = [
  { num: "02", name: "Smoked Turkey Wings", tags: ["GLUTEN-FREE", "CHEF'S PICK"], left: "9 LEFT" },
  { num: "21", name: "Kids Chicken Pie", tags: ["KIDS", "SNACK"], left: "20 LEFT" },
];

const Thumb: React.FC<{ src?: string; w: number; h: number }> = ({ src, w, h }) =>
  src ? (
    <Img src={staticFile(src)} style={{ width: w, height: h, objectFit: "cover", flexShrink: 0 }} />
  ) : (
    <div style={{ width: w, height: h, flexShrink: 0, background: `linear-gradient(135deg, ${GOLD}, #5a3a14)` }} />
  );

const press = (f: number, a: number) =>
  interpolate(f, [a, a + 5, a + 11], [1, 0.92, 1], clamp);

const AppScreen: React.FC<{ f: number; dishImages: string[]; name: string }> = ({ f, dishImages, name }) => {
  const added = f >= 58;
  const cartPulse = interpolate(f, [78, 84, 92], [1, 1.14, 1], clamp);
  const drawer = pr(f, 94, 112);
  const drawerOut = pr(f, 134, 150, EIO);
  const modalP = pr(f, 132, 150);
  const modalOut = pr(f, 166, 180, EIO);
  const deliveryFlash = interpolate(f, [158, 162, 172], [0, 1, 0], clamp);
  const formP = pr(f, 166, 184);
  const succP = pr(f, 282, 298);
  const payBusy = f >= 264 && f < 284;
  const typed = (t: string, a: number, b: number) =>
    t.slice(0, Math.floor(interpolate(f, [a, b], [0, t.length], clamp)));
  const caret = (a: number, b: number) =>
    f >= a && f <= b + 8 && Math.floor(f / 6) % 2 === 0 ? "|" : "";
  const label = { fontFamily: MONO, fontSize: 12, letterSpacing: 3, color: `${CREAM}99`, marginBottom: 8 } as const;
  const input = {
    height: 56,
    boxSizing: "border-box" as const,
    border: `1px solid ${GOLD}40`,
    background: "#0e0e0e",
    display: "flex",
    alignItems: "center",
    padding: "0 16px",
    fontFamily: SANS,
    fontSize: 19,
    color: CREAM,
  };
  const btn = (txt: string, extra?: React.CSSProperties) => (
    <div
      style={{
        height: 56,
        background: GOLD,
        color: "#000",
        fontFamily: MONO,
        fontWeight: 700,
        fontSize: 15,
        letterSpacing: 3,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        ...extra,
      }}
    >
      {txt}
    </div>
  );
  const steps = [
    { t: "Order confirmed", at: 296 },
    { t: "Preparing your food", at: 304 },
    { t: "On the way", at: 314 },
    { t: "Delivered", at: 326 },
  ];
  return (
    <div style={{ position: "relative", width: 400, height: 872, background: "#050505", overflow: "hidden" }}>
      {/* header */}
      <div style={{ height: 150, padding: "60px 24px 0", boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Mark color={GOLD} s={0.5} />
          <div style={{ marginLeft: 14, fontFamily: MONO, fontWeight: 700, fontSize: 17, letterSpacing: 5, color: CREAM }}>EN-FLOW</div>
        </div>
        <div style={{ background: GOLD, color: "#000", height: 42, padding: "0 14px", borderRadius: 9, display: "flex", alignItems: "center", gap: 10, fontFamily: MONO, fontWeight: 700, fontSize: 14, letterSpacing: 3, transform: `scale(${cartPulse * press(f, 92)})` }}>
          ORDER
          <div style={{ background: "#000", color: GOLD, width: 24, height: 24, display: "flex", justifyContent: "center", alignItems: "center" }}>{added ? 1 : 0}</div>
        </div>
      </div>
      <div style={{ display: "flex", height: 56, borderTop: `1px solid ${GOLD}30`, borderBottom: `1px solid ${GOLD}30` }}>
        {["ALL", "APPETIZERS", "MAIN"].map((t, i) => (
          <div key={t} style={{ padding: "0 26px", display: "flex", alignItems: "center", fontFamily: MONO, fontSize: 14, letterSpacing: 3, color: i === 0 ? GOLD : `${CREAM}99`, background: i === 0 ? `${GOLD}22` : "transparent", borderBottom: i === 0 ? `2px solid ${GOLD}` : "none" }}>{t}</div>
        ))}
      </div>
      <div style={{ padding: "28px 24px 0", height: 100, boxSizing: "border-box", fontFamily: SERIF, fontSize: 46, color: CREAM }}>Popular</div>
      {DISHES.map((d, i) => {
        const p = pr(f, 8 + i * 8, 30);
        const isAdded = i === 0 && added;
        return (
          <div key={d.name} style={{ position: "absolute", left: 24, right: 24, top: 306 + i * 210, height: 210, display: "flex", borderTop: `1px solid ${GOLD}25`, opacity: p, transform: `translate3d(${(1 - p) * 160}px,0,0)` }}>
            <div style={{ position: "relative", width: 150, height: 210 }}>
              <Thumb src={dishImages[i]} w={150} h={210} />
              <div style={{ position: "absolute", top: 10, left: 10, background: "#000000b0", color: GOLD, fontFamily: MONO, fontSize: 12, padding: "4px 8px" }}>{d.num}</div>
            </div>
            <div style={{ flex: 1, padding: "14px 0 0 16px", position: "relative" }}>
              <div style={{ fontFamily: SERIF, fontSize: 26, color: CREAM, lineHeight: 1.05 }}>{d.name}</div>
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginTop: 8 }}>
                {d.tags.map((t) => (
                  <div key={t} style={{ fontFamily: MONO, fontSize: 9, letterSpacing: 1, color: GOLD, border: `1px solid ${GOLD}60`, padding: "2px 5px" }}>{t}</div>
                ))}
              </div>
              <div style={{ fontFamily: MONO, fontSize: 11, letterSpacing: 2, color: `${CREAM}88`, marginTop: 8 }}>{d.left}</div>
              <div style={{ position: "absolute", left: 16, right: 0, bottom: 18, height: 44, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: MONO, fontWeight: 700, fontSize: 13, letterSpacing: 3, color: isAdded ? "#000" : CREAM, background: isAdded ? GOLD : "transparent", border: `1px solid ${isAdded ? GOLD : CREAM}`, transform: `scale(${i === 0 ? press(f, 54) : 1})` }}>
                {isAdded ? "ADDED" : "ADD ORDER"}
              </div>
            </div>
          </div>
        );
      })}

      {/* cart drawer */}
      {f >= 94 && (
        <>
          <div style={{ position: "absolute", inset: 0, background: "#000", opacity: 0.6 * drawer * (1 - drawerOut) }} />
          <div style={{ position: "absolute", top: 0, right: 0, bottom: 0, width: 340, background: "#0b0b0b", borderLeft: `1px solid ${GOLD}30`, transform: `translate3d(${(1 - drawer) * 340 + drawerOut * 340}px,0,0)` }}>
            <div style={{ padding: "70px 24px 20px", fontFamily: SERIF, fontSize: 38, color: CREAM, borderBottom: `1px solid ${GOLD}25` }}>Your order</div>
            <div style={{ display: "flex", gap: 14, padding: 20, borderBottom: `1px solid ${GOLD}25` }}>
              <Thumb src={dishImages[0]} w={70} h={70} />
              <div>
                <div style={{ fontFamily: SERIF, fontSize: 22, color: CREAM, lineHeight: 1.05 }}>Smoked Turkey Wings</div>
                <div style={{ fontFamily: MONO, fontSize: 12, color: GOLD, letterSpacing: 2, marginTop: 8 }}>QTY 1</div>
              </div>
            </div>
            <div style={{ position: "absolute", left: 24, right: 24, top: 752 }}>
              {btn("CHECKOUT", { transform: `scale(${press(f, 128)})` })}
            </div>
          </div>
        </>
      )}

      {/* order type sheet */}
      {f >= 132 && (
        <>
          <div style={{ position: "absolute", inset: 0, background: "#000", opacity: 0.7 * modalP * (1 - modalOut) }} />
          <div style={{ position: "absolute", left: 0, right: 0, top: 360, bottom: 0, background: "#0b0b0b", borderTop: `2px solid ${GOLD}`, transform: `translate3d(0,${(1 - modalP) * 520 + modalOut * 520}px,0)` }}>
            <div style={{ padding: "26px 24px 0", fontFamily: SERIF, fontSize: 36, color: CREAM }}>How do you want it?</div>
            {[
              { t: "DINE IN ORDER", soon: true },
              { t: "DELIVERY ORDER", soon: false },
              { t: "PICKUP ORDER", soon: true },
            ].map((o, i) => (
              <div key={o.t} style={{ position: "absolute", left: 24, right: 24, top: 90 + i * 64, height: 52, display: "flex", alignItems: "center", padding: "0 16px", fontFamily: MONO, fontWeight: 700, fontSize: 14, letterSpacing: 3, color: o.soon ? `${CREAM}55` : CREAM, background: o.soon ? "transparent" : `rgba(212,168,83,${0.1 + deliveryFlash * 0.45})`, border: `1px solid ${o.soon ? "#333" : GOLD}`, boxSizing: "border-box", transform: `scale(${o.soon ? 1 : press(f, 158)})` }}>
                {o.t}
                {o.soon && <div style={{ marginLeft: "auto", fontSize: 10 }}>COMING SOON</div>}
              </div>
            ))}
          </div>
        </>
      )}

      {/* delivery form */}
      {f >= 166 && (
        <div style={{ position: "absolute", inset: 0, background: "#050505", transform: `translate3d(${(1 - formP) * 400 + succP * -400}px,0,0)` }}>
          <div style={{ padding: "70px 24px 10px", fontFamily: SERIF, fontSize: 40, color: CREAM }}>Delivery details</div>
          <div style={{ padding: "10px 24px 0" }}>
            <div style={label}>FULL NAME</div>
            <div style={input}>{typed(`${name} Obi`, 186, 208)}{caret(186, 208)}</div>
            <div style={{ height: 24 }} />
            <div style={label}>PHONE NUMBER</div>
            <div style={input}>{typed("0801 234 5678", 212, 238)}{caret(212, 238)}</div>
            <div style={{ height: 24 }} />
            <div style={label}>DELIVERY ADDRESS</div>
            <div style={input}>{typed("Near LASU gate, Ojo", 242, 264)}{caret(242, 264)}</div>
          </div>
          <div style={{ position: "absolute", left: 24, right: 24, top: 760 }}>
            {btn(payBusy ? "" : "PAY NOW", { transform: `scale(${press(f, 262)})` })}
            {payBusy && (
              <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 56, display: "flex", justifyContent: "center", alignItems: "center" }}>
                <div style={{ width: 26, height: 26, borderRadius: "50%", border: "4px solid #000", borderTopColor: "transparent", transform: `rotate(${f * 22}deg)` }} />
              </div>
            )}
          </div>
        </div>
      )}

      {/* success + tracker */}
      {f >= 282 && (
        <div style={{ position: "absolute", inset: 0, background: "#050505", transform: `translate3d(0,${(1 - succP) * 872}px,0)` }}>
          <div style={{ display: "flex", justifyContent: "center", paddingTop: 110 }}>
            <div style={{ width: 96, height: 96, borderRadius: "50%", background: GOLD, display: "flex", justifyContent: "center", alignItems: "center", transform: `scale(${sp(f, 290, 9)})` }}>
              <svg width={52} height={52} viewBox="0 0 52 52"><path d="M10 27 L22 39 L43 14" stroke="#000" strokeWidth={7} fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
          </div>
          <div style={{ textAlign: "center", fontFamily: SERIF, fontSize: 42, color: CREAM, marginTop: 24 }}>Order placed</div>
          <div style={{ position: "absolute", left: 60, top: 360 }}>
            {steps.map((s, i) => {
              const p = pr(f, s.at, s.at + 8);
              return (
                <div key={s.t} style={{ position: "relative", height: 100, display: "flex", alignItems: "flex-start" }}>
                  {i < steps.length - 1 && <div style={{ position: "absolute", left: 14, top: 30, width: 3, height: 76, background: "#333" }}><div style={{ width: 3, height: `${pr(f, s.at + 6, steps[i + 1].at + 4) * 100}%`, background: GOLD }} /></div>}
                  <div style={{ width: 32, height: 32, borderRadius: "50%", boxSizing: "border-box", border: `3px solid ${p > 0.5 ? GOLD : "#333"}`, background: p > 0.5 ? GOLD : "transparent", transform: `scale(${0.8 + p * 0.2})` }} />
                  <div style={{ marginLeft: 20, marginTop: 2, fontFamily: SANS, fontSize: 22, color: p > 0.5 ? CREAM : `${CREAM}55` }}>{s.t}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

/* finger + arm that taps the real screen */
const FKEYS: [number, number, number][] = [
  [10, 330, 860], [50, 270, 476], [64, 270, 476], [88, 322, 82], [98, 322, 82],
  [124, 230, 780], [136, 230, 780], [156, 200, 540], [168, 200, 540],
  [178, 320, 840], [254, 320, 840], [260, 200, 789], [274, 200, 789], [296, 340, 900],
];
const TAPS = [56, 92, 130, 160, 262];

const fingerAt = (f: number) => {
  if (f <= FKEYS[0][0]) return { x: FKEYS[0][1], y: FKEYS[0][2] };
  for (let i = 0; i < FKEYS.length - 1; i++) {
    const a = FKEYS[i];
    const b = FKEYS[i + 1];
    if (f >= a[0] && f <= b[0]) {
      const k = Easing.bezier(0.45, 0, 0.2, 1)((f - a[0]) / (b[0] - a[0]));
      return { x: a[1] + (b[1] - a[1]) * k, y: a[2] + (b[2] - a[2]) * k };
    }
  }
  const l = FKEYS[FKEYS.length - 1];
  return { x: l[1], y: l[2] };
};

const STAGES = [
  { from: 8, text: "Pick." },
  { from: 78, text: "Open your order." },
  { from: 126, text: "Choose delivery." },
  { from: 172, text: "Add your details." },
  { from: 250, text: "Pay." },
  { from: 282, text: "Done." },
];

const Scene4: React.FC<{ dishImages: string[]; name: string }> = ({ dishImages, name }) => {
  const f = useCurrentFrame();
  const rise = pr(f, 0, 22);
  const stage = [...STAGES].reverse().find((s) => f >= s.from) ?? STAGES[0];
  const stageIdx = STAGES.indexOf(stage);
  const sf = f - stage.from;
  const sp1 = pr(sf, 0, 14);
  const fp = fingerAt(f);
  const ox = PHONE_X + (19 + fp.x) * S4;
  const oy = PHONE_Y + (19 + fp.y) * S4;
  const tap = TAPS.find((t) => f >= t && f < t + 16);
  const tapK = tap === undefined ? 0 : (f - tap) / 16;
  const fingerVis = pr(f, 8, 20) * (1 - pr(f, 296, 308));
  // +1 flight
  const fly = pr(f, 58, 80, EIO);
  const flyX = 270 + (322 - 270) * fly;
  const flyY = 476 + (82 - 476) * fly - Math.sin(fly * Math.PI) * 60;
  return (
    <AbsoluteFill style={{ background: C.ink }}>
      {/* flat 2D shapes behind the phone */}
      <div style={{ position: "absolute", left: -240, top: 700, width: 640, height: 640, borderRadius: "50%", background: "#2a2010", transform: `scale(${0.9 + Math.sin(f / 50) * 0.04})` }} />
      <div style={{ position: "absolute", left: 760, top: 160, width: 420, height: 420, borderRadius: "50%", background: "#221a0c", transform: `scale(${0.9 + Math.cos(f / 44) * 0.04})` }} />
      <div style={{ position: "absolute", left: 800, top: 1180, width: 260, height: 260, borderRadius: 40, background: "#1d160a", transform: `rotate(${20 + f * 0.15}deg)` }} />
      {/* step caption */}
      <div style={{ position: "absolute", left: 0, top: 80, width: 1080, display: "flex", justifyContent: "center" }}>
        <div style={{ display: "flex", gap: 10 }}>
          {STAGES.map((s, i) => (
            <div key={s.text} style={{ width: i === stageIdx ? 60 : 20, height: 10, borderRadius: 5, background: i <= stageIdx ? GOLD : "#3a2e18", transition: "none" }} />
          ))}
        </div>
      </div>
      <div style={{ position: "absolute", left: 60, width: 900, top: 120, textAlign: "center", fontFamily: INTER, fontWeight: 800, fontSize: 96, letterSpacing: -2, color: CREAM, opacity: sp1, transform: `translate3d(0,${(1 - sp1) * 50}px,0)` }}>
        {stage.text}
      </div>
      <div style={{ position: "absolute", left: 60, width: 900, top: 238, textAlign: "center", fontFamily: INTER, fontWeight: 500, fontSize: 28, color: `${GOLD}`, opacity: pr(f, 10, 24) }}>
        {name}, a LASU student, orders on Enflow
      </div>
      {/* phone */}
      <div style={{ position: "absolute", left: PHONE_X, top: PHONE_Y + (1 - rise) * 1300, willChange: "transform" }}>
        <IPhoneFrame scale={S4}>
          <AppScreen f={f} dishImages={dishImages} name={name} />
        </IPhoneFrame>
      </div>
      {/* +1 */}
      {fly > 0 && fly < 1 && (
        <div style={{ position: "absolute", left: PHONE_X + (19 + flyX) * S4 - 28, top: PHONE_Y + (19 + flyY) * S4 - 28, width: 56, height: 56, borderRadius: "50%", background: GOLD, color: "#000", fontFamily: INTER, fontWeight: 800, fontSize: 26, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${1 - fly * 0.4})` }}>+1</div>
      )}
      {/* finger */}
      <div style={{ position: "absolute", left: ox, top: oy, opacity: fingerVis }}>
        {tap !== undefined && (
          <div style={{ position: "absolute", left: -70 * tapK - 30, top: -70 * tapK - 30, width: 60 + 140 * tapK, height: 60 + 140 * tapK, borderRadius: "50%", border: `5px solid ${GOLD}`, opacity: 1 - tapK }} />
        )}
        <div style={{ position: "absolute", left: 0, top: 0, width: 56, height: 760, background: C.skinC, borderRadius: 28, transformOrigin: "28px 28px", transform: `translate(-28px,-28px) rotate(-24deg) scale(${tap !== undefined ? 0.94 : 1})` }} />
        <div style={{ position: "absolute", left: 0, top: 0, width: 56, height: 90, background: "#7a6bff", borderRadius: 14, transformOrigin: "28px 28px", transform: `translate(-28px,-28px) rotate(-24deg) translateY(300px)` }} />
        <div style={{ position: "absolute", left: -32, top: -32, width: 64, height: 64, borderRadius: "50%", background: C.skinC, border: "4px solid #a8704a" }} />
      </div>
    </AbsoluteFill>
  );
};

/* ============================ SCENE 5 =============================== */
/* Sunrise delivery + offer + lockup                                    */

const Scooter: React.FC<{ f: number }> = ({ f }) => (
  <svg width={420} height={300} viewBox="0 0 420 300">
    {/* delivery box */}
    <rect x={20} y={40} width={130} height={120} rx={18} fill={C.gold} />
    <rect x={20} y={40} width={130} height={26} rx={13} fill="#b88c3a" />
    <text x={85} y={128} fontFamily={INTER} fontWeight={800} fontSize={62} textAnchor="middle" fill={C.ink}>E</text>
    {/* body */}
    <path d="M110 170 L300 170 Q340 170 352 130 L372 90 L396 92 L380 150 Q372 200 320 204 L130 204 Q104 204 110 170Z" fill={C.orange} />
    <rect x={150} y={146} width={150} height={26} rx={13} fill="#14100a" />
    <rect x={332} y={70} width={14} height={80} rx={7} fill="#2a2a34" />
    <rect x={318} y={62} width={60} height={14} rx={7} fill="#2a2a34" />
    {/* rider */}
    <rect x={190} y={52} width={74} height={104} rx={30} fill={C.teal} />
    <line x1={256} y1={80} x2={334} y2={72} stroke={C.teal} strokeWidth={24} strokeLinecap="round" />
    <circle cx={336} cy={72} r={11} fill={C.skinB} />
    <circle cx={230} cy={30} r={32} fill={C.skinB} />
    <path d="M196 30 Q198 -6 232 -4 Q266 -2 264 30Z" fill="#ff4d5e" />
    <rect x={240} y={22} width={30} height={14} rx={7} fill="#a8e2ff" />
    {[84, 330].map((cx) => (
      <g key={cx} transform={`translate(${cx} 232) rotate(${f * 26})`}>
        <circle r={44} fill="#1a1a22" />
        <circle r={20} fill="#c8c8d4" />
        <rect x={-3} y={-42} width={6} height={84} fill="#c8c8d4" />
      </g>
    ))}
  </svg>
);

const Scene5: React.FC<{ area: string; discount: string; link: string; name: string }> = ({ area, discount, link, name }) => {
  const f = useCurrentFrame();
  const sun = pr(f, 0, 90, EIO);
  const arrive = pr(f, 4, 62, Easing.bezier(0.2, 0.8, 0.2, 1));
  const scX = -460 + arrive * 760;
  const moving = f < 62;
  const textOut = pr(f, 70, 84, EIO);
  const offer = sp(f, 78, 13);
  const lock = sp(f, 112, 14);
  const stu = sp(f, 70, 11);
  const bagP = pr(f, 84, 104);
  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg,#ffb27a 0%,#ffd9a8 55%,#fff1d6 100%)" }}>
      <div style={{ position: "absolute", left: 760, top: 1000 - sun * 300, width: 260, height: 260, borderRadius: "50%", background: "#fff3c4" }} />
      <div style={{ position: "absolute", left: -f * 0.3, top: 980 }}>
        <Skyline w={1500} h={380} seed={21} body="#e8a77c" win="#fff1d6" lit={0.3} />
      </div>
      {/* house */}
      <div style={{ position: "absolute", left: 700, top: 1030, width: 420, height: 300, background: "#f5ead6" }} />
      <div style={{ position: "absolute", left: 670, top: 960, width: 0, height: 0, borderLeft: "240px solid transparent", borderRight: "240px solid transparent", borderBottom: "80px solid #b8573a" }} />
      <div style={{ position: "absolute", left: 790, top: 1130, width: 110, height: 200, background: "#8a4b2a", borderRadius: "14px 14px 0 0" }} />
      <div style={{ position: "absolute", left: 950, top: 1100, width: 90, height: 90, borderRadius: 14, background: "#a8e2ff" }} />
      {/* ground + road */}
      <div style={{ position: "absolute", left: 0, top: 1330, width: 1080, height: 30, background: "#d9c3a0" }} />
      <div style={{ position: "absolute", left: 0, top: 1360, width: 1080, height: 150, background: "#3a3347" }} />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <div key={i} style={{ position: "absolute", top: 1432, left: ((i * 220 - (moving ? f * 16 : 62 * 16)) % 1320) - 120, width: 120, height: 10, borderRadius: 5, background: "#ffd36b" }} />
      ))}
      <div style={{ position: "absolute", left: scX, top: 1096 + (moving ? Math.sin(f / 3) * 3 : 0) }}>
        <Scooter f={moving ? f : 62} />
      </div>
      {/* student receives */}
      <div style={{ opacity: stu, transform: `translate3d(${(1 - stu) * 100}px,0,0)` }}>
        <Stand cx={845} bottom={1335} s={0.95}>
          <Person skin={C.skinC} shirt="#7a6bff" hair="#14100a" mood="happy" f={f} bag />
        </Stand>
      </div>
      {bagP > 0 && bagP < 1 && (
        <div style={{ position: "absolute", left: 640 + bagP * 200, top: 1180 - Math.sin(bagP * Math.PI) * 120, width: 56, height: 66, borderRadius: 8, background: "#e9c58a", border: "4px solid #c9a15a" }} />
      )}
      {/* headline trio */}
      <div style={{ opacity: 1 - textOut }}>
        <Line text="Good service." at={4} y={200} size={112} color={C.ink} />
        <Line text="Quality food." at={20} y={330} size={112} color={C.ink} />
        <Line text="Fair prices." at={36} y={460} size={112} color="#b8573a" />
      </div>
      {/* offer card */}
      {f >= 78 && (
        <div style={{ position: "absolute", left: 90, top: 200, width: 860, height: 340, borderRadius: 48, background: C.ink, transform: `scale(${offer})`, opacity: Math.min(1, offer * 2), display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6 }}>
          <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 26, letterSpacing: 8, color: C.gold }}>LAUNCH OFFER</div>
          <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 96, letterSpacing: -2, color: C.cream, textTransform: "capitalize", lineHeight: 1.05 }}>{discount}</div>
          <div style={{ fontFamily: INTER, fontWeight: 500, fontSize: 36, color: C.cream }}>on your first 3 orders</div>
          <div style={{ fontFamily: INTER, fontWeight: 500, fontSize: 36, color: C.gold }}>in the first 10 days</div>
        </div>
      )}
      {/* lockup */}
      {f >= 112 && (
        <div style={{ position: "absolute", left: 90, width: 860, top: 600, display: "flex", alignItems: "center", gap: 28, justifyContent: "center", opacity: Math.min(1, lock * 2), transform: `translate3d(0,${(1 - lock) * 60}px,0)` }}>
          <Mark color={C.ink} s={1.15} />
          <div>
            <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 74, letterSpacing: -2, color: C.ink, lineHeight: 1 }}>Enflow Discovery</div>
            <div style={{ fontFamily: INTER, fontWeight: 700, fontSize: 32, color: "#b8573a", marginTop: 8 }}>Now delivering in {area}</div>
          </div>
        </div>
      )}
      {f >= 124 && link !== "" && (
        <div style={{ position: "absolute", left: 90, width: 860, top: 780, display: "flex", justifyContent: "center", opacity: pr(f, 124, 138), transform: `translate3d(0,${(1 - pr(f, 124, 138)) * 30}px,0)` }}>
          <div style={{ background: C.ink, color: C.cream, fontFamily: MONO, fontWeight: 700, fontSize: 32, letterSpacing: 1, padding: "18px 34px", borderRadius: 60 }}>
            Order now: <span style={{ color: C.gold }}>{link}</span>
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};

/* ============================= ROOT ================================= */

// voice clips: put vo1.mp3 ... vo11.mp3 in /public, then set voice: true
const VOICE = [
  { file: "vo1.mp3", from: 6 },
  { file: "vo2.mp3", from: 66 },
  { file: "vo3.mp3", from: 156 },
  { file: "vo4.mp3", from: 336 },
  { file: "vo5.mp3", from: 392 },
  { file: "vo6.mp3", from: 462 },
  { file: "vo7.mp3", from: 556 },
  { file: "vo8.mp3", from: 664 },
  { file: "vo9.mp3", from: 722 },
  { file: "vo10.mp3", from: 796 },
  { file: "vo11.mp3", from: 862 },
];

export const Launch2D30: React.FC<Launch2D30Props> = ({
  area,
  discountLabel,
  ctaLink,
  dishImages,
  studentName,
  music,
  voice,
  sfx,
}) => {
  return (
    <AbsoluteFill style={{ background: C.night, overflow: "hidden" }}>
      {music && (
        <Audio
          src={staticFile("enflow-music.mp3")}
          volume={(fr) =>
            interpolate(fr, [0, 30, 850, 899], [0, voice ? 0.22 : 0.45, voice ? 0.22 : 0.45, 0], clamp)
          }
        />
      )}
      {sfx && <Audio src={staticFile("enflow-sfx.mp3")} volume={0.7} />}
      {voice &&
        VOICE.map((v) => (
          <Sequence key={v.file} from={v.from}>
            <Audio src={staticFile(v.file)} />
          </Sequence>
        ))}
      <Sequence from={0} durationInFrames={166}>
        <Scene1 />
      </Sequence>
      <Sequence from={150} durationInFrames={196}>
        <Iris cy={1000}>
          <Scene2 />
        </Iris>
      </Sequence>
      <Sequence from={330} durationInFrames={70}>
        <Iris>
          <Scene3 />
        </Iris>
      </Sequence>
      <Sequence from={380} durationInFrames={340}>
        <Iris>
          <Scene4 dishImages={dishImages} name={studentName} />
        </Iris>
      </Sequence>
      <Sequence from={712} durationInFrames={188}>
        <Iris cy={900}>
          <Scene5 area={area} discount={discountLabel} link={ctaLink} name={studentName} />
        </Iris>
      </Sequence>
    </AbsoluteFill>
  );
};
