import { useThree } from '@react-three/fiber'
import { useLoader } from "@react-three/fiber"
import { useRef, useState } from "react"
import { TextureLoader } from "three"
import { useDrag } from '@use-gesture/react'


export default function Tür({ 
    gebäudeHöhe, 
    position, 
    bodenBreite, 
    bodenLänge, 
    setOrbitKontrolle, 
    setTürAttribute, 
    setSelectedObject, 
    objId, 
    objs, 
}) {

    const obj = objs.find(obj => obj.id === objId)
    const türArgs = obj ? [obj.value[0], obj.value[1]] : [10,4]

    const rechts = obj.rechts
    const lang = true

    const x = position[0]
    const y = position[1] + (gebäudeHöhe/6) - 0.4 - ((gebäudeHöhe-15)/6) - 2 + ((türArgs[1]-1)/4)
    const z = position[2] + (lang ? (rechts ? (bodenBreite/2)/2 + 0.3 : -(bodenBreite/2)/2 - 0.3) : (bodenLänge/2)+0.3)
    const url = "/grau-tür.png"
    // const url = "/grün-tür.png"
    const ref = useRef()
    const texture = useLoader(TextureLoader, url)

    const [gridPosi, setGridPosi] = useState({ x: x})
    const { size, camera } = useThree() 
    const groupRef = useRef()

    const minX = x - 7 + (türArgs[0]-16)/2 - (bodenLänge-30)/2
    const maxX = x + 7 - (türArgs[0]-16)/2 + (bodenLänge-30)/2

    const [clickCount, setClickCount] = useState(0)

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

    const bind = useDrag(
        ({ offset: [xDrag], first, last}) => {
            const scale = 40/size.width
            let newX = Math.round(xDrag*scale) + x

            newX = Math.max(minX, Math.min(maxX, newX))

            setGridPosi({x: rechts ? newX : -newX})
            
            if (first && rechts) {
                setOrbitKontrolle(false)
                camera.position.set(0,23,50)
            } else if (first && rechts===false) {
                setOrbitKontrolle(false)
                camera.position.set(0,23,-50)
            }
            if (last)  setOrbitKontrolle(true)
        }
    )
    
    return(
        <>
        <group 
        position={[gridPosi.x, y, z]}
        ref={groupRef}
        {...bind()}
        onClick={handleClick}
        rotation={lang ? [0,0,0] : [0, Math.PI * 90 / 180, 0]}
        >
            {/* Boden */}
            <mesh position={[x,y,z]} ref={ref}>
                <boxGeometry args={[...türArgs, 0.3]} />
                <meshBasicMaterial map={texture} />
            </mesh>

            {/* Umrandungen */}
            {/* Rechts */}
            <mesh position={[x-(türArgs[0]/2)-0.1, y, z]}>
                <boxGeometry args={[0.2, türArgs[1], 0.3]} />
                <meshStandardMaterial color={"black"} />
            </mesh>

            {/* Links */}
            <mesh position={[x+(türArgs[0]/2)+0.1, y, z]}>
                <boxGeometry args={[0.2, türArgs[1], 0.3]} />
                <meshStandardMaterial color={"black"} />
            </mesh>

            {/* Unten */}
            <mesh position={[x,y-(türArgs[1]/2)-0.1,z]}>
                <boxGeometry args={[türArgs[0], 0.2, 0.3]} />
                <meshStandardMaterial color={"black"} />
            </mesh>

            {/* Oben */}
            <mesh position={[x,y+(türArgs[1]/2)+0.1,z]}>
                <boxGeometry args={[türArgs[0], 0.2, 0.3]} />
                <meshStandardMaterial color={"black"} />
            </mesh>
        </group>
        </>
    )
}