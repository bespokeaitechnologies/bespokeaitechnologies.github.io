/* ═══════════════════════════════════════════════════
   BESPOKE AI TECHNOLOGIES — Three.js Neural Network
   Inspired by lusion.co / bruno-simon.com aesthetics
   ═══════════════════════════════════════════════════ */

import * as THREE from 'three';

const canvas = document.getElementById('heroCanvas');
if (!canvas) { /* page has no heroCanvas — module loaded but skipped */ }
else {

// ── Renderer ────────────────────────────────────────
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 0);

// ── Scene + camera ──────────────────────────────────
const scene  = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 500);
camera.position.z = 55;

// ── Teal particle network ────────────────────────────
const PC   = 130; // particle count
const positions  = new Float32Array(PC * 3);
const velocities = new Float32Array(PC * 3);
const MAX_DIST   = 20;

for (let i = 0; i < PC; i++) {
  const i3 = i * 3;
  positions[i3]   = (Math.random() - 0.5) * 100;
  positions[i3+1] = (Math.random() - 0.5) *  65;
  positions[i3+2] = (Math.random() - 0.5) *  30;
  velocities[i3]   = (Math.random() - 0.5) * 0.055;
  velocities[i3+1] = (Math.random() - 0.5) * 0.038;
  velocities[i3+2] = (Math.random() - 0.5) * 0.012;
}

const partGeo = new THREE.BufferGeometry();
partGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
const partMat = new THREE.PointsMaterial({ color: 0x00e5d0, size: 0.28, transparent: true, opacity: 0.75 });
const particles = new THREE.Points(partGeo, partMat);
scene.add(particles);

// ── Connection line segments (pre-allocated buffer) ──
const MAX_LINES = PC * 5;
const linePos   = new Float32Array(MAX_LINES * 2 * 3);
const lineGeo   = new THREE.BufferGeometry();
lineGeo.setAttribute('position', new THREE.BufferAttribute(linePos, 3));
const lineMesh = new THREE.LineSegments(
  lineGeo,
  new THREE.LineBasicMaterial({ color: 0x00e5d0, transparent: true, opacity: 0.12 })
);
scene.add(lineMesh);

// ── Gold accent particles ────────────────────────────
const GC      = 35;
const goldPos = new Float32Array(GC * 3);
const goldVel = new Float32Array(GC * 3);
for (let i = 0; i < GC; i++) {
  const i3 = i * 3;
  goldPos[i3]   = (Math.random() - 0.5) * 100;
  goldPos[i3+1] = (Math.random() - 0.5) *  65;
  goldPos[i3+2] = (Math.random() - 0.5) *  25;
  goldVel[i3]   = (Math.random() - 0.5) * 0.04;
  goldVel[i3+1] = (Math.random() - 0.5) * 0.03;
  goldVel[i3+2] = (Math.random() - 0.5) * 0.01;
}
const goldGeo = new THREE.BufferGeometry();
goldGeo.setAttribute('position', new THREE.BufferAttribute(goldPos, 3));
const goldPts = new THREE.Points(goldGeo, new THREE.PointsMaterial({ color: 0xf5a623, size: 0.2, transparent: true, opacity: 0.55 }));
scene.add(goldPts);

// ── Floating wireframe geometries ───────────────────
const wireConfigs = [
  { geo: new THREE.IcosahedronGeometry(6, 0), x: -34, y:  12, z: -12, rx: 0.0045, ry: 0.007,  rz: 0 },
  { geo: new THREE.OctahedronGeometry(5, 0),  x:  32, y:  -9, z:  -6, rx:-0.003,  ry: 0.008,  rz: 0.002 },
  { geo: new THREE.TetrahedronGeometry(4, 0), x:   2, y:  22, z: -18, rx: 0.006,  ry:-0.004,  rz: 0.003 },
  { geo: new THREE.IcosahedronGeometry(3, 0), x: -10, y: -18, z:  -8, rx:-0.005,  ry: 0.0055, rz: 0 },
];

