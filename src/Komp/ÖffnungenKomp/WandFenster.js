
import * as THREE from 'three'
import { useThree } from '@react-three/fiber'
import { useRef, useState, useEffect } from 'react'
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

    const skaliertBreite = openingArgs[0] * 2.5
    const skaliertHöhe = openingArgs[1] * 2.5
    const halbeFensterBreite = skaliertBreite / 2
    const randPuffer = 0.1

    const langeWandMin = xLinks
    const langeWandMax = xRechts

    const kurzeWandMin = zHinten
    const kurzeWandMax = zVorne

    // Grenzen für lange Wände (X-Achse)
    const minX = langeWandMin + halbeFensterBreite + randPuffer
    const maxX = langeWandMax - halbeFensterBreite - randPuffer

    // Grenzen für kurze Wände (Z-Achse)
    const minZ = kurzeWandMin + halbeFensterBreite + randPuffer
    const maxZ = kurzeWandMax - halbeFensterBreite - randPuffer

    // Grenzen für Y-Achse (vertikal auf der Wand)
    // minY: ab wo die Massivwand aufhört
    // maxY: bis zum Dachansatz
    // +4 Offset wird bei der Position addiert, daher abziehen
    const minY = position[1] + (skaliertHöhe / 2) + 0.5 - 4
    const maxY = position[1] + wandHöhe - (skaliertHöhe / 2) - 1 - 4 + 1

    const handleClick = () => {
        const found = objs.find(o => o.id === objId)
        if (found) {
            window.activeArrowControl = { kind: 'wand-fenster', id: objId }
            setSelectedObject(found)
            setEditMenü('Fenster-Bearbeiten')
        }
    }

    useEffect(() => {
        const handleKeyDown = (event) => {
            const active = window.activeArrowControl
            if (!active || active.kind !== 'wand-fenster' || active.id !== objId) return

            const stepHorizontal = 3
            const stepVertical = 0.25

            setGridPosi((prev) => {
                let newX = prev.x
                let newZ = prev.z
                let newY = prev.y

                switch (event.key) {
                    case 'ArrowLeft':
                        if (lang) {
                            newX = prev.x + (rechts ? stepHorizontal : -stepHorizontal)
                            newX = Math.max(minX, Math.min(maxX, newX))
                        } else {
                            newZ = prev.z - (rechts ? stepHorizontal : -stepHorizontal)
                            newZ = Math.max(minZ, Math.min(maxZ, newZ))
                        }
                        event.preventDefault()
                        break
                    case 'ArrowRight':
                        if (lang) {
                            newX = prev.x + (rechts ? -stepHorizontal : stepHorizontal)
                            newX = Math.max(minX, Math.min(maxX, newX))
                        } else {
                            newZ = prev.z + (rechts ? stepHorizontal : -stepHorizontal)
                            newZ = Math.max(minZ, Math.min(maxZ, newZ))
                        }
                        event.preventDefault()
                        break
                    case 'ArrowUp':
                        newY = prev.y + stepVertical
                        newY = Math.max(minY, Math.min(maxY, newY))
                        event.preventDefault()
                        break
                    case 'ArrowDown':
                        newY = prev.y - stepVertical
                        newY = Math.max(minY, Math.min(maxY, newY))
                        event.preventDefault()
                        break
                    default:
                        return prev
                }

                return { x: newX, z: newZ, y: newY }
            })
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [objId, lang, rechts, minX, maxX, minZ, maxZ, minY, maxY])

    const bind = useDrag(({ movement: [dragMoveX, dragMoveY], first, last, memo }) => {
        const scale = 80 / size.width
        const scaleY = scale * 0.05

        if (first) {
            memo = { startX: gridPosi.x, startZ: gridPosi.z, startY: gridPosi.y }
        }

        // Y-Achse (vertikal) - funktioniert immer
        let newY = memo.startY - (dragMoveY * scaleY)
        newY = Math.max(minY, Math.min(maxY, newY))

        if (lang) {
            // Lange Wand: X-Achse bewegen (Richtung abhängig von rechts)
            const dragMultiplier = rechts ? -1 : 1
            let newX = Math.round(memo.startX + (dragMultiplier * dragMoveX * scale))
            newX = Math.max(minX, Math.min(maxX, newX))
            setGridPosi({ x: newX, z: gridPosi.z, y: newY })

            if (first) {
                window.activeArrowControl = { kind: 'wand-fenster', id: objId }
                setOrbitKontrolle(false)
                const dir = rechts ? -1 : 1
                // camera.position.set(0, 40, dir * 180)
            }
        } else {
            // Kurze Wand: Z-Achse bewegen (Richtung abhängig von rechts)
            const dragMultiplier = rechts ? 1 : -1
            let newZ = Math.round(memo.startZ + (dragMultiplier * dragMoveX * scale))
            newZ = Math.max(minZ, Math.min(maxZ, newZ))
            setGridPosi({ x: gridPosi.x, z: newZ, y: newY })

            if (first) {
                window.activeArrowControl = { kind: 'wand-fenster', id: objId }
                setOrbitKontrolle(false)
                const dir = rechts ? -1 : 1
                // camera.position.set(dir * 180, 40, 0)
            }
        }

        if (last) setOrbitKontrolle(true)

        return memo
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

    const breite = skaliertBreite
    const höhe = skaliertHöhe
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