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
import { loadFont as loadMono } from "@remotion/google-fonts/SpaceMono";

const { fontFamily: SERIF } = loadSerif("normal", {
  weights: ["400", "600", "700"],
  subsets: ["latin"],
});
const { fontFamily: MONO } = loadMono("normal", {
  weights: ["400", "700"],
  subsets: ["latin"],
});

export type OjoIntroProps = {
  clips: string[];
};

const GOLD = "#d4a853";
const CREAM = "#f5ead6";

const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

const useIn = (delay = 0, damping = 12) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: { damping } });
};

const LANDMARKS = [
  { name: "Alaba International Market", sub: "Ojo, Lagos" },
  { name: "Trade Fair", sub: "International Market" },
  { name: "LASU", sub: "Lagos State University" },
  { name: "Unique Open University", sub: "Ojo, Lagos" },
  { name: "ECOWAS Road", sub: "Badagry Expressway trade zone" },
];

const Footage: React.FC<{ src?: string; label: string; zoom?: boolean }> = ({
  src,
  label,
  zoom = true,
}) => {
  const frame = useCurrentFrame();
  const scale = zoom ? interpolate(frame, [0, 45], [1, 1.1], clamp) : 1;

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
            fontSize: 36,
            letterSpacing: 6,
            color: GOLD,
            opacity: 0.45,
          }}
        >
          {label}
        </div>
      </AbsoluteFill>
    );
  }

  const isImage = /\.(jpe?g|png|webp)$/i.test(src);

  return (
    <AbsoluteFill style={{ transform: `scale(${scale})` }}>
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
  );
};

const Shade: React.FC<{ strength?: number }> = ({ strength = 1 }) => (
  <AbsoluteFill
    style={{
      background: `linear-gradient(180deg, rgba(5,5,5,${0.35 * strength}) 0%, rgba(5,5,5,${0.12 * strength}) 40%, rgba(5,5,5,${0.88 * strength}) 100%)`,
    }}
  />
);

/* "Ojo never sleeps." over the first clip */
const Title: React.FC<{ clips: string[] }> = ({ clips }) => {
  const a = useIn(2);
  const b = useIn(12);
  const line = interpolate(useCurrentFrame(), [14, 36], [0, 100], clamp);
  return (
    <AbsoluteFill>
      <Footage src={clips[0]} label="ADD CLIP 1" />
      <Shade strength={1.6} />
      <AbsoluteFill style={{ justifyContent: "center", padding: "0 80px" }}>
        <div
          style={{
            fontFamily: SERIF,
            fontSize: 190,
            lineHeight: 0.95,
            color: CREAM,
            opacity: a,
            transform: `translateY(${(1 - a) * 100}px)`,
          }}
        >
          Ojo
        </div>
        <div
          style={{
            fontFamily: SERIF,
            fontStyle: "italic",
            fontSize: 190,
            lineHeight: 0.95,
            color: GOLD,
            opacity: b,
            transform: `translateY(${(1 - b) * 100}px)`,
          }}
        >
          never sleeps.
        </div>
        <div
          style={{
            marginTop: 50,
            height: 4,
            width: `${line}%`,
            maxWidth: 520,
            background: GOLD,
          }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* one flash per landmark */
const Landmark: React.FC<{
  index: number;
  src?: string;
}> = ({ index, src }) => {
  const frame = useCurrentFrame();
  const l = LANDMARKS[index];
  const name = useIn(3, 14);
  const sub = useIn(9);
  const cut = interpolate(frame, [0, 3], [0, 1], clamp);

  return (
    <AbsoluteFill style={{ opacity: cut }}>
      <Footage src={src} label={`ADD CLIP ${index + 1}`} />
      <Shade />
      <div
        style={{
          position: "absolute",
          top: 90,
          right: 70,
          fontFamily: MONO,
          fontSize: 30,
          letterSpacing: 6,
          color: GOLD,
        }}
      >
        0{index + 1} / 05
      </div>
      <div style={{ position: "absolute", left: 70, right: 70, bottom: 230 }}>
        <div
          style={{
            fontFamily: MONO,
            fontWeight: 700,
            fontSize: 32,
            letterSpacing: 8,
            textTransform: "uppercase",
            color: GOLD,
            opacity: sub,
          }}
        >
          {l.sub}
        </div>
        <div
          style={{
            marginTop: 20,
            fontFamily: SERIF,
            fontWeight: 700,
            fontSize: 150,
            lineHeight: 1,
            color: CREAM,
            opacity: name,
            transform: `translateX(${(1 - name) * -160}px)`,
          }}
        >
          {l.name}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* "Everybody is hungry." */
const Hungry: React.FC<{ src?: string }> = ({ src }) => {
  const a = useIn(2);
  const b = useIn(14, 8);
  return (
    <AbsoluteFill>
      <Footage src={src} label="ADD CLIP 6 (OPTIONAL)" zoom={false} />
      <Shade strength={1.8} />
      <AbsoluteFill
        style={{ justifyContent: "center", alignItems: "center" }}
      >
        <div
          style={{
            fontFamily: SERIF,
            fontSize: 120,
            color: CREAM,
            opacity: a,
            transform: `translateY(${(1 - a) * 80}px)`,
          }}
        >
          Everybody is
        </div>
        <div
          style={{
            fontFamily: SERIF,
            fontStyle: "italic",
            fontWeight: 700,
            fontSize: 250,
            color: GOLD,
            opacity: b,
            transform: `scale(${0.7 + b * 0.3})`,
          }}
        >
          hungry.
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const OjoIntro: React.FC<OjoIntroProps> = ({ clips }) => {
  return (
    <AbsoluteFill style={{ background: "#050505" }}>
      <Sequence from={0} durationInFrames={45}>
        <Title clips={clips} />
      </Sequence>
      {LANDMARKS.map((_, i) => (
        <Sequence key={i} from={45 + i * 30} durationInFrames={30}>
          <Landmark index={i} src={clips[i]} />
        </Sequence>
      ))}
      <Sequence from={195} durationInFrames={75}>
        <Hungry src={clips[5]} />
      </Sequence>
    </AbsoluteFill>
  );
};
