import { Box, Button, Grid } from "@mui/material";
import { styles } from "./styles";
import { secondaryColor, smallMargin } from "./constants";
import { Event } from '../services/eventService';

export default function CalendarColumn({ day, events }: { day: string, events: Event[] }) {
  console.log(events);

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
        <Button 
          variant="contained" 
          fullWidth 
          sx={{
            backgroundColor: "primary.main",
            ...styles.submitButton
          }}
        >
            <Grid>
              <Grid item xs={12}>
                <b>{event.title}</b>
              </Grid>
              <Grid item xs={12}>
                {event.start_time}
              </Grid>
            </Grid>
        </Button>
        );
    })}
    </Box>
  );
}
