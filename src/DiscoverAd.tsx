import {
  AbsoluteFill,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont as loadSerif } from "@remotion/google-fonts/CormorantGaramond";
import { loadFont as loadSans } from "@remotion/google-fonts/SpaceGrotesk";
import { loadFont as loadMono } from "@remotion/google-fonts/SpaceMono";

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

export type DiscoverAdProps = {
  brand: string;
  area: string;
  discountLabel: string;
  ctaLink: string;
  dishImages: string[];
  gold: string;
  bgDark: string;
  bgDeep: string;
  cream: string;
};

const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

const resolveImage = (src: string) =>
  src.startsWith("http") ? src : staticFile(src);

const useIn = (delay = 0, damping = 12) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: { damping } });
};

const Fade: React.FC<{ len: number; children: React.ReactNode }> = ({
  len,
  children,
}) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, 8, len - 12, len], [0, 1, 1, 0], clamp);
  return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>;
};

/* Scene 1: hook */
const Hook: React.FC<DiscoverAdProps> = ({ area, gold, cream }) => {
  const a = useIn(0);
  const c = useIn(16, 8);
  return (
    <Fade len={90}>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div
          style={{
            fontFamily: SERIF,
            fontSize: 140,
            color: cream,
            opacity: a,
            transform: `translateY(${(1 - a) * 120}px)`,
          }}
        >
          Hungry in
        </div>
        <div
          style={{
            fontFamily: SERIF,
            fontSize: 280,
            fontWeight: 700,
            color: gold,
            opacity: c,
            transform: `scale(${0.6 + c * 0.4})`,
          }}
        >
          {area}?
        </div>
      </AbsoluteFill>
    </Fade>
  );
};

/* Scene 2: intro */
const Intro: React.FC<DiscoverAdProps> = ({
  brand,
  area,
  gold,
  cream,
  bgDark,
}) => {
  const pin = useIn(0, 9);
  const t1 = useIn(14);
  const t2 = useIn(26);
  return (
    <Fade len={120}>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div
          style={{
            width: 140,
            height: 140,
            background: gold,
            borderRadius: "50% 50% 50% 0",
            transform: `translateY(${(1 - pin) * -600}px) rotate(-45deg)`,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 90,
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: bgDark,
            }}
          />
        </div>
        <div
          style={{
            fontFamily: SERIF,
            fontSize: 96,
            color: cream,
            textAlign: "center",
            padding: "0 80px",
            opacity: t1,
            transform: `translateY(${(1 - t1) * 60}px)`,
          }}
        >
          Discover great food around {area}
        </div>
        <div
          style={{
            marginTop: 50,
            fontFamily: MONO,
            fontWeight: 700,
            fontSize: 44,
            letterSpacing: 10,
            textTransform: "uppercase",
            color: gold,
            opacity: t2,
          }}
        >
          {brand}
        </div>
      </AbsoluteFill>
    </Fade>
  );
};

/* Scene 3: phone mockup that mirrors the real Enflow Discovery app */
type Dish = {
  num: string;
  name: string;
  desc: string;
  tags: string[];
  left: string;
};

const DISHES: Dish[] = [
  {
    num: "02",
    name: "Smoked Turkey Wings",
    desc: "Tender smoked turkey wings glazed with our house BBQ sauce.",
    tags: ["GLUTEN-FREE", "CHEF'S PICK"],
    left: "9 LEFT",
  },
  {
    num: "21",
    name: "Kids Chicken Pie",
    desc: "Flaky crust filled with chicken, creamy veggies, and spices.",
    tags: ["KIDS", "SNACK"],
    left: "20 LEFT",
  },
];

const SCREEN_W = 720;
const SCREEN_H = 1520;
const PHONE_SCALE = 0.85;

const Thumb: React.FC<{
  src?: string;
  w: number;
  h: number;
  gold: string;
}> = ({ src, w, h, gold }) =>
  src ? (
    <Img
      src={resolveImage(src)}
      style={{ width: w, height: h, objectFit: "cover", flexShrink: 0 }}
    />
  ) : (
    <div
      style={{
        width: w,
        height: h,
        flexShrink: 0,
        background: `linear-gradient(135deg, ${gold}, #5a3a14)`,
      }}
    />
  );

