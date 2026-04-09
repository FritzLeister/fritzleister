import * as THREE from 'three'
import { boxIntersectsAnyOpening, getVisibleBoxSegments } from '../openingUtils'

export default function Rahmen({
    x, 
    y, 
    z,
    bodenLänge,
    bodenBreite,
    gebäudeHöhe,
    abstandFaktor,
    stelzenAbstand = 15, // Abstand zwischen Stelzen in Metern (bei 100m Halle)
    zusatzHöheMitte = 5, // Wie viel höher die mittlere Stelze im Vergleich zur gebäudeHöhe ist
    dachArt,
    pultdachHöheDifferenz = 5, // Höhenunterschied zwischen vorne und hinten beim Pultdach
    frame,
    oberfläche,
    color,
    openingVolumes = [],
    sightOpeningVolumes = []
}) {

    const renderClippedBox = (key, position, size, axis) => {
        const segments = getVisibleBoxSegments(position, size, openingVolumes, axis)

        return segments.map((segment, index) => (
            <group key={`${key}-${index}`}>
                {oberfläche && (
                    <mesh position={segment.position}>
                        <boxGeometry args={segment.size} />
                        <meshStandardMaterial color={color} />
                    </mesh>
                )}
                {frame && (
                    <lineSegments position={segment.position}>
                        <edgesGeometry args={[new THREE.BoxGeometry(...segment.size)]} />
                        <lineBasicMaterial color="black" />
                    </lineSegments>
                )}
            </group>
        ))
    }

    const renderWallPlaneBeam = (key, position, size, rotation, approxSize) => {
        if (boxIntersectsAnyOpening(position, approxSize, openingVolumes)) {
            return null
        }

        return (
            <group key={key}>
                {oberfläche && (
                    <mesh position={position} rotation={rotation}>
                        <boxGeometry args={size} />
                        <meshStandardMaterial color={color} />
                    </mesh>
                )}
                {frame && (
                    <lineSegments position={position} rotation={rotation}>
                        <edgesGeometry args={[new THREE.BoxGeometry(...size)]} />
                        <lineBasicMaterial color="black" />
                    </lineSegments>
                )}
            </group>
        )
    }

    const renderSightClippedBeam = (key, position, size, rotation, clipVolumes = sightOpeningVolumes) => {
        if (boxIntersectsAnyOpening(position, size, clipVolumes)) {
            return null
        }

        return (
            <group key={key}>
                {oberfläche && (
                    <mesh position={position} rotation={rotation}>
                        <boxGeometry args={size} />
                        <meshStandardMaterial color={color} />
                    </mesh>
                )}
                {frame && (
                    <lineSegments position={position} rotation={rotation}>
                        <edgesGeometry args={[new THREE.BoxGeometry(...size)]} />
                        <lineBasicMaterial color="black" />
                    </lineSegments>
                )}
            </group>
        )
    }

    function langeStelzen(vorne) {
        // Positionen der Eck-Stelzen
        const xLinks = x-9-(0.5*(bodenLänge-20))
        const xRechts = x+9+(0.5*(bodenLänge-20))
        
        // Gesamtstrecke zwischen den Eck-Stelzen
        const gesamtStrecke = xRechts - xLinks
        
        // Berechne Anzahl der Stelzen basierend auf Hallenlänge und gewünschtem Abstand
        const anzahlStelzen = Math.max(2, Math.round(gesamtStrecke / stelzenAbstand) + 1)
        const abstand = gesamtStrecke / (anzahlStelzen - 1)
        
        const frag = []
        const zWert = vorne ? z+6.5+(0.5*(bodenBreite-15)) : z-6.5-(0.5*(bodenBreite-15))

        if (dachArt === 'pultdach') {
            // Pultdach: Alle langen Stelzen haben die gleiche Höhe (vorne hoch, hinten niedrig)
            const höhe = vorne ? gebäudeHöhe + pultdachHöheDifferenz : gebäudeHöhe
            const yOffset = vorne ? pultdachHöheDifferenz / 2 : 0
            
            // Beginne bei 1, um die Eckstelzen zu überspringen, ende bei anzahlStelzen-2
            for (let i = 1; i < anzahlStelzen - 1; i++) {
                frag.push(...renderClippedBox(
                    `lang-${vorne ? 'vorne' : 'hinten'}-${i}`,
                    [xLinks + i * abstand, y + 4.5 + yOffset, zWert],
                    [0.5, höhe, 0.5],
                    'y'
                ));
            }
        } else {
            // Satteldach: Mittlere Stelzen höher
            // Beginne bei 1, um die Eckstelzen zu überspringen, ende bei anzahlStelzen-2
            for (let i = 1; i < anzahlStelzen - 1; i++) {
                frag.push(...renderClippedBox(
                    `lang-${vorne ? 'vorne' : 'hinten'}-${i}`,
                    [xLinks + i * abstand, y + 4.5, zWert],
                    [0.5, gebäudeHöhe, 0.5],
                    'y'
                ));

                if (vorne) {
                    const beam = renderSightClippedBeam(
                        `lang-mitte-${i}`,
                        [xLinks + i * abstand, y + 4.5 + (zusatzHöheMitte / 2), 0],
                        [0.5, gebäudeHöhe + zusatzHöheMitte, 0.5],
                        [0, 0, 0]
                    )

                    if (beam) {
                        frag.push(beam)
                    }
                }
            }
        }
        return frag;
    }


    function kurzeStelzen(rechts) {
        // Positionen der Eck-Stelzen
        const zVorne = z+6.5+(0.5*(bodenBreite-15))
        const zHinten = z-6.5-(0.5*(bodenBreite-15))
        
        // Gesamtstrecke zwischen den Eck-Stelzen
        const gesamtStrecke = zVorne - zHinten
        
        // Berechne Anzahl der Stelzen basierend auf Hallenbreite und gewünschtem Abstand
        const anzahlKurzeStelzen = Math.max(1, Math.floor(gesamtStrecke / stelzenAbstand))
        
        // Abstand zwischen den Stelzen
        const abstand = gesamtStrecke / (anzahlKurzeStelzen + 1)
        
        const frag = []
        const xWert = rechts ? x+9+(0.5*(bodenLänge-20)) : x-9-(0.5*(bodenLänge-20))
        
        if (dachArt === 'pultdach') {
            // Pultdach: Linear ansteigende Höhe von hinten (niedrig) nach vorne (hoch)
            const minHöhe = gebäudeHöhe
            const maxHöhe = gebäudeHöhe + pultdachHöheDifferenz
            
            // Gesamtanzahl Stelzen inklusive Ecken: anzahlKurzeStelzen + 2
            const gesamtAnzahl = anzahlKurzeStelzen + 2
            
            for (let i = 1; i <= anzahlKurzeStelzen; i++) {
                // Lineare Interpolation von hinten (0) nach vorne (1)
                const factor = i / (gesamtAnzahl - 1)
                const höhe = minHöhe + (maxHöhe - minHöhe) * factor
                
                frag.push(...renderClippedBox(
                    `kurz-${rechts ? 'rechts' : 'links'}-${i}`,
                    [xWert, y + 4.5 + (höhe - gebäudeHöhe) / 2, zHinten + i * abstand],
                    [0.5, höhe, 0.5],
                    'y'
                ));
            }
        } else {
            // Satteldach: Maximale Höhe in der Mitte, Minimale an den Ecken
            const maxHöhe = zusatzHöheMitte + gebäudeHöhe
            const minHöhe = gebäudeHöhe
            
            // Gesamtanzahl Stelzen inklusive Ecken: anzahlKurzeStelzen + 2
            const gesamtAnzahl = anzahlKurzeStelzen + 2
            const mittlererIndex = (gesamtAnzahl - 1) / 2

            for (let i = 1; i <= anzahlKurzeStelzen; i++) {
                // Berechne Höhe basierend auf Abstand zur Mitte (linear)
                const abstandVonMitte = Math.abs(i - mittlererIndex)
                const höhenFaktor = 1 - (abstandVonMitte / mittlererIndex)
                const höhe = minHöhe + (maxHöhe - minHöhe) * höhenFaktor
                
                frag.push(...renderClippedBox(
                    `kurz-${rechts ? 'rechts' : 'links'}-${i}`,
                    [xWert, y + 4.5 + (höhe - gebäudeHöhe) / 2, zHinten + i * abstand],
                    [0.5, höhe, 0.5],
                    'y'
                ));
            }
        }
        return frag;
    }

    // Verbindungsbalken für die kurzen Seiten (verbindet Stelzen mit gleichem X-Wert)
    function kurzeVerbindungsbalken(rechts) {
        const zVorne = z+6.5+(0.5*(bodenBreite-15))
        const zHinten = z-6.5-(0.5*(bodenBreite-15))
        const gesamtStrecke = zVorne - zHinten
        
        const anzahlKurzeStelzen = Math.floor((abstandFaktor - 1) / 2 +1)
        const abstand = gesamtStrecke / (anzahlKurzeStelzen + 1)
        
        const xWert = rechts ? x+9+(0.5*(bodenLänge-20)) : x-9-(0.5*(bodenLänge-20))
        
        const balken = []
        
        if (dachArt === 'pultdach') {
            // Pultdach: Linear ansteigende Höhe
            const minHöhe = gebäudeHöhe
            const maxHöhe = gebäudeHöhe + pultdachHöheDifferenz
            const gesamtAnzahl = anzahlKurzeStelzen + 2
            
            // Verbinde jede Stelze mit der nächsten (schräg aufsteigend)
            for (let i = 0; i <= anzahlKurzeStelzen; i++) {
                const zPos1 = zHinten + i * abstand
                const zPos2 = zHinten + (i + 1) * abstand
                const zMitte = (zPos1 + zPos2) / 2
                
                // Lineare Höheninterpolation
                const factor1 = i / (gesamtAnzahl - 1)
                const höhe1 = minHöhe + (maxHöhe - minHöhe) * factor1
                
                const factor2 = (i + 1) / (gesamtAnzahl - 1)
                const höhe2 = minHöhe + (maxHöhe - minHöhe) * factor2
                
                // Y-Positionen der oberen Enden der beiden Stelzen
                const yOben1 = y + 4.5 + (höhe1 - gebäudeHöhe) / 2 + höhe1 / 2
                const yOben2 = y + 4.5 + (höhe2 - gebäudeHöhe) / 2 + höhe2 / 2
                
                const yMitte = (yOben1 + yOben2) / 2
                const höhenDifferenz = yOben2 - yOben1
                
                // Berechne Länge und Rotation für schrägen Balken
                const länge = Math.sqrt(Math.pow(abstand, 2) + Math.pow(höhenDifferenz, 2))
                const rotation = -Math.atan2(höhenDifferenz, abstand)
                const approxSize = [0.5, Math.abs(höhenDifferenz) + 0.5, Math.abs(abstand) + 0.5]
                
                const beam = renderWallPlaneBeam(
                    `verbindung-${rechts ? 'rechts' : 'links'}-${i}`,
                    [xWert, yMitte, zMitte],
                    [0.5, 0.5, länge],
                    [rotation, 0, 0],
                    approxSize
                )

                if (beam) {
                    balken.push(beam)
                }
            }
        } else {
            // Satteldach: Höhe variiert mit Mitte als Maximum
            const maxHöhe = zusatzHöheMitte + gebäudeHöhe
            const minHöhe = gebäudeHöhe
            const gesamtAnzahl = anzahlKurzeStelzen + 2
            const mittlererIndex = (gesamtAnzahl - 1) / 2
            
            // Verbinde jede Stelze mit der nächsten (schräg)
            for (let i = 0; i <= anzahlKurzeStelzen; i++) {
                const zPos1 = zHinten + i * abstand
                const zPos2 = zHinten + (i + 1) * abstand
                const zMitte = (zPos1 + zPos2) / 2
                
                // Höhen der beiden Stelzen berechnen
                const abstandVonMitte1 = Math.abs(i - mittlererIndex)
                const höhenFaktor1 = 1 - (abstandVonMitte1 / mittlererIndex)
                const höhe1 = minHöhe + (maxHöhe - minHöhe) * höhenFaktor1
                
                const abstandVonMitte2 = Math.abs((i + 1) - mittlererIndex)
                const höhenFaktor2 = 1 - (abstandVonMitte2 / mittlererIndex)
                const höhe2 = minHöhe + (maxHöhe - minHöhe) * höhenFaktor2
                
                // Y-Positionen der oberen Enden der beiden Stelzen
                const yOben1 = y + 4.5 + (höhe1 - gebäudeHöhe) / 2 + höhe1 / 2
                const yOben2 = y + 4.5 + (höhe2 - gebäudeHöhe) / 2 + höhe2 / 2
                
                const yMitte = (yOben1 + yOben2) / 2
                const höhenDifferenz = yOben2 - yOben1
                
                // Berechne Länge und Rotation für schrägen Balken
                const länge = Math.sqrt(Math.pow(abstand, 2) + Math.pow(höhenDifferenz, 2))
                const rotation = -Math.atan2(höhenDifferenz, abstand)
                const approxSize = [0.5, Math.abs(höhenDifferenz) + 0.5, Math.abs(abstand) + 0.5]
                
                const beam = renderWallPlaneBeam(
                    `verbindung-${rechts ? 'rechts' : 'links'}-${i}`,
                    [xWert, yMitte, zMitte],
                    [0.5, 0.5, länge],
                    [rotation, 0, 0],
                    approxSize
                )

                if (beam) {
                    balken.push(beam)
                }
            }
        }
        
        return balken;
    }

    // Verbindungsbalken für die langen Seiten (verbindet Stelzen mit gleichem Z-Wert)
    function langeVerbindungsbalken(vorne) {
        const xLinks = x-9-(0.5*(bodenLänge-20))
        const xRechts = x+9+(0.5*(bodenLänge-20))
        const gesamtStrecke = xRechts - xLinks
        
        const anzahlStelzen = Math.max(2, Math.round(gesamtStrecke / stelzenAbstand) + 1)
        const abstand = gesamtStrecke / (anzahlStelzen - 1)
        
        const zWert = vorne ? z+6.5+(0.5*(bodenBreite-15)) : z-6.5-(0.5*(bodenBreite-15))
        
        const balken = []
        
        if (dachArt === 'pultdach') {
            // Pultdach: Alle Verbindungen auf gleicher Höhe (vorne hoch, hinten niedrig)
            const höhe = vorne ? gebäudeHöhe + pultdachHöheDifferenz : gebäudeHöhe
            const yOffset = vorne ? pultdachHöheDifferenz / 2 : 0
            const yOben = y + 4.5 + yOffset + höhe / 2
            
            // Verbinde jede Stelze mit der nächsten (horizontal)
            for (let i = 0; i < anzahlStelzen - 1; i++) {
                const xPos1 = xLinks + i * abstand
                const xPos2 = xLinks + (i + 1) * abstand
                const xMitte = (xPos1 + xPos2) / 2
                
                balken.push(...renderClippedBox(
                    `verbindung-lang-${vorne ? 'vorne' : 'hinten'}-${i}`,
                    [xMitte, yOben, zWert],
                    [abstand, 0.5, 0.5],
                    'x'
                ));
            }
        } else {
            // Satteldach: Horizontale Verbindungen auf gleicher Höhe
            const yOben = y + 4.5 + gebäudeHöhe / 2
            
            for (let i = 0; i < anzahlStelzen - 1; i++) {
                const xPos1 = xLinks + i * abstand
                const xPos2 = xLinks + (i + 1) * abstand
                const xMitte = (xPos1 + xPos2) / 2
                
                balken.push(...renderClippedBox(
                    `verbindung-lang-${vorne ? 'vorne' : 'hinten'}-${i}`,
                    [xMitte, yOben, zWert],
                    [abstand, 0.5, 0.5],
                    'x'
                ));
            }
        }
        
        return balken;
    }

    // Verbindungsbalken zwischen den zusätzlichen Stelzen (verbindet vorne und hinten für jede X-Position)
    function zusätzlicheVerbindungen() {
        const xLinks = x-9-(0.5*(bodenLänge-20))
        const xRechts = x+9+(0.5*(bodenLänge-20))
        const gesamtStrecke = xRechts - xLinks
        const anzahlStelzen = Math.max(2, Math.round(gesamtStrecke / stelzenAbstand) + 1)
        const abstand = gesamtStrecke / (anzahlStelzen - 1)
        
        const zVorne = z+6.5+(0.5*(bodenBreite-15))
        const zHinten = z-6.5-(0.5*(bodenBreite-15))
        
        const balken = []
        
        if (dachArt === 'pultdach') {
            // Pultdach: Verbindungen zwischen vorne (hoch) und hinten (niedrig)
            // Oberkanten der Stelzen
            const yObenVorne = y + 4.5 + (pultdachHöheDifferenz / 2) + (gebäudeHöhe + pultdachHöheDifferenz) / 2
            const yObenHinten = y + 4.5 + gebäudeHöhe / 2
            
            // Für jede zusätzliche Stelze Verbindungsbalken erstellen
            for (let i = 1; i < anzahlStelzen - 1; i++) {
                const xPos = xLinks + i * abstand
                
                // Schräge Verbindung von hinten nach vorne (ansteigend)
                const zMitte = (zHinten + zVorne) / 2
                const yMitte = (yObenHinten + yObenVorne) / 2
                const zDifferenz = zVorne - zHinten
                const yDifferenz = yObenVorne - yObenHinten
                const länge = Math.sqrt(Math.pow(zDifferenz, 2) + Math.pow(yDifferenz, 2))
                const rotation = -Math.atan2(yDifferenz, zDifferenz)
                
                const beam = renderSightClippedBeam(
                    `zusatz-verbindung-${i}`,
                    [xPos, yMitte, zMitte],
                    [0.5, 0.5, länge],
                    [rotation, 0, 0]
                )

                if (beam) {
                    balken.push(beam)
                }
            }
        } else {
            // Satteldach: Verbindungen von außen zur Mitte
            const yObenAußen = y + 4.5 + gebäudeHöhe / 2
            const yObenInnen = y + 4.5 + (zusatzHöheMitte/2) + (gebäudeHöhe + zusatzHöheMitte) / 2
            
            // Für jede zusätzliche Stelze Verbindungsbalken erstellen
            for (let i = 1; i < anzahlStelzen - 1; i++) {
                const xPos = xLinks + i * abstand
                
                // Schräge Verbindung von Mitte zur vorderen Stelze (nach rechts/vorne)
                const zMitteVorne = zVorne / 2
                const yMitteVorne = (yObenAußen + yObenInnen) / 2
                const längeVorne = Math.sqrt(Math.pow(zVorne, 2) + Math.pow(yObenInnen - yObenAußen, 2))
                const rotationVorne = Math.atan2(yObenInnen - yObenAußen, zVorne)
                
                const vorneBeam = renderSightClippedBeam(
                    `zusatz-verbindung-vorne-${i}`,
                    [xPos, yMitteVorne, zMitteVorne],
                    [0.5, 0.5, längeVorne],
                    [rotationVorne, 0, 0]
                )

                if (vorneBeam) {
                    balken.push(vorneBeam)
                }
                
                // Schräge Verbindung von Mitte zur hinteren Stelze (nach links/hinten)
                const zMitteHinten = zHinten / 2
                const längeHinten = Math.sqrt(Math.pow(zHinten, 2) + Math.pow(yObenInnen - yObenAußen, 2))
                const rotationHinten = Math.atan2(yObenInnen - yObenAußen, -zHinten)
                
                const hintenBeam = renderSightClippedBeam(
                    `zusatz-verbindung-hinten-${i}`,
                    [xPos, yMitteVorne, zMitteHinten],
                    [0.5, 0.5, längeHinten],
                    [-rotationHinten, 0, 0]
                )

                if (hintenBeam) {
                    balken.push(hintenBeam)
                }
            }
        }
        return balken;
    }


    return(
        <>

        {/* Eck-Stelzen */}
        {dachArt === 'pultdach' ? (
            // Pultdach: Vordere Ecken höher, hintere Ecken niedriger
            <>
                {/* Vorne rechts - hoch */}
                {renderClippedBox(
                    'ecke-vorne-rechts',
                    [x+9+(0.5*(bodenLänge-20)), y+4.5+(pultdachHöheDifferenz/2), z+6.5+(0.5*(bodenBreite-15))],
                    [0.5, gebäudeHöhe+pultdachHöheDifferenz, 0.5],
                    'y'
                )}

                {/* Hinten rechts - niedrig */}
                {renderClippedBox(
                    'ecke-hinten-rechts',
                    [x+9+(0.5*(bodenLänge-20)),y+4.5,z-6.5-(0.5*(bodenBreite-15))],
                    [0.5,gebäudeHöhe,0.5],
                    'y'
                )}

                {/* Hinten links - niedrig */}
                {renderClippedBox(
                    'ecke-hinten-links',
                    [x-9-(0.5*(bodenLänge-20)),y+4.5,z-6.5-(0.5*(bodenBreite-15))],
                    [0.5,gebäudeHöhe,0.5],
                    'y'
                )}

                {/* Vorne links - hoch */}
                {renderClippedBox(
                    'ecke-vorne-links',
                    [x-9-(0.5*(bodenLänge-20)),y+4.5+(pultdachHöheDifferenz/2),z+6.5+(0.5*(bodenBreite-15))],
                    [0.5,gebäudeHöhe+pultdachHöheDifferenz,0.5],
                    'y'
                )}
            </>
        ) : (
            // Satteldach oder Standard: Alle Ecken gleich hoch
            <>
                {renderClippedBox(
                    'ecke-vorne-rechts',
                    [x+9+(0.5*(bodenLänge-20)), y+4.5, z+6.5+(0.5*(bodenBreite-15))],
                    [0.5, gebäudeHöhe, 0.5],
                    'y'
                )}

                {renderClippedBox(
                    'ecke-hinten-rechts',
                    [x+9+(0.5*(bodenLänge-20)),y+4.5,z-6.5-(0.5*(bodenBreite-15))],
                    [0.5,gebäudeHöhe,0.5],
                    'y'
                )}

                {/* Hinten links - niedrig */}
                {renderClippedBox(
                    'ecke-hinten-links',
                    [x-9-(0.5*(bodenLänge-20)),y+4.5,z-6.5-(0.5*(bodenBreite-15))],
                    [0.5,gebäudeHöhe,0.5],
                    'y'
                )}

                {/* Vorne links - hoch */}
                {renderClippedBox(
                    'ecke-vorne-links',
                    [x-9-(0.5*(bodenLänge-20)),y+4.5,z+6.5+(0.5*(bodenBreite-15))],
                    [0.5,gebäudeHöhe,0.5],
                    'y'
                )}
            </>
        )}

        {/* Zusätzliche Stelzen */}
        {langeStelzen(true)}
        {langeStelzen(false)}
        {kurzeStelzen(true)}
        {kurzeStelzen(false)}

        {/* Verbindungsbalken oben (verbinden Stelzen mit gleichem X-Wert) */}
           
        {kurzeVerbindungsbalken(true)}
        {kurzeVerbindungsbalken(false)}
        {langeVerbindungsbalken(true)}
        {langeVerbindungsbalken(false)}
        {zusätzlicheVerbindungen()}
        
        </>
    )
}