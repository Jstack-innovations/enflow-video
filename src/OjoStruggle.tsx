import { memo, useMemo } from "react";
import {
  AbsoluteFill,
  Img,
  Sequence,
  Video,
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

export type OjoStruggleProps = {
  confusedImage: string;
  kitchenImage: string;
  dishImage: string;
  appNames: string[];
};

const GOLD = "#d4a853";
const CREAM = "#f5ead6";
const RED = "#ef4444";

const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

const useIn = (delay = 0, damping = 12) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: { damping } });
};

const Fade: React.FC<{
  len: number;
  out?: boolean;
  children: React.ReactNode;
}> = ({ len, out = true, children }) => {
  const frame = useCurrentFrame();
  const o = out
    ? interpolate(frame, [0, 6, len - 8, len], [0, 1, 1, 0], clamp)
    : interpolate(frame, [0, 6], [0, 1], clamp);
  return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>;
};

const fmt = (m: number) =>
  `${Math.floor(m / 60)}h ${String(m % 60).padStart(2, "0")}m`;

/* cheap static overlays */
const Vignette: React.FC = () => (
  <AbsoluteFill
    style={{
      background:
        "radial-gradient(ellipse at center, rgba(0,0,0,0) 40%, rgba(0,0,0,0.7) 100%)",
    }}
  />
);

const GridBg: React.FC = () => (
  <AbsoluteFill
    style={{
      backgroundImage: `repeating-linear-gradient(0deg, ${GOLD}0d 0px, ${GOLD}0d 1px, transparent 1px, transparent 120px), repeating-linear-gradient(90deg, ${GOLD}0d 0px, ${GOLD}0d 1px, transparent 1px, transparent 120px)`,
    }}
  />
);

const Chapter: React.FC<{ n: string; label: string }> = ({ n, label }) => (
  <div
    style={{
      position: "absolute",
      top: 56,
      left: 64,
      fontFamily: MONO,
      fontWeight: 700,
      fontSize: 24,
      letterSpacing: 6,
      color: GOLD,
    }}
  >
    {n} / {label}
  </div>
);

/* photo or video background */
const Media: React.FC<{ src: string; label: string; dim?: number }> = ({
  src,
  label,
  dim = 0.4,
}) => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, 150], [1, 1.1], clamp);

  if (!src) {
    return (
      <AbsoluteFill
        style={{
          background: "linear-gradient(160deg, #2a1d12, #0d0804)",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            fontFamily: MONO,
            fontSize: 34,
            letterSpacing: 5,
            color: GOLD,
            opacity: 0.45,
            textAlign: "center",
            padding: "0 80px",
          }}
        >
          {label}
        </div>
      </AbsoluteFill>
    );
  }

  const isImage = /\.(jpe?g|png|webp)$/i.test(src);
  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{ transform: `scale(${scale})`, willChange: "transform" }}
      >
        {isImage ? (
          <Img
            src={staticFile(src)}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <Video
            src={staticFile(src)}
            muted
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        )}
      </AbsoluteFill>
      <AbsoluteFill style={{ background: `rgba(5,5,5,${dim})` }} />
      <Vignette />
    </AbsoluteFill>
  );
};

/* ---------- realistic but generic delivery-app screens (static, memoised) ---------- */
const APP_COLORS = ["#f97316", "#16a34a", "#7c3aed", "#2563eb"];
const BASE: React.CSSProperties = {
  position: "relative",
  width: 400,
  height: 872,
  background: "#f4f4f6",
  fontFamily: SANS,
  overflow: "hidden",
};

