import { Grid, useMediaQuery } from "@mui/material";
import { Event } from '../../services/eventService';
import CalendarColumn from "./calendarColumn";
import { Days, small_screen_size } from "../constants";

export default function Calendar({ events, onSaveChanges }: { events: Array<Event[]>, onSaveChanges: () => void }) {
  const small_screen = useMediaQuery(small_screen_size);

  const getColumn = (dayName: string, dayNumber: Days) => 
    <CalendarColumn day={dayName} events={events[dayNumber] ?? []} onSaveChanges={onSaveChanges} />

  return (
    <Grid 
      component="main"
      sx={{
        display: small_screen ? "block" : "flex",
        width: "100%",
      }}>
      { getColumn("Понеделник", Days.Monday) }
      { getColumn("Вторник", Days.Tuesday) }
      { getColumn("Сряда", Days.Wednesday) }
      { getColumn("Четвъртък", Days.Thursday) }
      { getColumn("Петък", Days.Friday) }
      { getColumn("Събота", Days.Saturday) }
      { getColumn("Неделя", Days.Sunday) }
    </Grid>
  );
}
