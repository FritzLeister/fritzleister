import * as THREE from 'three'
import { useThree } from '@react-three/fiber'
import { useRef, useState, useEffect } from 'react'
import { useDrag } from '@use-gesture/react'
import Reflektor from './Reflektor'

// Schiebetür für Wände – zwei horizontal verschiebbare Flügel
export default function SchiebeTür({
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
    const openingArgs = obj ? [obj.value[0], obj.value[1]] : [2, 2.1]

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

    const { size, camera } = useThree()
    const groupRef = useRef()

    // Berechne Wandhöhe basierend auf Dachtyp
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
    const schiebeseite = obj?.schiebeseite ?? 'beide'
    const schieneLängeFürGrenzen = skaliertBreite * 2
    const schieneCenterXFuerGrenzen = schiebeseite === 'links'
        ? -skaliertBreite / 2
        : schiebeseite === 'rechts'
            ? skaliertBreite / 2
            : 0
    const minOffsetHorizontal = Math.min(-skaliertBreite / 2, schieneCenterXFuerGrenzen - schieneLängeFürGrenzen / 2)
    const maxOffsetHorizontal = Math.max(skaliertBreite / 2, schieneCenterXFuerGrenzen + schieneLängeFürGrenzen / 2)
    const randPuffer = 0.1

    const langeWandMin = xLinks - 1
    const langeWandMax = xRechts + 1

    const kurzeWandMin = zHinten - 1
    const kurzeWandMax = zVorne + 1

    const getAchsenGrenzen = (wandMin, wandMax, richtungsVorzeichen) => {
        if (richtungsVorzeichen >= 0) {
            return {
                min: wandMin + randPuffer - minOffsetHorizontal,
                max: wandMax - randPuffer - maxOffsetHorizontal
            }
        }

        return {
            min: wandMin + randPuffer + maxOffsetHorizontal,
            max: wandMax - randPuffer + minOffsetHorizontal
        }
    }

    // Grenzen für lange Wände (X-Achse)
    const xRichtungsVorzeichen = rechts ? -1 : 1
    const { min: minX, max: maxX } = getAchsenGrenzen(langeWandMin, langeWandMax, xRichtungsVorzeichen)

    // Grenzen für kurze Wände (Z-Achse)
    const zRichtungsVorzeichen = rechts ? 1 : -1
    const { min: minZ, max: maxZ } = getAchsenGrenzen(kurzeWandMin, kurzeWandMax, zRichtungsVorzeichen)

    // Grenzen für Y-Achse (vertikal auf der Wand)
    const minY = position[1] + (skaliertHöhe / 2) + 0.5 - 4
    const maxY = position[1] + wandHöhe - (skaliertHöhe / 2) - 1 - 4 + 1

    const handleClick = () => {
        const found = objs.find(o => o.id === objId)
        if (found) {
            window.activeArrowControl = { kind: 'wand-schiebetuer', id: objId }
            setSelectedObject(found)
            setEditMenü('Schiebetür-Bearbeiten')
        }
    }

    useEffect(() => {
        const handleKeyDown = (event) => {
            const active = window.activeArrowControl
            if (!active || active.kind !== 'wand-schiebetuer' || active.id !== objId) return

            const stepHorizontal = 3

            setGridPosi((prev) => {
                let newX = prev.x
                let newZ = prev.z

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
                    default:
                        return prev
                }

                return { x: newX, z: newZ, y: prev.y }
            })
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [objId, lang, rechts, minX, maxX, minZ, maxZ])

    const bind = useDrag(({ movement: [dragMoveX], first, last, memo }) => {
        const scale = 80 / size.width

        if (first) {
            memo = { startX: gridPosi.x, startZ: gridPosi.z }
        }

        if (lang) {
            const dragMultiplier = rechts ? -1 : 1
            let newX = Math.round(memo.startX + (dragMultiplier * dragMoveX * scale))
            newX = Math.max(minX, Math.min(maxX, newX))
            setGridPosi({ x: newX, z: gridPosi.z, y: gridPosi.y })
        } else {
            const dragMultiplier = rechts ? 1 : -1
            let newZ = Math.round(memo.startZ + (dragMultiplier * dragMoveX * scale))
            newZ = Math.max(minZ, Math.min(maxZ, newZ))
            setGridPosi({ x: gridPosi.x, z: newZ, y: gridPosi.y })
        }

        if (first) {
            window.activeArrowControl = { kind: 'wand-schiebetuer', id: objId }
            setOrbitKontrolle(false)
        }

        if (last) setOrbitKontrolle(true)

        return memo
    })

    const borderColor = isHovered ? '#5aa7ff' : '#000000'

    // Finale Position basierend auf Wandtyp
    const tiefe = 1.5
    const surfaceOffset = tiefe / 2 + 0.05
    const normalSign = rechts ? -1 : 1
    const finalX = lang ? gridPosi.x : (rechts ? xLinks : xRechts) + (!lang ? normalSign * surfaceOffset : 0)
    const finalZ = lang ? z + (lang ? normalSign * surfaceOffset : 0) : gridPosi.z
    
    const breite = skaliertBreite
    const höhe = skaliertHöhe

    const colorMap = {
        Weiß: '#c2c2c2',
        Grau: '#9b9b9b',
        Schwarz: '#2b2b2b'
    }
    const rahmenFarbe = colorMap[obj?.schiebetürSchienenFarbe ?? obj?.schienenFarbe] ?? '#9b858585'
    const türFüllFarbe = colorMap[obj?.schiebetürFüllFarbe ?? obj?.füllFarbe] ?? '#a8a5a1'
    const türFüllFarbeInnen = colorMap[obj?.schiebetürFüllFarbeInnen] ?? türFüllFarbe
    const reflektorFarbe = colorMap[obj?.reflektorFarbe] ?? colorMap.Weiß
    
    // Tür so positionieren, dass unteres Ende die Bodenplatte berührt
    const finalY = position[1] + 0.2 + (höhe / 2)

    // Schiebetür Layout:
    // - Schiebehalterung oben (doppelte Breite)
    // - Zwei Türflügel untereinander (jeder = breite/2)
    // - Griffe zeigen nach innen (zur Mitte)
    
    const flügelGap = 0.04  // Gap zwischen den Flügeln in Metern (einstellbar)
    const flügelBreite = (breite - flügelGap) / 2 - 0.05
    const flügel1X = -(breite - flügelGap) / 4  // Linker Flügel
    const flügel2X = (breite - flügelGap) / 4   // Rechter Flügel
    const schieneLänge = breite * 2  // Schiene ist doppelt so lang
    const schieneHöhe = 0.25      // Dicke der Schiene
    const öffnet = obj?.öffnet ?? 'innen'
    const schieneCenterX = schiebeseite === 'links'
        ? -breite / 2
        : schiebeseite === 'rechts'
            ? breite / 2
            : 0
    const schieneZ = öffnet === 'außen' ? tiefe / 2 - 0.1 : -tiefe / 2 + 0.1
    const istDoppeltür = schiebeseite === 'beide'
    const einzelBreite = breite - 0.05
    const einzelX = 0
    const einzelKnaufX = (einzelBreite / 2 - 0.15) * (schiebeseite === 'rechts' ? -1 : 1)
    const knaufHöhe = -höhe / 2 + 2  // Knäufe immer 1m über dem Boden

    // Rotationslogik so, dass lokale +Z immer "außen" der Wand ist
    let schiebetürRotation = [0, 0, 0]
    if (lang && rechts) schiebetürRotation = [0, Math.PI, 0]
    if (!lang && rechts) schiebetürRotation = [0, -Math.PI / 2, 0]
    if (!lang && !rechts) schiebetürRotation = [0, Math.PI / 2, 0]

    return (
        <group
            position={[finalX, finalY, finalZ]}
            ref={groupRef}
            {...bind()}
            onClick={handleClick}
            onPointerOver={() => setIsHovered(true)}
            onPointerOut={() => setIsHovered(false)}
            rotation={schiebetürRotation}
        >
            {oberflächenAnzeigen && (
                <>
                    {/* ========== SCHIEBEHALTERUNG OBEN ========== */}
                    {/* Schiene - oben, doppelt so lang wie Türbreite */}
                    <mesh position={[schieneCenterX, höhe / 2 + 0.1, schieneZ]}>
                        <boxGeometry args={[schieneLänge, schieneHöhe, 0.15]} />
                        <meshStandardMaterial color={rahmenFarbe} />
                    </mesh>

                    {istDoppeltür ? (
                        <>
                            {/* ========== LINKER TÜRFLÜGEL ========== */}
                            {/* Linker Flügel - Vorderseite */}
                            <mesh position={[flügel1X+0.05, 0, tiefe / 2 + 0.1]}>
                                <boxGeometry args={[flügelBreite, höhe - 0.15, tiefe * 0.1]} />
                                <meshStandardMaterial color={türFüllFarbe} />
                            </mesh>
                            {/* Linker Flügel - Rückseite */}
                            <mesh position={[flügel1X, 0, -tiefe / 2 - 0.1]}>
                                <boxGeometry args={[flügelBreite, höhe - 0.15, tiefe * 0.1]} />
                                <meshStandardMaterial color={türFüllFarbeInnen} />
                            </mesh>

                            {/* Linker Flügel - Rahmen oben */}
                            <mesh position={[flügel1X, höhe / 2 - 0.075, 0]}>
                                <boxGeometry args={[flügelBreite, 0.15, tiefe + 0.1]} />
                                <meshStandardMaterial color={rahmenFarbe} />
                            </mesh>
                            {/* Linker Flügel - Rahmen unten */}
                            <mesh position={[flügel1X, -höhe / 2 + 0.075, 0]}>
                                <boxGeometry args={[flügelBreite, 0.15, tiefe + 0.1]} />
                                <meshStandardMaterial color={rahmenFarbe} />
                            </mesh>
                            {/* Linker Flügel - Rahmen links (Außenseite) */}
                            <mesh position={[flügel1X - flügelBreite / 2 + 0.075, 0, 0]}>
                                <boxGeometry args={[0.15, höhe, tiefe + 0.1]} />
                                <meshStandardMaterial color={rahmenFarbe} />
                            </mesh>
                            {/* Linker Flügel - Rahmen rechts (Innenseite/Mittelpunkt) */}
                            <mesh position={[flügel1X + flügelBreite / 2 - 0.075, 0, 0]}>
                                <boxGeometry args={[0.15, höhe, tiefe + 0.1]} />
                                <meshStandardMaterial color={rahmenFarbe} />
                            </mesh>

                            {/* Linker Flügel - Griffe auf rechter Seite (Innenseite, zeigt nach rechts/Mitte) */}
                            <mesh position={[flügel1X + flügelBreite / 2 - 0.15, knaufHöhe, tiefe / 2 + 0.2]}>
                                <sphereGeometry args={[0.08, 16, 16]} />
                                <meshStandardMaterial color="#C0C0C0" metalness={0.8} roughness={0.2} />
                            </mesh>
                            <mesh position={[flügel1X + flügelBreite / 2 - 0.15, knaufHöhe, -tiefe / 2 - 0.2]}>
                                <sphereGeometry args={[0.08, 16, 16]} />
                                <meshStandardMaterial color="#C0C0C0" metalness={0.8} roughness={0.2} />
                            </mesh>

                            {/* ========== RECHTER TÜRFLÜGEL ========== */}
                            {/* Rechter Flügel - Vorderseite */}
                            <mesh position={[flügel2X-0.05, 0, tiefe / 2 + 0.1]}>
                                <boxGeometry args={[flügelBreite, höhe - 0.15, tiefe * 0.1]} />
                                <meshStandardMaterial color={türFüllFarbe} />
                            </mesh>
                            {/* Rechter Flügel - Rückseite */}
                            <mesh position={[flügel2X, 0, -tiefe / 2 - 0.1]}>
                                <boxGeometry args={[flügelBreite, höhe - 0.15, tiefe * 0.1]} />
                                <meshStandardMaterial color={türFüllFarbeInnen} />
                            </mesh>

                            {/* Rechter Flügel - Rahmen oben */}
                            <mesh position={[flügel2X, höhe / 2 - 0.075, 0]}>
                                <boxGeometry args={[flügelBreite, 0.15, tiefe + 0.1]} />
                                <meshStandardMaterial color={rahmenFarbe} />
                            </mesh>
                            {/* Rechter Flügel - Rahmen unten */}
                            <mesh position={[flügel2X, -höhe / 2 + 0.075, 0]}>
                                <boxGeometry args={[flügelBreite, 0.15, tiefe + 0.1]} />
                                <meshStandardMaterial color={rahmenFarbe} />
                            </mesh>
                            {/* Rechter Flügel - Rahmen links (Innenseite/Mittelpunkt) */}
                            <mesh position={[flügel2X - flügelBreite / 2 + 0.075, 0, 0]}>
                                <boxGeometry args={[0.15, höhe, tiefe + 0.1]} />
                                <meshStandardMaterial color={rahmenFarbe} />
                            </mesh>
                            {/* Rechter Flügel - Rahmen rechts (Außenseite) */}
                            <mesh position={[flügel2X + flügelBreite / 2 - 0.075, 0, 0]}>
                                <boxGeometry args={[0.15, höhe, tiefe + 0.1]} />
                                <meshStandardMaterial color={rahmenFarbe} />
                            </mesh>

                            {/* Rechter Flügel - Griffe auf linker Seite (Innenseite, zeigt nach links/Mitte) */}
                            <mesh position={[flügel2X - flügelBreite / 2 + 0.15, knaufHöhe, tiefe / 2 + 0.2]}>
                                <sphereGeometry args={[0.08, 16, 16]} />
                                <meshStandardMaterial color="#C0C0C0" metalness={0.8} roughness={0.2} />
                            </mesh>
                            <mesh position={[flügel2X - flügelBreite / 2 + 0.15, knaufHöhe, -tiefe / 2 - 0.2]}>
                                <sphereGeometry args={[0.08, 16, 16]} />
                                <meshStandardMaterial color="#C0C0C0" metalness={0.8} roughness={0.2} />
                            </mesh>
                        </>
                    ) : (
                        <>
                            {/* ========== EINZELFLÜGEL (links/rechts) ========== */}
                            {/* Einzelner Flügel - Vorderseite */}
                            <mesh position={[einzelX, 0, tiefe / 2 + 0.1]}>
                                <boxGeometry args={[einzelBreite, höhe - 0.15, tiefe * 0.1]} />
                                <meshStandardMaterial color={türFüllFarbe} />
                            </mesh>
                            {/* Einzelner Flügel - Rückseite */}
                            <mesh position={[einzelX, 0, -tiefe / 2 - 0.1]}>
                                <boxGeometry args={[einzelBreite, höhe - 0.15, tiefe * 0.1]} />
                                <meshStandardMaterial color={türFüllFarbeInnen} />
                            </mesh>

                            {/* Einzelner Flügel - Rahmen oben */}
                            <mesh position={[einzelX, höhe / 2 - 0.075, 0]}>
                                <boxGeometry args={[einzelBreite, 0.15, tiefe + 0.1]} />
                                <meshStandardMaterial color={rahmenFarbe} />
                            </mesh>
                            {/* Einzelner Flügel - Rahmen unten */}
                            <mesh position={[einzelX, -höhe / 2 + 0.075, 0]}>
                                <boxGeometry args={[einzelBreite, 0.15, tiefe + 0.1]} />
                                <meshStandardMaterial color={rahmenFarbe} />
                            </mesh>
                            {/* Einzelner Flügel - Rahmen links */}
                            <mesh position={[einzelX - einzelBreite / 2 + 0.075, 0, 0]}>
                                <boxGeometry args={[0.15, höhe, tiefe + 0.1]} />
                                <meshStandardMaterial color={rahmenFarbe} />
                            </mesh>
                            {/* Einzelner Flügel - Rahmen rechts */}
                            <mesh position={[einzelX + einzelBreite / 2 - 0.075, 0, 0]}>
                                <boxGeometry args={[0.15, höhe, tiefe + 0.1]} />
                                <meshStandardMaterial color={rahmenFarbe} />
                            </mesh>

                            {/* Einzelner Flügel - Knauf (zeigt weg von Schieberichtung) */}
                            <mesh position={[einzelX + einzelKnaufX, knaufHöhe, tiefe / 2 + 0.2]}>
                                <sphereGeometry args={[0.08, 16, 16]} />
                                <meshStandardMaterial color="#C0C0C0" metalness={0.8} roughness={0.2} />
                            </mesh>
                            <mesh position={[einzelX + einzelKnaufX, knaufHöhe, -tiefe / 2 - 0.2]}>
                                <sphereGeometry args={[0.08, 16, 16]} />
                                <meshStandardMaterial color="#C0C0C0" metalness={0.8} roughness={0.2} />
                            </mesh>
                        </>
                    )}
                </>
            )}

            {/* Umrandung */}
            {kantenAnzeigen && (
                <>
                    {/* Schiene Umrandung */}
                    <lineSegments position={[schieneCenterX, höhe / 2 + 0.1, schieneZ]}>
                        <edgesGeometry attach="geometry" args={[new THREE.BoxGeometry(schieneLänge, schieneHöhe, 0.15)]} />
                        <lineBasicMaterial attach="material" color={borderColor} linewidth={2} />
                    </lineSegments>
                    {/* Türrahmen Umrandung */}
                    <lineSegments>
                        <edgesGeometry attach="geometry" args={[new THREE.BoxGeometry(breite, höhe, tiefe * 0.2)]} />
                        <lineBasicMaterial attach="material" color={borderColor} linewidth={2} />
                    </lineSegments>
                </>
            )}

            {/* Reflektor */}
            {(obj?.reflektor === 'klein' || obj?.reflektor === 'groß') && (
                <Reflektor
                    position={[0, höhe / 2 + 0.6, 0.5]}
                    breite={obj?.reflektor === 'groß' ? 1.0 : 0.7}
                    höhe={obj?.reflektor === 'groß' ? 0.7 : 0.4}
                    farbe={reflektorFarbe}
                />
            )}
        </group>
    )
}
