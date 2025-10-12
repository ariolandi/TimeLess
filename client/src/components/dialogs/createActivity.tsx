import { ActivityService } from "../../services/activityService";
import { Event, EventService } from '../../services/eventService';
import { useDayControls } from "../daysControl";
import { useCreateState } from "../stateControl";
import { ActivityDialog } from "./activityDialog";

const activityService = new ActivityService();
const eventService = new EventService();

interface DayControl {
  label: string,
  key: string,
  state: { value: boolean, set: React.Dispatch<React.SetStateAction<boolean>> }
}

export function CreateActivity({
  open,
  setOpen,
  events,
  setEvents,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  events: Event[][];
  setEvents: React.Dispatch<React.SetStateAction<Event[][]>>
}) {
  const title = useCreateState("");
  const description = useCreateState("");
  const timeToggle = useCreateState(false);
  const doRepeat = useCreateState(false);
  const repeatTimes = useCreateState("0");
  const duration = useCreateState<string | null>(null);
  const startTime = useCreateState<string | null>("9:00");
  const days: DayControl[] = useDayControls([]);
  
  const handleClose = () => {
    setOpen(false);
  };

  const saveActivity = async () => {
    const start_time = timeToggle.value === false ? null : startTime.value;
    const repeat = doRepeat.value === false ? "0" : repeatTimes.value;

    const result = await activityService.create({
      title: title.value,
      description: description.value,
      duration: duration.value,
      repeat,
      start_time,
      days: days.map((day: DayControl) => Boolean(day.state.value)).flatMap((day, index) => day ? index : []),
    });

    if (result) {
      const new_activity = result.data;
      eventService.create(new_activity.id);

      const newSchedule = events;
      for (const day in new_activity['days']) {
        const numericDay: number = +day;
        newSchedule[numericDay] = (await eventService.fetch(numericDay)).data;
      }

      setEvents(newSchedule);
    }
    handleClose();
  };

  return (
    <ActivityDialog 
      open={open}
      onClose={handleClose}
      onSave={saveActivity}
      dialogTitle="Създаване на дейност"
      title={title}
      description={description}
      timeToggle={timeToggle}
      doRepeat={doRepeat}
      repeatTimes={repeatTimes}
      duration={duration}
      startTime={startTime}
      days={days}
    />
  );
}
