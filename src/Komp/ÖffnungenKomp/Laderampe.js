import * as THREE from 'three'
import { useThree } from '@react-three/fiber'
import { useRef, useState, useEffect, useCallback } from 'react'
import { useDrag } from '@use-gesture/react'
import Reflektor from './Reflektor'
import { OPENING_POSITION_REFRESH_EVENT } from './PositionInfoSection'
import { computeWallSideDistances, dispatchOpeningPositionValues, persistOpeningPosition, OPENING_GRID_STEP, quantizeOpeningDistance, resolveOpeningRefreshPosition, shouldSyncOpeningPositionFromProps, snapOpeningCoordinate } from './wallOpeningPositionUtils'
import { getOpeningCollisionReport } from '../openingUtils'

export default function Laderampe({
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
	kantenAnzeigen
}) {
	const obj = objs.find(o => o.id === objId)
	const openingArgs = obj ? [obj.value[0], obj.value[1]] : [3.5, 4.5]
	const skaliertBreite = openingArgs[0] * 2.5
	const skaliertHöhe = openingArgs[1] * 2.5

	const rechts = obj?.rechts ?? true
	const lang = obj?.lang ?? true

	const x = position[0]
	const y = position[1] + (gebäudeHöhe / 6) - 0.4 - ((gebäudeHöhe - 15) / 6) - 2 + ((skaliertHöhe - 1) / 4)

	const zVorne = position[2] + 6.5 + (0.5 * (bodenBreite - 15))
	const zHinten = position[2] - 6.5 - (0.5 * (bodenBreite - 15))
	const z = rechts ? zHinten : zVorne

	const xLinks = position[0] - 6.5 - (0.5 * (bodenLänge - 15))
	const xRechts = position[0] + 6.5 + (0.5 * (bodenLänge - 15))

	const { size } = useThree()
	const groupRef = useRef()

	const initialX = obj?.startPos?.x ?? x
	const initialZ = obj?.startPos?.z ?? position[2]
	const initialY = obj?.startPos?.y ?? y
	const [gridPosi, setGridPosi] = useState({ x: initialX, z: initialZ, y: initialY })
	const gridPosiRef = useRef({ x: initialX, z: initialZ, y: initialY })
	const lastSyncedPropPosRef = useRef({ x: initialX, z: initialZ, y: initialY })
	const isDraggingRef = useRef(false)
	const pendingPropSyncRef = useRef(false)
	const [isHovered, setIsHovered] = useState(false)

	const überdachungBreiteFürGrenzen = skaliertBreite + 0.25
	const halbeLaderampenBreite = überdachungBreiteFürGrenzen / 2
	const randPuffer = 0.1

	const langeWandMin = xLinks - 1
	const langeWandMax = xRechts + 1

	const kurzeWandMin = zHinten - 1
	const kurzeWandMax = zVorne + 1

	const minX = langeWandMin + halbeLaderampenBreite + randPuffer
	const maxX = langeWandMax - halbeLaderampenBreite - randPuffer
	const minZ = kurzeWandMin + halbeLaderampenBreite + randPuffer
	const maxZ = kurzeWandMax - halbeLaderampenBreite - randPuffer

	useEffect(() => {
		gridPosiRef.current = gridPosi
	}, [gridPosi])

	const deferPropSyncUntilNextTick = useCallback(() => {
		pendingPropSyncRef.current = true
		if (typeof window.requestAnimationFrame === 'function') {
			window.requestAnimationFrame(() => {
				pendingPropSyncRef.current = false
			})
			return
		}

		window.setTimeout(() => {
			pendingPropSyncRef.current = false
		}, 0)
	}, [])

	useEffect(() => {
		if (isDraggingRef.current) return
		if (pendingPropSyncRef.current) {
			pendingPropSyncRef.current = false
			return
		}

		const nextPos = {
			x: obj?.startPos?.x ?? initialX,
			z: obj?.startPos?.z ?? initialZ,
			y: obj?.startPos?.y ?? initialY
		}

		if (!shouldSyncOpeningPositionFromProps({ nextPos, lastSyncedPos: lastSyncedPropPosRef.current })) {
			return
		}

		lastSyncedPropPosRef.current = nextPos

		if (
			gridPosiRef.current.x !== nextPos.x ||
			gridPosiRef.current.z !== nextPos.z ||
			gridPosiRef.current.y !== nextPos.y
		) {
			gridPosiRef.current = nextPos
			setGridPosi(nextPos)
		}
	}, [obj?.id, obj?.startPos?.x, obj?.startPos?.y, obj?.startPos?.z, initialX, initialY, initialZ])

	const persistPosition = useCallback((nextPos) => {
		const rawDistances = computeWallSideDistances({
			nextPos,
			lang,
			xLinks,
			xRechts,
			zHinten,
			zVorne,
			halfWidth: halbeLaderampenBreite
		})
		const distances = {
			abstandLinks: quantizeOpeningDistance(rawDistances.abstandLinks),
			abstandRechts: quantizeOpeningDistance(rawDistances.abstandRechts)
		}

		dispatchOpeningPositionValues(objId, distances)
		persistOpeningPosition({
			objId,
			setObjs,
			setSelectedObject,
			startPos: nextPos,
			distances
		})
	}, [halbeLaderampenBreite, lang, objId, setObjs, setSelectedObject, xLinks, xRechts, zHinten, zVorne])

	useEffect(() => {
		const handleRefreshPosition = (event) => {
			if (event?.detail?.id !== objId) return

			const nextPos = resolveOpeningRefreshPosition({
				incoming: event?.detail,
				currentPos: gridPosiRef.current
			})

			if (nextPos) {
				gridPosiRef.current = nextPos
				setGridPosi(nextPos)
				persistPosition(nextPos)
				return
			}

			persistPosition(gridPosiRef.current)
		}

		window.addEventListener(OPENING_POSITION_REFRESH_EVENT, handleRefreshPosition)
		return () => window.removeEventListener(OPENING_POSITION_REFRESH_EVENT, handleRefreshPosition)
	}, [deferPropSyncUntilNextTick, objId, persistPosition])
	const handleClick = () => {
		const found = objs.find(o => o.id === objId)
		if (found) {
			window.activeArrowControl = { kind: 'wand-laderampe', id: objId }
			setSelectedObject(found)
			setEditMenü('Laderampe-Bearbeiten')
		}
	}

	useEffect(() => {
		const handleKeyDown = (event) => {
			const active = window.activeArrowControl
			if (!active || active.kind !== 'wand-laderampe' || active.id !== objId) return

			const stepHorizontal = OPENING_GRID_STEP

			setGridPosi((prev) => {
				let newX = prev.x
				let newZ = prev.z

				switch (event.key) {
					case 'ArrowLeft':
						if (lang) {
							newX = prev.x + (rechts ? stepHorizontal : -stepHorizontal)
							newX = snapOpeningCoordinate(newX, minX, minX, maxX)
						} else {
							newZ = prev.z - (rechts ? stepHorizontal : -stepHorizontal)
							newZ = snapOpeningCoordinate(newZ, minZ, minZ, maxZ)
						}
						event.preventDefault()
						break
					case 'ArrowRight':
						if (lang) {
							newX = prev.x + (rechts ? -stepHorizontal : stepHorizontal)
							newX = snapOpeningCoordinate(newX, minX, minX, maxX)
						} else {
							newZ = prev.z + (rechts ? stepHorizontal : -stepHorizontal)
							newZ = snapOpeningCoordinate(newZ, minZ, minZ, maxZ)
						}
						event.preventDefault()
						break
					default:
						return prev
				}

				return { x: newX, z: newZ, y: prev.y }
			})
		}

		window.addEventListener('keydown', handleKeyDown)
		return () => window.removeEventListener('keydown', handleKeyDown)
	}, [objId, lang, rechts, minX, maxX, minZ, maxZ])

	const bind = useDrag(({ movement: [dragMoveX], first, last, memo }) => {
		const scale = 80 / size.width

		if (first) {
			memo = { startX: gridPosi.x, startZ: gridPosi.z }
		}

		if (lang) {
			const dragMultiplier = rechts ? -1 : 1
			let newX = memo.startX + (dragMultiplier * dragMoveX * scale)
			newX = snapOpeningCoordinate(newX, minX, minX, maxX)
			setGridPosi({ x: newX, z: gridPosi.z, y: gridPosi.y })

			if (first) {
				window.activeArrowControl = { kind: 'wand-laderampe', id: objId }
				setOrbitKontrolle(false)
			}
		} else {
			const dragMultiplier = rechts ? 1 : -1
			let newZ = memo.startZ + (dragMultiplier * dragMoveX * scale)
			newZ = snapOpeningCoordinate(newZ, minZ, minZ, maxZ)
			setGridPosi({ x: gridPosi.x, z: newZ, y: gridPosi.y })

			if (first) {
				window.activeArrowControl = { kind: 'wand-laderampe', id: objId }
				setOrbitKontrolle(false)
			}
		}

		if (last) setOrbitKontrolle(true)

		return memo
	})

	const borderColor = isHovered ? '#5aa7ff' : '#000000'

	const tiefe = 1.5
	const surfaceOffset = tiefe / 2 + 0.05
	const normalSign = rechts ? -1 : 1
	const finalX = lang ? gridPosi.x : (rechts ? xLinks : xRechts) + (!lang ? normalSign * surfaceOffset : 0)
	const finalZ = lang ? z + (lang ? normalSign * surfaceOffset : 0) : gridPosi.z

	const breite = skaliertBreite
	const höhe = skaliertHöhe
	const rampenhöhe = Math.max(0, (obj?.rampenhöhe ?? 0.8) * 2.5)
	const laderampeTyp = obj?.typ ?? 'ladehaus'
	const istLadehaus = laderampeTyp === 'ladehaus'
	const istVerladehütte = laderampeTyp === 'verladehütte'

	const colorMap = {
		Weiß: '#d7d7d7',
		Grau: '#9b9b9b',
		Schwarz: '#2b2b2b'
	}
	const rolltorFarbe = colorMap[obj?.farbe] ?? '#8a8a8a'
	const rolltorFüllFarbe = colorMap[obj?.füllFarbe] ?? '#b8b8b8'
	const reflektorFarbe = colorMap[obj?.reflektorFarbe] ?? colorMap.Weiß
	const umrandungFarbeDunkler = new THREE.Color(rolltorFarbe).multiplyScalar(0.75).getStyle()
    const umrandungFarbeDunkler2 = new THREE.Color(rolltorFarbe).multiplyScalar(0.6).getStyle()

	const finaleY = position[1] + 0.2 + (höhe / 2) + rampenhöhe

	let rotation = [0, 0, 0]
	if (lang && !rechts) rotation = [0, 0, 0]
	if (lang && rechts) rotation = [0, Math.PI, 0]
	if (!lang && rechts) rotation = [0, -Math.PI / 2, 0]
	if (!lang && !rechts) rotation = [0, Math.PI / 2, 0]

	const reflektor = obj?.reflektor ?? 'keine'
	const hatSchlupftür = obj?.schlupftür === 'ja'
	const schlupftürBreite = hatSchlupftür ? ((obj?.schlupftürBreite ?? 1) * 2.5) : 0
	const schlupftürHöheRoh = hatSchlupftür ? ((obj?.schlupftürHöhe ?? 2) * 2.5) : 0
	const schlupftürHöhe = Math.max(0.2, Math.min(höhe - 0.1, schlupftürHöheRoh))
	const schlupftürDistanzX = hatSchlupftür ? ((obj?.schlupftürDistanzX ?? 0) * 2.5) : 0
	const schlupftürMaxDistanzX = Math.max(0.1, (breite - schlupftürBreite) / 2 - 0.1)
	const schlupftürDistanzXBegrenzt = Math.max(-schlupftürMaxDistanzX, Math.min(schlupftürMaxDistanzX, schlupftürDistanzX))
	const schlupftürOrientierung = hatSchlupftür ? (obj?.schlupftürOrientierung ?? 'rechts') : 'rechts'
	const schlupftürXOffset = schlupftürOrientierung === 'rechts' ? schlupftürDistanzXBegrenzt : -schlupftürDistanzXBegrenzt
	const schlupftürRahmenTiefe = 0.077
	const schlupftürRahmenFarbe = '#776c6c'
	const lamellenAnzahl = Math.max(8, Math.min(28, Math.round(höhe / 0.18)))
	const lamellenHöhe = höhe / lamellenAnzahl
	const lamellenTiefe = 0.02
	const laderampenPlatteHöhe = 0.15
	const laderampenBasisTiefe = Math.max(0.05, (obj?.länge ?? 2) * 2.5)
	const rampenAuszugZ = 0
	const laderampenPlatteTiefe = laderampenBasisTiefe + Math.max(0, rampenAuszugZ)
	const laderampenPlatteOffsetZ = (laderampenPlatteTiefe / 2) + 0.02
	const stützenRadius = 0.08
	const stützenHöhe = Math.max(0.35, 0.35 + rampenhöhe)
	const stützenY = -höhe / 2 - (laderampenPlatteHöhe / 2) - 0.1 - (stützenHöhe / 2)
	const stützenX = breite / 2 - stützenRadius - 0.02
	const stützenZ = laderampenPlatteOffsetZ + (laderampenPlatteTiefe / 2) - stützenRadius - 0.02
	const umrandungDicke = 0.12
	const umrandungX = breite / 2 + (umrandungDicke / 2)
	const außenwandVerlängerungNachUnten = istVerladehütte ? rampenhöhe : 0
	const außenwandHöhe = höhe + außenwandVerlängerungNachUnten
	const außenwandY = -(außenwandVerlängerungNachUnten / 2)
	const außenwandAbdeckungDicke = 0.75
	const außenwandAbdeckungHöhe = höhe
	const außenwandAbdeckungTiefe = 0.15
	const außenwandAbdeckungX = umrandungX - (umrandungDicke / 2) - (außenwandAbdeckungDicke / 2)
	const außenwandAbdeckungOffset = 0.1
	const außenwandAbdeckungPosX = außenwandAbdeckungX + außenwandAbdeckungOffset
	const zwischenMeshHöhe = außenwandAbdeckungHöhe / 8
	const zwischenMeshY = (höhe / 2) - (zwischenMeshHöhe / 2)
	const überdachungDicke = 0.12

	const reflektorZ = normalSign * (tiefe / 2 + 0.22)
	const collisionReport = getOpeningCollisionReport({
		selectedObject: obj,
		draftObject: {
			...obj,
			startPos: {
				...(obj?.startPos ?? {}),
				x: finalX,
				y: finaleY,
				z: finalZ
			}
		},
		objs
	})
	const warningColor = collisionReport.hasCollision ? '#d11a2a' : rolltorFarbe
	const warningFillColor = collisionReport.hasCollision ? '#d11a2a' : rolltorFüllFarbe
	const warningDarkColor = collisionReport.hasCollision ? '#d11a2a' : umrandungFarbeDunkler
	const warningDarkColor2 = collisionReport.hasCollision ? '#d11a2a' : umrandungFarbeDunkler2

	return (
		<group
			position={[finalX, finaleY, finalZ]}
			ref={groupRef}
			{...bind()}
			onClick={handleClick}
			onPointerOver={() => setIsHovered(true)}
			onPointerOut={() => setIsHovered(false)}
			rotation={rotation}
		>
			{oberflächenAnzeigen && (
				<>
					<mesh position={[0, 0, 0]}>
						<boxGeometry args={[breite, höhe, tiefe]} />
						<meshStandardMaterial color={warningColor} />
					</mesh>

					{Array.from({ length: lamellenAnzahl }, (_, i) => {
						const yPos = (höhe / 2) - (i * lamellenHöhe) - (lamellenHöhe / 2)
						return (
							<group key={`laderampe-lamelle-${i}`}>
								<mesh position={[0, yPos, tiefe / 2 + 0.02]}>
									<boxGeometry args={[breite - 0.15, lamellenHöhe - 0.02, lamellenTiefe * 0.2]} />
									<meshStandardMaterial color={warningFillColor} />
								</mesh>
								<mesh position={[0, yPos, -tiefe / 2 - 0.02]}>
									<boxGeometry args={[breite - 0.15, lamellenHöhe - 0.02, lamellenTiefe * 0.2]} />
									<meshStandardMaterial color={warningFillColor} />
								</mesh>

								{i < lamellenAnzahl - 1 && (
									<mesh position={[0, yPos - (lamellenHöhe / 2), 0]}>
										<boxGeometry args={[breite - 0.1, 0.01, tiefe + 0.04]} />
										<meshStandardMaterial color="#656565" />
									</mesh>
								)}
							</group>
						)
					})}

					<mesh position={[-breite / 2 + 0.075, 0, 0]}>
						<boxGeometry args={[0.15, höhe, tiefe + 0.1]} />
						<meshStandardMaterial color={warningColor} />
					</mesh>
					<mesh position={[breite / 2 - 0.075, 0, 0]}>
						<boxGeometry args={[0.15, höhe, tiefe + 0.1]} />
						<meshStandardMaterial color={warningColor} />
					</mesh>

					<mesh position={[0, höhe / 2 - 0.075, 0]}>
						<boxGeometry args={[breite, 0.15, tiefe + 0.1]} />
						<meshStandardMaterial color={warningColor} />
					</mesh>

					{/* Schlupftür */}
					{hatSchlupftür && (
						<group position={[schlupftürXOffset, -höhe / 2 + schlupftürHöhe / 2, 0]}>
							{/* Schlupftür Rahmen vorne */}
							<mesh position={[0, schlupftürHöhe / 2, tiefe / 2 + schlupftürRahmenTiefe / 2]}>
								<boxGeometry args={[schlupftürBreite, 0.03, schlupftürRahmenTiefe]} />
								<meshStandardMaterial color={schlupftürRahmenFarbe} />
							</mesh>
							<mesh position={[0, -schlupftürHöhe / 2, tiefe / 2 + schlupftürRahmenTiefe / 2]}>
								<boxGeometry args={[schlupftürBreite, 0.03, schlupftürRahmenTiefe]} />
								<meshStandardMaterial color={schlupftürRahmenFarbe} />
							</mesh>
							<mesh position={[-schlupftürBreite / 2, 0, tiefe / 2 + schlupftürRahmenTiefe / 2]}>
								<boxGeometry args={[0.03, schlupftürHöhe, schlupftürRahmenTiefe]} />
								<meshStandardMaterial color={schlupftürRahmenFarbe} />
							</mesh>
							<mesh position={[schlupftürBreite / 2, 0, tiefe / 2 + schlupftürRahmenTiefe / 2]}>
								<boxGeometry args={[0.03, schlupftürHöhe, schlupftürRahmenTiefe]} />
								<meshStandardMaterial color={schlupftürRahmenFarbe} />
							</mesh>

							{/* Schlupftür Rahmen hinten */}
							<mesh position={[0, schlupftürHöhe / 2, -tiefe / 2 - schlupftürRahmenTiefe / 2]}>
								<boxGeometry args={[schlupftürBreite, 0.03, schlupftürRahmenTiefe]} />
								<meshStandardMaterial color={schlupftürRahmenFarbe} />
							</mesh>
							<mesh position={[0, -schlupftürHöhe / 2, -tiefe / 2 - schlupftürRahmenTiefe / 2]}>
								<boxGeometry args={[schlupftürBreite, 0.03, schlupftürRahmenTiefe]} />
								<meshStandardMaterial color={schlupftürRahmenFarbe} />
							</mesh>
							<mesh position={[-schlupftürBreite / 2, 0, -tiefe / 2 - schlupftürRahmenTiefe / 2]}>
								<boxGeometry args={[0.03, schlupftürHöhe, schlupftürRahmenTiefe]} />
								<meshStandardMaterial color={schlupftürRahmenFarbe} />
							</mesh>
							<mesh position={[schlupftürBreite / 2, 0, -tiefe / 2 - schlupftürRahmenTiefe / 2]}>
								<boxGeometry args={[0.03, schlupftürHöhe, schlupftürRahmenTiefe]} />
								<meshStandardMaterial color={schlupftürRahmenFarbe} />
							</mesh>

							{/* Türklinke */}
							<mesh position={[(schlupftürBreite / 2 - 0.15) * (schlupftürOrientierung === 'rechts' ? 1 : -1), 0, tiefe / 2 + 0.05]}>
								<sphereGeometry args={[0.08, 16, 16]} />
								<meshStandardMaterial color="#C0C0C0" metalness={0.8} roughness={0.2} />
							</mesh>
							<mesh position={[(schlupftürBreite / 2 - 0.15) * (schlupftürOrientierung === 'rechts' ? 1 : -1), 0, -tiefe / 2 - 0.05]}>
								<sphereGeometry args={[0.08, 16, 16]} />
								<meshStandardMaterial color="#C0C0C0" metalness={0.8} roughness={0.2} />
							</mesh>
						</group>
					)}

					{istLadehaus && (
						<>
							{/* Laderampe */}
							<mesh position={[0, -höhe / 2 - (laderampenPlatteHöhe / 2) - 0.1, laderampenPlatteOffsetZ]}>
								<boxGeometry args={[breite, laderampenPlatteHöhe + 0.2, laderampenPlatteTiefe]} />
								<meshStandardMaterial color={warningDarkColor2} />
							</mesh>

							{/* Runde Stützen an den äußeren Rampenecken */}
							<mesh position={[-stützenX, stützenY, stützenZ]}>
								<cylinderGeometry args={[stützenRadius, stützenRadius, stützenHöhe-0.25, 16]} />
								<meshStandardMaterial color={warningColor} />
							</mesh>
							<mesh position={[stützenX, stützenY, stützenZ]}>
								<cylinderGeometry args={[stützenRadius, stützenRadius, stützenHöhe-0.25, 16]} />
								<meshStandardMaterial color={warningColor} />
							</mesh>
						</>
					)}

					{/* Umrandung: nur 2 Seitenwände (kein Boden) */}
					<mesh position={[-umrandungX, außenwandY, laderampenPlatteOffsetZ]}>
						<boxGeometry args={[umrandungDicke, außenwandHöhe, laderampenPlatteTiefe]} />
						<meshStandardMaterial color={warningDarkColor} />
					</mesh>
					<mesh position={[umrandungX, außenwandY, laderampenPlatteOffsetZ]}>
						<boxGeometry args={[umrandungDicke, außenwandHöhe, laderampenPlatteTiefe]} />
						<meshStandardMaterial color={warningDarkColor} />
					</mesh>

                    {/* Schwarze Balken */}
					<mesh position={[-außenwandAbdeckungPosX, 0, laderampenPlatteOffsetZ*2]}>
						<boxGeometry args={[außenwandAbdeckungDicke, außenwandAbdeckungHöhe, außenwandAbdeckungTiefe]} />
						<meshStandardMaterial color={'#363434'} />
					</mesh>
                    <mesh position={[außenwandAbdeckungPosX, 0, laderampenPlatteOffsetZ*2]}>
						<boxGeometry args={[außenwandAbdeckungDicke, außenwandAbdeckungHöhe, außenwandAbdeckungTiefe]} />
						<meshStandardMaterial color={'#363434'} />
					</mesh>

                    {/* Verbindungsstück */}
					<mesh position={[0, zwischenMeshY, laderampenPlatteOffsetZ*2]}>
						<boxGeometry args={[breite+0.2, zwischenMeshHöhe+0.225, außenwandAbdeckungTiefe]} />
						<meshStandardMaterial color={'#363434'} />
					</mesh>

					<mesh position={[0, höhe / 2 + (überdachungDicke / 2), laderampenPlatteOffsetZ]}>
						<boxGeometry args={[breite+0.25, überdachungDicke, laderampenPlatteTiefe]} />
						<meshStandardMaterial color={warningDarkColor} />
					</mesh>

				</>
			)}

			{kantenAnzeigen && (
				<>
					<lineSegments>
						<edgesGeometry attach="geometry" args={[new THREE.BoxGeometry(breite, höhe, tiefe)]} />
						<lineBasicMaterial attach="material" color={borderColor} linewidth={2} />
					</lineSegments>

					<lineSegments position={[-umrandungX, außenwandY, laderampenPlatteOffsetZ]}>
						<edgesGeometry attach="geometry" args={[new THREE.BoxGeometry(umrandungDicke, außenwandHöhe, laderampenPlatteTiefe)]} />
						<lineBasicMaterial attach="material" color={borderColor} linewidth={2} />
					</lineSegments>
					<lineSegments position={[umrandungX, außenwandY, laderampenPlatteOffsetZ]}>
						<edgesGeometry attach="geometry" args={[new THREE.BoxGeometry(umrandungDicke, außenwandHöhe, laderampenPlatteTiefe)]} />
						<lineBasicMaterial attach="material" color={borderColor} linewidth={2} />
					</lineSegments>

					<lineSegments position={[-außenwandAbdeckungPosX, 0, laderampenPlatteOffsetZ * 2]}>
						<edgesGeometry attach="geometry" args={[new THREE.BoxGeometry(außenwandAbdeckungDicke, außenwandAbdeckungHöhe, außenwandAbdeckungTiefe)]} />
						<lineBasicMaterial attach="material" color={borderColor} linewidth={2} />
					</lineSegments>
					<lineSegments position={[außenwandAbdeckungPosX, 0, laderampenPlatteOffsetZ * 2]}>
						<edgesGeometry attach="geometry" args={[new THREE.BoxGeometry(außenwandAbdeckungDicke, außenwandAbdeckungHöhe, außenwandAbdeckungTiefe)]} />
						<lineBasicMaterial attach="material" color={borderColor} linewidth={2} />
					</lineSegments>

					<lineSegments position={[0, zwischenMeshY, laderampenPlatteOffsetZ * 2]}>
						<edgesGeometry attach="geometry" args={[new THREE.BoxGeometry(breite + 0.2, zwischenMeshHöhe + 0.225, außenwandAbdeckungTiefe)]} />
						<lineBasicMaterial attach="material" color={borderColor} linewidth={2} />
					</lineSegments>

					<lineSegments position={[0, höhe / 2 + (überdachungDicke / 2), laderampenPlatteOffsetZ]}>
						<edgesGeometry attach="geometry" args={[new THREE.BoxGeometry(breite + 0.25, überdachungDicke, laderampenPlatteTiefe)]} />
						<lineBasicMaterial attach="material" color={borderColor} linewidth={2} />
					</lineSegments>
				</>
			)}

			{(reflektor === 'klein' || reflektor === 'groß') && (
				<Reflektor
					position={[0, höhe / 2 + 0.72, reflektorZ]}
					breite={reflektor === 'groß' ? 1.0 : 0.7}
					höhe={reflektor === 'groß' ? 0.7 : 0.4}
					farbe={reflektorFarbe}
				/>
			)}
		</group>
	)
}
