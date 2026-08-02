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
  hiddenObjectNames?: string[];
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
const MAX_SNAPSHOT_VIEWS = 6;
const SNAPSHOT_MIN_WIDTH = 960;
const SNAPSHOT_MIN_HEIGHT = 540;
const SNAPSHOT_MAX_WIDTH = 1920;
const SNAPSHOT_MAX_HEIGHT = 1080;
const SNAPSHOT_MAX_PIXELS_PER_VIEW = 2_073_600; // 1920*1080
const SNAPSHOT_CAPTURE_TIMEOUT_MS = 8_000;
const REFERENCE_HALL_DIMENSIONS = {
  width: 30,
  length: 70,
  height: 6,
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function limitSnapshotDimensions(requestedWidth: number, requestedHeight: number) {
  let safeWidth = clamp(Math.round(requestedWidth), SNAPSHOT_MIN_WIDTH, SNAPSHOT_MAX_WIDTH);
  let safeHeight = clamp(Math.round(requestedHeight), SNAPSHOT_MIN_HEIGHT, SNAPSHOT_MAX_HEIGHT);

  const area = safeWidth * safeHeight;
  if (area > SNAPSHOT_MAX_PIXELS_PER_VIEW) {
    const scale = Math.sqrt(SNAPSHOT_MAX_PIXELS_PER_VIEW / area);
    safeWidth = Math.max(SNAPSHOT_MIN_WIDTH, Math.round(safeWidth * scale));
    safeHeight = Math.max(SNAPSHOT_MIN_HEIGHT, Math.round(safeHeight * scale));
  }

  return { width: safeWidth, height: safeHeight };
}

function createCaptureDeadline(timeoutMs: number) {
  let expired = false;
  const timer = window.setTimeout(() => {
    expired = true;
  }, timeoutMs);

  return {
    isExpired: () => expired,
    throwIfExpired: (message: string) => {
      if (expired) {
        throw new Error(message);
      }
    },
    clear: () => {
      window.clearTimeout(timer);
    },
  };
}

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
    hiddenObjectNames = ['product-snapshot-clouds-root'],
    width = Math.max(1600, Math.round(size.width || 1600)),
    height = Math.max(900, Math.round(size.height || 900)),
    hallWidthMeters = REFERENCE_HALL_DIMENSIONS.width,
    hallLengthMeters = REFERENCE_HALL_DIMENSIONS.length,
    hallHeightMeters = REFERENCE_HALL_DIMENSIONS.height,
  } = options;
  const safeDimensions = limitSnapshotDimensions(width, height);
  const captureViews = SNAPSHOT_VIEWS.slice(0, MAX_SNAPSHOT_VIEWS);

  return useCallback(async (): Promise<ProductSnapshot[]> => {
    const snapshotRoot = scene.getObjectByName(rootObjectName) ?? scene;
    const hiddenObjects = hiddenObjectNames
      .map((objectName) => scene.getObjectByName(objectName))
      .filter((object): object is THREE.Object3D => object !== undefined);
    const previousHiddenVisibilities = hiddenObjects.map((object) => object.visible);
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

    const snapshotCamera = new THREE.PerspectiveCamera(
      SNAPSHOT_CAMERA_FOV,
      safeDimensions.width / safeDimensions.height,
      0.1,
      5000
    );
    const renderTarget = new THREE.WebGLRenderTarget(safeDimensions.width, safeDimensions.height, {
      depthBuffer: true,
      stencilBuffer: false,
      generateMipmaps: false,
    });
    const previousTarget = gl.getRenderTarget();
    const previousXrEnabled = gl.xr.enabled;
    const snapshots: ProductSnapshot[] = [];

    try {
      gl.xr.enabled = false;

      hiddenObjects.forEach((object) => {
        object.visible = false;
      });
      await waitForFrame();

      for (const view of captureViews) {
        const deadline = createCaptureDeadline(SNAPSHOT_CAPTURE_TIMEOUT_MS);

        try {
          // Wir rendern jede technische Perspektive mit einer separaten Kamera,
          // damit OrbitControls und die sichtbare UI-Kamera unberührt bleiben.
          fitCameraToObject(snapshotCamera, bounds, view.direction, proportionalScale, view.up);
          await waitForFrame();
          deadline.throwIfExpired(`Snapshot für ${view.name} wurde wegen Zeitüberschreitung abgebrochen.`);

          gl.setRenderTarget(renderTarget);
          gl.clear(true, true, true);
          gl.render(scene, snapshotCamera);
          deadline.throwIfExpired(`Snapshot für ${view.name} wurde wegen Zeitüberschreitung abgebrochen.`);

          const pixels = new Uint8Array(safeDimensions.width * safeDimensions.height * 4);
          gl.readRenderTargetPixels(renderTarget, 0, 0, safeDimensions.width, safeDimensions.height, pixels);
          deadline.throwIfExpired(`Snapshot für ${view.name} wurde wegen Zeitüberschreitung abgebrochen.`);
          const snapshotImage = buildDataUrlFromPixels(pixels, safeDimensions.width, safeDimensions.height);

          snapshots.push({
            name: view.name,
            image: snapshotImage,
          });
        } catch (viewError) {
          if (deadline.isExpired()) {
            console.warn(`Snapshot für ${view.name} wurde aus Stabilitätsgründen übersprungen.`);
          } else {
            console.error(`Snapshot für ${view.name} konnte nicht erzeugt werden.`, viewError);
          }
        } finally {
          deadline.clear();
        }
      }
    } finally {
      hiddenObjects.forEach((object, index) => {
        object.visible = previousHiddenVisibilities[index] ?? true;
      });
      gl.setRenderTarget(previousTarget);
      gl.xr.enabled = previousXrEnabled;

      if (camera) {
        gl.render(scene, camera);
      }

      renderTarget.dispose();
    }

    return snapshots;
  }, [camera, captureViews, gl, hallHeightMeters, hallLengthMeters, hallWidthMeters, hiddenObjectNames, rootObjectName, safeDimensions.height, safeDimensions.width, scene]);
}