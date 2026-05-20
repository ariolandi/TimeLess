import Header from "../components/header";
import { Container, Button, Typography, Box, useMediaQuery } from "@mui/material";
import { styles } from "../components/styles";
import { CreateActivity } from "../components/dialogs/createActivity";
import { useEffect, useState } from "react";
import Calendar from "../components/calendar/calendar";
import { Event, EventService } from "../services/eventService";
import { Days, small_screen_size } from "../components/constants";
import { UserService } from "../services/userService";
import { FriendData } from "../components/friendsTable";
import { startOfWeek, endOfWeek, subWeeks, addWeeks } from 'date-fns';

const eventService = new EventService();
const userService = new UserService();

export default function DashBoard() {
  const small_screen = useMediaQuery(small_screen_size);

  const [openDialog, setOpenDialog] = useState(false);
  const [events, setEvents] = useState<Array<Event[]>>(Array(7).fill([]));
  const [, setLoading] = useState(true);
  const [, setError] = useState<unknown>();

  const [monday, setMonday] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [sunday, setSunday] = useState(endOfWeek(new Date(), { weekStartsOn: 1 }));

  // async function loadFriendsRequest() {
  //   const result = await userService.friends();

  //   if (result) {
  //     setFriends(result.data.map((connection) => {
  //       return {
  //         status: connection.status,
  //         username: connection.user.username,
  //         name: `${connection.user.first_name} ${connection.user.last_name}`,
  //         start_time: connection.user.start_time,
  //         end_time: connection.user.end_time,
  //         weekend_start_time: connection.user.weekend_start_time,
  //         weekend_end_time: connection.user.weekend_end_time
  //       } as FriendData}));
  //   }
  // }

  async function loadEvents() {
    try {
      console.log("Loading events for week: ", monday, sunday);

      const schedule = [
        (await eventService.fetch(Days.Monday)).data,
        (await eventService.fetch(Days.Tuesday)).data,
        (await eventService.fetch(Days.Wednesday)).data,
        (await eventService.fetch(Days.Thursday)).data,
        (await eventService.fetch(Days.Friday)).data,
        (await eventService.fetch(Days.Saturday)).data,
        (await eventService.fetch(Days.Sunday)).data
      ]

      setEvents(schedule);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {loadEvents()}, [monday, sunday]);

  return (
    <Container maxWidth={false} disableGutters>
      <Header />
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
          onClick={() => setOpenDialog(true)}
        >
          <b>Създай дейност</b>
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
        <CreateActivity
          open={openDialog}
          setOpen={setOpenDialog}
          onSaveChanges={loadEvents}
        />
      </Container>
      <Calendar events={events} onSaveChanges={loadEvents} />
    </Container>
  );
}
