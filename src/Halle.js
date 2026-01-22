
import Gerüst from "./Komp/Gerüst"
import Wand from "./Komp/Wand"
import Dach from "./Komp/Dach"
import { OrbitControls } from "@react-three/drei"
import { useState } from "react"
import Tür from "./Komp/Tür"
import { useLoader } from "@react-three/fiber"
import { TextureLoader, TextureUtils } from "three"
import { useRef } from "react"
import Abmessungen from "./Komp/Abmessungen"
import Bodenplatte from "./Komp/Bodenplatte"
import Achsen from "./Komp/Achsen"
import HallenÜbersicht from "./Komp/HallenÜbersicht"
import AbgrenzungAbmessung from "./Komp/BodenKomp/AbgrenzungAbmessung"

export default function Halle({ 
    bodenLänge, 
    bodenBreite, 
    gebäudeHöhe, 
    koordinate, 
    setTürAttribute, 
    setSelectedObject, 
    objs,
    objId,
    flach,
    originalBreite,
    setEditMenü,
    editMenü,
    kantenAnzeigen,
    oberflächenAnzeigen,
    abmessungenAnzeigen,
    plattenAnzeigen,
    massivwändeAnzeigen,
    rahmenAnzeigen,
    pfettenAnzeigen,
    wandriegelAnzeigen,
    kantteileAnzeigen,
    bodenplatteAnzeigen,
    dachArt,
    diffTraufFirst,
    pultdachHöheDifferenz,
    sockelhöhe,
    wandGeometrieVorgaben,
    außenFarbe,
}) {

    const [orbitKontrolle, setOrbitKontrolle] = useState(true)
    const türObjs = objs.filter(obj => obj.type === "tür")

    // Flachdach wird wie Satteldach behandelt, aber mit diffTraufFirst = 0
    const effektiveDachArt = dachArt === 'flachdach' ? 'satteldach' : dachArt
    const effektiveDiffTraufFirst = dachArt === 'flachdach' ? 0 : diffTraufFirst
    
    // Sockelhöhe für Gerüst: 0.5 wenn nur verkleidete Wand, sonst sockelhöhe
    const gerüstSockelHöhe = wandGeometrieVorgaben === 'verkleidete-wand' ? 0.8 : sockelhöhe

    //const url = "pastellGrün.png"
    const url = "blaupause.jpg"
    const ref = useRef()
    const texture = useLoader(TextureLoader, url)

    return(
        <>

        {/* {editMenü === 'Abmessungen' ? (
            // Vereinfachte Übersicht der Hallenform
            <HallenÜbersicht
                bodenLänge={bodenLänge}
                bodenBreite={bodenBreite}
                gebäudeHöhe={gebäudeHöhe}
                koordinate={koordinate}
                dachArt={effektiveDachArt}
                pultdachHöheDifferenz={pultdachHöheDifferenz}
                zusatzHöheMitte={effektiveDiffTraufFirst}
            />
        ) : (
            <> */}
            {/* Stahlrahmen, Pfetten, Wandriegel, Kantteile */}
            <Gerüst 
            bodenLänge={bodenLänge}
            bodenBreite={bodenBreite}
            gebäudeHöhe={gebäudeHöhe}
            koordinate={koordinate}
            stahlRahmen={rahmenAnzeigen}
            pfetten={pfettenAnzeigen}
            wandRiegel={wandriegelAnzeigen}
            kantTeile={kantteileAnzeigen}
            zusatzHöheMitte={effektiveDiffTraufFirst}
            dachArt={effektiveDachArt}
            pultdachHöheDifferenz={pultdachHöheDifferenz}
            kantenAnzeigen={kantenAnzeigen}
            oberflächenAnzeigen={oberflächenAnzeigen}
            sockelHöhe={gerüstSockelHöhe}
            />


        {/* lang: lange Seite?, rechts: rechts oder links, koordinate: x,y,z, wievieleFragmente: ? */}
        
        
        <Wand 
        koordinate={koordinate} 
        wievieleFragmente={1} 
        bodenBreite={bodenBreite}
        bodenLänge={bodenLänge}
        gebäudeHöhe={gebäudeHöhe/2}
        setOrbitKontrolle={setOrbitKontrolle}
        setSelectedObject={setSelectedObject}
        setTürAttribute={setTürAttribute}
        objs={objs}
        objId={objId}
        massivWand={massivwändeAnzeigen} // ob die Massivwände angezeigt werden sollen
        sockelHöhe={sockelhöhe}
        dachArt={effektiveDachArt}
        zusatzHöheMitte={effektiveDiffTraufFirst}
        pultdachHöheDifferenz={pultdachHöheDifferenz}
        balkenAbstand={20}
        abgrenzung={true} // unterteilung der Wände
        originalBreite={originalBreite}
        setEditMenü={setEditMenü}
        editMenü={editMenü}
        kantenAnzeigen={kantenAnzeigen}
        oberflächenAnzeigen={oberflächenAnzeigen}
        plattenAnzeigen={plattenAnzeigen}
        color={außenFarbe}
        />
        

        
        <Dach 
        koordinate={koordinate}
        bodenBreite={bodenBreite}
        bodenLänge={bodenLänge}
        gebäudeHöhe={gebäudeHöhe}
        setOrbitKontrolle={setOrbitKontrolle}
        setSelectedObject={setSelectedObject}
        setTürAttribute={setTürAttribute}
        objs={objs}
        objId={objId}
        flach={flach}
        dachArt={effektiveDachArt}
        anzahlDachplatten={5}
        balkenAbstand={20}
        kantenAnzeigen={kantenAnzeigen}
        showButtons={true}
        zusatzHöheMitte={effektiveDiffTraufFirst}
        setEditMenü={setEditMenü}
        editMenü={editMenü}
        oberflächenAnzeigen={oberflächenAnzeigen}
        plattenAnzeigen={plattenAnzeigen}
        pultdachHöheDifferenz={pultdachHöheDifferenz-10}
        />
        
        
        {/* <Achsen /> */}

        {türObjs.map((obj, index) => (
            <Tür
            gebäudeHöhe={gebäudeHöhe}
            position={koordinate}
            bodenBreite={bodenBreite}
            bodenLänge={bodenLänge}
            setSelectedObject={setSelectedObject}
            setOrbitKontrolle={setOrbitKontrolle}
            setTürAttribute={setTürAttribute}
            key={obj.id}
            objId={obj.id}
            objs={objs}
            />
        ))}
        {/* </> */}
        {/* )} */}

        {/* Boden:*/}
        <mesh position={[0, -0.5, 0]}>

            <boxGeometry args={[896.5,0.1,890]} />
            {/* <meshBasicMaterial map={texture} /> */}
            <meshBasicMaterial color={'lightgreen'} />
            
        </mesh>

        {/* Abmessungen auf dem Boden */}
        {abmessungenAnzeigen && (
            <>
            <Abmessungen koordinate={koordinate} bodenLänge={bodenLänge} bodenBreite={bodenBreite} editMenü={editMenü} />
            {editMenü === 'Felder' && (
                <>
                    <AbgrenzungAbmessung 
                        koordinate={koordinate}
                        bodenLänge={bodenLänge}
                        bodenBreite={bodenBreite}
                        gebäudeHöhe={gebäudeHöhe}
                        sockelHöhe={sockelhöhe}
                        kanten={kantenAnzeigen}
                        oberflächen={oberflächenAnzeigen}
                        dachArt={effektiveDachArt}
                        pultdachHöheDifferenz={pultdachHöheDifferenz}
                        zusatzHöheMitte={effektiveDiffTraufFirst}
                        balkenAbstand={20}
                        wandTyp='langVorne'
                        originalBreite={originalBreite}
                    />

                    {/* <mesh rotation={[0, 0, 0]}>
                        <AbgrenzungAbmessung 
                            koordinate={koordinate}
                            bodenLänge={bodenLänge}
                            bodenBreite={bodenBreite}
                            gebäudeHöhe={gebäudeHöhe}
                            sockelHöhe={sockelhöhe}
                            kanten={kantenAnzeigen}
                            oberflächen={oberflächenAnzeigen}
                            dachArt={effektiveDachArt}
                            pultdachHöheDifferenz={pultdachHöheDifferenz}
                            zusatzHöheMitte={effektiveDiffTraufFirst}
                            balkenAbstand={20}
                            wandTyp='langHinten'
                            originalBreite={originalBreite}
                        /> 
                    </mesh> */}

                    <mesh rotation={[0, 0, 0]}>
                        <AbgrenzungAbmessung 
                            koordinate={koordinate}
                            bodenLänge={bodenLänge}
                            bodenBreite={bodenBreite}
                            gebäudeHöhe={gebäudeHöhe}
                            sockelHöhe={sockelhöhe}
                            kanten={kantenAnzeigen}
                            oberflächen={oberflächenAnzeigen}
                            dachArt={effektiveDachArt}
                            pultdachHöheDifferenz={pultdachHöheDifferenz}
                            zusatzHöheMitte={effektiveDiffTraufFirst}
                            balkenAbstand={20}
                            wandTyp='kurzLinks'
                            originalBreite={originalBreite}
                        />
                    </mesh>
                    {/* <mesh rotation={[]}>
                        <AbgrenzungAbmessung 
                            koordinate={koordinate}
                            bodenLänge={bodenLänge}
                            bodenBreite={bodenBreite}
                            gebäudeHöhe={gebäudeHöhe}
                            sockelHöhe={sockelhöhe}
                            kanten={kantenAnzeigen}
                            oberflächen={oberflächenAnzeigen}
                            dachArt={effektiveDachArt}
                            pultdachHöheDifferenz={pultdachHöheDifferenz}
                            zusatzHöheMitte={effektiveDiffTraufFirst}
                            balkenAbstand={20}
                            wandTyp='kurzRechts'
                            originalBreite={originalBreite}
                        />
                    </mesh> */}
                </>
            )}
            </>
            
        )}

        {/* Bodenplatte */}
        {bodenplatteAnzeigen && (
            <Bodenplatte bodenLänge={bodenLänge} bodenBreite={bodenBreite} koordinate={koordinate} />
        )}

        <OrbitControls enabled={orbitKontrolle} maxDistance={350} />
        </>
    )
}