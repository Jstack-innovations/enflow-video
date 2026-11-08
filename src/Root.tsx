import { Composition } from "remotion";
import { DailySpecial, DailySpecialProps } from "./DailySpecial";
import { DiscoverAd, DiscoverAdProps } from "./DiscoverAd";
import { OjoIntro, OjoIntroProps } from "./OjoIntro";
import { OjoStruggle, OjoStruggleProps } from "./OjoStruggle";
import { OjoStudent, OjoStudentProps } from "./OjoStudent";
import { OjoClose, OjoCloseProps } from "./OjoClose";
import { OjoStory, OjoStoryProps, STORY_LEN } from "./OjoStory";
import { Launch2D30, LAUNCH2D30_LEN, launch2D30Defaults } from "./Launch2D30";
import { LaunchComposition } from "./EnflowLaunch";
import { ShortCompositions } from "./OjoShorts";

const dailyDefaults: DailySpecialProps = {
  restaurantName: "Artisan Grills",
  tagline: "Today's Special",
  itemName: "Smoked Peri-Peri Chicken",
  price: "$12.50",
  primaryColor: "#E4572E",
  secondaryColor: "#1B1B1E",
  accentColor: "#FFC857",
  imageUrl: "",
};

const discoverDefaults: DiscoverAdProps = {
  brand: "Enflow Discovery",
  area: "Ojo",
  discountLabel: "special discount",
  ctaLink: "",
  dishImages: ["wings.jpg", "pie.jpg"],
  gold: "#d4a853",
  bgDark: "#1a120b",
  bgDeep: "#0d0804",
  cream: "#f5ead6",
};

const ojoIntroDefaults: OjoIntroProps = {
  clips: ["alaba.jpg", "tradefair.jpg", "lasu.jpg", "unique.jpg", "ecowas.jpg"],
};

const ojoStruggleDefaults: OjoStruggleProps = {
  confusedImage: "confused.jpg",
  kitchenImage: "kitchen.jpg",
  dishImage: "wings.jpg",
  appNames: ["Food App", "Delivery App", "Eats App", "Order App"],
};

const ojoStudentDefaults: OjoStudentProps = {
  studentName: "Amaka",
  studentLine: "A LASU student. Hungry after lectures.",
  studentImage: "student.jpg",
  dishImages: ["wings.jpg", "pie.jpg"],
};

const ojoCloseDefaults: OjoCloseProps = {
  brand: "Enflow Discovery",
  area: "Ojo",
  discountLabel: "special discount",
  ctaLink: "",
  tagline: "Smooth orders. Good food.",
};

const ojoStoryDefaults: OjoStoryProps = {
  intro: ojoIntroDefaults,
  struggle: ojoStruggleDefaults,
  student: ojoStudentDefaults,
  close: ojoCloseDefaults,
};

export const Root: React.FC = () => {
  return (
    <>
      <Composition
        id="OjoStory"
        component={OjoStory}
        durationInFrames={STORY_LEN}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={ojoStoryDefaults}
      />
      <Composition
        id="OjoIntro"
        component={OjoIntro}
        durationInFrames={270}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={ojoIntroDefaults}
      />
      <Composition
        id="OjoStruggle"
        component={OjoStruggle}
        durationInFrames={530}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={ojoStruggleDefaults}
      />
      <Composition
        id="OjoStudent"
        component={OjoStudent}
        durationInFrames={540}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={ojoStudentDefaults}
      />
      <Composition
        id="OjoClose"
        component={OjoClose}
        durationInFrames={370}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={ojoCloseDefaults}
      />
      <Composition
        id="DiscoverAd"
        component={DiscoverAd}
        durationInFrames={840}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={discoverDefaults}
      />
      <Composition
        id="DailySpecial"
        component={DailySpecial}
        durationInFrames={150}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={dailyDefaults}
      />
      <ShortCompositions defaults={ojoStoryDefaults} />
      <LaunchComposition />
      <Composition id="Launch2D30" component={Launch2D30} durationInFrames={LAUNCH2D30_LEN} fps={30} width={1080} height={1920} defaultProps={launch2D30Defaults} />
    </>
  );
};