import * as THREE from 'three';

/**
 * Creates a luxury geometric executive boardroom wallpaper canvas texture.
 * Features deep obsidian-navy base, micro-weave texture, and brushed metallic lattice inlays.
 */
export function createExecutiveWallpaperTexture(): { texture: THREE.CanvasTexture; bumpMap: THREE.CanvasTexture } {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = 1024;
  bumpCanvas.height = 1024;
  const bumpCtx = bumpCanvas.getContext('2d')!;

  // 1. Dark executive charcoal-navy ground
  const bgGrad = ctx.createLinearGradient(0, 0, 1024, 1024);
  bgGrad.addColorStop(0, '#0a0e17');
  bgGrad.addColorStop(0.5, '#0e1422');
  bgGrad.addColorStop(1, '#070a12');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1024, 1024);

  bumpCtx.fillStyle = '#808080';
  bumpCtx.fillRect(0, 0, 1024, 1024);

  // 2. Micro acoustic texture noise
  for (let y = 0; y < 1024; y += 4) {
    ctx.fillStyle = y % 8 === 0 ? 'rgba(255, 255, 255, 0.015)' : 'rgba(0, 0, 0, 0.025)';
    ctx.fillRect(0, y, 1024, 2);
  }

  // 3. Architectural geometric fluted slat & diamond panel grid
  const cellSize = 128;
  ctx.save();
  for (let x = 0; x <= 1024; x += cellSize) {
    for (let y = 0; y <= 1024; y += cellSize) {
      // Panel fill with subtle bevel gradient
      const pGrad = ctx.createLinearGradient(x, y, x + cellSize, y + cellSize);
      pGrad.addColorStop(0, 'rgba(30, 41, 59, 0.35)');
      pGrad.addColorStop(0.5, 'rgba(15, 23, 42, 0.15)');
      pGrad.addColorStop(1, 'rgba(2, 6, 23, 0.45)');
      ctx.fillStyle = pGrad;
      ctx.fillRect(x + 4, y + 4, cellSize - 8, cellSize - 8);

      // Fine metallic brass / titanium inlay lines
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.22)';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(x + 8, y + 8, cellSize - 16, cellSize - 16);

      // Inner geometric diamond accent
      ctx.beginPath();
      ctx.moveTo(x + cellSize / 2, y + 16);
      ctx.lineTo(x + cellSize - 16, y + cellSize / 2);
      ctx.lineTo(x + cellSize / 2, y + cellSize - 16);
      ctx.lineTo(x + 16, y + cellSize / 2);
      ctx.closePath();
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.12)';
      ctx.stroke();

      // Bump map grooves
      bumpCtx.strokeStyle = '#333333';
      bumpCtx.lineWidth = 3;
      bumpCtx.strokeRect(x + 4, y + 4, cellSize - 8, cellSize - 8);
      bumpCtx.strokeStyle = '#cccccc';
      bumpCtx.lineWidth = 1;
      bumpCtx.strokeRect(x + 8, y + 8, cellSize - 16, cellSize - 16);
    }
  }
  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 2);

  const bumpMap = new THREE.CanvasTexture(bumpCanvas);
  bumpMap.wrapS = THREE.RepeatWrapping;
  bumpMap.wrapT = THREE.RepeatWrapping;
  bumpMap.repeat.set(4, 2);

  return { texture, bumpMap };
}

/**
 * Creates the high-tech Executive Video Wall Canvas Texture showing real-time steering committee telemetry.
 */
