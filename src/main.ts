import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { EXECUTIVE_MEMBERS, safeOpenPortal, type ExecutiveMember } from './executiveData.ts';
import { buildEnhancedRoom } from './roomDecor.ts';

// 1. Hardware / Software WebGL Detection
const isSoftwareGl = (() => {
  const gl = document.createElement('canvas').getContext('webgl2');
  if (!gl) return true;
  const ext = gl.getExtension('WEBGL_debug_renderer_info');
  const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
  const gpu = String(gl.getParameter(param));
  gl.getExtension('WEBGL_lose_context')?.loseContext();
  return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
})();

// 2. Scene, Camera, Renderer Setup
const container = document.getElementById('webgl-container');
if (!container) {
  throw new Error('Missing #webgl-container in DOM');
}

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0b0f19);
scene.fog = new THREE.FogExp2(0x0b0f19, 0.025);

const camera = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, 0.1, 80);
const DEFAULT_CAM_POS = new THREE.Vector3(0, 3.8, 11.2);
const DEFAULT_TARGET = new THREE.Vector3(0, 1.25, 0);
camera.position.copy(DEFAULT_CAM_POS);

const renderer = new THREE.WebGLRenderer({
  antialias: !isSoftwareGl,
  powerPreference: 'high-performance',
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.15;
renderer.shadowMap.enabled = !isSoftwareGl;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
container.appendChild(renderer.domElement);

// Studio Environment Reflection using RoomEnvironment
const pmremGenerator = new THREE.PMREMGenerator(renderer);
scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
pmremGenerator.dispose();

// OrbitControls with smooth damping and constraints
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.maxPolarAngle = Math.PI / 2 - 0.05; // strictly above floor plane
controls.minPolarAngle = Math.PI / 8;
controls.minDistance = 3.5;
controls.maxDistance = 18;
controls.target.copy(DEFAULT_TARGET);

// 3. Lighting & Atmosphere Setup
// Neutral ambient + cool hemisphere fill
const hemiLight = new THREE.HemisphereLight(0x94a3b8, 0x0f172a, 0.6);
scene.add(hemiLight);

// Warm directional key spotlight with soft shadows
const keySpotlight = new THREE.DirectionalLight(0xfff7ed, 2.2);
keySpotlight.position.set(4, 9, 6);
keySpotlight.castShadow = !isSoftwareGl;
if (keySpotlight.castShadow) {
  keySpotlight.shadow.mapSize.width = 2048;
  keySpotlight.shadow.mapSize.height = 2048;
  keySpotlight.shadow.camera.near = 1;
  keySpotlight.shadow.camera.far = 25;
  keySpotlight.shadow.camera.left = -9;
  keySpotlight.shadow.camera.right = 9;
  keySpotlight.shadow.camera.top = 9;
  keySpotlight.shadow.camera.bottom = -9;
  keySpotlight.shadow.bias = -0.0005;
  keySpotlight.shadow.normalBias = 0.02;
}
scene.add(keySpotlight);

// Overhead point light for realistic specular highlights on polished marble/floor
const overheadPointLight = new THREE.PointLight(0x38bdf8, 1.4, 16, 1.2);
overheadPointLight.position.set(0, 3.8, 1.05);
scene.add(overheadPointLight);

const warmFillLight = new THREE.DirectionalLight(0xfef08a, 0.7);
warmFillLight.position.set(-6, 5, -2);
scene.add(warmFillLight);

// 4. Room Geometry & Executive Table
// Reflective floor
const floorGeo = new THREE.PlaneGeometry(36, 36);
const floorMat = new THREE.MeshStandardMaterial({
  color: 0x090d16,
  roughness: 0.16,
  metalness: 0.88,
});
const floor = new THREE.Mesh(floorGeo, floorMat);
floor.rotation.x = -Math.PI / 2;
floor.position.y = 0;
floor.receiveShadow = !isSoftwareGl;
scene.add(floor);

// Floor grid accent
const floorGridGeo = new THREE.PlaneGeometry(16, 8);
const floorGridMat = new THREE.MeshBasicMaterial({
  color: 0x1e293b,
  wireframe: true,
  transparent: true,
  opacity: 0.25,
});
const floorGrid = new THREE.Mesh(floorGridGeo, floorGridMat);
floorGrid.rotation.x = -Math.PI / 2;
floorGrid.position.set(0, 0.005, -0.5);
scene.add(floorGrid);

// Executive Boardroom Table: Sleek elongated black table brought forward so members' full bodies are visible
const tableGroup = new THREE.Group();
const tableWidth = 13.8;
const tableDepth = 1.6;
const tableHeight = 0.86;
const tableThickness = 0.08;
const tableZ = 1.05; // Brought forward in +Z so executive members behind it are fully visible

// Table Top: Deep polished obsidian black luxury material
const tableTopGeo = new THREE.BoxGeometry(tableWidth, tableThickness, tableDepth, 32, 1, 16);
const tableTopMat = new THREE.MeshStandardMaterial({
  color: 0x050508, // Solid luxury black
  roughness: 0.16,
  metalness: 0.12,
});
const tableTop = new THREE.Mesh(tableTopGeo, tableTopMat);
tableTop.position.y = tableHeight;
tableTop.castShadow = !isSoftwareGl;
tableTop.receiveShadow = !isSoftwareGl;
tableGroup.add(tableTop);

// Anodized dark titanium rim (sleek dark profile)
const rimGeo = new THREE.BoxGeometry(tableWidth + 0.04, 0.03, tableDepth + 0.04);
const rimMat = new THREE.MeshStandardMaterial({
  color: 0x18181b, // Dark charcoal / black titanium edge
  metalness: 0.88,
  roughness: 0.25,
});
const tableRim = new THREE.Mesh(rimGeo, rimMat);
tableRim.position.y = tableHeight + 0.02;
tableGroup.add(tableRim);

// Recessed stealth underglow strip
const glowGeo = new THREE.BoxGeometry(tableWidth - 0.2, 0.015, tableDepth - 0.2);
const glowMat = new THREE.MeshBasicMaterial({
  color: 0x0f172a, // Deep stealth obsidian tone
  transparent: true,
  opacity: 0.6,
});
const tableGlow = new THREE.Mesh(glowGeo, glowMat);
tableGlow.position.y = tableHeight - tableThickness / 2 - 0.01;
tableGroup.add(tableGlow);

// Twin Cantilever Pedestal Table Legs in matte black steel
const legGeo = new THREE.CylinderGeometry(0.5, 0.68, tableHeight, 24);
const legMat = new THREE.MeshStandardMaterial({
  color: 0x09090b, // Deep black steel
  metalness: 0.9,
  roughness: 0.25,
});

const leftLeg = new THREE.Mesh(legGeo, legMat);
leftLeg.position.set(-3.8, tableHeight / 2, 0);
leftLeg.castShadow = !isSoftwareGl;
tableGroup.add(leftLeg);

const rightLeg = new THREE.Mesh(legGeo, legMat);
rightLeg.position.set(3.8, tableHeight / 2, 0);
rightLeg.castShadow = !isSoftwareGl;
tableGroup.add(rightLeg);

// Contact shadow plane underneath table
const contactShadowGeo = new THREE.PlaneGeometry(tableWidth + 1.2, tableDepth + 1.2);
const contactShadowMat = new THREE.MeshBasicMaterial({
  color: 0x000000,
  transparent: true,
  opacity: 0.5,
  depthWrite: false,
});
const contactShadow = new THREE.Mesh(contactShadowGeo, contactShadowMat);
contactShadow.rotation.x = -Math.PI / 2;
contactShadow.position.y = 0.01;
tableGroup.add(contactShadow);

tableGroup.position.set(0, 0, tableZ);
scene.add(tableGroup);

// Architectural boardroom architecture: luxury geometric wallpaper, video matrix, plants, credenzas, rug & accessories
buildEnhancedRoom(scene, isSoftwareGl, tableWidth, tableDepth, tableHeight, tableZ);

// Overhead linear luminaire fixture aligned with boardroom table
const luminaireGeo = new THREE.BoxGeometry(tableWidth - 1.0, 0.1, 0.6);
const luminaireMat = new THREE.MeshStandardMaterial({
  color: 0x0f172a,
  metalness: 0.9,
  roughness: 0.2,
});
const luminaire = new THREE.Mesh(luminaireGeo, luminaireMat);
luminaire.position.set(0, 4.3, tableZ);
scene.add(luminaire);

const lightStripGeo = new THREE.PlaneGeometry(tableWidth - 1.2, 0.45);
const lightStripMat = new THREE.MeshBasicMaterial({ color: 0xf8fafc });
const lightStrip = new THREE.Mesh(lightStripGeo, lightStripMat);
lightStrip.rotation.x = Math.PI / 2;
lightStrip.position.set(0, 4.24, tableZ);
scene.add(lightStrip);

// 5. Executive Figurines Creation (GLTF Loader with Procedural Fallback)
const gltfLoader = new GLTFLoader();
const executiveMeshes: THREE.Object3D[] = [];
const interactiveRaycastTargets: THREE.Object3D[] = [];

function createProceduralExecutiveAvatar(data: ExecutiveMember): THREE.Group {
  const group = new THREE.Group();
  group.name = `executive_${data.id}`;

  const suitColor = data.isStanding ? 0x1e293b : 0x0f172a;
  const suitMat = new THREE.MeshStandardMaterial({
    color: suitColor,
    roughness: 0.6,
    metalness: 0.15,
  });

  const bronzeHeadMat = new THREE.MeshStandardMaterial({
    color: 0xd1d5db,
    roughness: 0.25,
    metalness: 0.75,
  });

  const accentColorNum = parseInt(data.accentColor.replace('#', '0x'), 16);
  const accentMat = new THREE.MeshStandardMaterial({
    color: accentColorNum,
    roughness: 0.2,
    metalness: 0.8,
    emissive: accentColorNum,
    emissiveIntensity: 0.25,
  });

  const baseAnchorY = data.isStanding ? 0.0 : 0.0;
  const torsoY = data.isStanding ? 1.45 : 0.92;

  // Part 1: Seated Chair or Standing Pedestal
  if (!data.isStanding) {
    const chairBackGeo = new THREE.BoxGeometry(0.82, 0.95, 0.12);
    const chairMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.45, metalness: 0.2 });
    const chairBack = new THREE.Mesh(chairBackGeo, chairMat);
    chairBack.position.set(0, 1.25, -0.45);
    chairBack.castShadow = !isSoftwareGl;
    group.add(chairBack);

    const chairSeatGeo = new THREE.BoxGeometry(0.8, 0.12, 0.75);
    const chairSeat = new THREE.Mesh(chairSeatGeo, chairMat);
    chairSeat.position.set(0, 0.78, -0.2);
    chairSeat.castShadow = !isSoftwareGl;
    group.add(chairSeat);

    const chairStemGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.78, 16);
    const chromeMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.95, roughness: 0.15 });
    const chairStem = new THREE.Mesh(chairStemGeo, chromeMat);
    chairStem.position.set(0, 0.39, -0.2);
    group.add(chairStem);
  } else {
    const podGeo = new THREE.CylinderGeometry(0.48, 0.55, 0.06, 32);
    const podMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8, roughness: 0.25 });
    const pod = new THREE.Mesh(podGeo, podMat);
    pod.position.set(0, 0.03, 0);
    group.add(pod);

    const legsGeo = new THREE.CylinderGeometry(0.18, 0.22, 1.05, 16);
    const legs = new THREE.Mesh(legsGeo, suitMat);
    legs.position.set(0, 0.55, 0);
    legs.castShadow = !isSoftwareGl;
    group.add(legs);
  }

  // Part 2: Sculpted Suit Torso
  const torsoGeo = new THREE.CylinderGeometry(0.36, 0.44, 0.78, 20);
  const torso = new THREE.Mesh(torsoGeo, suitMat);
  torso.position.set(0, torsoY, 0);
  torso.castShadow = !isSoftwareGl;
  group.add(torso);

  // Part 3: Lapel Collar & Tie Accent
  const tieGeo = new THREE.BoxGeometry(0.1, 0.38, 0.04);
  const tie = new THREE.Mesh(tieGeo, accentMat);
  tie.position.set(0, torsoY + 0.12, 0.37);
  group.add(tie);

  // Part 4: Stylized Bronze/Silver Head
  const headGeo = new THREE.SphereGeometry(0.24, 24, 24);
  headGeo.scale(1, 1.15, 1);
  const head = new THREE.Mesh(headGeo, bronzeHeadMat);
  head.position.set(0, torsoY + 0.62, 0);
  head.castShadow = !isSoftwareGl;
  group.add(head);

  // Part 5: Interactive Holographic Agenda Tablet Console
  const tabletGeo = new THREE.BoxGeometry(0.52, 0.02, 0.36);
  const tabletMat = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    roughness: 0.2,
    metalness: 0.8,
    emissive: accentColorNum,
    emissiveIntensity: 0.35,
  });
  const tablet = new THREE.Mesh(tabletGeo, tabletMat);
  tablet.position.set(0, 0.88, 0.42);
  group.add(tablet);

  // Part 6: Glowing station ring
  const ringGeo = new THREE.RingGeometry(0.36, 0.42, 32);
  const ringMat = new THREE.MeshBasicMaterial({
    color: accentColorNum,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.45,
  });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.rotation.x = -Math.PI / 2;
  ring.position.set(0, 0.875, 0.42);
  group.add(ring);

  // Invisible proxy cylinder for raycasting
  const proxyGeo = new THREE.CylinderGeometry(0.65, 0.65, 2.3, 16);
  const proxyMat = new THREE.MeshBasicMaterial({ visible: false });
  const proxy = new THREE.Mesh(proxyGeo, proxyMat);
  proxy.position.set(0, torsoY + 0.2, 0);
  group.add(proxy);

  const zOffset = data.isStanding ? -0.85 : -0.75;
  group.position.set(data.xPosition, baseAnchorY, zOffset);

  group.userData = {
    member: data,
    proxyMesh: proxy,
    tieMesh: tie,
    tabletMesh: tablet,
    ringMesh: ring,
    originalY: baseAnchorY,
    hoverScale: 1.0,
    targetScale: 1.0,
    isHovered: false,
  };

  proxy.userData.parentGroup = group;
  interactiveRaycastTargets.push(proxy);

  return group;
}

