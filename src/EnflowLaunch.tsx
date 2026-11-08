import { memo, useMemo } from "react";
import {
  AbsoluteFill,
  Composition,
  Easing,
  Img,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadSerif } from "@remotion/google-fonts/CormorantGaramond";
import { loadFont as loadSans } from "@remotion/google-fonts/SpaceGrotesk";
import { loadFont as loadMono } from "@remotion/google-fonts/SpaceMono";
import { IPhoneFrame } from "./IPhoneFrame";

const { fontFamily: INTER } = loadInter("normal", {
  weights: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});
const { fontFamily: SERIF } = loadSerif("normal", {
  weights: ["400", "600"],
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

/* ---------- timing: everything is in SECONDS, so you can change the fps ---------- */
// Use 30 while previewing on the phone. Change to 60 for the final export.
export const LAUNCH_FPS = 30;
const FPS = LAUNCH_FPS;
const sec = (n: number) => Math.round(n * FPS);
export const LAUNCH_DURATION = sec(40);

const T = {
  s1: { from: 0, dur: 5.5 },
  s2: { from: 5.0, dur: 7 },
  s3: { from: 11.5, dur: 8.4 },
  s4: { from: 19.4, dur: 8 },
  s5: { from: 26.9, dur: 6.5 },
  s6: { from: 32.9, dur: 7.1 },
};

export type LaunchProps = {
  area: string;
  discountLabel: string;
  ctaLink: string;
  landmarkImages: string[];
  dishImages: string[];
};

const GOLD = "#d4a853";
const WHITE = "#f5f5f7";
const GRAY = "#86868b";
const CREAM = "#f5ead6";

const OUT = Easing.bezier(0.16, 1, 0.3, 1);
const INOUT = Easing.bezier(0.65, 0, 0.35, 1);

const useT = () => useCurrentFrame() / FPS;

const prog = (
  t: number,
  start: number,
  dur: number,
  easing: (n: number) => number = OUT
) =>
  interpolate(t, [start, start + dur], [0, 1], {
    easing,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

const GOLD_TEXT: React.CSSProperties = {
  background: "linear-gradient(90deg, #f6dc9b, #d4a853 50%, #b8863b)",
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
  WebkitTextFillColor: "transparent",
};

/* a scene that fades in/out and drifts very slowly, like a camera push */
const Scene: React.FC<{ dur: number; children: React.ReactNode }> = ({
  dur,
  children,
}) => {
  const t = useT();
  const fin = prog(t, 0, 0.5, INOUT);
  const fout = 1 - prog(t, dur - 0.5, 0.5, INOUT);
  const zoom = 1 + (t / dur) * 0.035;
  return (
    <AbsoluteFill
      style={{ opacity: Math.min(fin, fout), transform: `scale(${zoom})` }}
    >
      {children}
    </AbsoluteFill>
  );
};

/* words that rise, un-blur and fade in one after another */
const Words: React.FC<{
  text: string;
  start: number;
  size: number;
  weight?: number;
  color?: string;
  gold?: boolean;
  stagger?: number;
  align?: "center" | "flex-start";
  spacing?: number;
}> = ({
  text,
  start,
  size,
  weight = 700,
  color = WHITE,
  gold = false,
  stagger = 0.07,
  align = "center",
  spacing = -0.025,
}) => {
  const t = useT();
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: align,
        fontFamily: INTER,
        fontSize: size,
        fontWeight: weight,
        letterSpacing: `${spacing}em`,
        lineHeight: 1.06,
      }}
    >
      {text.split(" ").map((w, i) => {
        const p = prog(t, start + i * stagger, 0.9);
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              marginRight: "0.26em",
              opacity: p,
              transform: `translateY(${(1 - p) * 0.35}em)`,
              filter: p < 1 ? `blur(${(1 - p) * 10}px)` : "none",
              ...(gold ? GOLD_TEXT : { color }),
            }}
          >
            {w}
          </span>
        );
      })}
    </div>
  );
};

