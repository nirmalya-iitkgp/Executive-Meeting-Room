import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'node:path';
import { defineConfig, type Plugin } from 'vite';

const executiveModelPlugin: Plugin = {
  name: 'executive-glb-models',
  enforce: 'pre',
  transform(code, id) {
    // Vite may append query parameters (for example, ?import or HTML proxy flags).
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

    // One distinct model per executive, in EXECUTIVE_MEMBERS id order (1–8).
    const modelFiles = [
      'blue_blazer_executive.glb',
      'executive_in_a_gray_suit.glb',
      'confident_presenter.glb',
      'confident_professional_in_a_grey_blazer.glb',
      'professional_portrait_in_business_casual.glb',
      'confident_professional_on_the_move.glb',
      'urban_gentleman.glb',
      'ivory_steele__corporate_precision.glb',
    ];

    if (new Set(modelFiles).size !== modelFiles.length) {
      this.error('Executive GLB model list contains duplicate filenames.');
    }

    const modelEntries = modelFiles.flatMap((filename, index) => {
      if (!existingFiles.has(filename)) {
        this.warn(`GLB model not found in builds/: ${filename}`);
        return [];
      }
      return [`${index + 1}: new URL('../builds/${filename}', import.meta.url).href`];
    });

    const replacement = `// Load the GLB assets from builds/ and use procedural avatars if a model fails.
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
gltfLoader.setDRACOLoader(dracoLoader);

const MODEL_URLS: Record<number, string> = {
  ${modelEntries.join(',\n  ')}
};

EXECUTIVE_MEMBERS.forEach((exec) => {
  const modelUrl = MODEL_URLS[exec.id];
  if (!modelUrl) {
    console.warn(\`No GLB model mapped for executive #\${exec.id} (\${exec.role}); using procedural avatar.\`);
    const avatar = createProceduralExecutiveAvatar(exec);
    scene.add(avatar);
    executiveMeshes.push(avatar);
    return;
  }

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
      console.error(\`Could not load GLB model for \${exec.role}\`, error);
      const avatar = createProceduralExecutiveAvatar(exec);
      scene.add(avatar);
      executiveMeshes.push(avatar);
    }
  );
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
