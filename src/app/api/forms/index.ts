import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const forms = await prisma.form.findMany();
    res.status(200).json(forms);
  } else if (req.method === 'POST') {
    const form = await prisma.form.create({
      data: req.body,
    });
    res.status(201).json(form);
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}