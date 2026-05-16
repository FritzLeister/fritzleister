export type ProductSnapshot = {
  name: string;
  image: string;
};

export type ProductSnapshotCapture = () => Promise<ProductSnapshot[]>;

let activeSnapshotCapture: ProductSnapshotCapture | null = null;

export function registerProductSnapshotCapture(capture: ProductSnapshotCapture | null) {
  activeSnapshotCapture = capture;
}

export async function captureRegisteredProductSnapshots(): Promise<ProductSnapshot[]> {
  if (!activeSnapshotCapture) {
    return [];
  }

  return activeSnapshotCapture();
}