import { SxProps, Theme } from '@mui/material';

function makeStyles<T extends Record<string, SxProps<Theme>>>(styles: T) {
    return styles;
}

const standartMargin = '16px';
export const standardMarginPercent = '5%';
export const smallMarginPercent = '2%';

function headerBlockConstructor(width: number) {
    return {
        backgroundColor: 'primary.main',
        display: 'flex',
        justifyContent: 'center',
        width: width,
        padding: smallMarginPercent,
    };
}

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
    },
    headerBlock: headerBlockConstructor(1),
    halfPageHeaderBlock: headerBlockConstructor(1/2)
});

export const small_screen_size = '(max-width:1000px)';