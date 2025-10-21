
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';


export default function ButtonMui({ title, multiplier, onClick }) {
    const defaultVal = 50

    return (
        <Stack direction="row" spacing={2} sx={{ position: 'absolute', top: defaultVal + (60*multiplier), left: 50}}>
            <Button variant="outlined" onClick={onClick}>{title}</Button>
            
        </Stack>
  );
}