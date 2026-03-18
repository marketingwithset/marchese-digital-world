import * as THREE from 'three';
import { COLORS, MAIN_HALL_DIMS } from '../utils/constants.js';

export function createMainHall(scene) {
  const { WIDTH, DEPTH, HEIGHT } = MAIN_HALL_DIMS;
  const interactables = [];

  const floor = new THREE.Mesh(new THREE.PlaneGeometry(WIDTH, DEPTH), new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.15, metalness: 0.1, envMapIntensity: 1.5 }));
  floor.rotation.x = -Math.PI/2; floor.receiveShadow = true; scene.add(floor);

  const reflFloor = new THREE.Mesh(new THREE.PlaneGeometry(WIDTH, DEPTH), new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.05, metalness: 0.3, transparent: true, opacity: 0.15 }));
  reflFloor.rotation.x = -Math.PI/2; reflFloor.position.y = 0.001; scene.add(reflFloor);

  const grid = new THREE.GridHelper(WIDTH, 30, 0x1a1a22, 0x111116);
  grid.position.y = 0.005; grid.material.opacity = 0.12; grid.material.transparent = true; scene.add(grid);

  const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(WIDTH, DEPTH), new THREE.MeshStandardMaterial({ color: 0x0d0d0d, roughness: 0.8 }));
  ceiling.rotation.x = Math.PI/2; ceiling.position.y = HEIGHT; scene.add(ceiling);

  const wallMat = new THREE.MeshStandardMaterial({ color: 0x121218, roughness: 0.6, metalness: 0.05 });
  const artWallMat = new THREE.MeshStandardMaterial({ color: 0x0f0f14, roughness: 0.5, metalness: 0.02 });

  const backWall = new THREE.Mesh(new THREE.BoxGeometry(WIDTH, HEIGHT, 0.3), artWallMat);
  backWall.position.set(0, HEIGHT/2, -DEPTH/2); backWall.receiveShadow = true; scene.add(backWall);
  const frontWall = new THREE.Mesh(new THREE.BoxGeometry(WIDTH, HEIGHT, 0.3), wallMat);
  frontWall.position.set(0, HEIGHT/2, DEPTH/2); scene.add(frontWall);
  const sideGeo = new THREE.BoxGeometry(0.3, HEIGHT, DEPTH);
  [-WIDTH/2, WIDTH/2].forEach(x => { const w = new THREE.Mesh(sideGeo, wallMat); w.position.set(x, HEIGHT/2, 0); w.receiveShadow = true; scene.add(w); });

  const colGeo = new THREE.CylinderGeometry(0.3, 0.35, HEIGHT, 16);
  const colMat = new THREE.MeshStandardMaterial({ color: 0x1a1a20, roughness: 0.3, metalness: 0.15 });
  const rGeo = new THREE.TorusGeometry(0.38, 0.03, 8, 24);
  const rMat = new THREE.MeshStandardMaterial({ color: COLORS.SET_GOLD, roughness: 0.2, metalness: 0.9 });
  [[-10,-6],[-10,6],[10,-6],[10,6],[-5,-6],[-5,6],[5,-6],[5,6]].forEach(([x,z]) => {
    const c = new THREE.Mesh(colGeo, colMat); c.position.set(x, HEIGHT/2, z); c.castShadow = true; scene.add(c);
    const r = new THREE.Mesh(rGeo, rMat); r.rotation.x = Math.PI/2; r.position.set(x, 0.1, z); scene.add(r);
    const tr = r.clone(); tr.position.set(x, HEIGHT-0.1, z); scene.add(tr);
  });

  const fMat = new THREE.MeshStandardMaterial({ color: COLORS.SET_GOLD, roughness: 0.3, metalness: 0.85 });
  [-9,-3,3,9].forEach((x,i) => {
    const fr = new THREE.Mesh(new THREE.BoxGeometry(3.5, 2.5, 0.15), fMat);
    fr.position.set(x, 3.5, -DEPTH/2+0.25); fr.castShadow = true; scene.add(fr);
    const cv = new THREE.Mesh(new THREE.PlaneGeometry(3.0, 2.0), new THREE.MeshStandardMaterial({ color: new THREE.Color().setHSL(i*0.2+0.05, 0.4, 0.25), roughness: 0.7 }));
    cv.position.set(x, 3.5, -DEPTH/2+0.35);
    cv.userData = { type: 'painting', name: 'Painting '+(i+1), description: 'Original artwork by Chris Marchese. Click to inspect.', interactive: true };
    scene.add(cv); interactables.push(cv);
  });

  const cMat = new THREE.MeshStandardMaterial({ color: 0x0a0a0a, roughness: 0.85, metalness: 0.02 });
  const cs = new THREE.Mesh(new THREE.BoxGeometry(4, 0.5, 1.5), cMat); cs.position.set(8, 0.4, 4); cs.castShadow = true; scene.add(cs);
  const cb = new THREE.Mesh(new THREE.BoxGeometry(4, 0.8, 0.3), cMat); cb.position.set(8, 0.9, 4.75); scene.add(cb);
  const c2 = new THREE.Mesh(new THREE.BoxGeometry(3, 0.5, 1.5), cMat); c2.position.set(10.5, 0.4, 1.5); c2.rotation.y = -Math.PI/2; scene.add(c2);

  const tt = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.05, 1), new THREE.MeshStandardMaterial({ color: COLORS.SET_GOLD, roughness: 0.25, metalness: 0.8 }));
  tt.position.set(8, 0.55, 2.5); scene.add(tt);
  const lG = new THREE.CylinderGeometry(0.03, 0.03, 0.5);
  const lM = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.8, roughness: 0.3 });
  [[-0.7,-0.35],[0.7,-0.35],[-0.7,0.35],[0.7,0.35]].forEach(([lx,lz]) => { const l = new THREE.Mesh(lG, lM); l.position.set(8+lx, 0.27, 2.5+lz); scene.add(l); });

  const bGrp = new THREE.Group(); bGrp.position.set(-12, 0, 7);
  const bMat = new THREE.MeshStandardMaterial({ color: COLORS.PHONE_RED, roughness: 0.5, metalness: 0.1 });
  const bBody = new THREE.Mesh(new THREE.BoxGeometry(1.2, 2.8, 1.2), bMat); bBody.position.y = 1.4; bBody.castShadow = true; bGrp.add(bBody);
  const roof = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.15, 1.4), bMat); roof.position.y = 2.85; bGrp.add(roof);
  const crn = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.3, 0.6), bMat); crn.position.y = 3.1; bGrp.add(crn);
  const bL = new THREE.PointLight(0xFFAA44, 1.5, 5); bL.position.y = 2.2; bGrp.add(bL);
  const gl = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 1.8), new THREE.MeshStandardMaterial({ color: 0xFFEECC, transparent: true, opacity: 0.15, roughness: 0.05 }));
  gl.position.set(0, 1.6, 0.61); bGrp.add(gl);
  bBody.userData = { type: 'phonebooth', name: 'Contact Chris', description: 'Pick up the phone to reach Chris Marchese and the SET team.', interactive: true };
  scene.add(bGrp); interactables.push(bBody);

  const sMat = new THREE.MeshStandardMaterial({ color: COLORS.CHROME_SILVER, roughness: 0.2, metalness: 0.7 });
  const pG = new THREE.CylinderGeometry(0.5, 0.55, 1.2, 16);
  const pM = new THREE.MeshStandardMaterial({ color: 0x1a1a20, roughness: 0.4, metalness: 0.1 });

  const s1 = new THREE.Mesh(new THREE.TorusKnotGeometry(0.6, 0.15, 100, 16, 2, 3), sMat);
  s1.position.set(-3, 1.8, 3); s1.castShadow = true; scene.add(s1);
  scene.add(new THREE.Mesh(pG, pM).translateX(-3).translateY(0.6).translateZ(3));

  const s2 = new THREE.Mesh(new THREE.IcosahedronGeometry(0.7, 0), new THREE.MeshStandardMaterial({ color: COLORS.SET_GOLD, roughness: 0.25, metalness: 0.9 }));
  s2.position.set(3, 1.8, 5); s2.castShadow = true;
  s2.userData.animate = (t) => { s2.rotation.y = t*0.3; s2.rotation.x = Math.sin(t*0.5)*0.1; };
  scene.add(s2);
  const p2 = new THREE.Mesh(pG, pM); p2.position.set(3, 0.6, 5); scene.add(p2);

  const s3 = new THREE.Mesh(new THREE.DodecahedronGeometry(0.5, 0), sMat);
  s3.position.set(-7, 1.6, -2); s3.castShadow = true;
  s3.userData.animate = (t) => { s3.rotation.y = -t*0.2; };
  scene.add(s3);
  const p3 = new THREE.Mesh(pG, pM); p3.position.set(-7, 0.5, -2); scene.add(p3);

  const emb = new THREE.Mesh(new THREE.RingGeometry(2, 2.2, 48), new THREE.MeshStandardMaterial({ color: COLORS.SET_GOLD, roughness: 0.3, metalness: 0.8, transparent: true, opacity: 0.15 }));
  emb.rotation.x = -Math.PI/2; emb.position.y = 0.01; scene.add(emb);

  return { interactables };
}