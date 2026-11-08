import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont as loadSerif } from "@remotion/google-fonts/CormorantGaramond";
import { loadFont as loadSans } from "@remotion/google-fonts/SpaceGrotesk";
import { loadFont as loadMono } from "@remotion/google-fonts/SpaceMono";
import { IPhoneFrame } from "./IPhoneFrame";

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

export type OjoStudentProps = {
  studentName: string;
  studentLine: string;
  studentImage: string;
  dishImages: string[];
};

const GOLD = "#d4a853";
const CREAM = "#f5ead6";

const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

const STAGES = [
  { from: 48, text: "Pick." },
  { from: 118, text: "Open your order." },
  { from: 186, text: "Choose delivery." },
  { from: 244, text: "Pay." },
  { from: 376, text: "Done." },
];
const FINAL_FROM = 452;

const DISHES = [
  { num: "02", name: "Smoked Turkey Wings", tags: ["GLUTEN-FREE", "CHEF'S PICK"], left: "9 LEFT" },
  { num: "21", name: "Kids Chicken Pie", tags: ["KIDS", "SNACK"], left: "20 LEFT" },
];

const Ripple: React.FC<{ x: number; y: number; at: number }> = ({
  x,
  y,
  at,
}) => {
  const f = useCurrentFrame();
  const t = f - at;
  if (t < 0 || t > 18) return null;
  const s = interpolate(t, [0, 18], [0.3, 1.4]);
  const o = interpolate(t, [0, 18], [0.7, 0]);
  return (
    <div
      style={{
        position: "absolute",
        left: x - 40,
        top: y - 40,
        width: 80,
        height: 80,
        borderRadius: "50%",
        background: "#fff",
        opacity: o * 0.6,
        transform: `scale(${s})`,
        zIndex: 50,
      }}
    />
  );
};

