import { useThree } from '@react-three/fiber'
import { useRef, useState } from "react"
import { useDrag } from '@use-gesture/react'


export default function WandLüfter({ 
    koordinate, 
    bodenBreite, 
    bodenLänge, 
    gebäudeHöhe,
    setOrbitKontrolle,
    setSelectedObject,
    setTürAttribute,
    objs,
    objId
}) {

    const obj = objs.find(obj => obj.id === objId)
    const lüfterArgs = obj ? [obj.value[0], obj.value[1]] : [5,5] // breite, höhe
    const lang = obj.rechts

    const x = koordinate[0] + (lang ? bodenLänge/4 + 0.3 : -(bodenLänge/4) - 0.3)
    const y = koordinate[1] + 3
    const z = koordinate[2]

    const [clickCount, setClickCount] = useState(0)

    const [gridPosi, setGridPosi] = useState({ y: y, z: z})
    const { size, camera } = useThree() 
    const groupRef = useRef()

    /*
    const handleClick = () => {
        setClickCount(prev => prev + 1)
        if (clickCount===0) {
            const findObj = objs.find(obj => obj.id === objId)
            setSelectedObject(findObj)
            setTürAttribute(true)
        } else if (clickCount===1) {
            setTürAttribute(false)
            setClickCount(0)
        }
    }
    */

    const minY = lang ? -gebäudeHöhe+6.5 + (lüfterArgs[1]-5)/2 : -gebäudeHöhe+6.5 + (lüfterArgs[1]-5)/2
    const maxY = lang ? 0 - (lüfterArgs[1]-5)/2 : 0 - (lüfterArgs[1]-5)/2

    const minZ = -(bodenBreite/2) + 3 + (lüfterArgs[0]-5)/2
    const maxZ = (bodenBreite/2) - 3 - (lüfterArgs[0]-5)/2

    const bind = useDrag(
        ({ offset: [zDrag, yDrag], first, last}) => {
            setSelectedObject(obj)
            const scale = 40/size.width
            let newY = Math.round(yDrag*scale) + y
            let newZ = Math.round(zDrag*scale) + z
    
            newY = Math.max(minY, Math.min(maxY, newY))
            newZ = Math.max(minZ, Math.min(maxZ, newZ))
    
            setGridPosi({y: lang ? -newY:-newY, z: lang ? -newZ:newZ}) // !!!
                
            if (first && lang) {
                setOrbitKontrolle(false)
                camera.position.set(50,20,0)
                setTürAttribute(true)

            } else if (first && lang===false) {
                setOrbitKontrolle(false)
                camera.position.set(-50,20,0)
                setTürAttribute(true)
            }
            if (last) {
                setOrbitKontrolle(true)
            }
        }
    )

    return(
        <>
        <group
        ref={groupRef}
        position={[x, gridPosi.y, gridPosi.z]}
        // onClick={handleClick}
        {...bind()}
        >
            {/* Hintergrund */}
            <mesh position={[x,y,z]}>

                <boxGeometry args={[0.2, lüfterArgs[1], lüfterArgs[0]]} />
                <meshStandardMaterial color={"lightgrey"} />
            </mesh>

            {/* Abrundungen */}
            {/* Helle Seite Links */}
            <mesh position={[x,y,z-(lüfterArgs[0]/2),]}>

                <boxGeometry args={[1, lüfterArgs[1], 0.2]} />
                <meshStandardMaterial color={"lightgrey"} />
            </mesh>

            {/* Helle Seite Rechts */}
            <mesh position={[x,y,z+(lüfterArgs[0]/2)]}>

                <boxGeometry args={[1, lüfterArgs[1], 0.2]} />
                <meshStandardMaterial color={"lightgrey"} />
            </mesh>

            {/* Oben */}
            <mesh position={[x,y-(lüfterArgs[1]/2),z]}>

                <boxGeometry args={[1, 0.2, lüfterArgs[0]+0.2]} />
                <meshStandardMaterial color={"lightgrey"} />
            </mesh>

            {/* Unten */}
            <mesh position={[x,y+(lüfterArgs[1]/2),z]}>

                <boxGeometry args={[1, 0.2, lüfterArgs[0]+0.2]} />
                <meshStandardMaterial color={"lightgrey"} />
            </mesh>

            {/* Streben */}
            {Array.from({ length: 16 + (lüfterArgs[1]-5)*3.5 }).map((_, i) => (
                <mesh position={[x,y - (2.4+(lüfterArgs[1]-5)/2) + i*0.3 ,z]}>
                    <boxGeometry args={[1 ,0.1, lüfterArgs[0]-0.2]} />
                    <meshStandardMaterial color={i % 2 === 0 ? "darkgrey" : "grey"} />
                </mesh>
            ))}
        </group>
        </>
    )
}