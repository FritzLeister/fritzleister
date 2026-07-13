import { useState } from "react"
import MuiNumberfield from "../MuiNumberfield"
import MuiSelect from "../MuiSelect"
import PositionInfoSection, { useOpeningPositionDisplay } from "./PositionInfoSection"
import { getOpeningCollisionReport } from "../openingUtils"

export default function SchiebeTürBearbeiten({
	selectedObject,
	setEditMenü,
	objs,
	setObjs,
	gebäudeHöhe,
	gebäudeBreite,
	gebäudeLänge
}) {
	const [schiebetürBreite, setSchiebetürBreite] = useState(selectedObject?.value?.[0] ?? 2)
	const [schiebetürHöhe, setSchiebetürHöhe] = useState(selectedObject?.value?.[1] ?? 2.1)
	const [schiebetürSchienenFarbe, setSchiebetürSchienenFarbe] = useState(selectedObject?.schiebetürSchienenFarbe ?? selectedObject?.schienenFarbe ?? 'Grau')
	const [schiebetürFüllFarbe, setSchiebetürFüllFarbe] = useState(selectedObject?.schiebetürFüllFarbe ?? selectedObject?.füllFarbe ?? 'Weiß')
	const [schiebetürFüllFarbeInnen, setSchiebetürFüllFarbeInnen] = useState(selectedObject?.schiebetürFüllFarbeInnen ?? selectedObject?.schiebetürFüllFarbe ?? selectedObject?.füllFarbe ?? 'Weiß')
	const istLangeWand = selectedObject?.lang ?? true
	const maxSchiebetürBreite = istLangeWand ? gebäudeLänge : gebäudeBreite
	const maxSchiebetürHöhe = gebäudeHöhe
	const maxAbstand = istLangeWand ? gebäudeLänge : gebäudeBreite
	const [abstandLinks] = useState(selectedObject?.abstandLinks ?? 0)
	const [abstandRechts] = useState(selectedObject?.abstandRechts ?? 0)
	const positionFields = [
		{ key: 'abstandLinks', label: 'Abstand Links', hint: 'Per Button aktualisieren' },
		{ key: 'abstandRechts', label: 'Abstand Rechts', hint: 'Per Button aktualisieren' }
	]
	const { displayValues, handleRefreshPosition } = useOpeningPositionDisplay(selectedObject, positionFields)

	const clampValue = (value, min, max) => {
		const num = Number(value)
		if (Number.isNaN(num)) return min
		return Math.min(Math.max(num, min), max)
	}

	const draftObject = selectedObject ? {
		...selectedObject,
		value: [
			clampValue(schiebetürBreite, 0.5, maxSchiebetürBreite),
			clampValue(schiebetürHöhe, 0.2, maxSchiebetürHöhe)
		],
		schiebetürSchienenFarbe,
		schiebetürFüllFarbe,
		schiebetürFüllFarbeInnen,
		abstandLinks: clampValue(displayValues.abstandLinks ?? abstandLinks, 0, maxAbstand),
		abstandRechts: clampValue(displayValues.abstandRechts ?? abstandRechts, 0, maxAbstand),
	} : null
	const collisionReport = getOpeningCollisionReport({ selectedObject, draftObject, objs })

	const handleUpdate = () => {
		if (!selectedObject) return
		if (collisionReport.hasCollision) {
			window.alert(collisionReport.message)
			return
		}
		handleRefreshPosition()
		const geklemmteSchiebetürBreite = clampValue(schiebetürBreite, 0.5, maxSchiebetürBreite)
		const geklemmteSchiebetürHöhe = clampValue(schiebetürHöhe, 0.2, maxSchiebetürHöhe)
		const sichererAbstandLinks = clampValue(displayValues.abstandLinks ?? abstandLinks, 0, maxAbstand)
		const sichererAbstandRechts = clampValue(displayValues.abstandRechts ?? abstandRechts, 0, maxAbstand)

		setObjs(objs => objs.map(obj =>
			obj.id === selectedObject.id
				? {
					...obj,
					value: [geklemmteSchiebetürBreite, geklemmteSchiebetürHöhe],
					schiebetürSchienenFarbe,
					schiebetürFüllFarbe,
					schiebetürFüllFarbeInnen,
					abstandLinks: sichererAbstandLinks,
					abstandRechts: sichererAbstandRechts
				}
				: obj
		))
		setEditMenü(null)
	}

	const handleDelete = () => {
		if (!selectedObject) return
		setObjs(objs => objs.filter(obj => obj.id !== selectedObject.id))
		setEditMenü(null)
	}

	return (
		<div style={{
			position: "fixed",
			top: 455,
			right: 20,
			background: "rgba(255, 255, 255, 0.15)",
			backdropFilter: "blur(10px)",
			WebkitBackdropFilter: "blur(10px)",
			borderRadius: 12,
			boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
			color: "#000000ff",
			width: 420,
			maxHeight: 'calc(100vh - 470px)',
			overflowY: 'scroll',
			WebkitOverflowScrolling: 'touch',
			padding: "15px",
			border: "1px solid rgba(255, 255, 255, 0.2)",
			zIndex: 999,
			boxSizing: 'border-box'
		}}>
			<div style={{
				margin: "8px",
				paddingBottom: "4px",
				borderBottom: "1px solid rgba(0, 0, 0, 0.2)",
			}}>
				<p className='text' style={{ fontSize: 17 }}>
					Schiebetür Anpassen
				</p>
			</div>

			<div style={{ margin: '10px', marginTop: '8px', marginRight: '12px' }}>
				<PositionInfoSection fields={positionFields} values={displayValues} onRefresh={handleRefreshPosition} warningMessage={collisionReport.hasCollision ? collisionReport.message : ''} />

				<p className='text' style={{ fontSize: 13, marginBottom: "6px" }}>Abmessungen:</p>

				<div style={{
					display: 'flex',
					gap: '10px',
					alignItems: 'center',
					marginBottom: "10px",
					justifyContent: 'space-between',
					marginRight: "10px"
				}}>
					<div style={{ display: 'flex', flexDirection: 'column' }}>
						<span className='text' style={{ fontWeight: 200 }}>Breite</span>
						<span className='text' style={{ fontSize: 12 }}>0.5-{maxSchiebetürBreite}</span>
					</div>
					<MuiNumberfield
						label={'m'}
						min={0.5}
						max={maxSchiebetürBreite}
						state={schiebetürBreite}
						setState={setSchiebetürBreite}
					/>
				</div>

				<div style={{
					display: 'flex',
					gap: '10px',
					alignItems: 'center',
					marginBottom: "14px",
					justifyContent: 'space-between',
					marginRight: "10px"
				}}>
					<div style={{ display: 'flex', flexDirection: 'column' }}>
						<span className='text' style={{ fontWeight: 200 }}>Höhe</span>
						<span className='text' style={{ fontSize: 12 }}>0.2-{maxSchiebetürHöhe}</span>
					</div>
					<MuiNumberfield
						label={'m'}
						min={0.2}
						max={maxSchiebetürHöhe}
						state={schiebetürHöhe}
						setState={setSchiebetürHöhe}
					/>
				</div>

				{/*
				<div style={{
					display: 'flex',
					gap: '10px',
					alignItems: 'center',
					marginBottom: "10px",
					justifyContent: 'space-between',
					marginRight: "10px"
				}}>
					<div style={{ display: 'flex', flexDirection: 'column' }}>
						<span className='text' style={{ fontWeight: 200 }}>Abstand Links</span>
						<span className='text' style={{ fontSize: 12 }}>Mitte bis Wandrand</span>
					</div>
					<MuiNumberfield
						label={'m'}
						min={0}
						max={maxAbstand}
						state={abstandLinks}
						setState={setAbstandLinks}
					/>
				</div>

				<div style={{
					display: 'flex',
					gap: '10px',
					alignItems: 'center',
					marginBottom: "14px",
					justifyContent: 'space-between',
					marginRight: "10px"
				}}>
					<div style={{ display: 'flex', flexDirection: 'column' }}>
						<span className='text' style={{ fontWeight: 200 }}>Abstand Rechts</span>
						<span className='text' style={{ fontSize: 12 }}>Mitte bis Wandrand</span>
					</div>
					<MuiNumberfield
						label={'m'}
						min={0}
						max={maxAbstand}
						state={abstandRechts}
						setState={setAbstandRechts}
					/>
				</div>
				*/}

				<p className='text' style={{ fontSize: 13, marginBottom: "6px" }}>Farben:</p>

				<div style={{
					display: 'flex',
					gap: '10px',
					alignItems: 'center',
					marginBottom: "10px",
					justifyContent: 'space-between',
					marginRight: "10px",
				}}>
					<span className='text' style={{ fontWeight: 200 }}>Rahmen</span>
					<MuiSelect
						option1={'Weiß'}
						value1={'Weiß'}
						option2={'Grau'}
						value2={'Grau'}
						option3={'Schwarz'}
						value3={'Schwarz'}
						label={'Farbe'}
						state={schiebetürSchienenFarbe}
						setState={setSchiebetürSchienenFarbe}
					/>
				</div>

				<div style={{
					display: 'flex',
					gap: '10px',
					alignItems: 'center',
					marginBottom: "10px",
					justifyContent: 'space-between',
					marginRight: "10px",
				}}>
					<span className='text' style={{ fontWeight: 200 }}>Blätter außen</span>
					<MuiSelect
						option1={'Weiß'}
						value1={'Weiß'}
						option2={'Grau'}
						value2={'Grau'}
						option3={'Schwarz'}
						value3={'Schwarz'}
						label={'Farbe'}
						state={schiebetürFüllFarbe}
						setState={setSchiebetürFüllFarbe}
					/>
				</div>

				<div style={{
					display: 'flex',
					gap: '10px',
					alignItems: 'center',
					marginBottom: "14px",
					justifyContent: 'space-between',
					marginRight: "10px",
				}}>
					<span className='text' style={{ fontWeight: 200 }}>Blätter innen</span>
					<MuiSelect
						option1={'Weiß'}
						value1={'Weiß'}
						option2={'Grau'}
						value2={'Grau'}
						option3={'Schwarz'}
						value3={'Schwarz'}
						label={'Farbe'}
						state={schiebetürFüllFarbeInnen}
						setState={setSchiebetürFüllFarbeInnen}
					/>
				</div>

				{/* Buttons */}
				<div style={{
					display: 'flex',
					gap: '10px',
					justifyContent: 'space-between',
					marginTop: '20px'
				}}>
					<button
						onClick={() => setEditMenü(null)}
						style={{
							flex: 1,
							padding: '8px 12px',
							borderRadius: '6px',
							border: '1px solid rgba(0,0,0,0.2)',
							backgroundColor: 'rgba(200, 200, 200, 0.3)',
							color: 'black',
							cursor: 'pointer',
							fontWeight: 500,
							fontSize: '14px',
							transition: 'all 0.2s'
						}}
						onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(150, 150, 150, 0.4)'}
						onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(200, 200, 200, 0.3)'}
					>
						Abbrechen
					</button>
					<button
						onClick={handleUpdate}
						style={{
							flex: 1,
							padding: '8px 12px',
							borderRadius: '6px',
							border: '1px solid rgba(0,0,0,0.2)',
							backgroundColor: 'rgba(100, 180, 100, 0.5)',
							color: 'white',
							cursor: 'pointer',
							fontWeight: 500,
							fontSize: '14px',
							transition: 'all 0.2s'
						}}
						onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(80, 160, 80, 0.7)'}
						onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(100, 180, 100, 0.5)'}
					>
						Speichern
					</button>
				</div>

				<div style={{
					display: 'flex',
					gap: '10px',
					justifyContent: 'center',
					marginTop: '12px'
				}}>
					<button
						onClick={handleDelete}
						style={{
							flex: 1,
							padding: '8px 12px',
							borderRadius: '6px',
							border: '1px solid rgba(0,0,0,0.2)',
							backgroundColor: 'rgba(220, 80, 80, 0.5)',
							color: 'white',
							cursor: 'pointer',
							fontWeight: 500,
							fontSize: '14px',
							transition: 'all 0.2s'
						}}
						onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(200, 60, 60, 0.7)'}
						onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(220, 80, 80, 0.5)'}
					>
						Löschen
					</button>
				</div>
			</div>
		</div>
	)
}
