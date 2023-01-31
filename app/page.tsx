import prisma from "./common/prisma";
import { WeekView } from "./week-view";
import Link from "next/link";
import { CalendarWeek } from "./common/model";
import { parseISO } from "date-fns";
import { redirect } from "next/navigation";

export default async function Home({
  searchParams,
}: {
  searchParams: { weekOf?: string };
}) {
  const workEntries = await prisma.workEntry.findMany();

  const parsedDate = !!searchParams.weekOf && parseISO(searchParams.weekOf);
  if (parsedDate && parsedDate.getDay() !== 1) {
    // TODO this doesn't work currently, at least for full page requests --> it redirects, but page is blank then
    redirect(`?weekOf=${CalendarWeek.fromDate(parsedDate)}`);
  }

  const calendarWeek = parsedDate
    ? CalendarWeek.fromDate(parsedDate)
    : CalendarWeek.current;

  return (
    <div className="h-screen flex flex-col">
      <div className="py-4 flex justify-center">
        <Link href={`?weekOf=${calendarWeek.previous()}`}>&larr;</Link>
        {calendarWeek.year}, Week {calendarWeek.week}{" "}
        <Link href={`?weekOf=${calendarWeek.next()}`}>&rarr;</Link>
      </div>
      <WeekView calendarWeek={calendarWeek} workEntries={workEntries} />
    </div>
  );
}
