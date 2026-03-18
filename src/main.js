import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { COLORS, MAIN_HALL_DIMS, PLAYER, PILLAR_POSITIONS, ROOMS } from './utils/constants.js';
import { createMainHall } from './rooms/MainHall.js';
import { createLightPillar } from './effects/LightPillar.js';
import { createCharacter } from './character/Character.js';
import { setupInteractions } from './controls/Interactions.js';

const state = { currentRoom: ROOMS.MAIN_HALL, isLoaded: false, isStarted: false, keys: { w:false, a:false, s:false, d:false, shift:false }, character: null, interactables: [], clock: new THREE.Clock() };

const scene = new THREE.Scene();
scene.background = new THREE.Color(COLORS.DEEP_BLACK);
scene.fog = new THREE.FogExp2(COLORS.DEEP_BLACK, 0.018);

const camera = new THREE.PerspectiveCamera(55, window.innerWidth/window.innerHeight, 0.1, 200);
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
controls.enableDamping = true; controls.dampingFactor = 0.08;
controls.minDistance = 3; controls.maxDistance = 12;
controls.maxPolarAngle = Math.PI * 0.48; controls.minPolarAngle = Math.PI * 0.15;
controls.enablePan = false; controls.enabled = false;

function setupLighting() {
  scene.add(new THREE.AmbientLight(0x1a1a2e, 0.4));
  const key = new THREE.DirectionalLight(0xFFF4E0, 0.8);
  key.position.set(5, 12, 3); key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048); key.shadow.camera.near = 0.5; key.shadow.camera.far = 50;
  key.shadow.camera.left = -20; key.shadow.camera.right = 20; key.shadow.camera.top = 15; key.shadow.camera.bottom = -15;
  key.shadow.bias = -0.0001; scene.add(key);
  const fill = new THREE.DirectionalLight(0x8899BB, 0.3); fill.position.set(-5, 8, -3); scene.add(fill);
  const r1 = new THREE.PointLight(0xC5A55A, 0.6, 20); r1.position.set(-12, 6, -8); scene.add(r1);
  const r2 = new THREE.PointLight(0x4466AA, 0.4, 20); r2.position.set(12, 6, 8); scene.add(r2);
  for (let i = 0; i < 4; i++) {
    const sp = new THREE.SpotLight(0xFFF0D4, 1.5, 15, Math.PI/8, 0.5, 1.5);
    sp.position.set(-10+i*6, 7, -9.5); sp.target.position.set(-10+i*6, 1.5, -9.8);
    sp.castShadow = true; sp.shadow.mapSize.set(512, 512); scene.add(sp); scene.add(sp.target);
  }
}

const loadBar = document.getElementById('loading-bar');
const loadPct = document.getElementById('loading-percent');
const loadScreen = document.getElementById('loading-screen');
const startOverlay = document.getElementById('start-overlay');
let prog = 0;
const simLoad = () => { const iv = setInterval(() => { prog += Math.random()*12+3; if (prog >= 100) { prog = 100; clearInterval(iv); setTimeout(() => { loadScreen.classList.add('hidden'); startOverlay.classList.remove('hidden'); state.isLoaded = true; }, 600); } loadBar.style.width = prog+'%'; loadPct.textContent = Math.floor(prog); }, 180); };

async function init() {
  setupLighting();
  const hall = createMainHall(scene); state.interactables.push(...hall.interactables);
  const cp = createLightPillar(scene, PILLAR_POSITIONS.CAPITAL, COLORS.CAPITAL_GOLD, 'Capital Portal', ROOMS.CAPITAL);
  const ip = createLightPillar(scene, PILLAR_POSITIONS.INFRASTRUCTURE, COLORS.INFRA_BLUE, 'Infrastructure Portal', ROOMS.INFRASTRUCTURE);
  const gp = createLightPillar(scene, PILLAR_POSITIONS.GROWTH, COLORS.GROWTH_GREEN, 'Growth Portal', ROOMS.GROWTH);
  state.interactables.push(cp.hitbox, ip.hitbox, gp.hitbox);
  state.character = createCharacter(scene);
  controls.target.copy(state.character.position); controls.target.y = PLAYER.CAMERA_LOOK_OFFSET.y;
  setupInteractions(camera, state.interactables, state.character);
  simLoad();
}

startOverlay.addEventListener('click', () => {
  startOverlay.classList.add('hidden'); controls.enabled = true;
  document.getElementById('crosshair').style.display = 'block';
  const rl = document.getElementById('room-label'); rl.textContent = 'MAIN HALL'; rl.classList.add('visible');
  setTimeout(() => rl.classList.remove('visible'), 3000); state.isStarted = true;
});

window.addEventListener('keydown', (e) => { const k = e.key.toLowerCase(); if (k in state.keys) state.keys[k] = true; if (k === 'shift') state.keys.shift = true; });
window.addEventListener('keyup', (e) => { const k = e.key.toLowerCase(); if (k in state.keys) state.keys[k] = false; if (k === 'shift') state.keys.shift = false; });

function updateChar(dt) {
  if (!state.isStarted || !state.character) return;
  const spd = PLAYER.SPEED * (state.keys.shift ? PLAYER.SPRINT_MULTIPLIER : 1) * dt;
  const dir = new THREE.Vector3();
  const fwd = new THREE.Vector3(); camera.getWorldDirection(fwd); fwd.y = 0; fwd.normalize();
  const rt = new THREE.Vector3(); rt.crossVectors(fwd, new THREE.Vector3(0,1,0)).normalize();
  if (state.keys.w) dir.add(fwd); if (state.keys.s) dir.sub(fwd);
  if (state.keys.d) dir.add(rt); if (state.keys.a) dir.sub(rt);
  if (dir.length() > 0) {
    dir.normalize(); const np = state.character.position.clone().add(dir.multiplyScalar(spd));
    const hw = MAIN_HALL_DIMS.WIDTH/2 - PLAYER.RADIUS - 0.5, hd = MAIN_HALL_DIMS.DEPTH/2 - PLAYER.RADIUS - 0.5;
    np.x = Math.max(-hw, Math.min(hw, np.x)); np.z = Math.max(-hd, Math.min(hd, np.z));
    state.character.position.copy(np);
    state.character.rotation.y = THREE.MathUtils.lerp(state.character.rotation.y, Math.atan2(dir.x, dir.z), 0.15);
    state.character.position.y = Math.sin(state.clock.getElapsedTime()*8)*0.03;
  } else { state.character.position.y = Math.sin(state.clock.getElapsedTime()*1.5)*0.01; }
  controls.target.lerp(new THREE.Vector3(state.character.position.x, state.character.position.y + PLAYER.CAMERA_LOOK_OFFSET.y, state.character.position.z), 0.1);
}

function animate() {
  requestAnimationFrame(animate);
  const dt = Math.min(state.clock.getDelta(), 0.05);
  updateChar(dt); controls.update();
  scene.traverse((c) => { if (c.userData && c.userData.animate) c.userData.animate(state.clock.getElapsedTime()); });
  renderer.render(scene, camera);
}

window.addEventListener('resize', () => { camera.aspect = window.innerWidth/window.innerHeight; camera.updateProjectionMatrix(); renderer.setSize(window.innerWidth, window.innerHeight); });

init(); animate();