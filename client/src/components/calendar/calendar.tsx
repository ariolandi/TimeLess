import { Grid, useMediaQuery } from "@mui/material";
import { Event } from '../../services/eventService';
import CalendarColumn from "./calendarColumn";
import { small_screen_size } from "../constants";

export default function Calendar({ events, onSaveChanges }: { events: Array<Event[]>, onSaveChanges: () => void }) {
  const small_screen = useMediaQuery(small_screen_size);

  return (
    <Grid 
      component="main"
      sx={{
        display: small_screen ? "block" : "flex",
        width: "100%",
      }}>
      <CalendarColumn day={"Понеделник"} events={events[0]} onSaveChanges={onSaveChanges} />
      <CalendarColumn day={"Вторник"} events={events[1]} onSaveChanges={onSaveChanges} />
      <CalendarColumn day={"Сряда"} events={events[2]} onSaveChanges={onSaveChanges} />
      <CalendarColumn day={"Четвъртък"} events={events[3]} onSaveChanges={onSaveChanges} />
      <CalendarColumn day={"Петък"} events={events[4]} onSaveChanges={onSaveChanges} />
      <CalendarColumn day={"Събота"} events={events[5]} onSaveChanges={onSaveChanges} />
      <CalendarColumn day={"Неделя"} events={events[6]} onSaveChanges={onSaveChanges} />
    </Grid>
  );
}
