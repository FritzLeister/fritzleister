import * as THREE from 'three'
import { useThree } from '@react-three/fiber'
import { Base, Geometry, Subtraction } from '@react-three/csg'
import { useRef, useState, useEffect, useCallback } from 'react'
import { useDrag } from '@use-gesture/react'
import Reflektor from './Reflektor'
import { OPENING_POSITION_REFRESH_EVENT } from './PositionInfoSection'
import { computeWallSideDistances, dispatchOpeningPositionValues, persistOpeningPosition, OPENING_GRID_STEP, quantizeOpeningDistance, snapOpeningCoordinate } from './wallOpeningPositionUtils'
import { getOpeningCollisionReport } from '../openingUtils'

// SektionalTor für Wände – Garagentor mit horizontalen Paneelen
export default function SektionalTor({
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
    const openingArgs = obj ? [obj.value[0], obj.value[1]] : [4, 3]

    const rechts = obj?.rechts ?? true
    const lang = obj?.lang ?? true

    const x = position[0]
    const y = position[1] + (gebäudeHöhe / 6) - 0.4 - ((gebäudeHöhe - 15) / 6) - 2 + ((openingArgs[1] - 1) / 4)

    const zVorne = position[2] + 6.5 + (0.5 * (bodenBreite - 15))
    const zHinten = position[2] - 6.5 - (0.5 * (bodenBreite - 15))
    const z = rechts ? zHinten : zVorne

    const xLinks = position[0] - 6.5 - (0.5 * (bodenLänge - 15))
    const xRechts = position[0] + 6.5 + (0.5 * (bodenLänge - 15))

    const { size } = useThree()
    const groupRef = useRef()

    const initialX = obj?.startPos?.x ?? x
    const initialZ = obj?.startPos?.z ?? position[2]
    const initialY = obj?.startPos?.y ?? y
    const [gridPosi, setGridPosi] = useState({ x: initialX, z: initialZ, y: initialY })
    const gridPosiRef = useRef({ x: initialX, z: initialZ, y: initialY })
    const [isHovered, setIsHovered] = useState(false)

    const skaliertBreite = openingArgs[0] * 2.5
    const skaliertHöhe = openingArgs[1] * 2.5
    const halbeTorBreite = skaliertBreite / 2
    const randPuffer = 0.1

    const langeWandMin = xLinks - 1
    const langeWandMax = xRechts + 1

    const kurzeWandMin = zHinten - 1
    const kurzeWandMax = zVorne + 1

    const minX = langeWandMin + halbeTorBreite + randPuffer
    const maxX = langeWandMax - halbeTorBreite - randPuffer
    const minZ = kurzeWandMin + halbeTorBreite + randPuffer
    const maxZ = kurzeWandMax - halbeTorBreite - randPuffer

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
            halfWidth: halbeTorBreite
        })
        const distances = {
            abstandLinks: quantizeOpeningDistance(rawDistances.abstandLinks),
            abstandRechts: quantizeOpeningDistance(rawDistances.abstandRechts)
        }

        dispatchOpeningPositionValues(objId, distances)
        persistOpeningPosition({
            objId,
            setObjs,
            setSelectedObject,
            startPos: nextPos,
            distances
        })
    }, [halbeTorBreite, lang, objId, setObjs, setSelectedObject, xLinks, xRechts, zHinten, zVorne])

    useEffect(() => {
        const handleRefreshPosition = (event) => {
            if (event?.detail?.id !== objId) return
            persistPosition(gridPosiRef.current)
        }

        window.addEventListener(OPENING_POSITION_REFRESH_EVENT, handleRefreshPosition)
        return () => window.removeEventListener(OPENING_POSITION_REFRESH_EVENT, handleRefreshPosition)
    }, [objId, persistPosition])
    const handleClick = () => {
        const found = objs.find(o => o.id === objId)
        if (found) {
            window.activeArrowControl = { kind: 'wand-sektionaltor', id: objId }
            setSelectedObject(found)
            setEditMenü('SektionalTor-Bearbeiten')
        }
    }

    useEffect(() => {
        const handleKeyDown = (event) => {
            const active = window.activeArrowControl
            if (!active || active.kind !== 'wand-sektionaltor' || active.id !== objId) return

            const stepHorizontal = OPENING_GRID_STEP

            setGridPosi((prev) => {
                let newX = prev.x
                let newZ = prev.z

                switch (event.key) {
                    case 'ArrowLeft':
                        if (lang) {
                            newX = prev.x + (rechts ? stepHorizontal : -stepHorizontal)
                            newX = snapOpeningCoordinate(newX, minX, minX, maxX)
                        } else {
                            newZ = prev.z - (rechts ? stepHorizontal : -stepHorizontal)
                            newZ = snapOpeningCoordinate(newZ, minZ, minZ, maxZ)
                        }
                        event.preventDefault()
                        break
                    case 'ArrowRight':
                        if (lang) {
                            newX = prev.x + (rechts ? -stepHorizontal : stepHorizontal)
                            newX = snapOpeningCoordinate(newX, minX, minX, maxX)
                        } else {
                            newZ = prev.z + (rechts ? stepHorizontal : -stepHorizontal)
                            newZ = snapOpeningCoordinate(newZ, minZ, minZ, maxZ)
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
            let newX = memo.startX + (dragMultiplier * dragMoveX * scale)
            newX = snapOpeningCoordinate(newX, minX, minX, maxX)
            setGridPosi({ x: newX, z: gridPosi.z, y: gridPosi.y })

            if (first) {
                window.activeArrowControl = { kind: 'wand-sektionaltor', id: objId }
                setOrbitKontrolle(false)
            }
        } else {
            const dragMultiplier = rechts ? 1 : -1
            let newZ = memo.startZ + (dragMultiplier * dragMoveX * scale)
            newZ = snapOpeningCoordinate(newZ, minZ, minZ, maxZ)
            setGridPosi({ x: gridPosi.x, z: newZ, y: gridPosi.y })

            if (first) {
                window.activeArrowControl = { kind: 'wand-sektionaltor', id: objId }
                setOrbitKontrolle(false)
            }
        }

        if (last) setOrbitKontrolle(true)

        return memo
    })

    const borderColor = isHovered ? '#5aa7ff' : '#000000'

    const tiefe = 1.5
    const surfaceOffset = tiefe / 2 + 0.05
    const normalSign = rechts ? -1 : 1
    const finalX = lang ? gridPosi.x : (rechts ? xLinks : xRechts) + (!lang ? normalSign * surfaceOffset : 0)
    const finalZ = lang ? z + (lang ? normalSign * surfaceOffset : 0) : gridPosi.z

    const breite = skaliertBreite
    const höhe = skaliertHöhe

    const colorMap = {
        Weiß: '#c8c8c8',
        Grau: '#9b9b9b',
        Schwarz: '#2b2b2b'
    }

    const sektionalTorFarbe = colorMap[obj?.sektionalTorFarbe] ?? '#8B8B8B'
    const sektionalTorFüllFarbe = colorMap[obj?.sektionalTorFüllFarbe] ?? '#685e5e'
    const sektionalTorFüllFarbeInnen = colorMap[obj?.sektionalTorFüllFarbeInnen] ?? sektionalTorFüllFarbe
    const reflektorFarbe = colorMap[obj?.sektionalTorReflektorFarbe] ?? '#e6e6e6'

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
    const warningColor = collisionReport.hasCollision ? '#d11a2a' : sektionalTorFarbe
    const warningFillColorInnen = collisionReport.hasCollision ? '#d11a2a' : sektionalTorFüllFarbeInnen

    // Rotation logic
    let sektionalTorRotation = [0, 0, 0]
    if (lang && !rechts) sektionalTorRotation = [0, 0, 0]
    if (lang && rechts) sektionalTorRotation = [0, Math.PI, 0]
    if (!lang && rechts) sektionalTorRotation = [0, -Math.PI / 2, 0]
    if (!lang && !rechts) sektionalTorRotation = [0, Math.PI / 2, 0]

    // Panel system: 4 horizontal panels
    const panelCount = 4
    const panelHeight = höhe / panelCount
    const panelGap = 0.05
    const panelInsetX = 0.15
    const panelInsetY = panelGap
    const transparentPanelMarginX = 0.35
    const transparentPanelMarginY = 0.2
    const glassThickness = 0.05

    // Transparente Füllung
    const transparentePaneele = obj?.transparentePaneele ? String(obj.transparentePaneele).split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n) && n >= 1 && n <= panelCount) : []
    const fensterstreifenHöhe = obj?.fensterstreifenHöhe != null ? obj.fensterstreifenHöhe * 2.5 : null
    const transparentePaneeleSet = new Set(transparentePaneele)

    // Schlupftür
    const hatSchlupftür = obj?.schlupftür === 'ja'
    const schlupftürBreite = hatSchlupftür ? ((obj?.schlupftürBreite ?? 0.9) * 2.5) : 0
    const schlupftürHöhe = hatSchlupftür ? ((obj?.schlupftürHöhe ?? 2.1) * 2.5) : 0
    const schlupftürDistanzX = hatSchlupftür ? ((obj?.schlupftürDistanzX ?? 0) * 2.5) : 0
    const schlupftürMaxDistanzX = Math.max(0+0.1, (breite - schlupftürBreite) / 2-0.1)
    const schlupftürDistanzXBegrenzt = Math.max(-schlupftürMaxDistanzX, Math.min(schlupftürMaxDistanzX, schlupftürDistanzX))
    const schlupftürOrientierung = hatSchlupftür ? (obj?.schlupftürOrientierung ?? 'links') : 'links'
    const schlupftürXOffset = schlupftürOrientierung === 'rechts' ? schlupftürDistanzXBegrenzt : -schlupftürDistanzXBegrenzt
    const schlupftürRahmenTiefe = 0.077
    const schlupftürRahmenFarbe = '#776c6c'

    const panelOpeningVolumes = Array.from({ length: panelCount }, (_, i) => {
        const panelIndex = panelCount - i
        const yPos = (höhe / 2) - (i * panelHeight) - (panelHeight / 2)
        const isTransparent = transparentePaneeleSet.has(panelIndex)
        const hasFensterstreifen = transparentePaneele.length === 0 && fensterstreifenHöhe && fensterstreifenHöhe > 0
        const fensterstreifenRelativeHöhe = hasFensterstreifen ? Math.min(fensterstreifenHöhe, panelHeight - 0.2) : 0

        if (isTransparent) {
            return {
                id: `sektional-panel-${panelIndex}`,
                position: [0, yPos, 0],
                size: [
                    Math.max(0.1, breite - (transparentPanelMarginX * 2)),
                    Math.max(0.1, panelHeight - panelGap - transparentPanelMarginY),
                    tiefe + 0.3
                ],
                glassSize: [
                    Math.max(0.1, breite - (transparentPanelMarginX * 2)),
                    Math.max(0.1, panelHeight - panelGap - transparentPanelMarginY),
                    glassThickness
                ]
            }
        }

        if (hasFensterstreifen && fensterstreifenRelativeHöhe > 0) {
            return {
                id: `sektional-fensterstreifen-${panelIndex}`,
                position: [0, yPos, 0],
                size: [Math.max(0.1, breite - 0.5), fensterstreifenRelativeHöhe, tiefe + 0.3],
                glassSize: [Math.max(0.1, breite - 0.5), fensterstreifenRelativeHöhe, glassThickness]
            }
        }

        return null
    }).filter(Boolean)

    const renderTransparentGlass = (volume, side) => (
        <mesh
            key={`${volume.id}-${side}`}
            position={[
                volume.position[0],
                volume.position[1],
                side === 'front' ? (tiefe / 2) + 0.03 : (-tiefe / 2) - 0.03
            ]}
        >
            <boxGeometry args={volume.glassSize} />
            <meshStandardMaterial
                color="#BFEFFF"
                transparent
                opacity={0.18}
                depthWrite={false}
                side={THREE.DoubleSide}
                metalness={0.15}
                roughness={0.08}
            />
        </mesh>
    )

    return (
        <group
            position={[finalX, finalY, finalZ]}
            ref={groupRef}
            {...bind()}
            onClick={handleClick}
            onPointerOver={() => setIsHovered(true)}
            onPointerOut={() => setIsHovered(false)}
            rotation={sektionalTorRotation}
        >
            {oberflächenAnzeigen && (
                <>
                    {/* Rahmen Hintergrund */}
                    <mesh position={[0, 0, 0]}>
                        <Geometry>
                            <Base>
                                <boxGeometry args={[breite, höhe, tiefe]} />
                            </Base>
                            {panelOpeningVolumes.map((volume) => (
                                <Subtraction key={volume.id} position={volume.position}>
                                    <boxGeometry args={volume.size} />
                                </Subtraction>
                            ))}
                        </Geometry>
                        <meshStandardMaterial color={warningColor} />
                    </mesh>

                    {/* Horizontale Paneele */}
                    {Array.from({ length: panelCount }, (_, i) => {
                        const panelIndex = panelCount - i // Top panel = 1, bottom panel = panelCount
                        const yPos = (höhe / 2) - (i * panelHeight) - (panelHeight / 2)
                        const isTransparent = transparentePaneele.includes(panelIndex)
                        const panelColor = isTransparent ? 'rgba(200, 220, 255, 0.4)' : sektionalTorFüllFarbe

                        // Fensterstreifen: transparenter Bereich innerhalb des Panels
                        const hasFensterstreifen = transparentePaneele.length === 0 && fensterstreifenHöhe && fensterstreifenHöhe > 0
                        const fensterstreifenRelativeHöhe = hasFensterstreifen ? Math.min(fensterstreifenHöhe, panelHeight - 0.2) : 0

                        return (
                            <group key={`panel-${i}`}>
                                {/* Panel Vorderseite */}
                                <mesh position={[0, yPos, tiefe / 2]}>
                                    <boxGeometry args={[breite - panelInsetX, panelHeight - panelInsetY, tiefe * 0.1]} />
                                    {isTransparent ? (
                                        <meshStandardMaterial 
                                            color="lightblue" 
                                            transparent={true} 
                                            opacity={0.18} 
                                            depthWrite={false}
                                            side={THREE.DoubleSide}
                                        />
                                    ) : (
                                        <meshStandardMaterial color={collisionReport.hasCollision ? '#d11a2a' : panelColor} />
                                    )}
                                </mesh>

                                {/* Panel Rückseite */}
                                <mesh position={[0, yPos, -tiefe / 2]}>
                                    <boxGeometry args={[breite - panelInsetX, panelHeight - panelInsetY, tiefe * 0.1]} />
                                    {isTransparent ? (
                                        <meshStandardMaterial 
                                            color="lightblue" 
                                            transparent={true} 
                                            opacity={0.18} 
                                            depthWrite={false}
                                            side={THREE.DoubleSide}
                                        />
                                    ) : (
                                        <meshStandardMaterial color={warningFillColorInnen} />
                                    )}
                                </mesh>

                                {/* Fensterstreifen im Panel */}
                                {hasFensterstreifen && !isTransparent && (
                                    <>
                                        <mesh position={[0, yPos, tiefe / 2 + 0.05]}>
                                            <boxGeometry args={[breite - 0.5, fensterstreifenRelativeHöhe, 0.05]} />
                                            <meshStandardMaterial 
                                                color="lightblue" 
                                                transparent={true} 
                                                opacity={0.22} 
                                            />
                                        </mesh>
                                        <mesh position={[0, yPos, -tiefe / 2 - 0.05]}>
                                            <boxGeometry args={[breite - 0.5, fensterstreifenRelativeHöhe, 0.05]} />
                                            <meshStandardMaterial 
                                                color="lightblue" 
                                                transparent={true} 
                                                opacity={0.22} 
                                            />
                                        </mesh>
                                    </>
                                )}

                                {/* Panel-Trennlinien (horizontale Rillen) */}
                                {i < panelCount - 1 && (
                                    <mesh position={[0, yPos - (panelHeight / 2), 0]}>
                                        <boxGeometry args={[breite, panelGap, tiefe + 0.1]} />
                                        <meshStandardMaterial color={warningColor} />
                                    </mesh>
                                )}

                                {/* Panel Umrandung - alle Kanten des 3D-Quaders */}
                                <lineSegments position={[0, yPos, 0]}>
                                    <edgesGeometry attach="geometry" args={[new THREE.BoxGeometry(breite - panelInsetX, panelHeight - panelInsetY, tiefe * 0.1)]} />
                                    <lineBasicMaterial attach="material" color="#000000" linewidth={2} />
                                </lineSegments>
                            </group>
                        )
                    })}

                    {panelOpeningVolumes.map((volume) => renderTransparentGlass(volume, 'front'))}
                    {panelOpeningVolumes.map((volume) => renderTransparentGlass(volume, 'back'))}

                    {/* Rahmen oben */}
                    <mesh position={[0, höhe / 2 - 0.075, 0]}>
                        <boxGeometry args={[breite, 0.15, tiefe + 0.1]} />
                        <meshStandardMaterial color={warningColor} />
                    </mesh>

                    {/* Rahmen unten */}
                    <mesh position={[0, -höhe / 2 + 0.075, 0]} >
                        <boxGeometry args={[breite, 0.15, tiefe + 0.1]} />
                        <meshStandardMaterial color={warningColor} />
                    </mesh>

                    {/* Rahmen links */}
                    <mesh position={[-breite / 2 + 0.075, 0, 0]}>
                        <boxGeometry args={[0.15, höhe, tiefe + 0.1]} />
                        <meshStandardMaterial color={warningColor} />
                    </mesh>

                    {/* Rahmen rechts */}
                    <mesh position={[breite / 2 - 0.075, 0, 0]}>
                        <boxGeometry args={[0.15, höhe, tiefe + 0.1]} />
                        <meshStandardMaterial color={warningColor} />
                    </mesh>

                    {/* Schlupftür */}
                    {hatSchlupftür && (
                        <group position={[schlupftürXOffset, -höhe / 2 + schlupftürHöhe / 2, 0]}>
                            {/* Schlupftür Rahmen vorne */}
                            <mesh position={[0, schlupftürHöhe / 2, tiefe / 2 + schlupftürRahmenTiefe / 2]}>
                                <boxGeometry args={[schlupftürBreite, 0.03, schlupftürRahmenTiefe]} />
                                <meshStandardMaterial color={schlupftürRahmenFarbe} />
                            </mesh>
                            <mesh position={[0, -schlupftürHöhe / 2, tiefe / 2 + schlupftürRahmenTiefe / 2]}>
                                <boxGeometry args={[schlupftürBreite, 0.03, schlupftürRahmenTiefe]} />
                                <meshStandardMaterial color={schlupftürRahmenFarbe} />
                            </mesh>
                            <mesh position={[-schlupftürBreite / 2, 0, tiefe / 2 + schlupftürRahmenTiefe / 2]}>
                                <boxGeometry args={[0.03, schlupftürHöhe, schlupftürRahmenTiefe]} />
                                <meshStandardMaterial color={schlupftürRahmenFarbe} />
                            </mesh>
                            <mesh position={[schlupftürBreite / 2, 0, tiefe / 2 + schlupftürRahmenTiefe / 2]}>
                                <boxGeometry args={[0.03, schlupftürHöhe, schlupftürRahmenTiefe]} />
                                <meshStandardMaterial color={schlupftürRahmenFarbe} />
                            </mesh>

                            {/* Schlupftür Rahmen hinten */}
                            <mesh position={[0, schlupftürHöhe / 2, -tiefe / 2 - schlupftürRahmenTiefe / 2]}>
                                <boxGeometry args={[schlupftürBreite, 0.03, schlupftürRahmenTiefe]} />
                                <meshStandardMaterial color={schlupftürRahmenFarbe} />
                            </mesh>
                            <mesh position={[0, -schlupftürHöhe / 2, -tiefe / 2 - schlupftürRahmenTiefe / 2]}>
                                <boxGeometry args={[schlupftürBreite, 0.03, schlupftürRahmenTiefe]} />
                                <meshStandardMaterial color={schlupftürRahmenFarbe} />
                            </mesh>
                            <mesh position={[-schlupftürBreite / 2, 0, -tiefe / 2 - schlupftürRahmenTiefe / 2]}>
                                <boxGeometry args={[0.03, schlupftürHöhe, schlupftürRahmenTiefe]} />
                                <meshStandardMaterial color={schlupftürRahmenFarbe} />
                            </mesh>
                            <mesh position={[schlupftürBreite / 2, 0, -tiefe / 2 - schlupftürRahmenTiefe / 2]}>
                                <boxGeometry args={[0.03, schlupftürHöhe, schlupftürRahmenTiefe]} />
                                <meshStandardMaterial color={schlupftürRahmenFarbe} />
                            </mesh>

                            {/* Türklinke */}
                            <mesh position={[(schlupftürBreite / 2 - 0.15) * (schlupftürOrientierung === 'rechts' ? 1 : -1), 0, tiefe / 2 + 0.05]}>
                                <sphereGeometry args={[0.08, 16, 16]} />
                                <meshStandardMaterial color="#C0C0C0" metalness={0.8} roughness={0.2} />
                            </mesh>
                            <mesh position={[(schlupftürBreite / 2 - 0.15) * (schlupftürOrientierung === 'rechts' ? 1 : -1), 0, -tiefe / 2 - 0.05]}>
                                <sphereGeometry args={[0.08, 16, 16]} />
                                <meshStandardMaterial color="#C0C0C0" metalness={0.8} roughness={0.2} />
                            </mesh>

                        </group>
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
