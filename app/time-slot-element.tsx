"use client";

import { isWeekend, parseISO } from "date-fns";
import { useRouter } from "next/navigation";
import { cn } from "./common/classnames";
import { TimeSlot, WorkEntryDto } from "./common/model";
import { useWeekViewInteraction } from "./week-view-interaction";

type TimeSlotElementProps = {
  date: string;
  timeSlot: number;
  isOccupied: boolean;
};

export function TimeSlotElement({
  date,
  timeSlot,
  isOccupied,
}: TimeSlotElementProps) {
  const {
    dragBegin,
    setDragBegin,
    setDragEnd,
    dragDay,
    setDragDay,
    isBusy,
    period,
    startTransition,
    setIsMutating,
  } = useWeekViewInteraction();

  const router = useRouter();
  const parsedDate = parseISO(date);
  const parsedTimeSlot = TimeSlot.fromValue(timeSlot);
  return (
    <div
      className={cn(
        "h-5 border-r border-slate-200 cursor-pointer",
        parsedDate.getDay() === 0 && "border-l",
        parsedTimeSlot.quarter % 2 === 1 && "border-b",
        (parsedTimeSlot.hour < 8 ||
          parsedTimeSlot.hour >= 17 ||
          isWeekend(parsedDate)) &&
          "bg-slate-50",
        period?.contains(parsedTimeSlot) &&
          dragDay === parsedDate.getDay() &&
          "bg-sky-100",
        isOccupied && "bg-sky-200"
      )}
      onMouseOver={() => {
        if (!dragBegin || isBusy) return;

        setDragEnd(parsedTimeSlot);
      }}
      onClick={async () => {
        if (isBusy) return;

        if (!dragBegin) {
          setDragBegin(parsedTimeSlot);
          setDragDay(parsedDate.getDay());
        } else {
          setIsMutating(true);
          await fetch("/api/entries", {
            method: "POST",
            body: JSON.stringify({
              date,
              startTime: period!.start.timeOfDay.value,
              endTime: period!.end.next().timeOfDay.value,
            } as WorkEntryDto),
          });
          setIsMutating(false);

          startTransition(() => {
            router.refresh();

            setDragBegin(undefined);
            setDragEnd(undefined);
          });
        }
      }}
    ></div>
  );
}
