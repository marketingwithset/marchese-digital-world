import * as THREE from 'three';

const raycaster = new THREE.Raycaster();
const center = new THREE.Vector2(0, 0);
let interactableObjects = [];
let cameraRef = null;
let characterRef = null;
let currentHighlight = null;

const prompt = document.getElementById('interaction-prompt');
const infoPanel = document.getElementById('info-panel');
const infoTitle = document.getElementById('info-title');
const infoBody = document.getElementById('info-body');
const infoCta = document.getElementById('info-cta');

export function setupInteractions(camera, interactables, character) {
  cameraRef = camera;
  interactableObjects = interactables;
  characterRef = character;

  window.addEventListener('click', onInteract);
  window.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'e') onInteract();
    if (e.key === 'Escape') closeInfoPanel();
  });

  function checkHover() {
    if (!cameraRef || !characterRef) { requestAnimationFrame(checkHover); return; }
    raycaster.setFromCamera(center, cameraRef);
    raycaster.far = 15;
    const intersects = raycaster.intersectObjects(interactableObjects, true);
    if (intersects.length > 0) {
      const obj = findInteractable(intersects[0].object);
      if (obj && obj.userData.interactive) {
        if (currentHighlight !== obj) { currentHighlight = obj; showPrompt(obj.userData); }
      }
    } else {
      if (currentHighlight) { currentHighlight = null; hidePrompt(); }
    }
    if (characterRef) {
      interactableObjects.forEach(obj => {
        if (obj.userData.type === 'portal') {
          const dist = characterRef.position.distanceTo(new THREE.Vector3(obj.position.x, characterRef.position.y, obj.position.z));
          if (dist < 2.0) showPrompt({ name: obj.userData.name, type: 'portal', description: 'Press E or click to enter' });
        }
      });
    }
    requestAnimationFrame(checkHover);
  }
  checkHover();
}

function findInteractable(obj) {
  if (obj.userData && obj.userData.interactive) return obj;
  if (obj.parent) return findInteractable(obj.parent);
  return null;
}

function onInteract() {
  if (!currentHighlight) return;
  const d = currentHighlight.userData;
  switch (d.type) {
    case 'painting': openInfoPanel(d.name, d.description, 'Inquire About This Piece'); break;
    case 'portal': triggerPortalTransition(d.targetRoom, d.name); break;
    case 'phonebooth': openInfoPanel(d.name, d.description, 'Open Contact Form'); break;
    case 'product': openInfoPanel(d.name, d.description, d.price ? `Add to Cart — $${d.price}` : 'View Details'); break;
    default: if (d.name) openInfoPanel(d.name, d.description || '');
  }
}

function showPrompt(data) { prompt.textContent = `${data.name} — Press E or Click`; prompt.classList.add('visible'); }
function hidePrompt() { prompt.classList.remove('visible'); }

function openInfoPanel(title, body, ctaText) {
  infoTitle.textContent = title;
  infoBody.textContent = body;
  if (ctaText) { infoCta.textContent = ctaText; infoCta.style.display = 'inline-block'; }
  else { infoCta.style.display = 'none'; }
  infoPanel.classList.add('visible');
}

function closeInfoPanel() { infoPanel.classList.remove('visible'); }

function triggerPortalTransition(targetRoom, portalName) {
  const flash = document.createElement('div');
  flash.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:white;z-index:999;opacity:0;transition:opacity 0.3s ease;pointer-events:none;';
  document.body.appendChild(flash);
  requestAnimationFrame(() => {
    flash.style.opacity = '0.8';
    setTimeout(() => {
      flash.style.opacity = '0';
      const roomLabel = document.getElementById('room-label');
      roomLabel.textContent = portalName.toUpperCase();
      roomLabel.classList.add('visible');
      setTimeout(() => roomLabel.classList.remove('visible'), 3000);
      console.log(`Portal transition to: ${targetRoom}`);
      setTimeout(() => flash.remove(), 500);
    }, 400);
  });
}