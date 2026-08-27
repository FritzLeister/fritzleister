
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import EditIcon from '@mui/icons-material/Edit';
import IosShareIcon from '@mui/icons-material/IosShare';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useEffect, useRef, useState } from 'react';

function buildHalleShareUrl(halle) {
    if (typeof window === 'undefined') {
        return '';
    }

    const payload = {
        version: 1,
        hall: {
            id: halle?.id ?? Date.now(),
            breite: halle?.breite ?? halle?.savedHalleBreite ?? null,
            höhe: halle?.höhe ?? halle?.savedHalleHöhe ?? null,
            länge: halle?.länge ?? halle?.savedHalleLänge ?? null,
            dachArt: halle?.dachArt ?? halle?.savedHalleDachArt ?? 'satteldach',
            hallenArt: halle?.hallenArt ?? halle?.savedHalleArt ?? 'industrie',
            flach: Boolean(halle?.flach ?? false),
            appearance: halle?.appearance ?? {},
            objs: Array.isArray(halle?.objs)
                ? halle.objs.map((obj) => {
                    if (!obj || typeof obj !== 'object') {
                        return obj;
                    }

                    const { onChange, ...rest } = obj;
                    return rest;
                })
                : [],
            name: typeof halle?.name === 'string' ? halle.name : ''
        }
    };

    const json = JSON.stringify(payload);

    if (typeof TextEncoder !== 'undefined') {
        const bytes = new TextEncoder().encode(json);
        let binary = '';
        bytes.forEach((byte) => {
            binary += String.fromCharCode(byte);
        });

        return `${window.location.origin}${window.location.pathname}?share=${window.btoa(binary)}`;
    }

    return `${window.location.origin}${window.location.pathname}?share=${encodeURIComponent(json)}`;
}

