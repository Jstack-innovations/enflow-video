import { AbsoluteFill, Sequence } from "remotion";
import { OjoIntro, OjoIntroProps } from "./OjoIntro";
import { OjoStruggle, OjoStruggleProps } from "./OjoStruggle";
import { OjoStudent, OjoStudentProps } from "./OjoStudent";
import { OjoClose, OjoCloseProps } from "./OjoClose";

export type OjoStoryProps = {
  intro: OjoIntroProps;
  struggle: OjoStruggleProps;
  student: OjoStudentProps;
  close: OjoCloseProps;
};

// frame lengths of each part (30 fps)
export const INTRO_LEN = 270;
export const STRUGGLE_LEN = 530;
export const STUDENT_LEN = 540;
export const CLOSE_LEN = 370;
export const STORY_LEN = INTRO_LEN + STRUGGLE_LEN + STUDENT_LEN + CLOSE_LEN;

export const OjoStory: React.FC<OjoStoryProps> = ({
  intro,
  struggle,
  student,
  close,
}) => {
  return (
    <AbsoluteFill style={{ background: "#050505" }}>
      <Sequence from={0} durationInFrames={INTRO_LEN}>
        <OjoIntro {...intro} />
      </Sequence>
      <Sequence from={INTRO_LEN} durationInFrames={STRUGGLE_LEN}>
        <OjoStruggle {...struggle} />
      </Sequence>
      <Sequence
        from={INTRO_LEN + STRUGGLE_LEN}
        durationInFrames={STUDENT_LEN}
      >
        <OjoStudent {...student} />
      </Sequence>
      <Sequence
        from={INTRO_LEN + STRUGGLE_LEN + STUDENT_LEN}
        durationInFrames={CLOSE_LEN}
      >
        <OjoClose {...close} />
      </Sequence>
    </AbsoluteFill>
  );
};

