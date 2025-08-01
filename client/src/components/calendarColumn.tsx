import { Box } from "@mui/material";
import { styles } from "./styles";
import { secondaryColor, smallMargin } from "./constants";
import { Event } from '../services/eventService';
import CalendarEvent from "./calendarEvent";

export default function CalendarColumn({ day, events }: { day: string, events: Event[] }) {

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
    {events.map((event) => {
        return (
          <CalendarEvent event={event} />
        )
    })}
    </Box>
  );
}
