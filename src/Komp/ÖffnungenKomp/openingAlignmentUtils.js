import { OPENING_POSITION_REFRESH_EVENT, OPENING_POSITION_VALUES_EVENT } from './PositionInfoSection'

const SCENE_UNITS_PER_METER = 2.5

function dispatchAlignmentRefresh(detail) {
    const publish = () => {
        window.dispatchEvent(new CustomEvent(OPENING_POSITION_REFRESH_EVENT, {
            detail
        }))
    }

    if (typeof window.setTimeout === 'function') {
        window.setTimeout(publish, 0)
        return
    }

    publish()
}

export function centerOpeningInField({ selectedObject, objs, setObjs, gebäudeHöhe, mode }) {
    const targetId = selectedObject?.id

    if (!targetId || !setObjs) return

    const getFreshObject = (sourceObjs) => (sourceObjs ?? []).find((obj) => String(obj.id) === String(targetId))

    let hasAppliedAlignment = false

    const applyAlignment = (resolvedValues = null) => {
        if (hasAppliedAlignment) return
        hasAppliedAlignment = true

        let nextValueEvent = null
        let alignedStartPos = null

        setObjs(prevObjs => {
            const activeObject = getFreshObject(prevObjs) ?? getFreshObject(objs) ?? selectedObject

            if (!activeObject?.id) return prevObjs

            const currentLinks = Number(resolvedValues?.abstandLinks ?? activeObject?.abstandLinks ?? 0)
            const currentRechts = Number(resolvedValues?.abstandRechts ?? activeObject?.abstandRechts ?? 0)
            const currentUnten = Number(resolvedValues?.abstandUnten ?? activeObject?.abstandUnten ?? 0)
            const openingHeightMeters = Number(activeObject?.value?.[1] ?? 0)

            const centeredHorizontalDistance = (currentLinks + currentRechts) / 2
            const centeredBottomDistance = Math.max(0, ((Number(gebäudeHöhe || 0) - openingHeightMeters) / 2) * SCENE_UNITS_PER_METER)

            nextValueEvent = {
                id: activeObject.id,
                mode,
                abstandLinks: mode === 'horizontal' ? centeredHorizontalDistance : currentLinks,
                abstandRechts: mode === 'horizontal' ? centeredHorizontalDistance : currentRechts,
                abstandUnten: mode === 'vertical' ? centeredBottomDistance : currentUnten,
            }

            return prevObjs.map(obj => {
                if (String(obj.id) !== String(activeObject.id)) return obj

                const nextStartPos = { ...(obj.startPos ?? {}) }
                const isRoofOpening = obj?.type === 'leeröffnung' && obj?.lang === false
                const isRoofComponent = obj?.bereich === 'dach' || obj?.type === 'dach' || isRoofOpening

                if (mode === 'horizontal') {
                    if (isRoofComponent) {
                        nextStartPos.x = (obj.startPos?.x ?? 0) + (centeredHorizontalDistance - currentLinks)
                    } else if (obj?.lang === false) {
                        nextStartPos.z = (obj.startPos?.z ?? 0) + (centeredHorizontalDistance - currentLinks)
                    } else {
                        nextStartPos.x = (obj.startPos?.x ?? 0) + (centeredHorizontalDistance - currentLinks)
                    }
                } else if (mode === 'vertical') {
                    if (isRoofComponent) {
                        nextStartPos.z = (obj.startPos?.z ?? 0) + (centeredBottomDistance - currentUnten)
                    } else {
                        nextStartPos.y = (obj.startPos?.y ?? 0) + (centeredBottomDistance - currentUnten)
                    }
                }

                alignedStartPos = nextStartPos

                return {
                    ...obj,
                    startPos: nextStartPos,
                    abstandLinks: mode === 'horizontal' ? centeredHorizontalDistance : (obj.abstandLinks ?? currentLinks),
                    abstandRechts: mode === 'horizontal' ? centeredHorizontalDistance : (obj.abstandRechts ?? currentRechts),
                    abstandUnten: mode === 'vertical' ? centeredBottomDistance : (obj.abstandUnten ?? currentUnten),
                }
            })
        })

        if (nextValueEvent) {
            window.dispatchEvent(new CustomEvent(OPENING_POSITION_VALUES_EVENT, {
                detail: nextValueEvent
            }))
        }

        dispatchAlignmentRefresh({
            id: targetId,
            mode,
            ...nextValueEvent,
            startPos: alignedStartPos
        })
    }

    const handleResolvedPositionValues = (event) => {
        if (String(event?.detail?.id) !== String(targetId)) return

        window.removeEventListener(OPENING_POSITION_VALUES_EVENT, handleResolvedPositionValues)
        applyAlignment(event?.detail)
    }

    window.addEventListener(OPENING_POSITION_VALUES_EVENT, handleResolvedPositionValues)

    dispatchAlignmentRefresh({ id: targetId, source: 'alignment-refresh' })

    window.setTimeout(() => {
        if (!hasAppliedAlignment) {
            applyAlignment()
        }
    }, 100)
}
