import TextField from "@mui/material/TextField";
import { TimeField } from "@mui/x-date-pickers/TimeField";
import dayjs, { Dayjs } from "dayjs";
import { Dispatch, SetStateAction } from "react";

export interface InputParams {
  name: string;
  value: string;
  state: ((value: string) => void);
  label: string;
  type?: string;
  multiline?: boolean;
}

export interface TimeInputParams {
  name: string;
  value: Dayjs | null;
  state: Dispatch<SetStateAction<dayjs.Dayjs | null>>;
  label: string;
  type?: string;
  multiline?: boolean;
}

export function InputField({
  field,
  required,
  fullWidth,
  disabled,
}: { 
  field: InputParams,
  required?: boolean,
  fullWidth?: boolean,
  disabled?: boolean,
}) {
  return (<TextField
    required={required || false}
    fullWidth={fullWidth || false}
    id={field.name}
    label={field.label}
    name={field.name}
    type={field.type || ''}
    variant="standard"
    value={field.value}
    sx={{marginTop: "15px"}}
    multiline={field.multiline || false}
    disabled={disabled || false}
    onChange={(e) => field.state(e.target.value)}
  />);
}

export function TimeInput({
  field,
  required,
  disabled,
  variant,
}: { 
  field: TimeInputParams,
  required?: boolean,
  disabled?: boolean,
  variant?: "outlined" | "filled" | "standard"
}) {
  return (
    <TimeField
      required={required || false}
      disabled={disabled || false}
      format="HH:mm"
      label={field.label}
      name={field.name}
      value={field.value}
      size="small"
      variant={variant || "standard"}
      sx={{marginTop: "15px"}}
      onChange={(e) => field.state(e)}
    />
  );
}