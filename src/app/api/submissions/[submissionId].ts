import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { submissionId } = req.query;

  if (req.method === 'GET') {
    const submission = await prisma.submission.findUnique({
      where: { id: Number(submissionId) },
    });
    if (submission) {
      res.status(200).json(submission);
    } else {
      res.status(404).json({ message: 'Submission not found' });
    }
  } else if (req.method === 'PUT') {
    const submission = await prisma.submission.update({
      where: { id: Number(submissionId) },
      data: req.body,
    });
    res.status(200).json(submission);
  } else if (req.method === 'DELETE') {
    await prisma.submission.delete({
      where: { id: Number(submissionId) },
    });
    res.status(204).end();
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}