
import * as THREE from 'three'

export default function Kantteile({
    x,
    y,
    z,
    bodenBreite,
    bodenLänge,
    gebäudeHöhe,
    sockelHöhe,
    zusatzHöheMitte,
    dachArt,
    pultdachHöheDifferenz = 0,
    color = 'grey',
    frame,
    oberfläche
}) {

    // Berechne Positionen der Ecken
    const xLinks = x - 9 - (0.5 * (bodenLänge - 20))
    const xRechts = x + 9 + (0.5 * (bodenLänge - 20))
    const zVorne = z + 6.5 + (0.5 * (bodenBreite - 15))
    const zHinten = z - 6.5 - (0.5 * (bodenBreite - 15))
    
    const längeLangeSeite = xRechts - xLinks
    const längeKurzeSeite = zVorne - zHinten
    
    // Rahmen 1 Einheit über der Sockelhöhe
    const rahmenHöhe = sockelHöhe
    
    // Traufhöhe (Oberkante des Gebäudes)
    const traufhöhe = y + 4.5 +gebäudeHöhe/2
    
    // Höhe der Eckbalken: von rahmenHöhe bis 1 über Traufhöhe
    const eckbalkenHöhe = (traufhöhe + 1) - rahmenHöhe
    const eckbalkenYPosition = rahmenHöhe + eckbalkenHöhe / 2

    return(
        <>
            {/* Vorderer Balken */}
            {oberfläche && (
            <mesh position={[(xLinks + xRechts) / 2, rahmenHöhe, zVorne + 1]}>
                <boxGeometry args={[längeLangeSeite + 2, 0.5, 1]} />
                <meshStandardMaterial color={color} />
            </mesh>
            )}
            {frame && (
            <lineSegments position={[(xLinks + xRechts) / 2, rahmenHöhe, zVorne + 1]}>
                <edgesGeometry args={[new THREE.BoxGeometry(längeLangeSeite + 2, 0.5, 1)]} />
                <lineBasicMaterial color="black" />
            </lineSegments>
            )}
            
            {/* Hinterer Balken */}
            {oberfläche && (
            <mesh position={[(xLinks + xRechts) / 2, rahmenHöhe, zHinten - 1]}>
                <boxGeometry args={[längeLangeSeite + 2, 0.5, 1]} />
                <meshStandardMaterial color={color} />
            </mesh>
            )}
            {frame && (
            <lineSegments position={[(xLinks + xRechts) / 2, rahmenHöhe, zHinten - 1]}>
                <edgesGeometry args={[new THREE.BoxGeometry(längeLangeSeite + 2, 0.5, 1)]} />
                <lineBasicMaterial color="black" />
            </lineSegments>
            )}
            
            {/* Rechter Balken */}
            {oberfläche && (
            <mesh position={[xRechts + 1, rahmenHöhe, (zHinten + zVorne) / 2]}>
                <boxGeometry args={[1, 0.5, längeKurzeSeite + 3]} />
                <meshStandardMaterial color={color} />
            </mesh>
            )}
            {frame && (
            <lineSegments position={[xRechts + 1, rahmenHöhe, (zHinten + zVorne) / 2]}>
                <edgesGeometry args={[new THREE.BoxGeometry(1, 0.5, längeKurzeSeite + 3)]} />
                <lineBasicMaterial color="black" />
            </lineSegments>
            )}
            
            {/* Linker Balken */}
            {oberfläche && (
            <mesh position={[xLinks - 1, rahmenHöhe, (zHinten + zVorne) / 2]}>
                <boxGeometry args={[1, 0.5, längeKurzeSeite + 3]} />
                <meshStandardMaterial color={color} />
            </mesh>
            )}
            {frame && (
            <lineSegments position={[xLinks - 1, rahmenHöhe, (zHinten + zVorne) / 2]}>
                <edgesGeometry args={[new THREE.BoxGeometry(1, 0.5, längeKurzeSeite + 3)]} />
                <lineBasicMaterial color="black" />
            </lineSegments>
            )}

            {/* Eckbalken (vertikal) */}
            {/* Vorne rechts */}
            {(() => {
                const höhe = dachArt === 'pultdach' ? (traufhöhe + 1 + pultdachHöheDifferenz) - rahmenHöhe : eckbalkenHöhe
                const yPos = rahmenHöhe + höhe / 2
                return (
                    <>
                    {oberfläche && (
                    <mesh position={[xRechts + 1, yPos, zVorne + 1]}>
                        <boxGeometry args={[0.5, höhe, 0.5]} />
                        <meshStandardMaterial color={color} />
                    </mesh>
                    )}
                    {frame && (
                    <lineSegments position={[xRechts + 1, yPos, zVorne + 1]}>
                        <edgesGeometry args={[new THREE.BoxGeometry(0.5, höhe, 0.5)]} />
                        <lineBasicMaterial color="black" />
                    </lineSegments>
                    )}
                    </>
                )
            })()}
            
            {/* Vorne links */}
            {(() => {
                const höhe = dachArt === 'pultdach' ? (traufhöhe + 1 + pultdachHöheDifferenz) - rahmenHöhe : eckbalkenHöhe
                const yPos = rahmenHöhe + höhe / 2
                return (
                    <>
                    {oberfläche && (
                    <mesh position={[xLinks - 1, yPos, zVorne + 1]}>
                        <boxGeometry args={[0.5, höhe, 0.5]} />
                        <meshStandardMaterial color={color} />
                    </mesh>
                    )}
                    {frame && (
                    <lineSegments position={[xLinks - 1, yPos, zVorne + 1]}>
                        <edgesGeometry args={[new THREE.BoxGeometry(0.5, höhe, 0.5)]} />
                        <lineBasicMaterial color="black" />
                    </lineSegments>
                    )}
                    </>
                )
            })()}
            
            {/* Hinten rechts */}
            {oberfläche && (
            <mesh position={[xRechts + 1, eckbalkenYPosition, zHinten - 1]}>
                <boxGeometry args={[0.5, eckbalkenHöhe, 0.5]} />
                <meshStandardMaterial color={color} />
            </mesh>
            )}
            {frame && (
            <lineSegments position={[xRechts + 1, eckbalkenYPosition, zHinten - 1]}>
                <edgesGeometry args={[new THREE.BoxGeometry(0.5, eckbalkenHöhe, 0.5)]} />
                <lineBasicMaterial color="black" />
            </lineSegments>
            )}
            
            {/* Hinten links */}
            {oberfläche && (
            <mesh position={[xLinks - 1, eckbalkenYPosition, zHinten - 1]}>
                <boxGeometry args={[0.5, eckbalkenHöhe, 0.5]} />
                <meshStandardMaterial color={color} />
            </mesh>
            )}
            {frame && (
            <lineSegments position={[xLinks - 1, eckbalkenYPosition, zHinten - 1]}>
                <edgesGeometry args={[new THREE.BoxGeometry(0.5, eckbalkenHöhe, 0.5)]} />
                <lineBasicMaterial color="black" />
            </lineSegments>
            )}

            {/* Schräge Verbindungsbalken für Pultdach */}
            {dachArt === 'pultdach' && (
                <>
                    {/* Rechte Seite - schräg von hinten (niedrig) nach vorne (hoch) */}
                    {(() => {
                        const zStart = zHinten - 1
                        const zEnd = zVorne + 1
                        const zMitte = (zStart + zEnd) / 2
                        const zLänge = Math.abs(zEnd - zStart)
                        
                        const yStart = traufhöhe + 1
                        const yEnd = traufhöhe + 1 + pultdachHöheDifferenz
                        const yMitte = (yStart + yEnd) / 2
                        const yDiff = yEnd - yStart
                        
                        const länge = Math.sqrt(Math.pow(zLänge, 2) + Math.pow(yDiff, 2))
                        const rotation = -Math.atan2(yDiff, zLänge)
                        
                        return (
                            <>
                            {oberfläche && (
                            <mesh position={[xRechts + 1, yMitte, zMitte]} rotation={[rotation, 0, 0]}>
                                <boxGeometry args={[0.5, 0.5, länge]} />
                                <meshStandardMaterial color={color} />
                            </mesh>
                            )}
                            {frame && (
                            <lineSegments position={[xRechts + 1, yMitte, zMitte]} rotation={[rotation, 0, 0]}>
                                <edgesGeometry args={[new THREE.BoxGeometry(0.5, 0.5, länge)]} />
                                <lineBasicMaterial color="black" />
                            </lineSegments>
                            )}
                            </>
                        )
                    })()}
                    
                    {/* Linke Seite - schräg von hinten (niedrig) nach vorne (hoch) */}
                    {(() => {
                        const zStart = zHinten - 1
                        const zEnd = zVorne + 1
                        const zMitte = (zStart + zEnd) / 2
                        const zLänge = Math.abs(zEnd - zStart)
                        
                        const yStart = traufhöhe + 1
                        const yEnd = traufhöhe + 1 + pultdachHöheDifferenz
                        const yMitte = (yStart + yEnd) / 2
                        const yDiff = yEnd - yStart
                        
                        const länge = Math.sqrt(Math.pow(zLänge, 2) + Math.pow(yDiff, 2))
                        const rotation = -Math.atan2(yDiff, zLänge)
                        
                        return (
                            <>
                            {oberfläche && (
                            <mesh position={[xLinks - 1, yMitte, zMitte]} rotation={[rotation, 0, 0]}>
                                <boxGeometry args={[0.5, 0.5, länge]} />
                                <meshStandardMaterial color={color} />
                            </mesh>
                            )}
                            {frame && (
                            <lineSegments position={[xLinks - 1, yMitte, zMitte]} rotation={[rotation, 0, 0]}>
                                <edgesGeometry args={[new THREE.BoxGeometry(0.5, 0.5, länge)]} />
                                <lineBasicMaterial color="black" />
                            </lineSegments>
                            )}
                            </>
                        )
                    })()}
                    
                    {/* Vordere horizontale Verbindung (hoch) */}
                    {oberfläche && (
                    <mesh position={[(xLinks + xRechts) / 2, traufhöhe + 1 + pultdachHöheDifferenz, zVorne + 1]}>
                        <boxGeometry args={[längeLangeSeite + 2, 0.5, 0.5]} />
                        <meshStandardMaterial color={color} />
                    </mesh>
                    )}
                    {frame && (
                    <lineSegments position={[(xLinks + xRechts) / 2, traufhöhe + 1 + pultdachHöheDifferenz, zVorne + 1]}>
                        <edgesGeometry args={[new THREE.BoxGeometry(längeLangeSeite + 2, 0.5, 0.5)]} />
                        <lineBasicMaterial color="black" />
                    </lineSegments>
                    )}
                    
                    {/* Hintere horizontale Verbindung (niedrig) */}
                    {oberfläche && (
                    <mesh position={[(xLinks + xRechts) / 2, traufhöhe + 1, zHinten - 1]}>
                        <boxGeometry args={[längeLangeSeite + 2, 0.5, 0.5]} />
                        <meshStandardMaterial color={color} />
                    </mesh>
                    )}
                    {frame && (
                    <lineSegments position={[(xLinks + xRechts) / 2, traufhöhe + 1, zHinten - 1]}>
                        <edgesGeometry args={[new THREE.BoxGeometry(längeLangeSeite + 2, 0.5, 0.5)]} />
                        <lineBasicMaterial color="black" />
                    </lineSegments>
                    )}
                </>
            )}

            {/* Schräge Verbindungsbalken entlang des Satteldachs */}
            {dachArt === 'satteldach' && (
                <>
                    {/* Rechte Seite - vorne zur Mitte */}
                    {(() => {
                        const zStart = zVorne + 1
                        const zEnd = 0
                        const zMitte = (zStart + zEnd) / 2
                        const zLänge = Math.abs(zStart - zEnd)
                        
                        const yStart = traufhöhe + 1
                        const yEnd = traufhöhe + 1 + zusatzHöheMitte
                        const yMitte = (yStart + yEnd) / 2
                        const yDiff = yEnd - yStart
                        
                        const länge = Math.sqrt(Math.pow(zLänge, 2) + Math.pow(yDiff, 2))
                        const rotation = Math.atan2(yDiff, zLänge)
                        
                        return (
                            <>
                            {oberfläche && (
                            <mesh position={[xRechts + 1, yMitte, zMitte]} rotation={[rotation, 0, 0]}>
                                <boxGeometry args={[0.5, 0.5, länge]} />
                                <meshStandardMaterial color={color} />
                            </mesh>
                            )}
                            {frame && (
                            <lineSegments position={[xRechts + 1, yMitte, zMitte]} rotation={[rotation, 0, 0]}>
                                <edgesGeometry args={[new THREE.BoxGeometry(0.5, 0.5, länge)]} />
                                <lineBasicMaterial color="black" />
                            </lineSegments>
                            )}
                            </>
                        )
                    })()}
                    
                    {/* Rechte Seite - Mitte nach hinten */}
                    {(() => {
                        const zStart = 0
                        const zEnd = zHinten - 1
                        const zMitte = (zStart + zEnd) / 2
                        const zLänge = Math.abs(zEnd - zStart)
                        
                        const yStart = traufhöhe + 1 + zusatzHöheMitte
                        const yEnd = traufhöhe + 1
                        const yMitte = (yStart + yEnd) / 2
                        const yDiff = yEnd - yStart
                        
                        const länge = Math.sqrt(Math.pow(zLänge, 2) + Math.pow(yDiff, 2))
                        const rotation = Math.atan2(yDiff, zLänge)
                        
                        return (
                            <>
                            {oberfläche && (
                            <mesh position={[xRechts + 1, yMitte, zMitte]} rotation={[rotation, 0, 0]}>
                                <boxGeometry args={[0.5, 0.5, länge]} />
                                <meshStandardMaterial color={color} />
                            </mesh>
                            )}
                            {frame && (
                            <lineSegments position={[xRechts + 1, yMitte, zMitte]} rotation={[rotation, 0, 0]}>
                                <edgesGeometry args={[new THREE.BoxGeometry(0.5, 0.5, länge)]} />
                                <lineBasicMaterial color="black" />
                            </lineSegments>
                            )}
                            </>
                        )
                    })()}
                    
                    {/* Linke Seite - vorne zur Mitte */}
                    {(() => {
                        const zStart = zVorne + 1
                        const zEnd = 0
                        const zMitte = (zStart + zEnd) / 2
                        const zLänge = Math.abs(zStart - zEnd)
                        
                        const yStart = traufhöhe + 1
                        const yEnd = traufhöhe + 1 + zusatzHöheMitte
                        const yMitte = (yStart + yEnd) / 2
                        const yDiff = yEnd - yStart
                        
                        const länge = Math.sqrt(Math.pow(zLänge, 2) + Math.pow(yDiff, 2))
                        const rotation = Math.atan2(yDiff, zLänge)
                        
                        return (
                            <>
                            {oberfläche && (
                            <mesh position={[xLinks - 1, yMitte, zMitte]} rotation={[rotation, 0, 0]}>
                                <boxGeometry args={[0.5, 0.5, länge]} />
                                <meshStandardMaterial color={color} />
                            </mesh>
                            )}
                            {frame && (
                            <lineSegments position={[xLinks - 1, yMitte, zMitte]} rotation={[rotation, 0, 0]}>
                                <edgesGeometry args={[new THREE.BoxGeometry(0.5, 0.5, länge)]} />
                                <lineBasicMaterial color="black" />
                            </lineSegments>
                            )}
                            </>
                        )
                    })()}
                    
                    {/* Linke Seite - Mitte nach hinten */}
                    {(() => {
                        const zStart = 0
                        const zEnd = zHinten - 1
                        const zMitte = (zStart + zEnd) / 2
                        const zLänge = Math.abs(zEnd - zStart)
                        
                        const yStart = traufhöhe + 1 + zusatzHöheMitte
                        const yEnd = traufhöhe + 1
                        const yMitte = (yStart + yEnd) / 2
                        const yDiff = yEnd - yStart
                        
                        const länge = Math.sqrt(Math.pow(zLänge, 2) + Math.pow(yDiff, 2))
                        const rotation = Math.atan2(yDiff, zLänge)
                        
                        return (
                            <>
                            {oberfläche && (
                            <mesh position={[xLinks - 1, yMitte, zMitte]} rotation={[rotation, 0, 0]}>
                                <boxGeometry args={[0.5, 0.5, länge]} />
                                <meshStandardMaterial color={color} />
                            </mesh>
                            )}
                            {frame && (
                            <lineSegments position={[xLinks - 1, yMitte, zMitte]} rotation={[rotation, 0, 0]}>
                                <edgesGeometry args={[new THREE.BoxGeometry(0.5, 0.5, länge)]} />
                                <lineBasicMaterial color="black" />
                            </lineSegments>
                            )}
                            </>
                        )
                    })()}
                    
                    {/* Parallele Verbindungsstücke in der Mitte (wo sich die schrägen Balken treffen) */}
                    {/* Erstes Verbindungsstück - rotiert wie vordere Satteldachseite */}
                    {(() => {
                        const zStart = zVorne + 1
                        const zEnd = 0
                        const zLänge = Math.abs(zStart - zEnd)
                        
                        const yStart = traufhöhe + 1
                        const yEnd = traufhöhe + 1 + zusatzHöheMitte
                        const yDiff = yEnd - yStart
                        
                        const rotation = Math.atan2(yDiff, zLänge)
                        
                        return (
                            <>
                            {oberfläche && (
                            <mesh position={[(xLinks + xRechts) / 2, traufhöhe + 0.8 + zusatzHöheMitte, -0.3]} rotation={[-rotation, 0, 0]}>
                                <boxGeometry args={[längeLangeSeite + 2, 0.3, 0.5]} />
                                <meshStandardMaterial color={color} />
                            </mesh>
                            )}
                            {frame && (
                            <lineSegments position={[(xLinks + xRechts) / 2, traufhöhe + 0.8 + zusatzHöheMitte, -0.3]} rotation={[-rotation, 0, 0]}>
                                <edgesGeometry args={[new THREE.BoxGeometry(längeLangeSeite + 2, 0.3, 0.5)]} />
                                <lineBasicMaterial color="black" />
                            </lineSegments>
                            )}
                            </>
                        )
                    })()}
                    
                    {/* Zweites Verbindungsstück - rotiert wie hintere Satteldachseite */}
                    {(() => {
                        const zStart = 0
                        const zEnd = zHinten - 1
                        const zLänge = Math.abs(zEnd - zStart)
                        
                        const yStart = traufhöhe + 1 + zusatzHöheMitte
                        const yEnd = traufhöhe + 1
                        const yDiff = yEnd - yStart
                        
                        const rotation = Math.atan2(yDiff, zLänge)
                        
                        return (
                            <>
                            {oberfläche && (
                            <mesh position={[(xLinks + xRechts) / 2, traufhöhe + 0.8 + zusatzHöheMitte, 0.3]} rotation={[-rotation, 0, 0]}>
                                <boxGeometry args={[längeLangeSeite + 2, 0.3, 0.5]} />
                                <meshStandardMaterial color={color} />
                            </mesh>
                            )}
                            {frame && (
                            <lineSegments position={[(xLinks + xRechts) / 2, traufhöhe + 0.8 + zusatzHöheMitte, 0.3]} rotation={[-rotation, 0, 0]}>
                                <edgesGeometry args={[new THREE.BoxGeometry(längeLangeSeite + 2, 0.3, 0.5)]} />
                                <lineBasicMaterial color="black" />
                            </lineSegments>
                            )}
                            </>
                        )
                    })()}
                    
                    {/* Verbindung an der vorderen langen Seite */}
                    {oberfläche && (
                    <mesh position={[(xLinks + xRechts) / 2, traufhöhe + 1, zVorne + 1]}>
                        <boxGeometry args={[längeLangeSeite + 2.5, 0.5, 0.5]} />
                        <meshStandardMaterial color={color} />
                    </mesh>
                    )}
                    {frame && (
                    <lineSegments position={[(xLinks + xRechts) / 2, traufhöhe + 1, zVorne + 1]}>
                        <edgesGeometry args={[new THREE.BoxGeometry(längeLangeSeite + 2.5, 0.5, 0.5)]} />
                        <lineBasicMaterial color="black" />
                    </lineSegments>
                    )}
                    
                    {/* Verbindung an der hinteren langen Seite */}
                    {oberfläche && (
                    <mesh position={[(xLinks + xRechts) / 2, traufhöhe + 1, zHinten - 1]}>
                        <boxGeometry args={[längeLangeSeite + 2.5, 0.5, 0.5]} />
                        <meshStandardMaterial color={color} />
                    </mesh>
                    )}
                    {frame && (
                    <lineSegments position={[(xLinks + xRechts) / 2, traufhöhe + 1, zHinten - 1]}>
                        <edgesGeometry args={[new THREE.BoxGeometry(längeLangeSeite + 2.5, 0.5, 0.5)]} />
                        <lineBasicMaterial color="black" />
                    </lineSegments>
                    )}
                </>
            )}
        </>
    )
}