const DishCard: React.FC<{
  dish: Dish;
  image?: string;
  delay: number;
  pressed: number;
  added: boolean;
  gold: string;
  cream: string;
}> = ({ dish, image, delay, pressed, added, gold, cream }) => {
  const p = useIn(delay, 14);
  return (
    <div
      style={{
        margin: "0 36px",
        height: 395,
        display: "flex",
        borderTop: `1px solid ${gold}25`,
        opacity: p,
        transform: `translateX(${(1 - p) * 240}px)`,
      }}
    >
      <div style={{ position: "relative", width: 300, height: 395 }}>
        <Thumb src={image} w={300} h={395} gold={gold} />
        <div
          style={{
            position: "absolute",
            top: 20,
            left: 20,
            background: "#000000b0",
            color: gold,
            fontFamily: MONO,
            fontSize: 20,
            padding: "6px 12px",
          }}
        >
          {dish.num}
        </div>
        <div
          style={{
            position: "absolute",
            left: 16,
            right: 16,
            bottom: 16,
            display: "flex",
            flexWrap: "wrap",
            gap: 6,
          }}
        >
          {dish.tags.map((t) => (
            <div
              key={t}
              style={{
                background: "#000000cc",
                color: cream,
                fontFamily: MONO,
                fontSize: 18,
                letterSpacing: 2,
                padding: "10px 12px",
              }}
            >
              {t}
            </div>
          ))}
        </div>
      </div>
      <div
        style={{
          marginLeft: 36,
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "34px 0",
        }}
      >
        <div>
          <div
            style={{
              fontFamily: SERIF,
              fontSize: 44,
              lineHeight: 1.1,
              color: cream,
            }}
          >
            {dish.name}
          </div>
          <div
            style={{
              marginTop: 16,
              fontFamily: SANS,
              fontSize: 24,
              lineHeight: 1.4,
              color: `${cream}99`,
            }}
          >
            {dish.desc}
          </div>
        </div>
        <div>
          <div
            style={{
              fontFamily: MONO,
              fontSize: 20,
              letterSpacing: 3,
              color: "#4ade80",
              marginBottom: 18,
            }}
          >
            {"• "}
            {dish.left}
          </div>
          <div
            style={{
              alignSelf: "flex-start",
              display: "inline-block",
              border: `1px solid ${added ? gold : cream}`,
              background: added ? gold : "transparent",
              color: added ? "#000" : cream,
              fontFamily: MONO,
              fontWeight: 700,
              fontSize: 22,
              letterSpacing: 4,
              padding: "20px 34px",
              borderRadius: 14,
              transform: `scale(${pressed})`,
              transformOrigin: "left center",
            }}
          >
            {added ? "ADDED" : "ADD ORDER"}
          </div>
        </div>
      </div>
    </div>
  );
};

