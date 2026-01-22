import * as THREE from 'three'

export default function WandRiegel({
    x,
    y,
    z,
    bodenBreite,
    bodenLänge,
    gebäudeHöhe,
    stelzenAbstand = 10,
    zusatzHöheMitte = 5,
    dachArt = 'satteldach',
    pultdachHöheDifferenz = 5,
    riegelFaktor = 4,
    frame,
    oberfläche
}) {

    function erstelleWandRiegel() {
        const riegel = []
        
        // Berechne Positionen der Ecken
        const xLinks = x - 9 - (0.5 * (bodenLänge - 20))
        const xRechts = x + 9 + (0.5 * (bodenLänge - 20))
        const zVorne = z + 6.5 + (0.5 * (bodenBreite - 15))
        const zHinten = z - 6.5 - (0.5 * (bodenBreite - 15))
        
        // Riegel auf Höhe der Eck-Stelzen (Oberkante der normalen Gebäudehöhe)
        const riegelHöhe = y + 4.5 + gebäudeHöhe / 2
        
        const längeLangeSeite = xRechts - xLinks
        const längeKurzeSeite = zVorne - zHinten

        const wievieleRiegel = Math.floor(gebäudeHöhe / riegelFaktor)
        
        // Vordere Riegel (horizontal)
        for (let i = 0; i <= wievieleRiegel; i++) {
            riegel.push(
                <group key={`riegel-vorne-${i}`}>
                    {oberfläche && (
                    <mesh position={[(xLinks + xRechts) / 2, riegelHöhe-0.5 - i * riegelFaktor, zVorne+0.4]}>
                        <boxGeometry args={[längeLangeSeite, 0.3, 0.3]} />
                        <meshStandardMaterial color={"#7d7d75"} />
                    </mesh>
                    )}
                    {frame && (
                    <lineSegments position={[(xLinks + xRechts) / 2, riegelHöhe-0.5 - i * riegelFaktor, zVorne+0.4]}>
                        <edgesGeometry args={[new THREE.BoxGeometry(längeLangeSeite, 0.3, 0.3)]} />
                        <lineBasicMaterial color="black" />
                    </lineSegments>
                    )}
                </group>
            )
        }
        
        // Hintere Riegel (horizontal)
        for (let i = 0; i <= wievieleRiegel; i++) {
            riegel.push(
                <group key={`riegel-hinten-${i}`}>
                    {oberfläche && (
                    <mesh position={[(xLinks + xRechts) / 2, riegelHöhe-0.5 - i * riegelFaktor, zHinten-0.4]}>
                        <boxGeometry args={[längeLangeSeite, 0.3, 0.3]} />
                        <meshStandardMaterial color={"#7d7d75"} />
                    </mesh>
                    )}
                    {frame && (
                    <lineSegments position={[(xLinks + xRechts) / 2, riegelHöhe-0.5 - i * riegelFaktor, zHinten-0.4]}>
                        <edgesGeometry args={[new THREE.BoxGeometry(längeLangeSeite, 0.3, 0.3)]} />
                        <lineBasicMaterial color="black" />
                    </lineSegments>
                    )}
                </group>
            )
        }
        
        // Rechte Riegel (horizontal)
        for (let i = 0; i <= wievieleRiegel; i++) {
            riegel.push(
                <group key={`riegel-rechts-${i}`}>
                    {oberfläche && (
                    <mesh position={[xRechts+0.4, riegelHöhe-0.5 - i * riegelFaktor, (zHinten + zVorne) / 2]}>
                        <boxGeometry args={[0.3, 0.3, längeKurzeSeite]} />
                        <meshStandardMaterial color={"#7d7d75"} />
                    </mesh>
                    )}
                    {frame && (
                    <lineSegments position={[xRechts+0.4, riegelHöhe-0.5 - i * riegelFaktor, (zHinten + zVorne) / 2]}>
                        <edgesGeometry args={[new THREE.BoxGeometry(0.3, 0.3, längeKurzeSeite)]} />
                        <lineBasicMaterial color="black" />
                    </lineSegments>
                    )}
                </group>
            )
        }
        
        // Linke Riegel (horizontal)
        for (let i = 0; i <= wievieleRiegel; i++) {
            riegel.push(
                <group key={`riegel-links-${i}`}>
                    {oberfläche && (
                    <mesh position={[xLinks-0.4, riegelHöhe-0.5 - i * riegelFaktor, (zHinten + zVorne) / 2]}>
                        <boxGeometry args={[0.3, 0.3, längeKurzeSeite]} />
                        <meshStandardMaterial color={"#7d7d75"} />
                    </mesh>
                    )}
                    {frame && (
                    <lineSegments position={[xLinks-0.4, riegelHöhe-0.5 - i * riegelFaktor, (zHinten + zVorne) / 2]}>
                        <edgesGeometry args={[new THREE.BoxGeometry(0.3, 0.3, längeKurzeSeite)]} />
                        <lineBasicMaterial color="black" />
                    </lineSegments>
                    )}
                </group>
            )
        }
        
        return riegel
    }

    function extraRiegel() {

        function sattel() {

            const xLinks = x - 9 - (0.5 * (bodenLänge - 20))
            const xRechts = x + 9 + (0.5 * (bodenLänge - 20))
            const zVorne = z + 6.5 + (0.5 * (bodenBreite - 15))
            const zHinten = z - 6.5 - (0.5 * (bodenBreite - 15))

            const riegelHöhe = y + 4.5 + gebäudeHöhe / 2
        
            const längeLangeSeite = xRechts - xLinks
            const längeKurzeSeite = zVorne - zHinten
            const wievieleRiegel = Math.floor(gebäudeHöhe / riegelFaktor)

            // Position der extra Riegel (oberhalb der normalen Gebäudehöhe)
            const extraRiegelHöhe = riegelHöhe + wievieleRiegel/6
            
            // Berechne wie viel höher dieser Riegel über der Basis-Gebäudehöhe ist
            const höheÜberBasis = extraRiegelHöhe - (y + 4.5 + gebäudeHöhe / 2)
            
            // Der Rahmen steigt linear von der Ecke (Höhe = gebäudeHöhe) zur Mitte (Höhe = gebäudeHöhe + zusatzHöheMitte)
            // Bei dieser Y-Position müssen wir berechnen, wie weit der Riegel nach innen verschoben werden muss
            
            // Verhältnis: Wie weit sind wir auf dem Weg zur maximalen zusätzlichen Höhe?
            const verhältnis = Math.min(1, höheÜberBasis / zusatzHöheMitte)
            
            // Je höher der Riegel, desto kürzer muss er sein
            // Bei voller Höhe darf er nur in der Mitte sein (sehr kurz)
            // Formel: Länge reduziert sich proportional zur Höhe
            const kürzung = verhältnis * (längeKurzeSeite / 2 - 2)
            const kurzeRiegel = Math.max(3, längeKurzeSeite - kürzung * 2)

            
            return(
                <>
                {zusatzHöheMitte > 4 && (
                    <>
                        {oberfläche && (
                        <mesh position={[xRechts+0.4, extraRiegelHöhe, (zHinten + zVorne) / 2]}>
                            <boxGeometry args={[0.3, 0.3, kurzeRiegel]} />
                            <meshStandardMaterial color={"#7d7d75"} />
                        </mesh>
                        )}
                        {frame && (
                        <lineSegments position={[xRechts+0.4, extraRiegelHöhe, (zHinten + zVorne) / 2]}>
                            <edgesGeometry args={[new THREE.BoxGeometry(0.3, 0.3, kurzeRiegel)]} />
                            <lineBasicMaterial color="black" />
                        </lineSegments>
                        )}
                        {oberfläche && (
                        <mesh position={[xLinks-0.4, extraRiegelHöhe, (zHinten + zVorne) / 2]}>
                            <boxGeometry args={[0.3, 0.3, kurzeRiegel]} />
                            <meshStandardMaterial color={"#7d7d75"} />
                        </mesh>
                        )}
                        {frame && (
                        <lineSegments position={[xLinks-0.4, extraRiegelHöhe, (zHinten + zVorne) / 2]}>
                            <edgesGeometry args={[new THREE.BoxGeometry(0.3, 0.3, kurzeRiegel)]} />
                            <lineBasicMaterial color="black" />
                        </lineSegments>
                        )}
                    </>
                )}
                </>
            )
        }

        function pult() {

            return
        }

        return(
            dachArt === 'satteldach' ? sattel() : pult()
        )
    }

    return(
        <>
            {erstelleWandRiegel()}
            {extraRiegel()}
        </>
    )
}