import * as THREE from 'three'
import { Geometry, Base, Subtraction } from '@react-three/csg'

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
    oberfläche,
    objs = []
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

    const leeröffnungenVolumes = (objs || [])
        .filter(obj =>
            obj.type === 'leeröffnung' &&
            (obj.bereich === 'wand' || (obj.bereich === undefined && obj.lang !== false))
        )
        .map((obj, index) => {
            const istLangeWand = obj?.lang ?? true
            const istRechts = obj?.rechts ?? true
            const öffnungsBreite = (obj?.value?.[0] ?? 12) * 2.5
            const öffnungsHöhe = (obj?.value?.[1] ?? 8) * 2.5

            return {
                id: `leer-${obj.id ?? index}`,
                position: istLangeWand
                    ? [obj?.startPos?.x ?? x, obj?.startPos?.y ?? (öffnungsHöhe / 2), istRechts ? zHinten - 1 : zVorne + 1]
                    : [istRechts ? xLinks - 1 : xRechts + 1, obj?.startPos?.y ?? (öffnungsHöhe / 2), obj?.startPos?.z ?? z],
                size: istLangeWand
                    ? [öffnungsBreite, öffnungsHöhe, 1.4]
                    : [1.4, öffnungsHöhe, öffnungsBreite]
            }
        })

    const boxIntersect = (positionA, sizeA, positionB, sizeB) => {
        const [ax, ay, az] = positionA
        const [aw, ah, ad] = sizeA
        const [bx, by, bz] = positionB
        const [bw, bh, bd] = sizeB

        const aMinX = ax - aw / 2
        const aMaxX = ax + aw / 2
        const aMinY = ay - ah / 2
        const aMaxY = ay + ah / 2
        const aMinZ = az - ad / 2
        const aMaxZ = az + ad / 2

        const bMinX = bx - bw / 2
        const bMaxX = bx + bw / 2
        const bMinY = by - bh / 2
        const bMaxY = by + bh / 2
        const bMinZ = bz - bd / 2
        const bMaxZ = bz + bd / 2

        return (
            aMinX <= bMaxX && aMaxX >= bMinX &&
            aMinY <= bMaxY && aMaxY >= bMinY &&
            aMinZ <= bMaxZ && aMaxZ >= bMinZ
        )
    }

    const renderKantteilMitAusschnitten = (key, position, size, rotation = [0, 0, 0]) => {
        const überdeckendeÖffnungen = leeröffnungenVolumes.filter(öffnung =>
            boxIntersect(position, size, öffnung.position, öffnung.size)
        )

        const hatAusschnitt = überdeckendeÖffnungen.length > 0

        const renderCsgGeometry = () => (
            <Geometry>
                <Base>
                    <boxGeometry args={size} />
                </Base>
                {überdeckendeÖffnungen.map((öffnung) => (
                    <Subtraction
                        key={`${key}-${öffnung.id}`}
                        position={[
                            öffnung.position[0] - position[0],
                            öffnung.position[1] - position[1],
                            öffnung.position[2] - position[2]
                        ]}
                    >
                        <boxGeometry args={öffnung.size} />
                    </Subtraction>
                ))}
            </Geometry>
        )

        return (
            <group key={key}>
                {oberfläche && (
                    hatAusschnitt ? (
                        <mesh position={position} rotation={rotation}>
                            {renderCsgGeometry()}
                            <meshStandardMaterial color={color} />
                        </mesh>
                    ) : (
                        <mesh position={position} rotation={rotation}>
                            <boxGeometry args={size} />
                            <meshStandardMaterial color={color} />
                        </mesh>
                    )
                )}
                {frame && (
                    hatAusschnitt ? (
                        <mesh position={position} rotation={rotation}>
                            {renderCsgGeometry()}
                            <meshBasicMaterial color="black" wireframe />
                        </mesh>
                    ) : (
                        <lineSegments position={position} rotation={rotation}>
                            <edgesGeometry args={[new THREE.BoxGeometry(size[0], size[1], size[2])]} />
                            <lineBasicMaterial color="black" />
                        </lineSegments>
                    )
                )}
            </group>
        )
    }

    return(
        <>
            {/* Vorderer Balken */}
            {renderKantteilMitAusschnitten(
                'kantteil-vorne',
                [(xLinks + xRechts) / 2, rahmenHöhe, zVorne + 1],
                [längeLangeSeite + 2, 0.5, 1]
            )}
            
            {/* Hinterer Balken */}
            {renderKantteilMitAusschnitten(
                'kantteil-hinten',
                [(xLinks + xRechts) / 2, rahmenHöhe, zHinten - 1],
                [längeLangeSeite + 2, 0.5, 1]
            )}
            
            {/* Rechter Balken */}
            {renderKantteilMitAusschnitten(
                'kantteil-rechts',
                [xRechts + 1, rahmenHöhe, (zHinten + zVorne) / 2],
                [1, 0.5, längeKurzeSeite + 3]
            )}
            
            {/* Linker Balken */}
            {renderKantteilMitAusschnitten(
                'kantteil-links',
                [xLinks - 1, rahmenHöhe, (zHinten + zVorne) / 2],
                [1, 0.5, längeKurzeSeite + 3]
            )}

            {/* Eckbalken (vertikal) */}
            {/* Vorne rechts */}
            {(() => {
                const höhe = dachArt === 'pultdach' ? (traufhöhe + 1 + pultdachHöheDifferenz) - rahmenHöhe : eckbalkenHöhe
                const yPos = rahmenHöhe + höhe / 2
                return (
                    <>
                    {renderKantteilMitAusschnitten(
                        'kantteil-ecke-vorne-rechts',
                        [xRechts + 1, yPos, zVorne + 1],
                        [0.5, höhe, 0.5]
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
                    {renderKantteilMitAusschnitten(
                        'kantteil-ecke-vorne-links',
                        [xLinks - 1, yPos, zVorne + 1],
                        [0.5, höhe, 0.5]
                    )}
                    </>
                )
            })()}
            
            {/* Hinten rechts */}
            {renderKantteilMitAusschnitten(
                'kantteil-ecke-hinten-rechts',
                [xRechts + 1, eckbalkenYPosition, zHinten - 1],
                [0.5, eckbalkenHöhe, 0.5]
            )}
            
            {/* Hinten links */}
            {renderKantteilMitAusschnitten(
                'kantteil-ecke-hinten-links',
                [xLinks - 1, eckbalkenYPosition, zHinten - 1],
                [0.5, eckbalkenHöhe, 0.5]
            )}

            {/* Schräge Verbindungsbalken für Pultdach */}
            {dachArt === 'pultdach' && (() => {
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
                        {renderKantteilMitAusschnitten('kantteil-pult-schräg-rechts', [xRechts + 1, yMitte, zMitte], [0.5, 0.5, länge], [rotation, 0, 0])}
                        {renderKantteilMitAusschnitten('kantteil-pult-schräg-links', [xLinks - 1, yMitte, zMitte], [0.5, 0.5, länge], [rotation, 0, 0])}
                        {renderKantteilMitAusschnitten('kantteil-pult-vorne', [(xLinks + xRechts) / 2, traufhöhe + 1 + pultdachHöheDifferenz, zVorne + 1], [längeLangeSeite + 2, 0.5, 0.5])}
                        {renderKantteilMitAusschnitten('kantteil-pult-hinten', [(xLinks + xRechts) / 2, traufhöhe + 1, zHinten - 1], [längeLangeSeite + 2, 0.5, 0.5])}
                    </>
                )
            })()}

            {/* Schräge Verbindungsbalken entlang des Satteldachs */}
            {dachArt === 'satteldach' && (() => {
                const zStartVorne = zVorne + 1
                const zEndVorne = 0
                const zMitteVorne = (zStartVorne + zEndVorne) / 2
                const zLängeVorne = Math.abs(zStartVorne - zEndVorne)

                const yStartVorne = traufhöhe + 1
                const yEndVorne = traufhöhe + 1 + zusatzHöheMitte
                const yMitteVorne = (yStartVorne + yEndVorne) / 2
                const yDiffVorne = yEndVorne - yStartVorne
                const längeVorne = Math.sqrt(Math.pow(zLängeVorne, 2) + Math.pow(yDiffVorne, 2))
                const rotationVorne = Math.atan2(yDiffVorne, zLängeVorne)

                const zStartHinten = 0
                const zEndHinten = zHinten - 1
                const zMitteHinten = (zStartHinten + zEndHinten) / 2
                const zLängeHinten = Math.abs(zEndHinten - zStartHinten)

                const yStartHinten = traufhöhe + 1 + zusatzHöheMitte
                const yEndHinten = traufhöhe + 1
                const yMitteHinten = (yStartHinten + yEndHinten) / 2
                const yDiffHinten = yEndHinten - yStartHinten
                const längeHinten = Math.sqrt(Math.pow(zLängeHinten, 2) + Math.pow(yDiffHinten, 2))
                const rotationHinten = Math.atan2(yDiffHinten, zLängeHinten)

                return (
                    <>
                        {renderKantteilMitAusschnitten('kantteil-sattel-rechts-vorne', [xRechts + 1, yMitteVorne, zMitteVorne], [0.5, 0.5, längeVorne], [rotationVorne, 0, 0])}
                        {renderKantteilMitAusschnitten('kantteil-sattel-rechts-hinten', [xRechts + 1, yMitteHinten, zMitteHinten], [0.5, 0.5, längeHinten], [rotationHinten, 0, 0])}
                        {renderKantteilMitAusschnitten('kantteil-sattel-links-vorne', [xLinks - 1, yMitteVorne, zMitteVorne], [0.5, 0.5, längeVorne], [rotationVorne, 0, 0])}
                        {renderKantteilMitAusschnitten('kantteil-sattel-links-hinten', [xLinks - 1, yMitteHinten, zMitteHinten], [0.5, 0.5, längeHinten], [rotationHinten, 0, 0])}
                        {renderKantteilMitAusschnitten('kantteil-sattel-mitte-vorne', [(xLinks + xRechts) / 2, traufhöhe + 0.8 + zusatzHöheMitte, -0.3], [längeLangeSeite + 2, 0.3, 0.5], [-rotationVorne, 0, 0])}
                        {renderKantteilMitAusschnitten('kantteil-sattel-mitte-hinten', [(xLinks + xRechts) / 2, traufhöhe + 0.8 + zusatzHöheMitte, 0.3], [längeLangeSeite + 2, 0.3, 0.5], [-rotationHinten, 0, 0])}
                        {renderKantteilMitAusschnitten('kantteil-sattel-vorne', [(xLinks + xRechts) / 2, traufhöhe + 1, zVorne + 1], [längeLangeSeite + 2.5, 0.5, 0.5])}
                        {renderKantteilMitAusschnitten('kantteil-sattel-hinten', [(xLinks + xRechts) / 2, traufhöhe + 1, zHinten - 1], [längeLangeSeite + 2.5, 0.5, 0.5])}
                    </>
                )
            })()}
        </>
    )
}