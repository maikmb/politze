import { PrismaClient } from '@prisma/client'
import { RANKING_WEIGHTS } from '../lib/config'

const prisma = new PrismaClient()

/**
 * Calculate ranking score for each politician based on multiple criteria:
 * - Presence rate (30%)
 * - Proposals approved rate (40%)
 * - Budget efficiency (30%)
 */
async function calculateRankings() {
  console.log('📊 Starting ranking calculation...')

  try {
    // Get all politicians
    const politicians = await prisma.politician.findMany()

    if (politicians.length === 0) {
      console.log('⚠️  No politicians found in database')
      return
    }

    // Calculate score for each politician
    const politiciansWithScores = politicians.map((politician) => {
      let score = 0

      // Presence rate score
      if (politician.presenceRate) {
        score += (politician.presenceRate / 100) * (RANKING_WEIGHTS.PRESENCE_RATE * 100)
      }

      // Proposals approval rate score
      if (politician.proposalsCount > 0) {
        const approvalRate = politician.approvedProposals / politician.proposalsCount
        score += approvalRate * (RANKING_WEIGHTS.APPROVAL_RATE * 100)
      }

      // Budget efficiency score (lower spending percentage is better)
      if (politician.totalBudget && politician.spentBudget) {
        const spendingRate = politician.spentBudget / politician.totalBudget
        score += (1 - spendingRate) * (RANKING_WEIGHTS.BUDGET_EFFICIENCY * 100)
      }

      return {
        id: politician.id,
        name: politician.name,
        score: Math.round(score * 10) / 10, // Round to 1 decimal
      }
    })

    // Sort by score descending
    politiciansWithScores.sort((a, b) => b.score - a.score)

    // Update each politician with their score and rank position
    let updateCount = 0
    for (let i = 0; i < politiciansWithScores.length; i++) {
      const politician = politiciansWithScores[i]
      await prisma.politician.update({
        where: { id: politician.id },
        data: {
          score: politician.score,
          rankPosition: i + 1,
        },
      })
      updateCount++
    }

    console.log(`✅ Ranking calculation completed: ${updateCount} politicians updated`)
    
    // Display top 10
    console.log('\n🏆 Top 10 Politicians:')
    politiciansWithScores.slice(0, 10).forEach((p, index) => {
      console.log(`${index + 1}. ${p.name} - Score: ${p.score}`)
    })
  } catch (error) {
    console.error('❌ Error calculating rankings:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run if executed directly
if (require.main === module) {
  calculateRankings()
    .then(() => {
      console.log('✅ Script completed successfully')
      process.exit(0)
    })
    .catch((error) => {
      console.error('❌ Script failed:', error)
      process.exit(1)
    })
}

export { calculateRankings }
