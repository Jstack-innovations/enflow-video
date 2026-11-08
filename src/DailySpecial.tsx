import {
  AbsoluteFill,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export type DailySpecialProps = {
  restaurantName: string;
  tagline: string;
  itemName: string;
  price: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
};

const Intro: React.FC<DailySpecialProps> = ({
  restaurantName,
  tagline,
  accentColor,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const nameIn = spring({ frame, fps, config: { damping: 14 } });
  const tagIn = spring({ frame: frame - 12, fps, config: { damping: 200 } });
  const exit = interpolate(frame, [40, 55], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        opacity: exit,
      }}
    >
      <div
        style={{
          fontSize: 110,
          fontWeight: 800,
          color: "#fff",
          transform: `scale(${nameIn})`,
          textAlign: "center",
          padding: "0 60px",
        }}
      >
        {restaurantName}
      </div>
      <div
        style={{
          marginTop: 30,
          fontSize: 56,
          letterSpacing: 8,
          textTransform: "uppercase",
          color: accentColor,
          opacity: tagIn,
          transform: `translateY(${(1 - tagIn) * 40}px)`,
        }}
      >
        {restaurantName ? "" : ""}
      </div>
    </AbsoluteFill>
  );
};

const Reveal: React.FC<DailySpecialProps> = ({
  tagline,
  itemName,
  price,
  accentColor,
  secondaryColor,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const tagIn = spring({ frame, fps, config: { damping: 200 } });
  const itemIn = spring({ frame: frame - 8, fps, config: { damping: 12 } });
  const priceIn = spring({ frame: frame - 28, fps, config: { damping: 8 } });

  const wordsRevealed = itemName.split(" ");

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        padding: 60,
      }}
    >
      <div
        style={{
          fontSize: 54,
          letterSpacing: 8,
          textTransform: "uppercase",
          color: accentColor,
          opacity: tagIn,
          transform: `translateY(${(1 - tagIn) * 40}px)`,
        }}
      >
        {tagline}
      </div>

      <div style={{ marginTop: 40, textAlign: "center" }}>
        {wordsRevealed.map((word, i) => {
          const w = spring({
            frame: frame - 8 - i * 5,
            fps,
            config: { damping: 12 },
          });
          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                fontSize: 120,
                fontWeight: 800,
                color: "#fff",
                marginRight: 24,
                opacity: w,
                transform: `translateY(${(1 - w) * 80}px) scale(${0.8 + w * 0.2})`,
              }}
            >
              {word}
            </span>
          );
        })}
      </div>

      <div
        style={{
          marginTop: 70,
          background: accentColor,
          color: secondaryColor,
          fontSize: 110,
          fontWeight: 800,
          padding: "10px 60px",
          borderRadius: 24,
          transform: `scale(${priceIn})`,
        }}
      >
        {price}
      </div>
      {/* itemIn kept for future per-item effects */}
      <div style={{ display: "none" }}>{itemIn}</div>
    </AbsoluteFill>
  );
};

const Outro: React.FC<DailySpecialProps> = ({
  restaurantName,
  accentColor,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame, fps, config: { damping: 10 } });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div
        style={{
          fontSize: 90,
          fontWeight: 800,
          color: "#fff",
          transform: `scale(${pop})`,
          textAlign: "center",
        }}
      >
        Order now
      </div>
      <div
        style={{
          marginTop: 24,
          fontSize: 54,
          color: accentColor,
          opacity: pop,
        }}
      >
        {restaurantName}
      </div>
    </AbsoluteFill>
  );
};

export const DailySpecial: React.FC<DailySpecialProps> = (props) => {
  const frame = useCurrentFrame();

  const bg = interpolate(frame, [0, 150], [0, 1]);

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(${160 + bg * 40}deg, ${props.primaryColor}, ${props.secondaryColor})`,
        fontFamily: "Helvetica, Arial, sans-serif",
      }}
    >
      <Sequence from={0} durationInFrames={55}>
        <Intro {...props} />
      </Sequence>
      <Sequence from={45} durationInFrames={65}>
        <Reveal {...props} />
      </Sequence>
      <Sequence from={105} durationInFrames={45}>
        <Outro {...props} />
      </Sequence>
    </AbsoluteFill>
  );
};