const CartRow: React.FC<{
  dish: Dish;
  image?: string;
  gold: string;
  cream: string;
}> = ({ dish, image, gold, cream }) => (
  <div
    style={{
      margin: "0 36px",
      padding: "36px 0",
      display: "flex",
      borderBottom: `1px solid ${gold}25`,
    }}
  >
    <Thumb src={image} w={126} h={126} gold={gold} />
    <div style={{ marginLeft: 26, flex: 1 }}>
      <div style={{ fontFamily: SERIF, fontSize: 42, color: cream }}>
        {dish.name}
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
        {dish.tags.map((t) => (
          <div
            key={t}
            style={{
              border: `1px solid ${cream}60`,
              color: cream,
              fontFamily: MONO,
              fontSize: 18,
              letterSpacing: 2,
              padding: "6px 10px",
            }}
          >
            {t}
          </div>
        ))}
      </div>
      <div
        style={{
          marginTop: 22,
          display: "flex",
          alignItems: "center",
          gap: 26,
          fontFamily: MONO,
          fontSize: 28,
          color: cream,
        }}
      >
        <div
          style={{
            width: 64,
            height: 56,
            border: `1px solid ${cream}40`,
            borderRadius: 10,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          -
        </div>
        1
        <div
          style={{
            width: 64,
            height: 56,
            border: `1px solid ${cream}`,
            borderRadius: 10,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          +
        </div>
      </div>
    </div>
  </div>
);

const PhoneScene: React.FC<DiscoverAdProps> = ({
  dishImages,
  gold,
  cream,
  bgDeep,
}) => {
  const f = useCurrentFrame();
  const rise = useIn(0, 14);

  const press1 = interpolate(f, [80, 86, 92], [1, 0.9, 1], clamp);
  const press2 = interpolate(f, [100, 106, 112], [1, 0.9, 1], clamp);
  const added1 = f >= 86;
  const added2 = f >= 106;
  const count = (added1 ? 1 : 0) + (added2 ? 1 : 0);
  const cartPulse = interpolate(f, [118, 124, 132], [1, 1.12, 1], clamp);

  const drawer = spring({
    frame: f - 126,
    fps: 30,
    config: { damping: 200 },
  });
  const placePress = interpolate(f, [190, 196, 202], [1, 0.94, 1], clamp);
  const toast = useIn(204, 12);

  const tabs = ["ALL", "APPETIZERS", "MAIN", "REG"];

  return (
    <Fade len={240}>
      <AbsoluteFill>
        <div
          style={{
            position: "absolute",
            top: 110,
            width: "100%",
            textAlign: "center",
            fontFamily: SERIF,
            fontSize: 88,
            color: cream,
          }}
        >
          Browse. Order. Enjoy.
        </div>

        <div
          style={{
            position: "absolute",
            left: 220,
            top: 290,
            boxSizing: "border-box",
            width: SCREEN_W * PHONE_SCALE + 28,
            height: SCREEN_H * PHONE_SCALE + 28,
            borderRadius: 90,
            border: "14px solid #2a1d12",
            overflow: "hidden",
            background: "#050505",
            transform: `translateY(${(1 - rise) * 1500}px)`,
          }}
        >
          <div
            style={{
              position: "relative",
              width: SCREEN_W,
              height: SCREEN_H,
              transform: `scale(${PHONE_SCALE})`,
              transformOrigin: "top left",
              background: "#050505",
              overflow: "hidden",
            }}
          >
            {/* header */}
            <div
              style={{
                height: 170,
                padding: "0 36px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <div
                  style={{
                    width: 48,
                    height: 56,
                    border: `1px solid ${gold}`,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      style={{ width: 4, height: 26, background: gold }}
                    />
                  ))}
                </div>
                <div
                  style={{
                    marginLeft: 20,
                    fontFamily: MONO,
                    fontWeight: 700,
                    fontSize: 26,
                    letterSpacing: 8,
                    color: cream,
                  }}
                >
                  EN-FLOW
                </div>
              </div>
              <div
                style={{
                  background: gold,
                  color: "#000",
                  height: 62,
                  padding: "0 22px",
                  borderRadius: 12,
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  fontFamily: MONO,
                  fontWeight: 700,
                  fontSize: 22,
                  letterSpacing: 4,
                  transform: `scale(${cartPulse})`,
                }}
              >
                ORDER
                <div
                  style={{
                    background: "#000",
                    color: gold,
                    width: 38,
                    height: 38,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: 22,
                  }}
                >
                  {count}
                </div>
              </div>
            </div>

            {/* category tabs */}
            <div
              style={{
                display: "flex",
                height: 86,
                borderTop: `1px solid ${gold}30`,
                borderBottom: `1px solid ${gold}30`,
                overflow: "hidden",
              }}
            >
              {tabs.map((t, i) => (
                <div
                  key={t}
                  style={{
                    padding: "0 40px",
                    display: "flex",
                    alignItems: "center",
                    fontFamily: MONO,
                    fontSize: 22,
                    letterSpacing: 4,
                    whiteSpace: "nowrap",
                    color: i === 0 ? gold : `${cream}99`,
                    background: i === 0 ? `${gold}22` : "transparent",
                    borderBottom: i === 0 ? `2px solid ${gold}` : "none",
                  }}
                >
                  {t}
                </div>
              ))}
            </div>

            {/* section heading */}
            <div
              style={{
                padding: "56px 36px 36px",
                display: "flex",
                alignItems: "center",
                gap: 24,
              }}
            >
              <div style={{ fontFamily: SERIF, fontSize: 68, color: cream }}>
                Popular
              </div>
              <div style={{ flex: 1, height: 1, background: `${gold}30` }} />
              <div
                style={{
                  fontFamily: MONO,
                  fontSize: 20,
                  letterSpacing: 2,
                  color: `${cream}80`,
                }}
              >
                02 dishes
              </div>
            </div>

            <DishCard
              dish={DISHES[0]}
              image={dishImages[0]}
              delay={24}
              pressed={press1}
              added={added1}
              gold={gold}
              cream={cream}
            />
            <DishCard
              dish={DISHES[1]}
              image={dishImages[1]}
              delay={36}
              pressed={press2}
              added={added2}
              gold={gold}
              cream={cream}
            />

            {/* cart drawer */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: SCREEN_W,
                height: SCREEN_H,
                background: "#0a0a0a",
                borderLeft: `1px solid ${gold}30`,
                transform: `translateX(${(1 - drawer) * SCREEN_W}px)`,
              }}
            >
              <div
                style={{
                  height: 130,
                  padding: "0 36px",
                  display: "flex",
                  alignItems: "center",
                  gap: 20,
                  borderBottom: `1px solid ${gold}25`,
                }}
              >
                <div
                  style={{
                    fontFamily: MONO,
                    fontSize: 22,
                    letterSpacing: 4,
                    color: gold,
                  }}
                >
                  CART /
                </div>
                <div
                  style={{
                    fontFamily: SERIF,
                    fontSize: 54,
                    letterSpacing: 3,
                    color: cream,
                    textTransform: "uppercase",
                  }}
                >
                  Guest Order
                </div>
              </div>
              <CartRow
                dish={DISHES[0]}
                image={dishImages[0]}
                gold={gold}
                cream={cream}
              />
              <CartRow
                dish={DISHES[1]}
                image={dishImages[1]}
                gold={gold}
                cream={cream}
              />
              <div
                style={{
                  position: "absolute",
                  left: 36,
                  right: 36,
                  bottom: 50,
                  height: 100,
                  background: gold,
                  color: "#000",
                  borderRadius: 12,
                  fontFamily: MONO,
                  fontWeight: 700,
                  fontSize: 28,
                  letterSpacing: 6,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  transform: `scale(${placePress})`,
                }}
              >
                PLACE ORDER
              </div>
            </div>

            {/* success banner */}
            <div
              style={{
                position: "absolute",
                left: 36,
                right: 36,
                bottom: 50,
                height: 110,
                background: cream,
                color: "#000",
                borderRadius: 12,
                fontFamily: SANS,
                fontWeight: 700,
                fontSize: 30,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                transform: `translateY(${(1 - toast) * 260}px)`,
              }}
            >
              Order placed. Delivery on the way.
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </Fade>
  );
};

/* Scene 4: reasons */
const Check: React.FC<{ gold: string; bgDark: string }> = ({
  gold,
  bgDark,
}) => (
  <div
    style={{
      width: 84,
      height: 84,
      borderRadius: "50%",
      background: gold,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexShrink: 0,
    }}
  >
    <div
      style={{
        width: 20,
        height: 38,
        borderRight: `8px solid ${bgDark}`,
        borderBottom: `8px solid ${bgDark}`,
        transform: "rotate(45deg) translate(-4px, -4px)",
      }}
    />
  </div>
);

const Reason: React.FC<{
  text: string;
  delay: number;
  gold: string;
  cream: string;
  bgDark: string;
}> = ({ text, delay, gold, cream, bgDark }) => {
  const p = useIn(delay, 13);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        marginBottom: 70,
        opacity: p,
        transform: `translateX(${(1 - p) * -300}px)`,
      }}
    >
      <Check gold={gold} bgDark={bgDark} />
      <div
        style={{
          marginLeft: 40,
          fontFamily: SANS,
          fontWeight: 700,
          fontSize: 74,
          color: cream,
        }}
      >
        {text}
      </div>
    </div>
  );
};

const Reasons: React.FC<DiscoverAdProps> = ({
  brand,
  gold,
  cream,
  bgDark,
}) => {
  const title = useIn(0);
  return (
    <Fade len={150}>
      <AbsoluteFill style={{ justifyContent: "center", padding: "0 90px" }}>
        <div
          style={{
            fontFamily: SERIF,
            fontSize: 104,
            color: gold,
            marginBottom: 100,
            opacity: title,
            transform: `translateY(${(1 - title) * 60}px)`,
          }}
        >
          Why {brand}?
        </div>
        <Reason
          text="Low discounted rates"
          delay={12}
          gold={gold}
          cream={cream}
          bgDark={bgDark}
        />
        <Reason
          text="Good service"
          delay={28}
          gold={gold}
          cream={cream}
          bgDark={bgDark}
        />
        <Reason
          text="100% food quality"
          delay={44}
          gold={gold}
          cream={cream}
          bgDark={bgDark}
        />
      </AbsoluteFill>
    </Fade>
  );
};

/* Scene 5: offer */
const OfferBox: React.FC<{
  value: number;
  label: string;
  delay: number;
  gold: string;
  bgDark: string;
}> = ({ value, label, delay, gold, bgDark }) => {
  const frame = useCurrentFrame();
  const p = useIn(delay, 9);
  const n = Math.round(
    interpolate(frame, [delay + 4, delay + 30], [0, value], clamp)
  );
  return (
    <div
      style={{
        width: 420,
        height: 440,
        background: gold,
        color: bgDark,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        transform: `scale(${p})`,
      }}
    >
      <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 260 }}>
        {n}
      </div>
      <div
        style={{
          fontFamily: MONO,
          fontWeight: 700,
          fontSize: 50,
          letterSpacing: 6,
          textTransform: "uppercase",
        }}
      >
        {label}
      </div>
    </div>
  );
};

