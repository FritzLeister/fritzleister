
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

import { useState } from 'react';

import UiButton from './UiButton';
import UiButtonEdit from './UiButtonEdit';

export default function Add({ addObj, editMenü, setEditMenü }) {
    
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

        {editMenü === 'Abmessungen' && <UiButtonEdit name={"Abmessungen"} height={0} /> }
        {/* editMenü === 'Felder' && <UiButtonEdit name={'Felder'} height={1} /> */ }
        {editMenü === 'Verkleidung' && <UiButtonEdit name={"Verkleidung"} height={2} /> }
        {editMenü === 'Öffnungen' && <UiButtonEdit name={"Öffnungen"} height={3} /> }
        {editMenü === 'Zubehör' && <UiButtonEdit name={"Zubehör"} height={4} /> }
        {editMenü === 'Konstruktion' && <UiButtonEdit name={"Konstruktion"} height={5} /> }
        {editMenü === 'Angebot' && <UiButtonEdit name={"Angebot"} height={6} /> }
    </>
  )
}