const wireMeshes = wireConfigs.map(cfg => {
  const mat  = new THREE.MeshBasicMaterial({ color: 0x00e5d0, wireframe: true, transparent: true, opacity: 0.045 });
  const mesh = new THREE.Mesh(cfg.geo, mat);
  mesh.position.set(cfg.x, cfg.y, cfg.z);
  scene.add(mesh);
  return { mesh, rx: cfg.rx, ry: cfg.ry, rz: cfg.rz };
});

// ── Mouse parallax ───────────────────────────────────
let targetX = 0, targetY = 0;
let currentX = 0, currentY = 0;

document.addEventListener('mousemove', e => {
  targetX = (e.clientX / window.innerWidth  - 0.5) * 2;
  targetY = (e.clientY / window.innerHeight - 0.5) * 2;
}, { passive: true });

// ── Resize ───────────────────────────────────────────
window.addEventListener('resize', () => {
  const w = window.innerWidth, h = window.innerHeight;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
}, { passive: true });

// ── Update connections ───────────────────────────────
function updateConnections() {
  let lc = 0;
  for (let i = 0; i < PC && lc < MAX_LINES; i++) {
    const i3 = i * 3;
    for (let j = i + 1; j < PC && lc < MAX_LINES; j++) {
      const j3 = j * 3;
      const dx = positions[i3]   - positions[j3];
      const dy = positions[i3+1] - positions[j3+1];
      const dz = positions[i3+2] - positions[j3+2];
      if (Math.sqrt(dx*dx + dy*dy + dz*dz) < MAX_DIST) {
        const b = lc * 6;
        linePos[b]   = positions[i3];   linePos[b+1] = positions[i3+1]; linePos[b+2] = positions[i3+2];
        linePos[b+3] = positions[j3];   linePos[b+4] = positions[j3+1]; linePos[b+5] = positions[j3+2];
        lc++;
      }
    }
  }
  lineGeo.setDrawRange(0, lc * 2);
  lineGeo.attributes.position.needsUpdate = true;
}

// ── Animation loop ───────────────────────────────────
function animate() {
  requestAnimationFrame(animate);

  // Move teal particles
  for (let i = 0; i < PC; i++) {
    const i3 = i * 3;
    positions[i3]   += velocities[i3];
    positions[i3+1] += velocities[i3+1];
    positions[i3+2] += velocities[i3+2];
    if (Math.abs(positions[i3])   > 50) velocities[i3]   *= -1;
    if (Math.abs(positions[i3+1]) > 33) velocities[i3+1] *= -1;
    if (Math.abs(positions[i3+2]) > 15) velocities[i3+2] *= -1;
  }
  partGeo.attributes.position.needsUpdate = true;

  // Move gold particles
  for (let i = 0; i < GC; i++) {
    const i3 = i * 3;
    goldPos[i3]   += goldVel[i3];
    goldPos[i3+1] += goldVel[i3+1];
    goldPos[i3+2] += goldVel[i3+2];
    if (Math.abs(goldPos[i3])   > 50) goldVel[i3]   *= -1;
    if (Math.abs(goldPos[i3+1]) > 33) goldVel[i3+1] *= -1;
    if (Math.abs(goldPos[i3+2]) > 13) goldVel[i3+2] *= -1;
  }
  goldGeo.attributes.position.needsUpdate = true;

  updateConnections();

  // Rotate wireframes
  wireMeshes.forEach(w => {
    w.mesh.rotation.x += w.rx;
    w.mesh.rotation.y += w.ry;
    w.mesh.rotation.z += w.rz;
  });

  // Smooth camera parallax
  currentX += (targetX * 7 - currentX) * 0.025;
  currentY += (-targetY * 5 - currentY) * 0.025;
  camera.position.x = currentX;
  camera.position.y = currentY;
  camera.lookAt(scene.position);

  renderer.render(scene, camera);
}

animate();

} // end canvas guard
