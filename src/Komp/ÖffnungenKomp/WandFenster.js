
import * as THREE from 'three'
import { useThree } from '@react-three/fiber'
import { useRef, useState, useEffect } from 'react'
import { useDrag } from '@use-gesture/react'
import { ENABLE_WANDFENSTER_ABSTAND_FEATURE } from '../../featureFlags'

import Reflektor from './Reflektor'

// Fenster für Wände – basiert auf LeerÖffnung Logik
export default function WandFenster({
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
    const gridPosiRef = useRef({ x: initialX, z: initialZ, y: initialY })
    const [isHovered, setIsHovered] = useState(false)

    useEffect(() => {
        gridPosiRef.current = gridPosi
    }, [gridPosi])

    const persistPosition = (nextPos) => {
        // Fenster bleibt mittig in der Wandstärke, damit innen und außen sichtbar sind
        const surfaceOffset = 0
        const normalSign = rechts ? -1 : 1
        
        // Berechne echte Position wie in finalX/finalZ
        const realX = lang ? nextPos.x : (rechts ? xLinks : xRechts) + (!lang ? normalSign * surfaceOffset : 0)
        const realZ = lang ? z + (lang ? normalSign * surfaceOffset : 0) : nextPos.z

        const nextAbstandRechtsRaw = lang
            ? (xRechts - halbeFensterBreite) - nextPos.x
            : (zVorne - halbeFensterBreite) - nextPos.z
        const nextAbstandUntenRaw = (nextPos.y + 4) - position[1] - (skaliertHöhe / 2)
        const nextAbstandRechts = Math.max(0, Number(nextAbstandRechtsRaw.toFixed(3)))
        const nextAbstandUnten = Math.max(0, Number(nextAbstandUntenRaw.toFixed(3)))

        if (!setObjs) return
        setObjs(prevObjs => prevObjs.map(item =>
            item.id === objId
                ? {
                    ...item,
                    ...(ENABLE_WANDFENSTER_ABSTAND_FEATURE
                        ? {
                            abstandRechts: nextAbstandRechts,
                            abstandUnten: nextAbstandUnten
                        }
                        : {}),
                    startPos: {
                        ...(item.startPos ?? {}),
                        x: realX,
                        y: nextPos.y, // gridPosi.y; world Y = +4 (added in Wand.js)
                        z: realZ
                    }
                }
                : item
        ))
        setSelectedObject(prev => {
            if (!prev || prev.id !== objId) return prev
            return {
                ...prev,
                ...(ENABLE_WANDFENSTER_ABSTAND_FEATURE
                    ? {
                        abstandRechts: nextAbstandRechts,
                        abstandUnten: nextAbstandUnten
                    }
                    : {}),
                startPos: {
                    ...(prev.startPos ?? {}),
                    x: realX,
                    y: nextPos.y,
                    z: realZ
                }
            }
        })
    }

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

    useEffect(() => {
        if (!ENABLE_WANDFENSTER_ABSTAND_FEATURE) return
        if (!obj) return

        const hasAbstandRechts = obj?.abstandRechts !== undefined && obj?.abstandRechts !== null
        const hasAbstandUnten = obj?.abstandUnten !== undefined && obj?.abstandUnten !== null
        if (!hasAbstandRechts && !hasAbstandUnten) return

        const distRechts = hasAbstandRechts ? Number(obj.abstandRechts) : 0
        const distUnten = hasAbstandUnten ? Number(obj.abstandUnten) : 0
        const safeDistRechts = Number.isFinite(distRechts) ? Math.max(0, distRechts) : 0
        const safeDistUnten = Number.isFinite(distUnten) ? Math.max(0, distUnten) : 0

        let nextX = gridPosiRef.current.x
        let nextZ = gridPosiRef.current.z

        if (lang) {
            nextX = (xRechts - halbeFensterBreite) - safeDistRechts
            nextX = Math.max(minX, Math.min(maxX, nextX))
        } else {
            nextZ = (zVorne - halbeFensterBreite) - safeDistRechts
            nextZ = Math.max(minZ, Math.min(maxZ, nextZ))
        }

        let nextY = position[1] + (skaliertHöhe / 2) + safeDistUnten - 4
        nextY = Math.max(minY, Math.min(maxY, nextY))

        const nextPos = { x: nextX, z: nextZ, y: nextY }
        const prevPos = gridPosiRef.current

        if (prevPos.x === nextPos.x && prevPos.y === nextPos.y && prevPos.z === nextPos.z) return

        gridPosiRef.current = nextPos
        setGridPosi(nextPos)
        // Synchronisiere sofort auch die gespeicherte startPos, damit CSG-Aussparung und Fenster deckungsgleich bleiben.
        persistPosition(nextPos)
    }, [obj, lang, xRechts, zVorne, halbeFensterBreite, minX, maxX, minZ, maxZ, minY, maxY, position, skaliertHöhe, persistPosition])

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
            const current = gridPosiRef.current
            let newX = current.x
            let newZ = current.z
            let newY = current.y

            switch (event.key) {
                case 'ArrowLeft':
                    if (lang) {
                        newX = Math.max(minX, Math.min(maxX, current.x + (rechts ? stepHorizontal : -stepHorizontal)))
                    } else {
                        newZ = Math.max(minZ, Math.min(maxZ, current.z - (rechts ? stepHorizontal : -stepHorizontal)))
                    }
                    event.preventDefault()
                    break
                case 'ArrowRight':
                    if (lang) {
                        newX = Math.max(minX, Math.min(maxX, current.x + (rechts ? -stepHorizontal : stepHorizontal)))
                    } else {
                        newZ = Math.max(minZ, Math.min(maxZ, current.z + (rechts ? stepHorizontal : -stepHorizontal)))
                    }
                    event.preventDefault()
                    break
                case 'ArrowUp':
                    newY = Math.max(minY, Math.min(maxY, current.y + stepVertical))
                    event.preventDefault()
                    break
                case 'ArrowDown':
                    newY = Math.max(minY, Math.min(maxY, current.y - stepVertical))
                    event.preventDefault()
                    break
                default:
                    return
            }

            const nextPos = { x: newX, z: newZ, y: newY }
            gridPosiRef.current = nextPos
            setGridPosi(nextPos)
            persistPosition(nextPos)
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [objId, lang, rechts, minX, maxX, minZ, maxZ, minY, maxY])

    const bind = useDrag(({ movement: [dragMoveX, dragMoveY], first, last, memo }) => {
        const scale = 80 / size.width
        const scaleY = scale * 0.5

        if (first) {
            memo = { startX: gridPosi.x, startZ: gridPosi.z, startY: gridPosi.y }
        }

        // Y-Achse (vertikal) - funktioniert immer
        let newY = memo.startY - (dragMoveY * scaleY)
        newY = Math.max(minY, Math.min(maxY, newY))

        let nextPos
        if (lang) {
            // Lange Wand: X-Achse bewegen (Richtung abhängig von rechts)
            const dragMultiplier = rechts ? -1 : 1
            let newX = Math.round(memo.startX + (dragMultiplier * dragMoveX * scale))
            newX = Math.max(minX, Math.min(maxX, newX))
            nextPos = { x: newX, z: gridPosi.z, y: newY }
            setGridPosi(nextPos)

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
            nextPos = { x: gridPosi.x, z: newZ, y: newY }
            setGridPosi(nextPos)

            if (first) {
                window.activeArrowControl = { kind: 'wand-fenster', id: objId }
                setOrbitKontrolle(false)
                const dir = rechts ? -1 : 1
                // camera.position.set(dir * 180, 40, 0)
            }
        }

        if (last) {
            persistPosition(nextPos)
            setOrbitKontrolle(true)
        }

        return memo
    })

    const borderColor = isHovered ? '#5aa7ff' : '#000000'

    // Finale Position basierend auf Wandtyp
    const tiefe = 0.7
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
                    {/* Fensterfläche – Glas */}
                    <mesh position={[0, 0, 0]}>
                        <boxGeometry args={[breite-0.1, höhe-0.1, tiefe]} />
                        <meshStandardMaterial
                            color="#a8d8f0"
                            transparent={true}
                            opacity={0.38}
                            roughness={0}
                            metalness={0.05}
                            depthWrite={false}
                        />
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