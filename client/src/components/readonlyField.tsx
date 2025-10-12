import TextField from "@mui/material/TextField";
import { standardMargin } from "./constants";

export interface ReadonlyInputParams {
  name: string;
  value: string;
  label: string;
  type?: string;
  multiline?: boolean;
}

export function ReadonlyField({
  field,
  fullWidth,
  color,
  variant
}: {
  field: ReadonlyInputParams;
  fullWidth?: boolean;
  color?: "primary" | "secondary";
  variant?: "outlined" | "standard"
}) {
  return (
    <TextField
      fullWidth={fullWidth}
      id={field.name}
      label={field.label}
      name={field.name}
      type={field.type}
      variant={variant ?? "standard"}
      value={field.value}
      multiline={field.multiline}
      inputProps={{ readOnly: true }}
      sx={{
        color: color || "primary",
        marginTop: standardMargin 
      }}
      
    />
  );
}
