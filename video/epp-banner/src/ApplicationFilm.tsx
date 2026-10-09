import {AbsoluteFill, CanvasImage, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';

/** Original product-image motion films; these are illustrations, not factory footage. */
export const ApplicationFilm = ({image}: {image: string}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const phase = frame / durationInFrames * Math.PI * 2;
  const zoom = 1.04 + (1 - Math.cos(phase)) * .025;
  return <AbsoluteFill style={{backgroundColor: '#10283c', overflow: 'hidden'}}>
    <CanvasImage src={staticFile(image)} style={{width:'100%',height:'100%',objectFit:'cover',transform:`translate(${Math.sin(phase)*10}px, ${Math.sin(phase)*4}px) scale(${zoom})`}}/>
  </AbsoluteFill>;
};