// Load 8 executives with GLTF or procedural fallback
EXECUTIVE_MEMBERS.forEach((exec) => {
  const modelPath = `executive${exec.id}.glb`;
  gltfLoader.load(
    modelPath,
    (gltf) => {
      const model = gltf.scene;
      model.position.set(exec.xPosition, exec.isStanding ? 0.3 : 0, -0.75);
      model.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          child.castShadow = !isSoftwareGl;
          child.receiveShadow = !isSoftwareGl;
        }
      });
      model.userData = { member: exec, targetScale: 1.0, hoverScale: 1.0 };
      scene.add(model);
      executiveMeshes.push(model);
      interactiveRaycastTargets.push(model);
    },
    undefined,
    () => {
      const avatar = createProceduralExecutiveAvatar(exec);
      scene.add(avatar);
      executiveMeshes.push(avatar);
    }
  );
});

// 6. UI Controls Binding
const pillsRow = document.getElementById('pills-row')!;
const execTitle = document.getElementById('exec-title')!;
const execSubtitle = document.getElementById('exec-subtitle')!;
const execBadge = document.getElementById('exec-badge')!;
const launchBtn = document.getElementById('launch-btn')!;
const dockContainer = document.getElementById('dock-container')!;
const dockToggleBtn = document.getElementById('dock-toggle-btn')!;
const resetCamBtn = document.getElementById('reset-cam-btn')!;
const hoverTooltip = document.getElementById('hover-tooltip')!;
const tipRole = document.getElementById('tip-role')!;
const loadingOverlay = document.getElementById('loading-overlay');

