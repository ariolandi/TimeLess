import Header from "../components/header";
import { Container, Button } from "@mui/material";
import { styles } from "../components/styles";
import { CreateActivity } from "../components/dialogs/createActivity";
import { useEffect, useState } from "react";
import Calendar from "../components/calendar/calendar";
import { Event, EventService } from "../services/eventService";
import { Days } from "../components/constants";

const eventService = new EventService();

export default function DashBoard() {
  const [openDialog, setOpenDialog] = useState(false);
  const [events, setEvents] = useState<Array<Event[]>>(Array(7).fill([]));
  const [, setLoading] = useState(true);
  const [, setError] = useState<unknown>();

  async function loadEvents() {
    try {
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

  useEffect(() => {loadEvents()}, []);

  return (
    <Container maxWidth={false} disableGutters>
      <Header />
      <Container
        maxWidth="md"
        sx={{
          display: "flex",
          alignItems: "center",
          padding: "15px 0",
          margin: "0",
        }}
      >
        <Button
          variant="contained"
          sx={{
            backgroundColor: "secondary.main",
            ...styles.submitButton
          }}
          onClick={() => setOpenDialog(true)}
        >
          <b>Създай дейност</b>
        </Button>
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
