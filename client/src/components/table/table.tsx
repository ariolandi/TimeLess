import TableCell from '@mui/material/TableCell';
import { secondaryColor } from '../constants';
import { styles } from '../styles';
import { Typography } from '@mui/material';
import { ReactNode } from 'react';

export interface Column {
  id: string;
  label: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  format?: (value: any) => ReactNode;
}

export const createTableHeaderCell = (text: string = '', colspan: number = 1, key?: string) => {
    return (
        <TableCell align='center' colSpan={colspan} sx={styles.tableHeader} key={key}>
            <Typography color={secondaryColor} fontWeight='bold'> 
                {text }
            </Typography>
        </TableCell>
    );
}