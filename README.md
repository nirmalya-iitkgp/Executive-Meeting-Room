# Executive Steering Committee Boardroom Portal

A photorealistic, interactive 3D Executive Steering Committee Boardroom portal built with **Three.js (r160 ESM via UNPKG CDN)**, WebGL PBR rendering, and modern corporate spatial navigation.

Designed for executive steering committee members, board directors, and CXO leadership to access key enterprise decision applications in a unified, spatial 3D chamber.

---

## 🏛️ Executive Committee Member Portals (8 Nodes)

The portal features 8 executive nodes arranged across an executive boardroom table:
- **Left Side (Seated Executives 1–4)**: Focus on strategic deliberation and analytics.
- **Right Side (Standing Presentations 5–8)**: Dynamic executive briefing and committee command.

| # | Executive Role | Department / Office | Posture | Destination Portal URL |
|---|---|---|---|---|
| **1** | **Brand Studio** | Chief Marketing Officer (CMO) | Seated | `https://nirmalya-iitkgp.github.io/Brand-Studio/` |
| **2** | **A/B Testing Suite** | Head of Growth & Experimentation | Seated | `https://nirmalya-iitkgp.github.io/A-B-testing-suite/` |
| **3** | **CXO Planning Portal** | Chief Strategy Officer (CSO) | Seated | `https://nirmalya-iitkgp.github.io/CXO-Planning-Portal/` |
| **4** | **Price Pulse** | Chief Commercial Officer (CCO) | Seated | `https://nirmalya-iitkgp.github.io/Price-Pulse/` |
| **5** | **Meridian CEO Suite** | Chief Executive Officer (CEO) | Standing | `https://nirmalya-iitkgp.github.io/Meridian-CEO-Decision-Suite/` |
| **6** | **CFO Capital Allocation** | Chief Financial Officer (CFO) | Standing | `https://nirmalya-iitkgp.github.io/CFO-Capital-allocation/` |
| **7** | **Carbon Management** | Chief Sustainability Officer (CSO) | Standing | `https://nirmalya-iitkgp.github.io/Carbon-Management/` |
| **8** | **CTO Digital Transformation** | Chief Technology Officer (CTO) | Standing | `https://nirmalya-iitkgp.github.io/CTO-Digital-Transformation/` |

---

## 🌟 Key Technical Features

### 1. Studio Lighting, Atmosphere & Reflection Pipeline
- **Studio PBR Pipeline**: Integrated `ACESFilmicToneMapping`, `SRGBColorSpace`, and zero-dependency procedural studio reflections powered by `RoomEnvironment` with `PMREMGenerator`.
- **Balanced 3-Point Studio Rig**: Warm key directional spotlight with `PCFSoftShadowMap` (2048x2048 shadow frustum), cool `HemisphereLight` fill, and an overhead point light generating specular highlights on polished surfaces.
- **Atmospheric Depth**: Deep dark corporate boardroom aesthetic (`#0b0f19`) paired with subtle exponential fog (`FogExp2`).

### 2. Room Architecture & Executive Table
- **Executive Boardroom Table**: Sleek elongated boardroom table stretching along the X axis, crafted in polished obsidian marble with chamfered brass trim (`metalness: 0.9`, `roughness: 0.22`), cantilever pedestal legs, and recessed LED underglow.
- **Polished Ground Plane**: Reflective floor with contact shadow grounding under the table and chairs to prevent floating artifacts.
- **Architectural Backdrop**: Panoramic floor-to-ceiling glass wall overlooking a nighttime metropolitan skyline with architectural pillar accents and suspended linear boardroom luminaire.

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
