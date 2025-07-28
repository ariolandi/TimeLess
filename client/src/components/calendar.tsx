import { Grid } from "@mui/material";
import { Event } from '../services/eventService';
import CalendarColumn from "./calendarColumn";

export default function Calendar({ events }: { events: Array<Event[]> }) {
  return (
    <Grid 
      component="main"
      sx={{
        display: "flex",
        width: "100%",
      }}>
      <CalendarColumn day={"Понеделник"} events={events[0]} />
      <CalendarColumn day={"Вторник"} events={events[1]} />
      <CalendarColumn day={"Сряда"} events={events[2]} />
      <CalendarColumn day={"Четвъртък"} events={events[3]} />
      <CalendarColumn day={"Петък"} events={events[4]} />
      <CalendarColumn day={"Събота"} events={events[5]} />
      <CalendarColumn day={"Неделя"} events={events[6]} />
    </Grid>
  );
}
