import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Container from '@mui/material/Container';
import { styles } from '../styles';
import { formatTime } from '../dateTime';
import { Column } from './table';
import { createTableHeaderCell } from './table';

const columns: Column[] = [
  { id: 'status', label: 'Статус', format: (value: boolean) => value ? '' : 'В изчакване'  },
  { id: 'username', label: 'Потребител' },
  { id: 'name', label: 'Име' },
  { id: 'start_time', label: 'Начален час', format: formatTime  },
  { id: 'end_time', label: 'Краен час', format: formatTime },
  { id: 'weekend_start_time', label: 'Начален час', format: formatTime },
  { id: 'weekend_end_time', label: 'Краен час', format: formatTime },
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

export function FriendsTable({rows}: {rows: FriendData[]}) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const firstRow = [
    createTableHeaderCell('', 1),
    createTableHeaderCell('', 2),
    createTableHeaderCell('Делнични дни', 2),
    createTableHeaderCell('Почивни дни', 2),
  ];

  return (
    <Container>
      <TableContainer sx={{ maxHeight: 440, ...styles.table }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {firstRow}
            </TableRow>
            <TableRow>
              {columns.map((column) => 
                createTableHeaderCell(column.label, 1, column.id)
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow key={row.username}>
                    {columns.map((column) => {
                      const value = row[column.id as keyof FriendData];
                      return (
                        <TableCell key={column.id} align='center'>
                          {column.format
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