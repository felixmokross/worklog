import prisma from "./common/prisma";
import { WeekView } from "./week-view";

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
