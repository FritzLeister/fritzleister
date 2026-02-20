import * as THREE from 'three'
import { useThree } from '@react-three/fiber'
import { useRef, useState, useEffect } from 'react'
import { useDrag } from '@use-gesture/react'

// Transparente Öffnung für Dach (mit Winkelrotation)
export default function DachLeeröffnung({
    gebäudeHöhe,
    position,
    bodenBreite,
    bodenLänge,
    setOrbitKontrolle,
    setSelectedObject,
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

    const längeLangeSeite = xRechts - xLinks
    const traufhöhe = y + 4.5 + gebäudeHöhe

    const { size, camera } = useThree()
    const groupRef = useRef()

    // Verwende startPos falls verfügbar, ansonsten Mitte des Dachs
    const initialX = obj?.startPos?.x ?? x
    const initialZ = obj?.startPos?.z ?? z
    const [gridPosi, setGridPosi] = useState({ x: initialX, z: initialZ })
    const [isHovered, setIsHovered] = useState(false)

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

            const yStart = traufhöhe + zusatzHöheMitte - 11
            const yEnd = traufhöhe - 11
            const yDiff = yEnd - yStart

            rotation = Math.atan2(yDiff, zLänge)
            
            // Y-Position basierend auf Z-Position interpolieren
            const zNormalized = (gridPosi.z - zStart) / zLänge
            finalY = yStart + (yDiff * zNormalized)
            finalZ = gridPosi.z
            finalX = gridPosi.x
        }
    } else if (dachArt === 'flachdach') {
        const zStart = zVorne + 1
        const zEnd = zHinten - 1
        
        rotation = 0
        
        // Flachdach: Y-Position bleibt konstant
        finalY = traufhöhe - 4
        finalZ = gridPosi.z
        finalX = gridPosi.x
    }

    // Grenzen für Bewegung - beachte die Breite und Höhe der Öffnung
    const minX = xLinks + (openingArgs[0] / 2) + 1
    const maxX = xRechts - (openingArgs[0] / 2) - 1
    let minZ = zHinten + (openingArgs[1] / 2) + 1
    let maxZ = zVorne - (openingArgs[1] / 2) - 1

    // Satteldach: Öffnung darf nicht über die Firstkante (z) ragen
    if (dachArt === 'satteldach') {
        if (vorne) {
            // Vordere Seite: von First (z = oben) bis Traufe (zVorne = unten)
            minZ = z - (openingArgs[1] / 2) + 1
            maxZ = zVorne - (openingArgs[1] / 2) - 1
        } else {
            // Hintere Seite: von Traufe (zHinten = unten) bis First (z = oben)
            minZ = zHinten + (openingArgs[1] / 2) - 1
            maxZ = z - (openingArgs[1] / 2) + 1
        }
    }

    const handleClick = () => {
        const found = objs.find(o => o.id === objId)
        if (found) {
            window.activeDachPaneelId = objId
            setSelectedObject(found)
            setEditMenü('LeerÖffnung-Bearbeiten')
        }
    }

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (window.activeDachPaneelId !== objId) return

            const gridSize = 3
            const step = gridSize

            setGridPosi(prev => {
                let newX = prev.x
                let newZ = prev.z

                switch (event.key) {
                    case 'ArrowLeft':
                        if (vorne) {
                            newX = prev.x - step
                        } else {
                            newX = prev.x + step
                        }
                        newX = Math.max(minX, Math.min(maxX, newX))
                        event.preventDefault()
                        break
                    case 'ArrowRight':
                        if (vorne) {
                            newX = prev.x + step
                        } else {
                            newX = prev.x - step
                        }
                        newX = Math.max(minX, Math.min(maxX, newX))
                        event.preventDefault()
                        break
                    case 'ArrowUp':
                        if (vorne) {
                            newZ = prev.z - step
                        } else {
                            newZ = prev.z + step
                        }
                        newZ = Math.max(minZ, Math.min(maxZ, newZ))
                        event.preventDefault()
                        break
                    case 'ArrowDown':
                        if (vorne) {
                            newZ = prev.z + step
                        } else {
                            newZ = prev.z - step
                        }
                        newZ = Math.max(minZ, Math.min(maxZ, newZ))
                        event.preventDefault()
                        break
                    default:
                        return prev
                }

                return { x: newX, z: newZ }
            })
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [objId, minX, maxX, minZ, maxZ, vorne])

    const bind = useDrag(({ offset: [offsetX, offsetY], first, last }) => {
        if (!obj) return

        const scale = 30 / size.width
        
        // X-Achse (entlang des Dachs) - Richtung abhängig von vorne
        let newX = vorne ? x + (offsetX * scale) : x - (offsetX * scale)
        newX = Math.max(minX, Math.min(maxX, newX))
        
        // Z-Position bleibt konstant
        setGridPosi({ x: newX, z: gridPosi.z })

        if (first) {
            window.activeDachPaneelId = objId
            setOrbitKontrolle(false)
            camera.position.set(0, 80, vorne ? 140 : -140)
        }

        if (last) setOrbitKontrolle(true)
    })

    const borderColor = isHovered ? '#5aa7ff' : '#000000'

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
                    <boxGeometry args={[openingArgs[0], openingArgs[1], 1]} />
                    <meshStandardMaterial
                        color="#87CEEB"
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
                    <edgesGeometry attach="geometry" args={[new THREE.BoxGeometry(openingArgs[0], openingArgs[1], 1)]} />
                    <lineBasicMaterial attach="material" color={borderColor} linewidth={2} />
                </lineSegments>
            )}
        </group>
    )
}