const Offer: React.FC<DiscoverAdProps> = ({
  discountLabel,
  gold,
  cream,
  bgDark,
}) => {
  const head = useIn(0);
  const foot = useIn(46);
  return (
    <Fade len={150}>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div
          style={{
            fontFamily: MONO,
            fontSize: 42,
            letterSpacing: 10,
            textTransform: "uppercase",
            color: gold,
            opacity: head,
          }}
        >
          Welcome offer
        </div>
        <div
          style={{
            marginTop: 20,
            fontFamily: SERIF,
            fontSize: 120,
            color: cream,
            textAlign: "center",
            padding: "0 60px",
            opacity: head,
            transform: `translateY(${(1 - head) * 60}px)`,
          }}
        >
          Get a {discountLabel}
        </div>
        <div style={{ display: "flex", gap: 40, marginTop: 80 }}>
          <OfferBox
            value={3}
            label="orders"
            delay={16}
            gold={gold}
            bgDark={bgDark}
          />
          <OfferBox
            value={10}
            label="days"
            delay={28}
            gold={gold}
            bgDark={bgDark}
          />
        </div>
        <div
          style={{
            marginTop: 80,
            fontFamily: SANS,
            fontSize: 48,
            color: cream,
            textAlign: "center",
            padding: "0 80px",
            opacity: foot,
          }}
        >
          On your first 3 orders, within your first 10 days
        </div>
      </AbsoluteFill>
    </Fade>
  );
};

