import { useRef, useState } from "react"
import * as THREE from 'three'
import DachFenster from "./DachFenster"

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
    plattenAnzeigen = true,
    color = 'grey'
}) {

    const ref = useRef()
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
    const längeKurzeSeite = zVorne - zHinten
    // Verwende die gleiche Berechnung wie in Kantteile.js für die Traufhöhe
    const traufhöhe = y + 4.5 + gebäudeHöhe

    const dachplatten = []
    const buttons = []
    
    // Berechne die gleichen Positionen wie die Abgrenzungsbalken
    const wandLänge = längeLangeSeite + 1.75
    const anzahlBalken = Math.floor(wandLänge / balkenAbstand)
    const gleichmäßigerAbstand = anzahlBalken > 0 ? wandLänge / (anzahlBalken + 1) : wandLänge

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
        
        // Erstelle die Dachplatten parallel zu den Abgrenzungsbalken
        for (let i = 0; i <= anzahlBalken; i++) {
            const xStart = i === 0 ? (xLinks - 1) : ((xLinks - 1) + (i * gleichmäßigerAbstand))
            const xEnd = i === anzahlBalken ? (xRechts + 1) : ((xLinks - 1) + ((i + 1) * gleichmäßigerAbstand))
            const plattenBreite = xEnd - xStart
            const plattenX = (xStart + xEnd) / 2
            
            dachplatten.push(
                <group key={`dachplatte-${i}`}>
                    {plattenAnzeigen && oberflächenAnzeigen && (
                        <mesh position={[plattenX, yMitte, zMitte]} rotation={[rotation, 0, 0]}>
                            <boxGeometry args={[plattenBreite - 0.05, 0.15, plattenLänge]} />
                            <meshStandardMaterial color={color} />
                        </mesh>
                    )}
                    {plattenAnzeigen && kantenAnzeigen && (
                        <lineSegments position={[plattenX, yMitte, zMitte]} rotation={[rotation, 0, 0]}>
                            <edgesGeometry args={[new THREE.BoxGeometry(plattenBreite - 0.05, 0.15, plattenLänge)]} />
                            <lineBasicMaterial color="black" />
                        </lineSegments>
                    )}
                </group>
            )
            
            // Button für diese Dachplatte
            if (showButtons && (setEditMenü === undefined || editMenü === "Öffnungen" || editMenü === "Öffnungen-Auswahl" || editMenü === "Öffnungen-Dach-Auswahl")) {
                const buttonId = `pultdach-${i}`
                const isHovered = hoveredButton === buttonId
                
                buttons.push(
                    <group 
                        key={`button-${buttonId}`}
                        position={[plattenX, yMitte + 0.1, zMitte]}
                        rotation={[rotation - Math.PI / 2, 0, 0]}
                        onPointerOver={() => setHoveredButton(buttonId)}
                        onPointerOut={() => setHoveredButton(null)}
                        onClick={() => {
                            setClickedButtonPos({ x: plattenX, z: zMitte, rechts: true, lang: false, vorne: true })
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
        
        // Erstelle die Dachplatten für beide Seiten parallel zu den Abgrenzungsbalken
        for (let i = 0; i <= anzahlBalken; i++) {
            const xStart = i === 0 ? (xLinks - 1) : ((xLinks - 1) + (i * gleichmäßigerAbstand))
            const xEnd = i === anzahlBalken ? (xRechts + 1) : ((xLinks - 1) + ((i + 1) * gleichmäßigerAbstand))
            const plattenBreite = xEnd - xStart+0.1
            const plattenX = (xStart + xEnd) / 2
            
            // Vordere Dachplatte
            dachplatten.push(
                <group key={`dachplatte-vorne-${i}`}>
                    {plattenAnzeigen && oberflächenAnzeigen && (
                        <mesh position={[plattenX, yMitteVorne, zMitteVorne]} rotation={[rotationVorne, 0, 0]}>
                            <boxGeometry args={[plattenBreite - 0.05, 0.15, plattenLängeVorne]} />
                            <meshStandardMaterial color={color} />
                        </mesh>
                    )}
                    {plattenAnzeigen && kantenAnzeigen && (
                        <lineSegments position={[plattenX, yMitteVorne, zMitteVorne]} rotation={[rotationVorne, 0, 0]}>
                            <edgesGeometry args={[new THREE.BoxGeometry(plattenBreite - 0.05, 0.15, plattenLängeVorne)]} />
                            <lineBasicMaterial color="black" />
                        </lineSegments>
                    )}
                </group>
            )
            
            // Button für vordere Dachplatte
            if (showButtons && (setEditMenü === undefined || editMenü === "Öffnungen" || editMenü === "Öffnungen-Auswahl" || editMenü === "Öffnungen-Dach-Auswahl")) {
                const buttonIdVorne = `satteldach-vorne-${i}`
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
                <group key={`dachplatte-hinten-${i}`}>
                    {plattenAnzeigen && oberflächenAnzeigen && (
                        <mesh position={[plattenX, yMitteHinten, zMitteHinten]} rotation={[rotationHinten, 0, 0]}>
                            <boxGeometry args={[plattenBreite - 0.05, 0.15, plattenLängeHinten]} />
                            <meshStandardMaterial color={color} />
                        </mesh>
                    )}
                    {plattenAnzeigen && kantenAnzeigen && (
                        <lineSegments position={[plattenX, yMitteHinten, zMitteHinten]} rotation={[rotationHinten, 0, 0]}>
                            <edgesGeometry args={[new THREE.BoxGeometry(plattenBreite - 0.05, 0.15, plattenLängeHinten)]} />
                            <lineBasicMaterial color="black" />
                        </lineSegments>
                    )}
                </group>
            )
            
            // Button für hintere Dachplatte
            if (showButtons && (setEditMenü === undefined || editMenü === "Öffnungen" || editMenü === "Öffnungen-Auswahl" || editMenü === "Öffnungen-Dach-Auswahl")) {
                const buttonIdHinten = `satteldach-hinten-${i}`
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
        }
    }

    return(
        <>
            {dachplatten}
            {buttons}
        </>
    )
}