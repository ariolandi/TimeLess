import TextField from "@mui/material/TextField";

export interface InputParams {
  name: string;
  value: string;
  state: ((value: string) => void);
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
