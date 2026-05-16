import { useState } from "react"
import MuiNumberfield from "../MuiNumberfield"
import MuiSelect from "../MuiSelect"
import PositionInfoSection, { useOpeningPositionDisplay } from "./PositionInfoSection"

export default function RollTorBearbeiten({
	selectedObject,
	setEditMenü,
	objs,
	setObjs,
	gebäudeHöhe,
	gebäudeBreite,
	gebäudeLänge
}) {
	const [rolltorBreite, setRolltorBreite] = useState(selectedObject?.value?.[0] ?? 3)
	const [rolltorHöhe, setRolltorHöhe] = useState(selectedObject?.value?.[1] ?? 3)
	const [rolltorÖffnet, setRolltorÖffnet] = useState(selectedObject?.öffnet ?? 'innen')
	const [rolltorReflektor, setRolltorReflektor] = useState(selectedObject?.reflektor ?? selectedObject?.rolltorReflektor ?? 'keine')
	const [rolltorMotor, setRolltorMotor] = useState(selectedObject?.motorPlatzierung ?? 'rechts')
	const [rolltorFarbe, setRolltorFarbe] = useState(selectedObject?.rolltorFarbe ?? selectedObject?.farbe ?? 'Weiß')
	const [rolltorFüllFarbe, setRolltorFüllFarbe] = useState(selectedObject?.rolltorFüllFarbe ?? selectedObject?.füllFarbe ?? 'Weiß')
	const istLangeWand = selectedObject?.lang ?? true
	const maxRolltorBreite = istLangeWand ? gebäudeLänge : gebäudeBreite
	const maxRolltorHöhe = gebäudeHöhe
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

	const handleUpdate = () => {
		if (!selectedObject) return
		handleRefreshPosition()
		const geklemmteRolltorBreite = clampValue(rolltorBreite, 0.2, maxRolltorBreite)
		const geklemmteRolltorHöhe = clampValue(rolltorHöhe, 0.2, maxRolltorHöhe)
		const sichererAbstandLinks = clampValue(displayValues.abstandLinks ?? abstandLinks, 0, maxAbstand)
		const sichererAbstandRechts = clampValue(displayValues.abstandRechts ?? abstandRechts, 0, maxAbstand)

		setObjs(objs => objs.map(obj =>
			obj.id === selectedObject.id
				? {
					...obj,
					value: [geklemmteRolltorBreite, geklemmteRolltorHöhe],
					öffnet: rolltorÖffnet,
					reflektor: rolltorReflektor,
					rolltorReflektor: rolltorReflektor,
					motorPlatzierung: rolltorMotor,
					rolltorFarbe,
					rolltorFüllFarbe,
					farbe: rolltorFarbe,
					füllFarbe: rolltorFüllFarbe,
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
					Rolltor Anpassen
				</p>
			</div>

			<div style={{ margin: '10px', marginTop: '8px', marginRight: '12px' }}>
				<PositionInfoSection fields={positionFields} values={displayValues} onRefresh={handleRefreshPosition} />

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
						<span className='text' style={{ fontSize: 12 }}>0.2-{maxRolltorBreite}</span>
					</div>
					<MuiNumberfield
						label={'m'}
						min={0.2}
						max={maxRolltorBreite}
						state={rolltorBreite}
						setState={setRolltorBreite}
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
						<span className='text' style={{ fontSize: 12 }}>0.2-{maxRolltorHöhe}</span>
					</div>
					<MuiNumberfield
						label={'m'}
						min={0.2}
						max={maxRolltorHöhe}
						state={rolltorHöhe}
						setState={setRolltorHöhe}
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

				<p className='text' style={{ fontSize: 13, marginBottom: "6px" }}>Eigenschaften:</p>

				<div style={{
					display: 'flex',
					gap: '10px',
					alignItems: 'center',
					marginBottom: "10px",
					justifyContent: 'space-between',
					marginRight: "10px",
				}}>
					<span className='text' style={{ fontWeight: 200 }}>Öffnet</span>
					<MuiSelect
						option1={'Innen'}
						value1={'innen'}
						option2={'Außen'}
						value2={'außen'}
						label={'Öffnet'}
						state={rolltorÖffnet}
						setState={setRolltorÖffnet}
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
					<span className='text' style={{ fontWeight: 200 }}>Reflektor</span>
					<MuiSelect
						option1={'Keine'}
						value1={'keine'}
						option2={'Klein'}
						value2={'klein'}
						option3={'Groß'}
						value3={'groß'}
						label={'Reflektor'}
						state={rolltorReflektor}
						setState={setRolltorReflektor}
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
					<span className='text' style={{ fontWeight: 200 }}>Motorseite</span>
					<MuiSelect
						option1={'Rechts'}
						value1={'rechts'}
						option2={'Links'}
						value2={'links'}
						label={'Motor'}
						state={rolltorMotor}
						setState={setRolltorMotor}
					/>
				</div>

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
						state={rolltorFarbe}
						setState={setRolltorFarbe}
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
					<span className='text' style={{ fontWeight: 200 }}>Lamellen</span>
					<MuiSelect
						option1={'Weiß'}
						value1={'Weiß'}
						option2={'Grau'}
						value2={'Grau'}
						option3={'Schwarz'}
						value3={'Schwarz'}
						label={'Füllfarbe'}
						state={rolltorFüllFarbe}
						setState={setRolltorFüllFarbe}
					/>
				</div>

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
