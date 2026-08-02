import { useDrag } from '@use-gesture/react'
import { useThree } from '@react-three/fiber'
import { useEffect, useRef, useState } from 'react'
import { OPENING_POSITION_REFRESH_EVENT } from './ÖffnungenKomp/PositionInfoSection'

export default function DachFenster({ 
  koordinate,  
  setOrbitKontrolle, 
  gebäudeHöhe, 
  bodenBreite, 
  setTürAttribute, 
  setSelectedObject, 
  objId, 
  objs,
  vorne,
  bodenLänge
}) {

  const x = koordinate[0]
  //const y = koordinate[1] + ((gebäudeHöhe-15)/2) + (gebäudeHöhe<13 ? 0.15 : 0) + (gebäudeHöhe>17 ? 0.3 : 0)
  const y = koordinate[1] + 0.5
  const z = koordinate[2] - 4 - (bodenBreite-25)/2

  const [clickCount, setClickCount] = useState(0)
  const [gridPosi, setGridPosi] = useState({ x: x + 0.5, z: z + 0.5})
  const groupRef = useRef()
  const { size, camera } = useThree() 
  
  const obj = objs.find(o => o.id === objId);
  const größe = obj.value ?? [5, 5];

  const minX = vorne ? -11 + (größe[1]-5)/2 + (25-bodenBreite) : -3.3 + (größe[1]-5)/2
  const maxX = vorne ? 3.5 - (größe[1]-5)/2 - (bodenBreite < 21 ? 0.2 : 0) : 5.5 - (größe[1]-5)/2 - (25-bodenBreite)

  const minZ = vorne ? -17 + (größe[0]-5)/2 + (40-bodenLänge)/2 : -17 + (größe[0]-5)/2 + (40-bodenLänge)/2
  const maxZ = vorne ? 17 - (größe[0]-5)/2 - (40-bodenLänge)/2 : 17 - (größe[0]-5)/2 - (40-bodenLänge)/2

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

  useEffect(() => {
    const handleSharedRefreshPosition = (event) => {
      if (String(event?.detail?.id) !== String(objId)) return

      const incoming = event?.detail
      if (incoming?.startPos) {
        setGridPosi({
          x: incoming.startPos.x ?? x,
          z: incoming.startPos.z ?? z
        })
      }
    }

    window.addEventListener(OPENING_POSITION_REFRESH_EVENT, handleSharedRefreshPosition)
    return () => window.removeEventListener(OPENING_POSITION_REFRESH_EVENT, handleSharedRefreshPosition)
  }, [objId, x, z])

  const bind = useDrag(
    ({ offset: [zDrag, xDrag], first, last, }) => {
      if (!obj) return;

      const scale = 50 / size.width
      let newZ = Math.round(zDrag * scale) + z + 0.25
      let newX = Math.round(xDrag * scale) + x + 0.25  
      
      newX = Math.max(minX, Math.min(maxX, newX))
      newZ = Math.max(minZ, Math.min(maxZ, newZ))
      

      if (obj && obj.rechts) {
        setGridPosi({ x: -newZ, z: -newX})
      } else {
        setGridPosi({x: newZ, z: newX})
      }

      if (first) {
        setOrbitKontrolle(false)
        camera.position.set(0,40,(obj && obj.rechts ? -40 : 40))
      }
      if (last)  setOrbitKontrolle(true)
    }
  )

  if (!obj) {
    return null
  }

  return (
        <group
            ref={groupRef}
            position={[gridPosi.x, y-0.8, gridPosi.z]}
            {...bind()}
            onClick={handleClick}
            // onPointerUp={orbitTrue}
        >
          {/* blauer Hintergrund */}
          <mesh position={[x,y,z]}>

              <boxGeometry args={[größe[0], 0.15, größe[1]]} />
              
              <meshStandardMaterial color={"lightblue"} />
          </mesh>

          {/* Mitte Vertikal */}
          <mesh position={[x+0.1,y+0.1,z]}>

              <boxGeometry args={[0.15, 0.15, größe[1]]} />
              
              <meshStandardMaterial color={"darkgrey"} />
          </mesh>

          {/* Oben */}
          <mesh position={[x,y,z+2.5+(größe[1]-5)/2]}>

              <boxGeometry args={[größe[0],0.45, 0.15]} />
              
              <meshStandardMaterial color={"darkgrey"} />
          </mesh>

          {/* Unten */}
          <mesh position={[x,y,z-2.5-(größe[1]-5)/2]}>

              <boxGeometry args={[größe[0],0.4, 0.15]} />
              
              <meshStandardMaterial color={"grey"} />
          </mesh>

          {/* Mitte Horizontal */}
          <mesh position={[x,y+0.1,z]}>

              <boxGeometry args={[größe[0],0.15,0.15]} />
              
              <meshStandardMaterial color={"darkgrey"} />
          </mesh>
          
          {/* Rechts */}
          <mesh position={[x-2.5-(größe[0]-5)/2,y,z]}>

              <boxGeometry args={[0.15, 0.4, größe[1]]} />
              
              <meshStandardMaterial color={"darkgrey"} />
          </mesh>
        
          {/* Links */}
          <mesh position={[x+2.5+(größe[0]-5)/2,y,z]}>

              <boxGeometry args={[0.15, 0.4, größe[1]]} />
              
              <meshStandardMaterial color={"darkgrey"} />
          </mesh>
        </group>
  )
}
