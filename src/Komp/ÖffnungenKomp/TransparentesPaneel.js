import * as THREE from 'three'
import { useThree } from '@react-three/fiber'
import { useRef, useState, useEffect } from 'react'
import { useDrag } from '@use-gesture/react'

// Transparentes Paneel für Wände – Glasfläche mit vertikalen Profilen
export default function TransparentesPaneel({
	gebäudeHöhe,
	position,
	bodenBreite,
	bodenLänge,
	setOrbitKontrolle,
	setSelectedObject,
	setObjs,
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
	const paneelBreite = openingArgs[0] * 2.5
	const paneelHöhe = openingArgs[1] * 2.5

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
	const gridPosiRef = useRef({ x: initialX, z: initialZ, y: initialY })
	const [isHovered, setIsHovered] = useState(false)
	const halbePaneelBreite = paneelBreite / 2
	const randPuffer = 0.1

	const langeWandMin = xLinks - 1
	const langeWandMax = xRechts + 1

	const kurzeWandMin = zHinten - 1
	const kurzeWandMax = zVorne + 1

	const minX = langeWandMin + halbePaneelBreite + randPuffer
	const maxX = langeWandMax - halbePaneelBreite - randPuffer
	const minZ = kurzeWandMin + halbePaneelBreite + randPuffer
	const maxZ = kurzeWandMax - halbePaneelBreite - randPuffer

	const minY = position[1] + sockelhöhe + (paneelHöhe / 2)
	const maxY = position[1] + 0.2 + wandHöhe - (paneelHöhe / 2) + 0.48

	useEffect(() => {
		gridPosiRef.current = gridPosi
	}, [gridPosi])

	const persistPosition = (nextPos) => {
		if (!setObjs) return

		setObjs(prevObjs => prevObjs.map(item =>
			item.id === objId
				? {
					...item,
					startPos: {
						...(item.startPos ?? {}),
						x: nextPos.x,
						y: nextPos.y,
						z: nextPos.z
					}
				}
				: item
		))

		setSelectedObject(prev => {
			if (!prev || prev.id !== objId) return prev
			return {
				...prev,
				startPos: {
					...(prev.startPos ?? {}),
					x: nextPos.x,
					y: nextPos.y,
					z: nextPos.z
				}
			}
		})
	}

	const handleClick = () => {
		const found = objs.find(o => o.id === objId)
		if (found) {
			window.activeArrowControl = { kind: 'wand-transparentespaneel', id: objId }
			setSelectedObject(found)
			setEditMenü('TransparentesPaneel-Bearbeiten')
		}
	}

	useEffect(() => {
		const handleKeyDown = (event) => {
			const active = window.activeArrowControl
			if (!active || active.kind !== 'wand-transparentespaneel' || active.id !== objId) return

			const stepHorizontal = 3
			const stepVertical = 0.25
			const current = gridPosiRef.current
			let newX = current.x
			let newZ = current.z
			let newY = current.y

				switch (event.key) {
					case 'ArrowLeft':
						if (lang) {
							newX = current.x + (rechts ? stepHorizontal : -stepHorizontal)
							newX = Math.max(minX, Math.min(maxX, newX))
						} else {
							newZ = current.z - (rechts ? stepHorizontal : -stepHorizontal)
							newZ = Math.max(minZ, Math.min(maxZ, newZ))
						}
						event.preventDefault()
						break
					case 'ArrowRight':
						if (lang) {
							newX = current.x + (rechts ? -stepHorizontal : stepHorizontal)
							newX = Math.max(minX, Math.min(maxX, newX))
						} else {
							newZ = current.z + (rechts ? stepHorizontal : -stepHorizontal)
							newZ = Math.max(minZ, Math.min(maxZ, newZ))
						}
						event.preventDefault()
						break
					case 'ArrowUp':
						newY = current.y + stepVertical
						newY = Math.max(minY, Math.min(maxY, newY))
						event.preventDefault()
						break
					case 'ArrowDown':
						newY = current.y - stepVertical
						newY = Math.max(minY, Math.min(maxY, newY))
						event.preventDefault()
						break
					default:
						return
				}

			const nextPos = { x: newX, z: newZ, y: newY }
			gridPosiRef.current = nextPos
			setGridPosi(nextPos)
			persistPosition(nextPos)
		}

		window.addEventListener('keydown', handleKeyDown)
		return () => window.removeEventListener('keydown', handleKeyDown)
	}, [objId, lang, rechts, minX, maxX, minZ, maxZ, minY, maxY])

	const bind = useDrag(({ movement: [dragMoveX, dragMoveY], first, last, memo }) => {
		const scale = 80 / size.width

		if (first) {
			memo = {
				startX: gridPosiRef.current.x,
				startZ: gridPosiRef.current.z,
				startY: gridPosiRef.current.y
			}
		}

		let nextX = memo.startX
		let nextZ = memo.startZ

		if (lang) {
			const dragMultiplier = rechts ? -1 : 1
			nextX = Math.round(memo.startX + (dragMultiplier * dragMoveX * scale))
			nextX = Math.max(minX, Math.min(maxX, nextX))
		} else {
			const dragMultiplier = rechts ? 1 : -1
			nextZ = Math.round(memo.startZ + (dragMultiplier * dragMoveX * scale))
			nextZ = Math.max(minZ, Math.min(maxZ, nextZ))
		}

		const yDelta = Math.round(-dragMoveY * scale)
		let nextY = memo.startY + yDelta
		nextY = Math.max(minY, Math.min(maxY, nextY))

		const nextPos = { x: nextX, z: nextZ, y: nextY }
		gridPosiRef.current = nextPos
		setGridPosi(nextPos)

		if (first) {
			window.activeArrowControl = { kind: 'wand-transparentespaneel', id: objId }
			setOrbitKontrolle(false)
		}

		if (last) {
			persistPosition(nextPos)
			setOrbitKontrolle(true)
		}

		return memo
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

	let paneelRotation = [0, 0, 0]
	if (lang && rechts) paneelRotation = [0, Math.PI, 0]
	if (!lang && rechts) paneelRotation = [0, -Math.PI / 2, 0]
	if (!lang && !rechts) paneelRotation = [0, Math.PI / 2, 0]

	return (
		<group
			position={[finalX, finalY, finalZ]}
			ref={groupRef}
			{...bind()}
			onClick={handleClick}
			onPointerOver={() => setIsHovered(true)}
			onPointerOut={() => setIsHovered(false)}
			rotation={paneelRotation}
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
