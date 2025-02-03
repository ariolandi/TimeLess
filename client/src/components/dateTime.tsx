import dayjs, { Dayjs } from "dayjs";

export const toDaysjs = (time: string | null): Dayjs | null => {
  const year = "2000-01-01";
  return time ? dayjs(`${year}T${time}`) : null;
};

export function fromDaysjs(datetime: Dayjs | null): string {
  const hours = datetime?.hour() || "00";
  const minutes = datetime?.minute() || "00";
  return `${hours}:${minutes}`;
}

export function formatTime(datetime: string | null): string | null {
  if (datetime === null) {
    return null;
  }

  const isoTimeDate = dayjs(datetime);
  return fromDaysjs(isoTimeDate);
}