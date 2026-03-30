import { useLoader } from "@react-three/fiber"
import { TextureLoader } from "three"
import { useRef } from "react"
import WandLüfter from "./WandLüfter"
import * as THREE from 'three'
import Platten from "./WandKomp/Platten"
import Abgrenzung from "./WandKomp/Abgrenzung"
import AddButtonWand from "./WandKomp/AddButtonWand"
import MassivwandCSG from "./WandKomp/MassivwandCSG"

export default function Wand({ 
    koordinate, 
    wievieleFragmente, 
    bodenLänge, 
    bodenBreite, 
    gebäudeHöhe,
    objs,
    setOrbitKontrolle,
    setSelectedObject,
    setTürAttribute,
    massivWand,
    sockelHöhe,
    dachArt,
    pultdachHöheDifferenz = 0,
    zusatzHöheMitte = 5,
    balkenAbstand = 15,
    abgrenzung,
    originalBreite,
    wandOrientierung = 'vertikal',
    setEditMenü,
    editMenü,
    setClickedButtonPos,
    kantenAnzeigen,
    oberflächenAnzeigen,
    plattenAnzeigen,
    color
}) {

    const x = koordinate[0]
    const y = koordinate[1] + 1 + (gebäudeHöhe - 6)
    const z = koordinate[2]

    const url = "/wand-textur.jpg"
    const ref = useRef()
    const texture = useLoader(TextureLoader, url)
    const PLATTEN_ZIEL_BREITE = 2.5
    const PLATTEN_ZIEL_HOEHE = 2.5
    const PLATTEN_LINIEN_DICKE = 1

    const getDefaultFensterWorldY = (fensterHöheEinheit = 6) => {
        const initialGridY = koordinate[1]
            + (gebäudeHöhe / 6)
            - 0.4
            - ((gebäudeHöhe - 15) / 6)
            - 2
            + ((fensterHöheEinheit - 1) / 4)

        // In WandFenster wird beim Rendern +4 addiert.
        return initialGridY + 4
    }

    function langeWand(rechts) {
        // Berechne Positionen wie bei Kantteilen
        const xLinks = x - 9 - (0.5 * (bodenLänge - 20))
        const xRechts = x + 9 + (0.5 * (bodenLänge - 20))
        const zVorne = z + 6.5 + (0.5 * (bodenBreite - 15))
        const zHinten = z - 6.5 - (0.5 * (bodenBreite - 15))
        const längeLangeSeite = xRechts - xLinks
        
        // Wand zwischen den Kantteilen
        const wandLänge = längeLangeSeite+1.75

        const frag = []
        const zWert = rechts ? zHinten - 1 : zVorne + 1

        const leeröffnungenFuerWand = (objs || [])
            .filter(obj => obj.type === "leeröffnung" && (obj.lang ?? true) === true && (obj.rechts ?? true) === rechts)
            .map((obj, index) => {
                const öffnungsBreite = (obj?.value?.[0] ?? 12) * 2.5
                const öffnungsHöhe = (obj?.value?.[1] ?? 8) * 2.5

                return {
                    id: `lang-${rechts ? 'hinten' : 'vorne'}-${obj.id ?? index}`,
                    position: [
                        obj?.startPos?.x ?? x,
                        obj?.startPos?.y ?? (koordinate[1] + öffnungsHöhe / 2),
                        zWert
                    ],
                    size: [öffnungsBreite, öffnungsHöhe, 1.4]
                }
            })

        const fensterFuerWand = (objs || [])
            .filter(obj => obj.type === "fenster" && (obj.lang ?? true) === true && (obj.rechts ?? true) === rechts)
            .map((obj, index) => {
                const fensterHöheEinheit = obj?.value?.[1] ?? 6
                const öffnungsBreite = (obj?.value?.[0] ?? 8) * 2.5
                const öffnungsHöhe = fensterHöheEinheit * 2.5
                const worldY = obj?.startPos?.y !== undefined
                    ? obj.startPos.y + 4
                    : getDefaultFensterWorldY(fensterHöheEinheit)
                return {
                    id: `fenster-lang-${rechts ? 'hinten' : 'vorne'}-${obj.id ?? index}`,
                    position: [obj?.startPos?.x ?? x, worldY, zWert],
                    size: [öffnungsBreite, öffnungsHöhe, 1.4]
                }
            })

        const transparentePaneeleFuerWand = (objs || [])
            .filter(obj =>
                obj.type === "transparentespaneel" &&
                (obj.bereich === 'wand' || (obj.bereich === undefined && (obj.lang ?? true) === true)) &&
                (obj.lang ?? true) === true &&
                (obj.rechts ?? true) === rechts
            )
            .map((obj, index) => {
                const öffnungsBreite = (obj?.value?.[0] ?? 3) * 2.5
                const öffnungsHöhe = (obj?.value?.[1] ?? 3) * 2.5
                const worldY = obj?.startPos?.y !== undefined
                    ? obj.startPos.y
                    : koordinate[1] + sockelHöhe + (öffnungsHöhe / 2)

                return {
                    id: `paneel-lang-${rechts ? 'hinten' : 'vorne'}-${obj.id ?? index}`,
                    position: [obj?.startPos?.x ?? x, worldY, zWert],
                    size: [öffnungsBreite, öffnungsHöhe, 1.4]
                }
            })

        const alleÖffnungenLang = [...leeröffnungenFuerWand, ...fensterFuerWand, ...transparentePaneeleFuerWand]

        const obereKanteYLang = koordinate[1] + sockelHöhe
        const hatÖffnungAnOberkanteLang = alleÖffnungenLang.some((öffnung) => {
            const öffnungMaxY = öffnung.position[1] + (öffnung.size[1] / 2)
            return öffnungMaxY >= obereKanteYLang - 0.01
        })
        
        // Berechne Platten-Höhe und Position wie bei Kantteilen
        const traufhöhe = y + 4.5 + gebäudeHöhe
        const globalRasterStartY = sockelHöhe
        
        // Bei Pultdach: vordere Wand höher, hintere Wand niedriger
        let plattenHöhe, plattenYPosition;
        if (dachArt === 'pultdach') {
            const höheOben = rechts ? (traufhöhe + 0.85) : (traufhöhe + 0.85 + pultdachHöheDifferenz);
            plattenHöhe = höheOben - sockelHöhe;
            plattenYPosition = sockelHöhe + 0.3 + plattenHöhe / 2;
        } else {
            plattenHöhe = (traufhöhe + 0.85) - sockelHöhe;
            plattenYPosition = sockelHöhe + 0.3 + plattenHöhe / 2;
        }

        if (wandOrientierung === 'horizontal') {
            const streifenMinY = plattenYPosition - (plattenHöhe / 2)
            const streifenMaxY = plattenYPosition + (plattenHöhe / 2)
            const startIndex = Math.floor((streifenMinY - globalRasterStartY) / PLATTEN_ZIEL_HOEHE)
            const endIndex = Math.ceil((streifenMaxY - globalRasterStartY) / PLATTEN_ZIEL_HOEHE)

            for (let reihe = startIndex; reihe < endIndex; reihe++) {
                const rasterMinY = globalRasterStartY + (reihe * PLATTEN_ZIEL_HOEHE)
                const rasterMaxY = rasterMinY + PLATTEN_ZIEL_HOEHE
                const reiheMinY = Math.max(streifenMinY, rasterMinY)
                const reiheMaxY = Math.min(streifenMaxY, rasterMaxY)
                const reihenHöhe = reiheMaxY - reiheMinY

                if (reihenHöhe <= 1e-6) continue

                const reihenMitteY = reiheMinY + (reihenHöhe / 2)

                const öffnungenFürReihe = alleÖffnungenLang.filter((öffnung) => {
                    const öffnungMinY = öffnung.position[1] - (öffnung.size[1] / 2)
                    const öffnungMaxY = öffnung.position[1] + (öffnung.size[1] / 2)
                    return öffnungMaxY >= reiheMinY && öffnungMinY <= reiheMaxY
                })

                frag.push(
                    <Platten
                        fragBreite={wandLänge}
                        position={[(xLinks - 1 + xRechts + 1) / 2, reihenMitteY, zWert]}
                        key={`lang-mesh-h-${rechts ? 'rechts' : 'links'}-r${reihe}`}
                        sockelHöhe={sockelHöhe}
                        lang={true}
                        gebäudeHöhe={reihenHöhe}
                        öffnungen={öffnungenFürReihe}
                        oberflächenAnzeigen={oberflächenAnzeigen}
                        plattenAnzeigen={plattenAnzeigen}
                        kantenAnzeigen={kantenAnzeigen}
                        wandOrientierung={wandOrientierung}
                        linienDicke={PLATTEN_LINIEN_DICKE}
                        color={color}
                    />
                )
            }
        } else {
            const spalten = Math.max(1, Math.ceil(wandLänge / PLATTEN_ZIEL_BREITE))
            const spaltenBreite = wandLänge / spalten
            const lokalerStartX = (xLinks - 1) + (spaltenBreite / 2)

            for (let spalte = 0; spalte < spalten; spalte++) {
                frag.push(
                    <Platten
                        fragBreite={spaltenBreite}
                        position={[lokalerStartX + spalte * spaltenBreite, plattenYPosition, zWert]}
                        key={`lang-mesh-v-${rechts ? 'rechts' : 'links'}-${spalte}`}
                        sockelHöhe={sockelHöhe}
                        lang={true}
                        gebäudeHöhe={plattenHöhe}
                        öffnungen={alleÖffnungenLang}
                        oberflächenAnzeigen={oberflächenAnzeigen}
                        plattenAnzeigen={plattenAnzeigen}
                        kantenAnzeigen={kantenAnzeigen}
                        wandOrientierung={wandOrientierung}
                        linienDicke={PLATTEN_LINIEN_DICKE}
                        color={color}
                    />
                )
            }
        }

        if (massivWand) {
            frag.push(
                <MassivwandCSG
                    key={`lang-massiv-csg-${rechts ? 'hinten' : 'vorne'}`}
                    position={[(xLinks - 1 + xRechts + 1) / 2, koordinate[1] + (sockelHöhe / 2), zWert]}
                    size={[wandLänge, sockelHöhe, 1]}
                    öffnungen={alleÖffnungenLang}
                    farbe={'grey'}
                    oberflächenAnzeigen={oberflächenAnzeigen}
                    kantenAnzeigen={false}
                />
            )
        }
        
        // Horizontale Umrandung (oben und unten, jeweils beide Kanten) + vertikale Ecken
        if (massivWand && kantenAnzeigen) {
            const halbeLänge = wandLänge / 2;
            const halbeHöhe = sockelHöhe / 2;
            const halbeDicke = 1 / 2;
            
            // Obere horizontale Linie - vordere Kante
            const punkteObenVorne = new Float32Array([
                -halbeLänge, halbeHöhe, -halbeDicke,
                halbeLänge, halbeHöhe, -halbeDicke
            ]);
            const geometryObenVorne = new THREE.BufferGeometry();
            geometryObenVorne.setAttribute('position', new THREE.BufferAttribute(punkteObenVorne, 3));
            
            // Obere horizontale Linie - hintere Kante
            const punkteObenHinten = new Float32Array([
                -halbeLänge, halbeHöhe, halbeDicke,
                halbeLänge, halbeHöhe, halbeDicke
            ]);
            const geometryObenHinten = new THREE.BufferGeometry();
            geometryObenHinten.setAttribute('position', new THREE.BufferAttribute(punkteObenHinten, 3));
            
            // Untere horizontale Linie - vordere Kante
            const punkteUntenVorne = new Float32Array([
                -halbeLänge, -halbeHöhe, -halbeDicke,
                halbeLänge, -halbeHöhe, -halbeDicke
            ]);
            const geometryUntenVorne = new THREE.BufferGeometry();
            geometryUntenVorne.setAttribute('position', new THREE.BufferAttribute(punkteUntenVorne, 3));
            
            // Untere horizontale Linie - hintere Kante
            const punkteUntenHinten = new Float32Array([
                -halbeLänge, -halbeHöhe, halbeDicke,
                halbeLänge, -halbeHöhe, halbeDicke
            ]);
            const geometryUntenHinten = new THREE.BufferGeometry();
            geometryUntenHinten.setAttribute('position', new THREE.BufferAttribute(punkteUntenHinten, 3));
            
            // Vertikale Linien an den Ecken - links vorne
            const punkteLinksVorne = new Float32Array([
                -halbeLänge, -halbeHöhe, -halbeDicke,
                -halbeLänge, halbeHöhe, -halbeDicke
            ]);
            const geometryLinksVorne = new THREE.BufferGeometry();
            geometryLinksVorne.setAttribute('position', new THREE.BufferAttribute(punkteLinksVorne, 3));
            
            // Vertikale Linien an den Ecken - links hinten
            const punkteLinksHinten = new Float32Array([
                -halbeLänge, -halbeHöhe, halbeDicke,
                -halbeLänge, halbeHöhe, halbeDicke
            ]);
            const geometryLinksHinten = new THREE.BufferGeometry();
            geometryLinksHinten.setAttribute('position', new THREE.BufferAttribute(punkteLinksHinten, 3));
            
            // Vertikale Linien an den Ecken - rechts vorne
            const punkteRechtsVorne = new Float32Array([
                halbeLänge, -halbeHöhe, -halbeDicke,
                halbeLänge, halbeHöhe, -halbeDicke
            ]);
            const geometryRechtsVorne = new THREE.BufferGeometry();
            geometryRechtsVorne.setAttribute('position', new THREE.BufferAttribute(punkteRechtsVorne, 3));
            
            // Vertikale Linien an den Ecken - rechts hinten
            const punkteRechtsHinten = new Float32Array([
                halbeLänge, -halbeHöhe, halbeDicke,
                halbeLänge, halbeHöhe, halbeDicke
            ]);
            const geometryRechtsHinten = new THREE.BufferGeometry();
            geometryRechtsHinten.setAttribute('position', new THREE.BufferAttribute(punkteRechtsHinten, 3));
            
            frag.push(
                <group key={`lang-frame-${rechts ? 'rechts' : 'links'}`} position={[(xLinks - 1 + xRechts + 1) / 2, koordinate[1] + (sockelHöhe / 2), zWert]}>
                    {!hatÖffnungAnOberkanteLang && (
                        <line geometry={geometryObenVorne}>
                            <lineBasicMaterial color="black" />
                        </line>
                    )}
                    {!hatÖffnungAnOberkanteLang && (
                        <line geometry={geometryObenHinten}>
                            <lineBasicMaterial color="black" />
                        </line>
                    )}
                    <line geometry={geometryUntenVorne}>
                        <lineBasicMaterial color="black" />
                    </line>
                    <line geometry={geometryUntenHinten}>
                        <lineBasicMaterial color="black" />
                    </line>
                    <line geometry={geometryLinksVorne}>
                        <lineBasicMaterial color="black" />
                    </line>
                    <line geometry={geometryLinksHinten}>
                        <lineBasicMaterial color="black" />
                    </line>
                    <line geometry={geometryRechtsVorne}>
                        <lineBasicMaterial color="black" />
                    </line>
                    <line geometry={geometryRechtsHinten}>
                        <lineBasicMaterial color="black" />
                    </line>
                </group>
            );
        }
        
        return frag;
    }

    function kurzeWand(rechts) {
        // Berechne Positionen wie bei Kantteilen
        const xLinks = x - 9 - (0.5 * (bodenLänge - 20))
        const xRechts = x + 9 + (0.5 * (bodenLänge - 20))
        const zVorne = z + 6.5 + (0.5 * (bodenBreite - 15))
        const zHinten = z - 6.5 - (0.5 * (bodenBreite - 15))
        const längeKurzeSeite = zVorne - zHinten
        
        // Wand zwischen den Kantteilen
        const wandLänge = längeKurzeSeite + 1.85
        const fragBreite = wandLänge / wievieleFragmente
        
        const frag = []
        const xWert = rechts ? xLinks - 1 : xRechts + 1

        const leeröffnungenFuerWand = (objs || [])
            .filter(obj => obj.type === "leeröffnung" && (obj.lang ?? true) === false && (obj.rechts ?? true) === rechts)
            .map((obj, index) => {
                const öffnungsBreite = (obj?.value?.[0] ?? 12) * 2.5
                const öffnungsHöhe = (obj?.value?.[1] ?? 8) * 2.5


                return {
                    id: `kurz-${rechts ? 'links' : 'rechts'}-${obj.id ?? index}`,
                    position: [
                        xWert,
                        obj?.startPos?.y ?? (koordinate[1] + öffnungsHöhe / 2),
                        obj?.startPos?.z ?? z
                    ],
                    size: [1.4, öffnungsHöhe, öffnungsBreite]
                }
            })

        const fensterFuerKurzeWand = (objs || [])
            .filter(obj => obj.type === "fenster" && (obj.lang ?? true) === false && (obj.rechts ?? true) === rechts)
            .map((obj, index) => {
                const fensterHöheEinheit = obj?.value?.[1] ?? 6
                const öffnungsBreite = (obj?.value?.[0] ?? 8) * 2.5
                const öffnungsHöhe = fensterHöheEinheit * 2.5
                const worldY = obj?.startPos?.y !== undefined
                    ? obj.startPos.y + 4
                    : getDefaultFensterWorldY(fensterHöheEinheit)
                return {
                    id: `fenster-kurz-${rechts ? 'links' : 'rechts'}-${obj.id ?? index}`,
                    position: [xWert, worldY, obj?.startPos?.z ?? z],
                    size: [1.4, öffnungsHöhe, öffnungsBreite]
                }
            })

        const transparentePaneeleFuerKurzeWand = (objs || [])
            .filter(obj =>
                obj.type === "transparentespaneel" &&
                obj.bereich === 'wand' &&
                (obj.lang ?? true) === false &&
                (obj.rechts ?? true) === rechts
            )
            .map((obj, index) => {
                const öffnungsBreite = (obj?.value?.[0] ?? 3) * 2.5
                const öffnungsHöhe = (obj?.value?.[1] ?? 3) * 2.5
                const worldY = obj?.startPos?.y !== undefined
                    ? obj.startPos.y
                    : koordinate[1] + sockelHöhe + (öffnungsHöhe / 2)

                return {
                    id: `paneel-kurz-${rechts ? 'links' : 'rechts'}-${obj.id ?? index}`,
                    position: [xWert, worldY, obj?.startPos?.z ?? z],
                    size: [1.4, öffnungsHöhe, öffnungsBreite]
                }
            })

        const alleÖffnungenKurz = [...leeröffnungenFuerWand, ...fensterFuerKurzeWand, ...transparentePaneeleFuerKurzeWand]

        const obereKanteYKurz = koordinate[1] + sockelHöhe
        const hatÖffnungAnOberkanteKurz = alleÖffnungenKurz.some((öffnung) => {
            const öffnungMaxY = öffnung.position[1] + (öffnung.size[1] / 2)
            return öffnungMaxY >= obereKanteYKurz - 0.01
        })

        const lüfterObjs = (objs || []).filter(obj => obj.type === "lüfter")

        const traufhöhe = y + 4.5 + gebäudeHöhe
        const globalRasterStartY = sockelHöhe
        
        const anzahlPlatten = Math.max(1, Math.ceil(wandLänge / PLATTEN_ZIEL_BREITE))
        const plattenDicke = wandLänge / anzahlPlatten
        
        for (let i = 0; i < anzahlPlatten; i++) {
            const zPos = (zHinten - 1) + (i + 0.5) * plattenDicke;
            let plattenHöhe, plattenYPosition;
            
            if (dachArt === 'pultdach') {
                // Pultdach: Linear von hinten (niedrig) nach vorne (hoch)
                const factor = i / (anzahlPlatten - 1);
                const höheOben = (traufhöhe + 0.85) + (pultdachHöheDifferenz * factor);
                plattenHöhe = höheOben+0.22 - sockelHöhe;
                plattenYPosition = sockelHöhe + plattenHöhe / 2;
            } else {
                // Satteldach: Von außen (niedrig) zur Mitte (hoch)
                const zMitte = z;
                const distanzVonMitte = Math.abs(zPos - zMitte)
                const maxDistanz = Math.max(Math.abs(zVorne + 1 - zMitte), Math.abs(zHinten - 1 - zMitte))
                const factor = 1 - (distanzVonMitte / maxDistanz)
                const höheOben = (traufhöhe + 0.85) + (zusatzHöheMitte * factor)
                plattenHöhe = höheOben+0.15 - sockelHöhe;
                plattenYPosition = sockelHöhe + plattenHöhe / 2
            }

            const streifenMinY = plattenYPosition - (plattenHöhe / 2)
            const streifenMaxY = plattenYPosition + (plattenHöhe / 2)
            const streifenMinZ = zPos - (plattenDicke / 2)
            const streifenMaxZ = zPos + (plattenDicke / 2)

            if (wandOrientierung === 'horizontal') {
                const startIndex = Math.floor((streifenMinY - globalRasterStartY) / PLATTEN_ZIEL_HOEHE)
                const endIndex = Math.ceil((streifenMaxY - globalRasterStartY) / PLATTEN_ZIEL_HOEHE)

                for (let reihe = startIndex; reihe < endIndex; reihe++) {
                    const rasterMinY = globalRasterStartY + (reihe * PLATTEN_ZIEL_HOEHE)
                    const rasterMaxY = rasterMinY + PLATTEN_ZIEL_HOEHE
                    const reiheMinY = Math.max(streifenMinY, rasterMinY)
                    const reiheMaxY = Math.min(streifenMaxY, rasterMaxY)
                    const reihenHöhe = reiheMaxY - reiheMinY

                    if (reihenHöhe <= 1e-6) continue

                    const reihenMitteY = reiheMinY + (reihenHöhe / 2)

                    const öffnungenFürReihe = alleÖffnungenKurz.filter((öffnung) => {
                        const öffnungMinY = öffnung.position[1] - (öffnung.size[1] / 2)
                        const öffnungMaxY = öffnung.position[1] + (öffnung.size[1] / 2)
                        const öffnungMinZ = öffnung.position[2] - (öffnung.size[2] / 2)
                        const öffnungMaxZ = öffnung.position[2] + (öffnung.size[2] / 2)

                        const überschneidungY = öffnungMaxY >= reiheMinY && öffnungMinY <= reiheMaxY
                        const überschneidungZ = öffnungMaxZ >= streifenMinZ && öffnungMinZ <= streifenMaxZ
                        return überschneidungY && überschneidungZ
                    })

                    frag.push(
                        <Platten
                            key={`kurz-platte-h-${rechts ? 'rechts' : 'links'}-${i}-r${reihe}`}
                            fragBreite={plattenDicke}
                            position={[xWert, reihenMitteY, zPos]}
                            sockelHöhe={sockelHöhe}
                            lang={false}
                            gebäudeHöhe={reihenHöhe}
                            öffnungen={öffnungenFürReihe}
                            oberflächenAnzeigen={oberflächenAnzeigen}
                            plattenAnzeigen={plattenAnzeigen}
                            kantenAnzeigen={kantenAnzeigen}
                            nurHorizontaleKanten={true}
                            wandOrientierung={wandOrientierung}
                            linienDicke={PLATTEN_LINIEN_DICKE}
                            color={color}
                        />
                    )
                }
            } else {
                const öffnungenFürStreifen = alleÖffnungenKurz.filter((öffnung) => {
                    const öffnungMinY = öffnung.position[1] - (öffnung.size[1] / 2)
                    const öffnungMaxY = öffnung.position[1] + (öffnung.size[1] / 2)
                    const öffnungMinZ = öffnung.position[2] - (öffnung.size[2] / 2)
                    const öffnungMaxZ = öffnung.position[2] + (öffnung.size[2] / 2)

                    const überschneidungY = öffnungMaxY >= streifenMinY && öffnungMinY <= streifenMaxY
                    const überschneidungZ = öffnungMaxZ >= streifenMinZ && öffnungMinZ <= streifenMaxZ
                    return überschneidungY && überschneidungZ
                })

                frag.push(
                    <Platten
                        key={`kurz-platte-v-${rechts ? 'rechts' : 'links'}-${i}`}
                        fragBreite={plattenDicke}
                        position={[xWert, plattenYPosition, zPos]}
                        sockelHöhe={sockelHöhe}
                        lang={false}
                        gebäudeHöhe={plattenHöhe}
                        öffnungen={öffnungenFürStreifen}
                        oberflächenAnzeigen={oberflächenAnzeigen}
                        plattenAnzeigen={plattenAnzeigen}
                        kantenAnzeigen={kantenAnzeigen}
                        wandOrientierung={wandOrientierung}
                        linienDicke={PLATTEN_LINIEN_DICKE}
                        color={color}
                    />
                )
            }
        }
        
        if (massivWand) {
            frag.push(
                <MassivwandCSG
                    key={`kurz-massiv-csg-${rechts ? 'links' : 'rechts'}`}
                    position={[xWert, koordinate[1] + (sockelHöhe / 2), (zHinten - 1 + zVorne + 1) / 2]}
                    size={[1, sockelHöhe, wandLänge]}
                    öffnungen={alleÖffnungenKurz}
                    farbe={'grey'}
                    oberflächenAnzeigen={oberflächenAnzeigen}
                    kantenAnzeigen={false}
                />
            )
        }
        
        // Durchgehende Umrandung für die gesamte Wand
        if (massivWand && kantenAnzeigen && !hatÖffnungAnOberkanteKurz) {
            frag.push(
                <lineSegments key={`kurz-frame-${rechts ? 'rechts' : 'links'}`} position={[xWert, koordinate[1] + (sockelHöhe / 2), (zHinten - 1 + zVorne + 1) / 2]}>
                    <edgesGeometry args={[new THREE.BoxGeometry(1, sockelHöhe, wandLänge)]} />
                    <lineBasicMaterial color="black" />
                </lineSegments>
            );
        }

        const lüfter = lüfterObjs.map((obj, index) => (
            <WandLüfter 
            koordinate={koordinate}
            bodenBreite={bodenBreite}
            bodenLänge={bodenLänge}
            gebäudeHöhe={gebäudeHöhe}
            setOrbitKontrolle={setOrbitKontrolle}
            setSelectedObject={setSelectedObject}
            setTürAttribute={setTürAttribute}
            objs={objs}
            objId={obj.id}
            key={obj.id}
            />
        ));
        
        return [...frag, ...lüfter];
    }

    return(
        <>
            {langeWand(true)}
            {langeWand(false)}
            {kurzeWand(true)}
            {kurzeWand(false)}
            {abgrenzung && (editMenü === "Felder" || editMenü === "Öffnungen" || editMenü === "Öffnungen-Auswahl" || editMenü === "Öffnungen-Dach-Auswahl") && (
                <>
                    <Abgrenzung
                        koordinate={koordinate}
                        bodenLänge={bodenLänge}
                        bodenBreite={bodenBreite}
                        gebäudeHöhe={gebäudeHöhe}
                        sockelHöhe={sockelHöhe}
                        kanten={kantenAnzeigen}
                        oberflächen={oberflächenAnzeigen}
                        dachArt={dachArt}
                        pultdachHöheDifferenz={pultdachHöheDifferenz}
                        zusatzHöheMitte={zusatzHöheMitte}
                        balkenAbstand={balkenAbstand}
                        wandTyp="langVorne"
                        originalBreite={originalBreite}
                    />
                    <Abgrenzung
                        koordinate={koordinate}
                        bodenLänge={bodenLänge}
                        bodenBreite={bodenBreite}
                        gebäudeHöhe={gebäudeHöhe}
                        sockelHöhe={sockelHöhe}
                        kanten={kantenAnzeigen}
                        oberflächen={oberflächenAnzeigen}
                        dachArt={dachArt}
                        pultdachHöheDifferenz={pultdachHöheDifferenz}
                        zusatzHöheMitte={zusatzHöheMitte}
                        balkenAbstand={balkenAbstand}
                        wandTyp="langHinten"
                        originalBreite={originalBreite}
                    />
                    <Abgrenzung
                        koordinate={koordinate}
                        bodenLänge={bodenLänge}
                        bodenBreite={bodenBreite}
                        gebäudeHöhe={gebäudeHöhe}
                        sockelHöhe={sockelHöhe}
                        kanten={kantenAnzeigen}
                        oberflächen={oberflächenAnzeigen}
                        dachArt={dachArt}
                        pultdachHöheDifferenz={pultdachHöheDifferenz}
                        zusatzHöheMitte={zusatzHöheMitte}
                        balkenAbstand={balkenAbstand}
                        wandTyp="kurzLinks"
                        originalBreite={originalBreite}
                    />
                    <Abgrenzung
                        koordinate={koordinate}
                        bodenLänge={bodenLänge}
                        bodenBreite={bodenBreite}
                        gebäudeHöhe={gebäudeHöhe}
                        sockelHöhe={sockelHöhe}
                        kanten={kantenAnzeigen}
                        oberflächen={oberflächenAnzeigen}
                        dachArt={dachArt}
                        pultdachHöheDifferenz={pultdachHöheDifferenz}
                        zusatzHöheMitte={zusatzHöheMitte}
                        balkenAbstand={balkenAbstand}
                        wandTyp="kurzRechts"
                        originalBreite={originalBreite}
                    />
                    {(editMenü === "Öffnungen" || editMenü === "Öffnungen-Auswahl" || editMenü === "Öffnungen-Dach-Auswahl") && (
                        <>
                        <AddButtonWand
                            koordinate={koordinate}
                            bodenLänge={bodenLänge}
                            bodenBreite={bodenBreite}
                            gebäudeHöhe={gebäudeHöhe}
                            sockelHöhe={sockelHöhe}
                            dachArt={dachArt}
                            pultdachHöheDifferenz={pultdachHöheDifferenz}
                            zusatzHöheMitte={zusatzHöheMitte}
                            balkenAbstand={balkenAbstand}
                            wandTyp="langVorne"
                            setEditMenü={setEditMenü}
                            setClickedButtonPos={setClickedButtonPos}
                        />
                        <AddButtonWand
                            koordinate={koordinate}
                            bodenLänge={bodenLänge}
                            bodenBreite={bodenBreite}
                            gebäudeHöhe={gebäudeHöhe}
                            sockelHöhe={sockelHöhe}
                            dachArt={dachArt}
                            pultdachHöheDifferenz={pultdachHöheDifferenz}
                            zusatzHöheMitte={zusatzHöheMitte}
                            balkenAbstand={balkenAbstand}
                            wandTyp="langHinten"
                            setEditMenü={setEditMenü}
                            setClickedButtonPos={setClickedButtonPos}
                        />
                        <AddButtonWand
                            koordinate={koordinate}
                            bodenLänge={bodenLänge}
                            bodenBreite={bodenBreite}
                            gebäudeHöhe={gebäudeHöhe}
                            sockelHöhe={sockelHöhe}
                            dachArt={dachArt}
                            pultdachHöheDifferenz={pultdachHöheDifferenz}
                            zusatzHöheMitte={zusatzHöheMitte}
                            balkenAbstand={balkenAbstand}
                            wandTyp="kurzLinks"
                            setEditMenü={setEditMenü}
                            setClickedButtonPos={setClickedButtonPos}
                        />
                        <AddButtonWand
                            koordinate={koordinate}
                            bodenLänge={bodenLänge}
                            bodenBreite={bodenBreite}
                            gebäudeHöhe={gebäudeHöhe}
                            sockelHöhe={sockelHöhe}
                            dachArt={dachArt}
                            pultdachHöheDifferenz={pultdachHöheDifferenz}
                            zusatzHöheMitte={zusatzHöheMitte}
                            balkenAbstand={balkenAbstand}
                            wandTyp="kurzRechts"
                            setEditMenü={setEditMenü}
                            setClickedButtonPos={setClickedButtonPos}
                        />
                        </>
                    )}
                </>
            )}
        </>
    )
}