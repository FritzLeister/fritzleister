import { useRef, } from "react"
import DachFenster from "./DachFenster"

export default function Dach({ 
    koordinate, 
    bodenBreite, 
    bodenLänge, 
    gebäudeHöhe, 
    setOrbitKontrolle, 
    setSelectedObject, 
    setTürAttribute, 
    objs, 
    objId,
    flach
}) {

    const ref = useRef() 

    const yHelp = gebäudeHöhe >= 18 ? 1 : 0
    const yHelp2 = gebäudeHöhe <= 9 ? 0.5 : 0
    const breiteHelp = bodenBreite <= 19 ? 0.2 : 0


    const x = koordinate[0]
    const y = koordinate[1] + (flach ? 1 : 0.9)*(gebäudeHöhe-9) + (flach ? 0 : yHelp - yHelp2)
    const z = koordinate[2]

    // rotation={[Math.PI * 35 / 180, 0, 0]} 
    const vorneFenster = (objs ?? ["amk"]).filter(obj => obj.type === "dachfenster" && obj.rechts) // vorne = rechts===false
    const hintenFenster = (objs ?? []).filter(obj => obj.type === "dachfenster" && obj.rechts===false) // hinten = rechts

    console.log("Vorne: ", vorneFenster)
    console.log("Hinten: ", hintenFenster)

    return(
        <>

            {/* Dachplatten */}
            {/* Hinten */}
            {/* Hieeerrr weitermachen!! */}
            <group
            position={[x, y+12 - (flach ? 3.2 : 0), z+6+(0.5*(bodenBreite-20))+breiteHelp]}
            rotation={[Math.PI * (flach ? 0 : 35) / 180, 0, 0]} 
            >
                {/*
                <DachFenster
                koordinate={koordinate}
                rechts={true}
                setOrbitKontrolle={setOrbitKontrolle}
                gebäudeHöhe={gebäudeHöhe}
                bodenBreite={bodenBreite}
                />
                */}

                {hintenFenster.map((obj, index) => (
                    <DachFenster
                        koordinate={koordinate}
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
                        vorne={obj.rechts}
                    />
                ))}

                <mesh position={[0,0,0]} ref={ref} >

                    <boxGeometry args={[bodenLänge,0.5,bodenBreite/2+(flach ? 2.6 : 5)+(0.6*(bodenBreite-20))]} />
                    <meshStandardMaterial color={"grey"} />

                </mesh>

                {/* Rand */}
                {/* Hinten Rechts */}
                <mesh position={[x+(bodenLänge/2)+0.5, 0,0]} ref={ref} >

                    <boxGeometry args={[1,0.5,bodenBreite/2+(flach ? 2.6 : 5)+(0.6*(bodenBreite-20))]} />
                    <meshStandardMaterial color={"darkgrey"} />

                </mesh>

                {/* Hinten links */}
                <mesh position={[x-(bodenLänge/2)-0.5, 0, 0]} ref={ref} >

                    <boxGeometry args={[1,0.5,bodenBreite/2+(flach ? 2.6 : 5)+(0.6*(bodenBreite-20))]} />
                    <meshStandardMaterial color={"darkgrey"} />

                </mesh>
            </group>

            {/* Vorne */}
            <group
            rotation={[Math.PI * (flach ? 0 : -35) / 180, 0, 0]}
            position={[x, y+12 - (flach ? 3.2 : 0), z-6-(0.5*(bodenBreite-20))-breiteHelp]}
            >
                {vorneFenster.map((obj, index) => (
                    <DachFenster
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
                    vorne={obj.rechts}
                    />
                ))}

                <mesh position={[0,0,0]} ref={ref}>

                    <boxGeometry args={[bodenLänge,0.5,bodenBreite/2+(flach ? 2.6 : 5)+(0.6*(bodenBreite-20))]} />
                    <meshStandardMaterial color={"gray"} />

                </mesh>

                {/* Rand */}
                {/* Vorne Links */}
                <mesh position={[x+(bodenLänge/2)+0.5, 0,0]} ref={ref} >

                    <boxGeometry args={[1,0.5,bodenBreite/2+(flach ? 2.6 : 5)+(0.6*(bodenBreite-20))]} />
                    <meshStandardMaterial color={"darkgrey"} />

                </mesh>

                {/* Vorne Rechts */}
                <mesh position={[x-(bodenLänge/2)-0.5,0,0]} ref={ref} >

                    <boxGeometry args={[1,0.5,bodenBreite/2+(flach ? 2.6 : 5)+(0.6*(bodenBreite-20))]} />
                    <meshStandardMaterial color={"darkgrey"} />

                </mesh>
            </group>
        </>
    )

}

// rotation={[Math.PI * -35 / 180, 0, 0]}