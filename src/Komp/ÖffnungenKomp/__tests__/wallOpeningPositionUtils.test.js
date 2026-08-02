import { createDeferredStateFlusher, resolveOpeningRefreshPosition, shouldSyncOpeningPositionFromProps } from '../wallOpeningPositionUtils'

describe('createDeferredStateFlusher', () => {
  it('coalesces rapid updates into a single flush', () => {
    const callbacks = []
    const requestFrameFn = (callback) => {
      callbacks.push(callback)
      return callbacks.length
    }
    const cancelFrameFn = jest.fn()
    const flusher = createDeferredStateFlusher({ requestFrameFn, cancelFrameFn })
    const received = []

    flusher.schedule('first', (value) => received.push(value))
    flusher.schedule('second', (value) => received.push(value))

    expect(callbacks).toHaveLength(1)
    callbacks[0]()

    expect(received).toEqual(['second'])
  })

  it('flushes the latest pending value immediately', () => {
    const callbacks = []
    const requestFrameFn = (callback) => {
      callbacks.push(callback)
      return callbacks.length
    }
    const cancelFrameFn = jest.fn()
    const flusher = createDeferredStateFlusher({ requestFrameFn, cancelFrameFn })
    const received = []

    flusher.schedule('draft', (value) => received.push(value))
    flusher.flush((value) => received.push(value))

    expect(received).toEqual(['draft'])
    expect(cancelFrameFn).toHaveBeenCalledTimes(1)
  })

  it('does not crash when flushing without a pending value', () => {
    const flusher = createDeferredStateFlusher({
      requestFrameFn: (callback) => 1,
      cancelFrameFn: jest.fn()
    })

    expect(() => flusher.flush(() => {})).not.toThrow()
  })

  it('resolves a fresh position from the shared alignment payload', () => {
    const currentPos = { x: 1, z: 2, y: 3 }
    const incoming = {
      startPos: {
        x: 4,
        z: 5,
        y: 6
      }
    }

    expect(resolveOpeningRefreshPosition({ incoming, currentPos })).toEqual({ x: 4, z: 5, y: 6 })
  })

  it('does not re-sync when the prop snapshot is unchanged', () => {
    expect(shouldSyncOpeningPositionFromProps({
      nextPos: { x: 1, z: 2, y: 3 },
      lastSyncedPos: { x: 1, z: 2, y: 3 }
    })).toBe(false)
  })
})
