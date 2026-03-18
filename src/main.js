// SET UNIVERSE — Main Entry Point
// Chris Marchese Digital World — Built by WAVMVMT x Claude

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { COLORS, MAIN_HALL_DIMS, PLAYER, PILLAR_POSITIONS, ROOMS } from './utils/constants.js';
import { createMainHall } from './rooms/MainHall.js';
import { createLightPillar } from './effects/LightPillar.js';
import { createCharacter } from './character/Character.js';
import { setupInteractions } from './controls/Interactions.js';

const state = {
  currentRoom: ROOMS.MAIN_HALL,
  isLoaded: false,
  isStarted: false,
  keys: { w: false, a: false, s: false, d: false, shift: false },
  character: null,
  interactables: [],
  clock: new THREE.Clock()
};

const scene = new THREE.Scene();
scene.background = new THREE.Color(COLORS.DEEP_BLACK);
scene.fog = new THREE.FogExp2(COLORS.DEEP_BLACK, 0.018);

const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 200);
camera.position.set(0, PLAYER.CAMERA_OFFSET.y, PLAYER.CAMERA_OFFSET.z + 5);

const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;
renderer.outputColorSpace = THREE.SRGBColorSpace;
document.getElementById('app').appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.08;
controls.minDistance = 3;
controls.maxDistance = 12;
controls.maxPolarAngle = Math.PI * 0.48;
controls.minPolarAngle = Math.PI * 0.15;
controls.enablePan = false;
controls.enabled = false;

function setupLighting() {
  scene.add(new THREE.AmbientLight(0x1a1a2e, 0.4));

  const keyLight = new THREE.DirectionalLight(0xFFF4E0, 0.8);
  keyLight.position.set(5, 12, 3);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.set(2048, 2048);
  keyLight.shadow.camera.near = 0.5;
  keyLight.shadow.camera.far = 50;
  keyLight.shadow.camera.left = -20;
  keyLight.shadow.camera.right = 20;
  keyLight.shadow.camera.top = 15;
  keyLight.shadow.camera.bottom = -15;
  keyLight.shadow.bias = -0.0001;
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(0x8899BB, 0.3);
  fillLight.position.set(-5, 8, -3);
  scene.add(fillLight);

  scene.add(Object.assign(new THREE.PointLight(0xC5A55A, 0.6, 20), { position: new THREE.Vector3(-12, 6, -8) }));
  scene.add(Object.assign(new THREE.PointLight(0x4466AA, 0.4, 20), { position: new THREE.Vector3(12, 6, 8) }));

  for (let i = 0; i < 4; i++) {
    const spot = new THREE.SpotLight(0xFFF0D4, 1.5, 15, Math.PI / 8, 0.5, 1.5);
    spot.position.set(-10 + i * 6, 7, -9.5);
    spot.target.position.set(-10 + i * 6, 1.5, -9.8);
    spot.castShadow = true;
    spot.shadow.mapSize.set(512, 512);
    scene.add(spot);
    scene.add(spot.target);
  }
}

const loadingBar = document.getElementById('loading-bar');
const loadingPercent = document.getElementById('loading-percent');
const loadingScreen = document.getElementById('loading-screen');
const startOverlay = document.getElementById('start-overlay');

let loadProgress = 0;
const simulateLoading = () => {
  const interval = setInterval(() => {
    loadProgress += Math.random() * 12 + 3;
    if (loadProgress >= 100) {
      loadProgress = 100;
      clearInterval(interval);
      setTimeout(() => {
        loadingScreen.classList.add('hidden');
        startOverlay.classList.remove('hidden');
        state.isLoaded = true;
      }, 600);
    }
    loadingBar.style.width = loadProgress + '%';
    loadingPercent.textContent = Math.floor(loadProgress);
  }, 180);
};

