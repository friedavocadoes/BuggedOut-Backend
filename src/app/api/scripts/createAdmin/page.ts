import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { username, password } = req.body;



    try {
      const admin = await prisma.user.create({
        data: {
          username,
          password: password,
          role: 'judge', // Change role to 'admin'
        },
      });
      res.status(201).json({ message: 'Admin user created', admin });
    } catch (error) {
      res.status(500).json({ message: 'Error creating admin user', error });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}