import * as THREE from 'three'
import { useThree } from '@react-three/fiber'
import { useRef, useState, useEffect, useCallback } from 'react'
import { useDrag } from '@use-gesture/react'

// Transparentes Paneel für Dach – Positionierung analog DachLeeröffnung
export default function DachTransparentesPaneel({
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
    const obj = objs.find(o => o.id === objId)
    const openingArgs = obj ? [obj.value[0], obj.value[1]] : [3, 3]

    const x = position[0]
    const y = position[1]
    const z = position[2]

    const xLinks = x - 9 - (0.5 * (bodenLänge - 20))
    const xRechts = x + 9 + (0.5 * (bodenLänge - 20))
    const zVorne = z + 6.5 + (0.5 * (bodenBreite - 15))
    const zHinten = z - 6.5 - (0.5 * (bodenBreite - 15))
    const traufhöhe = y + 4.5 + gebäudeHöhe

    const { size, camera } = useThree()
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
    const [isHovered, setIsHovered] = useState(false)

    useEffect(() => {
        gridPosiRef.current = gridPosi
    }, [gridPosi])

    const persistPosition = useCallback((nextPos) => {
        if (!setObjs) return

        setObjs(prevObjs => prevObjs.map(item =>
            item.id === objId
                ? {
                    ...item,
                    startPos: {
                        ...(item.startPos ?? {}),
                        x: nextPos.x,
                        z: nextPos.z
                    }
                }
                : item
        ))

        setSelectedObject(prev => {
            if (!prev || prev.id !== objId) return prev
            return {
                ...prev,
                startPos: {
                    ...(prev.startPos ?? {}),
                    x: nextPos.x,
                    z: nextPos.z
                }
            }
        })
    }, [objId, setObjs, setSelectedObject])

    const updatePosition = useCallback((nextPos) => {
        gridPosiRef.current = nextPos
        setGridPosi(nextPos)
        persistPosition(nextPos)
    }, [persistPosition])

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

    const handleClick = () => {
        const found = objs.find(o => o.id === objId)
        if (found) {
            window.activeArrowControl = { kind: 'dach-transparentespaneel', id: objId }
            setSelectedObject(found)
            setEditMenü('TransparentesPaneel-Bearbeiten')
        }
    }

    // Tastatursteuerung mit Pfeiltasten (nur wenn dieses Paneel aktiv ist)
    useEffect(() => {
        const handleKeyDown = (event) => {
            // Nur reagieren wenn DIESES Paneel aktiv ist
            const active = window.activeArrowControl
            if (!active || active.kind !== 'dach-transparentespaneel' || active.id !== objId) return

            const gridSize = 3
            const step = gridSize

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
                        newX = Math.max(minX, Math.min(maxX, newX))
                        event.preventDefault()
                        break
                    case 'ArrowRight':
                        if (vorne) {
                            newX = current.x + step
                        } else {
                            newX = current.x - step
                        }
                        newX = Math.max(minX, Math.min(maxX, newX))
                        event.preventDefault()
                        break
                    case 'ArrowUp':
                        if (vorne) {
                            newZ = current.z - step
                        } else {
                            newZ = current.z + step
                        }
                        newZ = Math.max(minZ, Math.min(maxZ, newZ))
                        event.preventDefault()
                        break
                    case 'ArrowDown':
                        if (vorne) {
                            newZ = current.z + step
                        } else {
                            newZ = current.z - step
                        }
                        newZ = Math.max(minZ, Math.min(maxZ, newZ))
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

    const bind = useDrag(({ movement: [mx, my], first, last, memo }) => {
        const scale = 400 / size.width
        const zScale = 10 / size.width
        const gridSize = 0.6 // Feineres Raster für sofortiges Feedback

        let start = memo
        if (first || !start) {
            start = { x: gridPosiRef.current.x, z: gridPosiRef.current.z }
        }

        let newX = vorne ? start.x + (mx * scale) : start.x - (mx * scale)
        newX = Math.round(newX / gridSize) * gridSize // Auf Raster snappen
        newX = Math.max(minX, Math.min(maxX, newX))

        // Vertikale Bewegung auf dem Dach - Richtung ist unterschiedlich für vorne/hinten
        let newZ = vorne ? start.z + (my * zScale) : start.z - (my * zScale)
        newZ = Math.round(newZ / gridSize) * gridSize // Auf Raster snappen
        newZ = Math.max(minZ, Math.min(maxZ, newZ))

        updatePosition({ x: newX, z: newZ })

        if (first) {
            window.activeArrowControl = { kind: 'dach-transparentespaneel', id: objId }
            setOrbitKontrolle(false)
            camera.position.set(0, 125, vorne ? 40 : -40)
        }

        if (last) {
            setOrbitKontrolle(true)
        }

        return start
    })

    const borderColor = isHovered ? '#5aa7ff' : '#000000'
    const tiefe = 1.0
    const breite = openingArgs[0]
    const höhe = openingArgs[1]

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
                    {/* Transparente Fläche vorne */}
                    <mesh position={[0, 0, tiefe / 2 + 0.02]}>
                        <boxGeometry args={[breite - 0.12, höhe - 0.12, 0.05]} />
                        <meshStandardMaterial
                            color="#BFEFFF"
                            transparent
                            opacity={0.45}
                            depthWrite={false}
                            side={THREE.DoubleSide}
                            metalness={0.15}
                            roughness={0.15}
                        />
                    </mesh>

                    {/* Transparente Fläche hinten */}
                    <mesh position={[0, 0, -tiefe / 2 - 0.02]}>
                        <boxGeometry args={[breite - 0.12, höhe - 0.12, 0.05]} />
                        <meshStandardMaterial
                            color="#BFEFFF"
                            transparent
                            opacity={0.35}
                            depthWrite={false}
                            side={THREE.DoubleSide}
                            metalness={0.15}
                            roughness={0.2}
                        />
                    </mesh>

                    {/* Vertikale Profile */}
                    {Array.from({ length: Math.max(2, Math.floor((breite - 0.25) / 0.9)) + 1 }, (_, i) => {
                        const count = Math.max(2, Math.floor((breite - 0.25) / 0.9))
                        const startX = -((count * 0.9) / 2)
                        const px = startX + (i * 0.9)
                        const clampedX = Math.max(-breite / 2 + 0.12, Math.min(breite / 2 - 0.12, px))

                        return (
                            <group key={`dach-profil-${i}`}>
                                <mesh position={[clampedX, 0, tiefe / 2 + 0.04]}>
                                    <boxGeometry args={[0.05, höhe - 0.08, 0.05]} />
                                    <meshStandardMaterial color="#9fd3e6" />
                                </mesh>
                                <mesh position={[clampedX, 0, -tiefe / 2 - 0.04]}>
                                    <boxGeometry args={[0.05, höhe - 0.08, 0.05]} />
                                    <meshStandardMaterial color="#9fd3e6" />
                                </mesh>
                            </group>
                        )
                    })}

                    {/* Außenrahmen */}
                    <mesh position={[0, höhe / 2 - 0.04, 0]}>
                        <boxGeometry args={[breite, 0.08, tiefe + 0.05]} />
                        <meshStandardMaterial color="#9fd3e6" />
                    </mesh>
                    <mesh position={[0, -höhe / 2 + 0.04, 0]}>
                        <boxGeometry args={[breite, 0.08, tiefe + 0.05]} />
                        <meshStandardMaterial color="#9fd3e6" />
                    </mesh>
                    <mesh position={[-breite / 2 + 0.04, 0, 0]}>
                        <boxGeometry args={[0.08, höhe, tiefe + 0.05]} />
                        <meshStandardMaterial color="#9fd3e6" />
                    </mesh>
                    <mesh position={[breite / 2 - 0.04, 0, 0]}>
                        <boxGeometry args={[0.08, höhe, tiefe + 0.05]} />
                        <meshStandardMaterial color="#9fd3e6" />
                    </mesh>
                </>
            )}

            {kantenAnzeigen && (
                <lineSegments>
                    <edgesGeometry attach="geometry" args={[new THREE.BoxGeometry(breite, höhe, tiefe)]} />
                    <lineBasicMaterial attach="material" color={borderColor} linewidth={2} />
                </lineSegments>
            )}
        </group>
    )
}