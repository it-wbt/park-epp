import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';

/** Camera-motion demo made from AI-generated illustrative scenes, not filmed product footage. */
export const SportsUseFilm = () => {
 const frame=useCurrentFrame();
 const {fps}=useVideoConfig();
 const cycle=frame/(12*fps);
 const second=interpolate(frame,[5.5*fps,6.5*fps,11*fps,12*fps],[0,1,1,0],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
 return <AbsoluteFill style={{background:'#10283c',overflow:'hidden'}}>
  <AbsoluteFill><Img src={staticFile('epp-play-use-v1.png')} style={{width:'100%',height:'100%',objectFit:'cover',transform:`scale(${1.04+0.035*Math.sin(cycle*Math.PI*2)}) translateX(${Math.sin(cycle*Math.PI*2)*-8}px)`}}/></AbsoluteFill>
  <AbsoluteFill style={{opacity:second}}><Img src={staticFile('epp-fitness-use-v1.png')} style={{width:'100%',height:'100%',objectFit:'cover',transform:`scale(${1.04+0.025*Math.cos(cycle*Math.PI*2)}) translateX(${Math.sin(cycle*Math.PI*2)*8}px)`}}/></AbsoluteFill>
  <div style={{position:'absolute',left:0,right:0,bottom:0,height:'24%',background:'linear-gradient(transparent,rgba(5,26,38,.6))'}}/>
  <div style={{position:'absolute',left:48,bottom:42,color:'white',fontFamily:'Arial,sans-serif'}}><div style={{fontSize:13,letterSpacing:2,marginBottom:10}}>EPP IN EVERYDAY USE</div><div style={{fontSize:32,fontWeight:500}}>{frame<6*fps?'Made for movement & play.':'Lightweight support for active spaces.'}</div></div>
  <div style={{position:'absolute',right:24,top:20,color:'white',fontFamily:'Arial,sans-serif',fontSize:11,background:'rgba(5,26,38,.45)',padding:'6px 9px',borderRadius:3}}>AI-generated illustration</div>
 </AbsoluteFill>;
};
