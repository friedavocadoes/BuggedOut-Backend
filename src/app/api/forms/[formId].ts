import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { formId } = req.query;

  if (req.method === 'GET') {
    const form = await prisma.form.findUnique({
      where: { id: Number(formId) },
    });
    if (form) {
      res.status(200).json(form);
    } else {
      res.status(404).json({ message: 'Form not found' });
    }
  } else if (req.method === 'PUT') {
    const form = await prisma.form.update({
      where: { id: Number(formId) },
      data: req.body,
    });
    res.status(200).json(form);
  } else if (req.method === 'DELETE') {
    await prisma.form.delete({
      where: { id: Number(formId) },
    });
    res.status(204).end();
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}