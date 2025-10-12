import { Button, Grid } from "@mui/material";
import { styles } from "../styles";
import { Event } from '../../services/eventService';
import { EventPreview } from "../dialogs/eventPreview";
import { useEffect, useState } from "react";
import { Activity, ActivityService } from "../../services/activityService";

const activityService = new ActivityService();

export default function CalendarEvent({ event, allEvents, setEvents }: { 
  event: Event,
  allEvents:  Array<Event[]>, 
  setEvents: React.Dispatch<React.SetStateAction<Event[][]>> 
}) {
  const [openDialog, setOpenDialog] = useState(false);
  const [activity, setActivity] = useState<Activity>();
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

  return (
    <>
      <Button 
        variant="contained" 
        fullWidth 
        sx={{
          backgroundColor: "primary.main",
          ...styles.eventTile
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
      {activity && <EventPreview
        open={openDialog}
        setOpen={setOpenDialog}
        event={event}
        activity={activity}
        allEvents={allEvents}
        setEvents={setEvents}
      />}
    </>
  );
}
