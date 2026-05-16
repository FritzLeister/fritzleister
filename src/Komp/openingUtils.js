const CLIP_EPSILON = 0.0001

const AXIS_INDEX = {
    x: 0,
    y: 1,
    z: 2,
}

const rangesOverlap = (minA, maxA, minB, maxB) => (
    minA <= maxB - CLIP_EPSILON && maxA >= minB + CLIP_EPSILON
)

const getBounds = (position, size) => ({
    minX: position[0] - (size[0] / 2),
    maxX: position[0] + (size[0] / 2),
    minY: position[1] - (size[1] / 2),
    maxY: position[1] + (size[1] / 2),
    minZ: position[2] - (size[2] / 2),
    maxZ: position[2] + (size[2] / 2),
})

const subtractIntervals = (baseStart, baseEnd, intervals) => {
    if (intervals.length === 0) {
        return [[baseStart, baseEnd]]
    }

    const result = []
    let current = baseStart

    intervals.forEach(([start, end]) => {
        if (start > current + CLIP_EPSILON) {
            result.push([current, start])
        }
        current = Math.max(current, end)
    })

    if (current < baseEnd - CLIP_EPSILON) {
        result.push([current, baseEnd])
    }

    return result
}

export function getVisibleBoxSegments(position, size, openingVolumes, axis) {
    const axisIndex = AXIS_INDEX[axis]

    if (axisIndex === undefined) {
        return [{ position, size }]
    }

    const bounds = getBounds(position, size)
    const axisNames = ['x', 'y', 'z']
    const primaryAxis = axisNames[axisIndex]
    const secondaryAxes = axisNames.filter((_, index) => index !== axisIndex)

    const intervals = openingVolumes
        .filter((opening) => {
            const openingBounds = getBounds(opening.position, opening.size)

            return secondaryAxes.every((secondaryAxis) => {
                const boxMin = bounds[`min${secondaryAxis.toUpperCase()}`]
                const boxMax = bounds[`max${secondaryAxis.toUpperCase()}`]
                const openingMin = openingBounds[`min${secondaryAxis.toUpperCase()}`]
                const openingMax = openingBounds[`max${secondaryAxis.toUpperCase()}`]

                return rangesOverlap(boxMin, boxMax, openingMin, openingMax)
            })
        })
        .map((opening) => {
            const openingBounds = getBounds(opening.position, opening.size)
            const clippedStart = Math.max(
                bounds[`min${primaryAxis.toUpperCase()}`],
                openingBounds[`min${primaryAxis.toUpperCase()}`]
            )
            const clippedEnd = Math.min(
                bounds[`max${primaryAxis.toUpperCase()}`],
                openingBounds[`max${primaryAxis.toUpperCase()}`]
            )

            return [clippedStart, clippedEnd]
        })
        .filter(([start, end]) => end - start > CLIP_EPSILON)
        .sort((left, right) => left[0] - right[0])

    return subtractIntervals(
        bounds[`min${primaryAxis.toUpperCase()}`],
        bounds[`max${primaryAxis.toUpperCase()}`],
        intervals
    ).map(([start, end]) => {
        const segmentPosition = [...position]
        const segmentSize = [...size]
        segmentPosition[axisIndex] = (start + end) / 2
        segmentSize[axisIndex] = end - start

        return {
            position: segmentPosition,
            size: segmentSize,
        }
    })
}

