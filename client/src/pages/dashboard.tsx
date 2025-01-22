import Header from "../components/header";
import { Container, Button } from "@mui/material";
import { styles } from "../components/styles";
import { ActivityDialog } from "../components/dialog";
import { useEffect, useState } from "react";
import Calendar from "../components/calendar";
import { Activity, ActivityService } from "../services/activityService";

const activityService = new ActivityService();

export default function DashBoard() {
  const [openDialog, setOpenDialog] = useState(false);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>();

  useEffect(() => {
    (async () => {
      try {
        const result = await activityService.fetch();
        console.log(result);
        setActivities(result.data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);


  console.log(activities);
  return (
    <Container maxWidth={false} disableGutters>
      <Header />
      <Container
        maxWidth="md"
        sx={{
          display: "flex",
          alignItems: "center",
          padding: "15px 0",
          margin: "0",
        }}
      >
        <Button
          variant="contained"
          sx={styles.submitButton}
          onClick={() => setOpenDialog(true)}
        >
          <b>Създай дейност</b>
        </Button>
        <ActivityDialog
          open={openDialog}
          setOpen={setOpenDialog}
          activities={activities}
          setActivities={setActivities}
        />
      </Container>
      <Calendar activities={activities} />
    </Container>
  );
}
