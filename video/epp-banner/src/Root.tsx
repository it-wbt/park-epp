import {AbsoluteFill, Composition, Folder, Sequence} from 'remotion';
import {MaterialsScene} from './MaterialsScene';
import {TechnicalScene} from './TechnicalScene';
import {LogisticsScene} from './LogisticsScene';
import {ProductScene} from './ProductScene';
import {EppProductAnimation} from './EppProductAnimation';
import {EppManufacturingFilm} from './EppManufacturingFilm';

const EppBanner = () => <AbsoluteFill style={{backgroundColor:'#0c2238'}}>
  <Sequence name="EPP and protective packaging" durationInFrames={144}><MaterialsScene/></Sequence>
  <Sequence name="Engineered HVAC components" from={120} durationInFrames={144}><TechnicalScene/></Sequence>
  <Sequence name="Reusable transport packaging" from={240} durationInFrames={120}><LogisticsScene/></Sequence>
  <Sequence name="Return to opening for seamless loop" from={336} durationInFrames={24}><ProductScene image="epp-hero.webp" fadeIn/></Sequence>
</AbsoluteFill>;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition id="EppManufacturingHero" component={EppManufacturingFilm} durationInFrames={720} fps={30} width={1600} height={900} defaultProps={{labels: false}}/>
      <Composition id="EppManufacturingProcess" component={EppManufacturingFilm} durationInFrames={720} fps={30} width={1600} height={900} defaultProps={{labels: true}}/>
      <Composition id="EppProductMotion" component={EppProductAnimation} durationInFrames={360} fps={30} width={1600} height={900}/>
      <Composition id="EppBanner" component={EppBanner} durationInFrames={360} fps={30} width={1600} height={900}/>
      <Folder name="Scenes">
        <Composition id="Materials" component={MaterialsScene} durationInFrames={144} fps={30} width={1600} height={900}/>
        <Composition id="Technical" component={TechnicalScene} durationInFrames={144} fps={30} width={1600} height={900}/>
        <Composition id="Logistics" component={LogisticsScene} durationInFrames={120} fps={30} width={1600} height={900}/>
      </Folder>
    </>
  );
};
