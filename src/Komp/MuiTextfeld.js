import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';




export default function MuiTextfeld({
  label,
  state,
  setState = () => {},
}) {

  const handleChange = (event) => {
    if (typeof setState === 'function') setState(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ '& > :not(style)': { m: 0, width: '150px' } }}
      noValidate
      autoComplete="off"
    >
      <TextField 
        id="outlined-basic" 
        label={label} 
        variant="outlined" 
        size='small'
        value={state || ''}
        onChange={handleChange}
      />
    </Box>
  );
}