let activeMember: ExecutiveMember = EXECUTIVE_MEMBERS[0]; // Default to #01 (CTO)

function renderPills() {
  pillsRow.innerHTML = '';
  EXECUTIVE_MEMBERS.forEach((member) => {
    const btn = document.createElement('button');
    btn.className = `pill-btn ${member.id === activeMember.id ? 'active' : ''}`;
    btn.innerHTML = `
      <span class="pill-number">#0${member.id}</span>
      <span class="pill-role">${member.role}</span>
    `;
    btn.addEventListener('click', () => {
      selectExecutive(member, true);
    });
    pillsRow.appendChild(btn);
  });
}

function updateActiveUI(member: ExecutiveMember) {
  activeMember = member;
  execTitle.textContent = member.role;
  execSubtitle.textContent = `${member.department} (${member.division}) — Click to launch application ↗`;
  execBadge.textContent = member.initials;
  execBadge.style.color = member.accentColor;
  execBadge.style.borderColor = member.accentColor;

  renderPills();
}

launchBtn.addEventListener('click', () => {
  if (activeMember && activeMember.url) {
    safeOpenPortal(activeMember.url);
  }
});

let isDockCollapsed = false;
dockToggleBtn.addEventListener('click', () => {
  isDockCollapsed = !isDockCollapsed;
  if (isDockCollapsed) {
    dockContainer.classList.add('collapsed');
    dockToggleBtn.textContent = '▴ Show Controls';
  } else {
    dockContainer.classList.remove('collapsed');
    dockToggleBtn.textContent = '▾ Collapse HUD';
  }
});

