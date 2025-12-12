import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]'
import { prisma } from '@/lib/prisma'
import { COMMENT_CONFIG } from '@/lib/config'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { politicianId } = req.query

  if (!politicianId || typeof politicianId !== 'string') {
    return res.status(400).json({ error: 'Politician ID is required' })
  }

  if (req.method === 'GET') {
    try {
      const comments = await prisma.comment.findMany({
        where: {
          politicianId,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      })

      return res.status(200).json(comments)
    } catch (error) {
      console.error('Error fetching comments:', error)
      return res.status(500).json({ error: 'Failed to fetch comments' })
    }
  }

  if (req.method === 'POST') {
    try {
      const session = await getServerSession(req, res, authOptions)

      if (!session?.user?.email) {
        return res.status(401).json({ error: 'You must be logged in to comment' })
      }

      const { content } = req.body

      if (!content || typeof content !== 'string') {
        return res.status(400).json({ error: 'Comment content is required' })
      }

      const trimmedContent = content.trim()

      if (trimmedContent.length === 0) {
        return res.status(400).json({ error: 'Comment content is required' })
      }

      if (trimmedContent.length > COMMENT_CONFIG.MAX_LENGTH) {
        return res.status(400).json({ 
          error: `Comment is too long (max ${COMMENT_CONFIG.MAX_LENGTH} characters)` 
        })
      }

      // Find user by email
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
      })

      if (!user) {
        return res.status(404).json({ error: 'User not found' })
      }

      // Create comment
      const comment = await prisma.comment.create({
        data: {
          content: trimmedContent,
          userId: user.id,
          politicianId,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      })

      return res.status(201).json(comment)
    } catch (error) {
      console.error('Error creating comment:', error)
      return res.status(500).json({ error: 'Failed to create comment' })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
