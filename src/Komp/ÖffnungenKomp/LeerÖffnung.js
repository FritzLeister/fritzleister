import * as THREE from 'three'
import { useThree } from '@react-three/fiber'
import { useRef, useState, useEffect, useCallback } from 'react'
import { useDrag } from '@use-gesture/react'
import { OPENING_POSITION_REFRESH_EVENT } from './PositionInfoSection'
import { computeBottomDistance, computeWallSideDistances, dispatchOpeningPositionValues, persistOpeningPosition, updateOpeningStartPos, OPENING_GRID_STEP, quantizeOpeningDistance, snapOpeningCoordinate } from './wallOpeningPositionUtils'

// Transparente Öffnung für Wände (long-side aktuell)
export default function LeerÖffnung({
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
	pultdachHöheDifferenz = 0
}) {
	const obj = objs.find(o => o.id === objId)
	const openingArgs = obj ? [obj.value[0], obj.value[1]] : [12, 8]

	const rechts = obj?.rechts ?? true // true = Rückseite, false = Vorderseite
	const lang = obj?.lang ?? true // true = lange Wand, false = kurze Wand
	const skaliertBreite = openingArgs[0] * 2.5
	const skaliertHöhe = openingArgs[1] * 2.5

	const x = position[0]
	//const y = position[1] + (gebäudeHöhe / 6) - 0.4 - ((gebäudeHöhe - 15) / 6) - 2 + ((openingArgs[1] - 1) / 4)
	const y = position[1] + (skaliertHöhe / 2)
	
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
	const initialY = obj?.startPos?.y ?? y
	const [gridPosi, setGridPosi] = useState({ x: initialX, z: initialZ, y: initialY })
	const gridPosiRef = useRef({ x: initialX, z: initialZ, y: initialY })
	const [isHovered, setIsHovered] = useState(false)

	const höhe = skaliertHöhe
	const halbeBreite = skaliertBreite / 2
	const randPuffer = 0.1

	const langeWandMin = xLinks
	const langeWandMax = xRechts

	const kurzeWandMin = zHinten
	const kurzeWandMax = zVorne

	// Grenzen für lange Wände (X-Achse)
	const minX = langeWandMin + halbeBreite + randPuffer
	const maxX = langeWandMax - halbeBreite - randPuffer

	// Grenzen für kurze Wände (Z-Achse)
	const minZ = kurzeWandMin + halbeBreite + randPuffer
	const maxZ = kurzeWandMax - halbeBreite - randPuffer

	const wandUnterkante = position[1]
	const wandOberkanteBasis = position[1] + gebäudeHöhe + 0.35
	const wandOberkante = dachArt === 'pultdach' && !rechts
		? wandOberkanteBasis + pultdachHöheDifferenz
		: wandOberkanteBasis
	const minYRaw = wandUnterkante + (höhe / 2)
	const maxYRaw = wandOberkante - (höhe / 2)
	const hatValidenYBereich = maxYRaw - minYRaw >= 0.25
	const minY = hatValidenYBereich ? minYRaw : (wandUnterkante + wandOberkante) / 2
	const maxY = hatValidenYBereich ? maxYRaw : (wandUnterkante + wandOberkante) / 2

	const handleClick = () => {
		const found = objs.find(o => o.id === objId)
		if (found) {
			window.activeArrowControl = { kind: 'wand-leeroeffnung', id: objId }
			setSelectedObject(found)
			setEditMenü('LeerÖffnung-Bearbeiten')
		}
	}

	useEffect(() => {
		gridPosiRef.current = gridPosi
	}, [gridPosi])

	const updateStartPos = useCallback((nextPos) => {
		updateOpeningStartPos({
			objId,
			setObjs,
			setSelectedObject,
			startPos: {
				x: lang ? nextPos.x : (rechts ? xLinks : xRechts),
				y: nextPos.y,
				z: lang ? z : nextPos.z
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
				halfWidth: halbeBreite
			})
		const distances = {
			abstandLinks: quantizeOpeningDistance(rawDistances.abstandLinks),
			abstandRechts: quantizeOpeningDistance(rawDistances.abstandRechts),
			abstandUnten: quantizeOpeningDistance(computeBottomDistance({
				nextPos,
				baseY: position[1],
				halfHeight: höhe / 2
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
	}, [halbeBreite, höhe, lang, objId, position, setObjs, setSelectedObject, xLinks, xRechts, zHinten, zVorne])

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

	useEffect(() => {
		const handleKeyDown = (event) => {
			const active = window.activeArrowControl
			if (!active || active.kind !== 'wand-leeroeffnung' || active.id !== objId) return

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
		const scale = 100 / size.width
		const scaleY = 100 / size.height

		if (first) {
			memo = { startX: gridPosi.x, startZ: gridPosi.z, startY: gridPosi.y }
		}

		let newY = snapOpeningCoordinate(memo.startY - (dragMoveY * scaleY), minY, minY, maxY)
		let nextPos = { x: gridPosi.x, z: gridPosi.z, y: newY }

		if (lang) {
			// Lange Wand: X-Achse bewegen (Richtung abhängig von rechts)
			const dragMultiplier = rechts ? -1 : 1
			let newX = snapOpeningCoordinate(memo.startX + (dragMultiplier * dragMoveX * scale), minX, minX, maxX)
			nextPos = { x: newX, z: gridPosi.z, y: newY }
			setGridPosi(nextPos)

			if (first) {
				window.activeArrowControl = { kind: 'wand-leeroeffnung', id: objId }
				setOrbitKontrolle(false)
				const dir = rechts ? -1 : 1
				camera.position.set(0, 40, dir * 180)
			}
		} else {
			// Kurze Wand: Z-Achse bewegen (Richtung abhängig von rechts)
			const dragMultiplier = rechts ? 1 : -1
			let newZ = snapOpeningCoordinate(memo.startZ + (dragMultiplier * dragMoveX * scale), minZ, minZ, maxZ)
			nextPos = { x: gridPosi.x, z: newZ, y: newY }
			setGridPosi(nextPos)

			if (first) {
				window.activeArrowControl = { kind: 'wand-leeroeffnung', id: objId }
				setOrbitKontrolle(false)
				const dir = rechts ? -1 : 1
				camera.position.set(dir * 180, 40, 0)
			}
		}

		if (last) {
			updateStartPos(nextPos)
			setOrbitKontrolle(true)
		}

		return memo
	})

	const borderColor = isHovered ? '#5aa7ff' : '#000000'

	// Finale Position basierend auf Wandtyp
	const finalX = lang ? gridPosi.x : (rechts ? xLinks : xRechts)
	const finalZ = lang ? z : gridPosi.z
	const finalY = gridPosi.y

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
			{/* halbtransparentes Glas - durchsichtige Öffnung */}
			{oberflächenAnzeigen && (
			<mesh position={[0, 0, 0]}>
				<boxGeometry args={[skaliertBreite, skaliertHöhe, 1]} />
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
				<edgesGeometry attach="geometry" args={[new THREE.BoxGeometry(skaliertBreite, skaliertHöhe, 1)]} />
				<lineBasicMaterial attach="material" color={borderColor} linewidth={2} />
			</lineSegments>
			)}
		</group>
	)
}