// 7. Raycasting & Camera Transitions
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let hoveredGroup: THREE.Object3D | null = null;

let isTransitioningCamera = false;
const targetCameraPos = new THREE.Vector3().copy(DEFAULT_CAM_POS);
const targetControlsFocus = new THREE.Vector3().copy(DEFAULT_TARGET);

resetCamBtn.addEventListener('click', () => {
  targetCameraPos.copy(DEFAULT_CAM_POS);
  targetControlsFocus.copy(DEFAULT_TARGET);
  isTransitioningCamera = true;
});

function onPointerMove(event: PointerEvent) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  hoverTooltip.style.left = `${event.clientX}px`;
  hoverTooltip.style.top = `${event.clientY - 12}px`;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(interactiveRaycastTargets, true);

  if (intersects.length > 0) {
    let hit: THREE.Object3D | null = intersects[0].object;
    let group = (hit.userData && hit.userData.parentGroup) || hit;
    while (group && !group.userData?.member && group.parent) {
      group = group.parent;
    }

    if (group && group.userData?.member) {
      if (hoveredGroup !== group) {
        if (hoveredGroup) {
          hoveredGroup.userData.targetScale = 1.0;
          hoveredGroup.userData.isHovered = false;
        }
        hoveredGroup = group;
        group.userData.targetScale = 1.06;
        group.userData.isHovered = true;

        tipRole.textContent = `${group.userData.member.role} — ${group.userData.member.department}`;
        hoverTooltip.style.display = 'block';
        container!.style.cursor = 'pointer';
      }
      return;
    }
  }

  if (hoveredGroup) {
    hoveredGroup.userData.targetScale = 1.0;
    hoveredGroup.userData.isHovered = false;
    hoveredGroup = null;
  }
  hoverTooltip.style.display = 'none';
  container!.style.cursor = 'grab';
}

