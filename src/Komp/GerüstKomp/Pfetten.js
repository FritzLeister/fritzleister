
import * as THREE from 'three'

export default function Pfetten({
    x,
    y,
    z,
    bodenBreite,
    bodenLänge,
    gebäudeHöhe,
    stelzenAbstand = 10,
    zusatzHöheMitte = 15,
    dachArt,
    pultdachHöheDifferenz = 5,
    pfettenAbstand, // Abstand zwischen den Pfetten in z-Richtung
    frame,
    oberfläche
}) {

    function erstellePfetten() {
        const pfetten = []
        
        // Berechne Anfangs- und Endpositionen der Längspfetten
        const xLinks = x - 9 - (0.5 * (bodenLänge - 20))
        const xRechts = x + 9 + (0.5 * (bodenLänge - 20))
        const pfettenLänge = xRechts - xLinks
        
        const zVorne = z + 6.5 + (0.5 * (bodenBreite - 15))
        const zHinten = z - 6.5 - (0.5 * (bodenBreite - 15))
        const hallenBreite = zVorne - zHinten
        
        if (dachArt === 'pultdach') {
            // Pultdach: Pfetten verlaufen schräg von hinten (niedrig) nach vorne (hoch)
            const pfettenOffset = 0.4 // Pfetten liegen etwas über dem Rahmen
            const yHinten = y + 4.5 + gebäudeHöhe / 2 + pfettenOffset
            const yVorne = y + 4.5 + (pultdachHöheDifferenz / 2) + (gebäudeHöhe + pultdachHöheDifferenz) / 2 + pfettenOffset
            
            // Anzahl der Pfetten basierend auf der schrägen Dachlänge
            const dachLängeHorizontal = hallenBreite
            const dachLängeSchräg = Math.sqrt(Math.pow(dachLängeHorizontal, 2) + Math.pow(pultdachHöheDifferenz, 2))
            const anzahlPfetten = Math.max(2, Math.floor(dachLängeSchräg / pfettenAbstand) + 1)
            const abstand = dachLängeHorizontal / (anzahlPfetten - 1)
            
            // Berechne Rotationswinkel des Daches
            const dachNeigung = Math.atan2(pultdachHöheDifferenz, dachLängeHorizontal)
            
            for (let i = 0; i < anzahlPfetten; i++) {
                const zPos = zHinten + i * abstand
                // Lineare Interpolation der Höhe
                const factor = i / (anzahlPfetten - 1)
                const yPos = yHinten + (yVorne - yHinten) * factor
                
                pfetten.push(
                    <group key={`pfette-pult-${i}`}>
                        {oberfläche && (
                        <mesh position={[(xLinks + xRechts) / 2, yPos, zPos]} rotation={[0, 0, 0]}>
                            <boxGeometry args={[pfettenLänge, 0.3, 0.3]} />
                            <meshStandardMaterial color={"#7d7d75"} />
                        </mesh>
                        )}
                        {frame && (
                        <lineSegments position={[(xLinks + xRechts) / 2, yPos, zPos]} rotation={[0, 0, 0]}>
                            <edgesGeometry args={[new THREE.BoxGeometry(pfettenLänge, 0.3, 0.3)]} />
                            <lineBasicMaterial color="black" />
                        </lineSegments>
                        )}
                    </group>
                )
            }
            
            
        } else {
            // Satteldach: Pfetten auf beiden Dachseiten
            const pfettenOffset = 0.4 // Pfetten liegen etwas über dem Rahmen
            const yAußen = y + 4.5 + gebäudeHöhe / 2 + pfettenOffset
            const yMitte = y + 4.5 + (zusatzHöheMitte / 2) + (gebäudeHöhe + zusatzHöheMitte) / 2 + pfettenOffset
            
            // Anzahl der Pfetten pro Dachhälfte
            const anzahlPfettenProSeite = Math.max(2, Math.floor((hallenBreite / 2) / pfettenAbstand))
            const abstandProSeite = (hallenBreite / 2) / anzahlPfettenProSeite
            
            // Pfetten auf der vorderen Dachseite (von Mitte nach vorne)
            for (let i = 0; i <= anzahlPfettenProSeite; i++) {
                const zPos = z + i * abstandProSeite
                // Lineare Interpolation der Höhe von Mitte zu vorne
                const factor = i / anzahlPfettenProSeite
                const yPos = yMitte + (yAußen - yMitte) * factor
                
                pfetten.push(
                    <group key={`pfette-satteldach-vorne-${i}`}>
                        {oberfläche && (
                        <mesh position={[(xLinks + xRechts) / 2, yPos, zPos]}>
                            <boxGeometry args={[pfettenLänge, 0.3, 0.3]} />
                            <meshStandardMaterial color={"rgba(129, 108, 108, 1)"} />
                        </mesh>
                        )}
                        {frame && (
                        <lineSegments position={[(xLinks + xRechts) / 2, yPos, zPos]}>
                            <edgesGeometry args={[new THREE.BoxGeometry(pfettenLänge, 0.3, 0.3)]} />
                            <lineBasicMaterial color="black" />
                        </lineSegments>
                        )}
                    </group>
                )
            }
            
            // Pfetten auf der hinteren Dachseite (von Mitte nach hinten)
            for (let i = 1; i <= anzahlPfettenProSeite; i++) {
                const zPos = z - i * abstandProSeite
                // Lineare Interpolation der Höhe von Mitte zu hinten
                const factor = i / anzahlPfettenProSeite
                const yPos = yMitte + (yAußen - yMitte) * factor
                
                pfetten.push(
                    <group key={`pfette-satteldach-hinten-${i}`}>
                        {oberfläche && (
                        <mesh position={[(xLinks + xRechts) / 2, yPos, zPos]}>
                            <boxGeometry args={[pfettenLänge, 0.3, 0.3]} />
                            <meshStandardMaterial color={"rgba(129, 108, 108, 1)"} />
                        </mesh>
                        )}
                        {frame && (
                        <lineSegments position={[(xLinks + xRechts) / 2, yPos, zPos]}>
                            <edgesGeometry args={[new THREE.BoxGeometry(pfettenLänge, 0.3, 0.3)]} />
                            <lineBasicMaterial color="black" />
                        </lineSegments>
                        )}
                    </group>
                )
            }
        }
        
        return pfetten
    }

    return(
        <>
            {erstellePfetten()}
        </>
    )
}