import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const { state, city, region, limit = 20, page = 1 } = req.query

    const skip = (Number(page) - 1) * Number(limit)

    const where: any = {}
    if (state) where.state = state
    if (city) where.city = city
    if (region) where.region = region

    try {
      const [politicians, total] = await Promise.all([
        prisma.politician.findMany({
          where,
          orderBy: { score: 'desc' },
          take: Number(limit),
          skip,
          include: {
            ratings: {
              select: {
                score: true,
              },
            },
          },
        }),
        prisma.politician.count({ where }),
      ])

      res.status(200).json({
        politicians,
        pagination: {
          total,
          page: Number(page),
          limit: Number(limit),
          pages: Math.ceil(total / Number(limit)),
        },
      })
    } catch (error) {
      console.error('Error fetching politicians:', error)
      res.status(500).json({ error: 'Failed to fetch politicians' })
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}
