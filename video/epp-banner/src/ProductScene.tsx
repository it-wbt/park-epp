import {AbsoluteFill, CanvasImage, interpolate, staticFile, useCurrentFrame} from 'remotion';

export const ProductScene = ({image, fadeIn = false}: {image: string; fadeIn?: boolean}) => {
  const frame = useCurrentFrame();
  return <AbsoluteFill style={{backgroundColor:'#0c2238', opacity:fadeIn ? interpolate(frame,[0,24],[0,1],{extrapolateRight:'clamp'}) : 1}}>
    <CanvasImage src={staticFile(image)} style={{width:'100%',height:'100%',objectFit:'cover',scale:interpolate(frame,[0,144],[1.02,1.07],{extrapolateRight:'clamp'}),translate:interpolate(frame,[0,144],['0px 0px','-12px 0px'],{extrapolateRight:'clamp'})}}/>
  </AbsoluteFill>;
};
