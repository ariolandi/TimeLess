import TextField from "@mui/material/TextField";

export interface InputParams {
  name: string;
  value: string;
  state: (value: string) => void;
  label: string;
  type?: string;
  multiline?: boolean;
}

export function InputTextField(field: InputParams,) {
  return (<TextField
    required
    fullWidth
    id={field.name}
    label={field.label}
    name={field.name}
    type={field.type || ''}
    variant="standard"
    value={field.value}
    sx={{marginTop: "15px"}}
    multiline={field.multiline || false}
    onChange={(e) => field.state(e.target.value)}
  />);
}
