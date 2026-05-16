import { memo, useCallback, useMemo } from 'react'
import { Geometry, Base, Subtraction } from '@react-three/csg'

const PANEL_TIEFE = 0.4
const PANEL_HALBE_TIEFE = PANEL_TIEFE / 2
const KANTEN_OFFSET = PANEL_HALBE_TIEFE + 0.02
const KURZE_WAND_KANTEN_OFFSET = PANEL_HALBE_TIEFE + 0.02
const CLIP_EPSILON = 0.0001
const PLATTEN_RENDER_ORDER = 10
const KANTEN_RENDER_ORDER = 11

function haveEqualNumberArrays(left = [], right = []) {
    if (left === right) return true
    if (left.length !== right.length) return false

    for (let index = 0; index < left.length; index++) {
        if (left[index] !== right[index]) {
            return false
        }
    }

    return true
}

function haveEqualOpenings(left = [], right = []) {
    if (left === right) return true
    if (left.length !== right.length) return false

    for (let index = 0; index < left.length; index++) {
        const currentLeft = left[index]
        const currentRight = right[index]

        if (currentLeft?.id !== currentRight?.id) return false
        if (!haveEqualNumberArrays(currentLeft?.position ?? [], currentRight?.position ?? [])) return false
        if (!haveEqualNumberArrays(currentLeft?.size ?? [], currentRight?.size ?? [])) return false
    }

    return true
}

