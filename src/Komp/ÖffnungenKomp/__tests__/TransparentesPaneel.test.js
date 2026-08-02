import { getTransparentesPaneelGridPosition, getTransparentesPaneelWorldPosition } from '../transparentesPaneelPositionUtils'

describe('transparent panel position helpers', () => {
  it('keeps the transparent panel position in world space when the logical position changes', () => {
    const initialPosition = getTransparentesPaneelWorldPosition({
      nextPos: { x: 2, z: 3, y: 5 },
      lang: true,
      rechts: true,
      surfaceOffset: 0.65,
      xLinks: -9,
      xRechts: 9,
      z: -9
    })

    const updatedPosition = getTransparentesPaneelWorldPosition({
      nextPos: { x: 4, z: 6, y: 7 },
      lang: true,
      rechts: true,
      surfaceOffset: 0.65,
      xLinks: -9,
      xRechts: 9,
      z: -9
    })

    expect(initialPosition).toEqual({ x: 2, y: 5, z: -9.65 })
    expect(updatedPosition).toEqual({ x: 4, y: 7, z: -9.65 })
  })

  it('reads the latest start pos from the object for the render sync path', () => {
    const nextPos = getTransparentesPaneelGridPosition({
      obj: { startPos: { x: 8, z: 9, y: 10 } },
      initialX: 1,
      initialZ: 2,
      initialY: 3
    })

    expect(nextPos).toEqual({ x: 8, z: 9, y: 10 })
  })
})
