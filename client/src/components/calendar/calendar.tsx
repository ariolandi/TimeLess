import { Grid, useMediaQuery } from "@mui/material";
import { Event } from '../../services/eventService';
import CalendarColumn from "./calendarColumn";
import { small_screen_size } from "../constants";

export default function Calendar({ events, setEvents }: { 
  events: Array<Event[]>, 
  setEvents: React.Dispatch<React.SetStateAction<Event[][]>> 
}) {
  const small_screen = useMediaQuery(small_screen_size);

  return (
    <Grid 
      component="main"
      sx={{
        display: small_screen ? "block" : "flex",
        width: "100%",
      }}>
      <CalendarColumn day={"Понеделник"} dayEvents={events[0]} allEvents={events} setEvents={setEvents} />
      <CalendarColumn day={"Вторник"} dayEvents={events[1]} allEvents={events} setEvents={setEvents} />
      <CalendarColumn day={"Сряда"} dayEvents={events[2]} allEvents={events} setEvents={setEvents} />
      <CalendarColumn day={"Четвъртък"} dayEvents={events[3]} allEvents={events} setEvents={setEvents} />
      <CalendarColumn day={"Петък"} dayEvents={events[4]} allEvents={events} setEvents={setEvents} />
      <CalendarColumn day={"Събота"} dayEvents={events[5]} allEvents={events} setEvents={setEvents} />
      <CalendarColumn day={"Неделя"} dayEvents={events[6]} allEvents={events} setEvents={setEvents} />
    </Grid>
  );
}
