"use client";

import {
  addDays,
  addMinutes,
  format,
  isToday,
  startOfDay,
  startOfWeek,
} from "date-fns";
import { Fragment, useState } from "react";
import { cn } from "./common/classnames";

const beginningOfWeek = startOfWeek(new Date(), {
  weekStartsOn: 1,
});

const timeFormattingDateRefDate = startOfDay(new Date("2023-01-01"));

export function WeekView() {
  // TODO would a reducer be better here?
  const [dragBegin, setDragBegin] = useState<TimeSlot | undefined>(undefined);
  const [dragEnd, setDragEnd] = useState<TimeSlot | undefined>(undefined);
  const [dragDay, setDragDay] = useState<number | undefined>(undefined);

  const period = dragBegin && dragEnd && TimePeriod.from(dragBegin, dragEnd);
  return (
    <div className="divide-slate-200 divide-y text-sm h-screen flex flex-col">
      <div className="grid grid-cols-7 divide-x divide-slate-100">
        <div className="col-end-1 w-14"></div>
        {Array.from({ length: 7 }).map((_, i) => (
          <DayHeader key={i} date={addDays(beginningOfWeek, i)} />
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
              {Array.from({ length: 7 }).map((_, dayOfWeekIndex) => (
                <div
                  key={dayOfWeekIndex}
                  className={cn(
                    "h-5 border-r border-slate-200 cursor-pointer",
                    dayOfWeekIndex === 0 && "border-l",
                    timeSlot.quarter % 2 === 1 && "border-b",
                    (timeSlot.hour < 8 || timeSlot.hour >= 17) && "bg-slate-50",
                    period?.contains(timeSlot) &&
                      dragDay === dayOfWeekIndex &&
                      "bg-sky-100"
                  )}
                  onMouseOver={() => {
                    if (!dragBegin) return;

                    setDragEnd(timeSlot);
                  }}
                  onClick={() => {
                    if (!dragBegin) {
                      setDragBegin(timeSlot);
                      setDragDay(dayOfWeekIndex);
                    } else {
                      setDragBegin(undefined);
                      setDragEnd(undefined);
                    }
                  }}
                ></div>
              ))}
            </Fragment>
          ))}
        </div>
      </div>
    </div>
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

class TimeSlot {
  public constructor(
    public readonly hour: number,
    public readonly quarter: number
  ) {}

  public get minutes() {
    return this.hour * 60 + this.quarter * 15;
  }

  public format() {
    return format(addMinutes(timeFormattingDateRefDate, this.minutes), "HH:mm");
  }

  public toString() {
    return this.format();
  }

  public isBefore(other: TimeSlot) {
    return this.minutes < other.minutes;
  }

  public isBeforeOrEqual(other: TimeSlot) {
    return this.minutes <= other.minutes;
  }

  public isAfterOrEqual(other: TimeSlot) {
    return this.minutes >= other.minutes;
  }

  public isAfter(other: TimeSlot) {
    return this.minutes > other.minutes;
  }

  public equals(other: TimeSlot) {
    return this.minutes === other.minutes;
  }

  public next() {
    return this.quarter === 3
      ? new TimeSlot(this.hour + 1, 0)
      : new TimeSlot(this.hour, this.quarter + 1);
  }
}

const timeSlots = Array.from({ length: 24 }).flatMap<TimeSlot>((_, hour) =>
  Array.from({ length: 4 }).map((_, quarter) => new TimeSlot(hour, quarter))
);

class TimePeriod {
  private constructor(
    public readonly start: TimeSlot,
    public readonly end: TimeSlot
  ) {}

  public static from(boundary1: TimeSlot, boundary2: TimeSlot) {
    return boundary1.isBeforeOrEqual(boundary2)
      ? new TimePeriod(boundary1, boundary2)
      : new TimePeriod(boundary2, boundary1);
  }

  public contains(timeSlot: TimeSlot) {
    return (
      timeSlot.isAfterOrEqual(this.start) && timeSlot.isBeforeOrEqual(this.end)
    );
  }

  public toString() {
    return `${this.start} - ${this.end.next()}`;
  }
}
