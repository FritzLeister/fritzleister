import { centerOpeningInField } from '../openingAlignmentUtils'
import { OPENING_POSITION_REFRESH_EVENT, OPENING_POSITION_VALUES_EVENT } from '../PositionInfoSection'
import { getWallOpeningStartPos } from '../wallOpeningPositionUtils'

describe('centerOpeningInField', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    global.requestAnimationFrame = (callback) => setTimeout(() => callback(Date.now()), 0)
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
  })

  it('waits for asynchronously refreshed scene distances before centering', () => {
    let currentObjs = [{
      id: 'opening-async',
      type: 'leeröffnung',
      lang: true,
      value: [4, 3],
      startPos: { x: 3, z: 2, y: 4 },
      abstandLinks: 0.4,
      abstandRechts: 0.8,
      abstandUnten: 1.2
    }]

    const setObjs = jest.fn((updater) => {
      currentObjs = typeof updater === 'function' ? updater(currentObjs) : updater
      return currentObjs
    })

    window.addEventListener(OPENING_POSITION_REFRESH_EVENT, (event) => {
      if (event?.detail?.startPos) return

      window.setTimeout(() => {
        currentObjs = currentObjs.map((obj) =>
          obj.id === 'opening-async'
            ? { ...obj, abstandLinks: 1.4, abstandRechts: 2.6, abstandUnten: 0.5 }
            : obj
        )

        window.dispatchEvent(new CustomEvent(OPENING_POSITION_VALUES_EVENT, {
          detail: {
            id: 'opening-async',
            abstandLinks: 1.4,
            abstandRechts: 2.6,
            abstandUnten: 0.5
          }
        }))
      }, 10)
    })

    centerOpeningInField({
      selectedObject: currentObjs[0],
      objs: currentObjs,
      setObjs,
      gebäudeHöhe: 12,
      mode: 'horizontal'
    })

    jest.advanceTimersByTime(9)
    expect(currentObjs[0].abstandLinks).toBe(0.4)

    jest.advanceTimersByTime(20)
    expect(currentObjs[0].abstandLinks).toBeCloseTo(2.0)
    expect(currentObjs[0].abstandRechts).toBeCloseTo(2.0)
    expect(currentObjs[0].startPos.x).toBeCloseTo(3.6)
  })

  it('uses refreshed scene distances before applying centering', () => {
    let currentObjs = [{
      id: 'opening-1',
      type: 'leeröffnung',
      lang: true,
      value: [4, 3],
      startPos: { x: 3, z: 2, y: 4 },
      abstandLinks: 0.4,
      abstandRechts: 0.8,
      abstandUnten: 1.2
    }]

    const setObjs = jest.fn((updater) => {
      currentObjs = typeof updater === 'function' ? updater(currentObjs) : updater
      return currentObjs
    })

    window.addEventListener(OPENING_POSITION_REFRESH_EVENT, (event) => {
      if (event?.detail?.startPos) return

      currentObjs = currentObjs.map((obj) =>
        obj.id === 'opening-1'
          ? { ...obj, abstandLinks: 1.4, abstandRechts: 2.6, abstandUnten: 0.5 }
          : obj
      )
    })

    centerOpeningInField({
      selectedObject: currentObjs[0],
      objs: currentObjs,
      setObjs,
      gebäudeHöhe: 12,
      mode: 'horizontal'
    })

    jest.runAllTimers()

    expect(currentObjs[0].abstandLinks).toBeCloseTo(2.0)
    expect(currentObjs[0].abstandRechts).toBeCloseTo(2.0)
    expect(currentObjs[0].startPos.x).toBeCloseTo(3.6)
  })

  it('applies alignment before notifying components to refresh', () => {
    let currentObjs = [{
      id: 'opening-2',
      type: 'leeröffnung',
      lang: true,
      value: [4, 3],
      startPos: { x: 1, z: 2, y: 4 },
      abstandLinks: 0.0,
      abstandRechts: 2.0,
      abstandUnten: 0.5
    }]

    const setObjs = jest.fn((updater) => {
      currentObjs = typeof updater === 'function' ? updater(currentObjs) : updater
      return currentObjs
    })

    let sawAlignedState = false
    window.addEventListener(OPENING_POSITION_REFRESH_EVENT, (event) => {
      if (event?.detail?.startPos) {
        const alignedObject = currentObjs.find((obj) => obj.id === 'opening-2')
        if (alignedObject?.startPos?.x === 2 && alignedObject?.abstandLinks === 1) {
          sawAlignedState = true
        }
      }
    })

    centerOpeningInField({
      selectedObject: currentObjs[0],
      objs: currentObjs,
      setObjs,
      gebäudeHöhe: 12,
      mode: 'horizontal'
    })

    jest.runAllTimers()

    expect(sawAlignedState).toBe(true)
  })

  it('defers the refresh event until the next tick after the state update', () => {
    let currentObjs = [{
      id: 'opening-batched',
      type: 'leeröffnung',
      lang: true,
      value: [4, 3],
      startPos: { x: 1, z: 2, y: 4 },
      abstandLinks: 0.0,
      abstandRechts: 2.0,
      abstandUnten: 0.5
    }]

    const pendingUpdates = []
    const setObjs = jest.fn((updater) => {
      pendingUpdates.push(updater)
      currentObjs = typeof updater === 'function' ? updater(currentObjs) : updater
      return currentObjs
    })

    let refreshCount = 0
    window.addEventListener(OPENING_POSITION_REFRESH_EVENT, (event) => {
      if (event?.detail?.startPos) {
        refreshCount += 1
      }
    })

    centerOpeningInField({
      selectedObject: currentObjs[0],
      objs: currentObjs,
      setObjs,
      gebäudeHöhe: 12,
      mode: 'horizontal'
    })

    expect(pendingUpdates).toHaveLength(0)
    expect(refreshCount).toBe(0)

    jest.runAllTimers()

    expect(pendingUpdates).toHaveLength(1)
    expect(refreshCount).toBe(1)
    expect(currentObjs[0].startPos.x).toBeCloseTo(2)
    expect(currentObjs[0].abstandLinks).toBe(1)
  })

  it('uses roof-specific axes for dach components', () => {
    let currentObjs = [{
      id: 'roof-panel-1',
      type: 'photovoltaik',
      bereich: 'dach',
      lang: false,
      value: [4, 3],
      startPos: { x: 2, z: 5, y: 4 },
      abstandLinks: 0.8,
      abstandRechts: 1.2,
      abstandUnten: 0.6
    }]

    const setObjs = jest.fn((updater) => {
      currentObjs = typeof updater === 'function' ? updater(currentObjs) : updater
      return currentObjs
    })

    centerOpeningInField({
      selectedObject: currentObjs[0],
      objs: currentObjs,
      setObjs,
      gebäudeHöhe: 12,
      mode: 'horizontal'
    })

    expect(currentObjs[0].startPos.x).toBeCloseTo(2.0)
    expect(currentObjs[0].startPos.z).toBe(5)
  })

  it('keeps transparent paneel alignment in logical coordinates', () => {
    let currentObjs = [{
      id: 'paneel-1',
      type: 'transparentespaneel',
      lang: true,
      rechts: true,
      value: [3, 3],
      startPos: { x: 3, z: 2, y: 4 },
      abstandLinks: 1.2,
      abstandRechts: 2.0,
      abstandUnten: 0.8
    }]

    const setObjs = jest.fn((updater) => {
      currentObjs = typeof updater === 'function' ? updater(currentObjs) : updater
      return currentObjs
    })

    centerOpeningInField({
      selectedObject: currentObjs[0],
      objs: currentObjs,
      setObjs,
      gebäudeHöhe: 12,
      mode: 'horizontal'
    })

    jest.runAllTimers()

    expect(currentObjs[0].abstandLinks).toBeCloseTo(1.6)
    expect(currentObjs[0].abstandRechts).toBeCloseTo(1.6)
    expect(currentObjs[0].startPos.x).toBeCloseTo(3.4)
    expect(currentObjs[0].startPos.z).toBe(2)
  })

  it('maps wall opening drag positions to the shared world coordinates', () => {
    const worldPos = getWallOpeningStartPos({
      nextPos: { x: 6, z: 4, y: 5 },
      lang: true,
      rechts: true,
      xLinks: -3,
      xRechts: 9,
      z: -2
    })

    expect(worldPos).toEqual({ x: 6, y: 5, z: -2 })
  })
})