export function getWallOpeningVolumes({
    objs,
    x,
    z,
    koordinateY,
    gebäudeHöhe,
    sockelHöhe,
    bodenLänge,
    bodenBreite,
}) {
    const xLinks = x - 9 - (0.5 * (bodenLänge - 20))
    const xRechts = x + 9 + (0.5 * (bodenLänge - 20))
    const zVorne = z + 6.5 + (0.5 * (bodenBreite - 15))
    const zHinten = z - 6.5 - (0.5 * (bodenBreite - 15))

    const getDefaultFensterWorldY = (fensterHöheEinheit = 6) => {
        const initialGridY = koordinateY
            + (gebäudeHöhe / 6)
            - 0.4
            - ((gebäudeHöhe - 15) / 6)
            - 2
            + ((fensterHöheEinheit - 1) / 4)

        return initialGridY + 4
    }

    const mapWallOpening = (obj, index, type) => {
        const istLangeWand = obj?.lang ?? true
        const istRechts = obj?.rechts ?? true
        const xWertKurzeWand = istRechts ? xLinks - 1 : xRechts + 1
        const zWertLangeWand = istRechts ? zHinten - 1 : zVorne + 1

        if (type === 'leeröffnung') {
            const öffnungsBreite = (obj?.value?.[0] ?? 12) * 2.5
            const öffnungsHöhe = (obj?.value?.[1] ?? 8) * 2.5

            return {
                id: `leer-${obj.id ?? index}`,
                position: istLangeWand
                    ? [obj?.startPos?.x ?? x, obj?.startPos?.y ?? (koordinateY + öffnungsHöhe / 2), zWertLangeWand]
                    : [xWertKurzeWand, obj?.startPos?.y ?? (koordinateY + öffnungsHöhe / 2), obj?.startPos?.z ?? z],
                size: istLangeWand
                    ? [öffnungsBreite, öffnungsHöhe, 1.4]
                    : [1.4, öffnungsHöhe, öffnungsBreite],
            }
        }

        if (type === 'fenster') {
            const fensterHöheEinheit = obj?.value?.[1] ?? 6
            const öffnungsBreite = (obj?.value?.[0] ?? 8) * 2.5
            const öffnungsHöhe = fensterHöheEinheit * 2.5
            const worldY = obj?.startPos?.y !== undefined
                ? obj.startPos.y + 4
                : getDefaultFensterWorldY(fensterHöheEinheit)

            return {
                id: `fenster-${obj.id ?? index}`,
                position: istLangeWand
                    ? [obj?.startPos?.x ?? x, worldY, zWertLangeWand]
                    : [xWertKurzeWand, worldY, obj?.startPos?.z ?? z],
                size: istLangeWand
                    ? [öffnungsBreite, öffnungsHöhe, 1.4]
                    : [1.4, öffnungsHöhe, öffnungsBreite],
            }
        }

        const öffnungsBreite = (obj?.value?.[0] ?? 3) * 2.5
        const öffnungsHöhe = (obj?.value?.[1] ?? 3) * 2.5
        const worldY = obj?.startPos?.y !== undefined
            ? obj.startPos.y
            : koordinateY + sockelHöhe + (öffnungsHöhe / 2)

        return {
            id: `paneel-${obj.id ?? index}`,
            position: istLangeWand
                ? [obj?.startPos?.x ?? x, worldY, zWertLangeWand]
                : [xWertKurzeWand, worldY, obj?.startPos?.z ?? z],
            size: istLangeWand
                ? [öffnungsBreite, öffnungsHöhe, 1.4]
                : [1.4, öffnungsHöhe, öffnungsBreite],
        }
    }

    const wandRelevanteObjekte = (objs || []).filter((obj) => {
        if (obj.type === 'leeröffnung') {
            return obj.bereich === 'wand' || obj.bereich === undefined
        }

        if (obj.type === 'fenster') {
            return true
        }

        if (obj.type === 'transparentespaneel') {
            return obj.bereich === 'wand' || obj.bereich === undefined
        }

        return false
    })

    return wandRelevanteObjekte.map((obj, index) => mapWallOpening(obj, index, obj.type))
}

export function getWallOpeningSightVolumes({
    wallOpeningVolumes,
    x,
    z,
    bodenLänge,
    bodenBreite,
}) {
    const tunnelTiefeX = bodenLänge + 4
    const tunnelTiefeZ = bodenBreite + 4

    return wallOpeningVolumes.map((opening) => {
        const istLangeWand = opening.size[0] > opening.size[2]

        return {
            id: `${opening.id}-sichtkanal`,
            position: istLangeWand
                ? [opening.position[0], opening.position[1], z]
                : [x, opening.position[1], opening.position[2]],
            size: istLangeWand
                ? [opening.size[0], opening.size[1], tunnelTiefeZ]
                : [tunnelTiefeX, opening.size[1], opening.size[2]],
        }
    })
}

export function boxIntersectsAnyOpening(position, size, openingVolumes) {
    const bounds = getBounds(position, size)

    return openingVolumes.some((opening) => {
        const openingBounds = getBounds(opening.position, opening.size)

        return (
            rangesOverlap(bounds.minX, bounds.maxX, openingBounds.minX, openingBounds.maxX) &&
            rangesOverlap(bounds.minY, bounds.maxY, openingBounds.minY, openingBounds.maxY) &&
            rangesOverlap(bounds.minZ, bounds.maxZ, openingBounds.minZ, openingBounds.maxZ)
        )
    })
}