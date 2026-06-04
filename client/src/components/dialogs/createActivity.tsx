import { useState } from "react";
import { ActivityService } from "../../services/activityService";
import { useDayControls } from "../daysControl";
import { useCreateState } from "../stateControl";
import { ActivityDialog } from "./activityDialog";

const activityService = new ActivityService();

interface DayControl {
  label: string,
  key: string,
  state: { value: boolean, set: React.Dispatch<React.SetStateAction<boolean>> }
}

export function CreateActivity({
  guests,
  open,
  setOpen,
  onSaveChanges
}: {
  guests?: string[],
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSaveChanges: () => void
}) {
  const title = useCreateState("");
  const [error, setError] = useState("");
  const description = useCreateState("");
  const place = useCreateState("");
  const timeToggle = useCreateState(false);
  const doRepeat = useCreateState(false);
  const repeatTimes = useCreateState("0");
  const duration = useCreateState<string | null>(null);
  const startTime = useCreateState<string | null>("9:00");
  const dateToggle = useCreateState(false);
  const days: DayControl[] = useDayControls([]);
  const date = useCreateState<Date | null>(null);
  
  const handleClose = () => {
    setOpen(false);
  };

  const saveActivity = async () => {
    const start_time = timeToggle.value === false ? null : startTime.value;
    const repeat = doRepeat.value === false ? "0" : repeatTimes.value;

    try {
      if (guests) {
        await activityService.create_shared({
          title: title.value,
          description: description.value,
          place: place.value,
          duration: duration.value,
          repeat,
          start_time,
          days: days.map((day: DayControl) => Boolean(day.state.value)).flatMap((day, index) => day ? index : []),
          date: date.value,
          guests
        });
      }
      else {
        await activityService.create({
          title: title.value,
          description: description.value,
          place: place.value,
          duration: duration.value,
          repeat,
          start_time,
          days: days.map((day: DayControl) => Boolean(day.state.value)).flatMap((day, index) => day ? index : []),
          date: date.value
        });
      }

      onSaveChanges();
      
      handleClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Появи се грешка при създаването на дейността.");
    }

  };

  return (
    <ActivityDialog 
      open={open}
      onClose={handleClose}
      onSave={saveActivity}
      error={error}
      dialogTitle="Създаване на дейност"
      title={title}
      description={description}
      place={place}
      timeToggle={timeToggle}
      doRepeat={doRepeat}
      repeatTimes={repeatTimes}
      duration={duration}
      startTime={startTime}
      dateToggle={dateToggle}
      days={days}
      date={date}
    />
  );
}
