import * as THREE from 'three'
import { useThree } from '@react-three/fiber'
import { useRef, useState, useEffect, useCallback } from 'react'
import { useDrag } from '@use-gesture/react'
import { OPENING_POSITION_REFRESH_EVENT } from './PositionInfoSection'
import { OPENING_GRID_STEP, dispatchOpeningPositionValues, persistOpeningPosition, quantizeOpeningDistance, snapOpeningCoordinate } from './wallOpeningPositionUtils'
import { getOpeningCollisionReport } from '../openingUtils'

// Transparente Öffnung für Dach (mit Winkelrotation)
export default function DachLeeröffnung({
    gebäudeHöhe,
    position,
    bodenBreite,
    bodenLänge,
    selectedObject,
    setOrbitKontrolle,
    setSelectedObject,
    setObjs,
    objId,
    objs,
    setEditMenü,
    oberflächenAnzeigen,
    kantenAnzeigen,
    dachArt = 'satteldach',
    pultdachHöheDifferenz = 0,
    zusatzHöheMitte = 5,
    balkenAbstand = 40,
    vorne = true
}) {
    const toFinite = (value, fallback = 0) => {
        const parsed = Number(value)
        return Number.isFinite(parsed) ? parsed : fallback
    }

    const obj = objs.find(o => o.id === objId)
    const openingArgs = obj ? [obj.value[0], obj.value[1]] : [5, 5]

    const x = position[0]
    const y = position[1]
    const z = position[2]

    // Berechne Positionen wie im Dach
    const xLinks = x - 9 - (0.5 * (bodenLänge - 20))
    const xRechts = x + 9 + (0.5 * (bodenLänge - 20))
    const zVorne = z + 6.5 + (0.5 * (bodenBreite - 15))
    const zHinten = z - 6.5 - (0.5 * (bodenBreite - 15))

    const traufhöhe = y + 4.5 + gebäudeHöhe

    const { size } = useThree()
    const groupRef = useRef()

    // Verwende startPos falls verfügbar, ansonsten Mitte des Dachs
    const initialX = obj?.startPos?.x ?? x
    const initialZ = obj?.startPos?.z ?? z
    const [gridPosi, setGridPosi] = useState({ x: initialX, z: initialZ })
    const gridPosiRef = useRef({ x: initialX, z: initialZ })
    const [isHovered, setIsHovered] = useState(false)

    const skaliertBreite = openingArgs[0] * 2.5
    const skaliertHöhe = openingArgs[1] * 2.5

    // Berechne Dach-Parameter je nach Dachtyp und Seite (vorne/hinten)
    // Die Öffnung wird direkt an der Dachfläche verankert
    let rotation = 0
    let finalX = gridPosi.x
    let finalY = traufhöhe
    let finalZ = gridPosi.z
    
    if (dachArt === 'pultdach') {
        const zStart = zHinten - 1
        const zEnd = zVorne + 1
        const zLänge = Math.abs(zEnd - zStart)

        const yStart = traufhöhe - 4
        const yEnd = traufhöhe - 4 + pultdachHöheDifferenz
        const yDiff = yEnd - yStart

        rotation = -Math.atan2(yDiff, zLänge)
        
        // Y-Position basierend auf Z-Position interpolieren
        const zNormalized = (gridPosi.z - zStart) / zLänge
        finalY = yStart + (yDiff * zNormalized)
        finalZ = gridPosi.z
        finalX = gridPosi.x
        
    } else if (dachArt === 'satteldach') {
        if (vorne) {
            // Vordere Dachhälfte
            const zStart = zVorne + 1
            const zEnd = z
            const zLänge = Math.abs(zStart - zEnd)

            const yStart = traufhöhe - 4
            const yEnd = traufhöhe + zusatzHöheMitte - 4
            const yDiff = yEnd - yStart

            rotation = Math.atan2(yDiff, zLänge)
            
            // Y-Position basierend auf Z-Position interpolieren
            const zNormalized = (gridPosi.z - zStart) / (-zLänge)
            finalY = yStart + (yDiff * zNormalized)
            finalZ = gridPosi.z
            finalX = gridPosi.x
        } else {
            // Hintere Dachhälfte
            const zStart = z
            const zEnd = zHinten - 1
            const zLänge = Math.abs(zEnd - zStart)

            const yStart = traufhöhe + zusatzHöheMitte - 4
            const yEnd = traufhöhe - 4
            const yDiff = yEnd - yStart

            rotation = Math.atan2(yDiff, zLänge)
            
            // Y-Position basierend auf Z-Position interpolieren
            const zNormalized = (zStart - gridPosi.z) / zLänge
            finalY = yStart + (yDiff * zNormalized)
            finalZ = gridPosi.z
            finalX = gridPosi.x
        }
    } else if (dachArt === 'flachdach') {
        rotation = 0
        
        // Flachdach: Y-Position bleibt konstant
        finalY = traufhöhe - 4
        finalZ = gridPosi.z
        finalX = gridPosi.x
    }

    // Grenzen für Bewegung - beachte die Breite und Höhe der Öffnung
    const minX = xLinks + (skaliertBreite / 2) - 0.75
    const maxX = xRechts - (skaliertBreite / 2) +1
    let minZ = zHinten + (skaliertHöhe / 2)
    let maxZ = zVorne - (skaliertHöhe / 2)

    // Satteldach: Öffnung darf nicht über die Firstkante (z) ragen
    if (dachArt === 'satteldach') {
        if (vorne) {
            // Vordere Seite: von First (z = oben) bis Traufe (zVorne = unten)
            minZ = z + (skaliertHöhe / 2)
            maxZ = zVorne - (skaliertHöhe / 2) +0.5
        } else {
            // Hintere Seite: von Traufe (zHinten = unten) bis First (z = oben)
            minZ = zHinten + (skaliertHöhe / 2) - 0.5
            maxZ = z - (skaliertHöhe / 2) + 0.5
        }
    }

    useEffect(() => {
        setGridPosi((prev) => {
            const clampedX = Math.max(minX, Math.min(maxX, prev.x))
            const clampedZ = Math.max(minZ, Math.min(maxZ, prev.z))

            if (clampedX === prev.x && clampedZ === prev.z) {
                return prev
            }

            return { x: clampedX, z: clampedZ }
        })
    }, [minX, maxX, minZ, maxZ])

    useEffect(() => {
        gridPosiRef.current = gridPosi
    }, [gridPosi])

    const getRoofCenterYAtZ = useCallback((zValue) => {
        const safeZ = toFinite(zValue, z)

        if (dachArt === 'pultdach') {
            const zStart = zHinten - 1
            const zEnd = zVorne + 1
            const zLänge = Math.abs(zEnd - zStart)
            if (!Number.isFinite(zLänge) || zLänge <= 0) return traufhöhe - 4

            const yStart = traufhöhe - 4
            const yEnd = traufhöhe - 4 + pultdachHöheDifferenz
            const zNormalized = (safeZ - zStart) / zLänge
            return yStart + ((yEnd - yStart) * zNormalized)
        }

        if (dachArt === 'satteldach') {
            if (vorne) {
                const zStart = zVorne + 1
                const zEnd = z
                const zLänge = Math.abs(zStart - zEnd)
                if (!Number.isFinite(zLänge) || zLänge <= 0) return traufhöhe - 4

                const yStart = traufhöhe - 4
                const yEnd = traufhöhe + zusatzHöheMitte - 4
                const zNormalized = (safeZ - zStart) / (-zLänge)
                return yStart + ((yEnd - yStart) * zNormalized)
            }

            const zStart = z
            const zEnd = zHinten - 1
            const zLänge = Math.abs(zEnd - zStart)
            if (!Number.isFinite(zLänge) || zLänge <= 0) return traufhöhe - 4

            const yStart = traufhöhe + zusatzHöheMitte - 4
            const yEnd = traufhöhe - 4
            const zNormalized = (zStart - safeZ) / zLänge
            return yStart + ((yEnd - yStart) * zNormalized)
        }

        return traufhöhe - 4
    }, [dachArt, pultdachHöheDifferenz, traufhöhe, vorne, z, zHinten, zVorne, zusatzHöheMitte])

    const persistPosition = useCallback((nextPos) => {
        const safeX = toFinite(nextPos?.x, toFinite(gridPosiRef.current?.x, x))
        const safeZ = toFinite(nextPos?.z, toFinite(gridPosiRef.current?.z, z))
        const halfWidth = toFinite(skaliertBreite / 2)
        const halfHeight = toFinite(skaliertHöhe / 2)
        const leftEdge = toFinite(xLinks + halfWidth)
        const rightEdge = toFinite(xRechts - halfWidth)
        const abstandLinksRaw = safeX - leftEdge
        const abstandRechtsRaw = rightEdge - safeX
        const centerY = toFinite(getRoofCenterYAtZ(safeZ), traufhöhe - 4)
        const abstandUntenRaw = centerY - halfHeight - toFinite(y)
        const fallbackLinks = toFinite(obj?.abstandLinks, 0)
        const fallbackRechts = toFinite(obj?.abstandRechts, 0)
        const fallbackUnten = toFinite(obj?.abstandUnten, 0)
        const nextAbstandLinks = quantizeOpeningDistance(abstandLinksRaw)
        const nextAbstandRechts = quantizeOpeningDistance(abstandRechtsRaw)
        const nextAbstandUnten = quantizeOpeningDistance(abstandUntenRaw)
        const distances = {
            abstandLinks: Number.isFinite(nextAbstandLinks) ? nextAbstandLinks : fallbackLinks,
            abstandRechts: Number.isFinite(nextAbstandRechts) ? nextAbstandRechts : fallbackRechts,
            abstandUnten: Number.isFinite(nextAbstandUnten) ? nextAbstandUnten : fallbackUnten
        }

        dispatchOpeningPositionValues(objId, distances)
        persistOpeningPosition({
            objId,
            setObjs,
            setSelectedObject,
            startPos: {
                x: safeX,
                z: safeZ
            },
            distances
        })
    }, [getRoofCenterYAtZ, gridPosiRef, obj?.abstandLinks, obj?.abstandRechts, obj?.abstandUnten, objId, setObjs, setSelectedObject, skaliertBreite, skaliertHöhe, traufhöhe, x, xLinks, xRechts, y, z])

    const updatePosition = useCallback((nextPos) => {
        gridPosiRef.current = nextPos
        setGridPosi(nextPos)
        persistPosition(nextPos)
    }, [persistPosition])

    const handleClick = () => {
        const found = objs.find(o => o.id === objId)
        if (found) {
            window.activeArrowControl = { kind: 'dach-leeroeffnung', id: objId }
            const current = gridPosiRef.current
            setSelectedObject({
                ...found,
                startPos: {
                    ...(found.startPos ?? {}),
                    x: current.x,
                    z: current.z
                }
            })
            setEditMenü('LeerÖffnung-Bearbeiten')
        }
    }

    useEffect(() => {
        const istAusgewählt = selectedObject?.id === objId && selectedObject?.type === 'leeröffnung' && selectedObject?.lang === false
        if (istAusgewählt) {
            window.activeArrowControl = { kind: 'dach-leeroeffnung', id: objId }
        }
    }, [selectedObject, objId])

    useEffect(() => {
        const hasAbstandLinks = obj?.abstandLinks !== undefined && obj?.abstandLinks !== null
        const hasAbstandRechts = obj?.abstandRechts !== undefined && obj?.abstandRechts !== null

        if (hasAbstandLinks && hasAbstandRechts) return

        persistPosition(gridPosiRef.current)
    }, [obj?.id, obj?.abstandLinks, obj?.abstandRechts, persistPosition])

    useEffect(() => {
        const handleRefreshPosition = (event) => {
            if (event?.detail?.id !== objId) return
            persistPosition(gridPosiRef.current)
        }

        window.addEventListener(OPENING_POSITION_REFRESH_EVENT, handleRefreshPosition)
        return () => window.removeEventListener(OPENING_POSITION_REFRESH_EVENT, handleRefreshPosition)
    }, [objId, persistPosition])

    useEffect(() => {
        const handleKeyDown = (event) => {
            const active = window.activeArrowControl
            const istAktiv = active && active.kind === 'dach-leeroeffnung' && active.id === objId
            const istAusgewählt = selectedObject?.id === objId && selectedObject?.type === 'leeröffnung' && selectedObject?.lang === false
            if (!istAktiv && !istAusgewählt) return

            const step = OPENING_GRID_STEP

            const current = gridPosiRef.current
            let newX = current.x
            let newZ = current.z

                switch (event.key) {
                    case 'ArrowLeft':
                        if (vorne) {
                            newX = current.x - step
                        } else {
                            newX = current.x + step
                        }
                        newX = snapOpeningCoordinate(newX, minX, minX, maxX)
                        event.preventDefault()
                        break
                    case 'ArrowRight':
                        if (vorne) {
                            newX = current.x + step
                        } else {
                            newX = current.x - step
                        }
                        newX = snapOpeningCoordinate(newX, minX, minX, maxX)
                        event.preventDefault()
                        break
                    case 'ArrowUp':
                        newZ = vorne ? current.z - step : current.z + step
                        newZ = snapOpeningCoordinate(newZ, minZ, minZ, maxZ)
                        event.preventDefault()
                        break
                    case 'ArrowDown':
                        newZ = vorne ? current.z + step : current.z - step
                        newZ = snapOpeningCoordinate(newZ, minZ, minZ, maxZ)
                        event.preventDefault()
                        break
                    default:
                        return
                }

            const nextPos = { x: newX, z: newZ }
            updatePosition(nextPos)
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [objId, minX, maxX, minZ, maxZ, vorne, selectedObject, updatePosition])

    const bind = useDrag(({ delta: [mx, my], first, last }) => {
        if (!obj) return

        const scaleX = 30 / size.width
        const scaleZ = 120 / size.height
        const current = gridPosiRef.current
        
        // X-Achse (entlang des Dachs) - Richtung abhängig von vorne
        let newX = vorne ? current.x + (mx * scaleX) : current.x - (mx * scaleX)
        newX = snapOpeningCoordinate(newX, minX, minX, maxX)

        // Z-Achse (entlang der Dachneigung)
        let newZ = vorne ? current.z + (my * scaleZ) : current.z - (my * scaleZ)
        newZ = snapOpeningCoordinate(newZ, minZ, minZ, maxZ)
        
        const nextPos = { x: newX, z: newZ }
        updatePosition(nextPos)

        if (first) {
            window.activeArrowControl = { kind: 'dach-leeroeffnung', id: objId }
            setOrbitKontrolle(false)
        }

        if (last) setOrbitKontrolle(true)
    })

    const borderColor = isHovered ? '#5aa7ff' : '#000000'
    const collisionReport = getOpeningCollisionReport({
        selectedObject: obj,
        draftObject: {
            ...obj,
            startPos: {
                ...(obj?.startPos ?? {}),
                x: finalX,
                z: finalZ
            }
        },
        objs
    })
    const warningColor = collisionReport.hasCollision ? '#d11a2a' : '#87CEEB'
    const warningBorderColor = collisionReport.hasCollision ? '#d11a2a' : borderColor

    if (!obj) {
        return null
    }

    return (
        <group
            position={[finalX, finalY, finalZ]}
            ref={groupRef}
            {...bind()}
            onClick={handleClick}
            onPointerOver={() => setIsHovered(true)}
            onPointerOut={() => setIsHovered(false)}
            rotation={[rotation + Math.PI / 2, 0, 0]}
        >
            {/* halbtransparentes Glas - durchsichtige Öffnung */}
            {oberflächenAnzeigen && (
                <mesh position={[0, 0, 0]}>
                    <boxGeometry args={[skaliertBreite, skaliertHöhe, 1]} />
                    <meshStandardMaterial
                        color={warningColor}
                        transparent
                        opacity={0.25}
                        depthWrite={false}
                        side={THREE.DoubleSide}
                        wireframe={false}
                        metalness={0.1}
                        roughness={0.3}
                    />
                </mesh>
            )}

            {/* feine Umrandung */}
            {kantenAnzeigen && (
                <lineSegments position={[0, 0, 0]}>
                    <edgesGeometry attach="geometry" args={[new THREE.BoxGeometry(skaliertBreite, skaliertHöhe, 1)]} />
                    <lineBasicMaterial attach="material" color={warningBorderColor} linewidth={2} />
                </lineSegments>
            )}
        </group>
    )
}