const Header: React.FC<{ color: string; name: string; h?: number }> = ({
  color,
  name,
  h = 150,
}) => (
  <div
    style={{
      height: h,
      background: color,
      display: "flex",
      alignItems: "flex-end",
      justifyContent: "center",
      paddingBottom: 20,
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: "50%",
          background: "#fff",
          color,
          fontWeight: 700,
          fontSize: 26,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {name[0]}
      </div>
      <div style={{ color: "#fff", fontWeight: 700, fontSize: 30 }}>{name}</div>
    </div>
  </div>
);

const ErrBadge: React.FC<{ size?: number }> = ({ size = 84 }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: "50%",
      background: RED,
      color: "#fff",
      fontWeight: 700,
      fontSize: size * 0.62,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    !
  </div>
);

const Btn: React.FC<{ color: string; label: string; w?: number }> = ({
  color,
  label,
  w = 240,
}) => (
  <div
    style={{
      width: w,
      height: 60,
      borderRadius: 30,
      background: color,
      color: "#fff",
      fontWeight: 700,
      fontSize: 22,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    {label}
  </div>
);

const ScreenList: React.FC<{ color: string; name: string }> = ({
  color,
  name,
}) => (
  <div style={BASE}>
    <Header color={color} name={name} />
    <div
      style={{
        margin: "20px 20px 0",
        height: 54,
        borderRadius: 27,
        background: "#e8e8ed",
        padding: "0 22px",
        display: "flex",
        alignItems: "center",
        fontSize: 20,
        color: "#999",
      }}
    >
      Search restaurants
    </div>
    <div style={{ display: "flex", gap: 10, margin: "18px 20px" }}>
      {["Nearby", "Popular", "Fast", "Offers"].map((c, i) => (
        <div
          key={c}
          style={{
            padding: "8px 16px",
            borderRadius: 20,
            fontSize: 17,
            background: i === 0 ? color : "#fff",
            color: i === 0 ? "#fff" : "#555",
          }}
        >
          {c}
        </div>
      ))}
    </div>
    {["Mama's Kitchen", "Grill House"].map((t) => (
      <div
        key={t}
        style={{
          margin: "0 20px 16px",
          height: 190,
          borderRadius: 20,
          background: "#fff",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: 112,
            background: `linear-gradient(135deg, ${color}, #3a2a1a)`,
          }}
        />
        <div style={{ padding: "12px 16px" }}>
          <div style={{ fontWeight: 700, fontSize: 22, color: "#222" }}>{t}</div>
          <div style={{ fontSize: 17, color: "#888", marginTop: 4 }}>
            4.5 stars · 25-35 min
          </div>
        </div>
      </div>
    ))}
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "rgba(0,0,0,0.62)",
      }}
    />
    <div
      style={{
        position: "absolute",
        left: 40,
        right: 40,
        top: 300,
        height: 310,
        borderRadius: 28,
        background: "#fff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "36px 24px 0",
        boxSizing: "border-box",
      }}
    >
      <ErrBadge />
      <div style={{ marginTop: 20, fontWeight: 700, fontSize: 32, color: "#111" }}>
        Order failed
      </div>
      <div style={{ marginTop: 8, fontSize: 19, color: "#666", textAlign: "center" }}>
        Something went wrong. Please try again.
      </div>
      <div style={{ marginTop: 22 }}>
        <Btn color={color} label="Try again" w={220} />
      </div>
    </div>
  </div>
);

const ScreenCheckout: React.FC<{ color: string; name: string }> = ({
  color,
  name,
}) => (
  <div style={BASE}>
    <Header color={color} name={name} />
    <div style={{ padding: "24px 20px 0", fontWeight: 700, fontSize: 34, color: "#111" }}>
      Checkout
    </div>
    {[
      ["Jollof Rice and Chicken", "x1"],
      ["Fried Plantain", "x2"],
    ].map(([t, q]) => (
      <div
        key={t}
        style={{
          margin: "16px 20px 0",
          height: 84,
          borderRadius: 18,
          background: "#fff",
          padding: "0 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontSize: 21,
          color: "#222",
        }}
      >
        <span>{t}</span>
        <span style={{ color: "#888" }}>{q}</span>
      </div>
    ))}
    <div
      style={{
        margin: "16px 20px 0",
        height: 84,
        borderRadius: 18,
        background: "#fff",
        padding: "0 20px",
        display: "flex",
        alignItems: "center",
        gap: 16,
        fontSize: 21,
        color: "#222",
      }}
    >
      <div style={{ width: 52, height: 36, borderRadius: 8, background: "#ddd" }} />
      Card payment
    </div>
    <div style={{ position: "absolute", left: 20, right: 20, bottom: 40 }}>
      <div
        style={{
          height: 64,
          borderRadius: 32,
          background: "#bbb",
          color: "#fff",
          fontWeight: 700,
          fontSize: 24,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        Pay now
      </div>
    </div>
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "rgba(0,0,0,0.55)",
      }}
    />
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: 360,
        borderRadius: "32px 32px 0 0",
        background: "#fff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "36px 24px 0",
        boxSizing: "border-box",
      }}
    >
      <ErrBadge size={76} />
      <div style={{ marginTop: 18, fontWeight: 700, fontSize: 32, color: "#111" }}>
        Payment error
      </div>
      <div style={{ marginTop: 8, fontSize: 19, color: "#666", textAlign: "center" }}>
        We could not process your payment.
      </div>
      <div style={{ marginTop: 24 }}>
        <Btn color={color} label="Try again" w={260} />
      </div>
    </div>
  </div>
);

