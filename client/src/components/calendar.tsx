import { Button, Container } from "@mui/material";
import { Activity } from "../services/activityService";
import { styles } from "./styles";

export default function Calendar({ activities }: { activities: Activity[] }) {
  return (
    <Container
      sx={{
        ...styles.formBorder,
        ...{
          color: "primary.main",
          width: "50%",
        },
      }}
    >
      {activities.map((activity) => {
        return (
          <Button variant="contained" fullWidth sx={styles.submitButton}>
            <b>{activity.title}</b>
          </Button>
        );
      })}
    </Container>
  );
}
