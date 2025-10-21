
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
import { useState } from 'react';

export default function Add({ addObj }) {
    
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
}
