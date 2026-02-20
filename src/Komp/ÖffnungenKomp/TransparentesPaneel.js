import * as THREE from 'three'
import { useThree } from '@react-three/fiber'
import { useRef, useState } from 'react'
import { useDrag } from '@use-gesture/react'

// Transparentes Paneel für Wände – Glasfläche mit vertikalen Profilen
export default function TransparentesPaneel({
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
	kantenAnzeigen,
	sockelhöhe = 2,
	dachArt = 'satteldach',
	pultdachHöheDifferenz = 0
}) {
	const obj = objs.find(o => o.id === objId)
	const openingArgs = obj ? [obj.value[0], obj.value[1]] : [3, 3]
	const paneelBreite = openingArgs[0]
	const paneelHöhe = openingArgs[1]

	const rechts = obj?.rechts ?? true
	const lang = obj?.lang ?? true

	const x = position[0]
	const defaultY = position[1] + sockelhöhe + (paneelHöhe / 2)

	const zVorne = position[2] + 6.5 + (0.5 * (bodenBreite - 15))
	const zHinten = position[2] - 6.5 - (0.5 * (bodenBreite - 15))
	const z = rechts ? zHinten : zVorne

	const xLinks = position[0] - 6.5 - (0.5 * (bodenLänge - 15))
	const xRechts = position[0] + 6.5 + (0.5 * (bodenLänge - 15))

	const { size } = useThree()
	const groupRef = useRef()

	let wandHöhe = gebäudeHöhe
	if (dachArt === 'pultdach') {
		wandHöhe = rechts ? gebäudeHöhe : gebäudeHöhe + pultdachHöheDifferenz
	}

	const initialX = obj?.startPos?.x ?? x
	const initialZ = obj?.startPos?.z ?? position[2]
	const initialY = obj?.startPos?.y ?? defaultY
	const [gridPosi, setGridPosi] = useState({ x: initialX, z: initialZ, y: initialY })
	const [isHovered, setIsHovered] = useState(false)

	const minX = x - 7 + (openingArgs[0] - 16) / 2 - (bodenLänge - 30) / 2
	const maxX = x + 7 - (openingArgs[0] - 16) / 2 + (bodenLänge - 30) / 2
	const minZ = position[2] - 7 + (openingArgs[0] - 16) / 2 - (bodenBreite - 30) / 2
	const maxZ = position[2] + 7 - (openingArgs[0] - 16) / 2 + (bodenBreite - 30) / 2

	const minY = position[1] + sockelhöhe + (paneelHöhe / 2)
	const maxY = position[1] + 0.2 + wandHöhe - (paneelHöhe / 2) + 0.48

	const handleClick = () => {
		const found = objs.find(o => o.id === objId)
		if (found) {
			setSelectedObject(found)
			setEditMenü('TransparentesPaneel-Bearbeiten')
		}
	}

	const bind = useDrag(({ offset: [dragOffsetX, dragOffsetY], first, last }) => {
		const scale = 80 / size.width

		let nextX = gridPosi.x
		let nextZ = gridPosi.z

		if (lang) {
			const dragMultiplier = rechts ? -1 : 1
			nextX = Math.round(dragMultiplier * dragOffsetX * scale) + x
			nextX = Math.max(minX, Math.min(maxX, nextX))
		} else {
			const dragMultiplier = rechts ? 1 : -1
			nextZ = Math.round(dragMultiplier * dragOffsetX * scale) + position[2]
			nextZ = Math.max(minZ, Math.min(maxZ, nextZ))
		}

		const yDelta = Math.round(-dragOffsetY * scale)
		let nextY = initialY + yDelta
		nextY = Math.max(minY, Math.min(maxY, nextY))

		setGridPosi({ x: nextX, z: nextZ, y: nextY })

		if (first) {
			setOrbitKontrolle(false)
		}

		if (last) setOrbitKontrolle(true)
	})

	const borderColor = isHovered ? '#5aa7ff' : '#000000'

	const tiefe = 1.2
	const surfaceOffset = tiefe / 2 + 0.05
	const normalSign = rechts ? -1 : 1
	const finalX = lang ? gridPosi.x : (rechts ? xLinks : xRechts) + (!lang ? normalSign * surfaceOffset : 0)
	const finalZ = lang ? z + (lang ? normalSign * surfaceOffset : 0) : gridPosi.z
	const finalY = gridPosi.y

	const breite = paneelBreite
	const höhe = paneelHöhe

	const profilAbstand = 0.9
	const profilCount = Math.max(2, Math.floor((breite - 0.25) / profilAbstand))

	return (
		<group
			position={[finalX, finalY, finalZ]}
			ref={groupRef}
			{...bind()}
			onClick={handleClick}
			onPointerOver={() => setIsHovered(true)}
			onPointerOut={() => setIsHovered(false)}
			rotation={lang ? [0, 0, 0] : [0, Math.PI * 90 / 180, 0]}
		>
			{oberflächenAnzeigen && (
				<>
					{/* Transparente Fläche vorne */}
					<mesh position={[0, 0, tiefe / 2 + 0.02]}>
						<boxGeometry args={[breite - 0.12, höhe - 0.12, 0.05]} />
						<meshStandardMaterial
							color="#BFEFFF"
							transparent
							opacity={0.45}
							depthWrite={false}
							side={THREE.DoubleSide}
							metalness={0.15}
							roughness={0.15}
						/>
					</mesh>

					{/* Transparente Fläche hinten */}
					<mesh position={[0, 0, -tiefe / 2 - 0.02]}>
						<boxGeometry args={[breite - 0.12, höhe - 0.12, 0.05]} />
						<meshStandardMaterial
							color="#BFEFFF"
							transparent
							opacity={0.35}
							depthWrite={false}
							side={THREE.DoubleSide}
							metalness={0.15}
							roughness={0.15}
						/>
					</mesh>

					{/* Vertikale Profile */}
					{Array.from({ length: profilCount + 1 }, (_, i) => {
						const startX = -((profilCount * profilAbstand) / 2)
						const px = startX + (i * profilAbstand)
						const clampedX = Math.max(-breite / 2 + 0.12, Math.min(breite / 2 - 0.12, px))

						return (
							<group key={`profil-${i}`}>
								<mesh position={[clampedX, 0, tiefe / 2 + 0.04]}>
									<boxGeometry args={[0.05, höhe - 0.08, 0.05]} />
									<meshStandardMaterial color="#9fd3e6" />
								</mesh>
								<mesh position={[clampedX, 0, -tiefe / 2 - 0.04]}>
									<boxGeometry args={[0.05, höhe - 0.08, 0.05]} />
									<meshStandardMaterial color="#9fd3e6" />
								</mesh>
							</group>
						)
					})}

					{/* Außenrahmen */}
					<mesh position={[0, höhe / 2 - 0.04, 0]}>
						<boxGeometry args={[breite, 0.08, tiefe + 0.05]} />
						<meshStandardMaterial color="#9fd3e6" />
					</mesh>
					<mesh position={[0, -höhe / 2 + 0.04, 0]}>
						<boxGeometry args={[breite, 0.08, tiefe + 0.05]} />
						<meshStandardMaterial color="#9fd3e6" />
					</mesh>
					<mesh position={[-breite / 2 + 0.04, 0, 0]}>
						<boxGeometry args={[0.08, höhe, tiefe + 0.05]} />
						<meshStandardMaterial color="#9fd3e6" />
					</mesh>
					<mesh position={[breite / 2 - 0.04, 0, 0]}>
						<boxGeometry args={[0.08, höhe, tiefe + 0.05]} />
						<meshStandardMaterial color="#9fd3e6" />
					</mesh>
				</>
			)}

			{kantenAnzeigen && (
				<lineSegments>
					<edgesGeometry attach="geometry" args={[new THREE.BoxGeometry(breite, höhe, tiefe)]} />
					<lineBasicMaterial attach="material" color={borderColor} linewidth={2} />
				</lineSegments>
			)}
		</group>
	)
}