const Thumb: React.FC<{ src?: string; w: number; h: number }> = ({
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

/* everything drawn inside the iPhone screen (400 x 872) */
const StudentScreen: React.FC<{ dishImages: string[] }> = ({
  dishImages,
}) => {
  const f = useCurrentFrame();
  const fps = 30;
  const press = (a: number) =>
    interpolate(f, [a, a + 6, a + 12], [1, 0.9, 1], clamp);
  const sp = (delay: number, damping = 200) =>
    spring({ frame: f - delay, fps, config: { damping } });
  const typed = (text: string, start: number, end: number) =>
    text.slice(
      0,
      Math.floor(interpolate(f, [start, end], [0, text.length], clamp))
    );
  const caret = (start: number, end: number) =>
    f >= start && f <= end + 12 && Math.floor(f / 8) % 2 === 0 ? "|" : "";

  const added = f >= 90;
  const cartPulse = interpolate(f, [118, 124, 132], [1, 1.12, 1], clamp);
  const drawer = sp(126);
  const modalP = sp(186);
  const formP = sp(240);
  const succP = sp(372);
  const deliveryFlash = interpolate(f, [226, 230, 238], [0, 1, 0], clamp);

  const steps = [
    { t: "Order confirmed", at: 380 },
    { t: "Preparing your food", at: 400 },
    { t: "On the way", at: 420 },
    { t: "Delivered", at: 448 },
  ];

  const labelStyle = {
    fontFamily: MONO,
    fontSize: 12,
    letterSpacing: 3,
    color: `${CREAM}99`,
    marginBottom: 8,
  } as const;
  const inputStyle = {
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

  return (
    <div
      style={{
        position: "relative",
        width: 400,
        height: 872,
        background: "#050505",
        overflow: "hidden",
      }}
    >
      {/* header */}
      <div
        style={{
          height: 150,
          padding: "60px 24px 0",
          boxSizing: "border-box",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
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
            transform: `scale(${cartPulse})`,
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
            {added ? 1 : 0}
          </div>
        </div>
      </div>

      {/* tabs */}
      <div
        style={{
          display: "flex",
          height: 56,
          borderTop: `1px solid ${GOLD}30`,
          borderBottom: `1px solid ${GOLD}30`,
          overflow: "hidden",
        }}
      >
        {["ALL", "APPETIZERS", "MAIN"].map((t, i) => (
          <div
            key={t}
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
            {t}
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

      {DISHES.map((d, i) => {
        const p = sp(30 + i * 10, 14);
        const isAdded = i === 0 && added;
        return (
          <div
            key={d.name}
            style={{
              position: "relative",
              margin: "0 24px",
              height: 210,
              display: "flex",
              borderTop: `1px solid ${GOLD}25`,
              opacity: p,
              transform: `translateX(${(1 - p) * 160}px)`,
            }}
          >
            <div style={{ position: "relative", width: 150, height: 210 }}>
              <Thumb src={dishImages[i]} w={150} h={210} />
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
                {d.tags.map((t) => (
                  <div
                    key={t}
                    style={{
                      background: "#000000cc",
                      color: CREAM,
                      fontFamily: MONO,
                      fontSize: 10,
                      letterSpacing: 1,
                      padding: "5px 6px",
                    }}
                  >
                    {t}
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
                {"• "}
                {d.left}
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
                border: `1px solid ${isAdded ? GOLD : CREAM}`,
                background: isAdded ? GOLD : "transparent",
                color: isAdded ? "#000" : CREAM,
                fontFamily: MONO,
                fontWeight: 700,
                fontSize: 13,
                letterSpacing: 2,
                borderRadius: 10,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                transform: `scale(${i === 0 ? press(84) : 1})`,
              }}
            >
              {isAdded ? "ADDED" : "ADD ORDER"}
            </div>
          </div>
        );
      })}

      {/* cart drawer */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "#0a0a0a",
          borderLeft: `1px solid ${GOLD}30`,
          transform: `translateX(${(1 - drawer) * 400}px)`,
        }}
      >
        <div
          style={{
            height: 100,
            padding: "56px 24px 0",
            boxSizing: "border-box",
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
              fontSize: 30,
              letterSpacing: 2,
              color: CREAM,
              textTransform: "uppercase",
            }}
          >
            Guest Order
          </div>
        </div>
        <div
          style={{
            margin: "0 24px",
            padding: "26px 0",
            display: "flex",
            borderBottom: `1px solid ${GOLD}25`,
          }}
        >
          <Thumb src={dishImages[0]} w={84} h={84} />
          <div style={{ marginLeft: 18 }}>
            <div style={{ fontFamily: SERIF, fontSize: 28, color: CREAM }}>
              {DISHES[0].name}
            </div>
            <div
              style={{
                marginTop: 10,
                fontFamily: MONO,
                fontSize: 18,
                color: CREAM,
              }}
            >
              - 1 +
            </div>
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            left: 24,
            right: 24,
            bottom: 32,
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
            transform: `scale(${press(172)})`,
          }}
        >
          PLACE ORDER
        </div>
      </div>

      {/* how would you like to order */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.78)",
          opacity: modalP * (1 - formP),
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 20,
            right: 20,
            top: 230,
            height: 420,
            boxSizing: "border-box",
            padding: 28,
            background: "#0a0a0a",
            borderTop: `2px solid ${GOLD}`,
            transform: `translateY(${(1 - modalP) * 200}px)`,
          }}
        >
          <div
            style={{
              fontFamily: MONO,
              fontSize: 12,
              letterSpacing: 4,
              color: GOLD,
            }}
          >
            STEP 01
          </div>
          <div
            style={{
              marginTop: 14,
              fontFamily: SERIF,
              fontSize: 38,
              lineHeight: 1.1,
              color: CREAM,
            }}
          >
            How would you like to order?
          </div>
        </div>
        {[
          { t: "DINE IN ORDER", soon: true, y: 430 },
          { t: "DELIVERY ORDER", soon: false, y: 494 },
          { t: "PICKUP ORDER", soon: true, y: 558 },
        ].map((o) => (
          <div
            key={o.t}
            style={{
              position: "absolute",
              left: 48,
              right: 48,
              top: o.y + (1 - modalP) * 200,
              height: 60,
              boxSizing: "border-box",
              display: "flex",
              alignItems: "center",
              padding: "0 16px",
              background: o.soon
                ? "#141414"
                : `rgba(212,168,83,${0.1 + deliveryFlash * 0.4})`,
              color: o.soon ? `${CREAM}55` : CREAM,
              fontFamily: MONO,
              fontSize: 13,
              letterSpacing: 3,
              transform: `scale(${o.soon ? 1 : press(226)})`,
            }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                border: `1px solid ${o.soon ? "#333" : GOLD}`,
                marginRight: 16,
              }}
            />
            {o.t}
            {o.soon ? (
              <div style={{ marginLeft: "auto", fontSize: 10 }}>COMING SOON</div>
            ) : null}
          </div>
        ))}
      </div>

      {/* delivery details form */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "#0a0a0a",
          padding: "70px 24px 0",
          boxSizing: "border-box",
          transform: `translateX(${(1 - formP) * 400}px)`,
        }}
      >
        <div
          style={{
            fontFamily: MONO,
            fontSize: 12,
            letterSpacing: 4,
            color: GOLD,
          }}
        >
          DELIVERY ORDER
        </div>
        <div
          style={{
            marginTop: 14,
            fontFamily: SERIF,
            fontSize: 42,
            lineHeight: 1.05,
            color: CREAM,
          }}
        >
          Enter your delivery details
        </div>

        <div style={{ marginTop: 32 }}>
          <div style={labelStyle}>FULL NAME</div>
          <div style={inputStyle}>
            {typed("Amaka Obi", 252, 282)}
            {caret(252, 282)}
          </div>
        </div>
        <div style={{ marginTop: 20 }}>
          <div style={labelStyle}>PHONE NUMBER</div>
          <div style={{ display: "flex", gap: 8 }}>
            <div style={{ ...inputStyle, width: 70, padding: 0, justifyContent: "center" }}>
              <div style={{ display: "flex", width: 30, height: 20 }}>
                <div style={{ flex: 1, background: "#008751" }} />
                <div style={{ flex: 1, background: "#fff" }} />
                <div style={{ flex: 1, background: "#008751" }} />
              </div>
            </div>
            <div style={{ ...inputStyle, flex: 1 }}>
              {typed("+234 801 234 5678", 262, 292)}
              {caret(262, 292)}
            </div>
          </div>
        </div>
        <div style={{ marginTop: 20 }}>
          <div style={labelStyle}>DELIVERY ADDRESS</div>
          <div style={{ display: "flex", gap: 8 }}>
            <div style={{ ...inputStyle, flex: 1, fontSize: 16 }}>
              {typed("Near LASU gate, Ojo", 292, 330)}
              {caret(292, 330)}
            </div>
            <div
              style={{
                ...inputStyle,
                width: 96,
                padding: 0,
                justifyContent: "center",
                fontFamily: MONO,
                fontSize: 10,
                letterSpacing: 2,
                color: `${CREAM}99`,
              }}
            >
              USE LOCATION
            </div>
          </div>
        </div>

        <div
          style={{
            marginTop: 40,
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
            transform: `scale(${press(340)})`,
          }}
        >
          {f >= 352 && f < 372 ? (
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                border: "4px solid #00000030",
                borderTopColor: "#000",
                transform: `rotate(${f * 20}deg)`,
              }}
            />
          ) : (
            "SUBMIT & PAY"
          )}
        </div>
      </div>

      {/* order placed + tracker */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "#050505",
          padding: "110px 24px 0",
          boxSizing: "border-box",
          transform: `translateY(${(1 - succP) * 872}px)`,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div
            style={{
              width: 96,
              height: 96,
              borderRadius: "50%",
              background: GOLD,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div
              style={{
                width: 22,
                height: 42,
                borderRight: "8px solid #050505",
                borderBottom: "8px solid #050505",
                transform: "rotate(45deg) translate(-4px, -4px)",
              }}
            />
          </div>
          <div
            style={{
              marginTop: 24,
              fontFamily: SERIF,
              fontSize: 44,
              color: CREAM,
            }}
          >
            Order placed
          </div>
        </div>
        <div style={{ marginTop: 50, paddingLeft: 30 }}>
          {steps.map((s, i) => {
            const p = interpolate(f, [s.at, s.at + 8], [0, 1], clamp);
            const last = i === steps.length - 1;
            return (
              <div
                key={s.t}
                style={{
                  position: "relative",
                  height: 86,
                  display: "flex",
                  alignItems: "flex-start",
                }}
              >
                <div
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: "50%",
                    boxSizing: "border-box",
                    border: `3px solid ${p > 0.5 ? GOLD : "#333"}`,
                    background: p > 0.5 ? GOLD : "transparent",
                    flexShrink: 0,
                  }}
                />
                {!last ? (
                  <div
                    style={{
                      position: "absolute",
                      left: 13,
                      top: 34,
                      width: 4,
                      height: 52,
                      background: "#222",
                    }}
                  >
                    <div
                      style={{
                        width: 4,
                        height: `${p * 100}%`,
                        background: GOLD,
                      }}
                    />
                  </div>
                ) : null}
                <div
                  style={{
                    marginLeft: 22,
                    fontFamily: SANS,
                    fontWeight: last && p > 0.5 ? 700 : 500,
                    fontSize: 24,
                    color: p > 0.5 ? CREAM : `${CREAM}55`,
                  }}
                >
                  {s.t}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Ripple x={246} y={489} at={84} />
      <Ripple x={316} y={105} at={118} />
      <Ripple x={200} y={808} at={172} />
      <Ripple x={200} y={524} at={226} />
      <Ripple x={200} y={592} at={340} />
    </div>
  );
};

const Caption: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (f < STAGES[0].from) return null;
  const final = f >= FINAL_FROM;
  let stage = STAGES[0];
  for (const s of STAGES) {
    if (f >= s.from) stage = s;
  }
  const from = final ? FINAL_FROM : stage.from;
  const p = spring({ frame: f - from, fps, config: { damping: 14 } });
  return (
    <div
      style={{
        position: "absolute",
        top: 120,
        width: "100%",
        textAlign: "center",
        padding: "0 60px",
        boxSizing: "border-box",
        opacity: p,
        transform: `translateY(${(1 - p) * 60}px)`,
      }}
    >
      {final ? (
        <>
          <div style={{ fontFamily: SERIF, fontSize: 118, lineHeight: 1, color: CREAM }}>
            Delivered fast.
          </div>
          <div
            style={{
              fontFamily: SERIF,
              fontStyle: "italic",
              fontSize: 118,
              lineHeight: 1,
              color: GOLD,
            }}
          >
            Right on time.
          </div>
        </>
      ) : (
        <div style={{ fontFamily: SERIF, fontSize: 150, lineHeight: 1.05, color: CREAM }}>
          {stage.text}
        </div>
      )}
    </div>
  );
};

export const OjoStudent: React.FC<OjoStudentProps> = ({
  studentName,
  studentLine,
  studentImage,
  dishImages,
}) => {
  const f = useCurrentFrame();
  const rise = spring({
    frame: f - 10,
    fps: 30,
    config: { damping: 14 },
  });
  const nameIn = spring({ frame: f - 2, fps: 30, config: { damping: 14 } });
  const introOut = interpolate(f, [36, 46], [1, 0], clamp);
  const out = interpolate(f, [530, 540], [1, 0], clamp);
  const glow = interpolate(f, [0, 30], [0, 1], clamp);

  return (
    <AbsoluteFill style={{ background: "#050505", opacity: out }}>
      {studentImage ? (
        <AbsoluteFill>
          <Img
            src={staticFile(studentImage)}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <AbsoluteFill style={{ background: "rgba(5,5,5,0.72)" }} />
        </AbsoluteFill>
      ) : null}
      <AbsoluteFill
        style={{ justifyContent: "center", alignItems: "center", opacity: glow }}
      >
        <div
          style={{
            width: 1700,
            height: 1700,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${GOLD}55 0%, ${GOLD}00 62%)`,
          }}
        />
      </AbsoluteFill>

      <div
        style={{
          position: "absolute",
          top: 130,
          width: "100%",
          textAlign: "center",
          padding: "0 70px",
          boxSizing: "border-box",
          opacity: introOut * nameIn,
          transform: `translateY(${(1 - nameIn) * 60}px)`,
        }}
      >
        <div style={{ fontFamily: SERIF, fontSize: 150, lineHeight: 1, color: CREAM }}>
          Meet{" "}
          <span style={{ fontStyle: "italic", color: GOLD }}>{studentName}.</span>
        </div>
        <div
          style={{
            marginTop: 26,
            fontFamily: SANS,
            fontSize: 44,
            color: `${CREAM}cc`,
          }}
        >
          {studentLine}
        </div>
      </div>

      <Caption />

      <div
        style={{
          position: "absolute",
          left: (1080 - 438 * 1.5) / 2,
          top: 380,
          transform: `translateY(${(1 - rise) * 1500}px)`,
        }}
      >
        <IPhoneFrame scale={1.5}>
          <StudentScreen dishImages={dishImages} />
        </IPhoneFrame>
      </div>
    </AbsoluteFill>
  );
};

