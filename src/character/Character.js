import * as THREE from 'three';
import { COLORS } from '../utils/constants.js';

export function createCharacter(scene) {
  const group = new THREE.Group();
  group.position.set(0, 0, 6);
  const suitMat = new THREE.MeshStandardMaterial({ color: 0x0a0a0f, roughness: 0.7, metalness: 0.05 });
  const skinMat = new THREE.MeshStandardMaterial({ color: 0xD4A574, roughness: 0.6 });
  const pantsMat = new THREE.MeshStandardMaterial({ color: 0x080810, roughness: 0.8 });
  const shoeMat = new THREE.MeshStandardMaterial({ color: 0x050505, roughness: 0.4, metalness: 0.2 });

  const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.32, 0.85, 12), suitMat);
  torso.position.y = 1.15; torso.castShadow = true; group.add(torso);

  const shoulders = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.28, 0.15, 12), suitMat);
  shoulders.position.y = 1.6; shoulders.castShadow = true; group.add(shoulders);

  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 0.12, 8), skinMat);
  neck.position.y = 1.72; group.add(neck);

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.18, 16, 12), skinMat);
  head.position.y = 1.88; head.castShadow = true; group.add(head);

  const hair = new THREE.Mesh(new THREE.SphereGeometry(0.19, 16, 8, 0, Math.PI*2, 0, Math.PI/2), new THREE.MeshStandardMaterial({ color: 0x1a1008, roughness: 0.9 }));
  hair.position.y = 1.9; group.add(hair);

  const legGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.8, 8);
  const lL = new THREE.Mesh(legGeo, pantsMat); lL.position.set(-0.13, 0.4, 0); lL.castShadow = true; group.add(lL);
  const rL = new THREE.Mesh(legGeo, pantsMat); rL.position.set(0.13, 0.4, 0); rL.castShadow = true; group.add(rL);

  const armGeo = new THREE.CylinderGeometry(0.06, 0.07, 0.65, 8);
  const lA = new THREE.Mesh(armGeo, suitMat); lA.position.set(-0.38, 1.25, 0); lA.rotation.z = 0.1; lA.castShadow = true; group.add(lA);
  const rA = new THREE.Mesh(armGeo, suitMat); rA.position.set(0.38, 1.25, 0); rA.rotation.z = -0.1; rA.castShadow = true; group.add(rA);

  const shoeGeo = new THREE.BoxGeometry(0.12, 0.08, 0.22);
  group.add(new THREE.Mesh(shoeGeo, shoeMat).translateX(-0.13).translateY(0.04).translateZ(0.03));
  group.add(new THREE.Mesh(shoeGeo, shoeMat).translateX(0.13).translateY(0.04).translateZ(0.03));

  const watch = new THREE.Mesh(new THREE.TorusGeometry(0.04, 0.01, 8, 12), new THREE.MeshStandardMaterial({ color: COLORS.SET_GOLD, roughness: 0.2, metalness: 0.9 }));
  watch.position.set(-0.38, 0.95, 0); watch.rotation.y = Math.PI/2; group.add(watch);

  const shadow = new THREE.Mesh(new THREE.CircleGeometry(0.4, 16), new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.3, depthWrite: false }));
  shadow.rotation.x = -Math.PI/2; shadow.position.y = 0.01; group.add(shadow);

  scene.add(group);
  return group;
}