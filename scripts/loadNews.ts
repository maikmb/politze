import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface NewsItem {
  title: string
  description?: string
  content: string
  source?: string
  sourceUrl?: string
  imageUrl?: string
  publishedAt: Date
  politicianName?: string
  tags: string[]
}

/**
 * Script to fetch and load news from RSS feeds and news APIs
 * This can be run as a cron job to keep news updated
 */
async function loadNewsFromFeeds() {
  console.log('🗞️  Starting news feed import...')

  try {
    // Mock news data - In production, integrate with real RSS feeds or news APIs
    // Examples: Google News RSS, NewsAPI, or Brazilian news sources like G1, Folha, etc.
    const mockNews: NewsItem[] = [
      {
        title: 'Deputado propõe nova lei de transparência',
        description: 'Proposta visa aumentar fiscalização de gastos públicos',
        content: 'Um novo projeto de lei foi apresentado hoje na Câmara dos Deputados com o objetivo de aumentar a transparência nos gastos públicos...',
        source: 'G1',
        sourceUrl: 'https://g1.globo.com',
        publishedAt: new Date(),
        tags: ['transparência', 'política', 'legislação'],
      },
      {
        title: 'Senado aprova projeto de reforma administrativa',
        description: 'Votação foi aprovada com ampla maioria',
        content: 'O Senado Federal aprovou hoje a reforma administrativa que visa modernizar a gestão pública...',
        source: 'Folha de S.Paulo',
        sourceUrl: 'https://folha.uol.com.br',
        publishedAt: new Date(Date.now() - 86400000), // 1 day ago
        tags: ['senado', 'reforma', 'política'],
      },
    ]

    let created = 0
    let skipped = 0

    for (const newsData of mockNews) {
      // Check if news already exists
      const exists = await prisma.news.findFirst({
        where: {
          title: newsData.title,
          source: newsData.source,
        },
      })

      if (exists) {
        skipped++
        continue
      }

      // Try to find related politician
      let politicianId = null
      if (newsData.politicianName) {
        const politician = await prisma.politician.findFirst({
          where: {
            OR: [
              { name: { contains: newsData.politicianName, mode: 'insensitive' } },
              { fullName: { contains: newsData.politicianName, mode: 'insensitive' } },
            ],
          },
        })
        if (politician) {
          politicianId = politician.id
        }
      }

      await prisma.news.create({
        data: {
          title: newsData.title,
          description: newsData.description,
          content: newsData.content,
          source: newsData.source,
          sourceUrl: newsData.sourceUrl,
          imageUrl: newsData.imageUrl,
          publishedAt: newsData.publishedAt,
          politicianId,
          tags: newsData.tags,
        },
      })

      created++
    }

    console.log(`✅ News import completed: ${created} created, ${skipped} skipped`)
  } catch (error) {
    console.error('❌ Error loading news:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run if executed directly
if (require.main === module) {
  loadNewsFromFeeds()
    .then(() => {
      console.log('✅ Script completed successfully')
      process.exit(0)
    })
    .catch((error) => {
      console.error('❌ Script failed:', error)
      process.exit(1)
    })
}

export { loadNewsFromFeeds }
