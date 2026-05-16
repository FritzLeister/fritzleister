import { OPENING_POSITION_VALUES_EVENT } from './PositionInfoSection'

export const SCENE_UNITS_PER_METER = 2.5
export const OPENING_GRID_STEP_METERS = 0.25
export const OPENING_GRID_STEP = OPENING_GRID_STEP_METERS * SCENE_UNITS_PER_METER

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

export function updateOpeningStartPos({
    objId,
    setObjs,
    setSelectedObject,
    startPos
}) {
    if (setObjs) {
        setObjs(prevObjs => prevObjs.map(item =>
            item.id === objId
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
            if (!prev || prev.id !== objId) return prev

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
    updateOpeningStartPos({
        objId,
        setObjs,
        setSelectedObject,
        startPos
    })

    if (!distances || Object.keys(distances).length === 0) return

    if (setObjs) {
        setObjs(prevObjs => prevObjs.map(item =>
            item.id === objId
                ? {
                    ...item,
                    ...distances
                }
                : item
        ))
    }

    if (setSelectedObject) {
        setSelectedObject(prev => {
            if (!prev || prev.id !== objId) return prev

            return {
                ...prev,
                ...distances
            }
        })
    }
}