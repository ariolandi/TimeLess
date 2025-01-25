import { Box, Button, Grid } from "@mui/material";
import { Activity } from "../services/activityService";
import {smallMargin, styles } from "./styles";
import { formatTime } from "./dateTime";

export default function CalendarColumn({ day, activities }: { day: string, activities: Activity[] }) {
  return (
    <Box
      sx={{
        ...styles.formBorder,
        ...styles.column,
        ...{
          color: "primary.main",
          margin: smallMargin,
          padding: 0,
          width: "100%",
        },
      }}
    >
    <Box>
      <h3>{day}</h3>
    </Box>
    {activities.map((activity) => {
        return (
        <Button variant="contained" fullWidth sx={styles.submitButton}>
            <Grid>
              <Grid item xs={12}>
                <b>{activity.title}</b>
              </Grid>
              <Grid item xs={12}>
                {formatTime(activity.start_time)}
              </Grid>
            </Grid>
        </Button>
        );
    })}
    </Box>
  );
}