const ScreenMap: React.FC<{ color: string; name: string }> = ({
  color,
  name,
}) => (
  <div style={BASE}>
    <Header color={color} name={name} h={120} />
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 120,
        bottom: 0,
        background: "#dfeadf",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: -40,
          top: 120,
          width: 300,
          height: 120,
          background: "#bcd6ec",
          borderRadius: 60,
        }}
      />
      {[
        { l: -20, t: 200, w: 460, r: -18 },
        { l: -20, t: 380, w: 460, r: 24 },
        { l: 120, t: 80, w: 560, r: 90 },
      ].map((rd, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: rd.l,
            top: rd.t,
            width: rd.w,
            height: 22,
            background: "#fff",
            transform: `rotate(${rd.r}deg)`,
          }}
        />
      ))}
      <div
        style={{
          position: "absolute",
          left: 90,
          top: 150,
          width: 8,
          height: 300,
          background: "#555",
          borderRadius: 4,
          transform: "rotate(-32deg)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 220,
          top: 120,
          width: 46,
          height: 46,
          borderRadius: "50%",
          background: color,
          border: "6px solid #fff",
        }}
      />
    </div>
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: 360,
        borderRadius: "32px 32px 0 0",
        background: "#fff",
        padding: "34px 26px 0",
        boxSizing: "border-box",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            border: "6px solid #e5e5ea",
            borderTopColor: color,
            boxSizing: "border-box",
          }}
        />
        <div style={{ fontWeight: 700, fontSize: 32, color: "#111" }}>
          Finding a rider...
        </div>
      </div>
      <div
        style={{
          marginTop: 18,
          display: "inline-block",
          background: "#fee2e2",
          color: RED,
          fontWeight: 700,
          fontSize: 22,
          padding: "10px 18px",
          borderRadius: 14,
        }}
      >
        Rider unavailable
      </div>
      <div style={{ marginTop: 18, fontSize: 19, color: "#666" }}>
        No riders near you right now.
      </div>
      <div style={{ marginTop: 22 }}>
        <Btn color="#555" label="Cancel order" w={300} />
      </div>
    </div>
  </div>
);

const ScreenTrack: React.FC<{ color: string; name: string }> = ({
  color,
  name,
}) => (
  <div style={BASE}>
    <Header color={color} name={name} />
    <div style={{ padding: "24px 20px 0", fontWeight: 700, fontSize: 34, color: "#111" }}>
      Your order
    </div>
    <div
      style={{
        margin: "18px 20px 0",
        padding: "24px 20px",
        borderRadius: 22,
        background: "#fee2e2",
      }}
    >
      <div style={{ fontSize: 19, color: "#991b1b" }}>Estimated arrival</div>
      <div style={{ fontWeight: 700, fontSize: 44, color: RED, marginTop: 6 }}>
        Delayed 2 hours
      </div>
    </div>
    <div style={{ margin: "26px 34px 0" }}>
      {["Order placed", "Preparing", "On the way", "Delivered"].map((t, i) => (
        <div
          key={t}
          style={{
            height: 74,
            display: "flex",
            alignItems: "flex-start",
            gap: 18,
          }}
        >
          <div
            style={{
              width: 26,
              height: 26,
              borderRadius: "50%",
              boxSizing: "border-box",
              background: i === 0 ? color : "transparent",
              border: `4px solid ${i === 0 ? color : "#cfcfd6"}`,
            }}
          />
          <div
            style={{
              fontSize: 23,
              fontWeight: i === 1 ? 700 : 400,
              color: i <= 1 ? "#222" : "#aaa",
            }}
          >
            {t}
            {i === 1 ? (
              <span style={{ color: RED, fontSize: 18 }}>{"  stuck"}</span>
            ) : null}
          </div>
        </div>
      ))}
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 40, display: "flex", justifyContent: "center" }}>
      <Btn color="#555" label="Contact support" w={300} />
    </div>
  </div>
);

const AppScreen = memo(function AppScreen({
  kind,
  color,
  name,
}: {
  kind: number;
  color: string;
  name: string;
}) {
  if (kind === 1) return <ScreenCheckout color={color} name={name} />;
  if (kind === 2) return <ScreenMap color={color} name={name} />;
  if (kind === 3) return <ScreenTrack color={color} name={name} />;
  return <ScreenList color={color} name={name} />;
});

