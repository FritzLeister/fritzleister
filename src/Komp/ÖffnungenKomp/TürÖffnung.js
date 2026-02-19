import * as THREE from 'three'
import { useThree } from '@react-three/fiber'
import { useRef, useState } from 'react'
import { useDrag } from '@use-gesture/react'

// Tür für Wände – basiert auf WandFenster Logik
export default function TürÖffnung({
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
            setEditMenü('Tür-Bearbeiten')
        }
    }

    const bind = useDrag(({ offset: [dragOffsetX, dragOffsetY], first, last }) => {
        const scale = 80 / size.width
        console.log(obj)

        if (lang) {
            // Lange Wand: X-Achse bewegen (Richtung abhängig von rechts)
            const dragMultiplier = rechts ? -1 : 1
            let newX = Math.round(dragMultiplier * dragOffsetX * scale) + x
            newX = Math.max(minX, Math.min(maxX, newX))
            setGridPosi({ x: newX, z: gridPosi.z, y: gridPosi.y })

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
            setGridPosi({ x: gridPosi.x, z: newZ, y: gridPosi.y })

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
    const tiefe = 1.5
    const surfaceOffset = tiefe / 2 + 0.05
    const normalSign = rechts ? -1 : 1
    const finalX = lang ? gridPosi.x : (rechts ? xLinks : xRechts) + (!lang ? normalSign * surfaceOffset : 0)
    const finalZ = lang ? z + (lang ? normalSign * surfaceOffset : 0) : gridPosi.z
    
    const breite = openingArgs[0] * 1.9
    const höhe = openingArgs[1] * 0.9
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
                        <meshStandardMaterial color={rahmenFarbe} />
                    </mesh>

                    {/* Türblätter */}
                    <mesh position={[leftLeafCenterX, 0, tiefe / 2]}>
                        <boxGeometry args={[leafWidth - 0.15, höhe - 0.15, tiefe * 0.1]} />
                        <meshStandardMaterial color={türFüllFarbe} />
                    </mesh>
                    <mesh position={[leftLeafCenterX, 0, -tiefe / 2]}>
                        <boxGeometry args={[leafWidth - 0.15, höhe - 0.15, tiefe * 0.1]} />
                        <meshStandardMaterial color={türFüllFarbeInnen} />
                    </mesh>
                    {isDoubleDoor && (
                        <>
                            <mesh position={[rightLeafCenterX, 0, tiefe / 2]}>
                                <boxGeometry args={[leafWidth - 0.15, höhe - 0.15, tiefe * 0.1]} />
                                <meshStandardMaterial color={türFüllFarbe} />
                            </mesh>
                            <mesh position={[rightLeafCenterX, 0, -tiefe / 2]}>
                                <boxGeometry args={[leafWidth - 0.15, höhe - 0.15, tiefe * 0.1]} />
                                <meshStandardMaterial color={türFüllFarbeInnen} />
                            </mesh>
                        </>
                    )}

                    {/* Türrahmen oben */}
                    <mesh position={[0, höhe / 2 - 0.075, 0]}>
                        <boxGeometry args={[breite, 0.15, tiefe + 0.1]} />
                        <meshStandardMaterial color={rahmenFarbe} />
                    </mesh>

                    {/* Türrahmen unten */}
                    <mesh position={[0, -höhe / 2 + 0.075, 0]}>
                        <boxGeometry args={[breite, 0.15, tiefe + 0.1]} />
                        <meshStandardMaterial color={rahmenFarbe} />
                    </mesh>

                    {/* Türrahmen links */}
                    <mesh position={[-breite / 2 + 0.075, 0, 0]}>
                        <boxGeometry args={[0.15, höhe, tiefe + 0.1]} />
                        <meshStandardMaterial color={rahmenFarbe} />
                    </mesh>

                    {/* Türrahmen rechts */}
                    <mesh position={[breite / 2 - 0.075, 0, 0]}>
                        <boxGeometry args={[0.15, höhe, tiefe + 0.1]} />
                        <meshStandardMaterial color={rahmenFarbe} />
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
