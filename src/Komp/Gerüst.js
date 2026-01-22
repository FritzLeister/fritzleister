import { useState } from "react"
import Pfetten from "./GerüstKomp/Pfetten"
import Rahmen from "./GerüstKomp/Rahmen"
import WandRiegel from "./GerüstKomp/WandRiegel"
import Kantteile from "./GerüstKomp/Kantteile"
import { Triangle } from "three"


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
    sockelHöhe
}) {

    const bodenDicke = 0.3

    const abstandFaktor = 18

    const x = koordinate[0]
    const y = koordinate[1] - 0.35 + 0.5*(gebäudeHöhe-9)
    const z = koordinate[2]

    console.log("Gerüst", bodenBreite)

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
                color={'#6a93b0'}
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
            />
        )}

        </>
    )
}