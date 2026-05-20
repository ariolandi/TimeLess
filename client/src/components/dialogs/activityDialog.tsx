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
import { InputParams, InputField } from "../inputField";
import { TimeInput, TimeInputParams } from "../timeField";
import { GridColumn } from "../components";
import { Form } from "react-router-dom";
import { secondaryColor, smallMargin } from "../constants";
import { State } from "../stateControl";
import { DateField } from "@mui/x-date-pickers";

interface DayControl {
  label: string,
  key: string,
  state: { value: boolean, set: React.Dispatch<React.SetStateAction<boolean>> }
}

export function ActivityDialog({
  open,
  onClose,
  onSave,
  error,
  dialogTitle,
  title,
  description,
  place,
  timeToggle,
  doRepeat,
  repeatTimes,
  duration,
  startTime,
  dateToggle,
  days,
  date
}: {
  open: boolean;
  onClose: () => void;
  onSave: () => void | Promise<void>;
  error: string;
  dialogTitle: string;
  title: State<string>;
  place: State<string>;
  description: State<string>;
  timeToggle: State<boolean>;
  doRepeat: State<boolean>;
  repeatTimes: State<string>;
  duration: State<string | null>;
  startTime: State<string | null>;
  dateToggle: State<boolean>;
  days: DayControl[];
  date: State<Date | null>;
}) {
  const color = "secondary";

  const titleInput: InputParams = {
    name: "title",
    value: title.value,
    state: title.set,
    label: "Заглавие",
    required: true,
  };

  const descriptionInput: InputParams = {
    name: "description",
    value: description.value,
    state: description.set,
    label: "Описание",
    multiline: true,
  };

  const repeatInput: InputParams = {
    name: "repeat",
    value: repeatTimes.value,
    state: repeatTimes.set,
    label: "Повторения",
    type: "number",
  };

  const startTimeInput: TimeInputParams = {
    name: "startTime",
    value: startTime.value,
    state: startTime.set,
    label: "Начален час",
  };

  const durationInput: TimeInputParams = {
    name: "duration",
    value: duration.value,
    state: duration.set,
    label: "Продължителност",
    required: true,
  };

  const placeInput: InputParams = {
    name: "place",
    value: place.value,
    state: place.set,
    label: "Място на провеждане",
  };

  const onsubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    await onSave();
  }

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
        {dialogTitle}
      </DialogTitle>
      <Typography color="error" textAlign="center">
        {error}
      </Typography>
      <Form onSubmit={onsubmit}>
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
              <InputField field={placeInput} fullWidth={true} />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch onChange={(e) => timeToggle.set(e.target.checked)} />
                }
                label={
                  <Typography> Фиксиран час </Typography>
                }
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: timeToggle.value ? "none" : "block" }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={doRepeat.value}
                      onChange={(e) => doRepeat.set(e.target.checked)}
                    />
                  }
                  label={
                    <Typography> Повтаря се през деня </Typography>
                  }
                />
                <InputField
                  field={repeatInput}
                  fullWidth={false}
                  disabled={!doRepeat.value}
                  color={color}
                />
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: timeToggle.value ? "block" : "none" }}>
                <TimeInput field={startTimeInput} />
              </Box>
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch onChange={(e) => dateToggle.set(e.target.checked)} />
                }
                label={
                  <Typography> Фиксирана дата </Typography>
                }
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: dateToggle.value ? "none" : "block" }}>
                {days.map((day) => {
                  return (
                    <FormControlLabel key={day.key} sx={{ margin: smallMargin }}
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
              <Box sx={{ display: dateToggle.value ? "block" : "none" }}>
                <DateField
                  label="Дата"
                  value={date.value}
                  onChange={(newValue) => date.set(newValue)}
                  format="DD.MM.YYYY"
                />
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button color={color} type="submit">Запази</Button>
          <Button color={color} onClick={onClose}>Затвори</Button>
        </DialogActions>
      </Form>
    </Dialog>
  );
}
