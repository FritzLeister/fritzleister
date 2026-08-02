import DoorFrontIcon from '@mui/icons-material/DoorFront';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

import StraightenIcon from '@mui/icons-material/Straighten';
import HouseSidingIcon from '@mui/icons-material/HouseSiding';
import GavelIcon from '@mui/icons-material/Gavel';
import SquareFootIcon from '@mui/icons-material/SquareFoot';
import AppsIcon from '@mui/icons-material/Apps';

import { useState, useRef, useLayoutEffect, useCallback, useMemo, useEffect } from 'react';

import UiButton from './UiButton';
import UiButtonEdit from './UiButtonEdit';
import OpeningMovementHint from './OpeningMovementHint';
import { hasAnyOpeningCollision } from './openingUtils';
import ÖffnungenUi from './ÖffnungenKomp/ÖffnungUi'
import LeerÖffnungBearbeiten from './ÖffnungenKomp/LeerÖffnungBearbeiten'
import WandFensterBearbeiten from './ÖffnungenKomp/WandFensterBearbeiten'
import TürÖffnungBearbeiten from './ÖffnungenKomp/TürÖffnungBearbeiten'
import SektionalTorBearbeiten from './ÖffnungenKomp/SektionalTorBearbeiten'
import SchiebeTürBearbeiten from './ÖffnungenKomp/SchiebeTürBearbeiten'
import RollTorBearbeiten from './ÖffnungenKomp/RollTorBearbeiten'
import TransparentesPaneelBearbeiten from './ÖffnungenKomp/TransparentesPaneelBearbeiten'
import LaderampeBearbeiten from './ÖffnungenKomp/LaderampeBearbeiten'
import LichtKuppelBearbeiten from './ÖffnungenKomp/LichtKuppelBearbeiten'
import PhotovoltaikBearbeiten from './ÖffnungenKomp/PhotovoltaikBearbeiten'

const ADD_PANEL_LEFT = 20
const ADD_PANEL_WIDTH = 250
const PANEL_GAP = 10
const UI_PANEL_ANIMATION_MS = 180
const UI_BUTTON_EDIT_PANEL_NAMES = new Set(['Abmessungen', 'Verkleidung', 'Konstruktion', 'Angebot'])

