import { Box, Button, Checkbox, DialogActions, DialogContent, DialogTitle, FormControlLabel, Grid, Switch, Typography } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import { useState } from "react";
import { InputParams, InputField, TimeInput, TimeInputParams } from "./textField";
import dayjs, { Dayjs } from "dayjs";

export function SimpleDialog(isOpen: boolean = true) {
  const [open, setOpen] = useState(isOpen);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [timeToggle, setTimeToggle] = useState(false);
  const [doRepeat, setDoRepeat] = useState(false);
  const [repeat, setRepeat] = useState("0");
  const [duration, setDuration] = useState<Dayjs | null>(null);
  const [startTime, setStartTime] = useState<Dayjs | null>(dayjs("2000-01-01T9:00"));

  const handleClose = () => {
    setOpen(false);
  };

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
      open={open}
      fullWidth={true}
      onClose={handleClose}
      PaperProps={{
        component: "form",
        onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          // handleClose();
        },
      }}
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
          <Grid item xs={12} sm={6}>
            <InputField
              field={titleInput}
              required={true}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TimeInput
              field={durationInput}
              required={true}
            />
          </Grid>
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
        <Button type="submit">Създай</Button>
      </DialogActions>
    </Dialog>
  );
}
