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

interface DayControl {
  label: string,
  key: string,
  state: { value: boolean, set: React.Dispatch<React.SetStateAction<boolean>> }
}

export function ActivityDialog({
  open,
  onClose,
  onSave,
  dialogTitle,
  title,
  description,
  timeToggle,
  doRepeat,
  repeatTimes,
  duration,
  startTime,
  days
}: {
  open: boolean;
  onClose: () => void;
  onSave: () => void | Promise<void>;
  dialogTitle: string;
  title: State<string>;
  description: State<string>;
  timeToggle: State<boolean>;
  doRepeat: State<boolean>;
  repeatTimes: State<string>;
  duration: State<string | null>;
  startTime: State<string | null>;
  days: DayControl[];
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
      <Form onSubmit={onSave}>
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
              <Box>
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
