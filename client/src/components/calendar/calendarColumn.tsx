import { Box } from "@mui/material";
import { styles } from "../styles";
import { secondaryColor, smallMargin } from "../constants";
import { Event } from '../../services/eventService';
import CalendarEvent from "./calendarEvent";

export default function CalendarColumn({ day, dayEvents, allEvents, setEvents }: { 
  day: string, 
  dayEvents: Event[],
  allEvents:  Array<Event[]>, 
  setEvents: React.Dispatch<React.SetStateAction<Event[][]>> 
}) {
  return (
    <Box
      sx={{
        ...styles.formBorder,
        ...styles.column,
        ...{
          color: secondaryColor,
          margin: smallMargin,
          padding: 0,
          width: "100%",
        },
      }}
    >
    <Box>
      <h3 color={secondaryColor}><b>{day}</b></h3>
    </Box>
    {dayEvents.map((event) => {
        return (
          <CalendarEvent event={event} allEvents={allEvents} setEvents={setEvents} />
        )
    })}
    </Box>
  );
}
