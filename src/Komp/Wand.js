import { useLoader } from "@react-three/fiber"
import { TextureLoader } from "three"
import { useRef } from "react"
import WandLüfter from "./WandLüfter"

export default function Wand({ 
    koordinate, 
    wievieleFragmente, 
    bodenLänge, 
    bodenBreite, 
    gebäudeHöhe,
    objs,
    setOrbitKontrolle,
    setSelectedObject,
    setTürAttribute

}) {

    const x = koordinate[0]
    const y = koordinate[1] - 0.5 + 0.5*(gebäudeHöhe-9)
    const z = koordinate[2]

    const url = "/wand-textur.jpg"
    const ref = useRef()
    const texture = useLoader(TextureLoader, url)


    // x-(bodenLänge/2)+(i*(bodenLänge/wievieleFragmente))

    function langeWand(rechts) {
        const fragBreite = bodenLänge / wievieleFragmente
        const startX = x - (bodenLänge/2) + fragBreite / 2

        const frag = []
        const zWert = rechts ? -(bodenBreite/2) : +(bodenBreite/2)

        for (let i = 0; i < wievieleFragmente; i++) {
            frag.push(
                <mesh position={[startX + i * fragBreite, y+4.5, zWert]} ref={ref} onClick={() => console.log("")} >
                    <boxGeometry args={[bodenLänge/wievieleFragmente, gebäudeHöhe, 0.5]} />
                    <meshBasicMaterial map={texture} />
                </mesh>
            ); 
        }
        return frag;
    }

    function kurzeWand(rechts) {
        const fragBreite = bodenBreite / wievieleFragmente
        const startX = x - (bodenBreite/2) + fragBreite / 2
        
        const frag = []
        const xWert = rechts ? -(bodenLänge/2) : +(bodenLänge/2)

        const lüfterObjs = (objs || []).filter(obj => obj.type === "lüfter")
        
        for (let i = 0; i < wievieleFragmente; i++) {
            frag.push(
                <mesh position={[xWert, y+4.5, startX + i * fragBreite]} ref={ref} onClick={() => console.log("") }>
                    <boxGeometry args={[0.5, gebäudeHöhe, bodenBreite/wievieleFragmente]} />
                    <meshBasicMaterial map={texture} />
                </mesh>
            ); 
            console.log(i)
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
        </>
    )
}