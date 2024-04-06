
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import logo from './assets/timeless_logo_white.svg';
import { styles } from './styles';


export function SubmitButton({ buttonText }: { buttonText: string }) {
    return (
        <Button
            variant='contained'
            type='submit'
            fullWidth
            sx={styles.submitButton}
            >
            <b>{buttonText}</b>
        </Button>
    );
}

export function Logo({width, maxWidth, height, maxHeight}:  { width?: number, maxWidth?: number, height?: number, maxHeight?: number }) {
    return (
        <Box
          component='img'
          alt='TimeLess'
          src={logo}
          sx={{ width: width, maxWidth: maxWidth, height: height, maxHeight: maxHeight }}
        />
    );
}