function Platten({
    fragBreite,
    position,
    sockelHöhe,
    lang,
    gebäudeHöhe,
    öffnungen = [],
    oberflächenAnzeigen = true,
    plattenAnzeigen = true,
    kantenAnzeigen = true,
    nurHorizontaleKanten = false,
    startKanteAnzeigen = true,
    endKanteAnzeigen = true,
    obereKanteAnzeigen = true,
    untereKanteAnzeigen = true,
    linienDicke,
    color = 'white'
}) {

    const openingProjektionen = useMemo(() => öffnungen.map((öffnung) => {
        const localX = öffnung.position[0] - position[0]
        const localY = öffnung.position[1] - position[1]
        const localZ = öffnung.position[2] - position[2]

        if (lang) {
            return {
                minU: localX - (öffnung.size[0] / 2),
                maxU: localX + (öffnung.size[0] / 2),
                minY: localY - (öffnung.size[1] / 2),
                maxY: localY + (öffnung.size[1] / 2)
            }
        }

        return {
            minU: localZ - (öffnung.size[2] / 2),
            maxU: localZ + (öffnung.size[2] / 2),
            minY: localY - (öffnung.size[1] / 2),
            maxY: localY + (öffnung.size[1] / 2)
        }
    }), [öffnungen, position, lang])

    const subtractIntervals = (baseStart, baseEnd, intervals) => {
        const clipped = intervals
            .map(([start, end]) => [Math.max(baseStart, start), Math.min(baseEnd, end)])
            .filter(([start, end]) => end - start > CLIP_EPSILON)
            .sort((left, right) => left[0] - right[0])

        if (clipped.length === 0) {
            return [[baseStart, baseEnd]]
        }

        const result = []
        let current = baseStart

        clipped.forEach(([start, end]) => {
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

    const buildHorizontalSegments = useCallback((lineY, halfBreite) => {
        const intervals = openingProjektionen
            .filter((öffnung) => lineY >= öffnung.minY - CLIP_EPSILON && lineY <= öffnung.maxY + CLIP_EPSILON)
            .map((öffnung) => [öffnung.minU, öffnung.maxU])

        return subtractIntervals(-halfBreite, halfBreite, intervals)
    }, [openingProjektionen])

    const buildVerticalSegments = useCallback((lineU, halbeHöhe) => {
        const intervals = openingProjektionen
            .filter((öffnung) => lineU >= öffnung.minU - CLIP_EPSILON && lineU <= öffnung.maxU + CLIP_EPSILON)
            .map((öffnung) => [öffnung.minY, öffnung.maxY])

        return subtractIntervals(-halbeHöhe, halbeHöhe, intervals)
    }, [openingProjektionen])

    const kantenSegmente = useMemo(() => {
        if (!kantenAnzeigen) return []

        const halbeHöhe = gebäudeHöhe / 2
        const halbeBreite = fragBreite / 2
        const faceOffsets = lang
            ? [-KANTEN_OFFSET, KANTEN_OFFSET]
            : [-KURZE_WAND_KANTEN_OFFSET, KURZE_WAND_KANTEN_OFFSET]

        return faceOffsets.map((faceOffset) => {
            const positions = []

            if (obereKanteAnzeigen) {
                buildHorizontalSegments(halbeHöhe, halbeBreite).forEach(([start, end]) => {
                    if (lang) {
                        positions.push(start, halbeHöhe, faceOffset, end, halbeHöhe, faceOffset)
                    } else {
                        positions.push(faceOffset, halbeHöhe, start, faceOffset, halbeHöhe, end)
                    }
                })
            }

            if (untereKanteAnzeigen) {
                buildHorizontalSegments(-halbeHöhe, halbeBreite).forEach(([start, end]) => {
                    if (lang) {
                        positions.push(start, -halbeHöhe, faceOffset, end, -halbeHöhe, faceOffset)
                    } else {
                        positions.push(faceOffset, -halbeHöhe, start, faceOffset, -halbeHöhe, end)
                    }
                })
            }

            if (!nurHorizontaleKanten) {
                if (startKanteAnzeigen) {
                    buildVerticalSegments(-halbeBreite, halbeHöhe).forEach(([start, end]) => {
                        if (lang) {
                            positions.push(-halbeBreite, start, faceOffset, -halbeBreite, end, faceOffset)
                        } else {
                            positions.push(faceOffset, start, -halbeBreite, faceOffset, end, -halbeBreite)
                        }
                    })
                }

                if (endKanteAnzeigen) {
                    buildVerticalSegments(halbeBreite, halbeHöhe).forEach(([start, end]) => {
                        if (lang) {
                            positions.push(halbeBreite, start, faceOffset, halbeBreite, end, faceOffset)
                        } else {
                            positions.push(faceOffset, start, halbeBreite, faceOffset, end, halbeBreite)
                        }
                    })
                }
            }

            return positions
        })
    }, [buildHorizontalSegments, buildVerticalSegments, fragBreite, gebäudeHöhe, kantenAnzeigen, lang, obereKanteAnzeigen, untereKanteAnzeigen, nurHorizontaleKanten, startKanteAnzeigen, endKanteAnzeigen])

    const platteGröße = useMemo(() => (
        lang ? [fragBreite, gebäudeHöhe, PANEL_TIEFE] : [PANEL_TIEFE, gebäudeHöhe, fragBreite]
    ), [fragBreite, gebäudeHöhe, lang])

    const lokaleÖffnungen = useMemo(() => öffnungen.map((öffnung) => ({
        id: öffnung.id,
        position: [
            öffnung.position[0] - position[0],
            öffnung.position[1] - position[1],
            öffnung.position[2] - position[2]
        ],
        size: öffnung.size
    })), [öffnungen, position])

    const renderPlatteMitCSG = (größe) => {
        if (öffnungen.length === 0) {
            return (
                <mesh position={position} renderOrder={PLATTEN_RENDER_ORDER}>
                    <boxGeometry args={größe} />
                    <meshStandardMaterial color={color} polygonOffset polygonOffsetFactor={1} polygonOffsetUnits={1} />
                </mesh>
            )
        }

        return (
            <>
            <mesh position={position} renderOrder={PLATTEN_RENDER_ORDER}>
                <Geometry>
                    <Base>
                        <boxGeometry args={größe} />
                    </Base>
                    {lokaleÖffnungen.map((öffnung) => (
                        <Subtraction
                            key={öffnung.id}
                            position={öffnung.position}
                        >
                            <boxGeometry args={öffnung.size} />
                        </Subtraction>
                    ))}
                </Geometry>
                <meshStandardMaterial color={color} polygonOffset polygonOffsetFactor={1} polygonOffsetUnits={1} />
            </mesh>
            </>
        )
    }

    if (!plattenAnzeigen) return null

    return(
        <>
            {lang === true && (
                <group>
                    {oberflächenAnzeigen && (
                        renderPlatteMitCSG(platteGröße)
                    )}
                    {kantenSegmente.map((segmentDaten, faceIndex) => segmentDaten.length > 0 ? (
                        <lineSegments key={`platte-kanten-${faceIndex}`} position={position} renderOrder={KANTEN_RENDER_ORDER}>
                            <bufferGeometry>
                                <bufferAttribute attach="attributes-position" args={[new Float32Array(segmentDaten), 3]} />
                            </bufferGeometry>
                            <lineBasicMaterial color="black" linewidth={linienDicke} depthWrite={false} />
                        </lineSegments>
                    ) : null)}
                </group>
            )}
            {lang === false && (
                <group>
                    {oberflächenAnzeigen && (
                        renderPlatteMitCSG(platteGröße)
                    )}
                    {kantenSegmente.map((segmentDaten, faceIndex) => segmentDaten.length > 0 ? (
                        <lineSegments key={`platte-kanten-${faceIndex}`} position={position} renderOrder={KANTEN_RENDER_ORDER}>
                            <bufferGeometry>
                                <bufferAttribute attach="attributes-position" args={[new Float32Array(segmentDaten), 3]} />
                            </bufferGeometry>
                            <lineBasicMaterial color="black" linewidth={linienDicke} depthWrite={false} />
                        </lineSegments>
                    ) : null)}
                </group>
            )}
        </>
    )
}

export default memo(Platten, (prevProps, nextProps) => {
    return prevProps.fragBreite === nextProps.fragBreite
        && prevProps.sockelHöhe === nextProps.sockelHöhe
        && prevProps.lang === nextProps.lang
        && prevProps.gebäudeHöhe === nextProps.gebäudeHöhe
        && prevProps.oberflächenAnzeigen === nextProps.oberflächenAnzeigen
        && prevProps.plattenAnzeigen === nextProps.plattenAnzeigen
        && prevProps.kantenAnzeigen === nextProps.kantenAnzeigen
        && prevProps.nurHorizontaleKanten === nextProps.nurHorizontaleKanten
        && prevProps.startKanteAnzeigen === nextProps.startKanteAnzeigen
        && prevProps.endKanteAnzeigen === nextProps.endKanteAnzeigen
        && prevProps.obereKanteAnzeigen === nextProps.obereKanteAnzeigen
        && prevProps.untereKanteAnzeigen === nextProps.untereKanteAnzeigen
        && prevProps.linienDicke === nextProps.linienDicke
        && prevProps.color === nextProps.color
        && haveEqualNumberArrays(prevProps.position, nextProps.position)
        && haveEqualOpenings(prevProps.öffnungen, nextProps.öffnungen)
})
