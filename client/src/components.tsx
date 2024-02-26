
import Button from '@mui/material/Button';
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