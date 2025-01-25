import { TimeField } from "@mui/x-date-pickers/TimeField";
import { Dispatch, SetStateAction } from "react";
import { standardMargin } from "./styles";
import { fromDaysjs, toDaysjs } from "./dateTime";

export interface TimeInputParams {
  name: string;
  value: string | null;
  state: Dispatch<SetStateAction<string | null>>;
  label: string;
}

export function TimeInput({
  field,
  required,
  disabled,
  variant,
}: {
  field: TimeInputParams;
  required?: boolean;
  disabled?: boolean;
  variant?: "outlined" | "filled" | "standard";
}) {

  return (
    <TimeField
      required={required || false}
      disabled={disabled || false}
      format="HH:mm"
      label={field.label}
      name={field.name}
      value={toDaysjs(field.value)}
      size="small"
      color="primary"
      variant={variant || "standard"}
      sx={{ marginTop: standardMargin }}
      onChange={(e) => {
        field.state(fromDaysjs(e));
      }}
    />
  );
}
