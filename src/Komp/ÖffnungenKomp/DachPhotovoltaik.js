import * as THREE from 'three'
import { useThree } from '@react-three/fiber'
import { useMemo, useRef, useState, useEffect, useCallback } from 'react'
import { useDrag } from '@use-gesture/react'
import { OPENING_POSITION_REFRESH_EVENT } from './PositionInfoSection'
import { OPENING_GRID_STEP, dispatchOpeningPositionValues, persistOpeningPosition, quantizeOpeningDistance, snapOpeningCoordinate } from './wallOpeningPositionUtils'
import { getOpeningCollisionReport } from '../openingUtils'

// Photovoltaik-Paneel für Dach – Positionierung analog DachLeeröffnung
export default function DachPhotovoltaik({
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
    pultdachHöheDifferenz = 0,
    zusatzHöheMitte = 5,
    vorne = true
}) {
    const toFinite = (value, fallback = 0) => {
        const parsed = Number(value)
        return Number.isFinite(parsed) ? parsed : fallback
    }

    const obj = useMemo(() => objs.find(o => o.id === objId), [objs, objId])
    const openingArgs = useMemo(() => (obj ? [obj.value[0], obj.value[1]] : [3, 3]), [obj])
    const fallbackAbstandLinks = toFinite(obj?.abstandLinks, 0)
    const fallbackAbstandRechts = toFinite(obj?.abstandRechts, 0)
    const fallbackAbstandUnten = toFinite(obj?.abstandUnten, 0)

    const x = position[0]
    const y = position[1]
    const z = position[2]

    const xLinks = x - 9 - (0.5 * (bodenLänge - 20))
    const xRechts = x + 9 + (0.5 * (bodenLänge - 20))
    const zVorne = z + 6.5 + (0.5 * (bodenBreite - 15))
    const zHinten = z - 6.5 - (0.5 * (bodenBreite - 15))
    const traufhöhe = y + 4.5 + gebäudeHöhe

    const { size } = useThree()
    const groupRef = useRef()

    // Berechne Z-Grenzen FRÜH für initialZ-Clamping
    let initialMinZ = zHinten + (openingArgs[1] / 2) - 1
    let initialMaxZ = zVorne - (openingArgs[1] / 2) + 1

    if (dachArt === 'satteldach') {
        if (vorne) {
            initialMinZ = z - (openingArgs[1] / 2) + 6.8 + (openingArgs[1] - 6)
            initialMaxZ = zVorne - (openingArgs[1] / 2) + 0.5
        } else {
            initialMinZ = zHinten + (openingArgs[1] / 2) - 1
            initialMaxZ = z - (openingArgs[1] / 2) - 1
        }
    } else if (dachArt === 'pultdach') {
        initialMinZ = zHinten + (openingArgs[1] / 2) + 1
        initialMaxZ = zVorne - (openingArgs[1] / 2) - 1
    }

    const initialX = obj?.startPos?.x ?? x
    let initialZ = obj?.startPos?.z ?? z
    
    // Verwende einen vernünftigen Default basierend auf Dachseite
    if (!obj?.startPos?.z) {
        if (vorne) {
            // Vorne: näher bei Traufe (zVorne)
            initialZ = (z + zVorne) / 2
        } else {
            // Hinten: näher bei Traufe (zHinten)
            initialZ = (z + zHinten) / 2
        }
    }
    
    const clampedInitialZ = Math.max(initialMinZ, Math.min(initialMaxZ, initialZ))
    const [gridPosi, setGridPosi] = useState({ x: initialX, z: clampedInitialZ })
    const gridPosiRef = useRef({ x: initialX, z: clampedInitialZ })
    const latestObjectRef = useRef(obj)
    const isDraggingRef = useRef(false)
    const [isHovered, setIsHovered] = useState(false)

    useEffect(() => {
        latestObjectRef.current = obj
    }, [obj])

    useEffect(() => {
        gridPosiRef.current = gridPosi
    }, [gridPosi])

    useEffect(() => {
        if (isDraggingRef.current) return

        const nextPos = {
            x: obj?.startPos?.x ?? initialX,
            z: obj?.startPos?.z ?? initialZ
        }

        if (
            gridPosiRef.current.x !== nextPos.x ||
            gridPosiRef.current.z !== nextPos.z
        ) {
            gridPosiRef.current = nextPos
            setGridPosi(nextPos)
        }
    }, [obj?.id, obj?.startPos?.x, obj?.startPos?.z, initialX, initialZ])

    useEffect(() => {
        if (isDraggingRef.current) return

        const current = gridPosiRef.current
        const nextPos = {
            x: obj?.startPos?.x ?? current.x,
            z: obj?.startPos?.z ?? current.z
        }

        if (
            current.x !== nextPos.x ||
            current.z !== nextPos.z
        ) {
            gridPosiRef.current = nextPos
            setGridPosi(nextPos)
        }
    }, [obj?.startPos?.x, obj?.startPos?.z])

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
        const halfWidth = toFinite(openingArgs[0] / 2)
        const halfHeight = toFinite(openingArgs[1] / 2)
        const leftEdge = toFinite(xLinks + halfWidth)
        const rightEdge = toFinite(xRechts - halfWidth)
        const abstandLinksRaw = safeX - leftEdge
        const abstandRechtsRaw = rightEdge - safeX
        const centerY = toFinite(getRoofCenterYAtZ(safeZ), traufhöhe - 4)
        const abstandUntenRaw = centerY - halfHeight - toFinite(y)
        const nextAbstandLinks = quantizeOpeningDistance(abstandLinksRaw)
        const nextAbstandRechts = quantizeOpeningDistance(abstandRechtsRaw)
        const nextAbstandUnten = quantizeOpeningDistance(abstandUntenRaw)
        const distances = {
            abstandLinks: Number.isFinite(nextAbstandLinks) ? nextAbstandLinks : fallbackAbstandLinks,
            abstandRechts: Number.isFinite(nextAbstandRechts) ? nextAbstandRechts : fallbackAbstandRechts,
            abstandUnten: Number.isFinite(nextAbstandUnten) ? nextAbstandUnten : fallbackAbstandUnten
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
    }, [fallbackAbstandLinks, fallbackAbstandRechts, fallbackAbstandUnten, getRoofCenterYAtZ, objId, openingArgs, setObjs, setSelectedObject, traufhöhe, x, xLinks, xRechts, y, z])

    const updatePosition = useCallback((nextPos) => {
        const normalized = {
            x: toFinite(nextPos?.x, gridPosiRef.current?.x ?? x),
            z: toFinite(nextPos?.z, gridPosiRef.current?.z ?? z)
        }

        gridPosiRef.current = normalized
        setGridPosi(normalized)
        persistPosition(normalized)
    }, [persistPosition, x, z])

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

        const zNormalized = (gridPosi.z - zStart) / zLänge
        finalY = yStart + (yDiff * zNormalized)
        finalZ = gridPosi.z
        finalX = gridPosi.x
    } else if (dachArt === 'satteldach') {
        if (vorne) {
            const zStart = zVorne + 1
            const zEnd = z
            const zLänge = Math.abs(zStart - zEnd)

            const yStart = traufhöhe - 4
            const yEnd = traufhöhe + zusatzHöheMitte - 4
            const yDiff = yEnd - yStart

            rotation = Math.atan2(yDiff, zLänge)

            const zNormalized = (gridPosi.z - zStart) / (-zLänge)
            finalY = yStart + (yDiff * zNormalized)
            finalZ = gridPosi.z
            finalX = gridPosi.x
        } else {
            const zStart = z
            const zEnd = zHinten - 1
            const zLänge = Math.abs(zEnd - zStart)

            const yStart = traufhöhe + zusatzHöheMitte - 4 // Oben (First)
            const yEnd = traufhöhe - 4  // Unten (Traufe)
            const yDiff = yEnd - yStart

            rotation = Math.atan2(yDiff, zLänge)

            const zNormalized = (zStart - gridPosi.z) / zLänge
            finalY = yStart + (yDiff * zNormalized)
            finalZ = gridPosi.z
            finalX = gridPosi.x
        }
    } else if (dachArt === 'flachdach') {
        rotation = 0
        finalY = traufhöhe - 4
        finalZ = gridPosi.z
        finalX = gridPosi.x
    }

    const minX = xLinks + (openingArgs[0] / 2) - 1
    const maxX = xRechts - (openingArgs[0] / 2) +1

    // Z-Grenzen für vertikale Bewegung auf dem Dach (nutze die bereits berechneten Werte)
    let minZ = initialMinZ
    let maxZ = initialMaxZ

    const handleClick = (event) => {
        event?.stopPropagation?.()
        const found = objs.find(o => o.id === objId)
        if (found) {
            window.activeArrowControl = { kind: 'dach-photovoltaik', id: objId }
            const current = gridPosiRef.current
            setSelectedObject({
                ...found,
                startPos: {
                    ...(found.startPos ?? {}),
                    x: current.x,
                    z: current.z
                }
            })
            setEditMenü('Photovoltaik-Bearbeiten')
        }
    }

    useEffect(() => {
        const hasAbstandLinks = obj?.abstandLinks !== undefined && obj?.abstandLinks !== null
        const hasAbstandRechts = obj?.abstandRechts !== undefined && obj?.abstandRechts !== null

        if (hasAbstandLinks && hasAbstandRechts) return

        persistPosition(gridPosiRef.current)
    }, [obj?.id, obj?.abstandLinks, obj?.abstandRechts, persistPosition])

    useEffect(() => {
        const handleRefreshPosition = (event) => {
            if (event?.detail?.id !== objId) return

            let nextPos = null
            const incoming = event?.detail

			if (incoming?.startPos) {
				nextPos = {
					x: incoming.startPos.x ?? gridPosiRef.current.x,
					z: incoming.startPos.z ?? gridPosiRef.current.z
				}
			} else if (incoming?.mode === 'horizontal') {
				const xValue = incoming?.startPos?.x ?? gridPosiRef.current.x
				nextPos = {
					x: xValue,
					z: gridPosiRef.current.z
				}
			} else if (incoming?.mode === 'vertical') {
				const zValue = incoming?.startPos?.z ?? gridPosiRef.current.z
				nextPos = {
					x: gridPosiRef.current.x,
					z: zValue
				}
			}

            if (!nextPos) {
                const latestObject = latestObjectRef.current ?? obj
                nextPos = {
                    x: latestObject?.startPos?.x ?? initialX,
                    z: latestObject?.startPos?.z ?? initialZ
                }
            }

            gridPosiRef.current = nextPos
            setGridPosi(nextPos)
            persistPosition(nextPos)
        }

        window.addEventListener(OPENING_POSITION_REFRESH_EVENT, handleRefreshPosition)
        return () => window.removeEventListener(OPENING_POSITION_REFRESH_EVENT, handleRefreshPosition)
    }, [initialX, initialZ, obj, objId, persistPosition])

    // Tastatursteuerung mit Pfeiltasten (nur wenn dieses Paneel aktiv ist)
    useEffect(() => {
        const handleKeyDown = (event) => {
            // Nur reagieren wenn DIESES Paneel aktiv ist
            const active = window.activeArrowControl
            if (!active || active.kind !== 'dach-photovoltaik' || active.id !== objId) return

            const step = OPENING_GRID_STEP

            const current = gridPosiRef.current
            let newX = current.x
            let newZ = current.z

                switch(event.key) {
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
                        if (vorne) {
                            newZ = current.z - step
                        } else {
                            newZ = current.z + step
                        }
                        newZ = snapOpeningCoordinate(newZ, minZ, minZ, maxZ)
                        event.preventDefault()
                        break
                    case 'ArrowDown':
                        if (vorne) {
                            newZ = current.z + step
                        } else {
                            newZ = current.z - step
                        }
                        newZ = snapOpeningCoordinate(newZ, minZ, minZ, maxZ)
                        event.preventDefault()
                        break
                    default:
                        return
                }

            updatePosition({ x: newX, z: newZ })
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [objId, minX, maxX, minZ, maxZ, vorne, updatePosition])

    const bind = useDrag(({ delta: [mx, my], first, last, tap, event }) => {
        if (last && tap) {
            handleClick(event)
            setOrbitKontrolle(true)
            return
        }

        const scale = 400 / size.width
        const zScale = 120 / size.height
        const current = gridPosiRef.current

        let newX = vorne ? current.x + (mx * scale) : current.x - (mx * scale)
        newX = snapOpeningCoordinate(newX, minX, minX, maxX)

        // Vertikale Bewegung auf dem Dach - Richtung ist unterschiedlich für vorne/hinten
        let newZ = vorne ? current.z + (my * zScale) : current.z - (my * zScale)
        newZ = snapOpeningCoordinate(newZ, minZ, minZ, maxZ)

        updatePosition({ x: newX, z: newZ })

        if (first) {
            window.activeArrowControl = { kind: 'dach-photovoltaik', id: objId }
            setOrbitKontrolle(false)
        }

        if (last) {
            isDraggingRef.current = false
            setOrbitKontrolle(true)
        }
    }, { filterTaps: true })

    const borderColor = isHovered ? '#5aa7ff' : '#000000'
    const tiefe = 0.5
    const breite = openingArgs[0]
    const höhe = openingArgs[1]
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
    const warningColor = collisionReport.hasCollision ? '#d11a2a' : null
    const rahmenFarbName = obj?.rahmenFarbe ?? 'Weiß'
    const rahmenFarbMap = {
        Schwarz: '#1e1e1e',
        Grau: '#a9afb7',
        Weiß: '#ffffff'
    }
    const rahmenFarbeHex = rahmenFarbMap[rahmenFarbName] ?? rahmenFarbMap.Weiß
    const strebenFarbMap = {
        Schwarz: '#2f2f2f',
        Grau: '#d3d7dd',
        Weiß: '#f5f8fc'
    }
    const strebenFarbeHex = strebenFarbMap[rahmenFarbName] ?? strebenFarbMap.Weiß
    const panelBreite = Math.max(0.3, breite - 0.16)
    const panelHöhe = Math.max(0.3, höhe - 0.16)
    const frontPanelZ = tiefe / 2 + 0.02
    const backPanelZ = -tiefe / 2 - 0.02
    const zellSpalten = Math.max(2, Math.min(5, Math.round(breite / 0.9)))
    const zellReihen = Math.max(2, Math.min(4, Math.round(höhe / 0.9)))
    const vertikaleZelllinien = useMemo(() => {
        if (zellSpalten <= 1) return []

        return Array.from({ length: zellSpalten - 1 }, (_, index) => {
            const step = panelBreite / zellSpalten
            return -panelBreite / 2 + step * (index + 1)
        })
    }, [panelBreite, zellSpalten])
    const horizontaleZelllinien = useMemo(() => {
        if (zellReihen <= 1) return []

        return Array.from({ length: zellReihen - 1 }, (_, index) => {
            const step = panelHöhe / zellReihen
            return -panelHöhe / 2 + step * (index + 1)
        })
    }, [panelHöhe, zellReihen])

    const frontPanelGeometry = useMemo(
        () => new THREE.BoxGeometry(panelBreite, panelHöhe, 0.04),
        [panelBreite, panelHöhe]
    )
    const reflectionGeometry = useMemo(
        () => new THREE.BoxGeometry(panelBreite * 0.74, Math.max(0.04, panelHöhe * 0.08), 0.01),
        [panelBreite, panelHöhe]
    )
    const backPanelGeometry = useMemo(
        () => new THREE.BoxGeometry(panelBreite, panelHöhe, 0.03),
        [panelBreite, panelHöhe]
    )
    const verticalCellGeometry = useMemo(
        () => new THREE.BoxGeometry(0.03, panelHöhe - 0.04, 0.01),
        [panelHöhe]
    )
    const horizontalCellGeometry = useMemo(
        () => new THREE.BoxGeometry(panelBreite - 0.04, 0.03, 0.01),
        [panelBreite]
    )
    const frameHorizontalGeometry = useMemo(
        () => new THREE.BoxGeometry(breite, 0.08, tiefe + 0.05),
        [breite, tiefe]
    )
    const frameVerticalGeometry = useMemo(
        () => new THREE.BoxGeometry(0.08, höhe, tiefe + 0.05),
        [höhe, tiefe]
    )
    const centerRailGeometry = useMemo(
        () => new THREE.BoxGeometry(0.04, höhe - 0.1, tiefe + 0.03),
        [höhe, tiefe]
    )
    const edgeGeometry = useMemo(
        () => new THREE.EdgesGeometry(new THREE.BoxGeometry(breite, höhe, tiefe)),
        [breite, höhe, tiefe]
    )

    const frontPanelMaterial = useMemo(
        () => new THREE.MeshStandardMaterial({
            color: warningColor ?? '#10345c',
            emissive: warningColor ?? '#0f2c4a',
            emissiveIntensity: 0.22,
            side: THREE.DoubleSide,
            metalness: 0.08,
            roughness: 0.32
        }),
        [warningColor]
    )
    const reflectionMaterial = useMemo(
        () => new THREE.MeshStandardMaterial({
            color: warningColor ?? '#c8d6e3',
            emissive: warningColor ?? '#90a7bb',
            emissiveIntensity: 0.08,
            side: THREE.DoubleSide,
            metalness: 0.05,
            roughness: 0.16
        }),
        [warningColor]
    )
    const backPanelMaterial = useMemo(
        () => new THREE.MeshStandardMaterial({ color: warningColor ?? '#171717', metalness: 0.12, roughness: 0.72 }),
        [warningColor]
    )
    const frameMaterial = useMemo(
        () => new THREE.MeshStandardMaterial({ color: warningColor ?? rahmenFarbeHex, metalness: 0.62, roughness: 0.24 }),
        [rahmenFarbeHex, warningColor]
    )
    const cellLineMaterial = useMemo(
        () => new THREE.MeshStandardMaterial({ color: warningColor ?? strebenFarbeHex, metalness: 0.35, roughness: 0.28 }),
        [strebenFarbeHex, warningColor]
    )
    const centerRailMaterial = useMemo(
        () => new THREE.MeshStandardMaterial({ color: warningColor ?? strebenFarbeHex, metalness: 0.55, roughness: 0.3 }),
        [strebenFarbeHex, warningColor]
    )

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
            {oberflächenAnzeigen && (
                <>
                    {/* Frontseite mit klarem technischem Modul-Look */}
                    <mesh position={[0, 0, frontPanelZ]} geometry={frontPanelGeometry} material={frontPanelMaterial} />

                    {/* Dezenter Reflexstreifen für sauberen Glasabschluss */}
                    <mesh position={[0, panelHöhe * 0.22, frontPanelZ + 0.02]} geometry={reflectionGeometry} material={reflectionMaterial} />

                    {/* Rückseite schlicht und dunkel */}
                    <mesh position={[0, 0, backPanelZ]} geometry={backPanelGeometry} material={backPanelMaterial} />

                    {/* Zell-Trennlinien vorne */}
                    {vertikaleZelllinien.map((lineX, index) => (
                        <mesh
                            key={`pv-vertical-${index}`}
                            position={[lineX, 0, frontPanelZ + 0.015]}
                            geometry={verticalCellGeometry}
                            material={cellLineMaterial}
                        />
                    ))}
                    {horizontaleZelllinien.map((lineY, index) => (
                        <mesh
                            key={`pv-horizontal-${index}`}
                            position={[0, lineY, frontPanelZ + 0.015]}
                            geometry={horizontalCellGeometry}
                            material={cellLineMaterial}
                        />
                    ))}

                    {/* Aluminiumrahmen */}
                    <mesh position={[0, höhe / 2 - 0.04, 0]} geometry={frameHorizontalGeometry} material={frameMaterial} />
                    <mesh position={[0, -höhe / 2 + 0.04, 0]} geometry={frameHorizontalGeometry} material={frameMaterial} />
                    <mesh position={[-breite / 2 + 0.04, 0, 0]} geometry={frameVerticalGeometry} material={frameMaterial} />
                    <mesh position={[breite / 2 - 0.04, 0, 0]} geometry={frameVerticalGeometry} material={frameMaterial} />

                    {/* Zentrale weiße Trägerschiene */}
                    <mesh position={[0, 0, 0]} geometry={centerRailGeometry} material={centerRailMaterial} />
                </>
            )}

            {kantenAnzeigen && (
                <lineSegments>
                    <primitive attach="geometry" object={edgeGeometry} />
                    <lineBasicMaterial attach="material" color={warningColor ?? borderColor} linewidth={2} />
                </lineSegments>
            )}
        </group>
    )
}