function onPointerDown(event: PointerEvent) {
  if (
    (event.target as HTMLElement).closest('#dock-container') ||
    (event.target as HTMLElement).closest('.header-overlay') ||
    (event.target as HTMLElement).closest('.top-controls')
  ) {
    return;
  }

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(interactiveRaycastTargets, true);

  if (intersects.length > 0) {
    let hit: THREE.Object3D | null = intersects[0].object;
    let group = (hit.userData && hit.userData.parentGroup) || hit;
    while (group && !group.userData?.member && group.parent) {
      group = group.parent;
    }

    if (group && group.userData?.member) {
      selectExecutive(group.userData.member, true, true);
    }
  }
}

function selectExecutive(member: ExecutiveMember, zoomCamera = true, launchTab = false) {
  updateActiveUI(member);

  if (zoomCamera) {
    targetControlsFocus.set(member.xPosition, member.isStanding ? 1.45 : 1.15, -0.4);
    targetCameraPos.set(member.xPosition * 0.75, 2.2, 4.6);
    isTransitioningCamera = true;
  }

  if (launchTab) {
    setTimeout(() => {
      safeOpenPortal(member.url);
    }, 650);
  }
}

window.addEventListener('pointermove', onPointerMove, { passive: true });
window.addEventListener('pointerdown', onPointerDown);

controls.addEventListener('start', () => {
  isTransitioningCamera = false;
});

// 8. Dynamic Resizing
function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
}
window.addEventListener('resize', onResize);

// 9. Animation Loop with Damping
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  const delta = Math.min(clock.getDelta(), 0.1);

  if (isTransitioningCamera) {
    const factor = 1 - Math.exp(-6 * delta);
    camera.position.lerp(targetCameraPos, factor);
    controls.target.lerp(targetControlsFocus, factor);

    if (camera.position.distanceTo(targetCameraPos) < 0.05 && controls.target.distanceTo(targetControlsFocus) < 0.05) {
      camera.position.copy(targetCameraPos);
      controls.target.copy(targetControlsFocus);
      isTransitioningCamera = false;
    }
  }

  controls.update();

  executiveMeshes.forEach((mesh) => {
    if (mesh.userData) {
      const target = mesh.userData.targetScale || 1.0;
      mesh.userData.hoverScale = THREE.MathUtils.damp(mesh.userData.hoverScale || 1.0, target, 12, delta);
      const s = mesh.userData.hoverScale;
      mesh.scale.set(s, s, s);

      if (mesh.userData.originalY !== undefined) {
        const elevTarget = mesh.userData.isHovered ? mesh.userData.originalY + 0.08 : mesh.userData.originalY;
        mesh.position.y = THREE.MathUtils.damp(mesh.position.y, elevTarget, 10, delta);
      }

      if (mesh.userData.tabletMesh) {
        const intensity = mesh.userData.isHovered ? 0.9 : 0.4;
        mesh.userData.tabletMesh.material.emissiveIntensity = THREE.MathUtils.damp(
          mesh.userData.tabletMesh.material.emissiveIntensity,
          intensity,
          10,
          delta
        );
      }
    }
  });

  overheadPointLight.intensity = 1.3 + Math.sin(clock.elapsedTime * 1.5) * 0.1;

  renderer.render(scene, camera);
}

updateActiveUI(activeMember);
animate();

setTimeout(() => {
  if (loadingOverlay) {
    loadingOverlay.style.opacity = '0';
    setTimeout(() => {
      loadingOverlay.style.display = 'none';
    }, 500);
  }
}, 350);
