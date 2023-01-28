import { PropsWithChildren } from "react";
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

function WeekView() {
  return (
    <div>
      <DayColumn day="Mon" />
      <DayColumn day="Tue" />
      <DayColumn day="Wed" />
      <DayColumn day="Thu" />
      <DayColumn day="Fri" />
      <DayColumn day="Sat" />
      <DayColumn day="Sun" />
    </div>
  );
}

type DayColumnProps = { day: string };

function DayColumn({ day }: DayColumnProps) {
  return <div>{day}</div>;
}
