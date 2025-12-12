import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query

  if (req.method === 'GET') {
    try {
      const politician = await prisma.politician.findUnique({
        where: { id: id as string },
        include: {
          ratings: {
            include: {
              user: {
                select: {
                  name: true,
                  image: true,
                },
              },
            },
            orderBy: { createdAt: 'desc' },
            take: 10,
          },
          news: {
            orderBy: { publishedAt: 'desc' },
            take: 5,
          },
        },
      })

      if (!politician) {
        return res.status(404).json({ error: 'Politician not found' })
      }

      res.status(200).json(politician)
    } catch (error) {
      console.error('Error fetching politician:', error)
      res.status(500).json({ error: 'Failed to fetch politician' })
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}
