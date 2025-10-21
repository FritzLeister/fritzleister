import * as React from 'react';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';

export default function MuiProgress({ state }) {

    //const [progress, setProgress] = React.useState(40);
    /*
    React.useEffect(() => {
        const timer = setInterval(() => {
        setProgress((oldProgress) => {
            if (oldProgress === 100) {
            return 0;
            }
            const diff = Math.random() * 10;
            return Math.min(oldProgress + diff, 100);
        });
        }, 500);

        return () => {
        clearInterval(timer);
        };
    }, []);
    */

    const progress = [25, 50, 75, 100]

    return (
        <Box sx={{ width: '100%', marginTop: 1 }}>
        <LinearProgress variant="determinate" value={progress[state-1]} />
        
        </Box>
    );
}