const Center: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill
    style={{
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
      textAlign: "center",
    }}
  >
    {children}
  </AbsoluteFill>
);

/* ---------- scene 1: the quiet opening ---------- */
const S1: React.FC = () => {
  const t = useT();
  const dim = 1 - 0.65 * prog(t, 2.6, 0.8, INOUT);
  return (
    <Scene dur={T.s1.dur}>
      <Center>
        <div style={{ opacity: dim, width: 1500 }}>
          <Words text="Ordering food shouldn't be hard." start={0.4} size={112} weight={600} />
        </div>
        <div style={{ marginTop: 26 }}>
          <Words text="It should just work." start={2.6} size={112} weight={700} gold />
        </div>
      </Center>
    </Scene>
  );
};

/* ---------- scene 2: the reveal ---------- */
const S2: React.FC = () => {
  const t = useT();
  const glow = prog(t, 0.2, 2.5, INOUT);
  const intro = prog(t, 0.2, 1.0);
  const sub = prog(t, 2.6, 1.0);
  return (
    <Scene dur={T.s2.dur}>
      <AbsoluteFill
        style={{
          opacity: glow * 0.9,
          background: `radial-gradient(ellipse 900px 600px at 50% 52%, ${GOLD}38 0%, ${GOLD}00 70%)`,
        }}
      />
      <Center>
        <div
          style={{
            fontFamily: INTER,
            fontSize: 34,
            fontWeight: 500,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            color: GRAY,
            opacity: intro,
            transform: `translateY(${(1 - intro) * 20}px)`,
          }}
        >
          Introducing
        </div>
        <div style={{ marginTop: 10 }}>
          <Words text="Enflow" start={0.8} size={300} gold spacing={-0.04} />
        </div>
        <div style={{ marginTop: -6 }}>
          <Words text="Discovery" start={1.4} size={118} weight={300} spacing={-0.02} />
        </div>
        <div
          style={{
            marginTop: 46,
            fontFamily: INTER,
            fontSize: 42,
            fontWeight: 400,
            color: GRAY,
            opacity: sub,
            transform: `translateY(${(1 - sub) * 20}px)`,
          }}
        >
          Good food. Smooth service. Delivered across Ojo.
        </div>
      </Center>
    </Scene>
  );
};

/* ---------- scene 3: the product, in an iPhone ---------- */
const DISHES = [
  { num: "02", name: "Smoked Turkey Wings", tags: ["GLUTEN-FREE", "CHEF'S PICK"] },
  { num: "21", name: "Kids Chicken Pie", tags: ["KIDS", "SNACK"] },
  { num: "22", name: "Rice and Stew", tags: ["COMFORT", "NIGERIAN"] },
];

const Pic: React.FC<{ src?: string; w: number; h: number }> = ({
  src,
  w,
  h,
}) =>
  src ? (
    <Img
      src={staticFile(src)}
      style={{ width: w, height: h, objectFit: "cover", flexShrink: 0 }}
    />
  ) : (
    <div
      style={{
        width: w,
        height: h,
        flexShrink: 0,
        background: `linear-gradient(135deg, ${GOLD}, #5a3a14)`,
      }}
    />
  );

const PhoneHeader = memo(function PhoneHeader({ count }: { count: number }) {
  return (
    <div
      style={{
        height: 150,
        padding: "60px 24px 0",
        boxSizing: "border-box",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "#050505",
      }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <div
          style={{
            width: 34,
            height: 40,
            border: `1px solid ${GOLD}`,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 4,
          }}
        >
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ width: 3, height: 18, background: GOLD }} />
          ))}
        </div>
        <div
          style={{
            marginLeft: 14,
            fontFamily: MONO,
            fontWeight: 700,
            fontSize: 17,
            letterSpacing: 5,
            color: CREAM,
          }}
        >
          EN-FLOW
        </div>
      </div>
      <div
        style={{
          background: GOLD,
          color: "#000",
          height: 42,
          padding: "0 14px",
          borderRadius: 9,
          display: "flex",
          alignItems: "center",
          gap: 10,
          fontFamily: MONO,
          fontWeight: 700,
          fontSize: 14,
          letterSpacing: 3,
        }}
      >
        ORDER
        <div
          style={{
            background: "#000",
            color: GOLD,
            width: 24,
            height: 24,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {count}
        </div>
      </div>
    </div>
  );
});

