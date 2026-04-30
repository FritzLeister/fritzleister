

import * as THREE from 'three'
import { Text } from '@react-three/drei'

export default function Abgrenzung({
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

    const balken = []

    // Lange Wände (vorne/hinten)
    if (wandTyp === 'langVorne' || wandTyp === 'langHinten') {
        const rechts = wandTyp === 'langHinten'
        const wandLänge = längeLangeSeite + 1.75
        const zWert = rechts ? zHinten - 1 : zVorne + 1
        
        let plattenHöhe, plattenYPosition
        if (dachArt === 'pultdach') {
            const höheOben = rechts ? (traufhöhe + 0.85) : (traufhöhe + 0.85 + pultdachHöheDifferenz)
            // Beide Seiten gleich hoch machen
            plattenHöhe = höheOben - sockelHöhe - 5
            plattenYPosition = sockelHöhe + 0.3 + plattenHöhe / 2
        } else {
            // Einheitliche Höhe für Satteldach
            plattenHöhe = (traufhöhe + 0.85) - sockelHöhe - 5
            plattenYPosition = sockelHöhe + 0.3 + plattenHöhe / 2
        }

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
        
        balkenPositionen.forEach((balkenX, idx) => {
            const i = idx + 1
                const balkenZ = rechts ? zWert - 0.7 : zWert + 0.7
                
                // Erstelle gestrichelte Linie aus mehreren Segmenten
                const lückenHöhe = plattenHöhe / (linienEinheiten * 2)
                
                for (let seg = 0; seg < linienEinheiten; seg++) {
                    const segmentYPosition = plattenYPosition - (plattenHöhe / 2) + (seg * 2 + 1) * lückenHöhe
                    
                    balken.push(
                        <>
                        {oberflächen && (
                            <mesh 
                                key={`balken-${wandTyp}-${i}-seg-${seg}`}
                                position={[balkenX, segmentYPosition, balkenZ]}
                            >
                                <boxGeometry args={[0.05, lückenHöhe, 0.05]} />
                                <meshStandardMaterial color={'#8B4513'} />
                            </mesh>
                        )}
                        {kanten && (
                            <lineSegments
                                key={`balken-frame-${wandTyp}-${i}-seg-${seg}`}
                                position={[balkenX, segmentYPosition, balkenZ]}
                            >
                                <edgesGeometry args={[new THREE.BoxGeometry(0.05, lückenHöhe, 0.05)]} />
                                <lineBasicMaterial color="black" />
                            </lineSegments>
                        )}
                        </>
                    )
                }
                
                // Nummer über dem Balken (Buchstaben für lange Wände)
                balken.push(
                    <Text
                        rotation={[0, wandTyp==='langHinten' ? 9.4 : 0, 0]}
                        key={`text-${wandTyp}-${i}`}
                        position={[balkenX, plattenYPosition + (plattenHöhe / 2) + 1, balkenZ]}
                        fontSize={4}
                        color="brown"
                        anchorX="center"
                        anchorY="middle"
                    >
                        {String.fromCharCode(64 + i)}
                    </Text>
                )
            })
    }

    // Kurze Wände (links/rechts)
    if (wandTyp === 'kurzLinks' || wandTyp === 'kurzRechts') {
        const rechts = wandTyp === 'kurzLinks'
        const wandLänge = längeKurzeSeite + 1.85
        const xWert = rechts ? xLinks - 1 : xRechts + 1

        const anzahlBalken = Math.floor(wandLänge / balkenAbstand)
        
        // Spezialfall: Wenn Breite unter 9m, genau 2 Balken nahe an den Rändern
        // Verwende originalBreite falls verfügbar, sonst berechne aus wandLänge
        const breiteInMeter = originalBreite || (wandLänge / 2.5)
        const balkenPositionen = []
        
        console.log('Kurze Wand:', wandTyp, 'originalBreite:', originalBreite, 'breiteInMeter:', breiteInMeter, 'wandLänge:', wandLänge)
        
        if (breiteInMeter < 9) {
            // 2 Balken nahe an den Rändern (Abstand von 2 Einheiten vom Rand)
            balkenPositionen.push(zHinten - 1 + 2)
            balkenPositionen.push(zVorne + 1 - 2)
            console.log('< 9m: Erstelle 2 Balken bei:', balkenPositionen)
        } else if (anzahlBalken > 0) {
            const gleichmäßigerAbstand = wandLänge / (anzahlBalken + 1)
            for (let i = 1; i <= anzahlBalken; i++) {
                balkenPositionen.push((zHinten - 1) + (i * gleichmäßigerAbstand))
            }
            console.log('>= 9m: Erstelle', anzahlBalken, 'Balken bei:', balkenPositionen)
        }
        
        balkenPositionen.forEach((balkenZ, idx) => {
            const i = idx + 1
                let balkenHöhe, balkenYPosition
                
                if (dachArt === 'pultdach') {
                    const factor = (balkenZ - (zHinten - 1)) / wandLänge
                    const höheOben = (traufhöhe + 0.85) + (pultdachHöheDifferenz * factor)
                    balkenHöhe = höheOben + 0.22 - sockelHöhe - 6
                    balkenYPosition = sockelHöhe + balkenHöhe / 2
                } else {
                    // Einheitliche Höhe für Satteldach - gleich wie lange Wände
                    balkenHöhe = (traufhöhe + 0.85) - sockelHöhe - 5
                    balkenYPosition = sockelHöhe + 0.3 + balkenHöhe / 2
                }
                
                const balkenX = rechts ? xWert - 0.7 : xWert + 0.7
                
                // Erstelle gestrichelte Linie aus mehreren Segmenten
                const lückenHöhe = balkenHöhe / (linienEinheiten * 2)
                
                for (let seg = 0; seg < linienEinheiten; seg++) {
                    const segmentYPos = balkenYPosition - (balkenHöhe / 2) + (seg * 2 + 1) * lückenHöhe
                    
                    balken.push(
                        <>
                        {oberflächen && (
                            <mesh 
                                key={`balken-${wandTyp}-${i}-seg-${seg}`}
                                position={[balkenX, segmentYPos, balkenZ]}
                            >
                                <boxGeometry args={[0.15, lückenHöhe, 0.15]} />
                                <meshStandardMaterial color={'#8B4513'} />
                            </mesh>
                        )}
                        {kanten && (
                            <lineSegments
                                key={`balken-frame-${wandTyp}-${i}-seg-${seg}`}
                                position={[balkenX, segmentYPos, balkenZ]}
                            >
                                <edgesGeometry args={[new THREE.BoxGeometry(0.15, lückenHöhe, 0.15)]} />
                                <lineBasicMaterial color="black" />
                            </lineSegments>
                        )}
                        </>
                    )
                }
                
                // Nummer über dem Balken
                balken.push(
                    <Text
                        rotation={[0,wandTyp==='kurzRechts' ? -4.75 : 4.75, 0]}
                        key={`text-${wandTyp}-${i}`}
                        position={[balkenX, balkenYPosition + (balkenHöhe / 2) + 1, balkenZ]}
                        fontSize={4}
                        color="brown"
                        anchorX="center"
                        anchorY="middle"
                    >
                        {i}
                    </Text>
                )
            })
    }

    return(
        <>
            {balken}
        </>
    )
}