export default function GespeicherteHallen({ 
    halle, 
    index, 
    setShowApp,
    setLänge,
    setBreite,
    setHöhe,
    setHallenartSelection,
    setDachSelection,
    setFlach,
    setAppearanceConfig,
    deleteHalle,
    editNameHalle,
    setNameEdit,
    objs,
    setObjs,
    hydrateObjs,
    hallenCount
}) {

    function handleClick() {

        // Aktuelle State Werte in Werte vom Objekt ändern
        setDachSelection(halle.dachArt)
        setLänge(halle.länge)
        setBreite(halle.breite)
        setHöhe(halle.höhe)
        setHallenartSelection(halle.hallenArt)
        if (typeof setFlach === 'function') {
            setFlach(Boolean(halle.flach ?? false))
        }
        if (typeof setAppearanceConfig === 'function') {
            setAppearanceConfig(halle.appearance ?? {})
        }
        if (typeof setObjs === 'function') {
            if (typeof hydrateObjs === 'function') {
                setObjs(hydrateObjs(halle.objs))
            } else {
                setObjs(Array.isArray(halle.objs) ? halle.objs.map(o => ({ ...o })) : [])
            }
        }
        // Wieder App anzeigen
        setShowApp("app")
    }

    const [inputValue, setInputValue] = useState(halle.name || "")
    const [shareOpen, setShareOpen] = useState(false)
    const [shareUrl, setShareUrl] = useState('')
    const [copyFeedback, setCopyFeedback] = useState('')
    const shareInputRef = useRef(null)

    function handleInputEnter() {
        editNameHalle(halle.id, inputValue)
        setOutput(false)
    }

    function handleInputChange(e) {
        setInputValue(e.target.value)
    }

    function openShareMenu() {
        const nextUrl = buildHalleShareUrl(halle)
        setShareUrl(nextUrl)
        setCopyFeedback('')
        setShareOpen(true)
    }

    async function handleCopyLink() {
        if (!shareUrl) {
            return;
        }

        try {
            if (navigator.clipboard?.writeText) {
                await navigator.clipboard.writeText(shareUrl)
            } else if (shareInputRef.current) {
                shareInputRef.current.select()
                document.execCommand('copy')
            }

            setCopyFeedback('Kopiert')
        } catch (error) {
            setCopyFeedback('Konnte nicht kopiert werden')
        }
    }

    useEffect(() => {
        if (!shareOpen || !shareInputRef.current) {
            return;
        }

        shareInputRef.current.focus()
        shareInputRef.current.select()
    }, [shareOpen, shareUrl])

    const [output, setOutput] = useState(false)

    function getWidthInput() {
        if (hallenCount >= 4) {
            return "80px"
        } else if (hallenCount === 3) {
            return "120px"
        } else if (hallenCount === 2) {
            return "160px"
        } else if (hallenCount === 1) {
            return "200px"
        }
    }

    return (
        <div className="savedHalleCard">
            <div className="savedHalleActionBar">
                <button
                    className="savedHalleActionButton"
                    onClick={() => setOutput(!output)}
                    aria-label="Bezeichnung bearbeiten"
                    type="button"
                >
                    <EditIcon fontSize="small" />
                </button>

                <div className="savedHalleActionButtonWrap">
                    <button
                        className="savedHalleActionButton"
                        onClick={(e) => {
                            e.stopPropagation();
                            openShareMenu();
                        }}
                        aria-label="Halle teilen"
                        type="button"
                    >
                        <IosShareIcon fontSize="small" />
                    </button>

                    {shareOpen && (
                        <div className="savedHalleSharePopover">
                            <button
                                className="savedHalleShareCloseButton"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShareOpen(false);
                                    setCopyFeedback('');
                                }}
                                aria-label="Popup schließen"
                                type="button"
                            >
                                ×
                            </button>
                            <label className="savedHalleShareLabel" htmlFor={`share-link-${halle.id ?? index}`}>
                                Link teilen
                            </label>
                            <div className="savedHalleShareInputRow">
                                <input
                                    ref={shareInputRef}
                                    id={`share-link-${halle.id ?? index}`}
                                    className="savedHalleShareInput"
                                    value={shareUrl}
                                    readOnly
                                    onClick={(e) => e.currentTarget.select()}
                                />
                                <button
                                    className="savedHalleShareCopyButton"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleCopyLink();
                                    }}
                                    aria-label="Link kopieren"
                                    type="button"
                                >
                                    <ContentCopyIcon fontSize="small" />
                                </button>
                            </div>
                            <p className="savedHalleShareHint">
                                {copyFeedback || 'Link kann direkt weitergegeben werden.'}
                            </p>
                        </div>
                    )}
                </div>

                <button
                    className="savedHalleActionButton"
                    onClick={handleClick}
                    aria-label="Halle öffnen"
                    type="button"
                >
                    <OpenInNewIcon fontSize="small" />
                </button>

                <button
                    className="savedHalleActionButton"
                    onClick={(e) => { e.stopPropagation(); deleteHalle(halle.id); }}
                    aria-label="Halle löschen"
                    type="button"
                >
                    <RemoveCircleOutlineIcon fontSize="small" />
                </button>
            </div>

            {output ? (
                <div className="savedHalleNameWrapper">
                    <input
                        className="savedHalleInput"
                        style={{ width: getWidthInput() }}
                        placeholder='Titel...'
                        onKeyDown={(e) => {
                            if (e.key === "Enter") handleInputEnter();
                        }}
                        value={inputValue}
                        onChange={handleInputChange}
                    />
                </div>
            ) : (
                <h3 className="savedHalleTitle">{halle.name === "" ? `Halle ${index + 1}` : halle.name}</h3>
            )}

            <div className="savedHalleMeta">
                <p>
                    <span>Länge</span>
                    <strong>{halle.savedHalleLänge || halle.länge}m</strong>
                </p>
                <p>
                    <span>Breite</span>
                    <strong>{halle.savedHalleBreite || halle.breite}m</strong>
                </p>
                <p>
                    <span>Höhe</span>
                    <strong>{halle.savedHalleHöhe || halle.höhe}m</strong>
                </p>
                <p>
                    <span>Dachart</span>
                    <strong>{halle.savedHalleDachArt || halle.dachArt}</strong>
                </p>
                <p>
                    <span>Hallenart</span>
                    <strong>{halle.savedHalleArt || halle.hallenArt}</strong>
                </p>
            </div>
        </div>
    )
}