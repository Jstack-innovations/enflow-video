import {
  AbsoluteFill,
  Sequence,
  interpolate,
  spring,
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

export type OjoCloseProps = {
  brand: string;
  area: string;
  discountLabel: string;
  ctaLink: string;
  tagline: string;
};

const GOLD = "#d4a853";
const CREAM = "#f5ead6";
const DARK = "#1a120b";
const DEEP = "#0d0804";

const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

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
  const o = interpolate(frame, [0, 8, len - 10, len], [0, 1, 1, 0], clamp);
  return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>;
};

const Check: React.FC = () => (
  <div
    style={{
      width: 84,
      height: 84,
      borderRadius: "50%",
      background: GOLD,
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
        borderRight: `8px solid ${DARK}`,
        borderBottom: `8px solid ${DARK}`,
        transform: "rotate(45deg) translate(-4px, -4px)",
      }}
    />
  </div>
);

const Reason: React.FC<{ text: string; delay: number; first?: boolean }> = ({
  text,
  delay,
  first,
}) => {
  const p = useIn(delay, 13);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        marginBottom: 64,
        opacity: p,
        transform: `translateX(${(1 - p) * -300}px)`,
      }}
    >
      <Check />
      <div
        style={{
          marginLeft: 36,
          fontFamily: SANS,
          fontWeight: 700,
          fontSize: first ? 72 : 56,
          color: first ? GOLD : CREAM,
        }}
      >
        {text}
      </div>
    </div>
  );
};

/* reasons */
const Reasons: React.FC<OjoCloseProps> = () => {
  const title = useIn(0);
  return (
    <Fade len={150}>
      <AbsoluteFill style={{ justifyContent: "center", padding: "0 90px" }}>
        <div
          style={{
            fontFamily: SERIF,
            fontSize: 124,
            color: CREAM,
            marginBottom: 90,
            opacity: title,
            transform: `translateY(${(1 - title) * 60}px)`,
          }}
        >
          Why{" "}
          <span style={{ fontStyle: "italic", color: GOLD }}>Enflow?</span>
        </div>
        <Reason text="Good service." delay={12} first />
        <Reason text="A smooth, simple process." delay={30} />
        <Reason text="Quality food." delay={48} />
        <Reason text="Fair prices." delay={66} />
      </AbsoluteFill>
    </Fade>
  );
};

/* small welcome offer */
const Offer: React.FC<OjoCloseProps> = ({ discountLabel }) => {
  const a = useIn(0);
  const b = useIn(14);
  const c = useIn(30);
  const chip = {
    border: `2px solid ${GOLD}`,
    color: GOLD,
    fontFamily: MONO,
    fontWeight: 700,
    fontSize: 36,
    letterSpacing: 6,
    padding: "18px 30px",
  } as const;
  return (
    <Fade len={100}>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div
          style={{
            width: 880,
            boxSizing: "border-box",
            padding: "80px 60px",
            border: `2px solid ${GOLD}66`,
            background: `${GOLD}12`,
            textAlign: "center",
            opacity: a,
            transform: `scale(${0.9 + a * 0.1})`,
          }}
        >
          <div
            style={{
              fontFamily: MONO,
              fontWeight: 700,
              fontSize: 36,
              letterSpacing: 10,
              color: GOLD,
            }}
          >
            NEW HERE?
          </div>
          <div
            style={{
              marginTop: 24,
              fontFamily: SERIF,
              fontSize: 104,
              lineHeight: 1.05,
              color: CREAM,
              opacity: b,
              transform: `translateY(${(1 - b) * 40}px)`,
            }}
          >
            Enjoy a {discountLabel}
          </div>
          <div
            style={{
              marginTop: 24,
              fontFamily: SANS,
              fontSize: 46,
              color: `${CREAM}cc`,
              opacity: b,
            }}
          >
            on your first 3 orders, within your first 10 days.
          </div>
          <div
            style={{
              marginTop: 50,
              display: "flex",
              justifyContent: "center",
              gap: 24,
              opacity: c,
            }}
          >
            <div style={chip}>FIRST 3 ORDERS</div>
            <div style={chip}>FIRST 10 DAYS</div>
          </div>
        </div>
      </AbsoluteFill>
    </Fade>
  );
};

