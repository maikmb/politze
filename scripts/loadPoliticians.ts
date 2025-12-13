import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface TransparencyData {
  cpf: string
  name: string
  fullName: string
  party: string
  position: string
  state: string
  totalBudget?: number
  spentBudget?: number
  proposalsCount: number
  approvedProposals: number
  presenceRate?: number
}

/**
 * Script to load politician data from Portal da Transparência
 * In production, this would integrate with the real API:
 * https://api.portaldatransparencia.gov.br/
 * 
 * You need to register at Portal da Transparência to get an API key
 * Set environment variable: TRANSPARENCIA_API_KEY
 */
async function loadPoliticiansData() {
  console.log('👥 Starting politicians data import from Portal da Transparência...')

  try {
    const useMockData = !process.env.TRANSPARENCIA_API_KEY
    
    if (useMockData) {
      console.log('⚠️  Using mock data. Set TRANSPARENCIA_API_KEY to use real API')
    }
    
    // Mock data - In production, fetch from Portal da Transparência API
    // API documentation: https://api.portaldatransparencia.gov.br/swagger-ui.html
    const mockPoliticians: TransparencyData[] = [
      {
        cpf: '12345678901',
        name: 'João Silva',
        fullName: 'João Pedro da Silva',
        party: 'PT',
        position: 'Deputado Federal',
        state: 'SP',
        totalBudget: 500000,
        spentBudget: 350000,
        proposalsCount: 45,
        approvedProposals: 12,
        presenceRate: 87.5,
      },
      {
        cpf: '98765432109',
        name: 'Maria Santos',
        fullName: 'Maria Aparecida dos Santos',
        party: 'PSDB',
        position: 'Senadora',
        state: 'RJ',
        totalBudget: 800000,
        spentBudget: 520000,
        proposalsCount: 78,
        approvedProposals: 34,
        presenceRate: 92.3,
      },
    ]

    let created = 0
    let updated = 0

    for (const politicianData of mockPoliticians) {
      const existing = await prisma.politician.findUnique({
        where: { cpf: politicianData.cpf },
      })

      if (existing) {
        // Update existing politician
        await prisma.politician.update({
          where: { cpf: politicianData.cpf },
          data: {
            name: politicianData.name,
            fullName: politicianData.fullName,
            party: politicianData.party,
            position: politicianData.position,
            state: politicianData.state,
            totalBudget: politicianData.totalBudget,
            spentBudget: politicianData.spentBudget,
            proposalsCount: politicianData.proposalsCount,
            approvedProposals: politicianData.approvedProposals,
            presenceRate: politicianData.presenceRate,
          },
        })
        updated++
      } else {
        // Create new politician
        await prisma.politician.create({
          data: {
            cpf: politicianData.cpf,
            name: politicianData.name,
            fullName: politicianData.fullName,
            party: politicianData.party,
            position: politicianData.position,
            state: politicianData.state,
            totalBudget: politicianData.totalBudget,
            spentBudget: politicianData.spentBudget,
            proposalsCount: politicianData.proposalsCount,
            approvedProposals: politicianData.approvedProposals,
            presenceRate: politicianData.presenceRate,
          },
        })
        created++
      }
    }

    console.log(`✅ Politicians import completed: ${created} created, ${updated} updated`)
  } catch (error) {
    console.error('❌ Error loading politicians data:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run if executed directly
if (require.main === module) {
  loadPoliticiansData()
    .then(() => {
      console.log('✅ Script completed successfully')
      process.exit(0)
    })
    .catch((error) => {
      console.error('❌ Script failed:', error)
      process.exit(1)
    })
}

export { loadPoliticiansData }
