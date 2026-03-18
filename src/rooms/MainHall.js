import * as THREE from 'three';
import { COLORS, MAIN_HALL_DIMS } from '../utils/constants.js';

export function createMainHall(scene) {
  const { WIDTH, DEPTH, HEIGHT } = MAIN_HALL_DIMS;
  const interactables = [];

  // Floor
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(WIDTH, DEPTH),
    new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.15, metalness: 0.1, envMapIntensity: 1.5 })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);

  const reflFloor = new THREE.Mesh(
    new THREE.PlaneGeometry(WIDTH, DEPTH),
    new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.05, metalness: 0.3, transparent: true, opacity: 0.15 })
  );
  reflFloor.rotation.x = -Math.PI / 2;
  reflFloor.position.y = 0.001;
  scene.add(reflFloor);

  const grid = new THREE.GridHelper(WIDTH, 30, 0x1a1a22, 0x111116);
  grid.position.y = 0.005;
  grid.material.opacity = 0.12;
  grid.material.transparent = true;
  scene.add(grid);

  // Ceiling
  const ceiling = new THREE.Mesh(
    new THREE.PlaneGeometry(WIDTH, DEPTH),
    new THREE.MeshStandardMaterial({ color: 0x0d0d0d, roughness: 0.8 })
  );
  ceiling.rotation.x = Math.PI / 2;
  ceiling.position.y = HEIGHT;
  scene.add(ceiling);

  // Walls
  const wallMat = new THREE.MeshStandardMaterial({ color: 0x121218, roughness: 0.6, metalness: 0.05 });
  const artWallMat = new THREE.MeshStandardMaterial({ color: 0x0f0f14, roughness: 0.5, metalness: 0.02 });

  const backWall = new THREE.Mesh(new THREE.BoxGeometry(WIDTH, HEIGHT, 0.3), artWallMat);
  backWall.position.set(0, HEIGHT / 2, -DEPTH / 2);
  backWall.receiveShadow = true;
  scene.add(backWall);

  const frontWall = new THREE.Mesh(new THREE.BoxGeometry(WIDTH, HEIGHT, 0.3), wallMat);
  frontWall.position.set(0, HEIGHT / 2, DEPTH / 2);
  scene.add(frontWall);

  const sideGeo = new THREE.BoxGeometry(0.3, HEIGHT, DEPTH);
  [-WIDTH / 2, WIDTH / 2].forEach(x => {
    const wall = new THREE.Mesh(sideGeo, wallMat);
    wall.position.set(x, HEIGHT / 2, 0);
    wall.receiveShadow = true;
    scene.add(wall);
  });

  // Columns
  const colGeo = new THREE.CylinderGeometry(0.3, 0.35, HEIGHT, 16);
  const colMat = new THREE.MeshStandardMaterial({ color: 0x1a1a20, roughness: 0.3, metalness: 0.15 });
  const ringGeo = new THREE.TorusGeometry(0.38, 0.03, 8, 24);
  const ringMat = new THREE.MeshStandardMaterial({ color: COLORS.SET_GOLD, roughness: 0.2, metalness: 0.9 });

  [[-10, -6], [-10, 6], [10, -6], [10, 6], [-5, -6], [-5, 6], [5, -6], [5, 6]].forEach(([x, z]) => {
    const col = new THREE.Mesh(colGeo, colMat);
    col.position.set(x, HEIGHT / 2, z);
    col.castShadow = true;
    scene.add(col);

    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.set(x, 0.1, z);
    scene.add(ring);

    const topRing = ring.clone();
    topRing.position.set(x, HEIGHT - 0.1, z);
    scene.add(topRing);
  });

  // Paintings
  const frameMat = new THREE.MeshStandardMaterial({ color: COLORS.SET_GOLD, roughness: 0.3, metalness: 0.85 });
  [-9, -3, 3, 9].forEach((x, i) => {
    const frame = new THREE.Mesh(new THREE.BoxGeometry(3.5, 2.5, 0.15), frameMat);
    frame.position.set(x, 3.5, -DEPTH / 2 + 0.25);
    frame.castShadow = true;
    scene.add(frame);

    const canvas = new THREE.Mesh(
      new THREE.PlaneGeometry(3.0, 2.0),
      new THREE.MeshStandardMaterial({ color: new THREE.Color().setHSL(i * 0.2 + 0.05, 0.4, 0.25), roughness: 0.7 })
    );
    canvas.position.set(x, 3.5, -DEPTH / 2 + 0.35);
    canvas.userData = { type: 'painting', name: `Painting ${i + 1}`, description: 'Original artwork by Chris Marchese. Click to inspect.', interactive: true };
    scene.add(canvas);
    interactables.push(canvas);
  });

  // Lounge
  const couchMat = new THREE.MeshStandardMaterial({ color: 0x0a0a0a, roughness: 0.85, metalness: 0.02 });

  const couchSeat = new THREE.Mesh(new THREE.BoxGeometry(4, 0.5, 1.5), couchMat);
  couchSeat.position.set(8, 0.4, 4);
  couchSeat.castShadow = true;
  scene.add(couchSeat);

  const couchBack = new THREE.Mesh(new THREE.BoxGeometry(4, 0.8, 0.3), couchMat);
  couchBack.position.set(8, 0.9, 4.75);
  scene.add(couchBack);

  const couch2 = new THREE.Mesh(new THREE.BoxGeometry(3, 0.5, 1.5), couchMat);
  couch2.position.set(10.5, 0.4, 1.5);
  couch2.rotation.y = -Math.PI / 2;
  scene.add(couch2);

  const tableTop = new THREE.Mesh(
    new THREE.BoxGeometry(1.8, 0.05, 1),
    new THREE.MeshStandardMaterial({ color: COLORS.SET_GOLD, roughness: 0.25, metalness: 0.8 })
  );
  tableTop.position.set(8, 0.55, 2.5);
  scene.add(tableTop);

  const legGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.5);
  const legMat = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.8, roughness: 0.3 });
  [[-0.7, -0.35], [0.7, -0.35], [-0.7, 0.35], [0.7, 0.35]].forEach(([lx, lz]) => {
    const leg = new THREE.Mesh(legGeo, legMat);
    leg.position.set(8 + lx, 0.27, 2.5 + lz);
    scene.add(leg);
  });

  // Red Telephone Booth
  const boothGroup = new THREE.Group();
  boothGroup.position.set(-12, 0, 7);

  const boothMat = new THREE.MeshStandardMaterial({ color: COLORS.PHONE_RED, roughness: 0.5, metalness: 0.1 });

  const boothBody = new THREE.Mesh(new THREE.BoxGeometry(1.2, 2.8, 1.2), boothMat);
  boothBody.position.y = 1.4;
  boothBody.castShadow = true;
  boothGroup.add(boothBody);

  const roof = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.15, 1.4), boothMat);
  roof.position.y = 2.85;
  boothGroup.add(roof);

  const crown = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.3, 0.6), boothMat);
  crown.position.y = 3.1;
  boothGroup.add(crown);

  const boothLight = new THREE.PointLight(0xFFAA44, 1.5, 5);
  boothLight.position.y = 2.2;
  boothGroup.add(boothLight);

  const glass = new THREE.Mesh(
    new THREE.PlaneGeometry(0.9, 1.8),
    new THREE.MeshStandardMaterial({ color: 0xFFEECC, transparent: true, opacity: 0.15, roughness: 0.05 })
  );
  glass.position.set(0, 1.6, 0.61);
  boothGroup.add(glass);

  boothBody.userData = { type: 'phonebooth', name: 'Contact Chris', description: 'Pick up the phone to reach Chris Marchese and the SET team.', interactive: true };
  scene.add(boothGroup);
  interactables.push(boothBody);

  // Sculptures
  const sculptureMat = new THREE.MeshStandardMaterial({ color: COLORS.CHROME_SILVER, roughness: 0.2, metalness: 0.7 });
  const pedGeo = new THREE.CylinderGeometry(0.5, 0.55, 1.2, 16);
  const pedMat = new THREE.MeshStandardMaterial({ color: 0x1a1a20, roughness: 0.4, metalness: 0.1 });

  const sculpt1 = new THREE.Mesh(new THREE.TorusKnotGeometry(0.6, 0.15, 100, 16, 2, 3), sculptureMat);
  sculpt1.position.set(-3, 1.8, 3);
  sculpt1.castShadow = true;
  scene.add(sculpt1);
  const ped1 = new THREE.Mesh(pedGeo, pedMat);
  ped1.position.set(-3, 0.6, 3);
  scene.add(ped1);

  const sculpt2 = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.7, 0),
    new THREE.MeshStandardMaterial({ color: COLORS.SET_GOLD, roughness: 0.25, metalness: 0.9 })
  );
  sculpt2.position.set(3, 1.8, 5);
  sculpt2.castShadow = true;
  sculpt2.userData.animate = (t) => { sculpt2.rotation.y = t * 0.3; sculpt2.rotation.x = Math.sin(t * 0.5) * 0.1; };
  scene.add(sculpt2);
  const ped2 = new THREE.Mesh(pedGeo, pedMat);
  ped2.position.set(3, 0.6, 5);
  scene.add(ped2);

  const sculpt3 = new THREE.Mesh(new THREE.DodecahedronGeometry(0.5, 0), sculptureMat);
  sculpt3.position.set(-7, 1.6, -2);
  sculpt3.castShadow = true;
  sculpt3.userData.animate = (t) => { sculpt3.rotation.y = -t * 0.2; };
  scene.add(sculpt3);
  const ped3 = new THREE.Mesh(pedGeo, pedMat);
  ped3.position.set(-7, 0.5, -2);
  scene.add(ped3);

  // Floor emblem
  const emblem = new THREE.Mesh(
    new THREE.RingGeometry(2, 2.2, 48),
    new THREE.MeshStandardMaterial({ color: COLORS.SET_GOLD, roughness: 0.3, metalness: 0.8, transparent: true, opacity: 0.15 })
  );
  emblem.rotation.x = -Math.PI / 2;
  emblem.position.y = 0.01;
  scene.add(emblem);

  return { interactables };
}
