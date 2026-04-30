import { useState } from "react"
import * as THREE from 'three'
import { Geometry, Base, Subtraction } from '@react-three/csg'

export default function Dach({ 
    koordinate, 
    bodenBreite, 
    bodenLänge, 
    gebäudeHöhe, 
    sockelHöhe,
    setOrbitKontrolle, 
    setSelectedObject, 
    setTürAttribute, 
    objs, 
    objId,
    flach,
    dachArt = 'satteldach',
    pultdachHöheDifferenz = 0,
    zusatzHöheMitte = 5,
    balkenAbstand = 40,
    oberflächenAnzeigen = true,
    kantenAnzeigen = true,
    showButtons = true,
    setEditMenü,
    editMenü,
    setClickedButtonPos,
    dachIsolierung = 'isoliert',
    dachPaneeltyp = 'trapez',
    dachPaneelBreiteMm = 2500,
    plattenAnzeigen = true,
    color = 'grey'
}) {
    const [hoveredButton, setHoveredButton] = useState(null) 

    const x = koordinate[0]
    const y = koordinate[1]
    const z = koordinate[2]
    
    // Berechne Positionen analog zu Kantteile
    const xLinks = x - 9 - (0.5 * (bodenLänge - 20))
    const xRechts = x + 9 + (0.5 * (bodenLänge - 20))
    const zVorne = z + 6.5 + (0.5 * (bodenBreite - 15))
    const zHinten = z - 6.5 - (0.5 * (bodenBreite - 15))
    
    const längeLangeSeite = xRechts - xLinks
    // Verwende die gleiche Berechnung wie in Kantteile.js für die Traufhöhe
    const traufhöhe = y + 4.5 + gebäudeHöhe

    const dachLeeröffnungen = (objs || [])
        .filter(obj => obj.type === 'leeröffnung' && (obj.bereich === 'dach' || (obj.bereich === undefined && obj.lang === false)))
        .map((obj, index) => {
            const öffnungsBreite = (obj?.value?.[0] ?? 5) * 2.5
            const öffnungsHöhe = (obj?.value?.[1] ?? 5) * 2.5
            const startX = obj?.startPos?.x ?? x
            const startZ = obj?.startPos?.z ?? z

            let seite = 'pult'
            let worldY = traufhöhe - 4

            if (dachArt === 'satteldach') {
                const istVorne = obj?.vorne ?? true
                seite = istVorne ? 'vorne' : 'hinten'

                if (istVorne) {
                    const zStart = zVorne + 1
                    const zEnd = z
                    const zLänge = Math.max(Math.abs(zStart - zEnd), 0.0001)

                    const yStart = traufhöhe - 4
                    const yEnd = traufhöhe + zusatzHöheMitte - 4
                    const zNormalized = (startZ - zStart) / (-zLänge)
                    worldY = yStart + ((yEnd - yStart) * zNormalized)
                } else {
                    const zStart = z
                    const zEnd = zHinten - 1
                    const zLänge = Math.max(Math.abs(zEnd - zStart), 0.0001)

                    const yStart = traufhöhe + zusatzHöheMitte - 4
                    const yEnd = traufhöhe - 4
                    const zNormalized = (zStart - startZ) / zLänge
                    worldY = yStart + ((yEnd - yStart) * zNormalized)
                }
            }

            if (dachArt === 'pultdach') {
                const zStart = zHinten - 1
                const zEnd = zVorne + 1
                const zLänge = Math.max(Math.abs(zEnd - zStart), 0.0001)

                const yStart = traufhöhe - 4
                const yEnd = traufhöhe - 4 + pultdachHöheDifferenz
                const zNormalized = (startZ - zStart) / zLänge
                worldY = yStart + ((yEnd - yStart) * zNormalized)
            }

            return {
                id: `dach-leer-${obj.id ?? index}`,
                seite,
                position: [startX, worldY, startZ],
                size: [öffnungsBreite, öffnungsHöhe]
            }
        })

    const lichtkuppelÖffnungen = (objs || [])
        .filter(obj => obj.type === 'kleinlichtskuppel')
        .map((obj, index) => {
            const breiteX = obj?.value?.[0] ?? 1
            const breiteY = obj?.value?.[1] ?? 1
            const startX = obj?.startPos?.x ?? x
            const startZ = obj?.startPos?.z ?? z

            let seite = 'pult'
            let worldY = traufhöhe - 4
            const istVorne = obj?.vorne ?? true

            if (dachArt === 'satteldach') {
                seite = istVorne ? 'vorne' : 'hinten'

                if (istVorne) {
                    const zStart = zVorne + 1
                    const zEnd = z
                    const zLänge = Math.max(Math.abs(zStart - zEnd), 0.0001)

                    const yStart = traufhöhe - 4
                    const yEnd = traufhöhe + zusatzHöheMitte - 4
                    const zNormalized = (startZ - zStart) / (-zLänge)
                    worldY = yStart + ((yEnd - yStart) * zNormalized)
                } else {
                    const zStart = z
                    const zEnd = zHinten - 1
                    const zLänge = Math.max(Math.abs(zEnd - zStart), 0.0001)

                    const yStart = traufhöhe + zusatzHöheMitte - 4
                    const yEnd = traufhöhe - 4
                    const zNormalized = (zStart - startZ) / zLänge
                    worldY = yStart + ((yEnd - yStart) * zNormalized)
                }
            }

            if (dachArt === 'pultdach') {
                const zStart = zHinten - 1
                const zEnd = zVorne + 1
                const zLänge = Math.max(Math.abs(zEnd - zStart), 0.0001)

                const yStart = traufhöhe - 4
                const yEnd = traufhöhe - 4 + pultdachHöheDifferenz
                const zNormalized = (startZ - zStart) / zLänge
                worldY = yStart + ((yEnd - yStart) * zNormalized)
            }

            return {
                id: `dach-lichtkuppel-${obj.id ?? index}`,
                seite,
                position: [startX, worldY, startZ],
                size: [breiteX, breiteY]
            }
        })

    const transparentePaneelÖffnungen = (objs || [])
        .filter(obj => obj.type === 'transparentespaneel' && (obj.bereich === 'dach' || (obj.bereich === undefined && obj.lang === false)))
        .map((obj, index) => {
            const öffnungsBreite = obj?.value?.[0] ?? 3
            const öffnungsHöhe = obj?.value?.[1] ?? 3
            const startX = obj?.startPos?.x ?? x
            const startZ = obj?.startPos?.z ?? z

            let seite = 'pult'
            let worldY = traufhöhe - 4

            if (dachArt === 'satteldach') {
                const istVorne = obj?.vorne ?? true
                seite = istVorne ? 'vorne' : 'hinten'

                if (istVorne) {
                    const zStart = zVorne + 1
                    const zEnd = z
                    const zLänge = Math.max(Math.abs(zStart - zEnd), 0.0001)

                    const yStart = traufhöhe - 4
                    const yEnd = traufhöhe + zusatzHöheMitte - 4
                    const zNormalized = (startZ - zStart) / (-zLänge)
                    worldY = yStart + ((yEnd - yStart) * zNormalized)
                } else {
                    const zStart = z
                    const zEnd = zHinten - 1
                    const zLänge = Math.max(Math.abs(zEnd - zStart), 0.0001)

                    const yStart = traufhöhe + zusatzHöheMitte - 4
                    const yEnd = traufhöhe - 4
                    const zNormalized = (zStart - startZ) / zLänge
                    worldY = yStart + ((yEnd - yStart) * zNormalized)
                }
            }

            if (dachArt === 'pultdach') {
                const zStart = zHinten - 1
                const zEnd = zVorne + 1
                const zLänge = Math.max(Math.abs(zEnd - zStart), 0.0001)

                const yStart = traufhöhe - 4
                const yEnd = traufhöhe - 4 + pultdachHöheDifferenz
                const zNormalized = (startZ - zStart) / zLänge
                worldY = yStart + ((yEnd - yStart) * zNormalized)
            }

            return {
                id: `dach-paneel-${obj.id ?? index}`,
                seite,
                position: [startX, worldY, startZ],
                size: [öffnungsBreite, öffnungsHöhe]
            }
        })

    const alleÖffnungen = [...dachLeeröffnungen, ...lichtkuppelÖffnungen, ...transparentePaneelÖffnungen]

    const buildEvenSegments = (gesamtLänge, zielAbstand) => {
        const anzahlSegmente = Math.max(1, Math.floor(gesamtLänge / zielAbstand) + 1)
        return Array.from({ length: anzahlSegmente }, () => gesamtLänge / anzahlSegmente)
    }

    const buildTargetWidthSegments = (gesamtLänge, zielBreite) => {
        const sichereZielBreite = Math.max(zielBreite ?? 0, 0.001)

        if (gesamtLänge <= sichereZielBreite) {
            return [gesamtLänge]
        }

        const segmente = []
        const volleSegmente = Math.floor(gesamtLänge / sichereZielBreite)
        const restBreite = gesamtLänge - (volleSegmente * sichereZielBreite)

        for (let index = 0; index < volleSegmente; index++) {
            segmente.push(sichereZielBreite)
        }

        if (restBreite > 0.001) {
            segmente.push(restBreite)
        }

        return segmente.length > 0 ? segmente : [gesamtLänge]
    }

    const getRoofSegmentWidths = () => {
        if (dachIsolierung === 'isoliert') {
            return buildEvenSegments(wandLänge, balkenAbstand)
        }

        if (dachPaneeltyp === 'wellplatte') {
            return buildTargetWidthSegments(wandLänge, 2.4 * 2.5)
        }

        if (dachPaneeltyp === 'pvc-folie') {
            const pvcBreiteSzene = THREE.MathUtils.clamp(((dachPaneelBreiteMm ?? 2500) / 1000) * 2.5, 1.25, 15)
            return buildTargetWidthSegments(wandLänge, pvcBreiteSzene)
        }

        return buildTargetWidthSegments(wandLänge, 2.5 * 2.5)
    }

    const dachLeeröffnungenVersion = alleÖffnungen
        .map(öffnung => `${öffnung.id}:${öffnung.position[0].toFixed(3)}:${öffnung.position[1].toFixed(3)}:${öffnung.position[2].toFixed(3)}:${öffnung.size[0].toFixed(3)}:${öffnung.size[1].toFixed(3)}:${öffnung.seite}`)
        .join('|')

    const renderDachplatteCSG = ({ key, position, rotationX, size, seite }) => {
        const openingsFürSeite = alleÖffnungen.filter(öffnung => dachArt === 'pultdach' || öffnung.seite === seite)

        return (
            <group key={key}>
                {plattenAnzeigen && oberflächenAnzeigen && (
                    <mesh key={`${key}-mesh-${dachLeeröffnungenVersion}`} position={position} rotation={[rotationX, 0, 0]}>
                        <Geometry>
                            <Base>
                                <boxGeometry args={size} />
                            </Base>
                            {openingsFürSeite.map((öffnung) => {
                                const platePos = new THREE.Vector3(position[0], position[1], position[2])
                                const openingPos = new THREE.Vector3(öffnung.position[0], öffnung.position[1], öffnung.position[2])
                                const localOpeningPos = openingPos.sub(platePos).applyEuler(new THREE.Euler(-rotationX, 0, 0))

                                return (
                                    <Subtraction
                                        key={`${key}-${öffnung.id}`}
                                        position={[localOpeningPos.x, localOpeningPos.y, localOpeningPos.z]}
                                    >
                                        <boxGeometry args={[öffnung.size[0], 1.2, öffnung.size[1]]} />
                                    </Subtraction>
                                )
                            })}
                        </Geometry>
                        <meshStandardMaterial color={color} />
                    </mesh>
                )}
                {plattenAnzeigen && kantenAnzeigen && (
                    <lineSegments position={position} rotation={[rotationX, 0, 0]}>
                        <edgesGeometry args={[new THREE.BoxGeometry(size[0], size[1], size[2])]} />
                        <lineBasicMaterial color="black" />
                    </lineSegments>
                )}
            </group>
        )
    }

    const dachplatten = []
    const buttons = []
    
    const wandLänge = längeLangeSeite + 1.75
    const segmentBreiten = getRoofSegmentWidths()
    const dachSegmentVersion = `${dachIsolierung}-${dachPaneeltyp}-${dachPaneelBreiteMm}-${segmentBreiten.map((breite) => breite.toFixed(3)).join(':')}`

    // Berechne für Pultdach
    if (dachArt === 'pultdach') {
        const zStart = zHinten - 1
        const zEnd = zVorne + 1
        const zLänge = Math.abs(zEnd - zStart)
        
        const yStart = traufhöhe -4
        const yEnd = traufhöhe + 6.2 + pultdachHöheDifferenz
        const yMitte = (yStart + yEnd) / 2
        const yDiff = yEnd - yStart
        
        const plattenLänge = Math.sqrt(Math.pow(zLänge, 2) + Math.pow(yDiff, 2))
        const rotation = -Math.atan2(yDiff, zLänge)
        const zMitte = (zStart + zEnd) / 2
        
        let laufendesX = xLinks - 1

        for (let i = 0; i < segmentBreiten.length; i++) {
            const plattenBreite = segmentBreiten[i]
            const xStart = laufendesX
            const xEnd = xStart + plattenBreite
            const plattenX = (xStart + xEnd) / 2
            
            dachplatten.push(
                renderDachplatteCSG({
                    key: `dachplatte-${dachSegmentVersion}-${i}`,
                    position: [plattenX, yMitte, zMitte],
                    rotationX: rotation,
                    size: [plattenBreite - 0.05, 0.15, plattenLänge],
                    seite: 'pult'
                })
            )
            
            // Button für diese Dachplatte
            if (showButtons && (setEditMenü === undefined || editMenü === "Öffnungen" || editMenü === "Öffnungen-Auswahl" || editMenü === "Öffnungen-Dach-Auswahl")) {
                const buttonId = `pultdach-${dachSegmentVersion}-${i}`
                const isHovered = hoveredButton === buttonId
                
                buttons.push(
                    <group 
                        key={`button-${buttonId}`}
                        position={[plattenX, yMitte + 0.1, zMitte]}
                        rotation={[rotation - Math.PI / 2, 0, 0]}
                        onPointerOver={() => setHoveredButton(buttonId)}
                        onPointerOut={() => setHoveredButton(null)}
                        onClick={() => {
                            // Für Pultdach: position bestimmt vorne/hinten (höher = vorne, tiefer = hinten)
                            const isDachVorne = zMitte > z
                            setClickedButtonPos({ x: plattenX, z: zMitte, rechts: true, lang: false, vorne: isDachVorne })
                            setEditMenü('Öffnungen-Dach-Auswahl')
                        }}
                    >
                        <mesh>
                            <circleGeometry args={[1.5, 32]} />
                            <meshStandardMaterial 
                                color={isHovered ? "rgba(100, 150, 200, 0.9)" : "rgba(173, 216, 230, 0.7)"} 
                                side={THREE.DoubleSide} 
                            />
                        </mesh>
                        <mesh>
                            <ringGeometry args={[1.5, 1.65, 32]} />
                            <meshStandardMaterial color="black" side={THREE.DoubleSide} />
                        </mesh>
                        <mesh>
                            <boxGeometry args={[1.2, 0.2, 0.05]} />
                            <meshStandardMaterial color="black" side={THREE.DoubleSide} />
                        </mesh>
                        <mesh>
                            <boxGeometry args={[0.2, 1.2, 0.05]} />
                            <meshStandardMaterial color="black" side={THREE.DoubleSide} />
                        </mesh>
                    </group>
                )
            }

            laufendesX = xEnd
        }
    }
    
    // Berechne für Satteldach
    if (dachArt === 'satteldach') {
        // Vordere Dachhälfte
        const zStartVorne = zVorne + 1
        const zEndVorne = z
        const zLängeVorne = Math.abs(zStartVorne - zEndVorne)
        
        const yStartVorne = traufhöhe-4
        const yEndVorne = traufhöhe + zusatzHöheMitte -4
        const yMitteVorne = (yStartVorne + yEndVorne) / 2
        const yDiffVorne = yEndVorne - yStartVorne
        
        const plattenLängeVorne = Math.sqrt(Math.pow(zLängeVorne, 2) + Math.pow(yDiffVorne, 2))
        const rotationVorne = Math.atan2(yDiffVorne, zLängeVorne)
        const zMitteVorne = (zStartVorne + zEndVorne) / 2
        
        // Hintere Dachhälfte
        const zStartHinten = z
        const zEndHinten = zHinten - 1
        const zLängeHinten = Math.abs(zEndHinten - zStartHinten)
        
        const yStartHinten = traufhöhe + zusatzHöheMitte -4
        const yEndHinten = traufhöhe - 4
        const yMitteHinten = (yStartHinten + yEndHinten) / 2
        const yDiffHinten = yEndHinten - yStartHinten
        
        const plattenLängeHinten = Math.sqrt(Math.pow(zLängeHinten, 2) + Math.pow(yDiffHinten, 2))
        const rotationHinten = Math.atan2(yDiffHinten, zLängeHinten)
        const zMitteHinten = (zStartHinten + zEndHinten) / 2
        
        let laufendesX = xLinks - 1

        for (let i = 0; i < segmentBreiten.length; i++) {
            const segmentBreite = segmentBreiten[i]
            const xStart = laufendesX
            const xEnd = xStart + segmentBreite
            const plattenBreite = segmentBreite + 0.1
            const plattenX = (xStart + xEnd) / 2
            
            // Vordere Dachplatte
            dachplatten.push(
                renderDachplatteCSG({
                    key: `dachplatte-vorne-${dachSegmentVersion}-${i}`,
                    position: [plattenX, yMitteVorne, zMitteVorne],
                    rotationX: rotationVorne,
                    size: [plattenBreite - 0.05, 0.15, plattenLängeVorne],
                    seite: 'vorne'
                })
            )
            
            // Button für vordere Dachplatte
            if (showButtons && (setEditMenü === undefined || editMenü === "Öffnungen" || editMenü === "Öffnungen-Auswahl" || editMenü === "Öffnungen-Dach-Auswahl")) {
                const buttonIdVorne = `satteldach-vorne-${dachSegmentVersion}-${i}`
                const isHoveredVorne = hoveredButton === buttonIdVorne
                
                buttons.push(
                    <group 
                        key={`button-${buttonIdVorne}`}
                        position={[plattenX, yMitteVorne + (bodenBreite < 16 ? 0.5 : 0.2), zMitteVorne]}
                        rotation={[rotationVorne - Math.PI / 2, 0, 0]}
                        onPointerOver={() => setHoveredButton(buttonIdVorne)}
                        onPointerOut={() => setHoveredButton(null)}
                        onClick={() => {
                            setClickedButtonPos({ x: plattenX, z: zMitteVorne, rechts: true, lang: false, vorne: true })
                            setEditMenü('Öffnungen-Dach-Auswahl')
                        }}
                    >
                        <mesh>
                            <circleGeometry args={[1.5, 32]} />
                            <meshStandardMaterial 
                                color={isHoveredVorne ? "rgba(100, 150, 200, 0.9)" : "rgba(173, 216, 230, 0.7)"} 
                                side={THREE.DoubleSide} 
                            />
                        </mesh>
                        <mesh>
                            <ringGeometry args={[1.5, 1.65, 32]} />
                            <meshStandardMaterial color="black" side={THREE.DoubleSide} />
                        </mesh>
                        <mesh>
                            <boxGeometry args={[1.2, 0.2, 0.05]} />
                            <meshStandardMaterial color="black" side={THREE.DoubleSide} />
                        </mesh>
                        <mesh>
                            <boxGeometry args={[0.2, 1.2, 0.05]} />
                            <meshStandardMaterial color="black" side={THREE.DoubleSide} />
                        </mesh>
                    </group>
                )
            }
            
            // Hintere Dachplatte
            dachplatten.push(
                renderDachplatteCSG({
                    key: `dachplatte-hinten-${dachSegmentVersion}-${i}`,
                    position: [plattenX, yMitteHinten, zMitteHinten],
                    rotationX: rotationHinten,
                    size: [plattenBreite - 0.05, 0.15, plattenLängeHinten],
                    seite: 'hinten'
                })
            )
            
            // Button für hintere Dachplatte
            if (showButtons && (setEditMenü === undefined || editMenü === "Öffnungen" || editMenü === "Öffnungen-Auswahl" || editMenü === "Öffnungen-Dach-Auswahl")) {
                const buttonIdHinten = `satteldach-hinten-${dachSegmentVersion}-${i}`
                const isHoveredHinten = hoveredButton === buttonIdHinten
                
                buttons.push(
                    <group 
                        key={`button-${buttonIdHinten}`}
                        position={[plattenX, yMitteHinten + (bodenBreite < 16 ? 0.5 : 0.2), zMitteHinten]}
                        rotation={[rotationHinten - Math.PI / 2, 0, 0]}
                        onPointerOver={() => setHoveredButton(buttonIdHinten)}
                        onPointerOut={() => setHoveredButton(null)}
                        onClick={() => {
                            setClickedButtonPos({ x: plattenX, z: zMitteHinten, rechts: true, lang: false, vorne: false })
                            setEditMenü('Öffnungen-Dach-Auswahl')
                        }}
                    >
                        <mesh>
                            <circleGeometry args={[1.5, 32]} />
                            <meshStandardMaterial 
                                color={isHoveredHinten ? "rgba(100, 150, 200, 0.9)" : "rgba(173, 216, 230, 0.7)"} 
                                side={THREE.DoubleSide} 
                            />
                        </mesh>
                        <mesh>
                            <ringGeometry args={[1.5, 1.65, 32]} />
                            <meshStandardMaterial color="black" side={THREE.DoubleSide} />
                        </mesh>
                        <mesh>
                            <boxGeometry args={[1.2, 0.2, 0.05]} />
                            <meshStandardMaterial color="black" side={THREE.DoubleSide} />
                        </mesh>
                        <mesh>
                            <boxGeometry args={[0.2, 1.2, 0.05]} />
                            <meshStandardMaterial color="black" side={THREE.DoubleSide} />
                        </mesh>
                    </group>
                )
            }

            laufendesX = xEnd
        }
    }

    return(
        <>
            {dachplatten}
            {buttons}
        </>
    )
}