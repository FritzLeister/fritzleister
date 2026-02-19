
import Box from '@mui/material/Box';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import WindowIcon from '@mui/icons-material/Window';
import DoorBackIcon from '@mui/icons-material/DoorBack';
import DoorFrontIcon from '@mui/icons-material/DoorFront';
import WindowOutlinedIcon from '@mui/icons-material/WindowOutlined';
import ViewWeekIcon from '@mui/icons-material/ViewWeek';
import ViewWeekOutlinedIcon from '@mui/icons-material/ViewWeekOutlined';

import StraightenIcon from '@mui/icons-material/Straighten';
import HouseSidingIcon from '@mui/icons-material/HouseSiding';
import GavelIcon from '@mui/icons-material/Gavel';
import SquareFootIcon from '@mui/icons-material/SquareFoot';
import AppsIcon from '@mui/icons-material/Apps';

import { useState, useEffect } from 'react';

import UiButton from './UiButton';
import UiButtonEdit from './UiButtonEdit';
import ÖffnungenUi from './ÖffnungenKomp/ÖffnungUi'
import LeerÖffnungBearbeiten from './ÖffnungenKomp/LeerÖffnungBearbeiten'
import WandFensterBearbeiten from './ÖffnungenKomp/WandFensterBearbeiten'
import TürÖffnungBearbeiten from './ÖffnungenKomp/TürÖffnungBearbeiten'
import SektionalTorBearbeiten from './ÖffnungenKomp/SektionalTorBearbeiten'
import SchiebeTürBearbeiten from './ÖffnungenKomp/SchiebeTürBearbeiten'

export default function Add({ 
    addObj, 
    editMenü, 
    setEditMenü,
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

  const handleAddFenster = (rechts) => {
    addObj([5,5], "dachfenster", newId, rechts);
    setNewId(id => id + 1);
  };

  const handleAddTür = (hinten) => {
    console.log("Tür")
    addObj([12,9], "tür", newId, hinten);
    setNewId(id => id + 1);
  };

  const handleAddLüfter = (lang) => {
    console.log("Lüfter")
    addObj([5,5], "lüfter", newId, lang)
    setNewId(id => id + 1);
  }

  // WIESOOOOo geht das nicht maaannn
  const actions = [
  // { icon: <WindowIcon />, name: 'Fenster Vorne', func: () => handleAddFenster(true) },
  { icon: <WindowOutlinedIcon />, name: 'Fenster Hinten', func: () => handleAddFenster(false) },
  { icon: <DoorBackIcon />, name: 'Tür Rechts', func: () => handleAddTür(true) },
  { icon: <DoorFrontIcon />, name: 'Tür Links', func: () => handleAddTür(false) },
  { icon: <ViewWeekIcon />, name: 'Lüfter Vorne', func: () => handleAddLüfter(true) },
  { icon: <ViewWeekOutlinedIcon />, name: 'Lüfter Hinten', func: () => handleAddLüfter(false) }
  ];

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
            height: 472.5, // 500 : 250
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

          {/* Zubehör */}
          <UiButton 
          icon={<ViewWeekIcon fontSize='medium'/>} 
          name={'Zubehör'} 
          onClick={() => setEditMenü(editMenü === 'Zubehör' ? '' : 'Zubehör')}
          isActive={editMenü === 'Zubehör'}
          />

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
        {editMenü === 'Öffnungen' && <UiButtonEdit 
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
        /> }
        {editMenü === 'Öffnungen-Auswahl' && <ÖffnungenUi wand={true} lang={clickedButtonPos?.lang ?? true} rechts={clickedButtonPos?.rechts ?? true} addObj={addObj} setEditMenü={setEditMenü} newId={newId} setNewId={setNewId} clickedButtonPos={clickedButtonPos} gebäudeBreite={breite} gebäudeHöhe={höhe} />}
        {editMenü === 'Öffnungen-Dach-Auswahl' && <ÖffnungenUi wand={false} lang={false} rechts={clickedButtonPos?.rechts ?? true} addObj={addObj} setEditMenü={setEditMenü} newId={newId} setNewId={setNewId} clickedButtonPos={clickedButtonPos} gebäudeBreite={breite} gebäudeHöhe={höhe} />}
        {editMenü === 'LeerÖffnung-Bearbeiten' && selectedObject?.type === 'leeröffnung' && <LeerÖffnungBearbeiten selectedObject={selectedObject} setEditMenü={setEditMenü} objs={objs} setObjs={setObjs} gebäudeHöhe={höhe} gebäudeBreite={breite} />}
        {editMenü === 'Fenster-Bearbeiten' && selectedObject?.type === 'fenster' && <WandFensterBearbeiten selectedObject={selectedObject} setEditMenü={setEditMenü} objs={objs} setObjs={setObjs} gebäudeHöhe={höhe} gebäudeBreite={breite} />}
        {editMenü === 'Tür-Bearbeiten' && selectedObject?.type === 'tür-öffnung' && <TürÖffnungBearbeiten selectedObject={selectedObject} setEditMenü={setEditMenü} objs={objs} setObjs={setObjs} gebäudeHöhe={höhe} gebäudeBreite={breite} />}
        {editMenü === 'SektionalTor-Bearbeiten' && <SektionalTorBearbeiten selectedObject={selectedObject} setEditMenü={setEditMenü} objs={objs} setObjs={setObjs} gebäudeHöhe={höhe} gebäudeBreite={breite} />}
        {editMenü === 'Schiebetür-Bearbeiten' && selectedObject?.type === 'schiebetür' && <SchiebeTürBearbeiten selectedObject={selectedObject} setEditMenü={setEditMenü} objs={objs} setObjs={setObjs} gebäudeHöhe={höhe} gebäudeBreite={breite} />}

        {editMenü === 'Zubehör' && <UiButtonEdit 
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
        /> }

        {editMenü === 'Konstruktion' && <UiButtonEdit 
            name={"Konstruktion"} 
            height={5} 
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
            height={6} 
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
    </>
  )
}