/* final lockup */
const Cta: React.FC<OjoCloseProps> = ({
  brand,
  area,
  ctaLink,
  tagline,
}) => {
  const logo = useIn(0, 10);
  const name = useIn(12, 11);
  const where = useIn(26);
  const tag = useIn(40);
  const link = useIn(54, 9);
  return (
    <Fade len={120}>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div
          style={{
            width: 130,
            height: 150,
            border: `3px solid ${GOLD}`,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 14,
            transform: `scale(${logo})`,
          }}
        >
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ width: 10, height: 66, background: GOLD }} />
          ))}
        </div>
        <div
          style={{
            marginTop: 40,
            fontFamily: MONO,
            fontWeight: 700,
            fontSize: 56,
            letterSpacing: 18,
            color: CREAM,
            opacity: name,
          }}
        >
          EN-FLOW
        </div>
        <div
          style={{
            marginTop: 30,
            fontFamily: SERIF,
            fontWeight: 700,
            fontSize: 140,
            lineHeight: 1,
            color: CREAM,
            textAlign: "center",
            padding: "0 60px",
            opacity: name,
            transform: `translateY(${(1 - name) * 50}px)`,
          }}
        >
          {brand}
        </div>
        <div
          style={{
            marginTop: 40,
            fontFamily: MONO,
            fontWeight: 700,
            fontSize: 44,
            letterSpacing: 8,
            textTransform: "uppercase",
            color: GOLD,
            opacity: where,
          }}
        >
          Now serving {area}, Lagos
        </div>
        <div
          style={{
            marginTop: 30,
            fontFamily: SERIF,
            fontStyle: "italic",
            fontSize: 76,
            color: `${CREAM}dd`,
            opacity: tag,
          }}
        >
          {tagline}
        </div>
        {ctaLink ? (
          <div
            style={{
              marginTop: 60,
              background: GOLD,
              color: DARK,
              fontFamily: MONO,
              fontWeight: 700,
              fontSize: 46,
              padding: "24px 56px",
              borderRadius: 12,
              transform: `scale(${link})`,
            }}
          >
            {ctaLink}
          </div>
        ) : null}
        <div
          style={{
            position: "absolute",
            bottom: 120,
            width: "100%",
            textAlign: "center",
            fontFamily: MONO,
            fontSize: 26,
            letterSpacing: 4,
            color: `${CREAM}88`,
            opacity: tag,
          }}
        >
          ALABA · TRADE FAIR · LASU · UNIQUE OPEN UNIVERSITY · ECOWAS ROAD
        </div>
      </AbsoluteFill>
    </Fade>
  );
};

export const OjoClose: React.FC<OjoCloseProps> = (props) => {
  const frame = useCurrentFrame();
  const drift = Math.sin(frame / 40) * 70;
  return (
    <AbsoluteFill
      style={{ background: `linear-gradient(170deg, ${DARK}, ${DEEP})` }}
    >
      <AbsoluteFill
        style={{
          backgroundImage: `repeating-linear-gradient(0deg, ${GOLD}0d 0px, ${GOLD}0d 1px, transparent 1px, transparent 120px), repeating-linear-gradient(90deg, ${GOLD}0d 0px, ${GOLD}0d 1px, transparent 1px, transparent 120px)`,
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
          background: GOLD,
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
          background: GOLD,
          opacity: 0.07,
        }}
      />
      <Sequence from={0} durationInFrames={150}>
        <Reasons {...props} />
      </Sequence>
      <Sequence from={150} durationInFrames={100}>
        <Offer {...props} />
      </Sequence>
      <Sequence from={250} durationInFrames={120}>
        <Cta {...props} />
      </Sequence>
    </AbsoluteFill>
  );
};