const EnflowScreen = memo(function EnflowScreen({
  dishImage,
}: {
  dishImage: string;
}) {
  return (
    <div
      style={{
        width: 400,
        height: 872,
        background: "#050505",
        position: "relative",
      }}
    >
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
            0
          </div>
        </div>
      </div>
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
      <div style={{ margin: "0 24px", border: `1px solid ${GOLD}25` }}>
        {dishImage ? (
          <Img
            src={staticFile(dishImage)}
            style={{ width: 350, height: 300, objectFit: "cover" }}
          />
        ) : (
          <div
            style={{
              width: 350,
              height: 300,
              background: `linear-gradient(135deg, ${GOLD}, #5a3a14)`,
            }}
          />
        )}
        <div style={{ padding: "22px 22px 26px" }}>
          <div style={{ fontFamily: SERIF, fontSize: 36, color: CREAM }}>
            Smoked Turkey Wings
          </div>
          <div
            style={{
              marginTop: 8,
              fontFamily: SANS,
              fontSize: 20,
              color: `${CREAM}99`,
            }}
          >
            Tender wings glazed with our house BBQ sauce.
          </div>
          <div
            style={{
              marginTop: 20,
              display: "inline-block",
              border: `1px solid ${CREAM}`,
              color: CREAM,
              fontFamily: MONO,
              fontWeight: 700,
              fontSize: 16,
              letterSpacing: 3,
              padding: "14px 24px",
              borderRadius: 10,
            }}
          >
            ADD ORDER
          </div>
        </div>
      </div>
    </div>
  );
});

/* a phone that drops in, shakes, then floats. Its contents never re-render. */
const FloatPhone: React.FC<{
  i: number;
  kind: number;
  names: string[];
  scale: number;
  x: number;
  y: number;
  rot: number;
  delay: number;
}> = ({ i, kind, names, scale, x, y, rot, delay }) => {
  const frame = useCurrentFrame();
  const p = useIn(delay, 11);
  const badge = useIn(delay + 8, 7);
  const since = frame - delay;
  const shake =
    since >= 4 && since < 16
      ? Math.sin(since * 3.2) * 12 * (1 - (since - 4) / 12)
      : 0;
  const float = Math.sin(frame / 16 + i * 1.7) * 9;
  const color = APP_COLORS[i % APP_COLORS.length];
  const name = names[i % names.length];

  const phone = useMemo(
    () => (
      <IPhoneFrame scale={scale} shadow={false}>
        <AppScreen kind={kind} color={color} name={name} />
      </IPhoneFrame>
    ),
    [scale, kind, color, name]
  );

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        opacity: p,
        willChange: "transform, opacity",
        transform: `translate3d(${shake}px, ${float + (1 - p) * -260}px, 0) rotate(${rot}deg)`,
      }}
    >
      {phone}
      <div
        style={{
          position: "absolute",
          top: -22,
          right: -22,
          width: 66,
          height: 66,
          borderRadius: "50%",
          background: RED,
          border: "5px solid #fff",
          boxSizing: "border-box",
          color: "#fff",
          fontFamily: SANS,
          fontWeight: 700,
          fontSize: 38,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          transform: `scale(${badge})`,
        }}
      >
        !
      </div>
    </div>
  );
};

/* Scene 1: confused person, many apps failing */
const Confused: React.FC<OjoStruggleProps> = ({
  confusedImage,
  appNames,
}) => {
  const a = useIn(4);
  const b = useIn(50);
  return (
    <Fade len={150}>
      <AbsoluteFill>
        <Media
          src={confusedImage}
          label="ADD PHOTO: person confused, holding a phone"
        />
        <Chapter n="01" label="THE STRUGGLE" />
        <FloatPhone i={0} kind={0} names={appNames} scale={0.52} x={24} y={250} rot={-8} delay={14} />
        <FloatPhone i={1} kind={1} names={appNames} scale={0.46} x={850} y={340} rot={7} delay={28} />
        <FloatPhone i={2} kind={2} names={appNames} scale={0.5} x={40} y={1170} rot={6} delay={42} />
        <FloatPhone i={3} kind={3} names={appNames} scale={0.46} x={820} y={1130} rot={-6} delay={56} />
        <div
          style={{
            position: "absolute",
            top: 120,
            width: "100%",
            textAlign: "center",
            fontFamily: SERIF,
            fontSize: 130,
            color: CREAM,
            opacity: a,
            transform: `translateY(${(1 - a) * 80}px)`,
          }}
        >
          Which app?
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 130,
            width: "100%",
            textAlign: "center",
            fontFamily: SERIF,
            fontStyle: "italic",
            fontSize: 96,
            color: CREAM,
            opacity: b,
            transform: `translateY(${(1 - b) * 80}px)`,
          }}
        >
          Why is it failing?
        </div>
      </AbsoluteFill>
    </Fade>
  );
};