export function createVideoWallTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 768;
  const ctx = canvas.getContext('2d')!;

  // Background
  const bg = ctx.createLinearGradient(0, 0, 0, 768);
  bg.addColorStop(0, '#060a12');
  bg.addColorStop(0.5, '#0a101d');
  bg.addColorStop(1, '#05080e');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 2048, 768);

  // Subtle grid background
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.06)';
  ctx.lineWidth = 1;
  for (let x = 0; x < 2048; x += 48) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 768);
    ctx.stroke();
  }
  for (let y = 0; y < 768; y += 48) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(2048, y);
    ctx.stroke();
  }

  // Header Bar
  ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
  ctx.fillRect(32, 28, 1984, 64);
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
  ctx.strokeRect(32, 28, 1984, 64);

  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 22px system-ui, -apple-system, sans-serif';
  ctx.fillText('GLOBAL EXECUTIVE STEERING COMMITTEE', 56, 68);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '600 15px system-ui, -apple-system, sans-serif';
  ctx.fillText('ENTERPRISE DECISION PLATFORM • SPATIAL COMMAND CHAMBER • FY2026', 720, 68);

  // Live status pulse indicator
  ctx.beginPath();
  ctx.arc(1950, 60, 8, 0, Math.PI * 2);
  ctx.fillStyle = '#10b981';
  ctx.fill();

  // 3 Metric Cards in the center
  const cards = [
    { title: 'PORTFOLIO ROIC', val: '22.4%', sub: 'Capital Allocation Efficiency', color: '#10b981' },
    { title: 'CONSOLIDATED ARR', val: '$4.28B', sub: '+18.6% YoY Expansion Velocity', color: '#eab308' },
    { title: 'CORE PLATFORM SLA', val: '99.995%', sub: 'Zero High-Severity Incidents', color: '#6366f1' },
  ];

  cards.forEach((card, idx) => {
    const x = 70 + idx * 640;
    const y = 120;
    const w = 600;
    const h = 180;

    ctx.fillStyle = 'rgba(15, 23, 42, 0.65)';
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.strokeRect(x, y, w, h);

    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 15px system-ui, sans-serif';
    ctx.fillText(card.title, x + 24, y + 42);

    ctx.fillStyle = card.color;
    ctx.font = 'bold 54px system-ui, sans-serif';
    ctx.fillText(card.val, x + 24, y + 115);

    ctx.fillStyle = '#64748b';
    ctx.font = '14px system-ui, sans-serif';
    ctx.fillText(card.sub, x + 24, y + 152);
  });

  // World Node Map & Telemetry Curves at bottom
  ctx.fillStyle = 'rgba(2, 6, 23, 0.75)';
  ctx.fillRect(70, 330, 1908, 380);
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.2)';
  ctx.strokeRect(70, 330, 1908, 380);

  // Simulated Global Data Nodes
  const nodes = [
    { x: 380, y: 510, name: 'NEW YORK' },
    { x: 740, y: 460, name: 'LONDON' },
    { x: 920, y: 475, name: 'ZURICH' },
    { x: 1320, y: 550, name: 'SINGAPORE' },
    { x: 1560, y: 500, name: 'TOKYO' },
    { x: 1220, y: 570, name: 'BENGALURU' },
  ];

  ctx.strokeStyle = 'rgba(56, 189, 248, 0.45)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let i = 0; i < nodes.length - 1; i++) {
    ctx.moveTo(nodes[i].x, nodes[i].y);
    const midX = (nodes[i].x + nodes[i + 1].x) / 2;
    const midY = Math.min(nodes[i].y, nodes[i + 1].y) - 60;
    ctx.quadraticCurveTo(midX, midY, nodes[i + 1].x, nodes[i + 1].y);
  }
  ctx.stroke();

  nodes.forEach((node) => {
    ctx.beginPath();
    ctx.arc(node.x, node.y, 6, 0, Math.PI * 2);
    ctx.fillStyle = '#38bdf8';
    ctx.fill();

    ctx.fillStyle = '#cbd5e1';
    ctx.font = 'bold 13px system-ui, sans-serif';
    ctx.fillText(node.name, node.x - 30, node.y + 24);
  });

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

/**
 * Creates luxury architectural indoor plant (fiddle leaf fig in modern fluted ceramic planter).
 */