/* Scene 6: call to action */
const Cta: React.FC<DiscoverAdProps> = ({
  brand,
  area,
  ctaLink,
  gold,
  cream,
  bgDark,
}) => {
  const a = useIn(0, 10);
  const b = useIn(14);
  const c = useIn(26, 9);
  return (
    <Fade len={1000}>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div
          style={{
            fontFamily: SERIF,
            fontSize: 130,
            fontWeight: 700,
            color: cream,
            textAlign: "center",
            padding: "0 60px",
            transform: `scale(${a})`,
          }}
        >
          Try {brand} today
        </div>
        <div
          style={{
            marginTop: 40,
            fontFamily: MONO,
            fontWeight: 700,
            fontSize: 50,
            letterSpacing: 8,
            textTransform: "uppercase",
            color: gold,
            opacity: b,
          }}
        >
          Now serving {area}
        </div>
        {ctaLink ? (
          <div
            style={{
              marginTop: 90,
              background: gold,
              color: bgDark,
              fontFamily: MONO,
              fontWeight: 700,
              fontSize: 46,
              padding: "26px 60px",
              borderRadius: 12,
              transform: `scale(${c})`,
            }}
          >
            {ctaLink}
          </div>
        ) : null}
      </AbsoluteFill>
    </Fade>
  );
};

export const DiscoverAd: React.FC<DiscoverAdProps> = (props) => {
  const frame = useCurrentFrame();
  const drift = Math.sin(frame / 40) * 70;

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(170deg, ${props.bgDark}, ${props.bgDeep})`,
      }}
    >
      <AbsoluteFill
        style={{
          backgroundImage: `repeating-linear-gradient(0deg, ${props.gold}0d 0px, ${props.gold}0d 1px, transparent 1px, transparent 120px), repeating-linear-gradient(90deg, ${props.gold}0d 0px, ${props.gold}0d 1px, transparent 1px, transparent 120px)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 700 + drift,
          top: 200,
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: props.gold,
          opacity: 0.07,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: -250 - drift,
          top: 1250,
          width: 700,
          height: 700,
          borderRadius: "50%",
          background: props.gold,
          opacity: 0.07,
        }}
      />

      <Sequence from={0} durationInFrames={90}>
        <Hook {...props} />
      </Sequence>
      <Sequence from={90} durationInFrames={120}>
        <Intro {...props} />
      </Sequence>
      <Sequence from={210} durationInFrames={240}>
        <PhoneScene {...props} />
      </Sequence>
      <Sequence from={450} durationInFrames={150}>
        <Reasons {...props} />
      </Sequence>
      <Sequence from={600} durationInFrames={150}>
        <Offer {...props} />
      </Sequence>
      <Sequence from={750} durationInFrames={90}>
        <Cta {...props} />
      </Sequence>
    </AbsoluteFill>
  );
};
