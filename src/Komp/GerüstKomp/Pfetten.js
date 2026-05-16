
import * as THREE from 'three'
import { Instance, Instances } from '@react-three/drei'
import { useEffect, useMemo } from 'react'

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
    oberfläche,
    color = '#7d7d75'
}) {

    const pfettenData = useMemo(() => {
        const positions = []
        
        // Berechne Anfangs- und Endpositionen der Längspfetten
        const xLinks = x - 9 - (0.5 * (bodenLänge - 20))
        const xRechts = x + 9 + (0.5 * (bodenLänge - 20))
        const pfettenLänge = xRechts - xLinks
        const xMitte = (xLinks + xRechts) / 2
        
        const zVorne = z + 6.5 + (0.5 * (bodenBreite - 15))
        const zHinten = z - 6.5 - (0.5 * (bodenBreite - 15))
        const hallenBreite = zVorne - zHinten

        if (dachArt === 'pultdach') {
            const pfettenOffset = 0.4
            const yHinten = y + 4.5 + gebäudeHöhe / 2 + pfettenOffset
            const yVorne = y + 4.5 + (pultdachHöheDifferenz / 2) + (gebäudeHöhe + pultdachHöheDifferenz) / 2 + pfettenOffset
            const dachLängeHorizontal = hallenBreite
            const dachLängeSchräg = Math.sqrt(Math.pow(dachLängeHorizontal, 2) + Math.pow(pultdachHöheDifferenz, 2))
            const anzahlPfetten = Math.max(2, Math.floor(dachLängeSchräg / pfettenAbstand) + 1)
            const abstand = dachLängeHorizontal / (anzahlPfetten - 1)

            for (let i = 0; i < anzahlPfetten; i++) {
                const zPos = zHinten + i * abstand
                const factor = i / (anzahlPfetten - 1)
                const yPos = yHinten + (yVorne - yHinten) * factor
                positions.push([xMitte, yPos, zPos])
            }
        } else {
            const pfettenOffset = 0.4
            const yAußen = y + 4.5 + gebäudeHöhe / 2 + pfettenOffset
            const yMitte = y + 4.5 + (zusatzHöheMitte / 2) + (gebäudeHöhe + zusatzHöheMitte) / 2 + pfettenOffset
            const anzahlPfettenProSeite = Math.max(2, Math.floor((hallenBreite / 2) / pfettenAbstand))
            const abstandProSeite = (hallenBreite / 2) / anzahlPfettenProSeite

            for (let i = 0; i <= anzahlPfettenProSeite; i++) {
                const zPos = z + i * abstandProSeite
                const factor = i / anzahlPfettenProSeite
                const yPos = yMitte + (yAußen - yMitte) * factor
                positions.push([xMitte, yPos, zPos])
            }

            for (let i = 1; i <= anzahlPfettenProSeite; i++) {
                const zPos = z - i * abstandProSeite
                const factor = i / anzahlPfettenProSeite
                const yPos = yMitte + (yAußen - yMitte) * factor
                positions.push([xMitte, yPos, zPos])
            }
        }

        return {
            positions,
            pfettenLänge,
        }
    }, [x, y, z, bodenBreite, bodenLänge, gebäudeHöhe, zusatzHöheMitte, dachArt, pultdachHöheDifferenz, pfettenAbstand])

    const frameGeometry = useMemo(() => {
        return new THREE.EdgesGeometry(new THREE.BoxGeometry(pfettenData.pfettenLänge, 0.3, 0.3))
    }, [pfettenData.pfettenLänge])

    const frameMaterial = useMemo(() => {
        return new THREE.LineBasicMaterial({ color: 'black' })
    }, [])

    useEffect(() => {
        return () => {
            frameGeometry.dispose()
            frameMaterial.dispose()
        }
    }, [frameGeometry, frameMaterial])

    return(
        <>
            {oberfläche && pfettenData.positions.length > 0 && (
                <Instances limit={pfettenData.positions.length}>
                    <boxGeometry args={[pfettenData.pfettenLänge, 0.3, 0.3]} />
                    <meshStandardMaterial color={color} />
                    {pfettenData.positions.map((position, index) => (
                        <Instance key={`pfette-instanz-${index}`} position={position} />
                    ))}
                </Instances>
            )}

            {frame && pfettenData.positions.map((position, index) => (
                <lineSegments key={`pfette-frame-${index}`} position={position} geometry={frameGeometry} material={frameMaterial} />
            ))}
        </>
    )
}