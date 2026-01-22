import * as THREE from 'three'
import { useState } from 'react'

export default function AddButtonWand({
    koordinate,
    bodenLänge,
    bodenBreite,
    gebäudeHöhe,
    sockelHöhe,
    dachArt,
    pultdachHöheDifferenz,
    zusatzHöheMitte,
    balkenAbstand,
    wandTyp, // 'langVorne', 'langHinten', 'kurzLinks', 'kurzRechts'
    setEditMenü,
}) {
    const [hoveredButton, setHoveredButton] = useState(null)
    const x = koordinate[0]
    const y = koordinate[1] + 1 + (gebäudeHöhe - 6)
    const z = koordinate[2]

    // Berechne Positionen
    const xLinks = x - 9 - (0.5 * (bodenLänge - 20))
    const xRechts = x + 9 + (0.5 * (bodenLänge - 20))
    const zVorne = z + 6.5 + (0.5 * (bodenBreite - 15))
    const zHinten = z - 6.5 - (0.5 * (bodenBreite - 15))
    const längeLangeSeite = xRechts - xLinks
    const längeKurzeSeite = zVorne - zHinten
    
    const traufhöhe = y + 4.5 + gebäudeHöhe

    const buttons = []

    // Lange Wände (vorne/hinten)
    if (wandTyp === 'langVorne' || wandTyp === 'langHinten') {
        const rechts = wandTyp === 'langHinten'
        const wandLänge = längeLangeSeite + 1.75
        const zWert = rechts ? zHinten - 1 : zVorne + 1
        
        let dachKante
        if (dachArt === 'pultdach') {
            dachKante = rechts ? (traufhöhe + 0.85) : (traufhöhe + 0.85 + pultdachHöheDifferenz)
        } else {
            dachKante = (traufhöhe + 0.85)
        }

        const anzahlBalken = Math.floor(wandLänge / balkenAbstand)
        if (anzahlBalken > 0) {
            const gleichmäßigerAbstand = wandLänge / (anzahlBalken + 1)
            
            // Buttons zwischen Balken und am Anfang/Ende
            for (let i = 0; i <= anzahlBalken; i++) {
                const buttonX = (xLinks - 1) + (i + 0.5) * gleichmäßigerAbstand
                const buttonZ = rechts ? zWert - 0.7 : zWert + 0.7
                // Vertikale Mitte zwischen Sockelhöhe und Dachkante
                const buttonY = sockelHöhe + (dachKante - sockelHöhe) / 2 
                const buttonId = `${wandTyp}-${i}`
                const isHovered = hoveredButton === buttonId
                
                buttons.push(
                    <>
                    <mesh 
                        key={`button-${wandTyp}-${i}`}
                        position={[buttonX, buttonY, buttonZ]}
                        rotation={[0, 0, 0]}
                        onPointerOver={() => setHoveredButton(buttonId)}
                        onPointerOut={() => setHoveredButton(null)}
                        onClick={() => setEditMenü(prev => prev === "Öffnungen-Auswahl" ? null : "Öffnungen-Auswahl")}
                    >
                        <circleGeometry args={[1.5, 32]} />
                        <meshStandardMaterial 
                            color={isHovered ? "rgba(100, 150, 200, 0.9)" : "rgba(173, 216, 230, 0.7)"} 
                            side={THREE.DoubleSide} 
                        />
                    </mesh>
                    <mesh 
                        key={`button-ring-${wandTyp}-${i}`}
                        position={[buttonX, buttonY, buttonZ]}
                        rotation={[0, 0, 0]}
                    >
                        <ringGeometry args={[1.5, 1.65, 32]} />
                        <meshStandardMaterial color="black" side={THREE.DoubleSide} />
                    </mesh>
                    {/* Plus-Zeichen - Horizontaler Balken */}
                    <mesh 
                        key={`button-plus-h-${wandTyp}-${i}`}
                        position={[buttonX, buttonY, buttonZ]}
                        rotation={[0, 0, 0]}
                    >
                        <boxGeometry args={[1.2, 0.2, 0.05]} />
                        <meshStandardMaterial color="black" />
                    </mesh>
                    {/* Plus-Zeichen - Vertikaler Balken */}
                    <mesh 
                        key={`button-plus-v-${wandTyp}-${i}`}
                        position={[buttonX, buttonY, buttonZ]}
                        rotation={[0, 0, 0]}
                    >
                        <boxGeometry args={[0.2, 1.2, 0.05]} />
                        <meshStandardMaterial color="black" />
                    </mesh>
                    </>
                )
            }
        }
    }

    // Kurze Wände (links/rechts)
    if (wandTyp === 'kurzLinks' || wandTyp === 'kurzRechts') {
        const rechts = wandTyp === 'kurzLinks'
        const wandLänge = längeKurzeSeite + 1.85
        const xWert = rechts ? xLinks - 1 : xRechts + 1

        const anzahlBalken = Math.floor(wandLänge / balkenAbstand)
        
        // Immer mindestens einen Button in der Mitte anzeigen
        if (anzahlBalken === 0) {
            // Genau ein Button in der Mitte der Wand
            const buttonZ = (zHinten - 1) + wandLänge / 2
            
            let dachKante
            if (dachArt === 'pultdach') {
                const factor = 0.5 // Mitte der Wand
                dachKante = (traufhöhe + 0.85) + (pultdachHöheDifferenz * factor)
            } else {
                dachKante = (traufhöhe + 0.85)
            }
            
            const buttonY = sockelHöhe + (dachKante - sockelHöhe) / 2
            const buttonX = rechts ? xWert - 0.7 : xWert + 0.7
            const buttonId = `${wandTyp}-0`
            const isHovered = hoveredButton === buttonId
            
            buttons.push(
                <>
                <mesh 
                    key={`button-${wandTyp}-0`}
                    position={[buttonX, buttonY, buttonZ]}
                    rotation={[Math.PI / 2, Math.PI / 2, 0]}
                    onPointerOver={() => setHoveredButton(buttonId)}
                    onPointerOut={() => setHoveredButton(null)}
                    onClick={() => setEditMenü(prev => prev === "Öffnungen-Auswahl" ? null : "Öffnungen-Auswahl")}
                >
                    <circleGeometry args={[1.5, 32]} />
                    <meshStandardMaterial 
                        color={isHovered ? "rgba(100, 150, 200, 0.9)" : "rgba(173, 216, 230, 0.7)"} 
                        side={THREE.DoubleSide} 
                    />
                </mesh>
                <mesh 
                    key={`button-ring-${wandTyp}-0`}
                    position={[buttonX, buttonY, buttonZ]}
                    rotation={[Math.PI / 2, Math.PI / 2, 0]}
                >
                    <ringGeometry args={[1.5, 1.65, 32]} />
                    <meshStandardMaterial color="black" side={THREE.DoubleSide} />
                </mesh>
                <mesh 
                    key={`button-plus-h-${wandTyp}-0`}
                    position={[buttonX, buttonY, buttonZ]}
                    rotation={[Math.PI / 2, Math.PI / 2, 0]}
                >
                    <boxGeometry args={[1.2, 0.2, 0.05]} />
                    <meshStandardMaterial color="black" />
                </mesh>
                <mesh 
                    key={`button-plus-v-${wandTyp}-0`}
                    position={[buttonX, buttonY, buttonZ]}
                    rotation={[Math.PI / 2, Math.PI / 2, 0]}
                >
                    <boxGeometry args={[0.2, 1.2, 0.05]} />
                    <meshStandardMaterial color="black" />
                </mesh>
                </>
            )
        } else if (anzahlBalken > 0) {
            const gleichmäßigerAbstand = wandLänge / (anzahlBalken + 1)
            
            // Buttons zwischen Balken und am Anfang/Ende
            for (let i = 0; i <= anzahlBalken; i++) {
                const buttonZ = (zHinten - 1) + (i + 0.5) * gleichmäßigerAbstand
                
                // Berechne Dachkante für diese Position
                let dachKante
                if (dachArt === 'pultdach') {
                    const factor = (buttonZ - (zHinten - 1)) / wandLänge
                    dachKante = (traufhöhe + 0.85) + (pultdachHöheDifferenz * factor)
                } else {
                    dachKante = (traufhöhe + 0.85)
                }
                
                // Vertikale Mitte zwischen Sockelhöhe und Dachkante
                const buttonY = sockelHöhe + (dachKante - sockelHöhe) / 2
                
                const buttonX = rechts ? xWert - 0.7 : xWert + 0.7
                const buttonId = `${wandTyp}-${i}`
                const isHovered = hoveredButton === buttonId
                
                buttons.push(
                    <>
                    <mesh 
                        key={`button-${wandTyp}-${i}`}
                        position={[buttonX, buttonY, buttonZ]}
                        rotation={[Math.PI / 2, Math.PI / 2, 0]}
                        onPointerOver={() => setHoveredButton(buttonId)}
                        onPointerOut={() => setHoveredButton(null)}
                        onClick={() => setEditMenü(prev => prev === "Öffnungen-Auswahl" ? null : "Öffnungen-Auswahl")}
                    >
                        <circleGeometry args={[1.5, 32]} />
                        <meshStandardMaterial 
                            color={isHovered ? "rgba(100, 150, 200, 0.9)" : "rgba(173, 216, 230, 0.7)"} 
                            side={THREE.DoubleSide} 
                        />
                    </mesh>
                    <mesh 
                        key={`button-ring-${wandTyp}-${i}`}
                        position={[buttonX, buttonY, buttonZ]}
                        rotation={[Math.PI / 2, Math.PI / 2, 0]}
                    >
                        <ringGeometry args={[1.5, 1.65, 32]} />
                        <meshStandardMaterial color="black" side={THREE.DoubleSide} />
                    </mesh>
                    {/* Plus-Zeichen - Horizontaler Balken */}
                    <mesh 
                        key={`button-plus-h-${wandTyp}-${i}`}
                        position={[buttonX, buttonY, buttonZ]}
                        rotation={[Math.PI / 2, Math.PI / 2, 0]}
                    >
                        <boxGeometry args={[1.2, 0.2, 0.05]} />
                        <meshStandardMaterial color="black" />
                    </mesh>
                    {/* Plus-Zeichen - Vertikaler Balken */}
                    <mesh 
                        key={`button-plus-v-${wandTyp}-${i}`}
                        position={[buttonX, buttonY, buttonZ]}
                        rotation={[Math.PI / 2, Math.PI / 2, 0]}
                    >
                        <boxGeometry args={[0.2, 1.2, 0.05]} />
                        <meshStandardMaterial color="black" />
                    </mesh>
                    </>
                )
            }
        }
    }

    return <>{buttons}</>
}