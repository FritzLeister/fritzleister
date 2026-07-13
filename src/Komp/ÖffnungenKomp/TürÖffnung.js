import * as THREE from 'three'
import { useThree } from '@react-three/fiber'
import { useRef, useState, useEffect, useCallback } from 'react'
import { useDrag } from '@use-gesture/react'
import { OPENING_POSITION_REFRESH_EVENT } from './PositionInfoSection'
import { computeWallSideDistances, dispatchOpeningPositionValues, persistOpeningPosition } from './wallOpeningPositionUtils'
import { getOpeningCollisionReport } from '../openingUtils'

// Tür für Wände – basiert auf WandFenster Logik
export default function TürÖffnung({
    gebäudeHöhe,
    position,
    bodenBreite,
    bodenLänge,
    setOrbitKontrolle,
    setSelectedObject,
    setObjs,
    objId,
    objs,
    setEditMenü,
    oberflächenAnzeigen,
    kantenAnzeigen,
    dachArt = 'satteldach',
    pultdachHöheDifferenz = 0
}) {
    const SCENE_UNITS_PER_METER = 2.5
    const ARROW_STEP_METERS = 0.25
    const POSITION_GRID_STEP = ARROW_STEP_METERS * SCENE_UNITS_PER_METER
    const obj = objs.find(o => o.id === objId)
    const openingArgs = obj ? [obj.value[0], obj.value[1]] : [1, 2.1]

    const rechts = obj?.rechts ?? true // true = Rückseite, false = Vorderseite
    const lang = obj?.lang ?? true // true = lange Wand, false = kurze Wand

    const x = position[0]
    const y = position[1] + (gebäudeHöhe / 6) - 0.4 - ((gebäudeHöhe - 15) / 6) - 2 + ((openingArgs[1] - 1) / 4)

    // Positionierung wie bei Wand
    const zVorne = position[2] + 6.5 + (0.5 * (bodenBreite - 15))
    const zHinten = position[2] - 6.5 - (0.5 * (bodenBreite - 15))
    const z = rechts ? zHinten : zVorne

    // Für kurze Wände: x-Position an den Seiten
    const xLinks = position[0] - 6.5 - (0.5 * (bodenLänge - 15))
    const xRechts = position[0] + 6.5 + (0.5 * (bodenLänge - 15))

    const { size } = useThree()
    const groupRef = useRef()

    const skaliertBreite = openingArgs[0] * 2.5
    const skaliertHöhe = openingArgs[1] * 2.5
    const halbeTürBreite = skaliertBreite / 2
    const randPuffer = 0.1

    const langeWandMin = xLinks - 1
    const langeWandMax = xRechts + 1

    const kurzeWandMin = zHinten - 1
    const kurzeWandMax = zVorne + 1

    // Grenzen für lange Wände (X-Achse)
    const minX = langeWandMin + halbeTürBreite + randPuffer
    const maxX = langeWandMax - halbeTürBreite - randPuffer

    // Grenzen für kurze Wände (Z-Achse)
    const minZ = kurzeWandMin + halbeTürBreite + randPuffer
    const maxZ = kurzeWandMax - halbeTürBreite - randPuffer

    const snapToGridFromOrigin = useCallback((value, origin, min, max) => {
        const clampedValue = Math.max(min, Math.min(max, value))
        const snappedValue = origin + Math.round((clampedValue - origin) / POSITION_GRID_STEP) * POSITION_GRID_STEP
        return Math.max(min, Math.min(max, Number(snappedValue.toFixed(3))))
    }, [POSITION_GRID_STEP])

    const quantizeDistance = useCallback((value) => {
        return Math.max(0, Number((Math.round(value / POSITION_GRID_STEP) * POSITION_GRID_STEP).toFixed(3)))
    }, [POSITION_GRID_STEP])

    // Berechne Wandhöhe basierend auf Dachtyp
    // Verwende startPos, falls verfügbar
    const initialX = lang
        ? snapToGridFromOrigin(obj?.startPos?.x ?? minX, minX, minX, maxX)
        : obj?.startPos?.x ?? x
    const initialZ = lang
        ? obj?.startPos?.z ?? position[2]
        : snapToGridFromOrigin(obj?.startPos?.z ?? minZ, minZ, minZ, maxZ)
    const initialY = obj?.startPos?.y ?? y
    const [gridPosi, setGridPosi] = useState({ x: initialX, z: initialZ, y: initialY })
    const gridPosiRef = useRef({ x: initialX, z: initialZ, y: initialY })
    const [isHovered, setIsHovered] = useState(false)

    useEffect(() => {
        gridPosiRef.current = gridPosi
    }, [gridPosi])

    const persistPosition = useCallback((nextPos) => {
        const rawDistances = computeWallSideDistances({
            nextPos,
            lang,
            xLinks,
            xRechts,
            zHinten,
            zVorne,
            halfWidth: halbeTürBreite
        })
        const distances = {
            abstandLinks: quantizeDistance(rawDistances.abstandLinks),
            abstandRechts: quantizeDistance(rawDistances.abstandRechts)
        }

        dispatchOpeningPositionValues(objId, distances)
        persistOpeningPosition({
            objId,
            setObjs,
            setSelectedObject,
            startPos: nextPos,
            distances
        })
    }, [halbeTürBreite, lang, objId, quantizeDistance, setObjs, setSelectedObject, xLinks, xRechts, zHinten, zVorne])

    useEffect(() => {
        const handleRefreshPosition = (event) => {
            if (event?.detail?.id !== objId) return
            persistPosition(gridPosiRef.current)
        }

        window.addEventListener(OPENING_POSITION_REFRESH_EVENT, handleRefreshPosition)
        return () => window.removeEventListener(OPENING_POSITION_REFRESH_EVENT, handleRefreshPosition)
    }, [objId, persistPosition])

    // Grenzen für Y-Achse (vertikal auf der Wand)
    // minY: ab wo die Massivwand aufhört
    // maxY: bis zum Dachansatz
    // +4 Offset wird bei der Position addiert, daher abziehen
    const handleClick = () => {
        const found = objs.find(o => o.id === objId)
        if (found) {
            window.activeArrowControl = { kind: 'wand-tuer', id: objId }
            setSelectedObject(found)
            setEditMenü('Tür-Bearbeiten')
        }
    }

    useEffect(() => {
        const handleKeyDown = (event) => {
            const active = window.activeArrowControl
            if (!active || active.kind !== 'wand-tuer' || active.id !== objId) return

            const stepHorizontal = POSITION_GRID_STEP

            setGridPosi((prev) => {
                let newX = prev.x
                let newZ = prev.z

                switch (event.key) {
                    case 'ArrowLeft':
                        if (lang) {
                            newX = prev.x + (rechts ? stepHorizontal : -stepHorizontal)
                            newX = snapToGridFromOrigin(newX, minX, minX, maxX)
                        } else {
                            newZ = prev.z - (rechts ? stepHorizontal : -stepHorizontal)
                            newZ = snapToGridFromOrigin(newZ, minZ, minZ, maxZ)
                        }
                        event.preventDefault()
                        break
                    case 'ArrowRight':
                        if (lang) {
                            newX = prev.x + (rechts ? -stepHorizontal : stepHorizontal)
                            newX = snapToGridFromOrigin(newX, minX, minX, maxX)
                        } else {
                            newZ = prev.z + (rechts ? stepHorizontal : -stepHorizontal)
                            newZ = snapToGridFromOrigin(newZ, minZ, minZ, maxZ)
                        }
                        event.preventDefault()
                        break
                    default:
                        return prev
                }

                return { x: newX, z: newZ, y: prev.y }
            })
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [objId, lang, rechts, minX, maxX, minZ, maxZ, POSITION_GRID_STEP, snapToGridFromOrigin])

    const bind = useDrag(({ movement: [dragMoveX], first, last, memo }) => {
        const scale = 80 / size.width
        if (first) {
            memo = { startX: gridPosi.x, startZ: gridPosi.z }
        }

        if (lang) {
            // Lange Wand: X-Achse bewegen (Richtung abhängig von rechts)
            const dragMultiplier = rechts ? -1 : 1
            let newX = memo.startX + (dragMultiplier * dragMoveX * scale)
            newX = snapToGridFromOrigin(newX, minX, minX, maxX)
            setGridPosi({ x: newX, z: gridPosi.z, y: gridPosi.y })

            if (first) {
                window.activeArrowControl = { kind: 'wand-tuer', id: objId }
                setOrbitKontrolle(false)
            }
        } else {
            // Kurze Wand: Z-Achse bewegen (Richtung abhängig von rechts)
            const dragMultiplier = rechts ? 1 : -1
            let newZ = memo.startZ + (dragMultiplier * dragMoveX * scale)
            newZ = snapToGridFromOrigin(newZ, minZ, minZ, maxZ)
            setGridPosi({ x: gridPosi.x, z: newZ, y: gridPosi.y })

            if (first) {
                window.activeArrowControl = { kind: 'wand-tuer', id: objId }
                setOrbitKontrolle(false)
            }
        }

        if (last) setOrbitKontrolle(true)

        return memo
    }, [gridPosi.x, gridPosi.y, gridPosi.z, lang, maxX, maxZ, minX, minZ, objId, rechts, setOrbitKontrolle, size.width, snapToGridFromOrigin])

    const borderColor = isHovered ? '#5aa7ff' : '#000000'

    // Finale Position basierend auf Wandtyp
    const tiefe = 1.5
    const surfaceOffset = tiefe / 2 + 0.05
    const normalSign = rechts ? -1 : 1
    const finalX = lang ? gridPosi.x : (rechts ? xLinks : xRechts) + (!lang ? normalSign * surfaceOffset : 0)
    const finalZ = lang ? z + (lang ? normalSign * surfaceOffset : 0) : gridPosi.z
    
    const breite = skaliertBreite
    const höhe = skaliertHöhe
    const isDoubleDoor = obj?.doppeltür === 'ja'
    const doubleGap = 0
    const leafWidth = isDoubleDoor ? (breite - doubleGap) / 2 : breite
    const leftLeafCenterX = isDoubleDoor ? -(leafWidth / 2 + doubleGap / 2) : 0
    const rightLeafCenterX = isDoubleDoor ? (leafWidth / 2 + doubleGap / 2) : 0
    const handleInnerX = doubleGap / 2 + 0.3
    const handleSide = obj?.orientierung === 'rechts' ? 1 : -1
    const singleHandleX = handleSide * (breite / 2 - 0.3)
    const colorMap = {
        Weiß: '#e6e6e6',
        Grau: '#9b9b9b',
        Schwarz: '#2b2b2b'
    }
    const rahmenFarbe = colorMap[obj?.türFarbe] ?? '#8B7355'
    const türFüllFarbe = colorMap[obj?.türFüllFarbe] ?? '#D2B48C'
    const türFüllFarbeInnen = colorMap[obj?.türFüllFarbeInnen] ?? türFüllFarbe
    
    // Tür so positionieren, dass unteres Ende die Bodenplatte berührt
    // Bodenplatte oben ist bei: position[1] + 0.2 (Bodenplatte Höhe 0.4)
    const finalY = position[1] + 0.2 + (höhe / 2)
    const collisionReport = getOpeningCollisionReport({
        selectedObject: obj,
        draftObject: {
            ...obj,
            startPos: {
                ...(obj?.startPos ?? {}),
                x: finalX,
                y: finalY,
                z: finalZ
            }
        },
        objs
    })
    const warningColor = collisionReport.hasCollision ? '#d11a2a' : rahmenFarbe
    const warningFillColor = collisionReport.hasCollision ? '#d11a2a' : türFüllFarbe
    const warningFillColorInnen = collisionReport.hasCollision ? '#d11a2a' : türFüllFarbeInnen

    return (
        <group
            position={[finalX, finalY, finalZ]}
            ref={groupRef}
            {...bind()}
            onClick={handleClick}
            onPointerOver={() => setIsHovered(true)}
            onPointerOut={() => setIsHovered(false)}
            rotation={lang ? [0, 0, 0] : [0, Math.PI * 90 / 180, 0]}
        >
            {oberflächenAnzeigen && (
                <>
                    {/* Türrahmen Hintergrund */}
                    <mesh position={[0, 0, 0]}>
                        <boxGeometry args={[breite, höhe, tiefe]} />
                        <meshStandardMaterial color={warningColor} />
                    </mesh>

                    {/* Türblätter */}
                    <mesh position={[leftLeafCenterX, 0, tiefe / 2]}>
                        <boxGeometry args={[leafWidth - 0.15, höhe - 0.15, tiefe * 0.1]} />
                        <meshStandardMaterial color={warningFillColor} />
                    </mesh>
                    <mesh position={[leftLeafCenterX, 0, -tiefe / 2]}>
                        <boxGeometry args={[leafWidth - 0.15, höhe - 0.15, tiefe * 0.1]} />
                        <meshStandardMaterial color={warningFillColorInnen} />
                    </mesh>
                    {isDoubleDoor && (
                        <>
                            <mesh position={[rightLeafCenterX, 0, tiefe / 2]}>
                                <boxGeometry args={[leafWidth - 0.15, höhe - 0.15, tiefe * 0.1]} />
                                <meshStandardMaterial color={warningFillColor} />
                            </mesh>
                            <mesh position={[rightLeafCenterX, 0, -tiefe / 2]}>
                                <boxGeometry args={[leafWidth - 0.15, höhe - 0.15, tiefe * 0.1]} />
                                <meshStandardMaterial color={warningFillColorInnen} />
                            </mesh>
                        </>
                    )}

                    {/* Türrahmen oben */}
                    <mesh position={[0, höhe / 2 - 0.075, 0]}>
                        <boxGeometry args={[breite, 0.15, tiefe + 0.1]} />
                        <meshStandardMaterial color={warningColor} />
                    </mesh>

                    {/* Türrahmen unten */}
                    <mesh position={[0, -höhe / 2 + 0.075, 0]}>
                        <boxGeometry args={[breite, 0.15, tiefe + 0.1]} />
                        <meshStandardMaterial color={warningColor} />
                    </mesh>

                    {/* Türrahmen links */}
                    <mesh position={[-breite / 2 + 0.075, 0, 0]}>
                        <boxGeometry args={[0.15, höhe, tiefe + 0.1]} />
                        <meshStandardMaterial color={warningColor} />
                    </mesh>

                    {/* Türrahmen rechts */}
                    <mesh position={[breite / 2 - 0.075, 0, 0]}>
                        <boxGeometry args={[0.15, höhe, tiefe + 0.1]} />
                        <meshStandardMaterial color={warningColor} />
                    </mesh>

                    {/* Türklinke (kleine Kugel) */}
                    {!isDoubleDoor ? (
                        <>
                            <mesh position={[singleHandleX, 0, tiefe / 2 + 0.05]}>
                                <sphereGeometry args={[0.1, 16, 16]} />
                                <meshStandardMaterial color="#C0C0C0" metalness={0.8} roughness={0.2} />
                            </mesh>
                            <mesh position={[singleHandleX, 0, -tiefe / 2 - 0.05]}>
                                <sphereGeometry args={[0.1, 16, 16]} />
                                <meshStandardMaterial color="#C0C0C0" metalness={0.8} roughness={0.2} />
                            </mesh>
                        </>
                    ) : (
                        <>
                            <mesh position={[-handleInnerX, 0, tiefe / 2 + 0.05]}>
                                <sphereGeometry args={[0.1, 16, 16]} />
                                <meshStandardMaterial color="#C0C0C0" metalness={0.8} roughness={0.2} />
                            </mesh>
                            <mesh position={[handleInnerX, 0, tiefe / 2 + 0.05]}>
                                <sphereGeometry args={[0.1, 16, 16]} />
                                <meshStandardMaterial color="#C0C0C0" metalness={0.8} roughness={0.2} />
                            </mesh>
                            <mesh position={[-handleInnerX, 0, -tiefe / 2 - 0.05]}>
                                <sphereGeometry args={[0.1, 16, 16]} />
                                <meshStandardMaterial color="#C0C0C0" metalness={0.8} roughness={0.2} />
                            </mesh>
                            <mesh position={[handleInnerX, 0, -tiefe / 2 - 0.05]}>
                                <sphereGeometry args={[0.1, 16, 16]} />
                                <meshStandardMaterial color="#C0C0C0" metalness={0.8} roughness={0.2} />
                            </mesh>
                        </>
                    )}
                </>
            )}

            {/* Umrandung */}
            {kantenAnzeigen && (
                <lineSegments>
                    <edgesGeometry attach="geometry" args={[new THREE.BoxGeometry(breite, höhe, tiefe)]} />
                    <lineBasicMaterial attach="material" color={borderColor} linewidth={2} />
                </lineSegments>
            )}
        </group>
    )
}
