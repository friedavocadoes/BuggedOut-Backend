import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { teamId } = req.query;

  if (req.method === 'GET') {
    const team = await prisma.team.findUnique({
      where: { id: Number(teamId) },
    });
    if (team) {
      res.status(200).json(team);
    } else {
      res.status(404).json({ message: 'Team not found' });
    }
  } else if (req.method === 'PUT') {
    const team = await prisma.team.update({
      where: { id: Number(teamId) },
      data: req.body,
    });
    res.status(200).json(team);
  } else if (req.method === 'DELETE') {
    await prisma.team.delete({
      where: { id: Number(teamId) },
    });
    res.status(204).end();
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}