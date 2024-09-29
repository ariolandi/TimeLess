import { Box, Button, Checkbox, DialogActions, DialogContent, DialogTitle, FormControlLabel, Grid, Switch, Typography } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import { useState } from "react";
import { InputParams, InputField } from "./textField";
import { TimeInput, TimeInputParams } from "./timeField";
import { ActivityService } from "../services/activityService";
import { GridColumn } from "./components";

const activityService = new ActivityService();

export function ActivityDialog({isOpen}: {isOpen: boolean}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [timeToggle, setTimeToggle] = useState(false);
  const [doRepeat, setDoRepeat] = useState(false);
  const [repeat, setRepeat] = useState("0");
  const [duration, setDuration] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<string | null>("9:00");

  const handleClose = () => {
    isOpen = false;
  };

  const handleSubmit = async () => {
    const result = await activityService.create({title, description, duration, repeat, startTime});
    console.log(result);
    handleClose();
  }

  const titleInput: InputParams = {
    name: "title",
    value: title,
    state: setTitle,
    label: "Заглавие",
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
  }

  const durationInput: TimeInputParams = {
    name: "duration",
    value: duration,
    state: setDuration,
    label: "Продължителност",
  }

  return (
    <Dialog
      open={isOpen}
      fullWidth={true}
    >
      <DialogTitle
        sx={{
          backgroundColor: "primary.main",
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
            <InputField
              field={titleInput}
              required={true}
            />
          </GridColumn>
          <GridColumn>
            <TimeInput
              field={durationInput}
              required={true}
            />
          </GridColumn>
          <Grid item xs={12}>
            <InputField
              field={descriptionInput}
              fullWidth={true}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel 
              control={<Switch onChange={(e) => setTimeToggle(e.target.checked)}/>} 
              label={<Typography color="primary.main"> Фиксиран час </Typography>}
            />
          </Grid>
          <Grid item xs={12}>
            <Box sx={{display: timeToggle ? "none" : "block"}}>
              <FormControlLabel
                control={
                  <Checkbox
                    value={doRepeat}
                    onChange={(e) => setDoRepeat(e.target.checked)}
                  />
                }
                label={<Typography color="primary.main"> Повтаря се </Typography>}
              />
              <InputField
                field={repeatInput}
                fullWidth={false}
                disabled={!doRepeat}
              />
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box sx={{display: timeToggle ? "block" : "none"}}>
              <TimeInput
                field={startTimeInput}
              />
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Затвори</Button>
        <Button onClick={handleSubmit}>Създай</Button>
      </DialogActions>
    </Dialog>
  );
}
