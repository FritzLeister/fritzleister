import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function MuiSelect({
    option1,
    value1,
    option2,
    value2,
    option3,
    value3,
    option4,
    value4,
    option5,
    value5,
    option6,
    value6,
    option7,
    value7,
    label,
    state = '',
    setState = () => {},
}) {

  const handleChange = (event) => {
    if (typeof setState === 'function') setState(event.target.value);
  };

  return (
    <Box sx={{ width: 200 }}>
      <FormControl sx={{ width: 200 }}>
        <InputLabel id="demo-simple-select-label" style={{fontSize: 15}}>{label}</InputLabel>
        <Select
          size="small"
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={state || ''}
          label={label}
          onChange={handleChange}
        >
          <MenuItem value={value1}>{option1}</MenuItem>
          <MenuItem value={value2}>{option2}</MenuItem>
          
          {option3 && (
            <MenuItem value={value3}>{option3}</MenuItem>
          )}
          
          {option4 && (
            <MenuItem value={value4}>{option4}</MenuItem>
          )}

          {option5 && (
            <MenuItem value={value5}>{option5}</MenuItem>
          )}

          {option6 && (
            <MenuItem value={value6}>{option6}</MenuItem>
          )}

          {option7 && (
            <MenuItem value={value7}>{option7}</MenuItem>
          )}

        </Select>
      </FormControl>
    </Box>
  );
}