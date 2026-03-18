import * as THREE from 'three';
const raycaster = new THREE.Raycaster();
const center = new THREE.Vector2(0, 0);
let objs = [], camRef = null, charRef = null, curHL = null;
const pr = document.getElementById('interaction-prompt');
const ip = document.getElementById('info-panel');
const it = document.getElementById('info-title');
const ib = document.getElementById('info-body');
const ic = document.getElementById('info-cta');

export function setupInteractions(camera, interactables, character) {
  camRef = camera; objs = interactables; charRef = character;
  window.addEventListener('click', onInteract);
  window.addEventListener('keydown', (e) => { if (e.key.toLowerCase()==='e') onInteract(); if (e.key==='Escape') closePanel(); });
  (function checkHover() {
    if (!camRef||!charRef) { requestAnimationFrame(checkHover); return; }
    raycaster.setFromCamera(center, camRef); raycaster.far = 15;
    const hits = raycaster.intersectObjects(objs, true);
    if (hits.length > 0) { const o = findI(hits[0].object); if (o&&o.userData.interactive) { if (curHL!==o) { curHL=o; showP(o.userData); } } }
    else { if (curHL) { curHL=null; hideP(); } }
    if (charRef) { objs.forEach(o => { if (o.userData.type==='portal') { const d=charRef.position.distanceTo(new THREE.Vector3(o.position.x,charRef.position.y,o.position.z)); if(d<2.0) showP({name:o.userData.name,type:'portal',description:'Press E or click to enter'}); } }); }
    requestAnimationFrame(checkHover);
  })();
}
function findI(o) { if (o.userData&&o.userData.interactive) return o; if (o.parent) return findI(o.parent); return null; }
function onInteract() {
  if (!curHL) return; const d = curHL.userData;
  if (d.type==='painting') openPanel(d.name, d.description, 'Inquire About This Piece');
  else if (d.type==='portal') doPortal(d.targetRoom, d.name);
  else if (d.type==='phonebooth') openPanel(d.name, d.description, 'Open Contact Form');
  else if (d.type==='product') openPanel(d.name, d.description, d.price?'Add to Cart — $'+d.price:'View Details');
  else if (d.name) openPanel(d.name, d.description||'');
}
function showP(d) { pr.textContent = d.name+' — Press E or Click'; pr.classList.add('visible'); }
function hideP() { pr.classList.remove('visible'); }
function openPanel(t, b, cta) { it.textContent=t; ib.textContent=b; if(cta){ic.textContent=cta;ic.style.display='inline-block';}else{ic.style.display='none';} ip.classList.add('visible'); }
function closePanel() { ip.classList.remove('visible'); }
function doPortal(room, name) {
  const f = document.createElement('div');
  f.style.cssText='position:fixed;top:0;left:0;width:100%;height:100%;background:white;z-index:999;opacity:0;transition:opacity 0.3s ease;pointer-events:none;';
  document.body.appendChild(f);
  requestAnimationFrame(()=>{f.style.opacity='0.8';setTimeout(()=>{f.style.opacity='0';const rl=document.getElementById('room-label');rl.textContent=name.toUpperCase();rl.classList.add('visible');setTimeout(()=>rl.classList.remove('visible'),3000);console.log('Portal:',room);setTimeout(()=>f.remove(),500);},400);});
}