export function createPottedPlant(x: number, z: number, scale = 1.0): THREE.Group {
  const group = new THREE.Group();
  group.position.set(x, 0, z);
  group.scale.setScalar(scale);

  // Modern fluted ceramic planter
  const potGeo = new THREE.CylinderGeometry(0.38, 0.28, 0.95, 24);
  const potMat = new THREE.MeshStandardMaterial({
    color: 0x18181b,
    roughness: 0.35,
    metalness: 0.2,
  });
  const pot = new THREE.Mesh(potGeo, potMat);
  pot.position.y = 0.475;
  pot.castShadow = true;
  group.add(pot);

  // Brass planter rim accent
  const rimGeo = new THREE.TorusGeometry(0.38, 0.025, 16, 32);
  const rimMat = new THREE.MeshStandardMaterial({
    color: 0xd4af37,
    roughness: 0.25,
    metalness: 0.85,
  });
  const rim = new THREE.Mesh(rimGeo, rimMat);
  rim.rotation.x = Math.PI / 2;
  rim.position.y = 0.95;
  group.add(rim);

  // Soil
  const soilGeo = new THREE.CylinderGeometry(0.36, 0.36, 0.05, 20);
  const soilMat = new THREE.MeshStandardMaterial({ color: 0x1c1917, roughness: 0.9 });
  const soil = new THREE.Mesh(soilGeo, soilMat);
  soil.position.y = 0.93;
  group.add(soil);

  // Organic stems & lush broad leaves
  const leafMat = new THREE.MeshStandardMaterial({
    color: 0x15803d,
    roughness: 0.4,
    metalness: 0.1,
    side: THREE.DoubleSide,
  });

  const stemMat = new THREE.MeshStandardMaterial({
    color: 0x166534,
    roughness: 0.5,
  });

  for (let i = 0; i < 7; i++) {
    const angle = (i / 7) * Math.PI * 2 + (i % 2) * 0.3;
    const height = 1.2 + (i % 3) * 0.28;

    const stemGeo = new THREE.CylinderGeometry(0.02, 0.03, height, 8);
    const stem = new THREE.Mesh(stemGeo, stemMat);
    stem.position.set(Math.cos(angle) * 0.12, 0.95 + height / 2, Math.sin(angle) * 0.12);
    stem.rotation.z = Math.sin(angle) * 0.22;
    stem.rotation.x = Math.cos(angle) * 0.22;
    group.add(stem);

    // Sculpted leaf plane
    const leafGeo = new THREE.SphereGeometry(0.32, 8, 8);
    leafGeo.scale(0.8, 1.4, 0.12);
    const leaf = new THREE.Mesh(leafGeo, leafMat);
    leaf.position.set(Math.cos(angle) * 0.32, 0.95 + height, Math.sin(angle) * 0.32);
    leaf.rotation.y = angle;
    leaf.rotation.x = 0.45;
    leaf.castShadow = true;
    group.add(leaf);
  }

  return group;
}

/**
 * Creates executive side credenzas with luxury bronze sculpture and ambient lamp.
 */
export function createSideCredenza(x: number, z: number, rotationY = 0): THREE.Group {
  const group = new THREE.Group();
  group.position.set(x, 0, z);
  group.rotation.y = rotationY;

  // Credenza cabinet
  const baseGeo = new THREE.BoxGeometry(3.6, 0.85, 0.8);
  const baseMat = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    roughness: 0.35,
    metalness: 0.15,
  });
  const base = new THREE.Mesh(baseGeo, baseMat);
  base.position.y = 0.425;
  base.castShadow = true;
  group.add(base);

  // Polished black marble top
  const topGeo = new THREE.BoxGeometry(3.66, 0.05, 0.86);
  const topMat = new THREE.MeshStandardMaterial({
    color: 0x050508,
    roughness: 0.15,
    metalness: 0.1,
  });
  const top = new THREE.Mesh(topGeo, topMat);
  top.position.y = 0.875;
  group.add(top);

  // Modern abstract bronze ribbon sculpture
  const sculptureGeo = new THREE.TorusKnotGeometry(0.24, 0.05, 64, 16, 2, 3);
  const sculptureMat = new THREE.MeshStandardMaterial({
    color: 0xd4af37,
    metalness: 0.9,
    roughness: 0.2,
  });
  const sculpture = new THREE.Mesh(sculptureGeo, sculptureMat);
  sculpture.position.set(0.65, 1.25, 0);
  sculpture.castShadow = true;
  group.add(sculpture);

  // Architectural lamp
  const lampBaseGeo = new THREE.CylinderGeometry(0.12, 0.15, 0.04, 16);
  const lampMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8, roughness: 0.3 });
  const lampBase = new THREE.Mesh(lampBaseGeo, lampMat);
  lampBase.position.set(-0.85, 0.92, 0);
  group.add(lampBase);

  const lampStemGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.55, 8);
  const lampStem = new THREE.Mesh(lampStemGeo, lampMat);
  lampStem.position.set(-0.85, 1.2, 0);
  group.add(lampStem);

  const shadeGeo = new THREE.CylinderGeometry(0.2, 0.24, 0.25, 20);
  const shadeMat = new THREE.MeshStandardMaterial({
    color: 0xffedd5,
    roughness: 0.6,
    emissive: 0xfef08a,
    emissiveIntensity: 0.35,
  });
  const shade = new THREE.Mesh(shadeGeo, shadeMat);
  shade.position.set(-0.85, 1.5, 0);
  group.add(shade);

  return group;
}

