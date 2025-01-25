import { Grid } from "@mui/material";
import { Activity } from "../services/activityService";
import CalendarColumn from "./calendarColumn";

export default function Calendar({ activities }: { activities: Activity[] }) {
  return (
    <Grid 
      component="main"
      sx={{
        display: "flex",
        width: "100%",
      }}>
      <CalendarColumn day={"Понеделник"} activities={activities} />
      <CalendarColumn day={"Вторник"} activities={activities} />
      <CalendarColumn day={"Сряда"} activities={activities} />
      <CalendarColumn day={"Четвъртък"} activities={activities} />
      <CalendarColumn day={"Петък"} activities={activities} />
      <CalendarColumn day={"Събота"} activities={activities} />
      <CalendarColumn day={"Неделя"} activities={activities} />
    </Grid>
  );
}
