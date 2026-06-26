import { Text } from "@react-three/drei"
import { useCallback, useMemo } from "react"

function HöhenSkala({ position, outward, axis, center, istMittelSkala = false }) {
	const meterEinheit = 2.5
	const meterMax = Math.max(1, Math.round(position.höhe / meterEinheit))
	const gesamtHöhe = meterMax * meterEinheit
	const textAbstand = istMittelSkala ? 0.16 : 0.1
	const entlangAbstand = istMittelSkala ? 1.2 : 0.8
	const skalenStärke = istMittelSkala ? 0.04 : 0.025
	const nachInnen = [-outward[0], 0, -outward[2]]
	const textRotationY = nachInnen[2] !== 0
		? (nachInnen[2] > 0 ? 0 : Math.PI)
		: (nachInnen[0] > 0 ? Math.PI / 2 : -Math.PI / 2)
	const lesbareRotationY = textRotationY + Math.PI
	const labelRichtung = istMittelSkala ? 1 : (axis === 'x'
		? (position.x > center.x ? -1 : 1)
		: (position.z > center.z ? -1 : 1))

	return (
		<group>
			<mesh position={[position.x, position.y + gesamtHöhe / 2, position.z]}>
				<boxGeometry args={[skalenStärke, gesamtHöhe, skalenStärke]} />
				<meshBasicMaterial color="#2c3e50" transparent opacity={istMittelSkala ? 0.7 : 0.45} />
			</mesh>

			{Array.from({ length: meterMax + 1 }, (_, meter) => {
				const istFünfer = meter % 5 === 0
				const tickLänge = istFünfer ? 0.75 : 0.35
				const tickX = position.x + outward[0] * (tickLänge / 2)
				const tickY = position.y + meter * meterEinheit
				const tickZ = position.z + outward[2] * (tickLänge / 2)

				return (
					<mesh key={meter} position={[tickX, tickY, tickZ]}>
						<boxGeometry
							args={[
								outward[0] !== 0 ? tickLänge : skalenStärke,
								skalenStärke,
								outward[2] !== 0 ? tickLänge : skalenStärke
							]}
						/>
						<meshBasicMaterial color="#2c3e50" transparent opacity={istMittelSkala ? (istFünfer ? 0.75 : 0.5) : (istFünfer ? 0.55 : 0.35)} />
					</mesh>
				)
			})}

			{Array.from({ length: meterMax }, (_, idx) => {
				const meterWert = idx + 1
				const labelX = position.x + nachInnen[0] * textAbstand + (axis === 'x' ? labelRichtung * entlangAbstand : 0)
				const labelY = position.y + (idx + 0.5) * meterEinheit
				const labelZ = position.z + nachInnen[2] * textAbstand + (axis === 'z' ? labelRichtung * entlangAbstand : 0)

				return (
					<Text
						key={`label-${meterWert}`}
						position={[labelX, labelY, labelZ]}
						fontSize={istMittelSkala ? 1.02 : 0.92}
						color="#2c3e50"
						anchorX="center"
						anchorY="middle"
						rotation={[0, lesbareRotationY, 0]}
					>
						{meterWert}
					</Text>
				)
			})}
		</group>
	)
}

export default function AbmessungenHöhe({ bodenLänge, bodenBreite, gebäudeHöhe, koordinate, editMenü, dachArt, pultdachHöheDifferenz = 0, zusatzHöheMitte = 0 }) {
	const halbLänge = bodenLänge / 2
	const halbBreite = bodenBreite / 2
	const x = koordinate[0]
	const y = koordinate[1] + 0.3
	const z = koordinate[2]
	const extraAbstand = editMenü === 'Felder' ? 1.1 : 0.8
	const istPultdach = dachArt === 'pultdach'
	const istSatteldach = dachArt === 'satteldach'
	const firstHöhe = gebäudeHöhe + zusatzHöheMitte
	const zHinten = z - halbBreite
	const zVorne = z + halbBreite

	const höheFürZ = useCallback((zPosition) => {
		if (!istPultdach) return gebäudeHöhe
		const breite = Math.max(zVorne - zHinten, 0.0001)
		const t = Math.min(1, Math.max(0, (zPosition - zHinten) / breite))
		return gebäudeHöhe + (pultdachHöheDifferenz * t)
	}, [gebäudeHöhe, istPultdach, pultdachHöheDifferenz, zHinten, zVorne])

	const höheFürKurzeSeitenMitte = useCallback((zPosition) => {
		if (istSatteldach) return firstHöhe
		return höheFürZ(zPosition)
	}, [firstHöhe, höheFürZ, istSatteldach])

	const skalen = useMemo(() => ([
		// Vordere Wand (links / rechts)
		{ position: { x: x - halbLänge, y, z: z + halbBreite + extraAbstand, höhe: höheFürZ(z + halbBreite) }, outward: [0, 0, 1], axis: 'x' },
		{ position: { x: x + halbLänge, y, z: z + halbBreite + extraAbstand, höhe: höheFürZ(z + halbBreite) }, outward: [0, 0, 1], axis: 'x' },

		// Hintere Wand (links / rechts)
		{ position: { x: x - halbLänge, y, z: z - halbBreite - extraAbstand, höhe: höheFürZ(z - halbBreite) }, outward: [0, 0, -1], axis: 'x' },
		{ position: { x: x + halbLänge, y, z: z - halbBreite - extraAbstand, höhe: höheFürZ(z - halbBreite) }, outward: [0, 0, -1], axis: 'x' },

		// Linke Wand (hinten / mitte / vorne)
		{ position: { x: x - halbLänge - extraAbstand, y, z: z - halbBreite, höhe: höheFürZ(z - halbBreite) }, outward: [-1, 0, 0], axis: 'z' },
		{ position: { x: x - halbLänge - extraAbstand - 0.45, y, z, höhe: höheFürKurzeSeitenMitte(z) }, outward: [-1, 0, 0], axis: 'z', istMittelSkala: true },
		{ position: { x: x - halbLänge - extraAbstand, y, z: z + halbBreite, höhe: höheFürZ(z + halbBreite) }, outward: [-1, 0, 0], axis: 'z' },

		// Rechte Wand (hinten / mitte / vorne)
		{ position: { x: x + halbLänge + extraAbstand, y, z: z - halbBreite, höhe: höheFürZ(z - halbBreite) }, outward: [1, 0, 0], axis: 'z' },
		{ position: { x: x + halbLänge + extraAbstand + 0.45, y, z, höhe: höheFürKurzeSeitenMitte(z) }, outward: [1, 0, 0], axis: 'z', istMittelSkala: true },
		{ position: { x: x + halbLänge + extraAbstand, y, z: z + halbBreite, höhe: höheFürZ(z + halbBreite) }, outward: [1, 0, 0], axis: 'z' },
	]), [x, y, z, halbLänge, halbBreite, extraAbstand, höheFürKurzeSeitenMitte, höheFürZ])

	return (
		<group>
			{skalen.map((skala, index) => (
				<HöhenSkala key={index} position={skala.position} outward={skala.outward} axis={skala.axis} center={{ x, z }} istMittelSkala={skala.istMittelSkala} />
			))}
		</group>
	)
}
