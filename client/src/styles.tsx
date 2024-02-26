import { SxProps, Theme } from '@mui/material';

function makeStyles<T extends Record<string, SxProps<Theme>>>(styles: T) {
    return styles;
}

const standartMargin = '16px';
const standardMarginPercent = '5%';
export const smallMarginPercent = '2%';

export const styles = makeStyles({
    submitButton: {
        padding: standartMargin,
        marginTop: standartMargin
    },
    formBorder: {
        border: 1,
        borderRadius: 8,
        padding: standardMarginPercent,
        margin: standardMarginPercent,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    column: {
        display: 'flex',
        flexDirection: 'column'
    }
});