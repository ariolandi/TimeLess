import { TimeField } from "@mui/x-date-pickers/TimeField";
import dayjs, { Dayjs } from "dayjs";
import { Dispatch, SetStateAction } from "react";
import { standardMargin } from "./styles";

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
  const toDaysjs = (time: string | null): Dayjs | null => {
    const year = "2000-01-01";
    return time ? dayjs(`${year}T${time}`) : null;
  };

  function fromDaysjs(datetime: Dayjs | null): string {
    const hours = datetime?.hour() || "00";
    const minutes = datetime?.minute() || "00";
    return `${hours}:${minutes}`;
  }

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
