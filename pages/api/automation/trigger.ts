import { NextApiRequest, NextApiResponse } from 'next'
import { runAutomation } from '@/scripts/runAutomation'

/**
 * Simple in-memory lock to prevent concurrent automation runs
 * NOTE: For production with multiple instances, use a distributed lock
 * mechanism like Redis or a database-based lock
 */
let isRunning = false
let lastRunTime: number | null = null

/**
 * API endpoint to trigger automated data loading
 * In production, this should be protected with authentication
 * and/or run as a scheduled cron job
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Check if automation is already running
    if (isRunning) {
      return res.status(409).json({ 
        error: 'Automation is already running',
        status: 'in_progress' 
      })
    }

    // Optional: Add authentication check here
    // const session = await getServerSession(req, res, authOptions)
    // if (!session || !isAdmin(session.user)) {
    //   return res.status(403).json({ error: 'Forbidden' })
    // }

    // Set running flag
    isRunning = true

    // Run automation and handle completion
    runAutomation()
      .then(() => {
        console.log('Automation completed successfully')
        lastRunTime = Date.now()
      })
      .catch((error) => {
        console.error('Automation failed:', error)
      })
      .finally(() => {
        isRunning = false
      })

    // Return immediately
    return res.status(202).json({
      message: 'Automation started successfully',
      status: 'processing',
      lastRun: lastRunTime ? new Date(lastRunTime).toISOString() : null,
    })
  } catch (error) {
    isRunning = false
    console.error('Error starting automation:', error)
    return res.status(500).json({ error: 'Failed to start automation' })
  }
}
