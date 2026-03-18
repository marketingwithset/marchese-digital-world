import * as THREE from 'three';
import { MAIN_HALL_DIMS } from '../utils/constants.js';

export function createLightPillar(scene, position, color, label, targetRoom) {
  const group = new THREE.Group();
  group.position.set(position.x, 0, position.z);
  const colorObj = new THREE.Color(color);
  const H = MAIN_HALL_DIMS.HEIGHT;

  const beamMat = new THREE.MeshBasicMaterial({
    color: colorObj, transparent: true, opacity: 0.6,
    side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false
  });
  const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, H, 16, 1, true), beamMat);
  beam.position.y = H / 2;
  group.add(beam);

  const glowMat = new THREE.MeshBasicMaterial({
    color: colorObj, transparent: true, opacity: 0.08,
    side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false
  });
  const glow = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.2, H, 16, 1, true), glowMat);
  glow.position.y = H / 2;
  group.add(glow);

  const glow2Mat = new THREE.MeshBasicMaterial({
    color: colorObj, transparent: true, opacity: 0.03,
    side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false
  });
  const glow2 = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 2.2, H, 16, 1, true), glow2Mat);
  glow2.position.y = H / 2;
  group.add(glow2);

  const pCount = 80;
  const pPos = new Float32Array(pCount * 3);
  for (let i = 0; i < pCount; i++) {
    const a = Math.random() * Math.PI * 2;
    const r = Math.random() * 0.8;
    pPos[i * 3] = Math.cos(a) * r;
    pPos[i * 3 + 1] = Math.random() * H;
    pPos[i * 3 + 2] = Math.sin(a) * r;
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  const particles = new THREE.Points(pGeo, new THREE.PointsMaterial({
    color: colorObj, size: 0.08, transparent: true, opacity: 0.7,
    blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true
  }));
  group.add(particles);

  const ringMat = new THREE.MeshBasicMaterial({
    color: colorObj, transparent: true, opacity: 0.15,
    side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false
  });
  const ring = new THREE.Mesh(new THREE.RingGeometry(1.0, 1.8, 32), ringMat);
  ring.rotation.x = -Math.PI / 2;
  ring.position.y = 0.02;
  group.add(ring);

  const innerRing = new THREE.Mesh(
    new THREE.RingGeometry(0.2, 0.5, 24),
    new THREE.MeshBasicMaterial({ color: colorObj, transparent: true, opacity: 0.25, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false })
  );
  innerRing.rotation.x = -Math.PI / 2;
  innerRing.position.y = 0.03;
  group.add(innerRing);

  const light = new THREE.PointLight(color, 2, 8);
  light.position.y = 3;
  group.add(light);

  group.userData.animate = (t) => {
    beamMat.opacity = 0.5 + Math.sin(t * 2) * 0.15;
    glowMat.opacity = 0.06 + Math.sin(t * 1.5) * 0.03;
    ringMat.opacity = 0.12 + Math.sin(t * 2.5) * 0.05;
    light.intensity = 1.5 + Math.sin(t * 2) * 0.5;
    particles.rotation.y = t * 0.3;
    const pos = pGeo.attributes.position.array;
    for (let i = 0; i < pCount; i++) {
      pos[i * 3 + 1] += 0.015;
      if (pos[i * 3 + 1] > H) pos[i * 3 + 1] = 0;
    }
    pGeo.attributes.position.needsUpdate = true;
    beam.rotation.y = t * 0.1;
    glow.rotation.y = -t * 0.05;
    innerRing.rotation.z = t * 0.5;
  };

  scene.add(group);

  const hitbox = new THREE.Mesh(
    new THREE.CylinderGeometry(1.5, 1.5, H, 8),
    new THREE.MeshBasicMaterial({ visible: false })
  );
  hitbox.position.set(position.x, H / 2, position.z);
  hitbox.userData = { type: 'portal', name: label, description: `Step into the ${label} to explore.`, targetRoom, interactive: true };
  scene.add(hitbox);

  return { group, hitbox };
}
