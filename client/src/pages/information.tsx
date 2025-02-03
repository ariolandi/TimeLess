import "../css/App.css";
import {
  Box,
  Grid,
  Typography,
  Checkbox,
  Divider,
  FormControlLabel,
  Container,
} from "@mui/material";
import { useState } from "react";
import { GridColumn, Logo } from "../components/components";
import { styles } from "../components/styles";
import { SubmitButton } from "../components/components";
import { UserService } from "../services/userService";
import { useNavigate } from "react-router-dom";
import { InputField, InputParams } from "../components/inputField";
import { TimeInput, TimeInputParams } from "../components/timeField";
import {
  primaryColor,
  secondaryColor,
  smallMargin,
  smallMarginPercent,
} from "../components/constants";

const userService = new UserService();

interface TimeFieldParams {
  time_params: TimeInputParams[];
  text: string;
  disabled: boolean;
}

export default function Information() {
  const navigate = useNavigate();

  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [start_time, setStartTime] = useState<string | null>("9:00");
  const [end_time, setEndTime] = useState<string | null>("18:00");
  const [weekend_start_time, setWeekendStartTime] = useState<string | null>("9:00");
  const [weekend_end_time, setWeekendEndTime] = useState<string | null>("18:00");
  const [sameTime, setSameTime] = useState(false);
  const [errorText, setErrorText] = useState("");

  const text_params: InputParams[] = [
    {
      name: "first_name",
      value: first_name,
      state: setFirstName,
      label: "Име",
      required: true,
    },
    {
      name: "last_name",
      value: last_name,
      state: setLastName,
      label: "Фамилия",
      required: true,
    },
  ];

  const weekday_time_params: TimeInputParams[] = [
    {
      name: "start_time",
      value: start_time,
      state: setStartTime,
      label: "Начален час",
      required: true,
    },
    {
      name: "end_time",
      value: end_time,
      state: setEndTime,
      label: "Краен час",
      required: true,
    },
  ];

  const weekend_time_params: TimeInputParams[] = [
    {
      name: "weekend_start_time",
      value: weekend_start_time,
      state: setWeekendStartTime,
      label: "Начален час",
      required: true,
    },
    {
      name: "weekend_end_time",
      value: weekend_end_time,
      state: setWeekendEndTime,
      label: "Краен час",
      required: true,
    },
  ];

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const result = await userService.information({
      first_name,
      last_name,
      start_time,
      end_time,
      weekend_start_time,
      weekend_end_time,
    });

    if (result) {
      navigate(`/dashboard`);
    } else {
      setErrorText("Невалидни потребителски данни");
    }
  };

  return (
    <Grid sx={styles.column}>
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
          sx={{ backgroundColor: secondaryColor }}
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
          onSubmit={onSubmit}
          sx={{
            ...styles.formBorder,
            ...styles.column,
            ...{ color: secondaryColor },
          }}
        >
          <Grid container spacing={4}>
            {text_params.map((field) => {
              return (
                <GridColumn key={field.name}>
                  <Container sx={{ marginTop: smallMargin }}>
                    <InputField field={field} fullWidth={true} />
                  </Container>
                </GridColumn>
              );
            })}
          </Grid>
          <Grid container sx={{ marginTop: smallMargin }}>
            <GridColumn>
              <TimeFields
                time_params={weekday_time_params}
                text="Начален и краен час в делнични дни"
                disabled={false}
              />
            </GridColumn>
            <GridColumn>
              <TimeFields
                time_params={weekend_time_params}
                text="Начален и краен час в почивни дни"
                disabled={sameTime}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    value={sameTime}
                    onChange={(e) => {
                      setWeekendStartTime(start_time);
                      setWeekendEndTime(end_time);
                      setSameTime(e.target.checked);
                    }}
                  />
                }
                label={
                  <Typography color={primaryColor}>
                    {" "}
                    Същите като в делничен ден{" "}
                  </Typography>
                }
              />
            </GridColumn>
          </Grid>
          <Grid item xs={12}>
            <Typography sx={{ color: secondaryColor }}>
              {" "}
              {errorText}{" "}
            </Typography>
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

function TimeFields(params: TimeFieldParams) {
  return (
    <Grid item margin={smallMarginPercent}>
      <Typography color={primaryColor}> {params.text} </Typography>
      {params.time_params.map((field) => {
        return (
          <Grid item key={field.name} marginTop={smallMarginPercent}>
            <TimeInput
              field={field}
              disabled={params.disabled}
              variant={"outlined"}
            />
          </Grid>
        );
      })}
    </Grid>
  );
}
