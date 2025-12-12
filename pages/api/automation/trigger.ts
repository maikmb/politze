import { NextApiRequest, NextApiResponse } from 'next'
import { runAutomation } from '@/scripts/runAutomation'

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
    // Optional: Add authentication check here
    // const session = await getServerSession(req, res, authOptions)
    // if (!session || !isAdmin(session.user)) {
    //   return res.status(403).json({ error: 'Forbidden' })
    // }

    // Run automation in background
    runAutomation()
      .then(() => {
        console.log('Automation completed successfully')
      })
      .catch((error) => {
        console.error('Automation failed:', error)
      })

    // Return immediately
    return res.status(202).json({
      message: 'Automation started successfully',
      status: 'processing',
    })
  } catch (error) {
    console.error('Error starting automation:', error)
    return res.status(500).json({ error: 'Failed to start automation' })
  }
}