/* Scene 2: exhausted in the kitchen, time wasted */
const Kitchen: React.FC<OjoStruggleProps> = ({ kitchenImage }) => {
  const frame = useCurrentFrame();
  const a = useIn(6);
  const b = useIn(28);
  const card = useIn(2, 14);
  const mins = Math.round(interpolate(frame, [10, 120], [20, 107], clamp));
  const bar = interpolate(frame, [10, 120], [8, 96], clamp);
  return (
    <Fade len={120}>
      <AbsoluteFill>
        <Media
          src={kitchenImage}
          label="ADD PHOTO: lady in the kitchen, too tired to cook"
          dim={0.5}
        />
        <Chapter n="02" label="NO ENERGY LEFT" />
        <div
          style={{
            position: "absolute",
            top: 130,
            left: 140,
            width: 800,
            boxSizing: "border-box",
            padding: "30px 40px 36px",
            border: `2px solid ${RED}88`,
            background: "rgba(10,10,10,0.6)",
            textAlign: "center",
            opacity: card,
            transform: `translateY(${(1 - card) * -60}px)`,
          }}
        >
          <div
            style={{
              fontFamily: MONO,
              fontSize: 30,
              letterSpacing: 10,
              color: RED,
            }}
          >
            TIME WASTED
          </div>
          <div
            style={{
              fontFamily: MONO,
              fontWeight: 700,
              fontSize: 130,
              lineHeight: 1.1,
              color: CREAM,
            }}
          >
            {fmt(mins)}
          </div>
          <div
            style={{
              marginTop: 14,
              height: 12,
              background: "#2a2a2a",
              borderRadius: 6,
            }}
          >
            <div
              style={{
                width: `${bar}%`,
                height: 12,
                background: RED,
                borderRadius: 6,
              }}
            />
          </div>
          <div
            style={{
              marginTop: 12,
              fontFamily: MONO,
              fontSize: 22,
              letterSpacing: 6,
              color: `${CREAM}99`,
            }}
          >
            HUNGER LEVEL
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 200,
            width: "100%",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontFamily: SERIF,
              fontSize: 160,
              lineHeight: 1,
              color: CREAM,
              opacity: a,
              transform: `translateY(${(1 - a) * 80}px)`,
            }}
          >
            Too tired
          </div>
          <div
            style={{
              fontFamily: SERIF,
              fontStyle: "italic",
              fontSize: 160,
              lineHeight: 1,
              color: GOLD,
              opacity: b,
              transform: `translateY(${(1 - b) * 80}px)`,
            }}
          >
            to cook.
          </div>
        </div>
      </AbsoluteFill>
    </Fade>
  );
};

/* Scene 3: every app failed */
const Stat: React.FC<{
  label: string;
  value: string;
  color: string;
}> = ({ label, value, color }) => (
  <div
    style={{
      width: 420,
      boxSizing: "border-box",
      padding: "22px 0",
      border: `2px solid ${color}66`,
      background: "rgba(12,12,12,0.7)",
      textAlign: "center",
    }}
  >
    <div
      style={{
        fontFamily: MONO,
        fontSize: 24,
        letterSpacing: 6,
        color: `${CREAM}99`,
      }}
    >
      {label}
    </div>
    <div
      style={{
        fontFamily: MONO,
        fontWeight: 700,
        fontSize: 86,
        lineHeight: 1.1,
        color,
      }}
    >
      {value}
    </div>
  </div>
);

