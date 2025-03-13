import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const submissions = await prisma.submission.findMany();
    res.status(200).json(submissions);
  } else if (req.method === 'POST') {
    const submission = await prisma.submission.create({
      data: req.body,
    });
    res.status(201).json(submission);
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}