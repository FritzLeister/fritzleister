import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';

export default function SliderMui({ title, multiplier, value, onChange, min, max }) {

    const defaultVal = 50

    return(
        <Box sx={{ position: 'absolute', top: defaultVal + (60*multiplier), left: 50}} >
            <Typography sx={{ marginBottom: 0 }} >{title}</Typography>
            <Slider
                sx={{ width: 250 }}
                aria-label='Small'
                valueLabelDisplay='auto'
                min={min}
                max={max}
                value={value}
                step={1}
                onChange={(e, newValue) => {
                    onChange(newValue)
                }}
            />
        </Box>
    )
}