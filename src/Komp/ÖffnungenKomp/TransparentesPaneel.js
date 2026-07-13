import * as THREE from 'three'
import { useThree } from '@react-three/fiber'
import { useRef, useState, useEffect, useCallback } from 'react'
import { useDrag } from '@use-gesture/react'
import { OPENING_POSITION_REFRESH_EVENT } from './PositionInfoSection'
import { computeBottomDistance, computeWallSideDistances, dispatchOpeningPositionValues, persistOpeningPosition, updateOpeningStartPos, OPENING_GRID_STEP, quantizeOpeningDistance, snapOpeningCoordinate } from './wallOpeningPositionUtils'
import { getOpeningCollisionReport } from '../openingUtils'

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

	const minY = position[1] + 0.35 + (paneelHöhe / 2)
	const maxY = position[1] + 0.2 + wandHöhe - (paneelHöhe / 2) + 0.48

	useEffect(() => {
		gridPosiRef.current = gridPosi
	}, [gridPosi])

	const updateStartPos = useCallback((nextPos) => {
		const surfaceOffset = tiefe / 2 + 0.05
		const normalSign = rechts ? -1 : 1
		const realX = lang ? nextPos.x : (rechts ? xLinks : xRechts) + (!lang ? normalSign * surfaceOffset : 0)
		const realZ = lang ? z + (lang ? normalSign * surfaceOffset : 0) : nextPos.z

		updateOpeningStartPos({
			objId,
			setObjs,
			setSelectedObject,
			startPos: {
				x: realX,
				y: nextPos.y,
				z: realZ
			}
		})
	}, [lang, objId, rechts, setObjs, setSelectedObject, xLinks, xRechts, z])

	const persistPosition = useCallback((nextPos) => {
		const rawDistances = computeWallSideDistances({
				nextPos,
				lang,
				xLinks,
				xRechts,
				zHinten,
				zVorne,
				halfWidth: halbePaneelBreite
			})
		const distances = {
			abstandLinks: quantizeOpeningDistance(rawDistances.abstandLinks),
			abstandRechts: quantizeOpeningDistance(rawDistances.abstandRechts),
			abstandUnten: quantizeOpeningDistance(computeBottomDistance({
				nextPos,
				baseY: position[1],
				halfHeight: paneelHöhe / 2
			}))
		}

		dispatchOpeningPositionValues(objId, distances)
		persistOpeningPosition({
			objId,
			setObjs,
			setSelectedObject,
			startPos: nextPos,
			distances
		})
	}, [halbePaneelBreite, lang, objId, paneelHöhe, position, setObjs, setSelectedObject, xLinks, xRechts, zHinten, zVorne])

	useEffect(() => {
		const hasAbstandLinks = obj?.abstandLinks !== undefined && obj?.abstandLinks !== null
		const hasAbstandRechts = obj?.abstandRechts !== undefined && obj?.abstandRechts !== null
		const hasAbstandUnten = obj?.abstandUnten !== undefined && obj?.abstandUnten !== null

		if (hasAbstandLinks && hasAbstandRechts && hasAbstandUnten) return

		persistPosition(gridPosiRef.current)
	}, [obj?.id, obj?.abstandLinks, obj?.abstandRechts, obj?.abstandUnten, persistPosition])

	useEffect(() => {
		const handleRefreshPosition = (event) => {
			if (event?.detail?.id !== objId) return
			persistPosition(gridPosiRef.current)
		}

		window.addEventListener(OPENING_POSITION_REFRESH_EVENT, handleRefreshPosition)
		return () => window.removeEventListener(OPENING_POSITION_REFRESH_EVENT, handleRefreshPosition)
	}, [objId, persistPosition])

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

			const stepHorizontal = OPENING_GRID_STEP
			const stepVertical = OPENING_GRID_STEP
			const current = gridPosiRef.current
			let newX = current.x
			let newZ = current.z
			let newY = current.y

				switch (event.key) {
					case 'ArrowLeft':
						if (lang) {
							newX = current.x + (rechts ? stepHorizontal : -stepHorizontal)
							newX = snapOpeningCoordinate(newX, minX, minX, maxX)
						} else {
							newZ = current.z - (rechts ? stepHorizontal : -stepHorizontal)
							newZ = snapOpeningCoordinate(newZ, minZ, minZ, maxZ)
						}
						event.preventDefault()
						break
					case 'ArrowRight':
						if (lang) {
							newX = current.x + (rechts ? -stepHorizontal : stepHorizontal)
							newX = snapOpeningCoordinate(newX, minX, minX, maxX)
						} else {
							newZ = current.z + (rechts ? stepHorizontal : -stepHorizontal)
							newZ = snapOpeningCoordinate(newZ, minZ, minZ, maxZ)
						}
						event.preventDefault()
						break
					case 'ArrowUp':
						newY = current.y + stepVertical
						newY = snapOpeningCoordinate(newY, minY, minY, maxY)
						event.preventDefault()
						break
					case 'ArrowDown':
						newY = current.y - stepVertical
						newY = snapOpeningCoordinate(newY, minY, minY, maxY)
						event.preventDefault()
						break
					default:
						return
				}

			const nextPos = { x: newX, z: newZ, y: newY }
			gridPosiRef.current = nextPos
			setGridPosi(nextPos)
			updateStartPos(nextPos)
		}

		window.addEventListener('keydown', handleKeyDown)
		return () => window.removeEventListener('keydown', handleKeyDown)
	}, [objId, lang, rechts, minX, maxX, minZ, maxZ, minY, maxY, updateStartPos])

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
			nextX = snapOpeningCoordinate(memo.startX + (dragMultiplier * dragMoveX * scale), minX, minX, maxX)
		} else {
			const dragMultiplier = rechts ? 1 : -1
			nextZ = snapOpeningCoordinate(memo.startZ + (dragMultiplier * dragMoveX * scale), minZ, minZ, maxZ)
		}

		const yDelta = Math.round(-dragMoveY * scale)
		let nextY = snapOpeningCoordinate(memo.startY + yDelta, minY, minY, maxY)

		const nextPos = { x: nextX, z: nextZ, y: nextY }
		gridPosiRef.current = nextPos
		setGridPosi(nextPos)

		if (first) {
			window.activeArrowControl = { kind: 'wand-transparentespaneel', id: objId }
			setOrbitKontrolle(false)
		}

		if (last) {
			updateStartPos(nextPos)
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
	const collisionReport = getOpeningCollisionReport({
		selectedObject: obj,
		draftObject: {
			...obj,
			startPos: {
				...(obj?.startPos ?? {}),
				x: finalX,
				y: finalY,
				z: finalZ
			}
		},
		objs
	})
	const warningGlassColor = collisionReport.hasCollision ? '#ff8080' : '#BFEFFF'
	const warningFrameColor = collisionReport.hasCollision ? '#d11a2a' : '#9fd3e6'

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
							color={warningGlassColor}
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
							color={warningGlassColor}
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
									<meshStandardMaterial color={warningFrameColor} />
								</mesh>
								<mesh position={[clampedX, 0, -tiefe / 2 - 0.04]}>
									<boxGeometry args={[0.05, höhe - 0.08, 0.05]} />
									<meshStandardMaterial color={warningFrameColor} />
								</mesh>
							</group>
						)
					})}

					{/* Außenrahmen */}
					<mesh position={[0, höhe / 2 - 0.04, 0]}>
						<boxGeometry args={[breite, 0.08, tiefe + 0.05]} />
						<meshStandardMaterial color={warningFrameColor} />
					</mesh>
					<mesh position={[0, -höhe / 2 + 0.04, 0]}>
						<boxGeometry args={[breite, 0.08, tiefe + 0.05]} />
						<meshStandardMaterial color={warningFrameColor} />
					</mesh>
					<mesh position={[-breite / 2 + 0.04, 0, 0]}>
						<boxGeometry args={[0.08, höhe, tiefe + 0.05]} />
						<meshStandardMaterial color={warningFrameColor} />
					</mesh>
					<mesh position={[breite / 2 - 0.04, 0, 0]}>
						<boxGeometry args={[0.08, höhe, tiefe + 0.05]} />
						<meshStandardMaterial color={warningFrameColor} />
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
