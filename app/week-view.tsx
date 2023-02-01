import { WorkEntry } from "@prisma/client";
import { addDays, format, formatISO, isSameDay, isToday } from "date-fns";
import { cn } from "./common/classnames";
import { timeSlotHeight, timeSlotsPerHour } from "./common/constants";
import { CalendarWeek, TimeSlot } from "./common/model";
import { TimeSlotElement } from "./time-slot-element";
import { WeekViewInteractionProvider } from "./week-view-interaction";
import { DeleteButton } from "./delete-button";

type WeekViewProps = { calendarWeek: CalendarWeek; workEntries: WorkEntry[] };

export function WeekView({ calendarWeek, workEntries }: WeekViewProps) {
  const startOfWeekDate = calendarWeek.startDate;
  const workEntriesByDay = workEntries.reduce<Record<number, WorkEntry[]>>(
    (acc, curr) => {
      if (!acc[curr.date.valueOf()]) {
        acc[curr.date.valueOf()] = [];
      }

      acc[curr.date.valueOf()].push(curr);
      return acc;
    },
    {}
  );
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
            <div className="col-end-1 w-14">
              <div className="h-4"></div>
              {timeSlots.map((timeSlot) => (
                <div
                  key={timeSlot.toString()}
                  style={{ height: timeSlotHeight }}
                >
                  <div className="text-slate-400 text-xs text-right px-1.5 -translate-y-1/2">
                    {timeSlot.quarter === 0 ? timeSlot.format() : null}
                  </div>
                </div>
              ))}
            </div>
            {Array.from({ length: 7 }).map((_, dayOfWeekIndex) => {
              const date = addDays(startOfWeekDate, dayOfWeekIndex);
              const workEntriesOfDay = workEntriesByDay[date.valueOf()] || [];
              return (
                <div key={dayOfWeekIndex}>
                  <div
                    style={{ height: timeSlotHeight }}
                    className={cn(
                      "border-b border-r border-slate-200 bg-slate-50",
                      dayOfWeekIndex === 0 && "border-l"
                    )}
                  ></div>
                  <div className="relative">
                    {timeSlots.map((timeSlot) => (
                      <TimeSlotElement
                        key={timeSlot.format()}
                        date={formatISO(date, { representation: "date" })}
                        timeSlot={timeSlot.value}
                      />
                    ))}
                    {workEntriesOfDay.map((we) => (
                      <div
                        key={we.id}
                        style={{
                          top: positionForTime(we.start),
                          height:
                            positionForTime(we.end) - positionForTime(we.start),
                        }}
                        className="absolute w-full pl-px py-px pr-1.5 group"
                      >
                        <div className="bg-blue-200 h-full rounded-md p-2 flex flex-col">
                          <DeleteButton workEntryId={we.id} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </WeekViewInteractionProvider>
  );
}

function positionForTime(time: Date) {
  return (
    timeSlotHeight * timeSlotsPerHour * time.getUTCHours() +
    timeSlotHeight * (time.getUTCMinutes() / (60 / timeSlotsPerHour))
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
