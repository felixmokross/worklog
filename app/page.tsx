import {
  addDays,
  addHours,
  format,
  isToday,
  previousMonday,
  startOfDay,
  startOfWeek,
} from "date-fns";
import { Fragment, PropsWithChildren } from "react";
import { cn } from "./common/classnames";
import prisma from "./common/prisma";

export default async function Home() {
  const x = await prisma.mandate.findMany();
  return (
    <>
      <WeekView />
      {/* <h1 className="text-3xl font-bold underline">Welcome to Worklog</h1>
      {x.map((mandate) => (
        <p key={mandate.id}>{mandate.name}</p>
      ))} */}
    </>
  );
}

const beginningOfWeek = startOfWeek(new Date(), {
  weekStartsOn: 1,
});

function WeekView() {
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
          {Array.from({ length: 48 }).map((_, timeSlotIndex) => (
            <Fragment key={timeSlotIndex}>
              <div className="col-end-1 h-10 w-14">
                <div className="text-slate-400 text-xs text-right px-1.5 -translate-y-1/2">
                  {timeSlotIndex % 2 == 0
                    ? format(
                        addHours(startOfDay(new Date()), timeSlotIndex / 2),
                        "HH:mm"
                      )
                    : ""}
                </div>
              </div>
              {Array.from({ length: 7 }).map((_, dayofWeekIndex) => (
                <div
                  key={dayofWeekIndex}
                  className={cn(
                    "h-10 border-b border-r border-slate-200",
                    dayofWeekIndex === 0 && "border-l",
                    (timeSlotIndex < 8 * 2 || timeSlotIndex >= 17 * 2) &&
                      "bg-slate-50"
                  )}
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
