import { Box, Button } from "@mui/material";
import { Activity } from "../services/activityService";
import {smallMargin, styles } from "./styles";

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
            <b>{activity.title}</b>
        </Button>
        );
    })}
    </Box>
  );
}
