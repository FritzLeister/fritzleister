import { useThree } from '@react-three/fiber';
import { useCallback } from 'react';
import * as THREE from 'three';
import type { ProductSnapshot } from '../utils/productSnapshotRegistry';

type SnapshotView = {
  name: ProductSnapshot['name'];
  direction: THREE.Vector3;
  up?: THREE.Vector3;
};

type UseProductSnapshotsOptions = {
  rootObjectName?: string;
  width?: number;
  height?: number;
  hallWidthMeters?: number;
  hallLengthMeters?: number;
  hallHeightMeters?: number;
};

const SNAPSHOT_VIEWS: SnapshotView[] = [
  { name: 'Front', direction: new THREE.Vector3(0, 0, 1) },
  { name: 'Left', direction: new THREE.Vector3(-1, 0, 0) },
  { name: 'Right', direction: new THREE.Vector3(1, 0, 0) },
  { name: 'Top', direction: new THREE.Vector3(0, 1, 0), up: new THREE.Vector3(0, 0, -1) },
  { name: 'Back', direction: new THREE.Vector3(0, 0, -1) },
  { name: 'Isometric', direction: new THREE.Vector3(1, 1, 1) },
];

const SNAPSHOT_CAMERA_FOV = 13;
const SNAPSHOT_DISTANCE_MULTIPLIER = 0.3;
const SNAPSHOT_MIN_DISTANCE = 0.35;
const REFERENCE_HALL_DIMENSIONS = {
  width: 30,
  length: 70,
  height: 6,
};

function waitForFrame() {
  return new Promise<void>((resolve) => {
    requestAnimationFrame(() => resolve());
  });
}

function buildDataUrlFromPixels(pixels: Uint8Array, width: number, height: number) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error('Canvas 2D context konnte nicht erzeugt werden.');
  }

  const rowSize = width * 4;
  const flippedPixels = new Uint8ClampedArray(pixels.length);

  for (let y = 0; y < height; y += 1) {
    const sourceOffset = y * rowSize;
    const targetOffset = (height - y - 1) * rowSize;
    flippedPixels.set(pixels.subarray(sourceOffset, sourceOffset + rowSize), targetOffset);
  }

  context.putImageData(new ImageData(flippedPixels, width, height), 0, 0);
  return canvas.toDataURL('image/png');
}

function fitCameraToObject(
  snapshotCamera: THREE.PerspectiveCamera,
  bounds: THREE.Box3,
  direction: THREE.Vector3,
  proportionalScale: number,
  up?: THREE.Vector3
) {
  const center = bounds.getCenter(new THREE.Vector3());
  const size = bounds.getSize(new THREE.Vector3());
  const distanceForHeight = size.y / (2 * Math.tan(THREE.MathUtils.degToRad(snapshotCamera.fov / 2)));
  const distanceForWidth = size.x / (2 * Math.tan(THREE.MathUtils.degToRad(snapshotCamera.fov / 2))) / snapshotCamera.aspect;
  const requiredFitDistance = Math.max(distanceForHeight, distanceForWidth);
  const distance = Math.max(
    requiredFitDistance * SNAPSHOT_DISTANCE_MULTIPLIER * proportionalScale,
    SNAPSHOT_MIN_DISTANCE * proportionalScale
  );

  snapshotCamera.position.copy(center.clone().add(direction.clone().normalize().multiplyScalar(distance)));
  snapshotCamera.up.copy(up ?? new THREE.Vector3(0, 1, 0));
  snapshotCamera.near = Math.max(0.1, distance / 100);
  snapshotCamera.far = distance * 20;
  snapshotCamera.lookAt(center);
  snapshotCamera.updateProjectionMatrix();
}

export function useProductSnapshots(options: UseProductSnapshotsOptions = {}) {
  const { gl, scene, camera, size } = useThree();
  const {
    rootObjectName = 'product-snapshot-root',
    width = Math.max(1600, Math.round(size.width || 1600)),
    height = Math.max(900, Math.round(size.height || 900)),
    hallWidthMeters = REFERENCE_HALL_DIMENSIONS.width,
    hallLengthMeters = REFERENCE_HALL_DIMENSIONS.length,
    hallHeightMeters = REFERENCE_HALL_DIMENSIONS.height,
  } = options;

  return useCallback(async (): Promise<ProductSnapshot[]> => {
    const snapshotRoot = scene.getObjectByName(rootObjectName) ?? scene;
    const bounds = new THREE.Box3().setFromObject(snapshotRoot);

    if (bounds.isEmpty()) {
      console.warn('Snapshot-Erstellung übersprungen: Kein sichtbares Produktmodell gefunden.');
      return [];
    }

    const proportionalScale = Math.max(
      hallWidthMeters / REFERENCE_HALL_DIMENSIONS.width,
      hallLengthMeters / REFERENCE_HALL_DIMENSIONS.length,
      hallHeightMeters / REFERENCE_HALL_DIMENSIONS.height,
      0.35
    );

    const snapshotCamera = new THREE.PerspectiveCamera(SNAPSHOT_CAMERA_FOV, width / height, 0.1, 5000);
    const renderTarget = new THREE.WebGLRenderTarget(width, height, {
      depthBuffer: true,
      stencilBuffer: false,
      generateMipmaps: false,
    });
    const previousTarget = gl.getRenderTarget();
    const previousXrEnabled = gl.xr.enabled;
    const snapshots: ProductSnapshot[] = [];

    try {
      gl.xr.enabled = false;

      for (const view of SNAPSHOT_VIEWS) {
        try {
          // Wir rendern jede technische Perspektive mit einer separaten Kamera,
          // damit OrbitControls und die sichtbare UI-Kamera unberührt bleiben.
          fitCameraToObject(snapshotCamera, bounds, view.direction, proportionalScale, view.up);
          await waitForFrame();

          gl.setRenderTarget(renderTarget);
          gl.clear(true, true, true);
          gl.render(scene, snapshotCamera);

          const pixels = new Uint8Array(width * height * 4);
          gl.readRenderTargetPixels(renderTarget, 0, 0, width, height, pixels);

          snapshots.push({
            name: view.name,
            image: buildDataUrlFromPixels(pixels, width, height),
          });
        } catch (viewError) {
          console.error(`Snapshot für ${view.name} konnte nicht erzeugt werden.`, viewError);

          try {
            // Fallback: direkter Canvas-Export, falls das RenderTarget in einer Umgebung nicht lesbar ist.
            gl.setRenderTarget(null);
            gl.render(scene, snapshotCamera);

            snapshots.push({
              name: view.name,
              image: gl.domElement.toDataURL('image/png'),
            });
          } catch (fallbackError) {
            console.error(`Fallback-Snapshot für ${view.name} ist ebenfalls fehlgeschlagen.`, fallbackError);
          }
        }
      }
    } finally {
      gl.setRenderTarget(previousTarget);
      gl.xr.enabled = previousXrEnabled;

      if (camera) {
        gl.render(scene, camera);
      }

      renderTarget.dispose();
    }

    return snapshots;
  }, [camera, gl, hallHeightMeters, hallLengthMeters, hallWidthMeters, height, rootObjectName, scene, width]);
}