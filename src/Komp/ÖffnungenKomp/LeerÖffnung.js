import * as THREE from 'three'
import { useThree } from '@react-three/fiber'
import { useRef, useState } from 'react'
import { useDrag } from '@use-gesture/react'

// Transparente Öffnung für Wände (long-side aktuell)
export default function LeerÖffnung({
	gebäudeHöhe,
	position,
	bodenBreite,
	bodenLänge,
	setOrbitKontrolle,
	setSelectedObject,
	objId,
	objs,
	setEditMenü,
	oberflächenAnzeigen,
	kantenAnzeigen
}) {
	const obj = objs.find(o => o.id === objId)
	const openingArgs = obj ? [obj.value[0], obj.value[1]] : [12, 8]

	const rechts = obj?.rechts ?? true // true = Rückseite, false = Vorderseite
	const lang = obj?.lang ?? true // true = lange Wand, false = kurze Wand

	const x = position[0]
	//const y = position[1] + (gebäudeHöhe / 6) - 0.4 - ((gebäudeHöhe - 15) / 6) - 2 + ((openingArgs[1] - 1) / 4)
	const y = position[1] + (openingArgs[1] / 2)
	
	// Positionierung wie bei Wand: zVorne = z + 6.5 + (0.5 * (bodenBreite - 15))
	const zVorne = position[2] + 6.5 + (0.5 * (bodenBreite - 15))+1.5
	const zHinten = position[2] - 6.5 - (0.5 * (bodenBreite - 15))-1.5
	const z = rechts ? zHinten : zVorne

	// Für kurze Wände: x-Position an den Seiten
	const xLinks = position[0] - 6.5 - (0.5 * (bodenLänge - 15))-1.5
	const xRechts = position[0] + 6.5 + (0.5 * (bodenLänge - 15))+1.5

	const { size, camera } = useThree()
	const groupRef = useRef()

	// Verwende startPos, falls verfügbar
	const initialX = obj?.startPos?.x ?? x
	const initialZ = obj?.startPos?.z ?? position[2]
	const [gridPosi, setGridPosi] = useState({ x: initialX, z: initialZ })
	const [isHovered, setIsHovered] = useState(false)

	// Grenzen für lange Wände (X-Achse)
	const minX = x - 7 + (openingArgs[0] - 16) / 2 - (bodenLänge - 30) / 2
	const maxX = x + 7 - (openingArgs[0] - 16) / 2 + (bodenLänge - 30) / 2

	// Grenzen für kurze Wände (Z-Achse)
	const minZ = position[2] - 7 + (openingArgs[0] - 16) / 2 - (bodenBreite - 30) / 2
	const maxZ = position[2] + 7 - (openingArgs[0] - 16) / 2 + (bodenBreite - 30) / 2

	const handleClick = () => {
		const found = objs.find(o => o.id === objId)
		if (found) {
			setSelectedObject(found)
			setEditMenü('LeerÖffnung-Bearbeiten')
		}
	}

	const bind = useDrag(({ offset: [dragOffset], first, last }) => {
		const scale = 100 / size.width

		if (lang) {
			// Lange Wand: X-Achse bewegen (Richtung abhängig von rechts)
			const dragMultiplier = rechts ? -1 : 1
			let newX = Math.round(dragMultiplier * dragOffset * scale) + x
			newX = Math.max(minX, Math.min(maxX, newX))
			setGridPosi({ x: newX, z: gridPosi.z })

			if (first) {
				setOrbitKontrolle(false)
				const dir = rechts ? -1 : 1
				camera.position.set(0, 40, dir * 180)
			}
		} else {
			// Kurze Wand: Z-Achse bewegen (Richtung abhängig von rechts)
			const dragMultiplier = rechts ? 1 : -1
			let newZ = Math.round(dragMultiplier * dragOffset * scale) + position[2]
			newZ = Math.max(minZ, Math.min(maxZ, newZ))
			setGridPosi({ x: gridPosi.x, z: newZ })

			if (first) {
				setOrbitKontrolle(false)
				const dir = rechts ? -1 : 1
				camera.position.set(dir * 180, 40, 0)
			}
		}

		if (last) setOrbitKontrolle(true)
	})

	const borderColor = isHovered ? '#5aa7ff' : '#000000'

	// Finale Position basierend auf Wandtyp
	const finalX = lang ? gridPosi.x : (rechts ? xLinks : xRechts)
	const finalZ = lang ? z : gridPosi.z

	return (
		<group
			position={[finalX, y, finalZ]}
			ref={groupRef}
			{...bind()}
			onClick={handleClick}
			onPointerOver={() => setIsHovered(true)}
			onPointerOut={() => setIsHovered(false)}
			rotation={lang ? [0, 0, 0] : [0, Math.PI * 90 / 180, 0]}
		>
			{/* halbtransparentes Glas - durchsichtige Öffnung */}
			{oberflächenAnzeigen && (
			<mesh position={[0, 0, 0]}>
				<boxGeometry args={[...openingArgs, 1]} />
				<meshStandardMaterial
					color="#87CEEB"
					transparent
					opacity={0.25}
					depthWrite={false}
					side={THREE.DoubleSide}
					wireframe={false}
					metalness={0.1}
					roughness={0.3}
				/>
			</mesh>
			)}

			{/* feine Umrandung */}
			{kantenAnzeigen && (
			<lineSegments position={[0, 0, 0]}>
				<edgesGeometry attach="geometry" args={[new THREE.BoxGeometry(openingArgs[0], openingArgs[1], 1)]} />
				<lineBasicMaterial attach="material" color={borderColor} linewidth={2} />
			</lineSegments>
			)}
		</group>
	)
}
