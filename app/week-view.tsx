import { WorkEntry } from "@prisma/client";
import {
  addDays,
  format,
  formatISO,
  isSameDay,
  isToday,
  isWeekend,
} from "date-fns";
import { Fragment } from "react";
import { cn } from "./common/classnames";
import { CalendarWeek, TimeOfDay, TimeSlot } from "./common/model";
import { TimeSlotElement } from "./time-slot-element";
import { WeekViewInteractionProvider } from "./week-view-interaction";

type WeekViewProps = { calendarWeek: CalendarWeek; workEntries: WorkEntry[] };

export function WeekView({ calendarWeek, workEntries }: WeekViewProps) {
  const startOfWeekDate = calendarWeek.startDate;
  return (
    <WeekViewInteractionProvider>
      <div className="divide-slate-200 divide-y text-sm contents">
        <div className="grid grid-cols-7 divide-x divide-slate-100">
          <div className="col-end-1 w-14"></div>
          {Array.from({ length: 7 }).map((_, i) => (
            <DayHeader key={i} date={addDays(startOfWeekDate, i)} />
          ))}
        </div>
        <div className="shadow-inner overflow-scroll">
          <div className="grid grid-cols-7">
            <div className="col-end-1 h-4 w-14"></div>
            {Array.from({ length: 7 }).map((_, dayofWeekIndex) => (
              <Fragment key={dayofWeekIndex}>
                <div
                  className={cn(
                    "h-4 border-b border-r border-slate-200 bg-slate-50",
                    dayofWeekIndex === 0 && "border-l"
                  )}
                ></div>
              </Fragment>
            ))}
            {timeSlots.map((timeSlot) => (
              <Fragment key={timeSlot.toString()}>
                <div className="col-end-1 h-5 w-14">
                  <div className="text-slate-400 text-xs text-right px-1.5 -translate-y-1/2">
                    {timeSlot.quarter === 0 ? timeSlot.format() : null}
                  </div>
                </div>
                {Array.from({ length: 7 }).map((_, dayOfWeekIndex) => {
                  const date = addDays(startOfWeekDate, dayOfWeekIndex);
                  return (
                    <TimeSlotElement
                      key={dayOfWeekIndex}
                      date={formatISO(date, { representation: "date" })}
                      timeSlot={timeSlot.value}
                      isOccupied={workEntries.some(
                        (we) =>
                          isSameDay(we.date, date) &&
                          new TimeOfDay(
                            we.start.getUTCHours(),
                            we.start.getUTCMinutes()
                          ).isBeforeOrEqual(timeSlot.timeOfDay) &&
                          new TimeOfDay(
                            we.end.getUTCHours(),
                            we.end.getUTCMinutes()
                          ).isAfter(timeSlot.timeOfDay)
                      )}
                    />
                  );
                })}
              </Fragment>
            ))}
          </div>
        </div>
      </div>
    </WeekViewInteractionProvider>
  );
}

type DayHeaderProps = { date: Date };

function DayHeader({ date }: DayHeaderProps) {
  return (
    <div className="flex justify-center p-3 items-baseline">
      <div className="text-slate-500">{format(date, "EEE")}</div>
      <div
        className={cn(
          "font-medium flex justify-center items-center rounded-full h-8",
          isToday(date)
            ? "text-white bg-blue-600 w-8 ml-1.5"
            : "text-slate-900 ml-1"
        )}
      >
        {format(date, "d")}
      </div>
    </div>
  );
}

const timeSlots = Array.from({ length: 24 }).flatMap<TimeSlot>((_, hour) =>
  Array.from({ length: 4 }).map((_, quarter) => new TimeSlot(hour, quarter))
);
