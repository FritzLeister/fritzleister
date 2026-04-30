import Pfetten from "./GerüstKomp/Pfetten"
import Rahmen from "./GerüstKomp/Rahmen"
import WandRiegel from "./GerüstKomp/WandRiegel"
import Kantteile from "./GerüstKomp/Kantteile"
import { getWallOpeningSightVolumes, getWallOpeningVolumes } from "./openingUtils"


export default function Gerüst({
    bodenLänge, 
    bodenBreite, 
    gebäudeHöhe, 
    koordinate,
    stahlRahmen,
    pfetten,
    wandRiegel,
    kantTeile,
    zusatzHöheMitte,
    dachArt,
    pultdachHöheDifferenz,
    kantenAnzeigen,
    oberflächenAnzeigen,
    sockelHöhe,
    objs,
    rahmenFarbe = '#6a93b0',
    sekundärKonstruktionsFarbe = '#7d7d75'
}) {
    const abstandFaktor = 18

    const x = koordinate[0]
    const y = koordinate[1] - 0.35 + 0.5*(gebäudeHöhe-9)
    const z = koordinate[2]
    const wallOpeningVolumes = getWallOpeningVolumes({
        objs,
        x,
        z,
        koordinateY: koordinate[1],
        gebäudeHöhe,
        sockelHöhe,
        bodenLänge,
        bodenBreite,
    })
    const wallOpeningSightVolumes = getWallOpeningSightVolumes({
        wallOpeningVolumes,
        x,
        z,
        bodenLänge,
        bodenBreite,
    })
    return(
        <>

        {/* Boden */}
        {/* <mesh position={[x, y-(gebäudeHöhe-9) / 2, z]}>
            <boxGeometry args={[bodenLänge, bodenDicke, bodenBreite]} />
            <meshStandardMaterial color={"#888888"} />
        </mesh> */}

        {stahlRahmen && (
            <Rahmen
                x={x}
                y={y}
                z={z}
                bodenBreite={bodenBreite}
                bodenLänge={bodenLänge}
                gebäudeHöhe={gebäudeHöhe}
                abstandFaktor={abstandFaktor}
                zusatzHöheMitte={zusatzHöheMitte}
                dachArt={dachArt}
                pultdachHöheDifferenz={pultdachHöheDifferenz}
                frame={kantenAnzeigen}
                oberfläche={oberflächenAnzeigen}
                color={rahmenFarbe}
                openingVolumes={wallOpeningVolumes}
                sightOpeningVolumes={wallOpeningSightVolumes}
            />
        )}

        {pfetten && (
            <Pfetten 
                x={x}
                y={y}
                z={z}
                bodenBreite={bodenBreite}
                bodenLänge={bodenLänge}
                gebäudeHöhe={gebäudeHöhe}
                pfettenAbstand={4}
                zusatzHöheMitte={zusatzHöheMitte}
                dachArt={dachArt}
                pultdachHöheDifferenz={pultdachHöheDifferenz}
                frame={kantenAnzeigen}
                oberfläche={oberflächenAnzeigen}
                color={sekundärKonstruktionsFarbe}
            />
        )}
    
        {wandRiegel && (
            <WandRiegel
                x={x}
                y={y}
                z={z}
                bodenBreite={bodenBreite}
                bodenLänge={bodenLänge}
                gebäudeHöhe={gebäudeHöhe}
                pfettenAbstand={3}
                zusatzHöheMitte={zusatzHöheMitte}
                dachArt={dachArt}
                frame={kantenAnzeigen}
                oberfläche={oberflächenAnzeigen}
                objs={objs}
                openingVolumes={wallOpeningVolumes}
                color={sekundärKonstruktionsFarbe}
            /> 
        )}

        {kantTeile && (
            <Kantteile
                x={x}
                y={y}
                z={z}
                bodenBreite={bodenBreite}
                bodenLänge={bodenLänge}
                gebäudeHöhe={gebäudeHöhe}
                sockelHöhe={sockelHöhe}
                zusatzHöheMitte={zusatzHöheMitte}
                pultdachHöheDifferenz={pultdachHöheDifferenz}
                dachArt={dachArt}
                frame={kantenAnzeigen}
                oberfläche={oberflächenAnzeigen}
                objs={objs}
            />
        )}

        </>
    )
}