import * as THREE from 'three'

export default function HallenÜbersicht({ 
    bodenLänge, 
    bodenBreite, 
    gebäudeHöhe, 
    koordinate,
    dachArt = 'satteldach',
    pultdachHöheDifferenz = 15,
    zusatzHöheMitte = 5
}) {
    
    const x = koordinate[0]
    const y = koordinate[1]
    const z = koordinate[2]
    
    // Berechne Positionen wie bei Kantteilen
    const xLinks = x - 9 - (0.5 * (bodenLänge - 20))
    const xRechts = x + 9 + (0.5 * (bodenLänge - 20))
    const zVorne = z + 6.5 + (0.5 * (bodenBreite - 15))
    const zHinten = z - 6.5 - (0.5 * (bodenBreite - 15))
    
    const traufhöhe = y + 4.5 + gebäudeHöhe
    const sockelHöhe = 5
    
    const wandHöhe = traufhöhe - sockelHöhe
    const längeLangeSeite = xRechts - xLinks
    const längeKurzeSeite = zVorne - zHinten

    // Material für alle Flächen
    const material = (
        <meshStandardMaterial 
            color="#87CEEB" 
            transparent={true} 
            opacity={0.4} 
            side={THREE.DoubleSide}
        />
    )

    return (
        <group>
            {/* Bodenplatte */}
            <mesh position={[x, y, z]}>
                <boxGeometry args={[längeLangeSeite, 0.2, längeKurzeSeite]} />
                {material}
            </mesh>

            {/* Lange Wände - alle gleich hoch */}
            <mesh position={[(xLinks + xRechts) / 2, sockelHöhe + wandHöhe / 2, zVorne]}>
                <boxGeometry args={[längeLangeSeite, wandHöhe, 0.2]} />
                {material}
            </mesh>
            <mesh position={[(xLinks + xRechts) / 2, sockelHöhe + wandHöhe / 2, zHinten]}>
                <boxGeometry args={[längeLangeSeite, wandHöhe, 0.2]} />
                {material}
            </mesh>

            {/* Kurze Wände - alle gleich hoch */}
            <mesh position={[xLinks, sockelHöhe + wandHöhe / 2, (zVorne + zHinten) / 2]}>
                <boxGeometry args={[0.2, wandHöhe, längeKurzeSeite]} />
                {material}
            </mesh>
            <mesh position={[xRechts, sockelHöhe + wandHöhe / 2, (zVorne + zHinten) / 2]}>
                <boxGeometry args={[0.2, wandHöhe, längeKurzeSeite]} />
                {material}
            </mesh>

            {/* Dach */}
            {dachArt === 'pultdach' ? (
                // Pultdach - exakte Berechnung wie in Dach.js
                <>
                    {(() => {
                        const zStart = zHinten - 1
                        const zEnd = zVorne + 1
                        const zLänge = Math.abs(zEnd - zStart)
                        
                        const yStart = traufhöhe - 4
                        const yEnd = traufhöhe + 6.2 + pultdachHöheDifferenz
                        const yMitte = (yStart + yEnd) / 2
                        const yDiff = yEnd - yStart
                        
                        const plattenLänge = Math.sqrt(Math.pow(zLänge, 2) + Math.pow(yDiff, 2))
                        const rotation = -Math.atan2(yDiff, zLänge)
                        const zMitte = (zStart + zEnd) / 2
                        
                        return (
                            <mesh 
                                position={[(xLinks + xRechts) / 2, yMitte, zMitte]}
                                rotation={[rotation, 0, 0]}
                            >
                                <planeGeometry args={[längeLangeSeite + 2, plattenLänge]} />
                                {material}
                            </mesh>
                        )
                    })()}
                </>
            ) : (
                // Satteldach - exakte Berechnung wie in Dach.js
                <>
                    {(() => {
                        // Vordere Dachhälfte
                        const zStartVorne = zVorne + 1
                        const zEndVorne = z
                        const zLängeVorne = Math.abs(zStartVorne - zEndVorne)
                        
                        const yStartVorne = traufhöhe - 4
                        const yEndVorne = traufhöhe + zusatzHöheMitte - 4 +47
                        const yMitteVorne = (yStartVorne + yEndVorne) / 2
                        const yDiffVorne = yEndVorne - yStartVorne
                        
                        const plattenLängeVorne = Math.sqrt(Math.pow(zLängeVorne, 2) + Math.pow(yDiffVorne, 2))-4
                        const rotationVorne = -Math.atan2(yDiffVorne, zLängeVorne)
                        const zMitteVorne = (zStartVorne + zEndVorne) / 2
                        
                        // Hintere Dachhälfte
                        const zStartHinten = z
                        const zEndHinten = zHinten - 1
                        const zLängeHinten = Math.abs(zEndHinten - zStartHinten)
                        
                        const yStartHinten = traufhöhe + zusatzHöheMitte - 4 +47
                        const yEndHinten = traufhöhe - 4
                        const yMitteHinten = (yStartHinten + yEndHinten) / 2
                        const yDiffHinten = yEndHinten - yStartHinten
                        
                        const plattenLängeHinten = Math.sqrt(Math.pow(zLängeHinten, 2) + Math.pow(yDiffHinten, 2))-4
                        const rotationHinten = -Math.atan2(yDiffHinten, zLängeHinten)
                        const zMitteHinten = (zStartHinten + zEndHinten) / 2
                        
                        return (
                            <>
                                {/* Vordere Dachfläche */}
                                <mesh 
                                    position={[(xLinks + xRechts) / 2, yMitteVorne, zMitteVorne]}
                                    rotation={[rotationVorne, 0, 0]}
                                >
                                    <planeGeometry args={[längeLangeSeite, plattenLängeVorne]} />
                                    {material}
                                </mesh>
                                {/* Hintere Dachfläche */}
                                <mesh 
                                    position={[(xLinks + xRechts) / 2, yMitteHinten, zMitteHinten]}
                                    rotation={[rotationHinten, 0, 0]}
                                >
                                    <planeGeometry args={[längeLangeSeite, plattenLängeHinten]} />
                                    {material}
                                </mesh>
                            </>
                        )
                    })()}
                </>
            )}
        </group>
    )
}
