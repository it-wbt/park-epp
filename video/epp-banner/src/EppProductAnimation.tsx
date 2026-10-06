import {useLayoutEffect, useRef, useState} from 'react';
import {cancelRender, continueRender, delayRender, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import * as THREE from 'three';
import {RoundedBoxGeometry} from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import {RoomEnvironment} from 'three/examples/jsm/environments/RoomEnvironment.js';

function roundedOutline(width:number, depth:number, radius:number) {
  const s=new THREE.Shape(),x=-width/2,y=-depth/2;
  s.moveTo(x+radius,y);s.lineTo(x+width-radius,y);
  s.quadraticCurveTo(x+width,y,x+width,y+radius);
  s.lineTo(x+width,y+depth-radius);s.quadraticCurveTo(x+width,y+depth,x+width-radius,y+depth);
  s.lineTo(x+radius,y+depth);s.quadraticCurveTo(x,y+depth,x,y+depth-radius);
  s.lineTo(x,y+radius);s.quadraticCurveTo(x,y,x+radius,y);
  return s;
}

// Deterministic bead texture, made from surface relief rather than a product photograph.
function foamRelief() {
  const canvas=document.createElement('canvas');canvas.width=canvas.height=512;
  const ctx=canvas.getContext('2d')!;ctx.fillStyle='#707070';ctx.fillRect(0,0,512,512);
  let seed=937;
  const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
  for(let y=-10;y<532;y+=10)for(let x=-10;x<532;x+=10){
    const cx=x+(random()-.5)*5,cy=y+(random()-.5)*5,r=5+random()*2;
    const gradient=ctx.createRadialGradient(cx-1.2,cy-1.4,.3,cx,cy,r);
    gradient.addColorStop(0,'#c4c4c4');gradient.addColorStop(.65,'#929292');gradient.addColorStop(1,'#4e4e4e');
    ctx.fillStyle=gradient;ctx.beginPath();ctx.ellipse(cx,cy,r,r*(.8+random()*.3),random()*3,0,Math.PI*2);ctx.fill();
  }
  const texture=new THREE.CanvasTexture(canvas);texture.wrapS=texture.wrapT=THREE.RepeatWrapping;
  texture.repeat.set(1.5,1.5);texture.anisotropy=4;
  return texture;
}

function createStage(canvas:HTMLCanvasElement,width:number,height:number,foam:THREE.Texture){
  const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:false,preserveDrawingBuffer:true});
  renderer.setSize(width,height,false);renderer.setPixelRatio(1);
  renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.15;
  renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.VSMShadowMap;
  const scene=new THREE.Scene();scene.background=new THREE.Color('#111b22');scene.fog=new THREE.Fog('#111b22',18,38);
  const pmrem=new THREE.PMREMGenerator(renderer);const room=new RoomEnvironment();const environment=pmrem.fromScene(room,.04);scene.environment=environment.texture;scene.environmentIntensity=.7;room.dispose();pmrem.dispose();
  const camera=new THREE.PerspectiveCamera(34,width/height,.1,70);
  const relief=foamRelief();
  const charcoal=new THREE.MeshStandardMaterial({color:'#e4e6e7',map:foam,roughness:.95,bumpMap:foam,bumpScale:.012});
  const lidMat=new THREE.MeshStandardMaterial({color:'#e4e6e7',map:foam,roughness:.95,bumpMap:foam,bumpScale:.012});
  const white=new THREE.MeshStandardMaterial({color:'#e8e5df',roughness:.96,bumpMap:relief,bumpScale:.019});
  const dark=new THREE.MeshStandardMaterial({color:'#121b21',roughness:.84});
  const metal=new THREE.MeshStandardMaterial({color:'#8fabb9',roughness:.38,metalness:.8});
  const products=new THREE.Group();products.position.set(1.95,0,0);scene.add(products);
  const mesh=(geometry:THREE.BufferGeometry,material:THREE.Material,parent:THREE.Object3D,x=0,y=0,z=0)=>{
    if(material===charcoal||material===lidMat||material===white){
      const positions=geometry.getAttribute('position'),normals=geometry.getAttribute('normal'),uv=new Float32Array(positions.count*2);
      for(let i=0;i<positions.count;i++){const nx=Math.abs(normals.getX(i)),ny=Math.abs(normals.getY(i)),nz=Math.abs(normals.getZ(i));uv[i*2]=(nx>ny&&nx>nz?positions.getZ(i):positions.getX(i))*.95;uv[i*2+1]=(ny>=nx&&ny>=nz?positions.getZ(i):positions.getY(i))*.95;}
      geometry.setAttribute('uv',new THREE.BufferAttribute(uv,2));
    }
    const item=new THREE.Mesh(geometry,material);item.position.set(x,y,z);item.castShadow=true;item.receiveShadow=true;parent.add(item);return item;
  };
  const box=(w:number,h:number,d:number,r:number,mat:THREE.Material,parent:THREE.Object3D,x=0,y=0,z=0)=>mesh(new RoundedBoxGeometry(w,h,d,3,r),mat,parent,x,y,z);

  // An open, thick-walled EPP transport container with a fitted removable lid.
  const container=new THREE.Group();container.position.set(.55,0,1.0);container.rotation.y=-.12;products.add(container);
  const shell=roundedOutline(3.05,2.05,.18);shell.holes.push(roundedOutline(2.58,1.59,.15));
  const walls=mesh(new THREE.ExtrudeGeometry(shell,{depth:1.32,steps:1,bevelEnabled:true,bevelSegments:3,bevelSize:.025,bevelThickness:.025,curveSegments:8}),charcoal,container,0,.2,0);
  walls.rotation.x=-Math.PI/2;
  box(3.05,.26,2.05,.12,charcoal,container,0,.13,0);
  box(2.52,.055,1.53,.02,dark,container,0,.27,0);
  // Moulded grip recesses and a subtle identification insert.
  box(.84,.22,.012,.075,dark,container,0,1.02,1.042);
  box(.8,.13,.06,.045,charcoal,container,0,1.11,1.05);
  const lidPivot=new THREE.Group();container.add(lidPivot);const lid=new THREE.Group();lid.position.z=1.0;lidPivot.add(lid);
  box(3.13,.25,2.13,.1,lidMat,lid,0,0,0);
  box(2.52,.14,1.51,.07,charcoal,lid,0,-.175,0);
  // Shallow ribs strengthen the lid and make depth changes visible during movement.
  for(const x of [-.83,.83])box(.06,.009,1.58,.004,lidMat,lid,x,.129,0);
  for(const x of [-.93,.93]){const hinge=mesh(new THREE.CylinderGeometry(.065,.065,.30,24),dark,container,x,1.68,-1.0);hinge.rotation.z=Math.PI/2;}

  // Technical EPP air housing: a real through-channel, with a hollow round duct.
  const hvac=new THREE.Group();hvac.position.set(-1.62,-.195,-1.12);hvac.rotation.y=.14;products.add(hvac);
  const housingOutline=roundedOutline(2.35,1.68,.23);
  const opening=new THREE.Path();opening.absarc(0,0,.57,0,Math.PI*2,true);housingOutline.holes.push(opening);
  mesh(new THREE.ExtrudeGeometry(housingOutline,{depth:1.45,bevelEnabled:true,bevelSize:.075,bevelThickness:.075,bevelSegments:4,curveSegments:40}),charcoal,hvac,0,1.11,-.65);
  const profile=[new THREE.Vector2(.70,0),new THREE.Vector2(.70,.50),new THREE.Vector2(.57,.50),new THREE.Vector2(.57,0),new THREE.Vector2(.70,0)];
  const duct=mesh(new THREE.LatheGeometry(profile,64),charcoal,hvac,0,1.11,.82);duct.rotation.x=Math.PI/2;
  for(const x of [-.94,.94])box(.24,.16,1.72,.035,charcoal,hvac,x,.23,.07);
  for(const x of [-.85,.85])box(.1,.7,.07,.015,lidMat,hvac,x,1.12,.87);

  // EPS protection cushions around a compact metal equipment component.
  const packed=new THREE.Group();packed.position.set(2.48,-.09,-.8);packed.rotation.y=-.28;products.add(packed);
  box(1.05,.66,.95,.07,metal,packed,0,.72,0);
  for(let i=0;i<7;i++)box(.9,.025,.035,.004,metal,packed,0,1.068,-.34+i*.11);
  box(.32,.23,.06,.035,dark,packed,0,.76,.51);
  for(const x of [-.72,.72]){
    box(.38,.27,1.24,.06,white,packed,x,.18,0);
    box(.28,.82,1.24,.07,white,packed,x,.69,0);
    box(.47,.24,1.24,.05,white,packed,x,1.19,0);
  }

  const floorMaterial=new THREE.MeshStandardMaterial({color:'#20282c',roughness:.82,metalness:.04});
  const floor=mesh(new THREE.PlaneGeometry(120,120),floorMaterial,scene,0,-.045,0);floor.rotation.x=-Math.PI/2;floor.castShadow=false;
  scene.add(new THREE.HemisphereLight('#d9e3e7','#1b1a18',.35));
  const key=new THREE.DirectionalLight('#fff6eb',3.5);key.position.set(-1,8,4);key.castShadow=true;key.shadow.mapSize.set(2048,2048);key.shadow.camera.left=-7;key.shadow.camera.right=7;key.shadow.camera.top=7;key.shadow.camera.bottom=-7;key.shadow.normalBias=.014;key.shadow.bias=-.00008;key.shadow.radius=5;key.shadow.blurSamples=8;scene.add(key);
  const rim=new THREE.DirectionalLight('#bacbd6',2.2);rim.position.set(1,4,-5);scene.add(rim);
  const fill=new THREE.DirectionalLight('#ffffff',.55);fill.position.set(-5,3,1);scene.add(fill);

  const update=(frame:number)=>{
    const phase=frame/360*Math.PI*2;
    // Zero velocity at loop boundary; camera makes a continuous small orbit.
    camera.position.set(7.2+Math.sin(phase)*1.4,4.6+Math.sin(phase)*.1,11.8+Math.cos(phase)*.45);
    camera.lookAt(-.3,1.0,0);
    const openingAmount=Math.pow((1-Math.cos(phase))/2,1.35);
    lidPivot.position.set(0,1.68,-1.0);lidPivot.rotation.x=-1.20*openingAmount;
    rim.position.x=1+Math.sin(phase)*2;
    renderer.render(scene,camera);
  };
  return {update,dispose:()=>{scene.traverse(obj=>{if(obj instanceof THREE.Mesh)obj.geometry.dispose();});for(const mat of [charcoal,lidMat,white,dark,metal,floorMaterial])mat.dispose();relief.dispose();foam.dispose();environment.dispose();renderer.dispose();}};
}

export const EppProductAnimation=()=>{
  const frame=useCurrentFrame();const {width,height}=useVideoConfig();
  const canvas=useRef<HTMLCanvasElement>(null);const stage=useRef<ReturnType<typeof createStage>|null>(null);const latestFrame=useRef(frame);
  const [handle]=useState(()=>delayRender('Preparing the EPP 3D scene'));
  useLayoutEffect(()=>{let cancelled=false;new THREE.TextureLoader().load(staticFile('epp-foam-albedo.webp'),texture=>{if(cancelled){texture.dispose();return;}texture.wrapS=texture.wrapT=THREE.RepeatWrapping;texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=8;stage.current=createStage(canvas.current!,width,height,texture);stage.current.update(latestFrame.current);continueRender(handle);},undefined,()=>cancelRender(new Error('Could not load EPP material texture')));return()=>{cancelled=true;stage.current?.dispose();stage.current=null;};},[width,height,handle]);
  useLayoutEffect(()=>{latestFrame.current=frame;stage.current?.update(frame);},[frame]);
  return <canvas ref={canvas} width={width} height={height} style={{width:'100%',height:'100%',display:'block'}}/>;
};
