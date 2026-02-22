import * as THREE from 'three'
import { useThree } from '@react-three/fiber'
import { useRef, useState, useEffect } from 'react'
import { useDrag } from '@use-gesture/react'
import Reflektor from './Reflektor'

// Rolltor für Wände – mit Lamellen, Rollkasten und Motor
export default function RollTor({
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
	pultdachHöheDifferenz = 0
}) {
	const obj = objs.find(o => o.id === objId)
	const openingArgs = obj ? [obj.value[0], obj.value[1]] : [3, 3]
	const torBreite = openingArgs[0]
	const torHöhe = openingArgs[1]

	const rechts = obj?.rechts ?? true
	const lang = obj?.lang ?? true

	const x = position[0]
	const y = position[1] + (gebäudeHöhe / 6) - 0.4 - ((gebäudeHöhe - 15) / 6) - 2 + ((openingArgs[1] - 1) / 4)

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
	const initialY = obj?.startPos?.y ?? y
	const [gridPosi, setGridPosi] = useState({ x: initialX, z: initialZ, y: initialY })
	const [isHovered, setIsHovered] = useState(false)

	const skaliertBreite = openingArgs[0] * 2.5
	const skaliertHöhe = openingArgs[1] * 2.5
	const rollkastenBreiteFürGrenzen = skaliertBreite + 0.3
	const motorBreiteFürGrenzen = 0.26
	const halbeRolltorBreite = Math.max(
		skaliertBreite / 2,
		rollkastenBreiteFürGrenzen / 2 + motorBreiteFürGrenzen - 0.02
	)
	const randPuffer = 0.1

	const langeWandMin = xLinks - 1
	const langeWandMax = xRechts + 1

	const kurzeWandMin = zHinten - 1
	const kurzeWandMax = zVorne + 1

	const minX = langeWandMin + halbeRolltorBreite + randPuffer
	const maxX = langeWandMax - halbeRolltorBreite - randPuffer
	const minZ = kurzeWandMin + halbeRolltorBreite + randPuffer
	const maxZ = kurzeWandMax - halbeRolltorBreite - randPuffer
	const minY = position[1] + (skaliertHöhe / 2) + 0.5 - 4
	const maxY = position[1] + wandHöhe - (skaliertHöhe / 2) - 1 - 4 + 1

	const handleClick = () => {
		const found = objs.find(o => o.id === objId)
		if (found) {
			window.activeArrowControl = { kind: 'wand-rolltor', id: objId }
			setSelectedObject(found)
			setEditMenü('Rolltor-Bearbeiten')
		}
	}

	useEffect(() => {
		const handleKeyDown = (event) => {
			const active = window.activeArrowControl
			if (!active || active.kind !== 'wand-rolltor' || active.id !== objId) return

			const stepHorizontal = 3

			setGridPosi((prev) => {
				let newX = prev.x
				let newZ = prev.z

				switch (event.key) {
					case 'ArrowLeft':
						if (lang) {
							newX = prev.x + (rechts ? stepHorizontal : -stepHorizontal)
							newX = Math.max(minX, Math.min(maxX, newX))
						} else {
							newZ = prev.z - (rechts ? stepHorizontal : -stepHorizontal)
							newZ = Math.max(minZ, Math.min(maxZ, newZ))
						}
						event.preventDefault()
						break
					case 'ArrowRight':
						if (lang) {
							newX = prev.x + (rechts ? -stepHorizontal : stepHorizontal)
							newX = Math.max(minX, Math.min(maxX, newX))
						} else {
							newZ = prev.z + (rechts ? stepHorizontal : -stepHorizontal)
							newZ = Math.max(minZ, Math.min(maxZ, newZ))
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
			let newX = Math.round(memo.startX + (dragMultiplier * dragMoveX * scale))
			newX = Math.max(minX, Math.min(maxX, newX))
			setGridPosi({ x: newX, z: gridPosi.z, y: gridPosi.y })

			if (first) {
				window.activeArrowControl = { kind: 'wand-rolltor', id: objId }
				setOrbitKontrolle(false)
			}
		} else {
			const dragMultiplier = rechts ? 1 : -1
			let newZ = Math.round(memo.startZ + (dragMultiplier * dragMoveX * scale))
			newZ = Math.max(minZ, Math.min(maxZ, newZ))
			setGridPosi({ x: gridPosi.x, z: newZ, y: gridPosi.y })

			if (first) {
				window.activeArrowControl = { kind: 'wand-rolltor', id: objId }
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
	const finalY = position[1] + 0.2 + (höhe / 2)

	const colorMap = {
		Weiß: '#d7d7d7',
		Grau: '#9b9b9b',
		Schwarz: '#2b2b2b'
	}
	const rolltorFarbe = colorMap[obj?.rolltorFarbe ?? obj?.farbe] ?? '#8a8a8a'
	const rolltorFüllFarbe = colorMap[obj?.rolltorFüllFarbe ?? obj?.füllFarbe] ?? '#b8b8b8'
	const reflektorFarbe = colorMap[obj?.reflektorFarbe] ?? colorMap.Weiß
	const reflektorValueRaw = obj?.reflektor ?? obj?.rolltorReflektor ?? 'keine'
	const reflektorValue = String(reflektorValueRaw).toLowerCase()
	const hatReflektor = reflektorValue === 'klein' || reflektorValue === 'groß' || reflektorValue === 'gross'

	const öffnet = obj?.öffnet ?? 'innen'
	const motorPlatzierung = obj?.motorPlatzierung ?? 'rechts'

	const lamellenAnzahl = Math.max(8, Math.min(28, Math.round(höhe / 0.18)))
	const lamellenHöhe = höhe / lamellenAnzahl
	const lamellenTiefe = 0.18

	const rollkastenBreite = breite + 0.3
	const rollkastenHöhe = 0.55
	const rollkastenTiefe = 0.45
	const rollkastenSign = öffnet === 'außen' ? 1 : -1
	const rollkastenZ = rollkastenSign * (tiefe / 2 + rollkastenTiefe / 2 + 0.05)
	const rollkastenFeinOffset = öffnet === 'innen' ? 0.35 : -0.35
	const rollkastenFinalZ = rollkastenZ + rollkastenFeinOffset
	const rollkastenY = höhe / 2 + rollkastenHöhe / 2 - 0.02
	const reflektorZ = tiefe / 2 + 0.22

	const motorBreite = 0.26
	const motorHöhe = 0.32
	const motorTiefe = 0.26
	const motorX = motorPlatzierung === 'links'
		? -rollkastenBreite / 2 - motorBreite / 2 + 0.02
		: rollkastenBreite / 2 + motorBreite / 2 - 0.02

	let rolltorRotation = [0, 0, 0]
	if (lang && rechts) rolltorRotation = [0, Math.PI, 0]
	if (!lang && rechts) rolltorRotation = [0, -Math.PI / 2, 0]
	if (!lang && !rechts) rolltorRotation = [0, Math.PI / 2, 0]

	return (
		<group
			position={[finalX, finalY, finalZ]}
			ref={groupRef}
			{...bind()}
			onClick={handleClick}
			onPointerOver={() => setIsHovered(true)}
			onPointerOut={() => setIsHovered(false)}
			rotation={rolltorRotation}
		>
			{oberflächenAnzeigen && (
				<>
					{/* Tor-Hintergrund */}
					<mesh position={[0, 0, 0]}>
						<boxGeometry args={[breite, höhe, tiefe]} />
						<meshStandardMaterial color={rolltorFarbe} />
					</mesh>

					{/* Lamellen */}
					{Array.from({ length: lamellenAnzahl }, (_, i) => {
						const yPos = (höhe / 2) - (i * lamellenHöhe) - (lamellenHöhe / 2)

						return (
							<group key={`lamelle-${i}`}>
								<mesh position={[0, yPos, tiefe / 2 + 0.02]}>
									<boxGeometry args={[breite - 0.15, lamellenHöhe - 0.02, lamellenTiefe * 0.2]} />
									<meshStandardMaterial color={rolltorFüllFarbe} />
								</mesh>
								<mesh position={[0, yPos, -tiefe / 2 - 0.02]}>
									<boxGeometry args={[breite - 0.15, lamellenHöhe - 0.02, lamellenTiefe * 0.2]} />
									<meshStandardMaterial color={rolltorFüllFarbe} />
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

					{/* Führungsschienen links/rechts */}
					<mesh position={[-breite / 2 + 0.075, 0, 0]}>
						<boxGeometry args={[0.15, höhe, tiefe + 0.1]} />
						<meshStandardMaterial color={rolltorFarbe} />
					</mesh>
					<mesh position={[breite / 2 - 0.075, 0, 0]}>
						<boxGeometry args={[0.15, höhe, tiefe + 0.1]} />
						<meshStandardMaterial color={rolltorFarbe} />
					</mesh>

					{/* Oberer Abschluss */}
					<mesh position={[0, höhe / 2 - 0.075, 0]}>
						<boxGeometry args={[breite, 0.15, tiefe + 0.1]} />
						<meshStandardMaterial color={rolltorFarbe} />
					</mesh>

					{/* Rollkasten (innen/außen) */}
					<mesh position={[0, rollkastenY, rollkastenFinalZ]}>
						<boxGeometry args={[rollkastenBreite, rollkastenHöhe, rollkastenTiefe]} />
						<meshStandardMaterial color={rolltorFarbe} />
					</mesh>

					{/* Motor links/rechts */}
					<mesh position={[motorX, rollkastenY, rollkastenFinalZ]}>
						<boxGeometry args={[motorBreite, motorHöhe, motorTiefe]} />
						<meshStandardMaterial color="#7a7a7a" />
					</mesh>
				</>
			)}

			{kantenAnzeigen && (
				<>
					<lineSegments>
						<edgesGeometry attach="geometry" args={[new THREE.BoxGeometry(breite, höhe, tiefe)]} />
						<lineBasicMaterial attach="material" color={borderColor} linewidth={2} />
					</lineSegments>

					<lineSegments position={[0, rollkastenY, rollkastenFinalZ]}>
						<edgesGeometry attach="geometry" args={[new THREE.BoxGeometry(rollkastenBreite, rollkastenHöhe, rollkastenTiefe)]} />
						<lineBasicMaterial attach="material" color={borderColor} linewidth={2} />
					</lineSegments>

					<lineSegments position={[motorX, rollkastenY, rollkastenFinalZ]}>
						<edgesGeometry attach="geometry" args={[new THREE.BoxGeometry(motorBreite, motorHöhe, motorTiefe)]} />
						<lineBasicMaterial attach="material" color={borderColor} linewidth={2} />
					</lineSegments>
				</>
			)}

			{hatReflektor && (
				<Reflektor
					position={[0, höhe / 2 + 0.72, reflektorZ]}
					breite={reflektorValue === 'groß' || reflektorValue === 'gross' ? 1.0 : 0.7}
					höhe={reflektorValue === 'groß' || reflektorValue === 'gross' ? 0.7 : 0.4}
					farbe={reflektorFarbe}
				/>
			)}
		</group>
	)
}
