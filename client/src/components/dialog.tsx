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
import { Form } from "react-router-dom";
import { secondaryColor, smallMargin } from "./constants";

const activityService = new ActivityService();

function zip(keys: string[], values: Array<unknown>) {
  if (keys.length != values.length) return undefined;

  const zipped = keys.map((key, i) => [key, values[i]]);
  return Object.fromEntries(zipped);
}

interface DayControl {
  label: string,
  key: string,
  state: {value: boolean, set: React.Dispatch<React.SetStateAction<boolean>>}
}

export function ActivityDialog({
  open,
  setOpen,
  activities,
  setActivities,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  activities: Array<Activity[]>;
  setActivities: React.Dispatch<React.SetStateAction<Array<Activity[]>>>
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [timeToggle, setTimeToggle] = useState(false);
  const [doRepeat, setDoRepeat] = useState(false);
  const [repeat, setRepeat] = useState("0");
  const [duration, setDuration] = useState<string | null>(null);
  const [start_time, setStartTime] = useState<string | null>("9:00");
  const days: DayControl[] = [
    {
      label: "понеделник",
      key: "monday",
      state: zip(['value', 'set'], useState(true))
    },
    {
      label: "вторник",
      key: "tuesday",
      state: zip(['value', 'set'], useState(true))
    },
    {
      label: "сряда",
      key: "wednesday",
      state: zip(['value', 'set'], useState(true))
    },
    {
      label: "четвъртък",
      key: "thursday",
      state: zip(['value', 'set'], useState(true))
    },
    {
      label: "петък",
      key: "friday",
      state: zip(['value', 'set'], useState(true))
    },
    {
      label: "събота",
      key: "saturday",
      state: zip(['value', 'set'], useState(true))
    },
    {
      label: "неделя",
      key: "sunday",
      state: zip(['value', 'set'], useState(true))
    },
  ]

  const color = "secondary";

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async () => {
    if (timeToggle === false) {
      setStartTime(null);
    }

    if (doRepeat === false) {
      setRepeat("0");
    }

    const result = await activityService.create({
      title,
      description,
      duration,
      repeat,
      start_time,
      days: days.map((day: DayControl) => Boolean(day.state.value)),
    });
    if (result) {
      const new_activity = result.data;
      new_activity['days'].forEach((day, index) => {
        if (day === true) {
          activities[index].push(new_activity);
        }
      });
      setActivities(activities);
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
    value: start_time,
    state: setStartTime,
    label: "Начален час",
  };

  const durationInput: TimeInputParams = {
    name: "duration",
    value: duration,
    state: setDuration,
    label: "Продължителност",
    required: true,
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
        Създаване на дейност
      </DialogTitle>
      <Form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <GridColumn>
              <InputField field={titleInput} />
            </GridColumn>
            <GridColumn>
              <TimeInput field={durationInput} />
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
                      checked={doRepeat}
                      onChange={(e) => setDoRepeat(e.target.checked)}
                    />
                  }
                  label={
                    <Typography> Повтаря се през деня </Typography>
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
            <Grid item xs={12}>
              <Box>
                {days.map((day) => {
                  return (
                    <FormControlLabel key={day.key} sx={{margin: smallMargin}}
                      control={
                        <Checkbox
                          checked={day.state.value}
                          onChange={(e) => day.state.set(e.target.checked)}
                        />
                      }
                      label={
                        <Typography> {day.label} </Typography>
                      }
                      labelPlacement="bottom"
                    />
                  );
                })}
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button color={color} onClick={handleClose}>Затвори</Button>
          <Button color={color} type="submit">Създай</Button>
        </DialogActions>
      </Form>
    </Dialog>
  );
}
