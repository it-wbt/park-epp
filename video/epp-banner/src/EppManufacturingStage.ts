import * as THREE from 'three';
import {RoundedBoxGeometry} from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import {RoomEnvironment} from 'three/examples/jsm/environments/RoomEnvironment.js';

const clamp = (v: number) => Math.max(0, Math.min(1, v));
const ease = (v: number) => {const t = clamp(v); return t * t * (3 - 2 * t);};
const phase = (t: number, start: number, end: number) => ease((t - start) / (end - start));

function outline(w: number, d: number, r: number) {
  const p = new THREE.Shape(), x = -w / 2, y = -d / 2;
  p.moveTo(x + r, y); p.lineTo(x + w - r, y);
  p.quadraticCurveTo(x + w, y, x + w, y + r); p.lineTo(x + w, y + d - r);
  p.quadraticCurveTo(x + w, y + d, x + w - r, y + d); p.lineTo(x + r, y + d);
  p.quadraticCurveTo(x, y + d, x, y + d - r); p.lineTo(x, y + r);
  p.quadraticCurveTo(x, y, x + r, y); return p;
}

/** Frame-addressable pressure-fill EPP cycle. All motion depends only on frame. */
export function createManufacturingStage(width: number, height: number, foam: THREE.Texture, renderer: THREE.WebGLRenderer) {
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = .92;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#09141e');
  scene.fog = new THREE.Fog('#09141e', 17, 40);
  const camera = new THREE.PerspectiveCamera(34, width / height, .1, 90);
  const pmrem = new THREE.PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  const environment = pmrem.fromScene(room, .045);
  scene.environment = environment.texture; scene.environmentIntensity = .43;
  room.dispose(); pmrem.dispose();
  const materials = new Set<THREE.Material>();
  const material = (options: THREE.MeshStandardMaterialParameters) => {
    const value = new THREE.MeshStandardMaterial(options); materials.add(value); return value;
  };
  const brushedCanvas = document.createElement('canvas'); brushedCanvas.width = brushedCanvas.height = 256;
  const brushedContext = brushedCanvas.getContext('2d')!;
  brushedContext.fillStyle = '#a8a8a8'; brushedContext.fillRect(0, 0, 256, 256);
  for (let y = 0; y < 256; y++) {
    const value = Math.round(138 + (Math.sin(y * 27.17) + 1) * 44);
    brushedContext.strokeStyle = `rgb(${value},${value},${value})`;
    brushedContext.beginPath(); brushedContext.moveTo(0, y); brushedContext.lineTo(256, y); brushedContext.stroke();
  }
  const brushed = new THREE.CanvasTexture(brushedCanvas);
  brushed.wrapS = brushed.wrapT = THREE.RepeatWrapping; brushed.repeat.set(2, 6); brushed.anisotropy = 4;
  const blue = material({color: '#124c77', metalness: .48, roughness: .29});
  const pale = material({color: '#9eafb7', metalness: .35, roughness: .32});
  const steel = material({color: '#748590', metalness: .94, roughness: .29, bumpMap: brushed, bumpScale: .0018});
  const chrome = material({color: '#b6c8d1', metalness: .98, roughness: .14});
  const aluminum = material({color: '#9dadb5', metalness: .92, roughness: .28, bumpMap: brushed, bumpScale: .0014});
  const rubber = material({color: '#0a1118', roughness: .8});
  const gold = material({color: '#b49345', metalness: .8, roughness: .3});
  const black = material({color: '#202b33', metalness: .65, roughness: .4});
  const foamMap = foam.clone(); foamMap.needsUpdate = true;
  foamMap.wrapS = foamMap.wrapT = THREE.RepeatWrapping;
  foamMap.repeat.set(1.6, 1.6); foamMap.colorSpace = THREE.SRGBColorSpace;
  const foamMaterial = material({color: '#acb2b6', map: foamMap, bumpMap: foamMap, bumpScale: .025, roughness: .92});
  const beadMaterial = material({color: '#202326', roughness: .88, bumpMap: foamMap, bumpScale: .01});
  const upperMaterial = material({color: '#a5b8c2', metalness: .92, roughness: .27, bumpMap: brushed, bumpScale: .0013, transparent: true});
  const coreMaterial = material({color: '#8195a2', metalness: .94, roughness: .25, transparent: true});
  const lowerMaterial = material({color: '#92a7b4', metalness: .92, roughness: .28, bumpMap: brushed, bumpScale: .0013, transparent: true});
  const glass = material({color: '#97cfe5', transparent: true, opacity: .16, metalness: .2, roughness: .18, depthWrite: false});
  const coolantMaterial = material({color: '#2d9dcc', emissive: '#0a8ecb', emissiveIntensity: .2, metalness: .3, roughness: .36});
  const steamMaterial = material({color: '#e8f3f5', transparent: true, opacity: 0, roughness: 1, depthWrite: false});
  const statusMaterial = material({color: '#49d4b0', emissive: '#20c494', emissiveIntensity: .8, roughness: .35});
  const mesh = (geometry: THREE.BufferGeometry, mat: THREE.Material, parent: THREE.Object3D, x = 0, y = 0, z = 0) => {
    const item = new THREE.Mesh(geometry, mat); item.position.set(x, y, z);
    item.castShadow = true; item.receiveShadow = true; parent.add(item); return item;
  };
  const box = (w: number, h: number, d: number, mat: THREE.Material, parent: THREE.Object3D, x = 0, y = 0, z = 0, r = .035) =>
    mesh(new RoundedBoxGeometry(w, h, d, 2, Math.min(r, w / 3, h / 3, d / 3)), mat, parent, x, y, z);
  const cylinder = (r: number, length: number, mat: THREE.Material, parent: THREE.Object3D, x: number, y: number, z: number, axis: 'x' | 'y' | 'z' = 'y') => {
    const item = mesh(new THREE.CylinderGeometry(r, r, length, 24), mat, parent, x, y, z);
    if (axis === 'x') item.rotation.z = Math.PI / 2;
    if (axis === 'z') item.rotation.x = Math.PI / 2;
    return item;
  };
  const pipe = (points: number[][], radius: number, mat: THREE.Material, parent: THREE.Object3D) => {
    const path = new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(...p as [number, number, number])));
    return mesh(new THREE.TubeGeometry(path, 40, radius, 10, false), mat, parent);
  };
  const bolt = (parent: THREE.Object3D, x: number, y: number, z: number, axis: 'x' | 'y' | 'z' = 'y') => {
    const head = mesh(new THREE.CylinderGeometry(.065, .065, .055, 6), chrome, parent, x, y, z);
    if (axis === 'z') head.rotation.x = Math.PI / 2;
    if (axis === 'x') head.rotation.z = Math.PI / 2;
    return head;
  };

  const factory = new THREE.Group(); scene.add(factory);
  const floor = mesh(new THREE.PlaneGeometry(160, 160), material({color: '#14232c', metalness: .5, roughness: .26}), factory, 0, -.045, 0);
  floor.rotation.x = -Math.PI / 2; floor.castShadow = false;
  // Quiet architectural depth behind the machine leaves the left foreground available for copy.
  box(45, 9, .25, material({color: '#102431', roughness: .84}), factory, 0, 4.4, -8.5);
  for (let x = -14; x <= 16; x += 5) {
    box(.18, 8.8, .4, steel, factory, x, 4.35, -8.1);
    box(4.5, .10, .07, pale, factory, x + 2.5, 6.25, -8.05);
    box(3.9, .035, .08, material({color: '#cce9f2', emissive: '#82bace', emissiveIntensity: .5}), factory, x + 2.5, 6.21, -7.98);
  }
  for (const x of [-4, 0, 4, 8, 12]) box(.012, .006, 25, black, factory, x, -.035, 0, .002);

  const machine = new THREE.Group(); machine.position.x = 1.25; scene.add(machine);
  box(4.15, .48, 3.6, blue, machine, 0, .55, 0, .09);
  box(4.02, .12, 3.5, steel, machine, 0, .85, 0);
  box(2.36, .29, .028, black, machine, 0, .55, 1.81, .012);
  for (let i = 0; i < 17; i++) box(.035, .17, .018, steel, machine, -.99 + i * .123, .55, 1.83, .004);
  for (const x of [-1.65, -1.35, 1.35, 1.65]) bolt(machine, x, .56, 1.82, 'z');
  box(.027, .29, 1.1, black, machine, -2.079, .55, .35, .008);
  for (const z of [-.10, .79]) bolt(machine, -2.101, .55, z, 'x');
  for (const x of [-1.67, 1.67]) for (const z of [-1.38, 1.38]) {
    cylinder(.18, .23, rubber, machine, x, .13, z);
    cylinder(.10, .35, chrome, machine, x, .31, z);
    box(.4, .38, .40, blue, machine, x, 1.05, z);
    cylinder(.075, 4.4, chrome, machine, x, 3.05, z);
    cylinder(.14, .3, steel, machine, x, 1.36, z);
    bolt(machine, x, 5.3, z);
  }
  box(4.0, .28, 3.5, blue, machine, 0, 5.13, 0, .06);
  box(.52, .8, .62, steel, machine, 0, 5.57, 0);
  for (let i = 0; i < 7; i++) box(.59, .035, .68, black, machine, 0, 5.32 + i * .078, 0, .007);
  const pressRam = cylinder(.16, 1, chrome, machine, 0, 3.95, 0);
  box(3.85, .28, 3.2, pale, machine, 0, 1.22, 0);
  for (const x of [-1.78, 1.78]) for (const z of [-1.48, 1.48]) bolt(machine, x, 1.38, z);

  // The lower female tool has an actual cavity. The top core occupies the tray's empty interior.
  box(3.6, .18, 2.75, aluminum, machine, 0, 1.49, 0);
  for (const x of [-1.635, 1.635]) box(.31, .7, 2.75, lowerMaterial, machine, x, 1.93, 0, .018);
  for (const z of [-1.215, 1.215]) box(2.98, .7, .32, lowerMaterial, machine, 0, 1.93, z, .018);
  const upper = new THREE.Group(); machine.add(upper);
  box(3.6, .3, 2.75, upperMaterial, upper, 0, 2.43, 0);
  box(2.42, .55, 1.57, coreMaterial, upper, 0, 2.015, 0, .11);
  box(3.95, .18, 3.2, upperMaterial, upper, 0, 2.67, 0);
  for (const x of [-1.67, 1.67]) for (const z of [-1.38, 1.38]) {
    cylinder(.145, .46, upperMaterial, upper, x, 2.66, z);
    bolt(upper, x, 2.94, z);
  }
  for (const z of [-1.38, 1.38]) for (const x of [-1.3, -.86, -.43, 0, .43, .86, 1.3]) {
    cylinder(.031, .023, black, machine, x, 1.95, z, 'z');
    bolt(machine, x, 1.51, z, 'z');
  }
  // Steam and cooling manifolds stay attached to the fixed lower tool.
  for (const x of [-1.95, 1.95]) {
    cylinder(.09, 2.1, steel, machine, x, 1.7, 0, 'z');
    for (const z of [-.8, -.27, .27, .8]) {
      cylinder(.065, .24, gold, machine, x, 1.87, z);
      pipe([[x, 1.99, z], [x * .96, 2.08, z], [x * .84, 2.04, z]], .025, black, machine);
    }
  }
  pipe([[-2, 1.75, -.8], [-2.2, 1.2, -1.05], [-2.1, .7, -1.7], [-1.2, .4, -1.75]], .07, rubber, machine);
  const coolingPipe = pipe([[1.92, 1.7, .75], [2.16, 1.4, .8], [2.12, .9, .3], [1.78, .66, -.6]], .045, coolantMaterial, machine);
  coolingPipe.castShadow = false;
  box(.52, 1.4, .65, pale, machine, -2.05, 1.85, -.95);
  box(.025, .47, .41, black, machine, -2.325, 2.05, -.9);
  cylinder(.06, .026, statusMaterial, machine, -2.34, 1.67, -.85, 'x');
  cylinder(.065, .04, material({color: '#cf493f', roughness: .5}), machine, -2.34, 1.44, -.85, 'x');

  // A supply hopper with a sight section and a pressure-fill hose into the CLOSED tool.
  const hopper = new THREE.Group(); hopper.position.set(2.65, 3.93, -3.35); machine.add(hopper);
  mesh(new THREE.CylinderGeometry(.59, .59, .65, 40, 1, true), steel, hopper, 0, .6, 0);
  mesh(new THREE.CylinderGeometry(.59, .17, .64, 40, 1, true), aluminum, hopper, 0, -.045, 0);
  const hopperRim = mesh(new THREE.TorusGeometry(.59, .027, 10, 48), chrome, hopper, 0, .94, 0);
  hopperRim.rotation.x = Math.PI / 2;
  cylinder(.19, .34, steel, hopper, 0, -.53, 0);
  box(.12, 3.75, .12, steel, machine, 2.95, 1.90, -3.75);
  box(.64, .08, .65, steel, machine, 2.75, 3.74, -3.51);
  box(.58, .13, .65, black, machine, 2.91, .11, -3.73);
  const fillCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(2.65, 3.53, -3.35), new THREE.Vector3(2.67, 2.65, -2.65),
    new THREE.Vector3(2.32, 2.0, -.35), new THREE.Vector3(1.85, 1.95, -.1),
    new THREE.Vector3(1.25, 1.94, -.1),
  ]);
  mesh(new THREE.TubeGeometry(fillCurve, 48, .12, 16, false), glass, machine).castShadow = false;
  cylinder(.16, .26, steel, machine, 1.9, 1.95, -.1, 'x');
  cylinder(.105, .4, gold, machine, 1.64, 1.95, -.1, 'x');
  for (const z of [-.75, .75]) box(.72, .065, .12, steel, machine, 2.32, 2.22, z - .8);

  let seed = 82491;
  const random = () => {seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296;};
  const beadGeometry = new THREE.IcosahedronGeometry(1, 1);
  const dummy = new THREE.Object3D();
  const cavityBeads: {x: number; y: number; z: number; s: number; angle: number}[] = [];
  // Hex-packed particles are restricted to the real floor and walls, outside the core.
  for (let layer = 0; layer < 7; layer++) for (let row = 0; row < 24; row++) for (let col = 0; col < 34; col++) {
    const x = -1.405 + col * .083 + (row % 2) * .034;
    const z = -.974 + row * .083;
    const y = .049 + layer * .087;
    if (Math.abs(x) > 1.407 || Math.abs(z) > .979) continue;
    if (Math.hypot(Math.max(0, Math.abs(x) - 1.295), Math.max(0, Math.abs(z) - .87)) > .1) continue;
    if (y > .16 && Math.abs(x) < 1.265 && Math.abs(z) < .83) continue;
    // Sample the dense physical lattice so instancing stays light, with no random frame state.
    if (random() > .65) continue;
    cavityBeads.push({x: x + (random() - .5) * .009, y, z: z + (random() - .5) * .009, s: .044 + random() * .009, angle: random() * 6.28});
  }
  cavityBeads.sort((a, b) => a.y - b.y || b.x - a.x);
  const particles = new THREE.InstancedMesh(beadGeometry, beadMaterial, cavityBeads.length);
  particles.position.y = 1.58; particles.castShadow = true; particles.receiveShadow = true;
  machine.add(particles);
  cavityBeads.forEach((p, i) => {
    dummy.position.set(p.x, p.y, p.z); dummy.rotation.set(p.angle, p.angle * .7, 0); dummy.scale.set(p.s, p.s * .88, p.s * .94); dummy.updateMatrix();
    particles.setMatrixAt(i, dummy.matrix);
  });
  particles.instanceMatrix.needsUpdate = true;
  const hopperBeads = new THREE.InstancedMesh(beadGeometry, beadMaterial, 190); hopper.add(hopperBeads);
  for (let i = 0; i < 190; i++) {
    const angle = random() * Math.PI * 2, radius = Math.sqrt(random()) * .54;
    dummy.position.set(Math.cos(angle) * radius, .91 + random() * .065, Math.sin(angle) * radius);
    dummy.rotation.set(random(), random(), random()); dummy.scale.setScalar(.052); dummy.updateMatrix(); hopperBeads.setMatrixAt(i, dummy.matrix);
  }
  hopperBeads.instanceMatrix.needsUpdate = true;
  const movingBeads = new THREE.InstancedMesh(beadGeometry, beadMaterial, 46); movingBeads.castShadow = true; machine.add(movingBeads);

  // One continuous finished EPP tray: the tool core accounts for the open interior.
  const product = new THREE.Group(); machine.add(product);
  box(2.89, .17, 2.04, foamMaterial, product, 0, .085, 0, .105);
  const trayOutline = outline(2.89, 2.04, .15); trayOutline.holes.push(outline(2.43, 1.58, .12));
  const wall = mesh(new THREE.ExtrudeGeometry(trayOutline, {depth: .49, steps: 1, bevelEnabled: true, bevelSize: .024, bevelThickness: .024, bevelSegments: 2, curveSegments: 7}), foamMaterial, product, 0, .145, 0);
  wall.rotation.x = -Math.PI / 2;
  // Map texture at a consistent physical scale across faces and sides.
  product.traverse(object => {
    if (!(object instanceof THREE.Mesh)) return;
    const g = object.geometry, p = g.getAttribute('position'), n = g.getAttribute('normal'), uv = new Float32Array(p.count * 2);
    for (let i = 0; i < p.count; i++) {
      const nx = Math.abs(n.getX(i)), ny = Math.abs(n.getY(i)), nz = Math.abs(n.getZ(i));
      uv[i * 2] = (nx > ny && nx > nz ? p.getZ(i) : p.getX(i)) * .8;
      uv[i * 2 + 1] = (ny > nx && ny > nz ? p.getZ(i) : p.getY(i)) * .8;
    }
    g.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  });
  const ejectors = new THREE.Group(); machine.add(ejectors);
  for (const x of [-.96, .96]) for (const z of [-.63, .63]) {
    cylinder(.045, 1.1, chrome, ejectors, x, 1.02, z);
    cylinder(.085, .025, steel, ejectors, x, 1.58, z);
  }
  const vapor = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 10, 8), steamMaterial, 14);
  vapor.castShadow = false; machine.add(vapor);

  // Outfeed rollers and a mechanically supported X/Z pick-and-place gantry.
  const conveyor = new THREE.Group(); conveyor.position.set(5.55, 0, 0); scene.add(conveyor);
  for (const z of [-1.17, 1.17]) {
    box(3.9, .18, .12, blue, conveyor, 0, 1.53, z);
    for (const x of [-1.57, 1.57]) {
      box(.11, 1.35, .11, steel, conveyor, x, .74, z);
      cylinder(.11, .075, rubber, conveyor, x, .04, z);
      bolt(conveyor, x, 1.57, z, 'z');
    }
  }
  for (let i = 0; i < 18; i++) cylinder(.095, 2.22, aluminum, conveyor, -1.73 + i * .203, 1.55, 0, 'z');
  box(3.2, .10, .13, steel, conveyor, 0, .43, -1.17);
  for (const x of [1.25, 6.85]) {
    box(.16, 4.2, .18, pale, scene, x, 2.12, -2.35);
    box(.48, .1, .54, steel, scene, x, .05, -2.35);
  }
  box(6.2, .26, .24, blue, scene, 4.05, 4.22, -2.35);
  cylinder(.055, 5.9, chrome, scene, 4.05, 4.38, -2.19, 'x');
  const gripper = new THREE.Group(); scene.add(gripper);
  box(.57, .44, .43, aluminum, gripper, 0, 4.2, -2.35);
  const gripperHead = new THREE.Group(); gripper.add(gripperHead);
  box(.16, .2, 2.3, steel, gripperHead, 0, 0, -1.18);
  box(3.35, .16, .21, pale, gripperHead, 0, -.06, -.17);
  const leftJaw = new THREE.Group(), rightJaw = new THREE.Group(); gripperHead.add(leftJaw, rightJaw);
  for (const jaw of [leftJaw, rightJaw]) {
    box(.12, .65, .6, chrome, jaw, 0, -.36, -.13);
    box(.15, .32, .52, rubber, jaw, 0, -.53, -.13, .02);
  }
  const carriageRod = cylinder(.055, 1, chrome, gripper, 0, 3.75, -2.35);
  pipe([[0, 4.25, -2.53], [.2, 4.08, -2.64], [.28, 3.68, -2.55]], .025, rubber, gripper);

  scene.add(new THREE.HemisphereLight('#bed5e7', '#101920', .28));
  const key = new THREE.DirectionalLight('#fff0dc', 2.8); key.position.set(-3, 10, 8);
  key.castShadow = true; key.shadow.mapSize.set(2048, 2048);
  Object.assign(key.shadow.camera, {left: -10, right: 10, top: 9, bottom: -7, near: .1, far: 35});
  key.shadow.bias = -.0002; key.shadow.normalBias = .027; key.shadow.radius = 3;
  key.target.position.set(2, 1.4, 0); scene.add(key, key.target);
  const rim = new THREE.DirectionalLight('#9dd4ff', 1.9); rim.position.set(4, 8, -6); scene.add(rim);
  const fill = new THREE.DirectionalLight('#d9e8f5', .38); fill.position.set(7, 5, 9); scene.add(fill);
  const topLight = new THREE.PointLight('#e7f6ff', 14, 11, 2); topLight.position.set(2, 5.8, 2); scene.add(topLight);

  const update = (frame: number) => {
    const t = clamp(frame / 719) * (719 / 30);
    const filling = phase(t, 2, 7), opening = phase(t, 15.5, 18.6);
    const ghost = phase(t, 1.65, 2.15) * (1 - phase(t, 6.85, 7.35));
    upperMaterial.opacity = 1 - ghost * .94; upperMaterial.depthWrite = ghost < .5;
    coreMaterial.opacity = 1 - ghost * .975; coreMaterial.depthWrite = ghost < .5;
    lowerMaterial.opacity = 1 - ghost * .9; lowerMaterial.depthWrite = ghost < .5;
    // The ghosted mould is an explanatory cutaway; all geometry stays in its closed position.
    upper.position.y = opening * 2.03;
    const ramBottom = 2.81 + upper.position.y;
    pressRam.position.y = (5.12 + ramBottom) / 2;
    pressRam.scale.y = 5.12 - ramBottom;
    particles.count = Math.floor(cavityBeads.length * filling);
    particles.visible = t >= 2 && t < 7.28;
    product.visible = t >= 7.25;
    movingBeads.visible = t >= 2 && t < 7;
    for (let i = 0; i < 46; i++) {
      const u = ((t - 2) * .8 + i / 46) % 1;
      const p = fillCurve.getPointAt((u + 1) % 1);
      dummy.position.copy(p); dummy.position.y += Math.sin(i * 7.3) * .045;
      dummy.position.z += Math.cos(i * 2.1) * .045;
      dummy.rotation.set(i, t + i, i * .3); dummy.scale.setScalar(.048); dummy.updateMatrix();
      movingBeads.setMatrixAt(i, dummy.matrix);
    }
    movingBeads.instanceMatrix.needsUpdate = true;
    const steam = phase(t, 7.4, 8.3) * (1 - phase(t, 11.45, 12.3));
    steamMaterial.opacity = steam * .055;
    for (let i = 0; i < 14; i++) {
      const travel = (t * .33 + i * .117) % 1;
      dummy.position.set(-2.0 + Math.sin(i * 4.7) * .12, 1.8 + travel * .65, -.5 + Math.cos(i * 1.9) * .3);
      dummy.scale.set(.10 + travel * .2, .18 + travel * .22, .1 + travel * .18); dummy.rotation.set(0, i, 0); dummy.updateMatrix();
      vapor.setMatrixAt(i, dummy.matrix);
    }
    vapor.instanceMatrix.needsUpdate = true; vapor.visible = steam > .001;
    const cooling = phase(t, 11.5, 12) * (1 - phase(t, 15.3, 15.8));
    coolantMaterial.emissiveIntensity = .18 + cooling * 1.6;
    statusMaterial.emissiveIntensity = .7 + cooling * .6;
    const eject = phase(t, 19, 19.65);
    const transfer = phase(t, 19.9, 21.25);
    const descend = phase(t, 21.25, 21.75);
    const retract = phase(t, 21.9, 22.55);
    const grab = phase(t, 19.65, 19.9) * (1 - phase(t, 21.8, 22));
    const partX = transfer * (5.55 - machine.position.x);
    const partY = 1.58 + eject * 1.0 - descend * .935;
    product.position.set(partX, partY, 0);
    ejectors.position.y = eject * (1 - phase(t, 19.9, 20.3));
    gripper.position.x = 5.55 - phase(t, 18.65, 19.55) * 4.3 + transfer * 4.3;
    gripperHead.position.y = 3.62 - descend * .935 + retract * .78;
    leftJaw.position.x = -1.65 + grab * .135;
    rightJaw.position.x = 1.65 - grab * .135;
    carriageRod.position.y = (4.12 + gripperHead.position.y) / 2;
    carriageRod.scale.y = Math.max(.12, 4.12 - gripperHead.position.y);
    // Close on the bead cavity, then widen before opening to include the complete transfer.
    const close = phase(t, .4, 2.7) * (1 - phase(t, 12.4, 16.2));
    camera.position.set(8.05 - close * 2.8, 7.05 - close * 1.58, 17.4 - close * 4.35);
    camera.lookAt(.10 - close * .82, 2.2 - close * .16, -.15);
    camera.updateProjectionMatrix();
  };
  update(0);
  return {scene, camera, update, dispose: () => {
    const geometries = new Set<THREE.BufferGeometry>();
    scene.traverse(object => {
      if (object instanceof THREE.Mesh) geometries.add(object.geometry);
      if (object instanceof THREE.InstancedMesh) object.dispose();
    });
    geometries.forEach(geometry => geometry.dispose()); materials.forEach(mat => mat.dispose());
    brushed.dispose(); foamMap.dispose(); foam.dispose(); environment.dispose(); key.shadow.dispose(); scene.clear();
  }};
}