export default function Add({ 
    addObj, 
  canRedo,
  canUndo,
    editMenü, 
  onRedo,
  onUndo,
    setEditMenü,
  setShowApp3,
  setShowAppKontakt,
    clickedButtonPos,
    selectedObject,
    objs,
    setObjs,
    // Abmessungs-Props
    breite,
    setBreite,
    länge,
    setLänge,
    höhe,
    setHöhe,
    dachArt,
    setDachArt,
    traufhöhe,
    setTraufhöhe,
    dachneigung,
    setDachneigung,
    sockelhöhe,
    setSockelhöhe,
    dachAusrichtung,
    setDachAusrichtung,
    diffTraufFirst,
    setDiffTraufFirst,
    // Verkleidungs-Props
    wandGeometrieVorgaben,
    setWandGeometrieVorgaben,
    isolierung,
    setIsolierung,
    paneeltyp,
    setPaneeltyp,
      paneelBreiteMm,
      setPaneelBreiteMm,
    wandOrientierung,
    setWandOrientierung,
    farbSchema,
    setFarbSchema,
    außenFarbe,
    setAußenFarbe,
    außenFarbeMuster,
    setAußenFarbeMuster,
    musterVerortung,
    setMusterVerortung,
    dachIsolierung,
    setDachIsolierung,
    dachPaneeltyp,
    setDachPaneeltyp,
    dachPaneelBreiteMm,
    setDachPaneelBreiteMm,
    dachAußenFarbe,
    setDachAußenFarbe,
    dachPvcName,
    setDachPvcName,
    pvcName,
    setPvcName,
    // Öffnungs-Props
    fensterFarbe,
    setFensterFarbe,
    türFarbe,
    setTürFarbe,
    schiebeTorFarbe,
    setSchiebeTorFarbe,
    rollTorFarbe,
    setRollTorFarbe,
    sektionalTorFarbe,
    setSektionalTorFarbe,
    türFarbeInnen,
    setTürFarbeInnen,
    sektionalTorFarbeInnen,
    setSektionalTorFarbeInnen,
    // Angebots-Props
    gebäudeZweck,
    setGebäudeZweck,
    bauBeginn,
    setBauBeginn,
    anwerbungKunden,
    setAnwerbungKunden,
    größeGebäudeM2,
    setGrößeGebäudeM2,
    // Konstruktions-Props
    bodenplatteFarbe,
    setBodenplatteFarbe,
    rahmenFarbe,
    setRahmenFarbe,
    sekundärKonstruktionsFarbe,
    setSekundärKonstruktionsFarbe,
    sekundärHolzKonstruktionsFarbe,
    setSekundärHolzKonstruktionsFarbe,
    // Zubehör-Props
    zubehörFarbe,
    setZubehörFarbe,
    kantenFarbe,
    setKantenFarbe,
    kranKapazität,
    setKranKapazität,
    // Darstellungs-Props
    abmessungenAnzeigen,
    setAbmessungenAnzeigen,
}) {
  const historyButtonStyle = (isEnabled) => ({
    width: 52,
    height: 52,
    borderRadius: 12,
    border: '1px solid rgba(12, 8, 8, 0.16)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: isEnabled ? 'rgba(255, 255, 255, 0.18)' : 'rgba(255, 255, 255, 0.08)',
    color: isEnabled ? '#000000' : 'rgba(0, 0, 0, 0.35)',
    cursor: isEnabled ? 'pointer' : 'not-allowed',
    transition: 'background-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease',
    pointerEvents: isEnabled ? 'auto' : 'none'
  })
    
  const [newId, setNewId] = useState(1);
  const hasSeenFirstOpeningHint = useRef(false);
  const [showOpeningHint, setShowOpeningHint] = useState(false);
  const [openingHintCycle, setOpeningHintCycle] = useState(0);
  const [uiEditPanelHeight, setUiEditPanelHeight] = useState(0)
  const targetUiEditPanel = UI_BUTTON_EDIT_PANEL_NAMES.has(editMenü) ? editMenü : ''
  const [renderedUiEditPanel, setRenderedUiEditPanel] = useState(targetUiEditPanel)
  const [isUiEditPanelVisible, setIsUiEditPanelVisible] = useState(Boolean(targetUiEditPanel))
  const hasOpeningOverlap = useMemo(() => hasAnyOpeningCollision(objs), [objs])

  useEffect(() => {
    let timeoutId
    let rafId

    if (targetUiEditPanel) {
      setRenderedUiEditPanel(targetUiEditPanel)
      rafId = window.requestAnimationFrame(() => {
        setIsUiEditPanelVisible(true)
      })
    } else {
      setIsUiEditPanelVisible(false)

      if (renderedUiEditPanel) {
        timeoutId = window.setTimeout(() => {
          setRenderedUiEditPanel('')
        }, UI_PANEL_ANIMATION_MS)
      }
    }

    return () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId)
      }
      if (rafId) {
        window.cancelAnimationFrame(rafId)
      }
    }
  }, [renderedUiEditPanel, targetUiEditPanel])

  const handleOpeningCreated = useCallback((...args) => {
    addObj(...args)
    setOpeningHintCycle((prev) => prev + 1)

    if (!hasSeenFirstOpeningHint.current) {
      hasSeenFirstOpeningHint.current = true
      setShowOpeningHint(true)
    }
  }, [addObj])

  const isAbmessungenOpen = renderedUiEditPanel === 'Abmessungen'

  useLayoutEffect(() => {
    if (!isAbmessungenOpen) {
      setUiEditPanelHeight(0)
      return
    }

    const measurePanelHeight = () => {
      const panel = document.getElementById('ui-button-edit-panel')
      if (!panel) return
      const measuredHeight = panel.getBoundingClientRect().height
      setUiEditPanelHeight(Math.round(measuredHeight))
    }

    measurePanelHeight()
    const rafId = window.requestAnimationFrame(measurePanelHeight)
    window.addEventListener('resize', measurePanelHeight)

    return () => {
      window.cancelAnimationFrame(rafId)
      window.removeEventListener('resize', measurePanelHeight)
    }
  }, [isAbmessungenOpen])

  const historyControlsTop = isAbmessungenOpen
    ? 20 + uiEditPanelHeight + PANEL_GAP
    : 20
  const historyControlsLeft = ADD_PANEL_LEFT + ADD_PANEL_WIDTH + PANEL_GAP

  /*
  return (
    <>
      <Box sx={{ height: 2, transform: 'translateZ(0px)', flexGrow: 1 }}>
        <SpeedDial
          ariaLabel="SpeedDial basic example"
          sx={{ position: 'absolute', bottom: 16, right: 16 }}
          icon={<SpeedDialIcon />}
          direction='left'
        >
          {actions.map((action) => (
            <SpeedDialAction
              key={action.name}
              icon={action.icon}
              onClick={action.func}
              slotProps={{
                tooltip: {
                  title: action.name,
                }}}
            />
          ))}
        </SpeedDial>
      </Box>
    </>
  );
  */

  return(
    <>
      <div style={{
            position: 'fixed',
          top: historyControlsTop,
          left: historyControlsLeft,
            display: 'flex',
            gap: 5,
            zIndex: 1000,
        }}>
          <div
            style={historyButtonStyle(canUndo)}
            onClick={onUndo}
            title="Rückgängig"
            onMouseEnter={(e) => {
              if (!canUndo) return
              e.currentTarget.style.backgroundColor = 'rgba(200, 200, 200, 0.25)'
              e.currentTarget.style.boxShadow = '0 6px 18px rgba(0,0,0,0.2)'
              e.currentTarget.style.transform = 'translateY(-1px)'
            }}
            onMouseLeave={(e) => {
              if (!canUndo) return
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.18)'
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            <ArrowBackIcon fontSize='medium' />
          </div>

          <div
            style={historyButtonStyle(canRedo)}
            onClick={onRedo}
            title="Wiederholen"
            onMouseEnter={(e) => {
              if (!canRedo) return
              e.currentTarget.style.backgroundColor = 'rgba(200, 200, 200, 0.25)'
              e.currentTarget.style.boxShadow = '0 6px 18px rgba(0,0,0,0.2)'
              e.currentTarget.style.transform = 'translateY(-1px)'
            }}
            onMouseLeave={(e) => {
              if (!canRedo) return
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.18)'
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            <ArrowForwardIcon fontSize='medium' />
          </div>
      </div>

      <div style={{
            position: "fixed",
            top: 20,
            left: 20,
            background: "rgba(255, 255, 255, 0.15)", // halbtransparent
            backdropFilter: "blur(10px)",             // Blur-Effekt
            WebkitBackdropFilter: "blur(10px)",       // Safari-Support
            borderRadius: 12,
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)", // etwas stärkerer Schatten
            color: "#000000ff",                            // besserer Kontrast
            width: 250,
            height: 'fit-content',
            border: "1px solid rgba(255, 255, 255, 0.2)", // dezenter Rand
            zIndex: 999,
            // visibility: türAttribute ? "inherit" : "hidden"
        }}>
          {/* Abmessungen */}
          <UiButton 
          icon={<StraightenIcon 
          fontSize='medium'/>} 
          name={'Abmessungen'} 
          onClick={() => setEditMenü(editMenü === 'Abmessungen' ? '' : 'Abmessungen')} 
          isActive={editMenü === 'Abmessungen'}
          />

          <UiButton
          icon={<AppsIcon fontSize='medium' />}
          name={'Felder'}
          onClick={() => setEditMenü(editMenü === 'Felder' ? '' : 'Felder')}
          isActive={editMenü === 'Felder'}
          />

          {/* Verkleidung */}
          <UiButton 
          icon={<HouseSidingIcon fontSize='medium'/>} 
          name={'Verkleidung'} 
          onClick={() => setEditMenü(editMenü === 'Verkleidung' ? '' : 'Verkleidung')}
          isActive={editMenü === 'Verkleidung'}
          />

          {/* Öffnungen */}
          <UiButton 
          icon={<DoorFrontIcon fontSize='medium'/>} 
          name={'Öffnungen'}
          onClick={() => setEditMenü(editMenü === 'Öffnungen' ? '' : 'Öffnungen')}
          isActive={editMenü === 'Öffnungen'}
          />

          {/* Zubehör aktuell nicht nötig deswegen auskommentiert */}
          {/*
          <UiButton 
          icon={<ViewWeekIcon fontSize='medium'/>} 
          name={'Zubehör'} 
          onClick={() => setEditMenü(editMenü === 'Zubehör' ? '' : 'Zubehör')}
          isActive={editMenü === 'Zubehör'}
          />
          */}

          {/* Konstruktion */}
          <UiButton 
          icon={<SquareFootIcon fontSize='medium' />}
          name={'Konstruktion'}
          onClick={() => setEditMenü(editMenü === 'Konstruktion' ? '' : 'Konstruktion')}
          isActive={editMenü === 'Konstruktion'}
          />

          {/* Angebot (Andersfarbig) */}
          <UiButton 
          icon={<GavelIcon fontSize='medium'/>} 
          name={'Angebot'} 
          onClick={() => setEditMenü(editMenü === 'Angebot' ? '' : 'Angebot')}
          disabled={hasOpeningOverlap}
          isActive={editMenü === 'Angebot'}
          />


        </div>

        {renderedUiEditPanel === 'Abmessungen' && <UiButtonEdit 
            name={"Abmessungen"} 
            height={0} 
          enablePanelAnimation
          isVisible={isUiEditPanelVisible}
            breite={breite}
            setBreite={setBreite}
            länge={länge}
            setLänge={setLänge}
            höhe={höhe}
            setHöhe={setHöhe}
            dachArt={dachArt}
            setDachArt={setDachArt}
            traufhöhe={traufhöhe}
            setTraufhöhe={setTraufhöhe}
            dachneigung={dachneigung}
            setDachneigung={setDachneigung}
            sockelhöhe={sockelhöhe}
            setSockelhöhe={setSockelhöhe}
            dachAusrichtung={dachAusrichtung}
            setDachAusrichtung={setDachAusrichtung}
            diffTraufFirst={diffTraufFirst}
            setDiffTraufFirst={setDiffTraufFirst}
            wandGeometrieVorgaben={wandGeometrieVorgaben}
            setWandGeometrieVorgaben={setWandGeometrieVorgaben}
            isolierung={isolierung}
            setIsolierung={setIsolierung}
            paneeltyp={paneeltyp}
            setPaneeltyp={setPaneeltyp}
              paneelBreiteMm={paneelBreiteMm}
              setPaneelBreiteMm={setPaneelBreiteMm}
            wandOrientierung={wandOrientierung}
            setWandOrientierung={setWandOrientierung}
            farbSchema={farbSchema}
            setFarbSchema={setFarbSchema}
            außenFarbe={außenFarbe}
            setAußenFarbe={setAußenFarbe}
            außenFarbeMuster={außenFarbeMuster}
            setAußenFarbeMuster={setAußenFarbeMuster}
            musterVerortung={musterVerortung}
            setMusterVerortung={setMusterVerortung}
            dachIsolierung={dachIsolierung}
            setDachIsolierung={setDachIsolierung}
            dachPaneeltyp={dachPaneeltyp}
            setDachPaneeltyp={setDachPaneeltyp}
            dachAußenFarbe={dachAußenFarbe}
            setDachAußenFarbe={setDachAußenFarbe}
            dachPvcName={dachPvcName}
            setDachPvcName={setDachPvcName}
            pvcName={pvcName}
            setPvcName={setPvcName}
            fensterFarbe={fensterFarbe}
            setFensterFarbe={setFensterFarbe}
            türFarbe={türFarbe}
            setTürFarbe={setTürFarbe}
            schiebeTorFarbe={schiebeTorFarbe}
            setSchiebeTorFarbe={setSchiebeTorFarbe}
            rollTorFarbe={rollTorFarbe}
            setRollTorFarbe={setRollTorFarbe}
            sektionalTorFarbe={sektionalTorFarbe}
            setSektionalTorFarbe={setSektionalTorFarbe}
            türFarbeInnen={türFarbeInnen}
            setTürFarbeInnen={setTürFarbeInnen}
            sektionalTorFarbeInnen={sektionalTorFarbeInnen}
            setSektionalTorFarbeInnen={setSektionalTorFarbeInnen}
            gebäudeZweck={gebäudeZweck}
            setGebäudeZweck={setGebäudeZweck}
            bauBeginn={bauBeginn}
            setBauBeginn={setBauBeginn}
            anwerbungKunden={anwerbungKunden}
            setAnwerbungKunden={setAnwerbungKunden}
            größeGebäudeM2={größeGebäudeM2}
            setGrößeGebäudeM2={setGrößeGebäudeM2}
            bodenplatteFarbe={bodenplatteFarbe}
            setBodenplatteFarbe={setBodenplatteFarbe}
            rahmenFarbe={rahmenFarbe}
            setRahmenFarbe={setRahmenFarbe}
            sekundärKonstruktionsFarbe={sekundärKonstruktionsFarbe}
            setSekundärKonstruktionsFarbe={setSekundärKonstruktionsFarbe}
            sekundärHolzKonstruktionsFarbe={sekundärHolzKonstruktionsFarbe}
            setSekundärHolzKonstruktionsFarbe={setSekundärHolzKonstruktionsFarbe}
            zubehörFarbe={zubehörFarbe}
            setZubehörFarbe={setZubehörFarbe}
            kantenFarbe={kantenFarbe}
            setKantenFarbe={setKantenFarbe}
            kranKapazität={kranKapazität}
            setKranKapazität={setKranKapazität}
            objs={objs}
            abmessungenAnzeigen={abmessungenAnzeigen}
            setAbmessungenAnzeigen={setAbmessungenAnzeigen}
        /> }
        {/* editMenü === 'Felder' && <UiButtonEdit name={'Felder'} height={1} /> */ }
        {renderedUiEditPanel === 'Verkleidung' && <UiButtonEdit 
            name={"Verkleidung"} 
            height={2} 
          enablePanelAnimation
          isVisible={isUiEditPanelVisible}
            breite={breite}
            setBreite={setBreite}
            länge={länge}
            setLänge={setLänge}
            höhe={höhe}
            setHöhe={setHöhe}
            dachArt={dachArt}
            setDachArt={setDachArt}
            traufhöhe={traufhöhe}
            setTraufhöhe={setTraufhöhe}
            dachneigung={dachneigung}
            setDachneigung={setDachneigung}
            sockelhöhe={sockelhöhe}
            setSockelhöhe={setSockelhöhe}
            dachAusrichtung={dachAusrichtung}
            setDachAusrichtung={setDachAusrichtung}
            diffTraufFirst={diffTraufFirst}
            setDiffTraufFirst={setDiffTraufFirst}
            wandGeometrieVorgaben={wandGeometrieVorgaben}
            setWandGeometrieVorgaben={setWandGeometrieVorgaben}
            isolierung={isolierung}
            setIsolierung={setIsolierung}
            paneeltyp={paneeltyp}
            setPaneeltyp={setPaneeltyp}
            paneelBreiteMm={paneelBreiteMm}
            setPaneelBreiteMm={setPaneelBreiteMm}
            wandOrientierung={wandOrientierung}
            setWandOrientierung={setWandOrientierung}
            farbSchema={farbSchema}
            setFarbSchema={setFarbSchema}
            außenFarbe={außenFarbe}
            setAußenFarbe={setAußenFarbe}
            außenFarbeMuster={außenFarbeMuster}
            setAußenFarbeMuster={setAußenFarbeMuster}
            musterVerortung={musterVerortung}
            setMusterVerortung={setMusterVerortung}
            dachIsolierung={dachIsolierung}
            setDachIsolierung={setDachIsolierung}
            dachPaneeltyp={dachPaneeltyp}
            setDachPaneeltyp={setDachPaneeltyp}
            dachPaneelBreiteMm={dachPaneelBreiteMm}
            setDachPaneelBreiteMm={setDachPaneelBreiteMm}
            dachAußenFarbe={dachAußenFarbe}
            setDachAußenFarbe={setDachAußenFarbe}
            dachPvcName={dachPvcName}
            setDachPvcName={setDachPvcName}
            pvcName={pvcName}
            setPvcName={setPvcName}
            fensterFarbe={fensterFarbe}
            setFensterFarbe={setFensterFarbe}
            türFarbe={türFarbe}
            setTürFarbe={setTürFarbe}
            schiebeTorFarbe={schiebeTorFarbe}
            setSchiebeTorFarbe={setSchiebeTorFarbe}
            rollTorFarbe={rollTorFarbe}
            setRollTorFarbe={setRollTorFarbe}
            sektionalTorFarbe={sektionalTorFarbe}
            setSektionalTorFarbe={setSektionalTorFarbe}
            türFarbeInnen={türFarbeInnen}
            setTürFarbeInnen={setTürFarbeInnen}
            sektionalTorFarbeInnen={sektionalTorFarbeInnen}
            setSektionalTorFarbeInnen={setSektionalTorFarbeInnen}
            gebäudeZweck={gebäudeZweck}
            setGebäudeZweck={setGebäudeZweck}
            bauBeginn={bauBeginn}
            setBauBeginn={setBauBeginn}
            anwerbungKunden={anwerbungKunden}
            setAnwerbungKunden={setAnwerbungKunden}
            größeGebäudeM2={größeGebäudeM2}
            setGrößeGebäudeM2={setGrößeGebäudeM2}
            bodenplatteFarbe={bodenplatteFarbe}
            setBodenplatteFarbe={setBodenplatteFarbe}
            rahmenFarbe={rahmenFarbe}
            setRahmenFarbe={setRahmenFarbe}
            sekundärKonstruktionsFarbe={sekundärKonstruktionsFarbe}
            setSekundärKonstruktionsFarbe={setSekundärKonstruktionsFarbe}
            sekundärHolzKonstruktionsFarbe={sekundärHolzKonstruktionsFarbe}
            setSekundärHolzKonstruktionsFarbe={setSekundärHolzKonstruktionsFarbe}
            zubehörFarbe={zubehörFarbe}
            setZubehörFarbe={setZubehörFarbe}
            kantenFarbe={kantenFarbe}
            setKantenFarbe={setKantenFarbe}
            kranKapazität={kranKapazität}
            setKranKapazität={setKranKapazität}
            objs={objs}
            abmessungenAnzeigen={abmessungenAnzeigen}
            setAbmessungenAnzeigen={setAbmessungenAnzeigen}
        /> }

        {/* Öffnungen Ui aber brauch ich erstmal nicht ig */}
        {/* {editMenü === 'Öffnungen' && <UiButtonEdit 
            name={"Öffnungen"} 
            height={3} 
            breite={breite}
            setBreite={setBreite}
            länge={länge}
            setLänge={setLänge}
            höhe={höhe}
            setHöhe={setHöhe}
            dachArt={dachArt}
            setDachArt={setDachArt}
            traufhöhe={traufhöhe}
            setTraufhöhe={setTraufhöhe}
            dachneigung={dachneigung}
            setDachneigung={setDachneigung}
            sockelhöhe={sockelhöhe}
            setSockelhöhe={setSockelhöhe}
            dachAusrichtung={dachAusrichtung}
            setDachAusrichtung={setDachAusrichtung}
            diffTraufFirst={diffTraufFirst}
            setDiffTraufFirst={setDiffTraufFirst}
            wandGeometrieVorgaben={wandGeometrieVorgaben}
            setWandGeometrieVorgaben={setWandGeometrieVorgaben}
            isolierung={isolierung}
            setIsolierung={setIsolierung}
            paneeltyp={paneeltyp}
            setPaneeltyp={setPaneeltyp}
            wandOrientierung={wandOrientierung}
            setWandOrientierung={setWandOrientierung}
            farbSchema={farbSchema}
            setFarbSchema={setFarbSchema}
            außenFarbe={außenFarbe}
            setAußenFarbe={setAußenFarbe}
            außenFarbeMuster={außenFarbeMuster}
            setAußenFarbeMuster={setAußenFarbeMuster}
            musterVerortung={musterVerortung}
            setMusterVerortung={setMusterVerortung}
            dachIsolierung={dachIsolierung}
            setDachIsolierung={setDachIsolierung}
            dachPaneeltyp={dachPaneeltyp}
            setDachPaneeltyp={setDachPaneeltyp}
            dachAußenFarbe={dachAußenFarbe}
            setDachAußenFarbe={setDachAußenFarbe}
            dachPvcName={dachPvcName}
            setDachPvcName={setDachPvcName}
            pvcName={pvcName}
            setPvcName={setPvcName}
            fensterFarbe={fensterFarbe}
            setFensterFarbe={setFensterFarbe}
            türFarbe={türFarbe}
            setTürFarbe={setTürFarbe}
            schiebeTorFarbe={schiebeTorFarbe}
            setSchiebeTorFarbe={setSchiebeTorFarbe}
            rollTorFarbe={rollTorFarbe}
            setRollTorFarbe={setRollTorFarbe}
            sektionalTorFarbe={sektionalTorFarbe}
            setSektionalTorFarbe={setSektionalTorFarbe}
            türFarbeInnen={türFarbeInnen}
            setTürFarbeInnen={setTürFarbeInnen}
            sektionalTorFarbeInnen={sektionalTorFarbeInnen}
            setSektionalTorFarbeInnen={setSektionalTorFarbeInnen}
            gebäudeZweck={gebäudeZweck}
            setGebäudeZweck={setGebäudeZweck}
            bauBeginn={bauBeginn}
            setBauBeginn={setBauBeginn}
            anwerbungKunden={anwerbungKunden}
            setAnwerbungKunden={setAnwerbungKunden}
            größeGebäudeM2={größeGebäudeM2}
            setGrößeGebäudeM2={setGrößeGebäudeM2}
            bodenplatteFarbe={bodenplatteFarbe}
            setBodenplatteFarbe={setBodenplatteFarbe}
            rahmenFarbe={rahmenFarbe}
            setRahmenFarbe={setRahmenFarbe}
            sekundärKonstruktionsFarbe={sekundärKonstruktionsFarbe}
            setSekundärKonstruktionsFarbe={setSekundärKonstruktionsFarbe}
            sekundärHolzKonstruktionsFarbe={sekundärHolzKonstruktionsFarbe}
            setSekundärHolzKonstruktionsFarbe={setSekundärHolzKonstruktionsFarbe}
            zubehörFarbe={zubehörFarbe}
            setZubehörFarbe={setZubehörFarbe}
            kantenFarbe={kantenFarbe}
            setKantenFarbe={setKantenFarbe}
            kranKapazität={kranKapazität}
            setKranKapazität={setKranKapazität}
            abmessungenAnzeigen={abmessungenAnzeigen}
            setAbmessungenAnzeigen={setAbmessungenAnzeigen}
        /> } */}
        {editMenü === 'Öffnungen-Auswahl' && <ÖffnungenUi wand={true} lang={clickedButtonPos?.lang ?? true} rechts={clickedButtonPos?.rechts ?? true} addObj={handleOpeningCreated} setEditMenü={setEditMenü} newId={newId} setNewId={setNewId} clickedButtonPos={clickedButtonPos} gebäudeBreite={breite} gebäudeLänge={länge} gebäudeHöhe={höhe} dachArt={dachArt} dachneigung={dachneigung} />}
        {editMenü === 'Öffnungen-Dach-Auswahl' && <ÖffnungenUi wand={false} lang={false} rechts={clickedButtonPos?.rechts ?? true} addObj={handleOpeningCreated} setEditMenü={setEditMenü} newId={newId} setNewId={setNewId} clickedButtonPos={clickedButtonPos} gebäudeBreite={breite} gebäudeLänge={länge} gebäudeHöhe={höhe} dachArt={dachArt} dachneigung={dachneigung} />}
        {editMenü === 'LeerÖffnung-Bearbeiten' && selectedObject?.type === 'leeröffnung' && <LeerÖffnungBearbeiten selectedObject={selectedObject} setEditMenü={setEditMenü} objs={objs} setObjs={setObjs} gebäudeHöhe={höhe} gebäudeBreite={breite} gebäudeLänge={länge} dachArt={dachArt} dachneigung={dachneigung} />}
        {editMenü === 'Fenster-Bearbeiten' && selectedObject?.type === 'fenster' && <WandFensterBearbeiten selectedObject={selectedObject} setEditMenü={setEditMenü} objs={objs} setObjs={setObjs} gebäudeHöhe={höhe} gebäudeBreite={breite} gebäudeLänge={länge} />}
        {editMenü === 'Tür-Bearbeiten' && selectedObject?.type === 'tür-öffnung' && <TürÖffnungBearbeiten selectedObject={selectedObject} setEditMenü={setEditMenü} objs={objs} setObjs={setObjs} gebäudeHöhe={höhe} gebäudeBreite={breite} gebäudeLänge={länge} />}
        {editMenü === 'SektionalTor-Bearbeiten' && <SektionalTorBearbeiten selectedObject={selectedObject} setEditMenü={setEditMenü} objs={objs} setObjs={setObjs} gebäudeHöhe={höhe} gebäudeBreite={breite} gebäudeLänge={länge} />}
        {editMenü === 'Schiebetür-Bearbeiten' && selectedObject?.type === 'schiebetür' && <SchiebeTürBearbeiten selectedObject={selectedObject} setEditMenü={setEditMenü} objs={objs} setObjs={setObjs} gebäudeHöhe={höhe} gebäudeBreite={breite} gebäudeLänge={länge} />}
        {editMenü === 'Rolltor-Bearbeiten' && selectedObject?.type === 'rolltor' && <RollTorBearbeiten selectedObject={selectedObject} setEditMenü={setEditMenü} objs={objs} setObjs={setObjs} gebäudeHöhe={höhe} gebäudeBreite={breite} gebäudeLänge={länge} />}
        {editMenü === 'TransparentesPaneel-Bearbeiten' && selectedObject?.type === 'transparentespaneel' && <TransparentesPaneelBearbeiten selectedObject={selectedObject} setEditMenü={setEditMenü} objs={objs} setObjs={setObjs} gebäudeHöhe={höhe} gebäudeBreite={breite} gebäudeLänge={länge} />}
        {editMenü === 'Laderampe-Bearbeiten' && selectedObject?.type === 'laderampe' && <LaderampeBearbeiten selectedObject={selectedObject} setEditMenü={setEditMenü} objs={objs} setObjs={setObjs} gebäudeHöhe={höhe} gebäudeBreite={breite} gebäudeLänge={länge} />}
        {editMenü === 'Lichtkuppel-Bearbeiten' && selectedObject?.type === 'kleinlichtskuppel' && <LichtKuppelBearbeiten selectedObject={selectedObject} setEditMenü={setEditMenü} objs={objs} setObjs={setObjs} gebäudeBreite={breite} gebäudeLänge={länge} gebäudeHöhe={höhe} />}
        {editMenü === 'Photovoltaik-Bearbeiten' && selectedObject && <PhotovoltaikBearbeiten selectedObject={selectedObject} setEditMenü={setEditMenü} objs={objs} setObjs={setObjs} gebäudeHöhe={höhe} gebäudeBreite={breite} gebäudeLänge={länge} />}

        {/* Zubehör aktuell nicht nötig deswegen auskommentiert */}
        {/*
        editMenü === 'Zubehör' && <UiButtonEdit 
            name={"Zubehör"} 
            height={4} 
            breite={breite}
            setBreite={setBreite}
            länge={länge}
            setLänge={setLänge}
            höhe={höhe}
            setHöhe={setHöhe}
            dachArt={dachArt}
            setDachArt={setDachArt}
            traufhöhe={traufhöhe}
            setTraufhöhe={setTraufhöhe}
            dachneigung={dachneigung}
            setDachneigung={setDachneigung}
            sockelhöhe={sockelhöhe}
            setSockelhöhe={setSockelhöhe}
            dachAusrichtung={dachAusrichtung}
            setDachAusrichtung={setDachAusrichtung}
            diffTraufFirst={diffTraufFirst}
            setDiffTraufFirst={setDiffTraufFirst}
            wandGeometrieVorgaben={wandGeometrieVorgaben}
            setWandGeometrieVorgaben={setWandGeometrieVorgaben}
            isolierung={isolierung}
            setIsolierung={setIsolierung}
            paneeltyp={paneeltyp}
            setPaneeltyp={setPaneeltyp}
            wandOrientierung={wandOrientierung}
            setWandOrientierung={setWandOrientierung}
            farbSchema={farbSchema}
            setFarbSchema={setFarbSchema}
            außenFarbe={außenFarbe}
            setAußenFarbe={setAußenFarbe}
            außenFarbeMuster={außenFarbeMuster}
            setAußenFarbeMuster={setAußenFarbeMuster}
            musterVerortung={musterVerortung}
            setMusterVerortung={setMusterVerortung}
            dachIsolierung={dachIsolierung}
            setDachIsolierung={setDachIsolierung}
            dachPaneeltyp={dachPaneeltyp}
            setDachPaneeltyp={setDachPaneeltyp}
            dachAußenFarbe={dachAußenFarbe}
            setDachAußenFarbe={setDachAußenFarbe}
            dachPvcName={dachPvcName}
            setDachPvcName={setDachPvcName}
            pvcName={pvcName}
            setPvcName={setPvcName}
            fensterFarbe={fensterFarbe}
            setFensterFarbe={setFensterFarbe}
            türFarbe={türFarbe}
            setTürFarbe={setTürFarbe}
            schiebeTorFarbe={schiebeTorFarbe}
            setSchiebeTorFarbe={setSchiebeTorFarbe}
            rollTorFarbe={rollTorFarbe}
            setRollTorFarbe={setRollTorFarbe}
            sektionalTorFarbe={sektionalTorFarbe}
            setSektionalTorFarbe={setSektionalTorFarbe}
            türFarbeInnen={türFarbeInnen}
            setTürFarbeInnen={setTürFarbeInnen}
            sektionalTorFarbeInnen={sektionalTorFarbeInnen}
            setSektionalTorFarbeInnen={setSektionalTorFarbeInnen}
            gebäudeZweck={gebäudeZweck}
            setGebäudeZweck={setGebäudeZweck}
            bauBeginn={bauBeginn}
            setBauBeginn={setBauBeginn}
            anwerbungKunden={anwerbungKunden}
            setAnwerbungKunden={setAnwerbungKunden}
            größeGebäudeM2={größeGebäudeM2}
            setGrößeGebäudeM2={setGrößeGebäudeM2}
            bodenplatteFarbe={bodenplatteFarbe}
            setBodenplatteFarbe={setBodenplatteFarbe}
            rahmenFarbe={rahmenFarbe}
            setRahmenFarbe={setRahmenFarbe}
            sekundärKonstruktionsFarbe={sekundärKonstruktionsFarbe}
            setSekundärKonstruktionsFarbe={setSekundärKonstruktionsFarbe}
            sekundärHolzKonstruktionsFarbe={sekundärHolzKonstruktionsFarbe}
            setSekundärHolzKonstruktionsFarbe={setSekundärHolzKonstruktionsFarbe}
            zubehörFarbe={zubehörFarbe}
            setZubehörFarbe={setZubehörFarbe}
            kantenFarbe={kantenFarbe}
            setKantenFarbe={setKantenFarbe}
            kranKapazität={kranKapazität}
            setKranKapazität={setKranKapazität}
            abmessungenAnzeigen={abmessungenAnzeigen}
            setAbmessungenAnzeigen={setAbmessungenAnzeigen}
        /> 
        */}

        {renderedUiEditPanel === 'Konstruktion' && <UiButtonEdit 
            name={"Konstruktion"} 
          height={4} 
            enablePanelAnimation
            isVisible={isUiEditPanelVisible}
            breite={breite}
            setBreite={setBreite}
            länge={länge}
            setLänge={setLänge}
            höhe={höhe}
            setHöhe={setHöhe}
            dachArt={dachArt}
            setDachArt={setDachArt}
            traufhöhe={traufhöhe}
            setTraufhöhe={setTraufhöhe}
            dachneigung={dachneigung}
            setDachneigung={setDachneigung}
            sockelhöhe={sockelhöhe}
            setSockelhöhe={setSockelhöhe}
            dachAusrichtung={dachAusrichtung}
            setDachAusrichtung={setDachAusrichtung}
            diffTraufFirst={diffTraufFirst}
            setDiffTraufFirst={setDiffTraufFirst}
            wandGeometrieVorgaben={wandGeometrieVorgaben}
            setWandGeometrieVorgaben={setWandGeometrieVorgaben}
            isolierung={isolierung}
            setIsolierung={setIsolierung}
            paneeltyp={paneeltyp}
            setPaneeltyp={setPaneeltyp}
            wandOrientierung={wandOrientierung}
            setWandOrientierung={setWandOrientierung}
            farbSchema={farbSchema}
            setFarbSchema={setFarbSchema}
            außenFarbe={außenFarbe}
            setAußenFarbe={setAußenFarbe}
            außenFarbeMuster={außenFarbeMuster}
            setAußenFarbeMuster={setAußenFarbeMuster}
            musterVerortung={musterVerortung}
            setMusterVerortung={setMusterVerortung}
            dachIsolierung={dachIsolierung}
            setDachIsolierung={setDachIsolierung}
            dachPaneeltyp={dachPaneeltyp}
            setDachPaneeltyp={setDachPaneeltyp}
            dachAußenFarbe={dachAußenFarbe}
            setDachAußenFarbe={setDachAußenFarbe}
            dachPvcName={dachPvcName}
            setDachPvcName={setDachPvcName}
            pvcName={pvcName}
            setPvcName={setPvcName}
            fensterFarbe={fensterFarbe}
            setFensterFarbe={setFensterFarbe}
            türFarbe={türFarbe}
            setTürFarbe={setTürFarbe}
            schiebeTorFarbe={schiebeTorFarbe}
            setSchiebeTorFarbe={setSchiebeTorFarbe}
            rollTorFarbe={rollTorFarbe}
            setRollTorFarbe={setRollTorFarbe}
            sektionalTorFarbe={sektionalTorFarbe}
            setSektionalTorFarbe={setSektionalTorFarbe}
            türFarbeInnen={türFarbeInnen}
            setTürFarbeInnen={setTürFarbeInnen}
            sektionalTorFarbeInnen={sektionalTorFarbeInnen}
            setSektionalTorFarbeInnen={setSektionalTorFarbeInnen}
            gebäudeZweck={gebäudeZweck}
            setGebäudeZweck={setGebäudeZweck}
            bauBeginn={bauBeginn}
            setBauBeginn={setBauBeginn}
            anwerbungKunden={anwerbungKunden}
            setAnwerbungKunden={setAnwerbungKunden}
            größeGebäudeM2={größeGebäudeM2}
            setGrößeGebäudeM2={setGrößeGebäudeM2}
            bodenplatteFarbe={bodenplatteFarbe}
            setBodenplatteFarbe={setBodenplatteFarbe}
            rahmenFarbe={rahmenFarbe}
            setRahmenFarbe={setRahmenFarbe}
            sekundärKonstruktionsFarbe={sekundärKonstruktionsFarbe}
            setSekundärKonstruktionsFarbe={setSekundärKonstruktionsFarbe}
            sekundärHolzKonstruktionsFarbe={sekundärHolzKonstruktionsFarbe}
            setSekundärHolzKonstruktionsFarbe={setSekundärHolzKonstruktionsFarbe}
            zubehörFarbe={zubehörFarbe}
            setZubehörFarbe={setZubehörFarbe}
            kantenFarbe={kantenFarbe}
            setKantenFarbe={setKantenFarbe}
            kranKapazität={kranKapazität}
            setKranKapazität={setKranKapazität}
            abmessungenAnzeigen={abmessungenAnzeigen}
            setAbmessungenAnzeigen={setAbmessungenAnzeigen}
        /> }
        
        {renderedUiEditPanel === 'Angebot' && <UiButtonEdit 
            name={"Angebot"} 
          height={5} 
            enablePanelAnimation
            isVisible={isUiEditPanelVisible}
            setShowApp3={setShowApp3}
            setShowAppKontakt={setShowAppKontakt}
            breite={breite}
            setBreite={setBreite}
            länge={länge}
            setLänge={setLänge}
            höhe={höhe}
            setHöhe={setHöhe}
            dachArt={dachArt}
            setDachArt={setDachArt}
            traufhöhe={traufhöhe}
            setTraufhöhe={setTraufhöhe}
            dachneigung={dachneigung}
            setDachneigung={setDachneigung}
            sockelhöhe={sockelhöhe}
            setSockelhöhe={setSockelhöhe}
            dachAusrichtung={dachAusrichtung}
            setDachAusrichtung={setDachAusrichtung}
            diffTraufFirst={diffTraufFirst}
            setDiffTraufFirst={setDiffTraufFirst}
            wandGeometrieVorgaben={wandGeometrieVorgaben}
            setWandGeometrieVorgaben={setWandGeometrieVorgaben}
            isolierung={isolierung}
            setIsolierung={setIsolierung}
            paneeltyp={paneeltyp}
            setPaneeltyp={setPaneeltyp}
            wandOrientierung={wandOrientierung}
            setWandOrientierung={setWandOrientierung}
            farbSchema={farbSchema}
            setFarbSchema={setFarbSchema}
            außenFarbe={außenFarbe}
            setAußenFarbe={setAußenFarbe}
            außenFarbeMuster={außenFarbeMuster}
            setAußenFarbeMuster={setAußenFarbeMuster}
            musterVerortung={musterVerortung}
            setMusterVerortung={setMusterVerortung}
            dachIsolierung={dachIsolierung}
            setDachIsolierung={setDachIsolierung}
            dachPaneeltyp={dachPaneeltyp}
            setDachPaneeltyp={setDachPaneeltyp}
            dachAußenFarbe={dachAußenFarbe}
            setDachAußenFarbe={setDachAußenFarbe}
            dachPvcName={dachPvcName}
            setDachPvcName={setDachPvcName}
            pvcName={pvcName}
            setPvcName={setPvcName}
            fensterFarbe={fensterFarbe}
            setFensterFarbe={setFensterFarbe}
            türFarbe={türFarbe}
            setTürFarbe={setTürFarbe}
            schiebeTorFarbe={schiebeTorFarbe}
            setSchiebeTorFarbe={setSchiebeTorFarbe}
            rollTorFarbe={rollTorFarbe}
            setRollTorFarbe={setRollTorFarbe}
            sektionalTorFarbe={sektionalTorFarbe}
            setSektionalTorFarbe={setSektionalTorFarbe}
            türFarbeInnen={türFarbeInnen}
            setTürFarbeInnen={setTürFarbeInnen}
            sektionalTorFarbeInnen={sektionalTorFarbeInnen}
            setSektionalTorFarbeInnen={setSektionalTorFarbeInnen}
            gebäudeZweck={gebäudeZweck}
            setGebäudeZweck={setGebäudeZweck}
            bauBeginn={bauBeginn}
            setBauBeginn={setBauBeginn}
            anwerbungKunden={anwerbungKunden}
            setAnwerbungKunden={setAnwerbungKunden}
            größeGebäudeM2={größeGebäudeM2}
            setGrößeGebäudeM2={setGrößeGebäudeM2}
            bodenplatteFarbe={bodenplatteFarbe}
            setBodenplatteFarbe={setBodenplatteFarbe}
            rahmenFarbe={rahmenFarbe}
            setRahmenFarbe={setRahmenFarbe}
            sekundärKonstruktionsFarbe={sekundärKonstruktionsFarbe}
            setSekundärKonstruktionsFarbe={setSekundärKonstruktionsFarbe}
            sekundärHolzKonstruktionsFarbe={sekundärHolzKonstruktionsFarbe}
            setSekundärHolzKonstruktionsFarbe={setSekundärHolzKonstruktionsFarbe}
            zubehörFarbe={zubehörFarbe}
            setZubehörFarbe={setZubehörFarbe}
            kantenFarbe={kantenFarbe}
            setKantenFarbe={setKantenFarbe}
            kranKapazität={kranKapazität}
            setKranKapazität={setKranKapazität}
            abmessungenAnzeigen={abmessungenAnzeigen}
            setAbmessungenAnzeigen={setAbmessungenAnzeigen}
        /> }

        <OpeningMovementHint
          editMenü={editMenü}
          isFirstOpening={showOpeningHint}
          openingCreatedCycle={openingHintCycle}
        />
    </>
  )
}
