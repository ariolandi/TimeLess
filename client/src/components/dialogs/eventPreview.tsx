import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import { Activity, ActivityService } from "../../services/activityService";
import { Event } from "../../services/eventService";
import { GridColumn } from "../components";
import { Form } from "react-router-dom";
import { secondaryColor } from "../constants";
import { ReadonlyField } from "../readonlyField"
import { UpdateActivity } from "./updateActivity";
import { useState } from "react";

const activityService = new ActivityService();

export function EventPreview({
  open,
  setOpen,
  event,
  activity,
  onSaveChanges
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  event: Event;
  activity: Activity;
  onSaveChanges: () => void
}) {
  const color = "secondary";
  const [openDialog, setOpenDialog] = useState(false);

  const onClose = () => {
    setOpen(false);
  };

  const onSubmit = () => {
    setOpenDialog(true);
    onClose();
  };

  const onDelete = async () => {
    await activityService.delete(activity.id);
    
    onSaveChanges();
    onClose();
  };

  return (
    <>
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
        <Form onSubmit={onSubmit}>
          <DialogContent>
            <Grid container spacing={2}>
              <GridColumn>
                <ReadonlyField
                  field={
                    {
                      name: "start time",
                      value: event.start_time,
                      label: "Начален час",
                    }
                  }
                />
              </GridColumn>
              <GridColumn>
                <ReadonlyField
                  field={
                    {
                      name: "end time",
                      value: event.end_time,
                      label: "Краен час",
                    }
                  }
                />
              </GridColumn>
              <Grid item xs={12}>
                <ReadonlyField 
                  field={
                    {
                      name: "description",
                      value: activity.description,
                      label: "Описание",
                      multiline: true
                    } 
                  }
                  variant="outlined"
                  fullWidth={true}
                  />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button color={color} type="submit">Промени</Button>
            <Button color={color} onClick={onDelete}>Изтрий</Button>
            <Button color={color} onClick={onClose}>Затвори</Button>
          </DialogActions>
        </Form>
      </Dialog>
      <UpdateActivity 
        activity={activity} 
        event={event}
        open={openDialog} 
        setOpen={setOpenDialog}
        onSaveChanges={onSaveChanges}
      />
    </>
  );
}
