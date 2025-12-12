import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const { limit = 10, page = 1 } = req.query
    const skip = (Number(page) - 1) * Number(limit)

    try {
      const [news, total] = await Promise.all([
        prisma.news.findMany({
          orderBy: { publishedAt: 'desc' },
          take: Number(limit),
          skip,
          include: {
            politician: {
              select: {
                name: true,
                party: true,
                state: true,
              },
            },
          },
        }),
        prisma.news.count(),
      ])

      res.status(200).json({
        news,
        pagination: {
          total,
          page: Number(page),
          limit: Number(limit),
          pages: Math.ceil(total / Number(limit)),
        },
      })
    } catch (error) {
      console.error('Error fetching news:', error)
      res.status(500).json({ error: 'Failed to fetch news' })
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}
