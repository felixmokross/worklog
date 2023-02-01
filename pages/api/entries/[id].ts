import prisma from "@/app/common/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "DELETE") return res.status(405).end();

  const workEntryId = req.query.id as string;

  await prisma.workEntry.delete({ where: { id: workEntryId } });

  res.status(201).end();
}
