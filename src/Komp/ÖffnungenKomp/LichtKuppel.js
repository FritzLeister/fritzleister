import * as THREE from 'three'
import { useThree } from '@react-three/fiber'
import { useMemo, useRef, useState, useEffect } from 'react'
import { useDrag } from '@use-gesture/react'

function getRahmenFarbe(farbe) {
	if (farbe === 'Schwarz') return '#1f2328'
	if (farbe === 'Grau') return '#7c8790'
	return '#dbe3ea'
}

export default function LichtKuppel({
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
	dachArt = 'satteldach',
	pultdachHöheDifferenz = 0,
	zusatzHöheMitte = 5,
	vorne = true
}) {
	const obj = objs.find(o => o.id === objId)
	const openingArgs = obj ? [obj.value[0], obj.value[1]] : [1, 1]

	const x = position[0]
	const y = position[1]
	const z = position[2]

	const xLinks = x - 9 - (0.5 * (bodenLänge - 20))
	const xRechts = x + 9 + (0.5 * (bodenLänge - 20))
	const zVorne = z + 6.5 + (0.5 * (bodenBreite - 15))
	const zHinten = z - 6.5 - (0.5 * (bodenBreite - 15))
	const traufhöhe = y + 4.5 + gebäudeHöhe

	const { size, camera } = useThree()
	const groupRef = useRef()

	let initialMinZ = zHinten + (openingArgs[1] / 2) - 1
	let initialMaxZ = zVorne - (openingArgs[1] / 2) + 1

	if (dachArt === 'satteldach') {
		if (vorne) {
			initialMinZ = z - (openingArgs[1] / 2) + 6.8 + (openingArgs[1] - 6)
			initialMaxZ = zVorne - (openingArgs[1] / 2) + 0.5
		} else {
			initialMinZ = zHinten + (openingArgs[1] / 2) - 1
			initialMaxZ = z - (openingArgs[1] / 2) - 1
		}
	} else if (dachArt === 'pultdach') {
		initialMinZ = zHinten + (openingArgs[1] / 2) + 1
		initialMaxZ = zVorne - (openingArgs[1] / 2) - 1
	}

	const initialX = obj?.startPos?.x ?? x
	let initialZ = obj?.startPos?.z ?? z

	if (!obj?.startPos?.z) {
		initialZ = vorne ? (z + zVorne) / 2 : (z + zHinten) / 2
	}

	const clampedInitialZ = Math.max(initialMinZ, Math.min(initialMaxZ, initialZ))
	const [gridPosi, setGridPosi] = useState({ x: initialX, z: clampedInitialZ })
	const [isHovered, setIsHovered] = useState(false)
	const [isActive, setIsActive] = useState(false)

	let rotation = 0
	let finalX = gridPosi.x
	let finalY = traufhöhe
	let finalZ = gridPosi.z

	if (dachArt === 'pultdach') {
		const zStart = zHinten - 1
		const zEnd = zVorne + 1
		const zLänge = Math.abs(zEnd - zStart)

		const yStart = traufhöhe - 4
		const yEnd = traufhöhe - 4 + pultdachHöheDifferenz
		const yDiff = yEnd - yStart

		rotation = -Math.atan2(yDiff, zLänge)

		const zNormalized = (gridPosi.z - zStart) / zLänge
		finalY = yStart + (yDiff * zNormalized)
		finalZ = gridPosi.z
		finalX = gridPosi.x
	} else if (dachArt === 'satteldach') {
		if (vorne) {
			const zStart = zVorne + 1
			const zEnd = z
			const zLänge = Math.abs(zStart - zEnd)

			const yStart = traufhöhe - 4
			const yEnd = traufhöhe + zusatzHöheMitte - 4
			const yDiff = yEnd - yStart

			rotation = Math.atan2(yDiff, zLänge)

			const zNormalized = (gridPosi.z - zStart) / (-zLänge)
			finalY = yStart + (yDiff * zNormalized)
			finalZ = gridPosi.z
			finalX = gridPosi.x
		} else {
			const zStart = z
			const zEnd = zHinten - 1
			const zLänge = Math.abs(zEnd - zStart)

			const yStart = traufhöhe + zusatzHöheMitte - 4
			const yEnd = traufhöhe - 4
			const yDiff = yEnd - yStart

			rotation = Math.atan2(yDiff, zLänge)

			const zNormalized = (zStart - gridPosi.z) / zLänge
			finalY = yStart + (yDiff * zNormalized)
			finalZ = gridPosi.z
			finalX = gridPosi.x
		}
	} else if (dachArt === 'flachdach') {
		rotation = 0
		finalY = traufhöhe - 4
		finalZ = gridPosi.z
		finalX = gridPosi.x
	}

	const minX = xLinks + (openingArgs[0] / 2) - 1
	const maxX = xRechts - (openingArgs[0] / 2) + 1
	let minZ = initialMinZ
	let maxZ = initialMaxZ

	const handleClick = () => {
		const found = objs.find(o => o.id === objId)
		if (found) {
			window.activeArrowControl = { kind: 'dach-lichtkuppel', id: objId }
			setSelectedObject(found)
			setEditMenü('Lichtkuppel-Bearbeiten')
		}
	}

	useEffect(() => {
		const handleKeyDown = (event) => {
			const active = window.activeArrowControl
			if (!active || active.kind !== 'dach-lichtkuppel' || active.id !== objId) return

			const gridSize = 3
			const step = gridSize

			setGridPosi(prev => {
				let newX = prev.x
				let newZ = prev.z

				switch (event.key) {
					case 'ArrowLeft':
						if (vorne) {
							newX = prev.x - step
						} else {
							newX = prev.x + step
						}
						newX = Math.max(minX, Math.min(maxX, newX))
						event.preventDefault()
						break
					case 'ArrowRight':
						if (vorne) {
							newX = prev.x + step
						} else {
							newX = prev.x - step
						}
						newX = Math.max(minX, Math.min(maxX, newX))
						event.preventDefault()
						break
					case 'ArrowUp':
						if (vorne) {
							newZ = prev.z - step
						} else {
							newZ = prev.z + step
						}
						newZ = Math.max(minZ, Math.min(maxZ, newZ))
						event.preventDefault()
						break
					case 'ArrowDown':
						if (vorne) {
							newZ = prev.z + step
						} else {
							newZ = prev.z - step
						}
						newZ = Math.max(minZ, Math.min(maxZ, newZ))
						event.preventDefault()
						break
					default:
						return prev
				}

				return { x: newX, z: newZ }
			})
		}

		window.addEventListener('keydown', handleKeyDown)
		return () => window.removeEventListener('keydown', handleKeyDown)
	}, [objId, minX, maxX, minZ, maxZ, vorne])

	const bind = useDrag(({ movement: [moveX, moveY], first, last, memo }) => {
		const scale = 400 / size.width
		const gridSize = 0.6

		if (first) {
			memo = { startX: gridPosi.x, startZ: gridPosi.z }
		}

		let newX = vorne
			? memo.startX + (moveX * scale)
			: memo.startX - (moveX * scale)
		newX = Math.round(newX / gridSize) * gridSize
		newX = Math.max(minX, Math.min(maxX, newX))

		let newZ = memo.startZ
		const zScale = 10 / size.width

		if (vorne) {
			newZ = memo.startZ + (moveY * zScale)
		} else {
			newZ = memo.startZ - (moveY * zScale)
		}

		newZ = Math.round(newZ / gridSize) * gridSize
		newZ = Math.max(minZ, Math.min(maxZ, newZ))

		setGridPosi({ x: newX, z: newZ })

		if (first) {
			window.activeArrowControl = { kind: 'dach-lichtkuppel', id: objId }
			setIsActive(true)
			setOrbitKontrolle(false)
			camera.position.set(0, 125, vorne ? 40 : -40)
		}

		if (last) {
			setOrbitKontrolle(true)
		}

		return memo
	})

	const borderColor = isHovered ? '#5aa7ff' : '#000000'
	const rahmenFarbe = getRahmenFarbe(obj?.farbe)
	const breiteX = openingArgs[0]
	const breiteY = openingArgs[1]
	const basisTiefe = 0.25
	const kuppelSteilheit = 0.20
	const kuppelHöhe = Math.max(0.22, Math.min(0.95, Math.min(breiteX, breiteY) * kuppelSteilheit))

	const pyramidGeometry = useMemo(() => {
		const hw = breiteX / 2
		const hh = breiteY / 2
		const positions = new Float32Array([
			-hw, -hh, -basisTiefe / 2,
			hw, -hh, -basisTiefe / 2,
			0, 0, -(kuppelHöhe + basisTiefe / 2),

			hw, -hh, -basisTiefe / 2,
			hw, hh, -basisTiefe / 2,
			0, 0, -(kuppelHöhe + basisTiefe / 2),

			hw, hh, -basisTiefe / 2,
			-hw, hh, -basisTiefe / 2,
			0, 0, -(kuppelHöhe + basisTiefe / 2),

			-hw, hh, -basisTiefe / 2,
			-hw, -hh, -basisTiefe / 2,
			0, 0, -(kuppelHöhe + basisTiefe / 2)
		])

		const geometry = new THREE.BufferGeometry()
		geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
		geometry.computeVertexNormals()
		return geometry
	}, [breiteX, breiteY, kuppelHöhe])

	return (
		<group
			position={[finalX, finalY+0.1, finalZ]}
			ref={groupRef}
			{...bind()}
			onClick={handleClick}
			onPointerOver={() => setIsHovered(true)}
			onPointerOut={() => setIsHovered(false)}
			rotation={[rotation + Math.PI / 2, 0, 0]}
		>
			{oberflächenAnzeigen && (
				<>
					<mesh position={[0, 0, 0]}>
						<boxGeometry args={[breiteX, breiteY, basisTiefe]} />
						<meshStandardMaterial color={rahmenFarbe} metalness={0.3} roughness={0.55} />
					</mesh>

					<mesh geometry={pyramidGeometry}>
						<meshStandardMaterial
							color="#BFEFFF"
							transparent
							opacity={0.6}
							depthWrite={false}
							side={THREE.DoubleSide}
							metalness={0.1}
							roughness={0.12}
						/>
					</mesh>

					<mesh position={[0, 0, -basisTiefe / 2 - 0.02]}>
						<boxGeometry args={[breiteX - 0.12, breiteY - 0.12, 0.03]} />
						<meshStandardMaterial
							color="#CFF4FF"
							transparent
							opacity={0.42}
							depthWrite={false}
							side={THREE.DoubleSide}
							metalness={0.1}
							roughness={0.15}
						/>
					</mesh>
				</>
			)}

			{kantenAnzeigen && (
				<>
					<lineSegments>
						<edgesGeometry args={[new THREE.BoxGeometry(breiteX, breiteY, basisTiefe)]} />
						<lineBasicMaterial color={borderColor} linewidth={2} />
					</lineSegments>

					<lineSegments>
						<edgesGeometry args={[pyramidGeometry]} />
						<lineBasicMaterial color={isActive ? '#2f6db8' : borderColor} linewidth={2} />
					</lineSegments>
				</>
			)}
		</group>
	)
}