const MenuContent = memo(function MenuContent({
  images,
}: {
  images: string[];
}) {
  return (
    <div>
      <div
        style={{
          display: "flex",
          height: 56,
          borderTop: `1px solid ${GOLD}30`,
          borderBottom: `1px solid ${GOLD}30`,
          overflow: "hidden",
        }}
      >
        {["ALL", "APPETIZERS", "MAIN"].map((tab, i) => (
          <div
            key={tab}
            style={{
              padding: "0 26px",
              display: "flex",
              alignItems: "center",
              fontFamily: MONO,
              fontSize: 14,
              letterSpacing: 3,
              color: i === 0 ? GOLD : `${CREAM}99`,
              background: i === 0 ? `${GOLD}22` : "transparent",
              borderBottom: i === 0 ? `2px solid ${GOLD}` : "none",
            }}
          >
            {tab}
          </div>
        ))}
      </div>
      <div
        style={{
          padding: "34px 24px 22px",
          fontFamily: SERIF,
          fontSize: 46,
          color: CREAM,
        }}
      >
        Popular
      </div>
      {DISHES.map((d, i) => (
        <div
          key={d.name}
          style={{
            position: "relative",
            margin: "0 24px",
            height: 210,
            display: "flex",
            borderTop: `1px solid ${GOLD}25`,
          }}
        >
          <div style={{ position: "relative", width: 150, height: 210 }}>
            <Pic src={images[i]} w={150} h={210} />
            <div
              style={{
                position: "absolute",
                top: 10,
                left: 10,
                background: "#000000b0",
                color: GOLD,
                fontFamily: MONO,
                fontSize: 12,
                padding: "4px 8px",
              }}
            >
              {d.num}
            </div>
            <div
              style={{
                position: "absolute",
                left: 8,
                right: 8,
                bottom: 8,
                display: "flex",
                flexWrap: "wrap",
                gap: 4,
              }}
            >
              {d.tags.map((tg) => (
                <div
                  key={tg}
                  style={{
                    background: "#000000cc",
                    color: CREAM,
                    fontFamily: MONO,
                    fontSize: 10,
                    letterSpacing: 1,
                    padding: "5px 6px",
                  }}
                >
                  {tg}
                </div>
              ))}
            </div>
          </div>
          <div style={{ marginLeft: 16, flex: 1, paddingTop: 16 }}>
            <div
              style={{
                fontFamily: SERIF,
                fontSize: 28,
                lineHeight: 1.1,
                color: CREAM,
              }}
            >
              {d.name}
            </div>
            <div
              style={{
                marginTop: 10,
                fontFamily: MONO,
                fontSize: 12,
                letterSpacing: 2,
                color: "#4ade80",
              }}
            >
              {"• IN STOCK"}
            </div>
          </div>
          <div
            style={{
              position: "absolute",
              left: 166,
              bottom: 16,
              width: 112,
              height: 44,
              boxSizing: "border-box",
              border: `1px solid ${CREAM}`,
              color: CREAM,
              fontFamily: MONO,
              fontWeight: 700,
              fontSize: 13,
              letterSpacing: 2,
              borderRadius: 10,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            ADD ORDER
          </div>
        </div>
      ))}
    </div>
  );
});

const CartContent = memo(function CartContent({
  images,
}: {
  images: string[];
}) {
  return (
    <div style={{ position: "relative", height: 722 }}>
      <div
        style={{
          padding: "26px 24px 18px",
          display: "flex",
          alignItems: "center",
          gap: 12,
          borderBottom: `1px solid ${GOLD}25`,
        }}
      >
        <div
          style={{
            fontFamily: MONO,
            fontSize: 12,
            letterSpacing: 3,
            color: GOLD,
          }}
        >
          CART /
        </div>
        <div
          style={{
            fontFamily: SERIF,
            fontSize: 32,
            letterSpacing: 2,
            color: CREAM,
            textTransform: "uppercase",
          }}
        >
          Guest Order
        </div>
      </div>
      {[0, 1].map((i) => (
        <div
          key={i}
          style={{
            margin: "0 24px",
            padding: "24px 0",
            display: "flex",
            borderBottom: `1px solid ${GOLD}25`,
          }}
        >
          <Pic src={images[i]} w={88} h={88} />
          <div style={{ marginLeft: 18 }}>
            <div style={{ fontFamily: SERIF, fontSize: 28, color: CREAM }}>
              {DISHES[i].name}
            </div>
            <div
              style={{
                marginTop: 12,
                fontFamily: MONO,
                fontSize: 18,
                color: CREAM,
              }}
            >
              - 1 +
            </div>
          </div>
        </div>
      ))}
      <div
        style={{
          margin: "26px 24px 0",
          padding: "18px 18px",
          background: `${GOLD}14`,
          border: `1px solid ${GOLD}40`,
          fontFamily: SANS,
          fontSize: 20,
          color: CREAM,
        }}
      >
        Delivery to your door
      </div>
      <div
        style={{
          position: "absolute",
          left: 24,
          right: 24,
          bottom: 28,
          height: 64,
          background: GOLD,
          color: "#000",
          borderRadius: 10,
          fontFamily: MONO,
          fontWeight: 700,
          fontSize: 16,
          letterSpacing: 4,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        PLACE ORDER
      </div>
    </div>
  );
});

const TrackContent = memo(function TrackContent() {
  const steps = ["Order confirmed", "Preparing your food", "On the way", "Delivered"];
  return (
    <div style={{ height: 722, padding: "34px 24px 0" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div
          style={{
            width: 84,
            height: 84,
            borderRadius: "50%",
            background: GOLD,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: 20,
              height: 38,
              borderRight: "7px solid #050505",
              borderBottom: "7px solid #050505",
              transform: "rotate(45deg) translate(-4px, -4px)",
            }}
          />
        </div>
        <div
          style={{
            marginTop: 20,
            fontFamily: SERIF,
            fontSize: 40,
            color: CREAM,
          }}
        >
          Order placed
        </div>
      </div>
      <div style={{ marginTop: 44, paddingLeft: 30 }}>
        {steps.map((s, i) => {
          const done = i < 3;
          return (
            <div
              key={s}
              style={{
                position: "relative",
                height: 86,
                display: "flex",
                alignItems: "flex-start",
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  boxSizing: "border-box",
                  border: `3px solid ${done ? GOLD : "#333"}`,
                  background: done ? GOLD : "transparent",
                  flexShrink: 0,
                }}
              />
              {i < 3 ? (
                <div
                  style={{
                    position: "absolute",
                    left: 12,
                    top: 32,
                    width: 4,
                    height: 54,
                    background: i < 2 ? GOLD : "#222",
                  }}
                />
              ) : null}
              <div
                style={{
                  marginLeft: 20,
                  fontFamily: SANS,
                  fontWeight: i === 2 ? 700 : 500,
                  fontSize: 24,
                  color: done ? CREAM : `${CREAM}55`,
                }}
              >
                {s}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

const StepText: React.FC<{
  from: number;
  to: number;
  head: string;
  sub: string;
}> = ({ from, to, head, sub }) => {
  const t = useT();
  if (t < from - 0.05 || t > to + 0.6) return null;
  const out = 1 - prog(t, to - 0.1, 0.45, INOUT);
  return (
    <div
      style={{
        position: "absolute",
        left: 150,
        top: 0,
        bottom: 0,
        width: 900,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        opacity: out,
      }}
    >
      <Words text={head} start={from} size={176} align="flex-start" gold />
      <div style={{ marginTop: 26, maxWidth: 740 }}>
        <Words
          text={sub}
          start={from + 0.35}
          size={44}
          weight={400}
          color="#a1a1a6"
          align="flex-start"
          stagger={0.03}
          spacing={-0.01}
        />
      </div>
    </div>
  );
};

const S3: React.FC<{ dishImages: string[] }> = ({ dishImages }) => {
  const t = useT();
  const rise = prog(t, 0.3, 1.6);
  const ry = -26 + rise * 16 + (t / T.s3.dur) * 4;
  const y = (1 - rise) * 900;

  const menuO = 1 - prog(t, 2.5, 0.5, INOUT);
  const cartO = prog(t, 2.5, 0.5, INOUT) * (1 - prog(t, 5.1, 0.5, INOUT));
  const trackO = prog(t, 5.1, 0.5, INOUT);
  const scroll = -150 * prog(t, 0.9, 1.6, INOUT);

  const header0 = useMemo(() => <PhoneHeader count={0} />, []);
  const header2 = useMemo(() => <PhoneHeader count={2} />, []);
  const menu = useMemo(() => <MenuContent images={dishImages} />, [dishImages]);
  const cart = useMemo(() => <CartContent images={dishImages} />, [dishImages]);
  const track = useMemo(() => <TrackContent />, []);

  return (
    <Scene dur={T.s3.dur}>
      <AbsoluteFill
        style={{
          opacity: rise * 0.9,
          background: `radial-gradient(ellipse 700px 700px at 72% 52%, ${GOLD}30 0%, ${GOLD}00 70%)`,
        }}
      />
      <StepText from={0.9} to={2.6} head="Pick." sub="A menu that feels effortless." />
      <StepText from={3.1} to={5.2} head="Order." sub="One tap to a smooth checkout." />
      <StepText from={5.7} to={9} head="Delivered." sub="Track every step, right to your door." />

      <div
        style={{
          position: "absolute",
          left: 1100,
          top: 62,
          willChange: "transform",
          transform: `perspective(2400px) translate3d(0, ${y}px, 0) rotateY(${ry}deg) rotateX(${(1 - rise) * 8}deg)`,
        }}
      >
        <IPhoneFrame scale={1.05}>
          <div style={{ position: "relative", width: 400, height: 872, background: "#050505" }}>
            <div style={{ position: "absolute", inset: 0, opacity: menuO }}>
              {header0}
              <div style={{ height: 722, overflow: "hidden" }}>
                <div style={{ transform: `translate3d(0, ${scroll}px, 0)` }}>{menu}</div>
              </div>
            </div>
            <div style={{ position: "absolute", inset: 0, opacity: cartO }}>
              {header2}
              {cart}
            </div>
            <div style={{ position: "absolute", inset: 0, opacity: trackO }}>
              {header2}
              {track}
            </div>
          </div>
        </IPhoneFrame>
      </div>
    </Scene>
  );
};

/* ---------- scene 4: three promises, one at a time ---------- */
const Slide: React.FC<{
  from: number;
  to: number;
  head: string;
  sub: string;
}> = ({ from, to, head, sub }) => {
  const t = useT();
  if (t < from - 0.05 || t > to + 0.6) return null;
  const out = 1 - prog(t, to - 0.1, 0.45, INOUT);
  const line = prog(t, from, 1.0);
  const subP = prog(t, from + 0.5, 0.9);
  return (
    <Center>
      <div style={{ opacity: out, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div
          style={{
            width: 240 * line,
            height: 4,
            background: GOLD,
            marginBottom: 40,
          }}
        />
        <Words text={head} start={from} size={230} gold />
        <div
          style={{
            marginTop: 30,
            fontFamily: INTER,
            fontSize: 52,
            fontWeight: 400,
            color: "#a1a1a6",
            opacity: subP,
            transform: `translateY(${(1 - subP) * 20}px)`,
          }}
        >
          {sub}
        </div>
      </div>
    </Center>
  );
};

const S4: React.FC = () => (
  <Scene dur={T.s4.dur}>
    <Slide from={0.2} to={2.7} head="Good service." sub="Every order handled with care." />
    <Slide from={2.9} to={5.3} head="Quality food." sub="Fresh from kitchens you can trust." />
    <Slide from={5.5} to={9} head="Fair prices." sub="Because great food is for everyone." />
  </Scene>
);

/* ---------- scene 5: built for Ojo ---------- */
const LANDMARKS = [
  "Alaba International Market",
  "Trade Fair",
  "LASU",
  "Unique Open University",
  "ECOWAS Road",
];

const S5: React.FC<{ area: string; images: string[] }> = ({ area, images }) => {
  const t = useT();
  const sub = prog(t, 1.0, 1.0);
  const pan = 900 * prog(t, 0.6, 5.4, Easing.bezier(0.45, 0, 0.25, 1));
  return (
    <Scene dur={T.s5.dur}>
      <div style={{ position: "absolute", top: 70, width: "100%" }}>
        <Words text={`Built for ${area}.`} start={0.2} size={130} gold />
      </div>
      <div
        style={{
          position: "absolute",
          top: 226,
          width: "100%",
          textAlign: "center",
          fontFamily: INTER,
          fontSize: 38,
          color: GRAY,
          opacity: sub,
        }}
      >
        From Alaba to LASU. From ECOWAS Road to your door.
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 330,
          width: 1920,
          height: 670,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 40,
            paddingLeft: 140,
            transform: `translate3d(${-pan}px, 0, 0)`,
            willChange: "transform",
          }}
        >
          {LANDMARKS.map((name, i) => {
            const p = prog(t, 0.3 + i * 0.12, 1.0);
            return (
              <div
                key={name}
                style={{
                  position: "relative",
                  width: 520,
                  height: 670,
                  flexShrink: 0,
                  borderRadius: 28,
                  overflow: "hidden",
                  background: "#111",
                  opacity: p,
                  transform: `translateY(${(1 - p) * 70}px)`,
                }}
              >
                {images[i] ? (
                  <Img
                    src={staticFile(images[i])}
                    style={{
                      position: "absolute",
                      left: -60,
                      top: 0,
                      width: 640,
                      height: 670,
                      objectFit: "cover",
                      transform: `translate3d(${-pan * 0.06}px, 0, 0)`,
                    }}
                  />
                ) : (
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: `linear-gradient(135deg, ${GOLD}55, #1a120b)`,
                    }}
                  />
                )}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0) 45%)",
                  }}
                />
                <div style={{ position: "absolute", left: 32, bottom: 32 }}>
                  <div
                    style={{
                      fontFamily: INTER,
                      fontSize: 18,
                      fontWeight: 600,
                      letterSpacing: "0.26em",
                      color: GOLD,
                    }}
                  >
                    OJO, LAGOS
                  </div>
                  <div
                    style={{
                      marginTop: 8,
                      fontFamily: INTER,
                      fontSize: 40,
                      fontWeight: 600,
                      color: WHITE,
                    }}
                  >
                    {name}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Scene>
  );
};

/* ---------- scene 6: the offer, then the lockup ---------- */
const S6: React.FC<{
  area: string;
  discountLabel: string;
  ctaLink: string;
}> = ({ area, discountLabel, ctaLink }) => {
  const t = useT();
  const aOut = 1 - prog(t, 2.8, 0.5, INOUT);
  const logo = prog(t, 3.4, 1.0);
  const where = prog(t, 4.6, 1.0);
  const link = prog(t, 5.3, 1.0);
  return (
    <Scene dur={T.s6.dur}>
      {t < 3.4 ? (
        <Center>
          <div style={{ opacity: aOut, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div
              style={{
                fontFamily: INTER,
                fontSize: 32,
                fontWeight: 500,
                letterSpacing: "0.32em",
                textTransform: "uppercase",
                color: GRAY,
                marginBottom: 20,
                opacity: prog(t, 0.2, 0.9),
              }}
            >
              Welcome offer
            </div>
            <Words text="Your first 3 orders." start={0.5} size={150} gold />
            <div style={{ marginTop: 28, maxWidth: 1200 }}>
              <Words
                text={`Within your first 10 days, enjoy a ${discountLabel}.`}
                start={1.4}
                size={48}
                weight={400}
                color="#a1a1a6"
                stagger={0.04}
                spacing={-0.01}
              />
            </div>
          </div>
        </Center>
      ) : null}
      {t >= 3.3 ? (
        <Center>
          <div
            style={{
              width: 100,
              height: 116,
              border: `3px solid ${GOLD}`,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 12,
              opacity: logo,
              transform: `scale(${0.8 + logo * 0.2})`,
            }}
          >
            {[0, 1, 2].map((i) => (
              <div key={i} style={{ width: 8, height: 54, background: GOLD }} />
            ))}
          </div>
          <div style={{ marginTop: 36 }}>
            <Words text="Enflow Discovery" start={3.7} size={150} spacing={-0.035} />
          </div>
          <div
            style={{
              marginTop: 26,
              fontFamily: INTER,
              fontSize: 44,
              fontWeight: 500,
              letterSpacing: "0.04em",
              color: GOLD,
              opacity: where,
              transform: `translateY(${(1 - where) * 20}px)`,
            }}
          >
            {`Now serving ${area}, Lagos.`}
          </div>
          {ctaLink ? (
            <div
              style={{
                marginTop: 50,
                padding: "20px 48px",
                borderRadius: 40,
                background: GOLD,
                color: "#000",
                fontFamily: INTER,
                fontWeight: 600,
                fontSize: 36,
                opacity: link,
                transform: `translateY(${(1 - link) * 20}px)`,
              }}
            >
              {ctaLink}
            </div>
          ) : null}
        </Center>
      ) : null}
    </Scene>
  );
};

/* ---------- the film ---------- */
export const EnflowLaunch: React.FC<LaunchProps> = (props) => {
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Sequence from={sec(T.s1.from)} durationInFrames={sec(T.s1.dur)}>
        <S1 />
      </Sequence>
      <Sequence from={sec(T.s2.from)} durationInFrames={sec(T.s2.dur)}>
        <S2 />
      </Sequence>
      <Sequence from={sec(T.s3.from)} durationInFrames={sec(T.s3.dur)}>
        <S3 dishImages={props.dishImages} />
      </Sequence>
      <Sequence from={sec(T.s4.from)} durationInFrames={sec(T.s4.dur)}>
        <S4 />
      </Sequence>
      <Sequence from={sec(T.s5.from)} durationInFrames={sec(T.s5.dur)}>
        <S5 area={props.area} images={props.landmarkImages} />
      </Sequence>
      <Sequence from={sec(T.s6.from)} durationInFrames={sec(T.s6.dur)}>
        <S6
          area={props.area}
          discountLabel={props.discountLabel}
          ctaLink={props.ctaLink}
        />
      </Sequence>
    </AbsoluteFill>
  );
};

const launchDefaults: LaunchProps = {
  area: "Ojo",
  discountLabel: "special discount",
  ctaLink: "",
  landmarkImages: ["alaba.jpg", "tradefair.jpg", "lasu.jpg", "unique.jpg", "ecowas.jpg"],
  dishImages: ["wings.jpg", "pie.jpg"],
};

export const LaunchComposition: React.FC = () => (
  <Composition
    id="EnflowLaunch"
    component={EnflowLaunch}
    durationInFrames={LAUNCH_DURATION}
    fps={LAUNCH_FPS}
    width={1920}
    height={1080}
    defaultProps={launchDefaults}
  />
);

