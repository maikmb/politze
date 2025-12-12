import { loadNewsFromFeeds } from './loadNews'
import { loadPoliticiansData } from './loadPoliticians'
import { calculateRankings } from './calculateRankings'

/**
 * Master automation script that runs all data loading and processing tasks
 * Can be scheduled as a cron job to run periodically
 */
async function runAutomation() {
  console.log('🤖 Starting automated data processing...\n')

  try {
    // Step 1: Load politicians data from Portal da Transparência
    console.log('=== Step 1: Loading Politicians Data ===')
    await loadPoliticiansData()
    console.log('')

    // Step 2: Load news from feeds
    console.log('=== Step 2: Loading News ===')
    await loadNewsFromFeeds()
    console.log('')

    // Step 3: Calculate rankings
    console.log('=== Step 3: Calculating Rankings ===')
    await calculateRankings()
    console.log('')

    console.log('✅ All automation tasks completed successfully!')
  } catch (error) {
    console.error('❌ Automation failed:', error)
    throw error
  }
}

// Run if executed directly
if (require.main === module) {
  runAutomation()
    .then(() => {
      console.log('✅ Automation script completed successfully')
      process.exit(0)
    })
    .catch((error) => {
      console.error('❌ Automation script failed:', error)
      process.exit(1)
    })
}

export { runAutomation }