const AllFailed: React.FC<OjoStruggleProps> = ({ appNames }) => {
  const frame = useCurrentFrame();
  const a = useIn(2);
  const b = useIn(12);
  const c = useIn(80);
  const mins = Math.round(interpolate(frame, [0, 150], [107, 205], clamp));
  const tried = Math.round(interpolate(frame, [10, 52], [0, 3], clamp));
  const kinds = [0, 3, 1];
  return (
    <Fade len={150}>
      <AbsoluteFill>
        <GridBg />
        <Chapter n="03" label="EVERY APP. SAME STORY." />
        <div
          style={{
            position: "absolute",
            top: 110,
            width: "100%",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontFamily: SERIF,
              fontSize: 130,
              lineHeight: 1,
              color: CREAM,
              opacity: a,
              transform: `translateY(${(1 - a) * 60}px)`,
            }}
          >
            All of them.
          </div>
          <div
            style={{
              fontFamily: SERIF,
              fontStyle: "italic",
              fontSize: 130,
              lineHeight: 1,
              color: RED,
              opacity: b,
              transform: `translateY(${(1 - b) * 60}px)`,
            }}
          >
            Failed.
          </div>
        </div>
        {kinds.map((kind, i) => (
          <FloatPhone
            key={i}
            i={i}
            kind={kind}
            names={appNames}
            scale={0.7}
            x={60 + i * 327}
            y={430}
            rot={0}
            delay={10 + i * 14}
          />
        ))}
        <div
          style={{
            position: "absolute",
            top: 1110,
            width: "100%",
            display: "flex",
            justifyContent: "center",
            gap: 40,
          }}
        >
          <Stat label="APPS TRIED" value={String(tried)} color={CREAM} />
          <Stat label="MEALS DELIVERED" value="0" color={RED} />
        </div>
        <div
          style={{
            position: "absolute",
            top: 1330,
            width: "100%",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontFamily: MONO,
              fontSize: 28,
              letterSpacing: 10,
              color: RED,
            }}
          >
            TIME WASTED
          </div>
          <div
            style={{
              fontFamily: MONO,
              fontWeight: 700,
              fontSize: 110,
              color: RED,
            }}
          >
            {fmt(mins)}
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 130,
            width: "100%",
            textAlign: "center",
            fontFamily: SERIF,
            fontStyle: "italic",
            fontSize: 90,
            color: CREAM,
            opacity: c,
          }}
        >
          And still no food.
        </div>
      </AbsoluteFill>
    </Fade>
  );
};

/* Scene 4: Enflow arrives in an iPhone frame */
const Turn: React.FC<OjoStruggleProps> = ({ dishImage }) => {
  const glow = useIn(8, 200);
  const a = useIn(14);
  const b = useIn(24, 9);
  const rise = useIn(34, 14);

  const phone = useMemo(
    () => (
      <IPhoneFrame scale={0.92}>
        <EnflowScreen dishImage={dishImage} />
      </IPhoneFrame>
    ),
    [dishImage]
  );

  return (
    <Fade len={110} out={false}>
      <AbsoluteFill style={{ background: "#000" }}>
        <AbsoluteFill
          style={{
            opacity: glow,
            background: `radial-gradient(circle at 50% 55%, ${GOLD}77 0%, ${GOLD}00 55%)`,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 150,
            width: "100%",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontFamily: MONO,
              fontWeight: 700,
              fontSize: 50,
              letterSpacing: 14,
              textTransform: "uppercase",
              color: GOLD,
              opacity: a,
              transform: `translateY(${(1 - a) * 50}px)`,
            }}
          >
            Then came
          </div>
          <div
            style={{
              marginTop: 6,
              fontFamily: SERIF,
              fontWeight: 700,
              fontSize: 240,
              lineHeight: 1,
              color: CREAM,
              opacity: b,
              transform: `scale(${0.7 + b * 0.3})`,
            }}
          >
            Enflow
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            left: (1080 - 438 * 0.92) / 2,
            top: 640,
            willChange: "transform",
            transform: `translate3d(0, ${(1 - rise) * 1300}px, 0) rotate(${(1 - rise) * 6}deg)`,
          }}
        >
          {phone}
        </div>
      </AbsoluteFill>
    </Fade>
  );
};

export const OjoStruggle: React.FC<OjoStruggleProps> = (props) => {
  return (
    <AbsoluteFill style={{ background: "#08080a" }}>
      <Sequence from={0} durationInFrames={150}>
        <Confused {...props} />
      </Sequence>
      <Sequence from={150} durationInFrames={120}>
        <Kitchen {...props} />
      </Sequence>
      <Sequence from={270} durationInFrames={150}>
        <AllFailed {...props} />
      </Sequence>
      <Sequence from={420} durationInFrames={110}>
        <Turn {...props} />
      </Sequence>
    </AbsoluteFill>
  );
};