/**
 * Builds all architectural walls, ceiling, rugs, video display, plants, and decor.
 */
export function buildEnhancedRoom(
  scene: THREE.Scene,
  isSoftwareGl: boolean,
  tableWidth: number,
  tableDepth: number,
  tableHeight: number,
  tableZ: number
) {
  const roomGroup = new THREE.Group();

  // 1. Wallpaper & Main Back Wall
  const { texture: wallpaperTex, bumpMap: wallpaperBump } = createExecutiveWallpaperTexture();
  const wallMat = new THREE.MeshStandardMaterial({
    map: wallpaperTex,
    bumpMap: wallpaperBump,
    bumpScale: 0.04,
    roughness: 0.35,
    metalness: 0.2,
  });

  const backWallGeo = new THREE.PlaneGeometry(32, 12);
  const backWall = new THREE.Mesh(backWallGeo, wallMat);
  backWall.position.set(0, 5.5, -5.6);
  roomGroup.add(backWall);

  // 2. Center Ultra-Wide Executive Video Wall
  const screenTex = createVideoWallTexture();
  const screenGeo = new THREE.PlaneGeometry(9.6, 3.4);
  const screenMat = new THREE.MeshBasicMaterial({
    map: screenTex,
  });
  const screen = new THREE.Mesh(screenGeo, screenMat);
  screen.position.set(0, 4.2, -5.48);
  roomGroup.add(screen);

  // Screen dark titanium bezel
  const bezelGeo = new THREE.BoxGeometry(9.72, 3.52, 0.08);
  const bezelMat = new THREE.MeshStandardMaterial({
    color: 0x09090b,
    metalness: 0.9,
    roughness: 0.2,
  });
  const bezel = new THREE.Mesh(bezelGeo, bezelMat);
  bezel.position.set(0, 4.2, -5.53);
  roomGroup.add(bezel);

  // Backlight aura for video wall
  const screenGlow = new THREE.PointLight(0x38bdf8, 1.2, 10, 1.5);
  screenGlow.position.set(0, 4.2, -5.2);
  roomGroup.add(screenGlow);

  // 3. Acoustic Fluted Wood Slat Side Wings
  const slatColor = 0x18181b;
  const slatMat = new THREE.MeshStandardMaterial({ color: slatColor, roughness: 0.45, metalness: 0.1 });
  for (let x = -13.5; x <= -5.5; x += 0.35) {
    const slatGeo = new THREE.BoxGeometry(0.18, 9, 0.08);
    const slat = new THREE.Mesh(slatGeo, slatMat);
    slat.position.set(x, 5, -5.45);
    roomGroup.add(slat);
  }
  for (let x = 5.5; x <= 13.5; x += 0.35) {
    const slatGeo = new THREE.BoxGeometry(0.18, 9, 0.08);
    const slat = new THREE.Mesh(slatGeo, slatMat);
    slat.position.set(x, 5, -5.45);
    roomGroup.add(slat);
  }

  // 4. Side Glass Curtain Walls & Skyline Depth
  const sideWallGeo = new THREE.PlaneGeometry(24, 12);
  const glassMat = new THREE.MeshStandardMaterial({
    color: 0x0b1329,
    roughness: 0.1,
    metalness: 0.9,
    transparent: true,
    opacity: 0.85,
  });

  const leftWall = new THREE.Mesh(sideWallGeo, glassMat);
  leftWall.rotation.y = Math.PI / 2;
  leftWall.position.set(-14.5, 5.5, 2);
  roomGroup.add(leftWall);

  const rightWall = new THREE.Mesh(sideWallGeo, glassMat);
  rightWall.rotation.y = -Math.PI / 2;
  rightWall.position.set(14.5, 5.5, 2);
  roomGroup.add(rightWall);

  // Mullions for glass walls
  for (let z = -4; z <= 10; z += 3.5) {
    const mullionGeo = new THREE.BoxGeometry(0.12, 12, 0.2);
    const mullionMat = new THREE.MeshStandardMaterial({ color: 0x09090b, metalness: 0.8, roughness: 0.3 });

    const mLeft = new THREE.Mesh(mullionGeo, mullionMat);
    mLeft.position.set(-14.4, 5.5, z);
    roomGroup.add(mLeft);

    const mRight = new THREE.Mesh(mullionGeo, mullionMat);
    mRight.position.set(14.4, 5.5, z);
    roomGroup.add(mRight);
  }

  // 5. Executive Inset Woven Area Rug Underneath Table
  const rugGeo = new THREE.PlaneGeometry(16.5, 7.2);
  const rugMat = new THREE.MeshStandardMaterial({
    color: 0x141a29,
    roughness: 0.85,
    metalness: 0.05,
  });
  const rug = new THREE.Mesh(rugGeo, rugMat);
  rug.rotation.x = -Math.PI / 2;
  rug.position.set(0, 0.015, 0.2);
  rug.receiveShadow = !isSoftwareGl;
  roomGroup.add(rug);

  // Subtle metallic border on rug
  const rugBorderGeo = new THREE.RingGeometry(0, 0, 4); // placeholder or frame
  const frameGeo = new THREE.BoxGeometry(16.7, 0.01, 7.4);
  const frameMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, roughness: 0.3, metalness: 0.85 });
  const frame = new THREE.Mesh(frameGeo, frameMat);
  frame.position.set(0, 0.008, 0.2);
  roomGroup.add(frame);

  // 6. Suspended Coffered Ceiling with Warm Perimeter Cove Glow
  const ceilingGeo = new THREE.PlaneGeometry(28, 18);
  const ceilingMat = new THREE.MeshStandardMaterial({
    color: 0x090d16,
    roughness: 0.6,
    metalness: 0.1,
  });
  const ceiling = new THREE.Mesh(ceilingGeo, ceilingMat);
  ceiling.rotation.x = Math.PI / 2;
  ceiling.position.set(0, 7.2, 1.5);
  roomGroup.add(ceiling);

  const coveLight = new THREE.DirectionalLight(0xffedd5, 0.8);
  coveLight.position.set(0, 6.8, -2);
  roomGroup.add(coveLight);

  // 7. Side Credenzas & Accessories
  roomGroup.add(createSideCredenza(-11.5, -1.5, Math.PI / 2));
  roomGroup.add(createSideCredenza(11.5, -1.5, -Math.PI / 2));

  // 8. Luxury Architectural Potted Plants
  roomGroup.add(createPottedPlant(-6.8, -4.8, 1.1));
  roomGroup.add(createPottedPlant(6.8, -4.8, 1.1));
  roomGroup.add(createPottedPlant(-12.8, 4.5, 1.0));
  roomGroup.add(createPottedPlant(12.8, 4.5, 1.0));

  // 9. Tabletop Appointments at 8 Executive Stations
  const xPositions = [-5.25, -3.75, -2.25, -0.75, 0.75, 2.25, 3.75, 5.25];
  const blotterGeo = new THREE.BoxGeometry(0.85, 0.012, 0.52);
  const blotterMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.65, metalness: 0.1 });

  const tumblerGeo = new THREE.CylinderGeometry(0.045, 0.038, 0.11, 16);
  const glassTumblerMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    transmission: 0.92,
    opacity: 1,
    transparent: true,
    roughness: 0.05,
    ior: 1.5,
  });

  const micGeo = new THREE.CylinderGeometry(0.065, 0.075, 0.02, 20);
  const micMat = new THREE.MeshStandardMaterial({ color: 0x27272a, metalness: 0.9, roughness: 0.2 });

  xPositions.forEach((posX) => {
    // Blotter
    const blotter = new THREE.Mesh(blotterGeo, blotterMat);
    blotter.position.set(posX, tableHeight + 0.045, tableZ - 0.25);
    roomGroup.add(blotter);

    // Crystal Tumbler
    const tumbler = new THREE.Mesh(tumblerGeo, glassTumblerMat);
    tumbler.position.set(posX + 0.5, tableHeight + 0.09, tableZ - 0.4);
    roomGroup.add(tumbler);

    // Telepresence microphone pod
    const mic = new THREE.Mesh(micGeo, micMat);
    mic.position.set(posX - 0.48, tableHeight + 0.05, tableZ - 0.42);
    roomGroup.add(mic);
  });

  scene.add(roomGroup);
}
