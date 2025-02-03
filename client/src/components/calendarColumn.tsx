import { Box, Button, Grid } from "@mui/material";
import { Activity } from "../services/activityService";
import { styles } from "./styles";
import { secondaryColor, smallMargin } from "./constants";

export default function CalendarColumn({ day, activities }: { day: string, activities: Activity[] }) {
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
    {activities.map((activity) => {
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
                <b>{activity.title}</b>
              </Grid>
              <Grid item xs={12}>
                {activity.start_time}
              </Grid>
            </Grid>
        </Button>
        );
    })}
    </Box>
  );
}
