import { useState } from "react"
import MuiNumberfield from "../MuiNumberfield"
import MuiSelect from "../MuiSelect"
import MuiTextfeld from "../MuiTextfeld"

export default function SektionalTorBearbeiten({
	selectedObject,
	setEditMenü,
	objs,
	setObjs,
	gebäudeHöhe,
	gebäudeBreite,
	gebäudeLänge
}) {
	const [sektionalTorBreite, setSektionalTorBreite] = useState(selectedObject?.value?.[0] ?? 3)
	const [sektionalTorHöhe, setSektionalTorHöhe] = useState(selectedObject?.value?.[1] ?? 3)
	const [posSegment, setPosSegment] = useState(selectedObject?.posSegment ?? 'mittig')
	const [transparenteFüllung, setTransparenteFüllung] = useState(selectedObject?.transparenteFüllung ?? 'nein')
	const [transparentePaneele, setTransparentePaneele] = useState(selectedObject?.transparentePaneele ?? '1,2,3,4')
	const [fensterstreifenHöhe, setFensterstreifenHöhe] = useState(selectedObject?.fensterstreifenHöhe ?? 0.6)
	const [sektionalTorReflektor, setSektionalTorReflektor] = useState(selectedObject?.reflektor ?? 'keine')
	const [schlupftür, setSchlupftür] = useState(selectedObject?.schlupftür ?? 'nein')
	const [schlupftürBreite, setSchlupftürBreite] = useState(selectedObject?.schlupftürBreite ?? 1)
	const [schlupftürHöhe, setSchlupftürHöhe] = useState(selectedObject?.schlupftürHöhe ?? 2)
	const [schlupftürDistanzX, setSchlupftürDistanzX] = useState(selectedObject?.schlupftürDistanzX ?? 0)
	const [schlupftürOrientierung, setSchlupftürOrientierung] = useState(selectedObject?.schlupftürOrientierung ?? 'rechts')
	const [sektionalTorFarbe, setSektionalTorFarbe] = useState(selectedObject?.sektionalTorFarbe ?? 'Weiß')
	const [sektionalTorFüllFarbe, setSektionalTorFüllFarbe] = useState(selectedObject?.sektionalTorFüllFarbe ?? 'Weiß')
	const [sektionalTorFüllFarbeInnen, setSektionalTorFüllFarbeInnen] = useState(selectedObject?.sektionalTorFüllFarbeInnen ?? 'Weiß')
	const [sektionalTorReflektorFarbe, setSektionalTorReflektorFarbe] = useState(selectedObject?.sektionalTorReflektorFarbe ?? 'Weiß')
	const istLangeWand = selectedObject?.lang ?? true
	const maxSektionalTorBreite = istLangeWand ? gebäudeLänge : gebäudeBreite
	const maxSektionalTorHöhe = gebäudeHöhe
	const maxAbstand = istLangeWand ? gebäudeLänge : gebäudeBreite
	const [abstandLinks, setAbstandLinks] = useState(selectedObject?.abstandLinks ?? 0)
	const [abstandRechts, setAbstandRechts] = useState(selectedObject?.abstandRechts ?? 0)

	const clampValue = (value, min, max) => {
		const num = Number(value)
		if (Number.isNaN(num)) return min
		return Math.min(Math.max(num, min), max)
	}

	const handleUpdate = () => {
		if (!selectedObject) return
		const geklemmteSektionalTorBreite = clampValue(sektionalTorBreite, 0.2, maxSektionalTorBreite)
		const geklemmteSektionalTorHöhe = clampValue(sektionalTorHöhe, 0.2, maxSektionalTorHöhe)

		const transparentePaneeleValue = transparenteFüllung === 'ja' ? transparentePaneele : null
		const fensterstreifenHöheValue = transparenteFüllung === 'ja' ? fensterstreifenHöhe : null
		const schlupftürBreiteValue = schlupftür === 'ja' ? clampValue(schlupftürBreite, 0.2, maxSektionalTorBreite) : null
		const schlupftürHöheValue = schlupftür === 'ja' ? clampValue(schlupftürHöhe, 0.2, maxSektionalTorHöhe) : null
		const schlupftürDistanzXValue = schlupftür === 'ja' ? clampValue(schlupftürDistanzX, 0, maxSektionalTorBreite) : null
		const schlupftürOrientierungValue = schlupftür === 'ja' ? schlupftürOrientierung : null
		const sichererAbstandLinks = clampValue(abstandLinks, 0, maxAbstand)
		const sichererAbstandRechts = clampValue(abstandRechts, 0, maxAbstand)

		setObjs(objs => objs.map(obj =>
			obj.id === selectedObject.id
				? {
					...obj,
					value: [geklemmteSektionalTorBreite, geklemmteSektionalTorHöhe],
					posSegment,
					transparenteFüllung,
					transparentePaneele: transparentePaneeleValue,
					fensterstreifenHöhe: fensterstreifenHöheValue,
					reflektor: sektionalTorReflektor,
					schlupftür,
					schlupftürBreite: schlupftürBreiteValue,
					schlupftürHöhe: schlupftürHöheValue,
					schlupftürDistanzX: schlupftürDistanzXValue,
					schlupftürOrientierung: schlupftürOrientierungValue,
					sektionalTorFarbe,
					sektionalTorFüllFarbe,
					sektionalTorFüllFarbeInnen,
					sektionalTorReflektorFarbe,
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
					Sektionaltor Anpassen
				</p>
			</div>

			<div style={{ margin: '10px', marginTop: '8px', marginRight: '12px' }}>
				{/* <p className='text' style={{ fontSize: 13, marginBottom: "6px" }}>Position im Segment:</p>

				<div style={{
					display: 'flex',
					gap: '10px',
					alignItems: 'center',
					marginBottom: "10px",
					justifyContent: 'space-between',
					marginRight: "10px",
				}}>
					<span className='text' style={{ fontWeight: 200 }}>Horizontal</span>
					<MuiSelect
						option1={'Links'}
						value1={'links'}
						option2={'Mittig'}
						value2={'mittig'}
						option3={'Rechts'}
						value3={'rechts'}
						label={'Segment'}
						state={posSegment}
						setState={setPosSegment}
					/>
				</div> */}

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
						<span className='text' style={{ fontSize: 12 }}>0.2-{maxSektionalTorBreite}</span>
					</div>
					<MuiNumberfield
						label={'m'}
						min={0.2}
						max={maxSektionalTorBreite}
						state={sektionalTorBreite}
						setState={setSektionalTorBreite}
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
						<span className='text' style={{ fontSize: 12 }}>0.2-{maxSektionalTorHöhe}</span>
					</div>
					<MuiNumberfield
						label={'m'}
						min={0.2}
						max={maxSektionalTorHöhe}
						state={sektionalTorHöhe}
						setState={setSektionalTorHöhe}
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
				</div>

				{transparenteFüllung === 'ja' && (
					<>
						<div style={{
							display: 'flex',
							gap: '10px',
							alignItems: 'center',
							marginBottom: "10px",
							justifyContent: 'space-between',
							marginRight: "10px"
						}}>
							<span className='text' style={{ fontWeight: 200 }}>Transparente Paneele</span>
							<MuiTextfeld
								label={'z.B. "1,2,3,4"'}
								state={transparentePaneele}
								setState={setTransparentePaneele}
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
							<span className='text' style={{ fontWeight: 200 }}>Fensterstreifen-Höhe</span>
							<MuiNumberfield
								label={'m'}
								min={0.1}
								max={5}
								state={fensterstreifenHöhe}
								setState={setFensterstreifenHöhe}
							/>
						</div>
					</>
				)}

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
						state={sektionalTorReflektor}
						setState={setSektionalTorReflektor}
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
								<span className='text' style={{ fontSize: 12 }}>0.2-{maxSektionalTorBreite}</span>
							</div>
							<MuiNumberfield
								label={'m'}
								min={0.2}
								max={maxSektionalTorBreite}
								state={schlupftürBreite}
								setState={setSchlupftürBreite}
							/>
						</div>

						<div style={{
							display: 'flex',
							gap: '10px',
							alignItems: 'center',
							marginBottom: "10px",
							justifyContent: 'space-between',
							marginRight: "10px"
						}}>
							<div style={{ display: 'flex', flexDirection: 'column' }}>
								<span className='text' style={{ fontWeight: 200 }}>Höhe</span>
								<span className='text' style={{ fontSize: 12 }}>0.2-{maxSektionalTorHöhe}</span>
							</div>
							<MuiNumberfield
								label={'m'}
								min={0.2}
								max={maxSektionalTorHöhe}
								state={schlupftürHöhe}
								setState={setSchlupftürHöhe}
							/>
						</div>

						<div style={{
							display: 'flex',
							gap: '10px',
							alignItems: 'center',
							marginBottom: "10px",
							justifyContent: 'space-between',
							marginRight: "10px"
						}}>
							<span className='text' style={{ fontWeight: 200 }}>Distanz +X</span>
							<MuiNumberfield
								label={'m'}
								min={0}
								max={maxSektionalTorBreite}
								state={schlupftürDistanzX}
								setState={setSchlupftürDistanzX}
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

				<div style={{
					display: 'flex',
					gap: '10px',
					alignItems: 'center',
					marginBottom: "10px",
					justifyContent: 'space-between',
					marginRight: "10px",
				}}>
					<span className='text' style={{ fontWeight: 200 }}>Farbe des Artikels</span>
					<MuiSelect
						option1={'Weiß'}
						value1={'Weiß'}
						option2={'Grau'}
						value2={'Grau'}
						option3={'Schwarz'}
						value3={'Schwarz'}
						label={'Farbe'}
						state={sektionalTorFarbe}
						setState={setSektionalTorFarbe}
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
					<span className='text' style={{ fontWeight: 200 }}>Füllfarbe</span>
					<MuiSelect
						option1={'Weiß'}
						value1={'Weiß'}
						option2={'Grau'}
						value2={'Grau'}
						option3={'Schwarz'}
						value3={'Schwarz'}
						label={'Füllfarbe'}
						state={sektionalTorFüllFarbe}
						setState={setSektionalTorFüllFarbe}
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
					<span className='text' style={{ fontWeight: 200 }}>Füllfarbe (innen)</span>
					<MuiSelect
						option1={'Weiß'}
						value1={'Weiß'}
						option2={'Grau'}
						value2={'Grau'}
						option3={'Schwarz'}
						value3={'Schwarz'}
						label={'Füllfarbe innen'}
						state={sektionalTorFüllFarbeInnen}
						setState={setSektionalTorFüllFarbeInnen}
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
					<span className='text' style={{ fontWeight: 200 }}>Farbe des Reflektors</span>
					<MuiSelect
						option1={'Weiß'}
						value1={'Weiß'}
						option2={'Grau'}
						value2={'Grau'}
						option3={'Schwarz'}
						value3={'Schwarz'}
						label={'Reflektor'}
						state={sektionalTorReflektorFarbe}
						setState={setSektionalTorReflektorFarbe}
					/>
				</div>

				<div style={{
					display: 'flex',
					gap: '10px',
					justifyContent: 'space-between',
					marginTop: '12px'
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
					marginTop: '8px'
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