async function init() {
  setupLighting();

  const hallGroup = createMainHall(scene);
  state.interactables.push(...hallGroup.interactables);

  const capitalPillar = createLightPillar(scene, PILLAR_POSITIONS.CAPITAL, COLORS.CAPITAL_GOLD, 'Capital Portal', ROOMS.CAPITAL);
  const infraPillar = createLightPillar(scene, PILLAR_POSITIONS.INFRASTRUCTURE, COLORS.INFRA_BLUE, 'Infrastructure Portal', ROOMS.INFRASTRUCTURE);
  const growthPillar = createLightPillar(scene, PILLAR_POSITIONS.GROWTH, COLORS.GROWTH_GREEN, 'Growth Portal', ROOMS.GROWTH);
  state.interactables.push(capitalPillar.hitbox, infraPillar.hitbox, growthPillar.hitbox);

  state.character = createCharacter(scene);
  controls.target.copy(state.character.position);
  controls.target.y = PLAYER.CAMERA_LOOK_OFFSET.y;

  setupInteractions(camera, state.interactables, state.character);
  simulateLoading();
}

startOverlay.addEventListener('click', () => {
  startOverlay.classList.add('hidden');
  controls.enabled = true;
  document.getElementById('crosshair').style.display = 'block';
  const roomLabel = document.getElementById('room-label');
  roomLabel.textContent = 'MAIN HALL';
  roomLabel.classList.add('visible');
  setTimeout(() => roomLabel.classList.remove('visible'), 3000);
  state.isStarted = true;
});

window.addEventListener('keydown', (e) => {
  const key = e.key.toLowerCase();
  if (key in state.keys) state.keys[key] = true;
  if (key === 'shift') state.keys.shift = true;
});
window.addEventListener('keyup', (e) => {
  const key = e.key.toLowerCase();
  if (key in state.keys) state.keys[key] = false;
  if (key === 'shift') state.keys.shift = false;
});

function updateCharacter(delta) {
  if (!state.isStarted || !state.character) return;

  const speed = PLAYER.SPEED * (state.keys.shift ? PLAYER.SPRINT_MULTIPLIER : 1) * delta;
  const direction = new THREE.Vector3();

  const cameraForward = new THREE.Vector3();
  camera.getWorldDirection(cameraForward);
  cameraForward.y = 0;
  cameraForward.normalize();

  const cameraRight = new THREE.Vector3();
  cameraRight.crossVectors(cameraForward, new THREE.Vector3(0, 1, 0)).normalize();

  if (state.keys.w) direction.add(cameraForward);
  if (state.keys.s) direction.sub(cameraForward);
  if (state.keys.d) direction.add(cameraRight);
  if (state.keys.a) direction.sub(cameraRight);

  if (direction.length() > 0) {
    direction.normalize();
    const newPos = state.character.position.clone().add(direction.multiplyScalar(speed));

    const hw = MAIN_HALL_DIMS.WIDTH / 2 - PLAYER.RADIUS - 0.5;
    const hd = MAIN_HALL_DIMS.DEPTH / 2 - PLAYER.RADIUS - 0.5;
    newPos.x = Math.max(-hw, Math.min(hw, newPos.x));
    newPos.z = Math.max(-hd, Math.min(hd, newPos.z));

    state.character.position.copy(newPos);

    const angle = Math.atan2(direction.x, direction.z);
    state.character.rotation.y = THREE.MathUtils.lerp(state.character.rotation.y, angle, 0.15);
    state.character.position.y = Math.sin(state.clock.getElapsedTime() * 8) * 0.03;
  } else {
    state.character.position.y = Math.sin(state.clock.getElapsedTime() * 1.5) * 0.01;
  }

  controls.target.lerp(
    new THREE.Vector3(
      state.character.position.x,
      state.character.position.y + PLAYER.CAMERA_LOOK_OFFSET.y,
      state.character.position.z
    ),
    0.1
  );
}

function animate() {
  requestAnimationFrame(animate);
  const delta = Math.min(state.clock.getDelta(), 0.05);

  updateCharacter(delta);
  controls.update();

  scene.traverse((child) => {
    if (child.userData && child.userData.animate) {
      child.userData.animate(state.clock.getElapsedTime());
    }
  });

  renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

init();
animate();
