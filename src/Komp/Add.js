import DoorFrontIcon from '@mui/icons-material/DoorFront';

import StraightenIcon from '@mui/icons-material/Straighten';
import HouseSidingIcon from '@mui/icons-material/HouseSiding';
import GavelIcon from '@mui/icons-material/Gavel';
import SquareFootIcon from '@mui/icons-material/SquareFoot';
import AppsIcon from '@mui/icons-material/Apps';

import { useState, useEffect, useRef } from 'react';

import UiButton from './UiButton';
import UiButtonEdit from './UiButtonEdit';
import OpeningMovementHint from './OpeningMovementHint';
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

export default function Add({ 
    addObj, 
    editMenü, 
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
    
  const [newId, setNewId] = useState(1);
  const hasSeenFirstOpeningHint = useRef(false);
  const [showOpeningHint, setShowOpeningHint] = useState(false);

  // Zeige Hint beim ersten Mal, wenn ein Öffnungs-Edit-Menü geöffnet wird
  useEffect(() => {
    const openingEditMenus = new Set([
      'LeerÖffnung-Bearbeiten',
      'Fenster-Bearbeiten',
      'Tür-Bearbeiten',
      'SektionalTor-Bearbeiten',
      'Schiebetür-Bearbeiten',
      'Rolltor-Bearbeiten',
      'TransparentesPaneel-Bearbeiten',
      'Laderampe-Bearbeiten',
      'Lichtkuppel-Bearbeiten',
      'Photovoltaik-Bearbeiten'
    ])

    if (!hasSeenFirstOpeningHint.current && openingEditMenus.has(editMenü)) {
      hasSeenFirstOpeningHint.current = true;
      setShowOpeningHint(true);
    } else if (!openingEditMenus.has(editMenü)) {
      setShowOpeningHint(false);
    }
  }, [editMenü]);

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
          isActive={editMenü === 'Angebot'}
          />


        </div>

        {editMenü === 'Abmessungen' && <UiButtonEdit 
            name={"Abmessungen"} 
            height={0} 
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
            abmessungenAnzeigen={abmessungenAnzeigen}
            setAbmessungenAnzeigen={setAbmessungenAnzeigen}
        /> }
        {/* editMenü === 'Felder' && <UiButtonEdit name={'Felder'} height={1} /> */ }
        {editMenü === 'Verkleidung' && <UiButtonEdit 
            name={"Verkleidung"} 
            height={2} 
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
        {editMenü === 'Öffnungen-Auswahl' && <ÖffnungenUi wand={true} lang={clickedButtonPos?.lang ?? true} rechts={clickedButtonPos?.rechts ?? true} addObj={addObj} setEditMenü={setEditMenü} newId={newId} setNewId={setNewId} clickedButtonPos={clickedButtonPos} gebäudeBreite={breite} gebäudeLänge={länge} gebäudeHöhe={höhe} dachArt={dachArt} dachneigung={dachneigung} />}
        {editMenü === 'Öffnungen-Dach-Auswahl' && <ÖffnungenUi wand={false} lang={false} rechts={clickedButtonPos?.rechts ?? true} addObj={addObj} setEditMenü={setEditMenü} newId={newId} setNewId={setNewId} clickedButtonPos={clickedButtonPos} gebäudeBreite={breite} gebäudeLänge={länge} gebäudeHöhe={höhe} dachArt={dachArt} dachneigung={dachneigung} />}
        {editMenü === 'LeerÖffnung-Bearbeiten' && selectedObject?.type === 'leeröffnung' && <LeerÖffnungBearbeiten selectedObject={selectedObject} setEditMenü={setEditMenü} objs={objs} setObjs={setObjs} gebäudeHöhe={höhe} gebäudeBreite={breite} gebäudeLänge={länge} dachArt={dachArt} dachneigung={dachneigung} />}
        {editMenü === 'Fenster-Bearbeiten' && selectedObject?.type === 'fenster' && <WandFensterBearbeiten selectedObject={selectedObject} setEditMenü={setEditMenü} objs={objs} setObjs={setObjs} gebäudeHöhe={höhe} gebäudeBreite={breite} gebäudeLänge={länge} />}
        {editMenü === 'Tür-Bearbeiten' && selectedObject?.type === 'tür-öffnung' && <TürÖffnungBearbeiten selectedObject={selectedObject} setEditMenü={setEditMenü} objs={objs} setObjs={setObjs} gebäudeHöhe={höhe} gebäudeBreite={breite} gebäudeLänge={länge} />}
        {editMenü === 'SektionalTor-Bearbeiten' && <SektionalTorBearbeiten selectedObject={selectedObject} setEditMenü={setEditMenü} objs={objs} setObjs={setObjs} gebäudeHöhe={höhe} gebäudeBreite={breite} gebäudeLänge={länge} />}
        {editMenü === 'Schiebetür-Bearbeiten' && selectedObject?.type === 'schiebetür' && <SchiebeTürBearbeiten selectedObject={selectedObject} setEditMenü={setEditMenü} objs={objs} setObjs={setObjs} gebäudeHöhe={höhe} gebäudeBreite={breite} gebäudeLänge={länge} />}
        {editMenü === 'Rolltor-Bearbeiten' && selectedObject?.type === 'rolltor' && <RollTorBearbeiten selectedObject={selectedObject} setEditMenü={setEditMenü} objs={objs} setObjs={setObjs} gebäudeHöhe={höhe} gebäudeBreite={breite} gebäudeLänge={länge} />}
        {editMenü === 'TransparentesPaneel-Bearbeiten' && selectedObject?.type === 'transparentespaneel' && <TransparentesPaneelBearbeiten selectedObject={selectedObject} setEditMenü={setEditMenü} objs={objs} setObjs={setObjs} gebäudeHöhe={höhe} gebäudeBreite={breite} gebäudeLänge={länge} />}
        {editMenü === 'Laderampe-Bearbeiten' && selectedObject?.type === 'laderampe' && <LaderampeBearbeiten selectedObject={selectedObject} setEditMenü={setEditMenü} objs={objs} setObjs={setObjs} gebäudeHöhe={höhe} gebäudeBreite={breite} gebäudeLänge={länge} />}
        {editMenü === 'Lichtkuppel-Bearbeiten' && selectedObject?.type === 'kleinlichtskuppel' && <LichtKuppelBearbeiten selectedObject={selectedObject} setEditMenü={setEditMenü} objs={objs} setObjs={setObjs} gebäudeBreite={breite} gebäudeLänge={länge} />}
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

        {editMenü === 'Konstruktion' && <UiButtonEdit 
            name={"Konstruktion"} 
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
        /> }
        
        {editMenü === 'Angebot' && <UiButtonEdit 
            name={"Angebot"} 
          height={5} 
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

        <OpeningMovementHint editMenü={editMenü} isFirstOpening={showOpeningHint} />
    </>
  )
}
