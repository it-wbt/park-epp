import {useLayoutEffect, useRef, useState} from 'react';
import {useThree} from '@react-three/fiber';
import {ThreeCanvas} from '@remotion/three';
import {loadFont} from '@remotion/fonts';
import {AbsoluteFill, cancelRender, continueRender, delayRender, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import * as THREE from 'three';
import {createManufacturingStage} from './EppManufacturingStage';
import {eppProcess, getEppProcessStep} from '../../../src/lib/epp-process';

loadFont({family: 'DM Sans', url: staticFile('fonts/dm-sans-latin.woff2'), weight: '400 700'});
loadFont({family: 'Manrope', url: staticFile('fonts/manrope-latin.woff2'), weight: '400 800'});

function ManufacturingScene({frame}: {frame: number}) {
  const {width, height} = useVideoConfig();
  const {gl, set, scene: originalScene, camera: originalCamera} = useThree();
  const stage = useRef<ReturnType<typeof createManufacturingStage> | null>(null);
  const latestFrame = useRef(frame);
  const initial = useRef({scene: originalScene, camera: originalCamera});
  const [handle] = useState(() => delayRender('Loading the EPP moulding scene'));

  useLayoutEffect(() => {
    let cancelled = false;
    new THREE.TextureLoader().load(staticFile('epp-foam-albedo.webp'), texture => {
      if (cancelled) {texture.dispose(); return;}
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = 4;
      try {
        const next = createManufacturingStage(width, height, texture, gl);
        stage.current = next;
        set({scene: next.scene, camera: next.camera});
        next.update(latestFrame.current);
        gl.render(next.scene, next.camera);
        continueRender(handle);
      } catch (error) {
        texture.dispose();
        cancelRender(error instanceof Error ? error : new Error(String(error)));
      }
    }, undefined, () => cancelRender(new Error('Could not load the EPP foam texture')));
    return () => {
      cancelled = true;
      stage.current?.dispose();
      stage.current = null;
      set(initial.current);
    };
  }, [gl, set, width, height, handle]);

  useLayoutEffect(() => {
    latestFrame.current = frame;
    const current = stage.current;
    if (current) {
      current.update(frame);
      gl.render(current.scene, current.camera);
    }
  }, [frame, gl]);
  return null;
}

type Props = {labels: boolean};

export const EppManufacturingFilm = ({labels}: Props) => {
  const frame = useCurrentFrame();
  const {width, height, fps} = useVideoConfig();
  const stepIndex = getEppProcessStep(frame / fps);
  const step = eppProcess[stepIndex];
  const enter = interpolate(frame - step.start * fps, [0, 12], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const loopFade = interpolate(frame, [0, 10, 708, 719], [1, 0, 0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill style={{background: '#101d28'}}>
      <ThreeCanvas width={width} height={height} dpr={1} shadows gl={{antialias: true, alpha: false, preserveDrawingBuffer: true}}>
        <ManufacturingScene frame={frame}/>
      </ThreeCanvas>
      <AbsoluteFill style={{background: '#0c1c29', opacity: loopFade, pointerEvents: 'none'}}/>
      {labels && <>
        <AbsoluteFill style={{background: 'linear-gradient(90deg,rgba(7,26,40,.92),rgba(7,26,40,.66) 34%,transparent 64%)', pointerEvents: 'none'}}/>
        <div style={{position: 'absolute', left: 72, top: 90, width: 520, fontFamily: 'DM Sans', color: '#fff'}}>
          <div style={{fontSize: 18, letterSpacing: 3, color: '#cfe990', marginBottom: 26}}>EPP · FROM BEAD TO COMPONENT</div>
          <div style={{fontFamily: 'Manrope', fontSize: 66, lineHeight: 1.14, letterSpacing: -2}}>How the<br/>shape happens.</div>
          <div style={{marginTop: 92, opacity: enter, transform: `translateY(${(1 - enter) * 12}px)`}}>
            <div style={{color: '#cfe990', fontSize: 22, marginBottom: 18}}>0{stepIndex + 1} / 06</div>
            <div style={{fontSize: 36, fontWeight: 600, marginBottom: 18}}>{step.name}</div>
            <div style={{fontSize: 24, lineHeight: 1.55, color: '#d9e4e9', maxWidth: 435}}>{step.detail}</div>
          </div>
        </div>
        <div style={{position: 'absolute', left: 72, bottom: 65, font: '16px DM Sans', color: '#c5d3dc'}}>3D process illustration · Sequence shown in condensed time</div>
        <div style={{position: 'absolute', bottom: 0, height: 4, background: '#cfe990', width: `${frame / 719 * 100}%`}}/>
      </>}
    </AbsoluteFill>
  );
};
