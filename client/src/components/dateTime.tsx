import dayjs, { Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

export const toDaysjs = (time: string | null): Dayjs | null => {
  const year = "2000-01-01";
  return time ? dayjs(`${year}T${time}`) : null;
};

export function fromDaysjs(datetime: Dayjs | null): string {
  if (!datetime) {
    return "00:00";
  }

  const hours = datetime.hour().toString().padStart(2, "0");
  const minutes = datetime.minute().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}

export function formatTime(datetime: string | null): string | null {
  if (datetime === null) {
    return null;
  }

  const isoTimeDate = dayjs.utc(datetime);
  return fromDaysjs(isoTimeDate);
}