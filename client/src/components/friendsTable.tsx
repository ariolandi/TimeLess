import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Container from '@mui/material/Container';
import { primaryColor } from './constants';

interface Column {
  id: 'status' |
    'username' | 
    'name' | 
    'start_time' | 
    'end_time' | 
    'weekend_start_time' | 
    'weekend_end_time';
  label: string;
  align?: 'right';
  format?: (value: number) => string;
}

const columns: Column[] = [
  { id: 'status', label: 'Статус'},
  { id: 'username', label: 'Потребител' },
  { id: 'name', label: 'Име' },
  { id: 'start_time', label: 'Начален час' },
  { id: 'end_time', label: 'Краен час' },
  { id: 'weekend_start_time', label: 'Начален час' },
  { id: 'weekend_end_time', label: 'Краен час' },
];

export interface FriendData {
  status: boolean,
  username: string;
  name: string;
  start_time: string;
  end_time: string;
  weekend_start_time: string;
  weekend_end_time: string;
}

export default function FriendsTable({rows}: {rows: FriendData[]}) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Container>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell align="center" colSpan={1} sx={{backgroundColor: primaryColor}} />
              <TableCell align="center" colSpan={2} sx={{backgroundColor: primaryColor}} />
              <TableCell align="center" colSpan={2} sx={{backgroundColor: primaryColor}} />
              <TableCell align="center" colSpan={2} sx={{backgroundColor: primaryColor}}>
                Почивни дни
              </TableCell>
            </TableRow>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  sx={{backgroundColor: primaryColor}}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.username}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format && typeof value === 'number'
                            ? column.format(value)
                            : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Container>
  );
}