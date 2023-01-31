import { TimeOfDay, WorkEntryDto } from "@/app/common/model";
import prisma from "@/app/common/prisma";
import { addMinutes } from "date-fns";
import { zonedTimeToUtc } from "date-fns-tz";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const dto = JSON.parse(req.body) as WorkEntryDto;

  const parsedDate = zonedTimeToUtc(dto.date, "UTC");

  await prisma.workEntry.create({
    data: {
      date: parsedDate,
      start: addMinutes(parsedDate, TimeOfDay.fromValue(dto.startTime).minutes),
      end: addMinutes(parsedDate, TimeOfDay.fromValue(dto.endTime).minutes),
    },
  });

  res.status(200).end();
}
