import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import { Activity } from "../services/activityService";
import { Event } from "../services/eventService";
import { GridColumn } from "./components";
import { Form } from "react-router-dom";
import { secondaryColor } from "./constants";

export function EventPreview({
  open,
  setOpen,
  event,
  activity,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  event: Event;
  activity: Activity;
}) {
  const color = "secondary";

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = () => {
    handleClose();
  };

  return (
    <Dialog open={open} fullWidth={true}>
      <DialogTitle
        sx={{
          backgroundColor: secondaryColor,
          color: "primary.contrastText",
          textAlign: "center",
          fontWeight: "bolder",
        }}
      >
        {event.title}
      </DialogTitle>
      <Form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <GridColumn>
              { "Начален час: " + event.start_time }
            </GridColumn>
            <GridColumn>
              { "Краен час: " + event.end_time }
            </GridColumn>
            <Grid item xs={12}>
              { activity.description }
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button color={color} onClick={handleClose}>Затвори</Button>
          <Button color={color} type="submit">Промени</Button>
        </DialogActions>
      </Form>
    </Dialog>
  );
}
