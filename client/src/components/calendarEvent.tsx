import { Button, Grid } from "@mui/material";
import { styles } from "./styles";
import { Event } from '../services/eventService';
import { EventPreview } from "./eventPreview";
import { useEffect, useState } from "react";
import { Activity, ActivityService } from "../services/activityService";

const activityService = new ActivityService();

export default function CalendarEvent({ event }: { event: Event }) {
  const defaultActivity = {
    id: event.activity_id,
    user_id: event.user_id,
    title: event.title,
    description: "",
    duration: "00:00",
    start_time: null,
    repeat: 0,
    days: []
  }

  const [openDialog, setOpenDialog] = useState(false);
  const [activity, setActivity] = useState<Activity>(defaultActivity);
  const [, setLoading] = useState(true);
  const [, setError] = useState<unknown>();

  useEffect(() => {
    (async () => {
      try {
        const activity = await activityService.fetch_activity(event.activity_id);
        setActivity(activity.data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    })();
  }, [event]);

  console.log(event, activity);

  return (
    <>
      <Button 
        variant="contained" 
        fullWidth 
        sx={{
          backgroundColor: "primary.main",
          ...styles.submitButton
        }}
        onClick={() => {setOpenDialog(true);}}
        >
        <Grid>
          <Grid item xs={12}>
            <b>{event.title}</b>
          </Grid>
          <Grid item xs={12}>
            {event.start_time + " - " + event.end_time}
          </Grid>
        </Grid>
      </Button>
      <EventPreview
        open={openDialog}
        setOpen={setOpenDialog}
        event={event}
        activity={activity}
      />
    </>
  );
}
