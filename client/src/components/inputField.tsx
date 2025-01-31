import TextField from "@mui/material/TextField";
import { standardMargin } from "./styles";

export interface InputParams {
  name: string;
  value: string;
  state: (value: string) => void;
  label: string;
  type?: string;
  multiline?: boolean;
  required?: boolean;
}

export function InputField({
  field,
  fullWidth,
  disabled,
  error,
  color,
}: {
  field: InputParams;
  fullWidth?: boolean;
  disabled?: boolean;
  error?: boolean;
  color?: "primary" | "secondary";
}) {
  return (
    <TextField
      required={field.required}
      error={error}
      fullWidth={fullWidth}
      id={field.name}
      label={field.label}
      name={field.name}
      type={field.type}
      variant="standard"
      value={field.value}
      multiline={field.multiline}
      disabled={disabled}
      sx={{
        color: color || "primary",
        marginTop: standardMargin 
      }}
      helperText={error && "Това поле е задължително"}
      onChange={(e) => field.state(e.target.value)}
    />
  );
}
