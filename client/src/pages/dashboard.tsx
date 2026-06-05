import Header from "../components/header";
import { Container, Button, Typography, Box, useMediaQuery, TableRow, TableCell, TableHead, Table, TableContainer, TableBody } from "@mui/material";
import { styles } from "../components/styles";
import { CreateActivity } from "../components/dialogs/createActivity";
import { useEffect, useState } from "react";
import Calendar from "../components/calendar/calendar";
import { Event, EventService } from "../services/eventService";
import { small_screen_size } from "../components/constants";
import { UserService } from "../services/userService";
import { FriendData } from "../components/table/friendsTable";
import { startOfWeek, endOfWeek, subWeeks, addWeeks, addDays } from 'date-fns';
import { createTableHeaderCell } from "../components/table/table";
import { CreateSharedActivity } from "../components/dialogs/createSharedActivity";

const eventService = new EventService();
const userService = new UserService();

export default function DashBoard() {
  const small_screen = useMediaQuery(small_screen_size);

  const [openActivityDialog, setOpenActivityDialog] = useState(false);
  const [openSharedActivityDialog, setOpenSharedActivityDialog] = useState(false);
  const [events, setEvents] = useState<Array<Event[]>>(Array(7).fill([]));
  const [, setLoading] = useState(true);
  const [, setError] = useState<unknown>();
  const [friends, setFriends] = useState<FriendData[]>([]);
  const [friendRequests, setFriendRequest] = useState<FriendData[]>([]);


  const [monday, setMonday] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [sunday, setSunday] = useState(endOfWeek(new Date(), { weekStartsOn: 1 }));

  async function loadFriendsRequest() {
    const result = await userService.friend_requests();

    if (result) {
      setFriendRequest(result.data.filter((connection) => connection.status === false).map((connection) => {
        return {
          status: connection.status,
          username: connection.user.username,
          name: `${connection.user.first_name} ${connection.user.last_name}`,
          start_time: connection.user.start_time,
          end_time: connection.user.end_time,
          weekend_start_time: connection.user.weekend_start_time,
          weekend_end_time: connection.user.weekend_end_time
        } as FriendData}));
    }
  }

  async function loadFriends() {
    const result = await userService.friends();

    if (result) {
      setFriends(result.data.filter(connection => connection.status === true).map((connection) => {
        return {
          status: false,
          username: connection.user.username,
          name: `${connection.user.first_name} ${connection.user.last_name}`,
          start_time: connection.user.start_time,
          end_time: connection.user.end_time,
          weekend_start_time: connection.user.weekend_start_time,
          weekend_end_time: connection.user.weekend_end_time
        } as FriendData}));
    }
  }

  async function acceptFriend(username: string) {
    await userService.accept_friend(username);
    await loadFriendsRequest();
  }

  async function loadEvents() {
    try {
      const schedule = [
        (await eventService.fetch(monday)).data,
        (await eventService.fetch(addDays(monday, 1))).data,
        (await eventService.fetch(addDays(monday, 2))).data,
        (await eventService.fetch(addDays(monday, 3))).data,
        (await eventService.fetch(addDays(monday, 4))).data,
        (await eventService.fetch(addDays(monday, 5))).data,
        (await eventService.fetch(addDays(monday, 6))).data
      ]

      console.log(schedule);

      setEvents(schedule);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {loadEvents()}, [monday, sunday]);
  useEffect(() => {loadFriendsRequest()}, []);
  useEffect(() => {loadFriends()}, []);

  const header = [
    createTableHeaderCell('Потребител'),
    createTableHeaderCell('Име'),
    createTableHeaderCell(),
  ]

  return (
    <Container maxWidth={false} disableGutters>
      <Header />
      <Container>
        {friendRequests.length > 0 && (
          <TableContainer sx={{ maxHeight: 440, ...styles.table }}>
          <Table stickyHeader>
            <TableHead> 
              <TableRow>
                {header}
              </TableRow>
            </TableHead>
            <TableBody>
              {friendRequests
                .map((row) => {
                  return (
                    <TableRow key={row.username}>
                      <TableCell key={row.username} align='center'>
                        {row.username}
                      </TableCell>
                      <TableCell key={row.name} align='center'>
                        {row.name}
                      </TableCell>
                      <TableCell key='action' align='center'>
                        <Button 
                          sx={{backgroundColor: "secondary.main"}} 
                          variant="contained" 
                          disabled={row.status === true || row.status.valueOf() === true}
                          onClick={() => acceptFriend(row.username)}
                        >
                          {row.status ? 'Прието' : 'Приеми'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table> 
          </TableContainer >
        )}
      </Container>
      <Container
        // maxWidth="md"
        sx={{
          display: "flex",
          flexDirection: small_screen ? "column" : "row",
          flexWrap: "wrap",
          alignItems: "center",
          padding: "15px 0",
          margin: "0",
        }}
      >
        <Button
          variant="contained"
          sx={{
            backgroundColor: "secondary.main",
            ...styles.submitButton,
            ...(small_screen ? { width: "100%", marginBottom: "15px" } : {}),
          }}
          onClick={() => setOpenActivityDialog(true)}
        >
          <b>Създай дейност</b>
        </Button>
        <Button
          variant="contained"
          sx={{
            marginLeft: small_screen ? "0" : "15px",
            backgroundColor: "secondary.main",
            ...styles.submitButton,
            ...(small_screen ? { width: "100%", marginBottom: "15px" } : {}),
          }}
          onClick={() => setOpenSharedActivityDialog(true)}
        >
          <b>Създай споделена дейност</b>
        </Button>
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Button 
            onClick={() => {
              const prevWeekDate = subWeeks(monday, 1);
              setMonday(startOfWeek(prevWeekDate, { weekStartsOn: 1 }));
              setSunday(endOfWeek(prevWeekDate, { weekStartsOn: 1 }));
            }}
          > 
            <Typography color="secondary" textAlign="center" fontSize="h6.fontSize">
              { '<' }
            </Typography> 
          </Button>
          <Typography color="secondary" textAlign="center" fontSize="h6.fontSize">
            {monday.toLocaleDateString('bg-BG')} - {sunday.toLocaleDateString('bg-BG')}
          </Typography>
          <Button 
            onClick={() => {
              const nextWeekDate = addWeeks(monday, 1);
              setMonday(startOfWeek(nextWeekDate, { weekStartsOn: 1 }));
              setSunday(endOfWeek(nextWeekDate, { weekStartsOn: 1 }));
            }}
          > 
            <Typography color="secondary" textAlign="center" fontSize="h6.fontSize">
              { '>' }
            </Typography> 
          </Button>
        </Box>
        {openActivityDialog && <CreateActivity
          open={openActivityDialog}
          setOpen={setOpenActivityDialog}
          onSaveChanges={loadEvents}
        />}
        {openSharedActivityDialog && <CreateSharedActivity
          friends={friends}
          open={openSharedActivityDialog}
          setOpen={setOpenSharedActivityDialog}
          onSaveChanges={loadEvents}
        />}
      </Container>
      <Calendar events={events} onSaveChanges={loadEvents} />
    </Container>
  );
}
