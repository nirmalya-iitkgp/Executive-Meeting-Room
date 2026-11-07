import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'path';
import { defineConfig, type Plugin } from 'vite';

const executiveModelPlugin: Plugin = {
  name: 'executive-glb-models',
  enforce: 'pre',
  transform(code, id) {
    // Vite may append query parameters (for example, ?import or HTML proxy flags).
    // Normalize the module ID before matching the source file.
    const sourcePath = id.split('?')[0].replaceAll('\\', '/');
    if (!sourcePath.endsWith('/src/main.ts')) return;

    const start = code.indexOf('// Load 8 executives with GLTF or procedural fallback');
    const end = code.indexOf('// 6. UI Controls Binding', start);
    if (start === -1 || end === -1) {
      this.warn(`Could not find executive model loader section in ${sourcePath}; GLB loader patch was not applied.`);
      return;
    }

    const buildsDir = path.resolve(import.meta.dirname, 'builds');
    const existingFiles = new Set(fs.existsSync(buildsDir) ? fs.readdirSync(buildsDir) : []);

    // Only assign URLs for models that actually exist on disk in builds/
    const potentialModels: Record<number, string> = {
      1: 'urban_gentleman.glb',
      2: 'ivory_steele__corporate_precision.glb',
      3: 'blue_blazer_executive.glb',
      4: 'professional_portrait_in_business_casual.glb',
      5: 'blue_blazer_executive.glb',
      6: 'ivory_steele__corporate_precision.glb',
      7: 'urban_gentleman.glb',
      8: 'professional_portrait_in_business_casual.glb',
    };

    const modelEntries: string[] = [];
    for (const [memberId, filename] of Object.entries(potentialModels)) {
      if (existingFiles.has(filename)) {
        modelEntries.push(`${memberId}: new URL('../builds/${filename}', import.meta.url).href`);
      }
    }

    const replacement = `// Load the GLB assets from builds/ and use procedural avatars if a model fails.
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
gltfLoader.setDRACOLoader(dracoLoader);

const MODEL_URLS: Record<number, string> = {
  ${modelEntries.join(',\n  ')}
};

EXECUTIVE_MEMBERS.forEach((exec) => {
  const modelUrl = MODEL_URLS[exec.id];
  if (modelUrl) {
    gltfLoader.load(
      modelUrl,
      (gltf) => {
        const model = gltf.scene;
        const initialBounds = new THREE.Box3().setFromObject(model);
        const modelHeight = initialBounds.getSize(new THREE.Vector3()).y;

        // Normalize model height, then place its lowest point on the floor.
        if (modelHeight > 0) model.scale.setScalar(1.8 / modelHeight);
        model.updateMatrixWorld(true);
        const bounds = new THREE.Box3().setFromObject(model);
        const center = bounds.getCenter(new THREE.Vector3());
        model.position.set(-center.x, -bounds.min.y, 0);

        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            child.castShadow = !isSoftwareGl;
            child.receiveShadow = !isSoftwareGl;
          }
        });

        const executiveGroup = new THREE.Group();
        executiveGroup.position.set(exec.xPosition, 0, -0.75);
        executiveGroup.userData = { member: exec, targetScale: 1.0, hoverScale: 1.0 };
        executiveGroup.add(model);
        scene.add(executiveGroup);
        executiveMeshes.push(executiveGroup);
        interactiveRaycastTargets.push(executiveGroup);
      },
      undefined,
      (error) => {
        console.warn(\`Could not load GLB model for \${exec.role}, falling back to avatar:\`, error);
        const avatar = createProceduralExecutiveAvatar(exec);
        scene.add(avatar);
        executiveMeshes.push(avatar);
      }
    );
  } else {
    // Clean procedural avatar fallback for positions without GLB files
    const avatar = createProceduralExecutiveAvatar(exec);
    scene.add(avatar);
    executiveMeshes.push(avatar);
  }
});

`;

    const transformed = code.slice(0, start) + replacement + code.slice(end);
    return `import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';\n${transformed}`;
  },
};

export default defineConfig(() => {
  return {
    base: process.env.NODE_ENV === 'production' ? '/Executive-Meeting-Room/' : '/',
    plugins: [executiveModelPlugin, react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
