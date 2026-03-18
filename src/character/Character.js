import * as THREE from 'three';
import { COLORS } from '../utils/constants.js';

export function createCharacter(scene) {
  const group = new THREE.Group();
  group.position.set(0, 0, 6);

  // ── Chris Marchese — Navy Suit, White Turtleneck, Gold Chain, Aviators ──
  const navySuitMat = new THREE.MeshStandardMaterial({ color: 0x1a2744, roughness: 0.65, metalness: 0.05 });
  const whiteTurtleneckMat = new THREE.MeshStandardMaterial({ color: 0xF0EDE8, roughness: 0.8, metalness: 0.0 });
  const skinMat = new THREE.MeshStandardMaterial({ color: 0xC8A882, roughness: 0.55, metalness: 0.0 });
  const navyPantsMat = new THREE.MeshStandardMaterial({ color: 0x151F33, roughness: 0.7, metalness: 0.03 });
  const shoeMat = new THREE.MeshStandardMaterial({ color: 0x0a0a0a, roughness: 0.35, metalness: 0.25 });
  const goldMat = new THREE.MeshStandardMaterial({ color: 0xD4A84B, roughness: 0.2, metalness: 0.95 });
  const hairMat = new THREE.MeshStandardMaterial({ color: 0x0f0a05, roughness: 0.85, metalness: 0.02 });
  const sunglassMat = new THREE.MeshStandardMaterial({ color: 0x1a1008, roughness: 0.1, metalness: 0.6 });
  const sunglassFrameMat = new THREE.MeshStandardMaterial({ color: 0x2a1a0a, roughness: 0.3, metalness: 0.4 });

  // ── Torso (Navy Blazer) ──
  const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.32, 0.85, 16), navySuitMat);
  torso.position.y = 1.15; torso.castShadow = true;
  group.add(torso);

  // Blazer lapel detail (slight V opening)
  const lapelL = new THREE.Mesh(
    new THREE.BoxGeometry(0.08, 0.3, 0.05),
    navySuitMat
  );
  lapelL.position.set(-0.12, 1.45, 0.22);
  lapelL.rotation.z = 0.2;
  group.add(lapelL);

  const lapelR = lapelL.clone();
  lapelR.position.set(0.12, 1.45, 0.22);
  lapelR.rotation.z = -0.2;
  group.add(lapelR);

  // ── White Turtleneck (visible at chest/neck) ──
  const turtleneck = new THREE.Mesh(
    new THREE.CylinderGeometry(0.2, 0.24, 0.35, 12),
    whiteTurtleneckMat
  );
  turtleneck.position.set(0, 1.55, 0.02);
  turtleneck.castShadow = true;
  group.add(turtleneck);

  // Turtleneck collar
  const collar = new THREE.Mesh(
    new THREE.CylinderGeometry(0.11, 0.12, 0.1, 12),
    whiteTurtleneckMat
  );
  collar.position.y = 1.7;
  group.add(collar);

  // ── Shoulders (structured blazer) ──
  const shoulders = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.28, 0.12, 16), navySuitMat);
  shoulders.position.y = 1.6; shoulders.castShadow = true;
  group.add(shoulders);

  // ── Neck ──
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 0.08, 10), skinMat);
  neck.position.y = 1.76;
  group.add(neck);

  // ── Head ──
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.19, 20, 14), skinMat);
  head.position.y = 1.92; head.castShadow = true;
  group.add(head);

  // ── Hair (slicked back, dark) ──
  const hair = new THREE.Mesh(
    new THREE.SphereGeometry(0.2, 20, 10, 0, Math.PI * 2, 0, Math.PI * 0.55),
    hairMat
  );
  hair.position.y = 1.94;
  group.add(hair);

  // Hair sides (slicked)
  const hairSideGeo = new THREE.BoxGeometry(0.42, 0.12, 0.2);
  const hairSide = new THREE.Mesh(hairSideGeo, hairMat);
  hairSide.position.set(0, 1.92, -0.02);
  group.add(hairSide);

  // ── Facial Hair (short beard/stubble) ──
  const beardMat = new THREE.MeshStandardMaterial({ color: 0x1a1008, roughness: 0.9, metalness: 0.0 });
  const jaw = new THREE.Mesh(
    new THREE.SphereGeometry(0.14, 12, 6, 0, Math.PI * 2, Math.PI * 0.5, Math.PI * 0.3),
    beardMat
  );
  jaw.position.set(0, 1.82, 0.04);
  group.add(jaw);

  // ── Aviator Sunglasses ──
  // Left lens
  const lensGeo = new THREE.CircleGeometry(0.055, 12);
  const lensL = new THREE.Mesh(lensGeo, sunglassMat);
  lensL.position.set(-0.07, 1.93, 0.185);
  group.add(lensL);

  // Right lens
  const lensR = new THREE.Mesh(lensGeo, sunglassMat);
  lensR.position.set(0.07, 1.93, 0.185);
  group.add(lensR);

  // Bridge
  const bridge = new THREE.Mesh(
    new THREE.BoxGeometry(0.06, 0.01, 0.01),
    sunglassFrameMat
  );
  bridge.position.set(0, 1.935, 0.185);
  group.add(bridge);

  // ── Gold Chain Necklace ──
  const chain = new THREE.Mesh(
    new THREE.TorusGeometry(0.14, 0.012, 8, 24),
    goldMat
  );
  chain.position.set(0, 1.58, 0.1);
  chain.rotation.x = Math.PI * 0.15;
  group.add(chain);

  // Chain pendant detail
  const pendant = new THREE.Mesh(
    new THREE.BoxGeometry(0.02, 0.03, 0.005),
    goldMat
  );
  pendant.position.set(0, 1.46, 0.18);
  group.add(pendant);

  // ── Legs (Navy trousers) ──
  const legGeo = new THREE.CylinderGeometry(0.1, 0.09, 0.8, 10);
  const leftLeg = new THREE.Mesh(legGeo, navyPantsMat);
  leftLeg.position.set(-0.13, 0.4, 0); leftLeg.castShadow = true;
  group.add(leftLeg);
  const rightLeg = new THREE.Mesh(legGeo, navyPantsMat);
  rightLeg.position.set(0.13, 0.4, 0); rightLeg.castShadow = true;
  group.add(rightLeg);

  // ── Arms (Navy blazer sleeves) ──
  const armGeo = new THREE.CylinderGeometry(0.06, 0.07, 0.65, 10);
  const leftArm = new THREE.Mesh(armGeo, navySuitMat);
  leftArm.position.set(-0.4, 1.25, 0); leftArm.rotation.z = 0.1; leftArm.castShadow = true;
  group.add(leftArm);
  const rightArm = new THREE.Mesh(armGeo, navySuitMat);
  rightArm.position.set(0.4, 1.25, 0); rightArm.rotation.z = -0.1; rightArm.castShadow = true;
  group.add(rightArm);

  // ── Hands (skin) ──
  const handGeo = new THREE.SphereGeometry(0.045, 8, 6);
  const leftHand = new THREE.Mesh(handGeo, skinMat);
  leftHand.position.set(-0.42, 0.92, 0);
  group.add(leftHand);
  const rightHand = new THREE.Mesh(handGeo, skinMat);
  rightHand.position.set(0.42, 0.92, 0);
  group.add(rightHand);

  // ── Shoes (dark, polished) ──
  const shoeGeo = new THREE.BoxGeometry(0.12, 0.08, 0.24);
  const leftShoe = new THREE.Mesh(shoeGeo, shoeMat);
  leftShoe.position.set(-0.13, 0.04, 0.03);
  group.add(leftShoe);
  const rightShoe = new THREE.Mesh(shoeGeo, shoeMat);
  rightShoe.position.set(0.13, 0.04, 0.03);
  group.add(rightShoe);

  // ── Gold Watch (left wrist) ──
  const watch = new THREE.Mesh(
    new THREE.TorusGeometry(0.04, 0.012, 8, 16),
    goldMat
  );
  watch.position.set(-0.42, 0.96, 0); watch.rotation.y = Math.PI / 2;
  group.add(watch);

  // Watch face
  const watchFace = new THREE.Mesh(
    new THREE.CircleGeometry(0.03, 12),
    new THREE.MeshStandardMaterial({ color: 0xFFF8E0, roughness: 0.1, metalness: 0.5 })
  );
  watchFace.position.set(-0.42, 0.96, 0.015);
  group.add(watchFace);

  // ── Shadow disc ──
  const shadow = new THREE.Mesh(
    new THREE.CircleGeometry(0.45, 20),
    new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.35, depthWrite: false })
  );
  shadow.rotation.x = -Math.PI / 2; shadow.position.y = 0.01;
  group.add(shadow);

  scene.add(group);
  return group;
}
