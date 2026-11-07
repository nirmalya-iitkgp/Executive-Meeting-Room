# Executive Steering Committee Boardroom Portal

A photorealistic, interactive 3D Executive Steering Committee Boardroom portal built with **Three.js (r160 ESM via UNPKG CDN)**, WebGL PBR rendering, and modern corporate spatial navigation.

Designed for executive steering committee members, board directors, and CXO leadership to access key enterprise decision applications in a unified, spatial 3D chamber.

---

## 🏛️ Executive Committee Member Portals (8 Nodes)

The portal features 8 executive nodes arranged across an executive boardroom table:
- **Left Side (Seated Executives 1–4)**: Focus on strategic deliberation and analytics.
- **Right Side (Standing Presentations 5–8)**: Dynamic executive briefing and committee command.

| # | Position | Department / Office | Posture | Destination Portal URL |
|---|---|---|---|---|
| **1** | **CTO** | Chief Technology Officer | Seated | `https://nirmalya-iitkgp.github.io/CTO-Digital-Transformation/` |
| **2** | **CFO** | Chief Financial Officer | Seated | `https://nirmalya-iitkgp.github.io/CFO-Capital-allocation/` |
| **3** | **CEO** | Chief Executive Officer | Seated | `https://nirmalya-iitkgp.github.io/Meridian-CEO-Decision-Suite/` |
| **4** | **CMO** | Chief Marketing Officer | Seated | `https://nirmalya-iitkgp.github.io/Brand-Studio/` |
| **5** | **CPO** | Chief Product Officer | Standing | `https://nirmalya-iitkgp.github.io/A-B-testing-suite/` |
| **6** | **CSO** | Chief Strategy Officer | Standing | `https://nirmalya-iitkgp.github.io/CXO-Planning-Portal/` |
| **7** | **CCO** | Chief Commercial Officer | Standing | `https://nirmalya-iitkgp.github.io/Price-Pulse/` |
| **8** | **CSO-ESG** | Chief Sustainability Officer | Standing | `https://nirmalya-iitkgp.github.io/Carbon-Management/` |

---

## 🌟 Key Technical Features

### 1. Studio Lighting, Atmosphere & Reflection Pipeline
- **Studio PBR Pipeline**: Integrated `ACESFilmicToneMapping`, `SRGBColorSpace`, and zero-dependency procedural studio reflections powered by `RoomEnvironment` with `PMREMGenerator`.
- **Balanced 3-Point Studio Rig**: Warm key directional spotlight with `PCFSoftShadowMap` (2048x2048 shadow frustum), cool `HemisphereLight` fill, and an overhead point light generating specular highlights on polished surfaces.
- **Atmospheric Depth**: Deep dark corporate boardroom aesthetic (`#0b0f19`) paired with subtle exponential fog (`FogExp2`).

### 2. Room Architecture, Luxury Wallpaper & Executive Furnishings
- **Stealth Luxury Black Table**: Sleek elongated boardroom table crafted in polished obsidian black (`roughness: 0.16`, `metalness: 0.12`), anodized dark titanium trim (`#18181b`), and matte black cantilever pedestal legs. Repositioned forward along the Z axis (`z = 1.05`) to provide 1.0m clearance and ensure full visibility of all members' bodies and chairs.
- **Architectural Geometric Executive Wallpaper**: Procedurally generated 1024x1024 acoustic woven luxury wall covering featuring micro-weave texture, deep charcoal-navy hue, and metallic brass/titanium lattice pinstripes with embossed bump mapping.
- **Ultra-Wide Executive Video Wall**: Seamless 9.6m x 3.4m curved command display mounted flush on the feature wall, displaying global enterprise telemetry, real-time node links (New York, London, Zurich, Singapore, Tokyo, Bengaluru), and key financial gauges.
- **Filled Chamber Appointments**:
  - Inset geometric dark woven executive area rug with metallic trim framing the meeting zone.
  - Fluted acoustic vertical timber slat wings with warm cove LED uplighting.
  - Architectural side glass curtain walls with dark steel mullions overlooking the night skyline.
  - Floating side credenzas with modern abstract bronze sculptures and warm table lamps.
  - Individual executive leather desk blotters, crystal water tumblers, and conference telepresence mic discs at all 8 stations.

### 3. GLTFLoader & Procedural Fallback Avatars
- Attempts to load 8 separate executive `.glb` models (`executive1.glb` to `executive8.glb`).
- **Resilient Fallback**: Automatically instantiates composite 5–8 part procedural 3D executive avatars if GLB models are missing, including ergonomic executive chairs, tailored suit silhouettes, metallic collars, bronze busts, and glowing interactive desk agenda tablets.

### 4. Spatial Camera & Raycasting Discipline
- **Smooth Damped OrbitControls**: Constrained polar angle (`Math.PI / 2 - 0.05`) ensuring the camera never dips below the floor plane.
- **Dynamic Hover Animation**: Figurine highlights on mouse hover with smooth scale elevation (`1.06x`), Y-axis lift, emissive tablet intensification, and pointer cursor.
- **Cinematic Camera Focus**: Clicking any executive figurine smoothly interpolates camera position and lookAt target toward that member using exponential damping (`1 - Math.exp(-k * dt)`), followed by secure tab navigation.
- **Collapsible Bottom Dock**: Ergonomic glassmorphic navigation dock with quick selector pills (#01–#08), status indicators, and a one-click collapse/expand drawer.

---

## 🔒 Security & Red-Pill / Blue-Pill Testing

The portal implements strict zero-trust URL navigation safety:
- **Red-Pill Defense**: Prohibits malicious schemes (`javascript:`, `data:`, `vbscript:`, `file:`) and prevents DOM-based XSS vectors.
- **Blue-Pill Boundary**: Restricts outbound launches exclusively to validated HTTPS destinations on authorized domains (`*.github.io`).
- **Tab-Nabbing Defense**: All external portals are opened using `rel="noopener,noreferrer"` with `opener = null` detachment to prevent reverse window hijack.

---

## 🧪 Unit Testing

Unit tests run via Vitest:
```bash
npm run test
```
Validates:
- Exact 8-member committee data mapping and role assignments.
- Seated (1–4) vs. Standing (5–8) arrangement invariants.
- Spatial X-axis layout non-overlap.
- Security sanitization with red-pill malicious vectors and blue-pill authorization rules.

---

## 🚀 Deployment (GitHub Pages)

The repository is configured for automated GitHub Pages deployment:
- **Base Path**: Configured in `vite.config.ts` (`base: '/Executive-Steering-Committee-Portal/'`).
- **GitHub Actions Workflow**: Located at `.github/workflows/deploy.yml` with Node 20, checkout, build, and deploy steps.
