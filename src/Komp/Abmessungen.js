import { useMemo } from "react"
import MaßLinie from "./Maßlinie"
import AbmessungenHöhe from "./AbmessungenHöhe"

export default function Abmessungen({ bodenLänge, bodenBreite, gebäudeHöhe, koordinate, abstand = 1, editMenü, dachArt, pultdachHöheDifferenz = 0, zusatzHöheMitte = 0 }) {
    const längeInMeter = useMemo(() => Math.round(bodenLänge/2.5), [bodenLänge])
    const breiteInMeter = useMemo(() => Math.round(bodenBreite/2.5), [bodenBreite])
    
    // Berechne Halbwerte und Viertelwerte für Segmente
    const halbLänge = useMemo(() => bodenLänge / 2, [bodenLänge])
    const halbBreite = useMemo(() => bodenBreite / 2, [bodenBreite])
    const viertelLänge = useMemo(() => bodenLänge / 4, [bodenLänge])
    
    // Zusätzlicher Offset wenn Felder-Modus aktiv ist
    const zOffset = editMenü === 'Felder' ? 2.5 : 0

    return (
        <>
        <group position={[0, 0.1, 0]}>
            {/* Länge vorne - gesamte Länge */}
            <MaßLinie
                start={[-halbLänge, 0, halbBreite]}
                end={[halbLänge, 0, halbBreite]}
                offset={8 * abstand}
                label={`${längeInMeter} m`}
                color="#2c3e50"
                koordinate={[koordinate[0], 0, koordinate[2]+4.5+zOffset]}
            />

            {/* Länge vorne - linke Hälfte */}
            <MaßLinie
                start={[-halbLänge, 0, halbBreite]}
                end={[0, 0, halbBreite]}
                offset={4 * abstand}
                label={`${(halbLänge/2.5).toFixed(2)} m`}
                color="#34495e"
                koordinate={[koordinate[0], 0, koordinate[2]+5.5+zOffset]}
            />

            {/* Länge vorne - rechte Hälfte */}
            <MaßLinie
                start={[0, 0, halbBreite]}
                end={[halbLänge, 0, halbBreite]}
                offset={4 * abstand}
                label={`${(halbLänge/2.5).toFixed(2)} m`}
                color="#34495e"
                koordinate={[koordinate[0], 0, koordinate[2]+5.5+zOffset]}
            />

            {/* Länge vorne - erstes Viertel (ganz links) */}
            <MaßLinie
                start={[-halbLänge, 0, halbBreite]}
                end={[-viertelLänge, 0, halbBreite]}
                offset={2 * abstand}
                label={`${(viertelLänge/2.5).toFixed(2)} m`}
                color="#2c3e50"
                koordinate={[koordinate[0], 0, koordinate[2]+4.5+zOffset]}
            />

            {/* Länge vorne - zweites Viertel (links-mitte) */}
            <MaßLinie
                start={[-viertelLänge, 0, halbBreite]}
                end={[0, 0, halbBreite]}
                offset={2 * abstand}
                label={`${(viertelLänge/2.5).toFixed(2)} m`}
                color="#2c3e50"
                koordinate={[koordinate[0], 0, koordinate[2]+4.5+zOffset]}
            />

            {/* Länge vorne - drittes Viertel (rechts-mitte) */}
            <MaßLinie
                start={[0, 0, halbBreite]}
                end={[viertelLänge, 0, halbBreite]}
                offset={2 * abstand}
                label={`${(viertelLänge/2.5).toFixed(2)} m`}
                color="#2c3e50"
                koordinate={[koordinate[0], 0, koordinate[2]+4.5+zOffset]}
            />

            {/* Länge vorne - viertes Viertel (ganz rechts) */}
            <MaßLinie
                start={[viertelLänge, 0, halbBreite]}
                end={[halbLänge, 0, halbBreite]}
                offset={2 * abstand}
                label={`${(viertelLänge/2.5).toFixed(2)} m`}
                color="#2c3e50"
                koordinate={[koordinate[0], 0, koordinate[2]+4.5+zOffset]}
            />

            {/* Breite links - gesamte Breite */}
            <MaßLinie
                start={[-halbLänge, 0, -halbBreite]}
                end={[-halbLänge, 0, halbBreite]}
                offset={8 * abstand}
                label={`${breiteInMeter.toFixed(2)} m`}
                color="#2c3e50"
                koordinate={[koordinate[0]-1-zOffset, 0, koordinate[2]]}
                labelOffset={[1, 0, 0]}
            />

            {/* Breite links - vordere Hälfte */}
            <MaßLinie
                start={[-halbLänge, 0, 0]}
                end={[-halbLänge, 0, halbBreite]}
                offset={4 * abstand}
                label={`${(halbBreite/2.5).toFixed(2)} m`}
                color="#34495e"
                koordinate={[koordinate[0]-2-zOffset, 0, koordinate[2]]}
                labelOffset={[1, 0, 0]}
            />

            {/* Breite links - hintere Hälfte */}
            <MaßLinie
                start={[-halbLänge, 0, -halbBreite]}
                end={[-halbLänge, 0, 0]}
                offset={4 * abstand}
                label={`${(halbBreite/2.5).toFixed(2)} m`}
                color="#34495e"
                koordinate={[koordinate[0]-2-zOffset, 0, koordinate[2]]}
                labelOffset={[1, 0, 0]}
            />
        </group>

        {/* Andere Seite */}
        <group position={[0, 0.1, 0]} rotation={[0, Math.PI, 0]}>
            {/* Länge vorne - gesamte Länge */}
            <MaßLinie
                start={[-halbLänge, 0, halbBreite]}
                end={[halbLänge, 0, halbBreite]}
                offset={8 * abstand}
                label={`${längeInMeter.toFixed(2)} m`}
                color="#2c3e50"
                koordinate={[koordinate[0], 0, koordinate[2]+4.5+zOffset]}
            />

            {/* Länge vorne - linke Hälfte */}
            <MaßLinie
                start={[-halbLänge, 0, halbBreite]}
                end={[0, 0, halbBreite]}
                offset={4 * abstand}
                label={`${(halbLänge/2.5).toFixed(2)} m`}
                color="#2c3e50"
                koordinate={[koordinate[0], 0, koordinate[2]+5.5+zOffset]}
            />

            {/* Länge vorne - rechte Hälfte */}
            <MaßLinie
                start={[0, 0, halbBreite]}
                end={[halbLänge, 0, halbBreite]}
                offset={4 * abstand}
                label={`${(halbLänge/2.5).toFixed(2)} m`}
                color="#2c3e50"
                koordinate={[koordinate[0], 0, koordinate[2]+5.5+zOffset]}
            />

            {/* Länge vorne - erstes Viertel (ganz links) */}
            <MaßLinie
                start={[-halbLänge, 0, halbBreite]}
                end={[-viertelLänge, 0, halbBreite]}
                offset={2 * abstand}
                label={`${(viertelLänge/2.5).toFixed(2)} m`}
                color="#2c3e50"
                koordinate={[koordinate[0], 0, koordinate[2]+4.5+zOffset]}
            />

            {/* Länge vorne - zweites Viertel (links-mitte) */}
            <MaßLinie
                start={[-viertelLänge, 0, halbBreite]}
                end={[0, 0, halbBreite]}
                offset={2 * abstand}
                label={`${(viertelLänge/2.5).toFixed(2)} m`}
                color="#2c3e50"
                koordinate={[koordinate[0], 0, koordinate[2]+4.5+zOffset]}
            />

            {/* Länge vorne - drittes Viertel (rechts-mitte) */}
            <MaßLinie
                start={[0, 0, halbBreite]}
                end={[viertelLänge, 0, halbBreite]}
                offset={2 * abstand}
                label={`${(viertelLänge/2.5).toFixed(2)} m`}
                color="#2c3e50"
                koordinate={[koordinate[0], 0, koordinate[2]+4.5+zOffset]}
            />

            {/* Länge vorne - viertes Viertel (ganz rechts) */}
            <MaßLinie
                start={[viertelLänge, 0, halbBreite]}
                end={[halbLänge, 0, halbBreite]}
                offset={2 * abstand}
                label={`${(viertelLänge/2.5).toFixed(2)} m`}
                color="#2c3e50"
                koordinate={[koordinate[0], 0, koordinate[2]+4.5+zOffset]}
            />

            {/* Breite links - gesamte Breite */}
            <MaßLinie
                start={[-halbLänge, 0, -halbBreite]}
                end={[-halbLänge, 0, halbBreite]}
                offset={8 * abstand}
                label={`${(breiteInMeter).toFixed(2)} m`}
                color="#2c3e50"
                koordinate={[koordinate[0]-1-zOffset, 0, koordinate[2]]}
                labelOffset={[1, 0, 0]}
            />

            {/* Breite links - vordere Hälfte */}
            <MaßLinie
                start={[-halbLänge, 0, 0]}
                end={[-halbLänge, 0, halbBreite]}
                offset={4 * abstand}
                label={`${(halbBreite/2.5).toFixed(2)} m`}
                color="#34495e"
                koordinate={[koordinate[0]-2-zOffset, 0, koordinate[2]]}
                labelOffset={[1, 0, 0]}
            />

            {/* Breite links - hintere Hälfte */}
            <MaßLinie
                start={[-halbLänge, 0, -halbBreite]}
                end={[-halbLänge, 0, 0]}
                offset={4 * abstand}
                label={`${(halbBreite/2.5).toFixed(2)} m`}
                color="#34495e"
                koordinate={[koordinate[0]-2-zOffset, 0, koordinate[2]]}
                labelOffset={[1, 0, 0]}
            />
        </group>

        <AbmessungenHöhe
            koordinate={koordinate}
            bodenLänge={bodenLänge}
            bodenBreite={bodenBreite}
            gebäudeHöhe={gebäudeHöhe}
            editMenü={editMenü}
            dachArt={dachArt}
            pultdachHöheDifferenz={pultdachHöheDifferenz}
            zusatzHöheMitte={zusatzHöheMitte}
        />
        </>
    )
}
