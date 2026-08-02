import * as THREE from 'three'
import { useThree } from '@react-three/fiber'
import { useMemo, useRef, useState, useEffect, useCallback } from 'react'
import { useDrag } from '@use-gesture/react'
import { OPENING_POSITION_REFRESH_EVENT } from './PositionInfoSection'
import { OPENING_GRID_STEP, dispatchOpeningPositionValues, persistOpeningPosition, quantizeOpeningDistance, snapOpeningCoordinate } from './wallOpeningPositionUtils'
import { getOpeningCollisionReport } from '../openingUtils'

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
	setObjs,
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
	const toFinite = (value, fallback = 0) => {
		const parsed = Number(value)
		return Number.isFinite(parsed) ? parsed : fallback
	}

	const obj = objs.find(o => o.id === objId)
	const openingArgs = useMemo(() => (obj ? [obj.value[0], obj.value[1]] : [1, 1]), [obj])

	const x = position[0]
	const y = position[1]
	const z = position[2]

	const xLinks = x - 9 - (0.5 * (bodenLänge - 20))
	const xRechts = x + 9 + (0.5 * (bodenLänge - 20))
	const zVorne = z + 6.5 + (0.5 * (bodenBreite - 15))
	const zHinten = z - 6.5 - (0.5 * (bodenBreite - 15))
	const traufhöhe = y + 4.5 + gebäudeHöhe

	const { size } = useThree()
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
	const gridPosiRef = useRef({ x: initialX, z: clampedInitialZ })
	const isDraggingRef = useRef(false)
	const [isHovered, setIsHovered] = useState(false)
	const [isActive, setIsActive] = useState(false)

	useEffect(() => {
		gridPosiRef.current = gridPosi
	}, [gridPosi])

	useEffect(() => {
		if (isDraggingRef.current) return

		const nextPos = {
			x: obj?.startPos?.x ?? initialX,
			z: obj?.startPos?.z ?? initialZ
		}

		if (
			gridPosiRef.current.x !== nextPos.x ||
			gridPosiRef.current.z !== nextPos.z
		) {
			gridPosiRef.current = nextPos
			setGridPosi(nextPos)
		}
	}, [obj?.id, obj?.startPos?.x, obj?.startPos?.z, initialX, initialZ])

	const getRoofCenterYAtZ = useCallback((zValue) => {
		const safeZ = toFinite(zValue, z)

		if (dachArt === 'pultdach') {
			const zStart = zHinten - 1
			const zEnd = zVorne + 1
			const zLänge = Math.abs(zEnd - zStart)
			if (!Number.isFinite(zLänge) || zLänge <= 0) return traufhöhe - 4

			const yStart = traufhöhe - 4
			const yEnd = traufhöhe - 4 + pultdachHöheDifferenz
			const zNormalized = (safeZ - zStart) / zLänge
			return yStart + ((yEnd - yStart) * zNormalized)
		}

		if (dachArt === 'satteldach') {
			if (vorne) {
				const zStart = zVorne + 1
				const zEnd = z
				const zLänge = Math.abs(zStart - zEnd)
				if (!Number.isFinite(zLänge) || zLänge <= 0) return traufhöhe - 4

				const yStart = traufhöhe - 4
				const yEnd = traufhöhe + zusatzHöheMitte - 4
				const zNormalized = (safeZ - zStart) / (-zLänge)
				return yStart + ((yEnd - yStart) * zNormalized)
			}

			const zStart = z
			const zEnd = zHinten - 1
			const zLänge = Math.abs(zEnd - zStart)
			if (!Number.isFinite(zLänge) || zLänge <= 0) return traufhöhe - 4

			const yStart = traufhöhe + zusatzHöheMitte - 4
			const yEnd = traufhöhe - 4
			const zNormalized = (zStart - safeZ) / zLänge
			return yStart + ((yEnd - yStart) * zNormalized)
		}

		return traufhöhe - 4
	}, [dachArt, pultdachHöheDifferenz, traufhöhe, vorne, z, zHinten, zVorne, zusatzHöheMitte])

	const persistPosition = useCallback((nextPos) => {
		const safeX = toFinite(nextPos?.x, toFinite(gridPosiRef.current?.x, x))
		const safeZ = toFinite(nextPos?.z, toFinite(gridPosiRef.current?.z, z))
		const halfWidth = toFinite(openingArgs[0] / 2)
		const halfHeight = toFinite(openingArgs[1] / 2)
		const leftEdge = toFinite(xLinks + halfWidth)
		const rightEdge = toFinite(xRechts - halfWidth)
		const abstandLinksRaw = safeX - leftEdge
		const abstandRechtsRaw = rightEdge - safeX
		const centerY = toFinite(getRoofCenterYAtZ(safeZ), traufhöhe - 4)
		const abstandUntenRaw = centerY - halfHeight - toFinite(y)
		const fallbackLinks = toFinite(obj?.abstandLinks, 0)
		const fallbackRechts = toFinite(obj?.abstandRechts, 0)
		const fallbackUnten = toFinite(obj?.abstandUnten, 0)
		const nextAbstandLinks = quantizeOpeningDistance(abstandLinksRaw)
		const nextAbstandRechts = quantizeOpeningDistance(abstandRechtsRaw)
		const nextAbstandUnten = quantizeOpeningDistance(abstandUntenRaw)
		const distances = {
			abstandLinks: Number.isFinite(nextAbstandLinks) ? nextAbstandLinks : fallbackLinks,
			abstandRechts: Number.isFinite(nextAbstandRechts) ? nextAbstandRechts : fallbackRechts,
			abstandUnten: Number.isFinite(nextAbstandUnten) ? nextAbstandUnten : fallbackUnten
		}

		dispatchOpeningPositionValues(objId, distances)
		persistOpeningPosition({
			objId,
			setObjs,
			setSelectedObject,
			startPos: {
				x: safeX,
				z: safeZ
			},
			distances
		})
	}, [getRoofCenterYAtZ, obj?.abstandLinks, obj?.abstandRechts, obj?.abstandUnten, objId, openingArgs, setObjs, setSelectedObject, traufhöhe, x, xLinks, xRechts, y, z])

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

	const minX = xLinks + (openingArgs[0] / 2) - 0.5
	const maxX = xRechts - (openingArgs[0] / 2) + 0.5
	let minZ = initialMinZ
	let maxZ = initialMaxZ

	const handleClick = () => {
		const found = objs.find(o => o.id === objId)
		if (found) {
			window.activeArrowControl = { kind: 'dach-lichtkuppel', id: objId }
			const current = gridPosiRef.current
			setSelectedObject({
				...found,
				startPos: {
					...(found.startPos ?? {}),
					x: current.x,
					z: current.z
				}
			})
			setEditMenü('Lichtkuppel-Bearbeiten')
		}
	}

	useEffect(() => {
		const hasAbstandLinks = obj?.abstandLinks !== undefined && obj?.abstandLinks !== null
		const hasAbstandRechts = obj?.abstandRechts !== undefined && obj?.abstandRechts !== null

		if (hasAbstandLinks && hasAbstandRechts) return

		persistPosition(gridPosiRef.current)
	}, [obj?.id, obj?.abstandLinks, obj?.abstandRechts, persistPosition])

	useEffect(() => {
		const handleRefreshPosition = (event) => {
			if (event?.detail?.id !== objId) return
			persistPosition(gridPosiRef.current)
		}

		window.addEventListener(OPENING_POSITION_REFRESH_EVENT, handleRefreshPosition)
		return () => window.removeEventListener(OPENING_POSITION_REFRESH_EVENT, handleRefreshPosition)
	}, [objId, persistPosition])

	useEffect(() => {
		const handleKeyDown = (event) => {
			const active = window.activeArrowControl
			if (!active || active.kind !== 'dach-lichtkuppel' || active.id !== objId) return

			const step = OPENING_GRID_STEP
			const current = gridPosiRef.current
			let newX = current.x
			let newZ = current.z

			switch (event.key) {
				case 'ArrowLeft':
					if (vorne) {
						newX = current.x - step
					} else {
						newX = current.x + step
					}
					newX = snapOpeningCoordinate(newX, minX, minX, maxX)
					event.preventDefault()
					break
				case 'ArrowRight':
					if (vorne) {
						newX = current.x + step
					} else {
						newX = current.x - step
					}
					newX = snapOpeningCoordinate(newX, minX, minX, maxX)
					event.preventDefault()
					break
				case 'ArrowUp':
					if (vorne) {
						newZ = current.z - step
					} else {
						newZ = current.z + step
					}
					newZ = snapOpeningCoordinate(newZ, minZ, minZ, maxZ)
					event.preventDefault()
					break
				case 'ArrowDown':
					if (vorne) {
						newZ = current.z + step
					} else {
						newZ = current.z - step
					}
					newZ = snapOpeningCoordinate(newZ, minZ, minZ, maxZ)
					event.preventDefault()
					break
				default:
					return
			}

			const nextPos = { x: newX, z: newZ }
			gridPosiRef.current = nextPos
			setGridPosi(nextPos)
			persistPosition(nextPos)
		}

		window.addEventListener('keydown', handleKeyDown)
		return () => window.removeEventListener('keydown', handleKeyDown)
		}, [objId, minX, maxX, minZ, maxZ, vorne, persistPosition])

	const bind = useDrag(({ delta: [moveX, moveY], first, last }) => {
		const scale = 400 / size.width
		const zScale = 120 / size.height
		const current = gridPosiRef.current

		let newX = vorne
			? current.x + (moveX * scale)
			: current.x - (moveX * scale)
		newX = snapOpeningCoordinate(newX, minX, minX, maxX)

		let newZ = current.z

		if (vorne) {
			newZ = current.z + (moveY * zScale)
		} else {
			newZ = current.z - (moveY * zScale)
		}

		newZ = snapOpeningCoordinate(newZ, minZ, minZ, maxZ)

		const nextPos = { x: newX, z: newZ }
		gridPosiRef.current = nextPos
		setGridPosi(nextPos)

		if (first) {
			window.activeArrowControl = { kind: 'dach-lichtkuppel', id: objId }
			setIsActive(true)
			setOrbitKontrolle(false)
		}

		if (last) {
			persistPosition(nextPos)
			setOrbitKontrolle(true)
		}
	})

	const borderColor = isHovered ? '#5aa7ff' : '#000000'
	const rahmenFarbe = getRahmenFarbe(obj?.farbe)
	const breiteX = openingArgs[0]
	const breiteY = openingArgs[1]
	const basisTiefe = 1
	const unterbauTiefe = 0.10
	const rahmenStärke = Math.max(0.08, Math.min(0.18, Math.min(breiteX, breiteY) * 0.12))
	const innenBreiteX = Math.max(0.12, breiteX - (rahmenStärke * 2))
	const innenBreiteY = Math.max(0.12, breiteY - (rahmenStärke * 2))
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
	const collisionReport = getOpeningCollisionReport({
		selectedObject: obj,
		draftObject: {
			...obj,
			startPos: {
				...(obj?.startPos ?? {}),
				x: finalX,
				z: finalZ
			}
		},
		objs
	})
	const warningColor = collisionReport.hasCollision ? '#d11a2a' : rahmenFarbe
	const warningGlassColor = collisionReport.hasCollision ? '#ff8080' : '#CFF4FF'
	const warningCupColor = collisionReport.hasCollision ? '#ff8080' : '#BFEFFF'
	const warningBorderColor = collisionReport.hasCollision ? '#d11a2a' : borderColor

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
					{/* Rahmen statt Vollplatte, damit die Öffnung frei bleibt */}
					<mesh position={[0, (breiteY / 2) - (rahmenStärke / 2), 0]}>
						<boxGeometry args={[breiteX, rahmenStärke, basisTiefe]} />
						<meshStandardMaterial color={warningColor} metalness={0.3} roughness={0.55} />
					</mesh>

					<mesh position={[0, -(breiteY / 2) + (rahmenStärke / 2), 0]}>
						<boxGeometry args={[breiteX, rahmenStärke, basisTiefe]} />
						<meshStandardMaterial color={warningColor} metalness={0.3} roughness={0.55} />
					</mesh>

					<mesh position={[-(breiteX / 2) + (rahmenStärke / 2), 0, 0]}>
						<boxGeometry args={[rahmenStärke, innenBreiteY, basisTiefe]} />
						<meshStandardMaterial color={warningColor} metalness={0.3} roughness={0.55} />
					</mesh>

					<mesh position={[(breiteX / 2) - (rahmenStärke / 2), 0, 0]}>
						<boxGeometry args={[rahmenStärke, innenBreiteY, basisTiefe]} />
						<meshStandardMaterial color={warningColor} metalness={0.3} roughness={0.55} />
					</mesh>
					
					<mesh position={[0, 0, (basisTiefe / 2) + (unterbauTiefe / 2)]}>
						<boxGeometry args={[innenBreiteX, innenBreiteY, unterbauTiefe]} />
						<meshStandardMaterial
							color={warningGlassColor}
							transparent
							opacity={0.88}
							depthWrite={false}
							side={THREE.DoubleSide}
							metalness={0.1}
							roughness={0.08}
						/>
					</mesh>

					<mesh geometry={pyramidGeometry}>
						<meshStandardMaterial
							color={warningCupColor}
							transparent
							opacity={0.75}
							depthWrite={false}
							side={THREE.DoubleSide}
							metalness={0.1}
							roughness={0.12}
						/>
					</mesh>


				</>
			)}

			{kantenAnzeigen && (
				<>
					<lineSegments>
						<edgesGeometry args={[new THREE.BoxGeometry(breiteX, breiteY, basisTiefe)]} />
						<lineBasicMaterial 
						color={collisionReport.hasCollision ? '#d11a2a' : (isActive ? '#2f6db8' : borderColor)}
						linewidth={2} 
						/>
					</lineSegments>

					<lineSegments position={[0, 0, (basisTiefe / 2) + (unterbauTiefe / 2)]}>
						<edgesGeometry args={[new THREE.BoxGeometry(breiteX - 0.06, breiteY - 0.06, unterbauTiefe)]} />
						<lineBasicMaterial color="#ffffff" linewidth={1} />
					</lineSegments>

					<lineSegments>
						<edgesGeometry args={[pyramidGeometry]} />
						<lineBasicMaterial color={collisionReport.hasCollision ? '#d11a2a' : (isActive ? '#2f6db8' : warningBorderColor)} linewidth={2} />
					</lineSegments>
				</>
			)}
		</group>
	)
}
