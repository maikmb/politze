import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const { state, city, upcoming = 'true' } = req.query

    const where: any = {
      date: upcoming === 'true' ? { gte: new Date() } : undefined,
    }
    if (state) where.state = state
    if (city) where.city = city

    try {
      const events = await prisma.event.findMany({
        where,
        orderBy: { date: 'asc' },
        take: 20,
      })

      res.status(200).json(events)
    } catch (error) {
      console.error('Error fetching events:', error)
      res.status(500).json({ error: 'Failed to fetch events' })
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}
