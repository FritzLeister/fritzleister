
import { Geometry, Base, Subtraction } from '@react-three/csg'

export default function Platten({
    fragBreite,
    position,
    key,
    sockelHöhe,
    lang,
    gebäudeHöhe,
    öffnungen = [],
    oberflächenAnzeigen = true,
    plattenAnzeigen = true,
    kantenAnzeigen = true,
    nurHorizontaleKanten = false,
    linienDicke = 1,
    color = 'white'
}) {

    if (!plattenAnzeigen) return null;

    const PANEL_TIEFE = 0.4
    const PANEL_HALBE_TIEFE = PANEL_TIEFE / 2
    const KANTEN_OFFSET = PANEL_HALBE_TIEFE + 0.001
    const CLIP_EPSILON = 0.0001

    const openingProjektionen = öffnungen.map((öffnung) => {
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
    })

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

    const buildHorizontalSegments = (lineY, halfBreite) => {
        const intervals = openingProjektionen
            .filter((öffnung) => lineY >= öffnung.minY - CLIP_EPSILON && lineY <= öffnung.maxY + CLIP_EPSILON)
            .map((öffnung) => [öffnung.minU, öffnung.maxU])

        return subtractIntervals(-halfBreite, halfBreite, intervals)
    }

    const buildVerticalSegments = (lineU, halbeHöhe) => {
        const intervals = openingProjektionen
            .filter((öffnung) => lineU >= öffnung.minU - CLIP_EPSILON && lineU <= öffnung.maxU + CLIP_EPSILON)
            .map((öffnung) => [öffnung.minY, öffnung.maxY])

        return subtractIntervals(-halbeHöhe, halbeHöhe, intervals)
    }

    const renderLinien = (segmentDaten, segmentKey) => {
        if (segmentDaten.length === 0) return null

        return (
            <lineSegments key={segmentKey} position={position}>
                <bufferGeometry>
                    <bufferAttribute attach="attributes-position" args={[new Float32Array(segmentDaten), 3]} />
                </bufferGeometry>
                <lineBasicMaterial color="black" linewidth={linienDicke} />
            </lineSegments>
        )
    }

    const renderAusgesparteKanten = () => {
        if (!kantenAnzeigen) return null

        const halbeHöhe = gebäudeHöhe / 2
        const halbeBreite = fragBreite / 2
        const faceOffsets = lang ? [-KANTEN_OFFSET, KANTEN_OFFSET] : [-0.201, 0.201]

        return faceOffsets.map((faceOffset, faceIndex) => {
            const positions = []

            buildHorizontalSegments(halbeHöhe, halbeBreite).forEach(([start, end]) => {
                if (lang) {
                    positions.push(start, halbeHöhe, faceOffset, end, halbeHöhe, faceOffset)
                } else {
                    positions.push(faceOffset, halbeHöhe, start, faceOffset, halbeHöhe, end)
                }
            })

            buildHorizontalSegments(-halbeHöhe, halbeBreite).forEach(([start, end]) => {
                if (lang) {
                    positions.push(start, -halbeHöhe, faceOffset, end, -halbeHöhe, faceOffset)
                } else {
                    positions.push(faceOffset, -halbeHöhe, start, faceOffset, -halbeHöhe, end)
                }
            })

            if (!nurHorizontaleKanten) {
                buildVerticalSegments(-halbeBreite, halbeHöhe).forEach(([start, end]) => {
                    if (lang) {
                        positions.push(-halbeBreite, start, faceOffset, -halbeBreite, end, faceOffset)
                    } else {
                        positions.push(faceOffset, start, -halbeBreite, faceOffset, end, -halbeBreite)
                    }
                })

                buildVerticalSegments(halbeBreite, halbeHöhe).forEach(([start, end]) => {
                    if (lang) {
                        positions.push(halbeBreite, start, faceOffset, halbeBreite, end, faceOffset)
                    } else {
                        positions.push(faceOffset, start, halbeBreite, faceOffset, end, halbeBreite)
                    }
                })
            }

            return renderLinien(positions, `platte-kanten-${faceIndex}`)
        })
    }

    const renderPlatteMitCSG = (größe) => {
        if (öffnungen.length === 0) {
            return (
                <mesh position={position}>
                    <boxGeometry args={größe} />
                    <meshStandardMaterial color={color} />
                </mesh>
            )
        }

        return (
            <>
            <mesh position={position}>
                <Geometry>
                    <Base>
                        <boxGeometry args={größe} />
                    </Base>
                    {öffnungen.map((öffnung) => (
                        <Subtraction
                            key={öffnung.id}
                            position={[
                                öffnung.position[0] - position[0],
                                öffnung.position[1] - position[1],
                                öffnung.position[2] - position[2]
                            ]}
                        >
                            <boxGeometry args={öffnung.size} />
                        </Subtraction>
                    ))}
                </Geometry>
                <meshStandardMaterial color={color} />
            </mesh>
            </>
        )
    }

    return(
        <>
            {lang === true && (
                <group key={key}>
                    {oberflächenAnzeigen && (
                        <>
                            {renderPlatteMitCSG([fragBreite, gebäudeHöhe, 0.4])}
                        </>
                    )}
                    {renderAusgesparteKanten()}
                </group>
            )}
            {lang === false && (
                <group key={key}>
                    {oberflächenAnzeigen && (
                        <>
                            {renderPlatteMitCSG([0.4, gebäudeHöhe, fragBreite])}
                        </>
                    )}
                    {renderAusgesparteKanten()}
                </group>
            )}
        </>
    )
}
