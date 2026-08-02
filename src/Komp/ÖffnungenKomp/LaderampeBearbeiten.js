import { useState } from "react"
import MuiNumberfield from "../MuiNumberfield"
import MuiSelect from "../MuiSelect"
import MuiTextfeld from "../MuiTextfeld"
import PositionInfoSection, { useOpeningPositionDisplay } from "./PositionInfoSection"
import { getOpeningCollisionReport } from "../openingUtils"
import { centerOpeningInField } from "./openingAlignmentUtils"

export default function LaderampeBearbeiten({
	selectedObject,
	setEditMenü,
	objs,
	setObjs,
	gebäudeHöhe,
	gebäudeBreite,
	gebäudeLänge
}) {
	const getLaderampeStartLängeByTyp = (typ) => {
		if (typ === 'laderaum') return 1
		if (typ === 'verladehütte') return 4
		return 3
	}

	const [laderampeBreite, setLaderampeBreite] = useState(selectedObject?.value?.[0] ?? 3.5)
	const [laderampeHöhe, setLaderampeHöhe] = useState(selectedObject?.value?.[1] ?? 4.5)
	const [typ, setTyp] = useState(selectedObject?.typ ?? 'ladehaus')
	const [länge, setLänge] = useState(selectedObject?.länge ?? getLaderampeStartLängeByTyp(selectedObject?.typ ?? 'ladehaus'))
	const [rampenhöhe, setRampenhöhe] = useState(selectedObject?.rampenhöhe ?? 0.8)

	const [transparenteFüllung] = useState(selectedObject?.transparenteFüllung ?? 'nein')
	const [transparentePaneele, setTransparentePaneele] = useState(selectedObject?.transparentePaneele ?? '1,2,3')
	const [fensterstreifenHöhe, setFensterstreifenHöhe] = useState(selectedObject?.fensterstreifenHöhe ?? 0.6)
	const [reflektor, setReflektor] = useState(selectedObject?.reflektor ?? 'keine')

	const [schlupftür, setSchlupftür] = useState(selectedObject?.schlupftür ?? 'nein')
	const [schlupftürBreite, setSchlupftürBreite] = useState(selectedObject?.schlupftürBreite ?? 1)
	const [schlupftürHöhe, setSchlupftürHöhe] = useState(selectedObject?.schlupftürHöhe ?? 2)
	const [schlupftürDistanzX, setSchlupftürDistanzX] = useState(selectedObject?.schlupftürDistanzX ?? 1)
	const [schlupftürOrientierung, setSchlupftürOrientierung] = useState(selectedObject?.schlupftürOrientierung ?? 'rechts')

	const [farbe, setFarbe] = useState(selectedObject?.farbe ?? 'Weiß')
	const [füllFarbe, setFüllFarbe] = useState(selectedObject?.füllFarbe ?? 'Weiß')
	const [verkleidungFarbe, setVerkleidungFarbe] = useState(selectedObject?.verkleidungFarbe ?? 'Weiß')
	const [abstandLinks] = useState(selectedObject?.abstandLinks ?? 0)
	const [abstandRechts] = useState(selectedObject?.abstandRechts ?? 0)
	const istLangeWand = selectedObject?.lang ?? true
	const maxLaderampeBreite = istLangeWand ? gebäudeLänge : gebäudeBreite
	const maxLaderampeRampenhöhe = Math.max(0, gebäudeHöhe - 0.2)
	const maxAbstand = istLangeWand ? gebäudeLänge : gebäudeBreite
	const begrenzteRampenhöhe = Math.min(Math.max(Number(rampenhöhe) || 0, 0), maxLaderampeRampenhöhe)
	const maxLaderampeHöhe = Math.max(0.2, gebäudeHöhe - begrenzteRampenhöhe)
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
			clampValue(laderampeBreite, 0.2, maxLaderampeBreite),
			clampValue(laderampeHöhe, 0.2, maxLaderampeHöhe)
		],
		typ,
		länge,
		rampenhöhe: clampValue(rampenhöhe, 0, maxLaderampeRampenhöhe),
		transparenteFüllung,
		transparentePaneele: transparenteFüllung === 'ja' ? transparentePaneele : null,
		fensterstreifenHöhe: transparenteFüllung === 'ja' ? fensterstreifenHöhe : null,
		reflektor,
		schlupftür,
		schlupftürBreite: schlupftür === 'ja' ? clampValue(schlupftürBreite, 0.2, maxLaderampeBreite) : null,
		schlupftürHöhe: schlupftür === 'ja' ? clampValue(schlupftürHöhe, 0.2, maxLaderampeHöhe) : null,
		schlupftürDistanzX: schlupftür === 'ja' ? clampValue(schlupftürDistanzX, 0, maxLaderampeBreite) : null,
		schlupftürOrientierung: schlupftür === 'ja' ? schlupftürOrientierung : null,
		farbe,
		füllFarbe,
		verkleidungFarbe,
		abstandLinks: clampValue(displayValues.abstandLinks ?? abstandLinks, 0, maxAbstand),
		abstandRechts: clampValue(displayValues.abstandRechts ?? abstandRechts, 0, maxAbstand),
	} : null
	const collisionReport = getOpeningCollisionReport({ selectedObject, draftObject, objs })

	const handleAlignVertical = () => {
		centerOpeningInField({ selectedObject, objs, setObjs, gebäudeHöhe, mode: 'vertical' })
	}

	const handleAlignHorizontal = () => {
		centerOpeningInField({ selectedObject, objs, setObjs, gebäudeHöhe, mode: 'horizontal' })
	}

	const handleTypChange = (newTyp) => {
		setTyp(newTyp)
		setLänge(getLaderampeStartLängeByTyp(newTyp))
	}

	const handleUpdate = () => {
		if (!selectedObject) return
		if (collisionReport.hasCollision) {
			window.alert(collisionReport.message)
			return
		}
		handleRefreshPosition()
		const geklemmteRampenhöhe = clampValue(rampenhöhe, 0, maxLaderampeRampenhöhe)
		const maxLaderampeHöheNachRampe = Math.max(0.2, gebäudeHöhe - geklemmteRampenhöhe)
		const geklemmteLaderampeBreite = clampValue(laderampeBreite, 0.2, maxLaderampeBreite)
		const geklemmteLaderampeHöhe = clampValue(laderampeHöhe, 0.2, maxLaderampeHöheNachRampe)
		const geklemmteSchlupftürBreite = clampValue(schlupftürBreite, 0.2, maxLaderampeBreite)
		const geklemmteSchlupftürHöhe = clampValue(schlupftürHöhe, 0.2, maxLaderampeHöheNachRampe)
		const geklemmteSchlupftürDistanzX = clampValue(schlupftürDistanzX, 0, maxLaderampeBreite)
		const sichererAbstandLinks = clampValue(displayValues.abstandLinks ?? abstandLinks, 0, maxAbstand)
		const sichererAbstandRechts = clampValue(displayValues.abstandRechts ?? abstandRechts, 0, maxAbstand)

		setObjs(objs => objs.map(obj =>
			obj.id === selectedObject.id
				? {
					...obj,
					value: [geklemmteLaderampeBreite, geklemmteLaderampeHöhe],
					typ,
					länge,
					rampenhöhe: geklemmteRampenhöhe,
					transparenteFüllung,
					transparentePaneele: transparenteFüllung === 'ja' ? transparentePaneele : null,
					fensterstreifenHöhe: transparenteFüllung === 'ja' ? fensterstreifenHöhe : null,
					reflektor,
					schlupftür,
					schlupftürBreite: schlupftür === 'ja' ? geklemmteSchlupftürBreite : null,
					schlupftürHöhe: schlupftür === 'ja' ? geklemmteSchlupftürHöhe : null,
					schlupftürDistanzX: schlupftür === 'ja' ? geklemmteSchlupftürDistanzX : null,
					schlupftürOrientierung: schlupftür === 'ja' ? schlupftürOrientierung : null,
					farbe,
					füllFarbe,
					verkleidungFarbe,
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
					Laderampe Anpassen
				</p>
			</div>

			<div style={{ margin: '10px', marginTop: '8px', marginRight: '12px' }}>
				<PositionInfoSection fields={positionFields} values={displayValues} onRefresh={handleRefreshPosition} warningMessage={collisionReport.hasCollision ? collisionReport.message : ''} onAlignVertical={handleAlignVertical} onAlignHorizontal={handleAlignHorizontal} allowVerticalAlignment={false} />

				<p className='text' style={{ fontSize: 13, marginBottom: "6px" }}>Abmessungen:</p>

				<div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: "10px", justifyContent: 'space-between', marginRight: "10px" }}>
					<span className='text' style={{ fontWeight: 200 }}>Typ</span>
					<MuiSelect
						option1={'Ladehaus'}
						value1={'ladehaus'}
						option2={'Laderaum mechanisch'}
						value2={'laderaum'}
						option3={'Verladehütte aus Kunststoff'}
						value3={'verladehütte'}
						label={'Typ'}
						state={typ}
						setState={handleTypChange}
					/>
				</div>

				<div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: "10px", justifyContent: 'space-between', marginRight: "10px" }}>
					<div style={{ display: 'flex', flexDirection: 'column' }}>
						<span className='text' style={{ fontWeight: 200 }}>Breite</span>
						<span className='text' style={{ fontSize: 12 }}>0.2-{maxLaderampeBreite}</span>
					</div>
					<MuiNumberfield label={'m'} min={0.2} max={maxLaderampeBreite} state={laderampeBreite} setState={setLaderampeBreite} />
				</div>

				<div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: "10px", justifyContent: 'space-between', marginRight: "10px" }}>
					<div style={{ display: 'flex', flexDirection: 'column' }}>
						<span className='text' style={{ fontWeight: 200 }}>Höhe</span>
						<span className='text' style={{ fontSize: 12 }}>0.2-{maxLaderampeHöhe}</span>
					</div>
					<MuiNumberfield label={'m'} min={0.2} max={maxLaderampeHöhe} state={laderampeHöhe} setState={setLaderampeHöhe} />
				</div>

				<div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: "10px", justifyContent: 'space-between', marginRight: "10px" }}>
					<div style={{ display: 'flex', flexDirection: 'column' }}>
						<span className='text' style={{ fontWeight: 200 }}>Länge</span>
						<span className='text' style={{ fontSize: 12 }}>0-10</span>
					</div>
					<MuiNumberfield label={'m'} min={0} max={10} state={länge} setState={setLänge} />
				</div>

				<div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: "14px", justifyContent: 'space-between', marginRight: "10px" }}>
					<div style={{ display: 'flex', flexDirection: 'column' }}>
						<span className='text' style={{ fontWeight: 200 }}>Höhe der Rampe</span>
						<span className='text' style={{ fontSize: 12 }}>0-{maxLaderampeRampenhöhe}</span>
					</div>
					<MuiNumberfield label={'m'} min={0} max={maxLaderampeRampenhöhe} state={rampenhöhe} setState={setRampenhöhe} />
				</div>

				{/*
				<div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: "10px", justifyContent: 'space-between', marginRight: "10px" }}>
					<div style={{ display: 'flex', flexDirection: 'column' }}>
						<span className='text' style={{ fontWeight: 200 }}>Abstand Links</span>
						<span className='text' style={{ fontSize: 12 }}>Mitte bis Wandrand</span>
					</div>
					<MuiNumberfield label={'m'} min={0} max={maxAbstand} state={abstandLinks} setState={setAbstandLinks} />
				</div>

				<div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: "14px", justifyContent: 'space-between', marginRight: "10px" }}>
					<div style={{ display: 'flex', flexDirection: 'column' }}>
						<span className='text' style={{ fontWeight: 200 }}>Abstand Rechts</span>
						<span className='text' style={{ fontSize: 12 }}>Mitte bis Wandrand</span>
					</div>
					<MuiNumberfield label={'m'} min={0} max={maxAbstand} state={abstandRechts} setState={setAbstandRechts} />
				</div>
				*/}

				<p className='text' style={{ fontSize: 13, marginBottom: "6px" }}>Sektionaltor:</p>

				{/* <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: "10px", justifyContent: 'space-between', marginRight: "10px" }}>
					<span className='text' style={{ fontWeight: 200 }}>Transparente Füllung</span>
					<MuiSelect
						option1={'Nein'}
						value1={'nein'}
						option2={'Ja'}
						value2={'ja'}
						label={'Transparente Füllung'}
						state={transparenteFüllung}
						setState={setTransparenteFüllung}
					/>
				</div> */}

				{transparenteFüllung === 'ja' && (
					<>
						<div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: "10px", justifyContent: 'space-between', marginRight: "10px" }}>
							<span className='text' style={{ fontWeight: 200 }}>Transparente Paneele</span>
							<MuiTextfeld label={'z.B. "1,2,3"'} state={transparentePaneele} setState={setTransparentePaneele} />
						</div>

						<div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: "14px", justifyContent: 'space-between', marginRight: "10px" }}>
							<span className='text' style={{ fontWeight: 200 }}>Fensterstreifen-Höhe</span>
							<MuiNumberfield label={'m'} min={0.1} max={5} state={fensterstreifenHöhe} setState={setFensterstreifenHöhe} />
						</div>
					</>
				)}

				<div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: "10px", justifyContent: 'space-between', marginRight: "10px" }}>
					<span className='text' style={{ fontWeight: 200 }}>Reflektor</span>
					<MuiSelect
						option1={'Keine'}
						value1={'keine'}
						option2={'Klein'}
						value2={'klein'}
						option3={'Groß'}
						value3={'groß'}
						label={'Reflektor'}
						state={reflektor}
						setState={setReflektor}
					/>
				</div>

				<div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: "10px", justifyContent: 'space-between', marginRight: "10px" }}>
					<span className='text' style={{ fontWeight: 200 }}>Schlupftür</span>
					<MuiSelect
						option1={'Nein'}
						value1={'nein'}
						option2={'Ja'}
						value2={'ja'}
						label={'Schlupftür'}
						state={schlupftür}
						setState={setSchlupftür}
					/>
				</div>

				{schlupftür === 'ja' && (
					<>
						<p className='text' style={{ fontSize: 12, marginBottom: "6px", fontWeight: 300 }}>Schlupftür Eigenschaften:</p>

						<div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: "10px", justifyContent: 'space-between', marginRight: "10px" }}>
							<div style={{ display: 'flex', flexDirection: 'column' }}>
								<span className='text' style={{ fontWeight: 200 }}>Breite</span>
								<span className='text' style={{ fontSize: 12 }}>0.2-{maxLaderampeBreite}</span>
							</div>
							<MuiNumberfield label={'m'} min={0.2} max={maxLaderampeBreite} state={schlupftürBreite} setState={setSchlupftürBreite} />
						</div>

						<div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: "10px", justifyContent: 'space-between', marginRight: "10px" }}>
							<div style={{ display: 'flex', flexDirection: 'column' }}>
								<span className='text' style={{ fontWeight: 200 }}>Höhe</span>
								<span className='text' style={{ fontSize: 12 }}>0.2-{maxLaderampeHöhe}</span>
							</div>
							<MuiNumberfield label={'m'} min={0.2} max={maxLaderampeHöhe} state={schlupftürHöhe} setState={setSchlupftürHöhe} />
						</div>

						<div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: "10px", justifyContent: 'space-between', marginRight: "10px" }}>
							<span className='text' style={{ fontWeight: 200 }}>Distanz +X</span>
							<MuiNumberfield label={'m'} min={0} max={maxLaderampeBreite} state={schlupftürDistanzX} setState={setSchlupftürDistanzX} />
						</div>

						<div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: "14px", justifyContent: 'space-between', marginRight: "10px" }}>
							<span className='text' style={{ fontWeight: 200 }}>Orientierung</span>
							<MuiSelect
								option1={'Rechts'}
								value1={'rechts'}
								option2={'Links'}
								value2={'links'}
								label={'Orientierung'}
								state={schlupftürOrientierung}
								setState={setSchlupftürOrientierung}
							/>
						</div>
					</>
				)}

				<p className='text' style={{ fontSize: 13, marginBottom: "6px" }}>Farben:</p>

				<div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: "10px", justifyContent: 'space-between', marginRight: "10px" }}>
					<span className='text' style={{ fontWeight: 200 }}>Farbe des Artikels</span>
					<MuiSelect
						option1={'Weiß'}
						value1={'Weiß'}
						option2={'Grau'}
						value2={'Grau'}
						option3={'Schwarz'}
						value3={'Schwarz'}
						label={'Farbe'}
						state={farbe}
						setState={setFarbe}
					/>
				</div>

				<div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: "10px", justifyContent: 'space-between', marginRight: "10px" }}>
					<span className='text' style={{ fontWeight: 200 }}>Füllfarbe</span>
					<MuiSelect
						option1={'Weiß'}
						value1={'Weiß'}
						option2={'Grau'}
						value2={'Grau'}
						option3={'Schwarz'}
						value3={'Schwarz'}
						label={'Füllfarbe'}
						state={füllFarbe}
						setState={setFüllFarbe}
					/>
				</div>

				<div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: "14px", justifyContent: 'space-between', marginRight: "10px" }}>
					<span className='text' style={{ fontWeight: 200 }}>Farbe der Verkleidung</span>
					<MuiSelect
						option1={'Weiß'}
						value1={'Weiß'}
						option2={'Grau'}
						value2={'Grau'}
						option3={'Schwarz'}
						value3={'Schwarz'}
						label={'Verkleidung'}
						state={verkleidungFarbe}
						setState={setVerkleidungFarbe}
					/>
				</div>

				<div style={{ display: 'flex', gap: '10px', justifyContent: 'space-between', marginTop: '12px' }}>
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

				<div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '8px' }}>
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
