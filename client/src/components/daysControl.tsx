import { useState } from "react";
import { createState, State } from "./stateControl";

export interface DayControl {
  label: string,
  key: string,
  state: State<boolean>
}

const dayLabels = [
  { label:  "понеделник", key: "monday" },
  { label: "вторник", key: "tuesday" },
  { label: "сряда", key: "wednesday" },
  { label: "четвъртък", key: "thursday" },
  { label: "петък", key: "friday" },
  { label: "събота", key: "saturday" },
  { label: "неделя", key: "sunday" },
]

export function useDayControls(days: number[]): DayControl[] {
  return dayLabels.map((day, index) => {
      return {
        label: day.label,
        key: day.key,
        // eslint-disable-next-line react-hooks/rules-of-hooks
        state: createState<boolean>(useState(days.includes(index)))
      }
    }
  )
}