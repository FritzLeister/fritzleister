import MaßLinie from '../Maßlinie'

export default function AbgrenzungAbmessung({
    koordinate,
    bodenLänge,
    bodenBreite,
    gebäudeHöhe,
    sockelHöhe,
    kanten,
    oberflächen,
    dachArt,
    pultdachHöheDifferenz,
    zusatzHöheMitte,
    balkenAbstand,
    wandTyp, // 'langVorne', 'langHinten', 'kurzLinks', 'kurzRechts'
    linienEinheiten = 5, // Anzahl der Segmente pro gestrichelter Linie
    originalBreite // Original-Eingabewert ohne Mindestbreite
}) {
    const x = koordinate[0]
    const z = koordinate[2]

    // Berechne Positionen
    const xLinks = x - 9 - (0.5 * (bodenLänge - 20))
    const xRechts = x + 9 + (0.5 * (bodenLänge - 20))
    const zVorne = z + 6.5 + (0.5 * (bodenBreite - 15))
    const zHinten = z - 6.5 - (0.5 * (bodenBreite - 15))
    const längeLangeSeite = xRechts - xLinks
    const längeKurzeSeite = zVorne - zHinten
    
    const balken = []
    const maßlinien = []

    // Lange Wände (vorne/hinten)
    if (wandTyp === 'langVorne' || wandTyp === 'langHinten') {
        const rechts = wandTyp === 'langHinten'
        const wandLänge = längeLangeSeite + 1.75
        
        const anzahlBalken = Math.floor(wandLänge / balkenAbstand)
        
        // Spezialfall: Wenn Länge unter 9m (22.5 Einheiten), genau 2 Balken nahe an den Rändern
        const längeInMeter = wandLänge / 2.5
        const balkenPositionen = []
        
        if (längeInMeter < 9) {
            // 2 Balken nahe an den Rändern (Abstand von 2 Einheiten vom Rand)
            balkenPositionen.push(xLinks - 1 + 2)
            balkenPositionen.push(xRechts + 1 - 2)
        } else if (anzahlBalken > 0) {
            const gleichmäßigerAbstand = wandLänge / (anzahlBalken + 1)
            for (let i = 1; i <= anzahlBalken; i++) {
                balkenPositionen.push((xLinks - 1) + (i * gleichmäßigerAbstand))
            }
        }
        
        // Erstelle Maßlinien zwischen den Abgrenzungen
        if (längeInMeter < 9 && balkenPositionen.length === 2) {
            // Nur eine Maßlinie zwischen den beiden Balken
            const startX = balkenPositionen[0]
            const endX = balkenPositionen[1]
            const abstandInEinheiten = endX - startX
            const abstandInMeter = (abstandInEinheiten / 2.5).toFixed(2)
            const zPosition = rechts ? (zHinten - 7) : (zVorne + 7)
            
            maßlinien.push(
                <MaßLinie
                    key={`feld-${wandTyp}-0`}
                    start={[startX - x, 0, zPosition - z]}
                    end={[endX - x, 0, zPosition - z]}
                    offset={0}
                    label={`${abstandInMeter} m`}
                    color="#577b9e"
                    koordinate={[x, 0, z]}
                />
            )
        } else {
            // Normale Maßlinien für alle Segmente
            const wandStart = xLinks - 1
            const wandEnde = xRechts + 0.75
            const allePunkte = [wandStart, ...balkenPositionen, wandEnde]
            
            for (let i = 0; i < allePunkte.length - 1; i++) {
                const startX = allePunkte[i]
                const endX = allePunkte[i + 1]
                const abstandInEinheiten = endX - startX
                const abstandInMeter = (abstandInEinheiten / 2.5).toFixed(2)
                const zPosition = rechts ? (zHinten - 7) : (zVorne + 7)
                
                maßlinien.push(
                    <MaßLinie
                        key={`feld-${wandTyp}-${i}`}
                        start={[startX - x, 0, zPosition - z]}
                        end={[endX - x, 0, zPosition - z]}
                        offset={0}
                        label={`${abstandInMeter} m`}
                        color="#577b9e"
                        koordinate={[x, 0, z]}
                    />
                )
            }
        }
        
        
    }

    // Kurze Wände (links/rechts)
    if (wandTyp === 'kurzLinks' || wandTyp === 'kurzRechts') {
        const rechts = wandTyp === 'kurzLinks'
        const wandLänge = längeKurzeSeite + 1.85

        const anzahlBalken = Math.floor(wandLänge / balkenAbstand)
        
        // Spezialfall: Wenn Breite unter 9m, genau 2 Balken nahe an den Rändern
        // Verwende originalBreite falls verfügbar, sonst berechne aus wandLänge
        const breiteInMeter = originalBreite || (wandLänge / 2.5)
        const balkenPositionen = []
        
        if (breiteInMeter < 9) {
            // 2 Balken nahe an den Rändern (Abstand von 2 Einheiten vom Rand)
            balkenPositionen.push(zHinten - 1 + 2)
            balkenPositionen.push(zVorne + 1 - 2)
        } else if (anzahlBalken > 0) {
            const gleichmäßigerAbstand = wandLänge / (anzahlBalken + 1)
            for (let i = 1; i <= anzahlBalken; i++) {
                balkenPositionen.push((zHinten - 1) + (i * gleichmäßigerAbstand))
            }
        }
        
        // Erstelle Maßlinien zwischen den Abgrenzungen
        if (breiteInMeter < 9 && balkenPositionen.length === 2) {
            // Nur eine Maßlinie zwischen den beiden Balken
            const startZ = balkenPositionen[0]
            const endZ = balkenPositionen[1]
            const abstandInEinheiten = endZ - startZ
            const abstandInMeter = (abstandInEinheiten / 2.5).toFixed(2)
            const xPosition = rechts ? xLinks : xRechts
            
            maßlinien.push(
                <MaßLinie
                    key={`feld-${wandTyp}-0`}
                    start={[xPosition - x, 0, startZ - z]}
                    end={[xPosition - x, 0, endZ - z]}
                    offset={rechts ? 6 : -6}
                    label={`${abstandInMeter} m`}
                    color="#577b9e"
                    koordinate={[x, 0, z]}
                />
            )
        } else {
            // Normale Maßlinien für alle Segmente
            const wandStart = zHinten - 1
            const wandEnde = zVorne + 0.85
            const allePunkte = [wandStart, ...balkenPositionen, wandEnde]
            
            for (let i = 0; i < allePunkte.length - 1; i++) {
                const startZ = allePunkte[i]
                const endZ = allePunkte[i + 1]
                const abstandInEinheiten = endZ - startZ
                const abstandInMeter = (abstandInEinheiten / 2.5).toFixed(2)
                const xPosition = rechts ? xLinks : xRechts
                
                maßlinien.push(
                    <MaßLinie
                        key={`feld-${wandTyp}-${i}`}
                        start={[xPosition - x, 0, startZ - z]}
                        end={[xPosition - x, 0, endZ - z]}
                        offset={rechts ? 6 : -6}
                        label={`${abstandInMeter} m`}
                        color="#577b9e"
                        koordinate={[x, 0, z]}
                    />
                )
            }
        }
        
        balkenPositionen.forEach(() => {})
    }

    return(
        <>
            {balken}
            {maßlinien}
        </>
    )
}