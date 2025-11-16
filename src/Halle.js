
import Gerüst from "./Komp/Gerüst"
import Wand from "./Komp/Wand"
import Dach from "./Komp/Dach"
import { OrbitControls } from "@react-three/drei"
import { useState } from "react"
import Tür from "./Komp/Tür"
import { useLoader } from "@react-three/fiber"
import { TextureLoader } from "three"
import { useRef } from "react"

export default function Halle({ 
    bodenLänge, 
    bodenBreite, 
    gebäudeHöhe, 
    koordinate, 
    setTürAttribute, 
    setSelectedObject, 
    objs,
    objId,
    flach
}) {

    const [orbitKontrolle, setOrbitKontrolle] = useState(true)
    const türObjs = objs.filter(obj => obj.type === "tür")

    const url = "blaupause.jpg"
    const ref = useRef()
    const texture = useLoader(TextureLoader, url)

    return(
        <>

        <Gerüst 
        bodenLänge={bodenLänge}
        bodenBreite={bodenBreite}
        gebäudeHöhe={gebäudeHöhe}
        koordinate={koordinate}
        />

        {/* lang: lange Seite?, rechts: rechts oder links, koordinate: x,y,z, wievieleFragmente: ? */}
        <Wand 
        koordinate={koordinate} 
        wievieleFragmente={15} 
        bodenBreite={bodenBreite}
        bodenLänge={bodenLänge}
        gebäudeHöhe={gebäudeHöhe}
        setOrbitKontrolle={setOrbitKontrolle}
        setSelectedObject={setSelectedObject}
        setTürAttribute={setTürAttribute}
        objs={objs}
        objId={objId}
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

        {/* Boden:*/}
        <mesh position={[0, -0.5, 0]}>

            <boxGeometry args={[56.5,0.1,50]} />
            <meshBasicMaterial map={texture} />
            
        </mesh>
        <OrbitControls enabled={orbitKontrolle} />
        </>
    )
}