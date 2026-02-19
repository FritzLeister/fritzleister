
import * as THREE from 'three'
import { useThree } from '@react-three/fiber'
import { useRef, useState } from 'react'
import { useDrag } from '@use-gesture/react'

import Reflektor from './Reflektor'

// Fenster für Wände – basiert auf LeerÖffnung Logik
export default function WandFenster({
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
    pultdachHöheDifferenz = 0
}) {
    const obj = objs.find(o => o.id === objId)
    const openingArgs = obj ? [obj.value[0], obj.value[1]] : [8, 6]

    const rechts = obj?.rechts ?? true // true = Rückseite, false = Vorderseite
    const lang = obj?.lang ?? true // true = lange Wand, false = kurze Wand

    const x = position[0]
    const y = position[1] + (gebäudeHöhe / 6) - 0.4 - ((gebäudeHöhe - 15) / 6) - 2 + ((openingArgs[1] - 1) / 4)

    // Positionierung wie bei Wand
    const zVorne = position[2] + 6.5 + (0.5 * (bodenBreite - 15))+1
    const zHinten = position[2] - 6.5 - (0.5 * (bodenBreite - 15))-1
    const z = rechts ? zHinten : zVorne

    // Für kurze Wände: x-Position an den Seiten
    const xLinks = position[0] - 6.5 - (0.5 * (bodenLänge - 15)) - 1
    const xRechts = position[0] + 6.5 + (0.5 * (bodenLänge - 15)) + 1

    const { size, camera } = useThree()
    const groupRef = useRef()

    // Berechne Wandhöhe basierend auf Dachtyp
    const traufhöhe = position[1] + 4.5 + gebäudeHöhe
    let wandHöhe = gebäudeHöhe
    if (dachArt === 'pultdach') {
        wandHöhe = rechts ? gebäudeHöhe : gebäudeHöhe + pultdachHöheDifferenz
    }

    // Verwende startPos, falls verfügbar
    const initialX = obj?.startPos?.x ?? x
    const initialZ = obj?.startPos?.z ?? position[2]
    const initialY = obj?.startPos?.y ?? y
    const [gridPosi, setGridPosi] = useState({ x: initialX, z: initialZ, y: initialY })
    const [isHovered, setIsHovered] = useState(false)

    // Grenzen für lange Wände (X-Achse)
    const minX = x - 7 + (openingArgs[0] - 16) / 2 - (bodenLänge - 30) / 2
    const maxX = x + 7 - (openingArgs[0] - 16) / 2 + (bodenLänge - 30) / 2

    // Grenzen für kurze Wände (Z-Achse)
    const minZ = position[2] - 7 + (openingArgs[0] - 16) / 2 - (bodenBreite - 30) / 2
    const maxZ = position[2] + 7 - (openingArgs[0] - 16) / 2 + (bodenBreite - 30) / 2

    // Grenzen für Y-Achse (vertikal auf der Wand)
    // minY: ab wo die Massivwand aufhört
    // maxY: bis zum Dachansatz
    // +4 Offset wird bei der Position addiert, daher abziehen
    const minY = position[1] + (openingArgs[1] / 2) + 0.5 - 4
    const maxY = position[1] + wandHöhe - (openingArgs[1] / 2) - 1 - 4 + 1

    const handleClick = () => {
        const found = objs.find(o => o.id === objId)
        if (found) {
            setSelectedObject(found)
            setEditMenü('Fenster-Bearbeiten')
        }
    }

    const bind = useDrag(({ offset: [dragOffsetX, dragOffsetY], first, last }) => {
        const scale = 80 / size.width
        const scaleY = scale * 0.05

        // Y-Achse (vertikal) - funktioniert immer
        let newY = gridPosi.y - (dragOffsetY * scaleY)
        newY = Math.max(minY, Math.min(maxY, newY))

        if (lang) {
            // Lange Wand: X-Achse bewegen (Richtung abhängig von rechts)
            const dragMultiplier = rechts ? -1 : 1
            let newX = Math.round(dragMultiplier * dragOffsetX * scale) + x
            newX = Math.max(minX, Math.min(maxX, newX))
            setGridPosi({ x: newX, z: gridPosi.z, y: newY })

            if (first) {
                setOrbitKontrolle(false)
                const dir = rechts ? -1 : 1
                // camera.position.set(0, 40, dir * 180)
            }
        } else {
            // Kurze Wand: Z-Achse bewegen (Richtung abhängig von rechts)
            const dragMultiplier = rechts ? 1 : -1
            let newZ = Math.round(dragMultiplier * dragOffsetX * scale) + position[2]
            newZ = Math.max(minZ, Math.min(maxZ, newZ))
            setGridPosi({ x: gridPosi.x, z: newZ, y: newY })

            if (first) {
                setOrbitKontrolle(false)
                const dir = rechts ? -1 : 1
                // camera.position.set(dir * 180, 40, 0)
            }
        }

        if (last) setOrbitKontrolle(true)
    })

    const borderColor = isHovered ? '#5aa7ff' : '#000000'

    // Finale Position basierend auf Wandtyp
    const tiefe = 0.7
    // const surfaceOffset = tiefe / 2 + 0.05
    const surfaceOffset = 0
    const normalSign = rechts ? -1 : 1
    const finalX = lang ? gridPosi.x : (rechts ? xLinks : xRechts) + (!lang ? normalSign * surfaceOffset : 0)
    const finalZ = lang ? z + (lang ? normalSign * surfaceOffset : 0) : gridPosi.z
    const finalY = gridPosi.y

    const breite = openingArgs[0]
    const höhe = openingArgs[1]
    const sprossenX = obj?.sprossenX ?? 0
    const sprossenY = obj?.sprossenY ?? 0
    // Fensterfarbe dynamisch
    const fensterFarbe = obj?.fensterFarbe ?? 'Weiß'
    const fensterFarbeNorm = String(fensterFarbe).toLowerCase()
    const fensterColor =
        fensterFarbeNorm === 'schwarz'
            ? 0x111111
            : fensterFarbeNorm === 'grau'
                ? 0x888888
                : 0xffffff
    const reflektorFarbe = obj?.reflektorFarbe ?? 'Weiß'
    const reflektorFarbeNorm = String(reflektorFarbe).toLowerCase()
    const reflektorColor =
        reflektorFarbeNorm === 'schwarz'
            ? 0x111111
            : reflektorFarbeNorm === 'grau'
                ? 0x888888
                : 0xffffff
    
    // Rotation für Fenster und Reflektor: 
    // lang true, rechts true: [0, 0, 0]
    // lang true, rechts false: [0, Math.PI, 0]
    // lang false, rechts true: [0, Math.PI / 2, 0]
    // lang false, rechts false: [0, -Math.PI / 2, 0]
    let fensterRotation = [0, Math.PI, 0] // Funktioniert endlichhhh
    if (lang && !rechts) fensterRotation = [0, 0, 0] // Funktioniert
    if (!lang && rechts) fensterRotation = [0, -Math.PI / 2, 0] // Funktioniert
    if (!lang && !rechts) fensterRotation = [0, Math.PI / 2, 0] // Funktioniert

    // Generiere horizontale Sprossen basierend auf sprossenY
    const horizontaleSprossen = Array.from({ length: sprossenY }, (_, i) => {
        const yPos = (i - (sprossenY - 1) / 2) * (höhe / (sprossenY + 1))
        return (
            <mesh key={`h-sprosse-${i}`} position={[0, yPos, 0]}>
                <boxGeometry args={[breite, 0.05, tiefe+0.1]} />
                <meshStandardMaterial color={fensterColor} />
            </mesh>
        )
    })

    // Generiere vertikale Sprossen basierend auf sprossenX
    const vertikaleSprossen = Array.from({ length: sprossenX }, (_, i) => {
        const xPos = (i - (sprossenX - 1) / 2) * (breite / (sprossenX + 1))
        return (
            <mesh key={`v-sprosse-${i}`} position={[xPos, 0, 0]}>
                <boxGeometry args={[0.05, höhe, tiefe+0.1]} />
                <meshStandardMaterial color={fensterColor} />
            </mesh>
        )
    })

    return (
        <group
            position={[finalX, finalY + 4, finalZ]}
            ref={groupRef}
            {...bind()}
            onClick={handleClick}
            onPointerOver={() => setIsHovered(true)}
            onPointerOut={() => setIsHovered(false)}
            rotation={fensterRotation}
        >
            {oberflächenAnzeigen && (
                <>
                    {/* Fensterfläche */}
                    <mesh position={[0, 0, 0]}>
                        <boxGeometry args={[breite-0.1, höhe-0.1, tiefe]} />
                        <meshStandardMaterial color="lightblue" />
                    </mesh>

                    {/* Oben */}
                    <mesh position={[0, höhe / 2 - 0.075, 0]}>
                        <boxGeometry args={[breite, 0.15, tiefe+0.1]} />
                        <meshStandardMaterial color={fensterColor} />
                    </mesh>

                    {/* Unten */}
                    <mesh position={[0, -höhe / 2 + 0.075, 0]}>
                        <boxGeometry args={[breite, 0.15, tiefe+0.1]} />
                        <meshStandardMaterial color={fensterColor} />
                    </mesh>

                    {/* Horizontale Sprossen */}
                    {horizontaleSprossen}

                    {/* Vertikale Sprossen */}
                    {vertikaleSprossen}

                    {/* Links */}
                    <mesh position={[-breite / 2 + 0.075, 0, 0]}>
                        <boxGeometry args={[0.15, höhe, tiefe+0.1]} />
                        <meshStandardMaterial color={fensterColor} />
                    </mesh>

                    {/* Rechts */}
                    <mesh position={[breite / 2 - 0.075, 0, 0]}>
                        <boxGeometry args={[0.15, höhe, tiefe+0.1]} />
                        <meshStandardMaterial color={fensterColor} />
                    </mesh>
                </>
            )}

            {/* Umrandung */}
            {kantenAnzeigen && (
                <lineSegments>
                    <edgesGeometry attach="geometry" args={[new THREE.BoxGeometry(breite, höhe, tiefe)]} />
                    <lineBasicMaterial attach="material" color={borderColor} linewidth={2} />
                </lineSegments>
            )}
            
            {(obj?.reflektor === 'klein' || obj?.reflektor === 'groß') && (
                <Reflektor
                    position={[0, höhe / 2 + 0.6, 0.5]}
                    breite={obj?.reflektor === 'groß' ? 1.0 : 0.7}
                    höhe={obj?.reflektor === 'groß' ? 0.7 : 0.4}
                    farbe={reflektorColor}
                    //rotation={fensterRotation}
                />
            )}

        </group>
    )
}