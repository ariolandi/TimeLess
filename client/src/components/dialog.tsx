import {
  Box,
  Button,
  Checkbox,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  Switch,
  Typography,
} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import { useState } from "react";
import { InputParams, InputField } from "./inputField";
import { TimeInput, TimeInputParams } from "./timeField";
import { Activity, ActivityService } from "../services/activityService";
import { GridColumn } from "./components";

const activityService = new ActivityService();

export function ActivityDialog({
  open,
  setOpen,
  activities,
  setActivities,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  activities: Activity[];
  setActivities: React.Dispatch<React.SetStateAction<Activity[]>>
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [timeToggle, setTimeToggle] = useState(false);
  const [doRepeat, setDoRepeat] = useState(false);
  const [repeat, setRepeat] = useState("0");
  const [duration, setDuration] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<string | null>("9:00");

  const mainColor = "secondary.main";
  const color = "secondary";

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async () => {
    const result = await activityService.create({
      title,
      description,
      duration,
      repeat,
      startTime,
    });
    if (result) {
      setActivities([...activities, result.data]);
    }
    handleClose();
  };

  const titleInput: InputParams = {
    name: "title",
    value: title,
    state: setTitle,
    label: "Заглавие",
    required: true,
  };

  const descriptionInput: InputParams = {
    name: "description",
    value: description,
    state: setDescription,
    label: "Описание",
    multiline: true,
  };

  const repeatInput: InputParams = {
    name: "repeat",
    value: repeat,
    state: setRepeat,
    label: "Повторения",
    type: "number",
  };

  const startTimeInput: TimeInputParams = {
    name: "startTime",
    value: startTime,
    state: setStartTime,
    label: "Начален час",
  };

  const durationInput: TimeInputParams = {
    name: "duration",
    value: duration,
    state: setDuration,
    label: "Продължителност",
  };

  return (
    <Dialog open={open} fullWidth={true}>
      <DialogTitle
        sx={{
          backgroundColor: mainColor,
          color: "primary.contrastText",
          textAlign: "center",
          fontWeight: "bolder",
        }}
      >
        Създаване на дейност
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <GridColumn>
            <InputField field={titleInput} />
          </GridColumn>
          <GridColumn>
            <TimeInput field={durationInput} required={true} />
          </GridColumn>
          <Grid item xs={12}>
            <InputField field={descriptionInput} fullWidth={true} />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch onChange={(e) => setTimeToggle(e.target.checked)} />
              }
              label={
                <Typography> Фиксиран час </Typography>
              }
            />
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ display: timeToggle ? "none" : "block" }}>
              <FormControlLabel
                control={
                  <Checkbox
                    value={doRepeat}
                    onChange={(e) => setDoRepeat(e.target.checked)}
                  />
                }
                label={
                  <Typography> Повтаря се </Typography>
                }
              />
              <InputField
                field={repeatInput}
                fullWidth={false}
                disabled={!doRepeat}
                color={color}
              />
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ display: timeToggle ? "block" : "none" }}>
              <TimeInput field={startTimeInput} />
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button color={color}  onClick={handleClose}>Затвори</Button>
        <Button color={color} onClick={handleSubmit}>Създай</Button>
      </DialogActions>
    </Dialog>
  );
}
