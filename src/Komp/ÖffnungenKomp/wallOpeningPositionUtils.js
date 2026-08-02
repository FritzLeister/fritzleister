import { OPENING_POSITION_VALUES_EVENT } from './PositionInfoSection'

export const SCENE_UNITS_PER_METER = 2.5
export const OPENING_GRID_STEP_METERS = 0.25
export const OPENING_GRID_STEP = OPENING_GRID_STEP_METERS * SCENE_UNITS_PER_METER

export function getWallOpeningStartPos({ nextPos, lang, rechts, xLinks, xRechts, z }) {
    return {
        x: lang ? nextPos.x : (rechts ? xLinks : xRechts),
        y: nextPos.y,
        z: lang ? z : nextPos.z
    }
}

export function computeWallSideDistances({ nextPos, lang, xLinks, xRechts, zHinten, zVorne, halfWidth }) {
    const abstandLinksRaw = lang
        ? nextPos.x - (xLinks + halfWidth)
        : nextPos.z - (zHinten + halfWidth)
    const abstandRechtsRaw = lang
        ? (xRechts - halfWidth) - nextPos.x
        : (zVorne - halfWidth) - nextPos.z

    return {
        abstandLinks: Math.max(0, Number(abstandLinksRaw.toFixed(3))),
        abstandRechts: Math.max(0, Number(abstandRechtsRaw.toFixed(3)))
    }
}

export function computeBottomDistance({ nextPos, baseY, halfHeight, offset = 0 }) {
    const abstandUntenRaw = nextPos.y - baseY - halfHeight - offset
    return Math.max(0, Number(abstandUntenRaw.toFixed(3)))
}

export function quantizeOpeningDistance(value) {
    return Math.max(0, Number((Math.round(value / OPENING_GRID_STEP) * OPENING_GRID_STEP).toFixed(3)))
}

export function snapOpeningCoordinate(value, origin, min, max) {
    const clampedValue = Math.max(min, Math.min(max, value))
    const snappedValue = origin + Math.round((clampedValue - origin) / OPENING_GRID_STEP) * OPENING_GRID_STEP
    return Math.max(min, Math.min(max, Number(snappedValue.toFixed(3))))
}

export function dispatchOpeningPositionValues(id, values) {
    window.dispatchEvent(new CustomEvent(OPENING_POSITION_VALUES_EVENT, {
        detail: {
            id,
            ...values
        }
    }))
}

export function resolveOpeningRefreshPosition({ incoming, currentPos, fallbackPos = null }) {
    if (!incoming?.startPos) return null

    const basePos = currentPos ?? fallbackPos ?? {}
    return {
        x: incoming.startPos.x ?? basePos.x,
        z: incoming.startPos.z ?? basePos.z,
        y: incoming.startPos.y ?? basePos.y
    }
}

export function shouldSyncOpeningPositionFromProps({ nextPos, lastSyncedPos }) {
    if (!lastSyncedPos) return true

    const normalize = (value) => {
        const numericValue = Number(value)
        return Number.isFinite(numericValue) ? numericValue : 0
    }

    return (
        normalize(nextPos?.x) !== normalize(lastSyncedPos?.x) ||
        normalize(nextPos?.z) !== normalize(lastSyncedPos?.z) ||
        normalize(nextPos?.y) !== normalize(lastSyncedPos?.y)
    )
}

export function createDeferredStateFlusher({
    requestFrameFn = (callback) => window.requestAnimationFrame(callback),
    cancelFrameFn = (frameId) => window.cancelAnimationFrame(frameId)
} = {}) {
    let frameId = null
    let pendingValue = null
    let pendingCallback = null

    const flushPending = () => {
        const valueToApply = pendingValue
        const callbackToRun = pendingCallback

        pendingValue = null
        pendingCallback = null
        frameId = null

        if (callbackToRun && valueToApply !== null && valueToApply !== undefined) {
            callbackToRun(valueToApply)
        }
    }

    return {
        schedule(value, callback) {
            pendingValue = value
            pendingCallback = callback

            if (frameId === null) {
                frameId = requestFrameFn(flushPending)
            }
        },
        flush(callback) {
            if (frameId !== null) {
                cancelFrameFn(frameId)
                frameId = null
            }

            const valueToApply = pendingValue
            const callbackToRun = callback ?? pendingCallback

            pendingValue = null
            pendingCallback = null

            if (callbackToRun && valueToApply !== null && valueToApply !== undefined) {
                callbackToRun(valueToApply)
            }
        }
    }
}

export function updateOpeningStartPos({
    objId,
    setObjs,
    setSelectedObject,
    startPos
}) {
    const isSameId = (left, right) => String(left) === String(right)

    if (setObjs) {
        setObjs(prevObjs => prevObjs.map(item =>
            isSameId(item.id, objId)
                ? {
                    ...item,
                    startPos: {
                        ...(item.startPos ?? {}),
                        ...startPos
                    }
                }
                : item
        ))
    }

    if (setSelectedObject) {
        setSelectedObject(prev => {
            if (!prev || !isSameId(prev.id, objId)) return prev

            return {
                ...prev,
                startPos: {
                    ...(prev.startPos ?? {}),
                    ...startPos
                }
            }
        })
    }
}

export function persistOpeningPosition({
    objId,
    setObjs,
    setSelectedObject,
    startPos,
    distances = {}
}) {
    const isSameId = (left, right) => String(left) === String(right)

    updateOpeningStartPos({
        objId,
        setObjs,
        setSelectedObject,
        startPos
    })

    if (!distances || Object.keys(distances).length === 0) return

    if (setObjs) {
        setObjs(prevObjs => prevObjs.map(item =>
            isSameId(item.id, objId)
                ? {
                    ...item,
                    ...distances
                }
                : item
        ))
    }

    if (setSelectedObject) {
        setSelectedObject(prev => {
            if (!prev || !isSameId(prev.id, objId)) return prev

            return {
                ...prev,
                ...distances
            }
        })
    }
}