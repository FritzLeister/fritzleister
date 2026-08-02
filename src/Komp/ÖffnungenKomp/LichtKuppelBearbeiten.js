import { useEffect, useState } from "react"
import MuiNumberfield from "../MuiNumberfield"
import MuiSelect from "../MuiSelect"
import PositionInfoSection, { useOpeningPositionDisplay } from "./PositionInfoSection"
import { getOpeningCollisionReport } from "../openingUtils"
import { centerOpeningInField } from "./openingAlignmentUtils"

export default function LichtKuppelBearbeiten({
	selectedObject,
	setEditMenü,
	objs,
	setObjs,
	gebäudeBreite,
	gebäudeLänge,
	gebäudeHöhe
}) {
	const maxBreiteX = gebäudeLänge
	const maxBreiteY = Math.floor(gebäudeBreite / 2)
	const clampValue = (value, min, max) => Math.min(Math.max(value, min), max)
	const [breiteX, setBreiteX] = useState(selectedObject?.value?.[0] ?? 1)
	const [breiteY, setBreiteY] = useState(selectedObject?.value?.[1] ?? 1)
	const [horizontaleAusrichtung, setHorizontaleAusrichtung] = useState(selectedObject?.horizontaleAusrichtung ?? 'mittig')
	const [farbe, setFarbe] = useState(selectedObject?.farbe ?? 'Weiß')
	const [abstandLinks] = useState(selectedObject?.abstandLinks ?? 0)
	const [abstandRechts] = useState(selectedObject?.abstandRechts ?? 0)
	const positionFields = [
		{ key: 'abstandLinks', label: 'Abstand Links', hint: 'Per Button aktualisieren' },
		{ key: 'abstandRechts', label: 'Abstand Rechts', hint: 'Per Button aktualisieren' },
		{ key: 'abstandUnten', label: 'Abstand Unten', hint: 'Zum Boden' }
	]
	const { displayValues, handleRefreshPosition } = useOpeningPositionDisplay(selectedObject, positionFields)
	const draftObject = selectedObject ? {
		...selectedObject,
		value: [
			clampValue(breiteX, 0.2, maxBreiteX),
			clampValue(breiteY, 0.2, maxBreiteY)
		],
		horizontaleAusrichtung,
		farbe,
		abstandLinks: selectedObject.abstandLinks,
		abstandRechts: selectedObject.abstandRechts,
		abstandUnten: selectedObject.abstandUnten,
	} : null
	const collisionReport = getOpeningCollisionReport({ selectedObject, draftObject, objs })

	const handleAlignVertical = () => {
		centerOpeningInField({ selectedObject, objs, setObjs, gebäudeHöhe, mode: 'vertical' })
	}

	const handleAlignHorizontal = () => {
		centerOpeningInField({ selectedObject, objs, setObjs, gebäudeHöhe, mode: 'horizontal' })
	}

	useEffect(() => {
		if (!selectedObject?.id) return

		const rafId = window.requestAnimationFrame(() => {
			handleRefreshPosition()
		})

		return () => window.cancelAnimationFrame(rafId)
	}, [handleRefreshPosition, selectedObject?.id])

	const handleUpdate = () => {
		if (!selectedObject) return
		if (collisionReport.hasCollision) {
			window.alert(collisionReport.message)
			return
		}
		handleRefreshPosition()
		const sichereBreiteX = clampValue(breiteX, 0.2, maxBreiteX)
		const sichereBreiteY = clampValue(breiteY, 0.2, maxBreiteY)
		const sichererAbstandLinks = clampValue(displayValues.abstandLinks ?? abstandLinks, 0, maxBreiteX)
		const sichererAbstandRechts = clampValue(displayValues.abstandRechts ?? abstandRechts, 0, maxBreiteX)

		setObjs(objs => objs.map(obj =>
			obj.id === selectedObject.id
				? {
					...obj,
					value: [sichereBreiteX, sichereBreiteY],
					horizontaleAusrichtung,
					farbe,
					abstandLinks: sichererAbstandLinks,
					abstandRechts: sichererAbstandRechts,
					abstandUnten: displayValues.abstandUnten ?? obj.abstandUnten
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
					Klein Lichtkuppel Anpassen
				</p>
			</div>

			<div style={{ margin: '10px', marginTop: '8px', marginRight: '12px' }}>
				<PositionInfoSection fields={positionFields} values={displayValues} onRefresh={handleRefreshPosition} warningMessage={collisionReport.hasCollision ? collisionReport.message : ''} onAlignVertical={handleAlignVertical} onAlignHorizontal={handleAlignHorizontal} hideAlignmentActions />

				<p className='text' style={{ fontSize: 13, marginBottom: "6px" }}>Position:</p>

				<div style={{
					display: 'flex',
					gap: '10px',
					alignItems: 'center',
					marginBottom: "14px",
					justifyContent: 'space-between',
					marginRight: "10px",
				}}>
					<span className='text' style={{ fontWeight: 200 }}>Horizontale Ausrichtung</span>
					<MuiSelect
						option1={'Links'}
						value1={'links'}
						option2={'Mittig'}
						value2={'mittig'}
						option3={'Rechts'}
						value3={'rechts'}
						label={'Ausrichtung'}
						state={horizontaleAusrichtung}
						setState={setHorizontaleAusrichtung}
					/>
				</div>

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
						<span className='text' style={{ fontSize: 12 }}>0.2-{maxBreiteX}</span>
					</div>
					<MuiNumberfield
						label={'m'}
						min={0.2}
						max={maxBreiteX}
						step={0.01}
						state={breiteX}
						setState={setBreiteX}
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
						<span className='text' style={{ fontSize: 12 }}>0.2-{maxBreiteY}</span>
					</div>
					<MuiNumberfield
						label={'m'}
						min={0.2}
						max={maxBreiteY}
						step={0.01}
						state={breiteY}
						setState={setBreiteY}
					/>
				</div>

				<p className='text' style={{ fontSize: 13, marginBottom: "6px" }}>Farben:</p>

				<div style={{
					display: 'flex',
					gap: '10px',
					alignItems: 'center',
					marginBottom: "14px",
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
						state={farbe}
						setState={setFarbe}
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
