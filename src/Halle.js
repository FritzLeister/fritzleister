
import Gerüst from "./Komp/Gerüst"
import Wand from "./Komp/Wand"
import Dach from "./Komp/Dach"
import { OrbitControls } from "@react-three/drei"
import { useState } from "react"
import Tür from "./Komp/Tür"
import LeerÖffnung from "./Komp/ÖffnungenKomp/LeerÖffnung"
import WandFenster from "./Komp/ÖffnungenKomp/WandFenster"
import DachLeeröffnung from "./Komp/ÖffnungenKomp/DachLeeröffnung"
import { useLoader } from "@react-three/fiber"
import { TextureLoader, TextureUtils } from "three"
import { useRef } from "react"
import Abmessungen from "./Komp/Abmessungen"
import Bodenplatte from "./Komp/Bodenplatte"
import Achsen from "./Komp/Achsen"
import HallenÜbersicht from "./Komp/HallenÜbersicht"
import AbgrenzungAbmessung from "./Komp/BodenKomp/AbgrenzungAbmessung"
import TürÖffnung from "./Komp/ÖffnungenKomp/TürÖffnung"
import SektionalTor from "./Komp/ÖffnungenKomp/SektionalTor"
import SchiebeTür from "./Komp/ÖffnungenKomp/SchiebeTür"
import RollTor from "./Komp/ÖffnungenKomp/RollTor"
import TransparentesPaneel from "./Komp/ÖffnungenKomp/TransparentesPaneel"
import DachTransparentesPaneel from "./Komp/ÖffnungenKomp/DachTransparentesPaneel"
import Laderampe from "./Komp/ÖffnungenKomp/Laderampe"
import LichtKuppel from "./Komp/ÖffnungenKomp/LichtKuppel"

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
    setClickedButtonPos,
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
    const türObjs = objs.filter(obj => obj.type === "tür-öffnung")
    const leeröffnungen = objs.filter(obj => obj.type === "leeröffnung" && (obj.lang === true || obj.lang === undefined))
    const wandFenster = objs.filter(obj => obj.type === "fenster")
    const sektionalTore = objs.filter(obj => obj.type === "sektionaltor")
    const schiebetüren = objs.filter(obj => obj.type === "schiebetür")
    const rolltore = objs.filter(obj => obj.type === "rolltor")
    const laderampen = objs.filter(obj => obj.type === "laderampe")
    const transparentePaneeleWand = objs.filter(obj => obj.type === "transparentespaneel" && (obj.lang === true || obj.lang === undefined))
    const transparentePaneeleDach = objs.filter(obj => obj.type === "transparentespaneel" && obj.lang === false)
    const dachLeeröffnungen = objs.filter(obj => obj.type === "leeröffnung" && obj.lang === false)
    const lichtkuppeln = objs.filter(obj => obj.type === "kleinlichtskuppel")

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
        setClickedButtonPos={setClickedButtonPos}
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
        setClickedButtonPos={setClickedButtonPos}
        oberflächenAnzeigen={oberflächenAnzeigen}
        plattenAnzeigen={plattenAnzeigen}
        pultdachHöheDifferenz={pultdachHöheDifferenz-10}
        />
        
        
        {/* <Achsen /> */}

        {türObjs.map((obj, index) => (
            <TürÖffnung
                gebäudeHöhe={gebäudeHöhe}
                position={koordinate}
                bodenBreite={bodenBreite}
                bodenLänge={bodenLänge}
                setSelectedObject={setSelectedObject}
                setOrbitKontrolle={setOrbitKontrolle}
                setEditMenü={setEditMenü}
                key={obj.id}
                objId={obj.id}
                objs={objs}
                oberflächenAnzeigen={oberflächenAnzeigen}
                kantenAnzeigen={kantenAnzeigen}
                dachArt={effektiveDachArt}
                pultdachHöheDifferenz={pultdachHöheDifferenz}
            />
        ))}

        {leeröffnungen.map(obj => (
            <LeerÖffnung
                key={obj.id}
                gebäudeHöhe={gebäudeHöhe}
                position={koordinate}
                bodenBreite={bodenBreite}
                bodenLänge={bodenLänge}
                setSelectedObject={setSelectedObject}
                setOrbitKontrolle={setOrbitKontrolle}
                objId={obj.id}
                objs={objs}
                setEditMenü={setEditMenü}
                oberflächenAnzeigen={oberflächenAnzeigen}
                kantenAnzeigen={kantenAnzeigen}
            />
        ))}

        {wandFenster.map(obj => (
            <WandFenster
                key={obj.id}
                gebäudeHöhe={gebäudeHöhe}
                position={koordinate}
                bodenBreite={bodenBreite}
                bodenLänge={bodenLänge}
                setSelectedObject={setSelectedObject}
                setOrbitKontrolle={setOrbitKontrolle}
                objId={obj.id}
                objs={objs}
                setEditMenü={setEditMenü}
                oberflächenAnzeigen={oberflächenAnzeigen}
                kantenAnzeigen={kantenAnzeigen}
                sockelhöhe={sockelhöhe}
                dachArt={effektiveDachArt}
                pultdachHöheDifferenz={pultdachHöheDifferenz}
            />
        ))}

        {sektionalTore.map(obj => (
            <SektionalTor
                key={obj.id}
                gebäudeHöhe={gebäudeHöhe}
                position={koordinate}
                bodenBreite={bodenBreite}
                bodenLänge={bodenLänge}
                setSelectedObject={setSelectedObject}
                setOrbitKontrolle={setOrbitKontrolle}
                objId={obj.id}
                objs={objs}
                setEditMenü={setEditMenü}
                oberflächenAnzeigen={oberflächenAnzeigen}
                kantenAnzeigen={kantenAnzeigen}
            />
        ))}

        {schiebetüren.map(obj => (
            <SchiebeTür
                key={obj.id}
                gebäudeHöhe={gebäudeHöhe}
                position={koordinate}
                bodenBreite={bodenBreite}
                bodenLänge={bodenLänge}
                setSelectedObject={setSelectedObject}
                setOrbitKontrolle={setOrbitKontrolle}
                objId={obj.id}
                objs={objs}
                setEditMenü={setEditMenü}
                oberflächenAnzeigen={oberflächenAnzeigen}
                kantenAnzeigen={kantenAnzeigen}
            />
        ))}

        {rolltore.map(obj => (
            <RollTor
                key={obj.id}
                gebäudeHöhe={gebäudeHöhe}
                position={koordinate}
                bodenBreite={bodenBreite}
                bodenLänge={bodenLänge}
                setSelectedObject={setSelectedObject}
                setOrbitKontrolle={setOrbitKontrolle}
                objId={obj.id}
                objs={objs}
                setEditMenü={setEditMenü}
                oberflächenAnzeigen={oberflächenAnzeigen}
                kantenAnzeigen={kantenAnzeigen}
                dachArt={effektiveDachArt}
                pultdachHöheDifferenz={pultdachHöheDifferenz}
            />
        ))}

        {laderampen.map(obj => (
            <Laderampe
                key={obj.id}
                gebäudeHöhe={gebäudeHöhe}
                position={koordinate}
                bodenBreite={bodenBreite}
                bodenLänge={bodenLänge}
                setSelectedObject={setSelectedObject}
                setOrbitKontrolle={setOrbitKontrolle}
                objId={obj.id}
                objs={objs}
                setEditMenü={setEditMenü}
                oberflächenAnzeigen={oberflächenAnzeigen}
                kantenAnzeigen={kantenAnzeigen}
                dachArt={effektiveDachArt}
                pultdachHöheDifferenz={pultdachHöheDifferenz}
            />
        ))}

        {transparentePaneeleWand.map(obj => (
            <TransparentesPaneel
                key={obj.id}
                gebäudeHöhe={gebäudeHöhe}
                position={koordinate}
                bodenBreite={bodenBreite}
                bodenLänge={bodenLänge}
                setSelectedObject={setSelectedObject}
                setOrbitKontrolle={setOrbitKontrolle}
                objId={obj.id}
                objs={objs}
                setEditMenü={setEditMenü}
                oberflächenAnzeigen={oberflächenAnzeigen}
                kantenAnzeigen={kantenAnzeigen}
                dachArt={effektiveDachArt}
                pultdachHöheDifferenz={pultdachHöheDifferenz}
            />
        ))}

        {transparentePaneeleDach.map(obj => (
            <DachTransparentesPaneel
                key={obj.id}
                gebäudeHöhe={gebäudeHöhe}
                position={koordinate}
                bodenBreite={bodenBreite}
                bodenLänge={bodenLänge}
                setSelectedObject={setSelectedObject}
                setOrbitKontrolle={setOrbitKontrolle}
                objId={obj.id}
                objs={objs}
                setEditMenü={setEditMenü}
                oberflächenAnzeigen={oberflächenAnzeigen}
                kantenAnzeigen={kantenAnzeigen}
                dachArt={effektiveDachArt}
                pultdachHöheDifferenz={pultdachHöheDifferenz}
                zusatzHöheMitte={effektiveDiffTraufFirst}
                vorne={obj.vorne ?? true}
            />
        ))}

        {dachLeeröffnungen.map(obj => (
            <DachLeeröffnung
                key={obj.id}
                gebäudeHöhe={gebäudeHöhe}
                position={koordinate}
                bodenBreite={bodenBreite}
                bodenLänge={bodenLänge}
                setSelectedObject={setSelectedObject}
                setOrbitKontrolle={setOrbitKontrolle}
                objId={obj.id}
                objs={objs}
                setEditMenü={setEditMenü}
                oberflächenAnzeigen={oberflächenAnzeigen}
                kantenAnzeigen={kantenAnzeigen}
                dachArt={effektiveDachArt}
                pultdachHöheDifferenz={pultdachHöheDifferenz}
                zusatzHöheMitte={effektiveDiffTraufFirst}
                vorne={obj.vorne ?? true}
            />
        ))}

        {lichtkuppeln.map(obj => (
            <LichtKuppel
                key={obj.id}
                gebäudeHöhe={gebäudeHöhe}
                position={koordinate}
                bodenBreite={bodenBreite}
                bodenLänge={bodenLänge}
                setSelectedObject={setSelectedObject}
                setOrbitKontrolle={setOrbitKontrolle}
                objId={obj.id}
                objs={objs}
                setEditMenü={setEditMenü}
                oberflächenAnzeigen={oberflächenAnzeigen}
                kantenAnzeigen={kantenAnzeigen}
                dachArt={effektiveDachArt}
                pultdachHöheDifferenz={pultdachHöheDifferenz}
                zusatzHöheMitte={effektiveDiffTraufFirst}
                vorne={obj.vorne ?? true}
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