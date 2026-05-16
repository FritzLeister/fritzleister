
import * as THREE from 'three'
import { useThree } from '@react-three/fiber'
import { useRef, useState, useEffect, useCallback } from 'react'
import { useDrag } from '@use-gesture/react'

import Reflektor from './Reflektor'
import { OPENING_GRID_STEP, quantizeOpeningDistance, snapOpeningCoordinate } from './wallOpeningPositionUtils'

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

    const { size } = useThree()
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
    const gridPosiRef = useRef({ x: initialX, z: initialZ, y: initialY })
    const pendingStartPosRef = useRef(null)
    const startPosAnimationFrameRef = useRef(null)
    const arrowRepeatFrameRef = useRef(null)
    const arrowRepeatStateRef = useRef(null)
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
    const bodenAbstandOffset = 0.5
    const minY = position[1] + (skaliertHöhe / 2) + 0.5 - 4
    const maxY = position[1] + wandHöhe - (skaliertHöhe / 2) - 1 - 4 + 1

    useEffect(() => {
        gridPosiRef.current = gridPosi
    }, [gridPosi])

    const updateStartPos = useCallback((nextPos) => {
        const surfaceOffset = 0
        const normalSign = rechts ? -1 : 1
        const realX = lang ? nextPos.x : (rechts ? xLinks : xRechts) + (!lang ? normalSign * surfaceOffset : 0)
        const realZ = lang ? z + (lang ? normalSign * surfaceOffset : 0) : nextPos.z

        if (!setObjs) return

        setObjs(prevObjs => prevObjs.map(item =>
            item.id === objId
                ? {
                    ...item,
                    startPos: {
                        ...(item.startPos ?? {}),
                        x: realX,
                        y: nextPos.y,
                        z: realZ
                    }
                }
                : item
        ))
    }, [lang, objId, rechts, setObjs, xLinks, xRechts, z])

    const flushScheduledStartPos = useCallback(() => {
        startPosAnimationFrameRef.current = null

        if (!pendingStartPosRef.current) return

        updateStartPos(pendingStartPosRef.current)
        pendingStartPosRef.current = null
    }, [updateStartPos])

    const clearArrowRepeat = useCallback(({ flush = false } = {}) => {
        arrowRepeatStateRef.current = null

        if (arrowRepeatFrameRef.current !== null) {
            window.cancelAnimationFrame(arrowRepeatFrameRef.current)
            arrowRepeatFrameRef.current = null
        }

        if (flush && pendingStartPosRef.current) {
            flushScheduledStartPos()
        }
    }, [flushScheduledStartPos])

    const scheduleStartPosUpdate = useCallback((nextPos) => {
        pendingStartPosRef.current = nextPos

        if (startPosAnimationFrameRef.current !== null) return

        startPosAnimationFrameRef.current = window.requestAnimationFrame(flushScheduledStartPos)
    }, [flushScheduledStartPos])

    useEffect(() => () => {
        clearArrowRepeat()
        if (startPosAnimationFrameRef.current !== null) {
            window.cancelAnimationFrame(startPosAnimationFrameRef.current)
        }
    }, [clearArrowRepeat])

    const persistPosition = useCallback((nextPos) => {
        // Fenster bleibt mittig in der Wandstärke, damit innen und außen sichtbar sind
        const surfaceOffset = 0
        const normalSign = rechts ? -1 : 1
        
        // Berechne echte Position wie in finalX/finalZ
        const realX = lang ? nextPos.x : (rechts ? xLinks : xRechts) + (!lang ? normalSign * surfaceOffset : 0)
        const realZ = lang ? z + (lang ? normalSign * surfaceOffset : 0) : nextPos.z

        const nextAbstandLinksRaw = lang
            ? nextPos.x - (xLinks + halbeFensterBreite)
            : nextPos.z - (zHinten + halbeFensterBreite)
        const nextAbstandRechtsRaw = lang
            ? (xRechts - halbeFensterBreite) - nextPos.x
            : (zVorne - halbeFensterBreite) - nextPos.z
        const nextAbstandUntenRaw = (nextPos.y + 4) - position[1] - (skaliertHöhe / 2) - bodenAbstandOffset
        const nextAbstandLinks = quantizeOpeningDistance(nextAbstandLinksRaw)
        const nextAbstandRechts = quantizeOpeningDistance(nextAbstandRechtsRaw)
        const nextAbstandUnten = quantizeOpeningDistance(nextAbstandUntenRaw)

        window.dispatchEvent(new CustomEvent('wand-fenster:position-values', {
            detail: {
                id: objId,
                abstandLinks: nextAbstandLinks,
                abstandRechts: nextAbstandRechts,
                abstandUnten: nextAbstandUnten
            }
        }))

        if (!setObjs) return
        setObjs(prevObjs => prevObjs.map(item =>
            item.id === objId
                ? {
                    ...item,
                    abstandLinks: nextAbstandLinks,
                    abstandRechts: nextAbstandRechts,
                    abstandUnten: nextAbstandUnten,
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
                abstandLinks: nextAbstandLinks,
                abstandRechts: nextAbstandRechts,
                abstandUnten: nextAbstandUnten,
                startPos: {
                    ...(prev.startPos ?? {}),
                    x: realX,
                    y: nextPos.y,
                    z: realZ
                }
            }
        })
    }, [bodenAbstandOffset, halbeFensterBreite, lang, objId, position, rechts, setObjs, setSelectedObject, skaliertHöhe, xLinks, xRechts, z, zHinten, zVorne])

    useEffect(() => {
        const handleRefreshPosition = (event) => {
            if (event?.detail?.id !== objId) return
            persistPosition(gridPosiRef.current)
        }

        window.addEventListener('wand-fenster:refresh-position', handleRefreshPosition)
        return () => window.removeEventListener('wand-fenster:refresh-position', handleRefreshPosition)
    }, [objId, persistPosition])

    useEffect(() => {
        const hasAbstandRechts = obj?.abstandRechts !== undefined && obj?.abstandRechts !== null
        const hasAbstandUnten = obj?.abstandUnten !== undefined && obj?.abstandUnten !== null
        if (!hasAbstandRechts && !hasAbstandUnten) return

        const distRechts = hasAbstandRechts ? Number(obj?.abstandRechts) : 0
        const distUnten = hasAbstandUnten ? Number(obj?.abstandUnten) : 0
        const safeDistRechts = Number.isFinite(distRechts) ? Math.max(0, distRechts) : 0
        const safeDistUnten = Number.isFinite(distUnten) ? Math.max(0, distUnten) : 0

        let nextX = gridPosiRef.current.x
        let nextZ = gridPosiRef.current.z

        if (lang) {
            nextX = (xRechts - halbeFensterBreite) - safeDistRechts
            nextX = snapOpeningCoordinate(nextX, minX, minX, maxX)
        } else {
            nextZ = (zVorne - halbeFensterBreite) - safeDistRechts
            nextZ = snapOpeningCoordinate(nextZ, minZ, minZ, maxZ)
        }

        let nextY = position[1] + (skaliertHöhe / 2) + bodenAbstandOffset + safeDistUnten - 4
        nextY = snapOpeningCoordinate(nextY, minY, minY, maxY)

        const nextPos = { x: nextX, z: nextZ, y: nextY }
        const prevPos = gridPosiRef.current

        if (prevPos.x === nextPos.x && prevPos.y === nextPos.y && prevPos.z === nextPos.z) return

        gridPosiRef.current = nextPos
        setGridPosi(nextPos)
        updateStartPos(nextPos)
    }, [obj?.abstandRechts, obj?.abstandUnten, bodenAbstandOffset, lang, xRechts, zVorne, halbeFensterBreite, minX, maxX, minZ, maxZ, minY, maxY, position, skaliertHöhe, updateStartPos])

    useEffect(() => {
        const hasAbstandLinks = obj?.abstandLinks !== undefined && obj?.abstandLinks !== null
        const hasAbstandRechts = obj?.abstandRechts !== undefined && obj?.abstandRechts !== null
        const hasAbstandUnten = obj?.abstandUnten !== undefined && obj?.abstandUnten !== null

        if (hasAbstandLinks && hasAbstandRechts && hasAbstandUnten) return

        persistPosition(gridPosiRef.current)
    }, [obj?.id, obj?.abstandLinks, obj?.abstandRechts, obj?.abstandUnten, persistPosition])

    const handleClick = () => {
        const found = objs.find(o => o.id === objId)
        if (found) {
            window.activeArrowControl = { kind: 'wand-fenster', id: objId }
            setSelectedObject(found)
            setEditMenü('Fenster-Bearbeiten')
        }
    }

    const activateArrowControl = useCallback(() => {
        window.activeArrowControl = { kind: 'wand-fenster', id: objId }
    }, [objId])

    const moveWithArrowKey = useCallback((key) => {
        const current = gridPosiRef.current
        let newX = current.x
        let newZ = current.z
        let newY = current.y

        switch (key) {
            case 'ArrowLeft':
                if (lang) {
                    newX = snapOpeningCoordinate(current.x + (rechts ? OPENING_GRID_STEP : -OPENING_GRID_STEP), minX, minX, maxX)
                } else {
                    newZ = snapOpeningCoordinate(current.z - (rechts ? OPENING_GRID_STEP : -OPENING_GRID_STEP), minZ, minZ, maxZ)
                }
                break
            case 'ArrowRight':
                if (lang) {
                    newX = snapOpeningCoordinate(current.x + (rechts ? -OPENING_GRID_STEP : OPENING_GRID_STEP), minX, minX, maxX)
                } else {
                    newZ = snapOpeningCoordinate(current.z + (rechts ? OPENING_GRID_STEP : -OPENING_GRID_STEP), minZ, minZ, maxZ)
                }
                break
            case 'ArrowUp':
                newY = snapOpeningCoordinate(current.y + OPENING_GRID_STEP, minY, minY, maxY)
                break
            case 'ArrowDown':
                newY = snapOpeningCoordinate(current.y - OPENING_GRID_STEP, minY, minY, maxY)
                break
            default:
                return false
        }

        const nextPos = { x: newX, z: newZ, y: newY }

        if (current.x === nextPos.x && current.y === nextPos.y && current.z === nextPos.z) {
            return false
        }

        gridPosiRef.current = nextPos
        setGridPosi(nextPos)
        scheduleStartPosUpdate(nextPos)
        return true
    }, [lang, maxX, maxY, maxZ, minX, minY, minZ, rechts, scheduleStartPosUpdate])

    const runArrowRepeat = useCallback((timestamp) => {
        const repeatState = arrowRepeatStateRef.current

        if (!repeatState) {
            arrowRepeatFrameRef.current = null
            return
        }

        if (timestamp >= repeatState.nextRepeatAt) {
            moveWithArrowKey(repeatState.key)
            repeatState.nextRepeatAt = timestamp + 60
        }

        arrowRepeatFrameRef.current = window.requestAnimationFrame(runArrowRepeat)
    }, [moveWithArrowKey])

    useEffect(() => {
        const handleKeyDown = (event) => {
            const active = window.activeArrowControl
            if (!active || active.kind !== 'wand-fenster' || active.id !== objId) return

            switch (event.key) {
                case 'ArrowLeft':
                case 'ArrowRight':
                case 'ArrowUp':
                case 'ArrowDown':
                    break
                default:
                    return
            }

            event.preventDefault()

            const repeatState = arrowRepeatStateRef.current
            if (repeatState?.key === event.key && event.repeat) return

            activateArrowControl()
            moveWithArrowKey(event.key)

            arrowRepeatStateRef.current = {
                key: event.key,
                nextRepeatAt: window.performance.now() + 120
            }

            if (arrowRepeatFrameRef.current === null) {
                arrowRepeatFrameRef.current = window.requestAnimationFrame(runArrowRepeat)
            }
        }

        const handleKeyUp = (event) => {
            if (arrowRepeatStateRef.current?.key !== event.key) return
            clearArrowRepeat({ flush: true })
        }

        const handleWindowBlur = () => {
            clearArrowRepeat({ flush: true })
        }

        window.addEventListener('keydown', handleKeyDown)
        window.addEventListener('keyup', handleKeyUp)
        window.addEventListener('blur', handleWindowBlur)

        return () => {
            window.removeEventListener('keydown', handleKeyDown)
            window.removeEventListener('keyup', handleKeyUp)
            window.removeEventListener('blur', handleWindowBlur)
        }
    }, [activateArrowControl, clearArrowRepeat, moveWithArrowKey, objId, runArrowRepeat])

    const bind = useDrag(({ movement: [dragMoveX, dragMoveY], first, last, memo, tap }) => {
        if (tap) {
            handleClick()
            return memo
        }

        const scale = 80 / size.width
        const scaleY = scale * 0.5

        if (first) {
            memo = { startX: gridPosi.x, startZ: gridPosi.z, startY: gridPosi.y }
        }

        // Y-Achse (vertikal) - funktioniert immer
        let newY = snapOpeningCoordinate(memo.startY - (dragMoveY * scaleY), minY, minY, maxY)

        let nextPos
        if (lang) {
            // Lange Wand: X-Achse bewegen (Richtung abhängig von rechts)
            const dragMultiplier = rechts ? -1 : 1
            let newX = snapOpeningCoordinate(memo.startX + (dragMultiplier * dragMoveX * scale), minX, minX, maxX)
            nextPos = { x: newX, z: gridPosi.z, y: newY }

            if (first) {
                window.activeArrowControl = { kind: 'wand-fenster', id: objId }
                setOrbitKontrolle(false)
            }
        } else {
            // Kurze Wand: Z-Achse bewegen (Richtung abhängig von rechts)
            const dragMultiplier = rechts ? 1 : -1
            let newZ = snapOpeningCoordinate(memo.startZ + (dragMultiplier * dragMoveX * scale), minZ, minZ, maxZ)
            nextPos = { x: gridPosi.x, z: newZ, y: newY }

            if (first) {
                window.activeArrowControl = { kind: 'wand-fenster', id: objId }
                setOrbitKontrolle(false)
            }
        }

        const prevPos = gridPosiRef.current
        const hasPositionChanged = prevPos.x !== nextPos.x || prevPos.y !== nextPos.y || prevPos.z !== nextPos.z

        if (hasPositionChanged) {
            gridPosiRef.current = nextPos
            setGridPosi(nextPos)
            scheduleStartPosUpdate(nextPos)
        }

        if (last) {
            if (pendingStartPosRef.current) {
                flushScheduledStartPos()
            }
            setOrbitKontrolle(true)
        }

        return memo
    }, {
        filterTaps: true,
        threshold: 4
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
            onPointerDownCapture={activateArrowControl}
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