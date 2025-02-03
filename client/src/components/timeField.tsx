import { TimeField } from "@mui/x-date-pickers/TimeField";
import { Dispatch, SetStateAction } from "react";
import { fromDaysjs, toDaysjs } from "./dateTime";
import { standardMargin } from "./constants";

export interface TimeInputParams {
  name: string;
  value: string | null;
  state: Dispatch<SetStateAction<string | null>>;
  label: string;
  required?: boolean;
}

export function TimeInput({
  field,
  disabled,
  variant,
}: {
  field: TimeInputParams;
  disabled?: boolean;
  variant?: "outlined" | "filled" | "standard";
}) {

  return (
    <TimeField
      required={field.required || false}
      disabled={disabled || false}
      format="HH:mm"
      label={field.label}
      name={field.name}
      value={toDaysjs(field.value)}
      size="small"
      variant={variant || "standard"}
      sx={{ 
        color: "primary",
        marginTop: standardMargin 
      }}
      onChange={(e) => {
        field.state(fromDaysjs(e));
      }}
    />
  );
}
