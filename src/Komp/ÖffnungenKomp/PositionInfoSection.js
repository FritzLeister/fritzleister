import { useEffect, useState } from "react"

export const OPENING_POSITION_REFRESH_EVENT = 'opening-position:refresh'
export const OPENING_POSITION_VALUES_EVENT = 'opening-position:values'

const METER_EINHEIT = 2.5

function formatSceneDistance(value) {
    return `${(Number(value || 0) / METER_EINHEIT).toFixed(2)} m`
}

function isSameId(left, right) {
    if (left === undefined || left === null || right === undefined || right === null) return false
    return String(left) === String(right)
}

function buildDisplayValues(selectedObject, fields) {
    return fields.reduce((accumulator, field) => {
        accumulator[field.key] = Number(selectedObject?.[field.key] ?? 0)
        return accumulator
    }, {})
}

export function useOpeningPositionDisplay(selectedObject, fields) {
    const fieldKeysSignature = fields.map((field) => field.key).join('|')
    const selectedObjectFieldSnapshot = fields.map((field) => selectedObject?.[field.key] ?? '').join('|')
    const [displayValues, setDisplayValues] = useState(() => buildDisplayValues(selectedObject, fields))

    useEffect(() => {
        setDisplayValues(buildDisplayValues(selectedObject, fields))
    }, [fieldKeysSignature, fields, selectedObject, selectedObject?.id, selectedObjectFieldSnapshot])

    useEffect(() => {
        const handlePositionValues = (event) => {
            if (!isSameId(event?.detail?.id, selectedObject?.id)) return

            setDisplayValues((prevValues) => {
                const nextValues = { ...prevValues }

                for (const field of fields) {
                    const incoming = Number(event.detail[field.key])
                    nextValues[field.key] = Number.isFinite(incoming) ? incoming : Number(prevValues[field.key] ?? 0)
                }

                return nextValues
            })
        }

        window.addEventListener(OPENING_POSITION_VALUES_EVENT, handlePositionValues)
        return () => window.removeEventListener(OPENING_POSITION_VALUES_EVENT, handlePositionValues)
    }, [fieldKeysSignature, fields, selectedObject?.id])

    const handleRefreshPosition = () => {
        if (!selectedObject?.id) return

        window.dispatchEvent(new CustomEvent(OPENING_POSITION_REFRESH_EVENT, {
            detail: { id: selectedObject.id }
        }))
    }

    return {
        displayValues,
        handleRefreshPosition,
        formatSceneDistance
    }
}

export default function PositionInfoSection({ fields, values, onRefresh, warningMessage }) {
    return (
        <>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '10px',
                marginBottom: '6px',
                marginRight: '10px'
            }}>
                <p className='text' style={{ fontSize: 13, marginBottom: 0 }}>Position:</p>
                <button
                    onClick={onRefresh}
                    style={{
                        padding: '4px 8px',
                        borderRadius: '6px',
                        border: '1px solid rgba(0,0,0,0.18)',
                        backgroundColor: 'rgba(255, 255, 255, 0.45)',
                        color: 'black',
                        cursor: 'pointer',
                        fontWeight: 500,
                        fontSize: '11px',
                        lineHeight: 1.2,
                        transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.65)'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.45)'}
                >
                    Aktualisieren
                </button>
            </div>

            {fields.map((field, index) => (
                <div
                    key={field.key}
                    style={{
                        display: 'flex',
                        gap: '10px',
                        alignItems: 'center',
                        marginBottom: index === fields.length - 1 ? '14px' : '10px',
                        justifyContent: 'space-between',
                        marginRight: '10px'
                    }}
                >
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span className='text' style={{ fontWeight: 200 }}>{field.label}</span>
                        <span className='text' style={{ fontSize: 12 }}>{field.hint}</span>
                    </div>
                    <span className='text' style={{ fontWeight: 200 }}>{formatSceneDistance(values[field.key])}</span>
                </div>
            ))}

            {warningMessage ? (
                <div style={{
                    margin: '0 10px 14px 0',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid rgba(180, 60, 60, 0.45)',
                    backgroundColor: 'rgba(255, 210, 210, 0.75)',
                    color: '#7a1d1d',
                    fontSize: '12px',
                    lineHeight: 1.35,
                    fontWeight: 600
                }}>
                    {warningMessage}
                </div>
            ) : null}
        </>
    )
}