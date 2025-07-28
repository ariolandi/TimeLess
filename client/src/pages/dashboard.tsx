import Header from "../components/header";
import { Container, Button } from "@mui/material";
import { styles } from "../components/styles";
import { ActivityDialog } from "../components/dialog";
import { useEffect, useState } from "react";
import Calendar from "../components/calendar";
import { Event, EventService } from "../services/eventService";

const eventService = new EventService();

export default function DashBoard() {
  const [openDialog, setOpenDialog] = useState(false);
  const [events, setEvents] = useState<Array<Event[]>>(Array(7).fill([]));
  const [, setLoading] = useState(true);
  const [, setError] = useState<unknown>();

  useEffect(() => {
    (async () => {
      try {
        const schedule = [
          (await eventService.fetch(0)).data,
          (await eventService.fetch(1)).data,
          (await eventService.fetch(2)).data,
          (await eventService.fetch(3)).data,
          (await eventService.fetch(4)).data,
          (await eventService.fetch(5)).data,
          (await eventService.fetch(6)).data
        ]

        setEvents(schedule);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

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
        <ActivityDialog
          open={openDialog}
          setOpen={setOpenDialog}
          events={events}
          setEvents={setEvents}
        />
      </Container>
      <Calendar events={events} />
    </Container>
  );
}
