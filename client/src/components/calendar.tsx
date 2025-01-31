import { Grid } from "@mui/material";
import { Activity } from "../services/activityService";
import CalendarColumn from "./calendarColumn";

export default function Calendar({ activities }: { activities: Array<Activity[]> }) {
  return (
    <Grid 
      component="main"
      sx={{
        display: "flex",
        width: "100%",
      }}>
      <CalendarColumn day={"Понеделник"} activities={activities[0]} />
      <CalendarColumn day={"Вторник"} activities={activities[1]} />
      <CalendarColumn day={"Сряда"} activities={activities[2]} />
      <CalendarColumn day={"Четвъртък"} activities={activities[3]} />
      <CalendarColumn day={"Петък"} activities={activities[4]} />
      <CalendarColumn day={"Събота"} activities={activities[5]} />
      <CalendarColumn day={"Неделя"} activities={activities[6]} />
    </Grid>
  );
}
