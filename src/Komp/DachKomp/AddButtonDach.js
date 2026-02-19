import * as THREE from 'three'
import { useState } from 'react'

export default function AddButtonDach({
    koordinate,
    bodenLänge,
    bodenBreite,
    gebäudeHöhe,
    sockelHöhe,
    dachArt,
    pultdachHöheDifferenz,
    zusatzHöheMitte,
    balkenAbstand,
    setEditMenü
}) {
    const [hoveredButton, setHoveredButton] = useState(null)
    const x = koordinate[0]
    const y = koordinate[1]
    const z = koordinate[2]

    // Berechne Positionen analog zu Dach.js
    const xLinks = x - 9 - (0.5 * (bodenLänge - 20))
    const xRechts = x + 9 + (0.5 * (bodenLänge - 20))
    const zVorne = z + 6.5 + (0.5 * (bodenBreite - 15))
    const zHinten = z - 6.5 - (0.5 * (bodenBreite - 15))
    
    const längeLangeSeite = xRechts - xLinks
    const längeKurzeSeite = zVorne - zHinten
    const traufhöhe = y + 4.5 + gebäudeHöhe

    const buttons = []
    
    // Berechne die gleichen Positionen wie die Dachplatten
    const wandLänge = längeLangeSeite + 1.75
    const anzahlBalken = Math.floor(wandLänge / balkenAbstand)
    const gleichmäßigerAbstand = anzahlBalken > 0 ? wandLänge / (anzahlBalken + 1) : wandLänge

    // Buttons für Pultdach
    if (dachArt === 'pultdach') {
        const zStart = zHinten - 1
        const zEnd = zVorne + 1
        const zLänge = Math.abs(zEnd - zStart)
        const zMitte = (zStart + zEnd) / 2
        
        const yStart = traufhöhe - 4
        const yEnd = traufhöhe + 6.2 + pultdachHöheDifferenz
        const yMitte = (yStart + yEnd) / 2
        const yDiff = yEnd - yStart
        
        const rotation = -Math.atan2(yDiff, zLänge)
        
        // Offset, um Buttons oberhalb der Dachfläche zu positionieren
        const buttonOffset = 5.0
        const yOffset = buttonOffset * Math.cos(rotation)
        const zOffset = buttonOffset * Math.sin(rotation)
        
        // Buttons für jede Dachplatte
        for (let i = 0; i <= anzahlBalken; i++) {
            const xStart = i === 0 ? (xLinks - 1) : ((xLinks - 1) + (i * gleichmäßigerAbstand))
            const xEnd = i === anzahlBalken ? (xRechts + 1) : ((xLinks - 1) + ((i + 1) * gleichmäßigerAbstand))
            const buttonX = (xStart + xEnd) / 2
            
            const buttonId = `pultdach-${i}`
            const isHovered = hoveredButton === buttonId
            
            buttons.push(
                <group 
                    key={`button-group-${buttonId}`}
                    position={[buttonX, yMitte + yOffset, zMitte + zOffset]}
                    rotation={[rotation - Math.PI / 2, 0, 0]}
                    onPointerOver={() => setHoveredButton(buttonId)}
                    onPointerOut={() => setHoveredButton(null)}
                >
                    <mesh key={`button-${buttonId}`}>
                        <circleGeometry args={[1.5, 32]} />
                        <meshStandardMaterial 
                            color={isHovered ? "rgba(100, 150, 200, 0.9)" : "rgba(173, 216, 230, 0.7)"} 
                            side={THREE.DoubleSide} 
                        />
                    </mesh>
                    <mesh key={`button-ring-${buttonId}`}>
                        <ringGeometry args={[1.5, 1.65, 32]} />
                        <meshStandardMaterial color="black" side={THREE.DoubleSide} />
                    </mesh>
                    {/* Plus-Zeichen - Horizontaler Balken */}
                    <mesh key={`button-plus-h-${buttonId}`}>
                        <boxGeometry args={[1.2, 0.2, 0.05]} />
                        <meshStandardMaterial color="black" side={THREE.DoubleSide} />
                    </mesh>
                    {/* Plus-Zeichen - Vertikaler Balken */}
                    <mesh key={`button-plus-v-${buttonId}`}>
                        <boxGeometry args={[0.2, 1.2, 0.05]} />
                        <meshStandardMaterial color="black" side={THREE.DoubleSide} />
                    </mesh>
                </group>
            )
        }
    }
    
    // Buttons für Satteldach
    if (dachArt === 'satteldach') {
        // Vordere Dachhälfte
        const zStartVorne = zVorne + 1
        const zEndVorne = z
        const zLängeVorne = Math.abs(zStartVorne - zEndVorne)
        const zMitteVorne = (zStartVorne + zEndVorne) / 2
        
        const yStartVorne = traufhöhe - 4
        const yEndVorne = traufhöhe + 11 + zusatzHöheMitte
        const yMitteVorne = (yStartVorne + yEndVorne) / 2
        const yDiffVorne = yEndVorne - yStartVorne
        
        const plattenLängeVorne = Math.sqrt(Math.pow(zLängeVorne, 2) + Math.pow(yDiffVorne, 2))
        const rotationVorne = Math.atan2(yDiffVorne, zLängeVorne)
        
        // Hintere Dachhälfte
        const zStartHinten = z
        const zEndHinten = zHinten - 1
        const zLängeHinten = Math.abs(zEndHinten - zStartHinten)
        const zMitteHinten = (zStartHinten + zEndHinten) / 2
        
        const yStartHinten = traufhöhe + 11 + zusatzHöheMitte
        const yEndHinten = traufhöhe - 4
        const yMitteHinten = (yStartHinten + yEndHinten) / 2
        const yDiffHinten = yEndHinten - yStartHinten
        
        const plattenLängeHinten = Math.sqrt(Math.pow(zLängeHinten, 2) + Math.pow(yDiffHinten, 2))
        const rotationHinten = Math.atan2(yDiffHinten, zLängeHinten)
        
        // Offset für beide Dachhälften FUNKTIONIERT NICHT
        const buttonOffset = 1.0
        const yOffsetVorne = buttonOffset * Math.cos(rotationVorne)
        const zOffsetVorne = -buttonOffset * Math.sin(rotationVorne)
        const yOffsetHinten = buttonOffset * Math.cos(rotationHinten)
        const zOffsetHinten = -buttonOffset * Math.sin(rotationHinten)
        
        // Buttons für jede Dachplatte (vorne und hinten)
        for (let i = 0; i <= anzahlBalken; i++) {
            const xStart = i === 0 ? (xLinks - 1) : ((xLinks - 1) + (i * gleichmäßigerAbstand))
            const xEnd = i === anzahlBalken ? (xRechts + 1) : ((xLinks - 1) + ((i + 1) * gleichmäßigerAbstand))
            const buttonX = (xStart + xEnd) / 2
            
            // Vorderer Button
            const buttonIdVorne = `satteldach-vorne-${i}`
            const isHoveredVorne = hoveredButton === buttonIdVorne
            
            buttons.push(
                <group 
                    key={`button-group-${buttonIdVorne}`}
                    position={[buttonX, yMitteVorne + yOffsetVorne, zMitteVorne + zOffsetVorne]}
                    rotation={[rotationVorne - Math.PI / 2, 0, 0]}
                    onPointerOver={() => setHoveredButton(buttonIdVorne)}
                    onPointerOut={() => setHoveredButton(null)}
                >
                    <mesh key={`button-${buttonIdVorne}`}>
                        <circleGeometry args={[1.5, 32]} />
                        <meshStandardMaterial 
                            color={isHoveredVorne ? "rgba(100, 150, 200, 0.9)" : "rgba(173, 216, 230, 0.7)"} 
                            side={THREE.DoubleSide} 
                        />
                    </mesh>
                    <mesh key={`button-ring-${buttonIdVorne}`}>
                        <ringGeometry args={[1.5, 1.65, 32]} />
                        <meshStandardMaterial color="black" side={THREE.DoubleSide} />
                    </mesh>
                    <mesh key={`button-plus-h-${buttonIdVorne}`}>
                        <boxGeometry args={[1.2, 0.2, 0.05]} />
                        <meshStandardMaterial color="black" side={THREE.DoubleSide} />
                    </mesh>
                    <mesh key={`button-plus-v-${buttonIdVorne}`}>
                        <boxGeometry args={[0.2, 1.2, 0.05]} />
                        <meshStandardMaterial color="black" side={THREE.DoubleSide} />
                    </mesh>
                </group>
            )
            
            // Hinterer Button
            const buttonIdHinten = `satteldach-hinten-${i}`
            const isHoveredHinten = hoveredButton === buttonIdHinten
            
            buttons.push(
                <group 
                    key={`button-group-${buttonIdHinten}`}
                    position={[buttonX, yMitteHinten + yOffsetHinten, zMitteHinten + zOffsetHinten]}
                    rotation={[rotationHinten - Math.PI / 2, 0, 0]}
                    onPointerOver={() => setHoveredButton(buttonIdHinten)}
                    onPointerOut={() => setHoveredButton(null)}
                >
                    <mesh key={`button-${buttonIdHinten}`}>
                        <circleGeometry args={[1.5, 32]} />
                        <meshStandardMaterial 
                            color={isHoveredHinten ? "rgba(100, 150, 200, 0.9)" : "rgba(173, 216, 230, 0.7)"} 
                            side={THREE.DoubleSide} 
                        />
                    </mesh>
                    <mesh key={`button-ring-${buttonIdHinten}`}>
                        <ringGeometry args={[1.5, 1.65, 32]} />
                        <meshStandardMaterial color="black" side={THREE.DoubleSide} />
                    </mesh>
                    <mesh key={`button-plus-h-${buttonIdHinten}`}>
                        <boxGeometry args={[1.2, 0.2, 0.05]} />
                        <meshStandardMaterial color="black" side={THREE.DoubleSide} />
                    </mesh>
                    <mesh key={`button-plus-v-${buttonIdHinten}`}>
                        <boxGeometry args={[0.2, 1.2, 0.05]} />
                        <meshStandardMaterial color="black" side={THREE.DoubleSide} />
                    </mesh>
                </group>
            )
        }
    }

    return <>{buttons}</>
}
