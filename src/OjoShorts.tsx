import { AbsoluteFill, Composition, Sequence } from "remotion";
import { OjoIntro } from "./OjoIntro";
import { OjoStruggle } from "./OjoStruggle";
import { OjoStudent } from "./OjoStudent";
import { OjoClose } from "./OjoClose";
import type { OjoStoryProps } from "./OjoStory";

type Piece = {
  kind: "intro" | "struggle" | "student" | "close";
  start: number;
  len: number;
};

// 30 seconds = 900 frames
const PLAN_30: Piece[] = [
  { kind: "intro", start: 0, len: 40 },
  { kind: "intro", start: 45, len: 30 },
  { kind: "intro", start: 165, len: 30 },
  { kind: "intro", start: 195, len: 50 },
  { kind: "struggle", start: 0, len: 90 },
  { kind: "struggle", start: 270, len: 90 },
  { kind: "struggle", start: 420, len: 75 },
  { kind: "student", start: 40, len: 110 },
  { kind: "student", start: 186, len: 60 },
  { kind: "student", start: 340, len: 150 },
  { kind: "close", start: 0, len: 80 },
  { kind: "close", start: 250, len: 95 },
];

// 15 seconds = 450 frames
const PLAN_15: Piece[] = [
  { kind: "intro", start: 0, len: 25 },
  { kind: "intro", start: 195, len: 35 },
  { kind: "struggle", start: 0, len: 45 },
  { kind: "struggle", start: 270, len: 60 },
  { kind: "struggle", start: 420, len: 60 },
  { kind: "student", start: 40, len: 60 },
  { kind: "student", start: 372, len: 90 },
  { kind: "close", start: 250, len: 75 },
];

const Cut: React.FC<{
  at: number;
  start: number;
  len: number;
  children: React.ReactNode;
}> = ({ at, start, len, children }) => (
  <Sequence from={at} durationInFrames={len}>
    <Sequence from={-start}>{children}</Sequence>
  </Sequence>
);

const Assemble: React.FC<OjoStoryProps & { plan: Piece[] }> = ({
  plan,
  intro,
  struggle,
  student,
  close,
}) => {
  let at = 0;
  return (
    <AbsoluteFill style={{ background: "#050505" }}>
      {plan.map((p, i) => {
        const scene =
          p.kind === "intro" ? (
            <OjoIntro {...intro} />
          ) : p.kind === "struggle" ? (
            <OjoStruggle {...struggle} />
          ) : p.kind === "student" ? (
            <OjoStudent {...student} />
          ) : (
            <OjoClose {...close} />
          );
        const el = (
          <Cut key={i} at={at} start={p.start} len={p.len}>
            {scene}
          </Cut>
        );
        at += p.len;
        return el;
      })}
    </AbsoluteFill>
  );
};

export const OjoStory30: React.FC<OjoStoryProps> = (props) => (
  <Assemble plan={PLAN_30} {...props} />
);

export const OjoStory15: React.FC<OjoStoryProps> = (props) => (
  <Assemble plan={PLAN_15} {...props} />
);

export const ShortCompositions: React.FC<{ defaults: OjoStoryProps }> = ({
  defaults,
}) => (
  <>
    <Composition
      id="OjoStory30"
      component={OjoStory30}
      durationInFrames={900}
      fps={30}
      width={1080}
      height={1920}
      defaultProps={defaults}
    />
    <Composition
      id="OjoStory15"
      component={OjoStory15}
      durationInFrames={450}
      fps={30}
      width={1080}
      height={1920}
      defaultProps={defaults}
    />
  </>
);
