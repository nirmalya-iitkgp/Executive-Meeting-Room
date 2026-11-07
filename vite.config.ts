import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, type Plugin } from 'vite';

const executiveModelPlugin: Plugin = {
  name: 'executive-glb-models',
  enforce: 'pre',
  transform(code, id) {
    if (!id.endsWith('/src/main.ts')) return;

    const start = code.indexOf('// Load 8 executives with GLTF or procedural fallback');
    const end = code.indexOf('// 6. UI Controls Binding', start);
    if (start === -1 || end === -1) return;

    const replacement = `// Load the GLB assets from builds/ and use procedural avatars if a model fails.
const MODEL_URLS: Record<number, string> = {
  1: new URL('../builds/blue_blazer_executive.glb', import.meta.url).href,
  2: new URL('../builds/confident_presenter.glb', import.meta.url).href,
  3: new URL('../builds/confident_professional_in_a_grey_blazer.glb', import.meta.url).href,
  4: new URL('../builds/confident_professional_on_the_move.glb', import.meta.url).href,
  5: new URL('../builds/executive_in_a_gray_suit.glb', import.meta.url).href,
  6: new URL('../builds/ivory_steele__corporate_precision.glb', import.meta.url).href,
  7: new URL('../builds/professional_portrait_in_business_casual.glb', import.meta.url).href,
  8: new URL('../builds/urban_gentleman.glb', import.meta.url).href,
};

EXECUTIVE_MEMBERS.forEach((exec) => {
  gltfLoader.load(
    MODEL_URLS[exec.id],
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

    return code.slice(0, start) + replacement + code.slice(end);
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
