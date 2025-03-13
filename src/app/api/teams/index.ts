import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const teams = await prisma.team.findMany();
    res.status(200).json(teams);
  } else if (req.method === 'POST') {
    const team = await prisma.team.create({
      data: req.body,
    });
    res.status(201).json(team);
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}