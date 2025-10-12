import { Activity, ActivityService } from "../../services/activityService";
import { Event, EventService } from "../../services/eventService";
import { DayControl, useDayControls } from "../daysControl";
import { useCreateState } from "../stateControl";
import { ActivityDialog } from "./activityDialog";

const activityService = new ActivityService();
const eventService = new EventService();

export function UpdateActivity({
  open,
  setOpen,
  activity,
  event,
  events,
  setEvents,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  activity: Activity;
  event: Event;
  events: Event[][];
  setEvents: React.Dispatch<React.SetStateAction<Event[][]>>
}) {
  const title = useCreateState(activity.title);
  const description = useCreateState(activity.description);
  const timeToggle = useCreateState(activity.start_time != null);
  const doRepeat = useCreateState(activity.repeat > 1);
  const repeatTimes = useCreateState(`${activity.repeat}`);
  const duration = useCreateState<string | null>(activity.duration);
  const startTime = useCreateState<string | null>(activity.start_time || event.start_time);
  const days: DayControl[] = useDayControls(activity.days);
  const onClose = () => {
    setOpen(false);
  };

  const onSubmit = async () => {
    const start_time = timeToggle.value === false ? null : startTime.value;
    const repeat = doRepeat.value === false ? "0" : repeatTimes.value;
    const activityDays = days.map((day: DayControl) => Boolean(day.state.value)).flatMap((day, index) => day ? index : []);

    const result = await activityService.update(activity.id, {
      title: title.value,
      description: description.value,
      duration: duration.value,
      repeat,
      start_time,
      days: activityDays
    });

    if (result) {
      const newSchedule = events;
      for (const day in activityDays) {
        const numericDay: number = +day;
        newSchedule[numericDay] = (await eventService.fetch(numericDay)).data;
      }

      setEvents(newSchedule);
    }

    onClose();
  };

  return (
    <ActivityDialog 
      open={open}
      onClose={onClose}
      onSave={onSubmit}
      dialogTitle="Промяна на дейност"
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
