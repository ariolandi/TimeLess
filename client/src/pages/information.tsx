import "../css/App.css";
import { Box, Grid, Typography, TextField, Checkbox, Divider, FormControlLabel } from "@mui/material";
import { TimeField } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import { useState, Dispatch, SetStateAction } from "react";
import { useParams } from "react-router-dom";
import { Logo } from "../components/components";
import { styles, smallMarginPercent } from "../components/styles";
import { SubmitButton } from "../components/components";

interface TimeParams {
  name: string;
  value: Dayjs | null;
  state: Dispatch<SetStateAction<Dayjs | null>>;
  label: string;
}

interface TimeFieldParams {
  time_params: TimeParams[];
  text: string;
  can_disable: boolean;
}

function TimeFields(params: TimeFieldParams) {
  const [disable, setCheck] = useState(false);

  return (
    <Grid item margin={smallMarginPercent}>
      <Typography color="primary.main">{params.text}</Typography>
      {params.time_params.map((field) => {
        return (
          <Grid item key={field.name} marginTop={smallMarginPercent}>
            <TimeField
              disabled={disable}
              format="HH:mm"
              id={field.name}
              label={field.label}
              name={field.name}
              value={field.value}
              onChange={(e) => field.state(e)}
            />
          </Grid>
        );
      })}
      {params.can_disable && (
        <FormControlLabel
          control={
            <Checkbox
              value={disable}
              onChange={(e) => setCheck(e.target.checked)}
            />
          }
          label={
            <Typography color="primary.main"> Същите като в делничен ден </Typography>
          }
        />
      )}
  </Grid>
  );
}

export default function Information() {
  const { userId } = useParams<{ userId: string }>();
  console.log(userId);

  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [start_time, setStartTime] = useState<Dayjs | null>(
    dayjs("2000-01-01T9:00")
  );
  const [end_time, setEndTime] = useState<Dayjs | null>(
    dayjs("2000-01-01T18:00")
  );
  const [weekend_start_time, setWeekendStartTime] = useState<Dayjs | null>(
    dayjs("2000-01-01T9:00")
  );
  const [weekend_end_time, setWeekendEndTime] = useState<Dayjs | null>(
    dayjs("2000-01-01T18:00")
  );

  const text_params = [
    {
      name: "first_name",
      value: first_name,
      state: setFirstName,
      label: "Име",
      type: "",
    },
    {
      name: "last_name",
      value: last_name,
      state: setLastName,
      label: "Фамилия",
      type: "",
    },
  ];

  const weekday_time_params = [
    {
      name: "start_time",
      value: start_time,
      state: setStartTime,
      label: "Начален час",
    },
    {
      name: "end_time",
      value: end_time,
      state: setEndTime,
      label: "Краен час",
    },
  ];

  const weekend_time_params = [
    {
      name: "weekend_start_time",
      value: weekend_start_time,
      state: setWeekendStartTime,
      label: "Начален час",
    },
    {
      name: "weekend_end_time",
      value: weekend_end_time,
      state: setWeekendEndTime,
      label: "Краен час",
    },
  ];

  return (
    <Grid
      sx={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Grid
        container
        direction="column"
        alignItems="center"
        sx={styles.headerBlock}
      >
        <Grid item>
          <Logo maxHeight={1} />
        </Grid>
        <Divider
          orientation="horizontal"
          variant="middle"
          flexItem
          sx={{ bgcolor: "secondary.main" }}
        />
        <Typography
          variant="h5"
          textAlign="center"
          padding={smallMarginPercent}
          color="primary.contrastText"
        >
          <b>Нуждаем се от още малко информация</b>
        </Typography>
      </Grid>
      <Grid item>
        <Box
          component="form"
          noValidate
          sx={{
            ...styles.formBorder,
            ...styles.column,
            ...{ color: "secondary.main" },
          }}
        >
          <Grid container spacing={4}>
            {text_params.map((field) => {
              return (
                <Grid item xs={12} sm={6} key={field.name}>
                  <TextField
                    fullWidth
                    id={field.name}
                    label={field.label}
                    name={field.name}
                    type={field.type}
                    variant="standard"
                    value={field.value}
                    onChange={(e) => field.state(e.target.value)}
                  />
                </Grid>
              );
            })}
          </Grid>
          <Grid container>
            <Grid item xs={12} sm={6}>
              <TimeFields
                time_params={weekday_time_params}
                text="Начален и краен час в делнични дни"
                can_disable={false}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TimeFields
                time_params={weekend_time_params}
                text="Начален и краен час в почивни дни"
                can_disable={true}
              />
            </Grid>
          </Grid>
          <Grid
            item
            width={1}
            marginTop={smallMarginPercent}
            sx={styles.column}
          >
            <SubmitButton buttonText={"Напред"} />
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
}
