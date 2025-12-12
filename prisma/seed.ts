import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create sample politicians
  const politicians = [
    {
      name: 'João Silva',
      fullName: 'João Pedro da Silva',
      party: 'PSDB',
      position: 'Deputado Federal',
      state: 'SP',
      city: 'São Paulo',
      region: 'Sudeste',
      photo: null,
      cpf: '123.456.789-00',
      biography:
        'Deputado Federal com foco em educação e saúde pública. Trabalha há 10 anos na política.',
      totalBudget: 1000000,
      spentBudget: 750000,
      proposalsCount: 45,
      approvedProposals: 12,
      presenceRate: 87.5,
      score: 8.5,
      rankPosition: 1,
    },
    {
      name: 'Maria Santos',
      fullName: 'Maria Aparecida dos Santos',
      party: 'PT',
      position: 'Senadora',
      state: 'RJ',
      city: 'Rio de Janeiro',
      region: 'Sudeste',
      photo: null,
      cpf: '987.654.321-00',
      biography:
        'Senadora com foco em direitos humanos e meio ambiente. Ex-prefeita de sua cidade.',
      totalBudget: 1500000,
      spentBudget: 1200000,
      proposalsCount: 38,
      approvedProposals: 15,
      presenceRate: 92.0,
      score: 9.2,
      rankPosition: 2,
    },
    {
      name: 'Carlos Oliveira',
      fullName: 'Carlos Eduardo de Oliveira',
      party: 'MDB',
      position: 'Deputado Estadual',
      state: 'MG',
      city: 'Belo Horizonte',
      region: 'Sudeste',
      photo: null,
      biography:
        'Deputado Estadual focado em infraestrutura e desenvolvimento econômico regional.',
      totalBudget: 500000,
      spentBudget: 300000,
      proposalsCount: 28,
      approvedProposals: 8,
      presenceRate: 78.5,
      score: 7.8,
      rankPosition: 3,
    },
    {
      name: 'Ana Costa',
      fullName: 'Ana Paula Costa',
      party: 'PDT',
      position: 'Deputada Federal',
      state: 'RS',
      city: 'Porto Alegre',
      region: 'Sul',
      photo: null,
      biography:
        'Deputada Federal com foco em tecnologia e inovação. Engenheira de formação.',
      totalBudget: 800000,
      spentBudget: 600000,
      proposalsCount: 52,
      approvedProposals: 18,
      presenceRate: 95.0,
      score: 9.5,
      rankPosition: 4,
    },
    {
      name: 'Pedro Almeida',
      fullName: 'Pedro Henrique Almeida',
      party: 'PSOL',
      position: 'Vereador',
      state: 'BA',
      city: 'Salvador',
      region: 'Nordeste',
      photo: null,
      biography:
        'Vereador jovem focado em juventude, cultura e mobilidade urbana.',
      totalBudget: 200000,
      spentBudget: 150000,
      proposalsCount: 35,
      approvedProposals: 10,
      presenceRate: 88.0,
      score: 8.8,
      rankPosition: 5,
    },
  ]

  for (const politician of politicians) {
    await prisma.politician.create({
      data: politician,
    })
  }

  console.log('✅ Politicians created')

  // Create sample news
  const news = [
    {
      title: 'Nova proposta de reforma educacional é apresentada',
      description:
        'Deputado propõe mudanças significativas no sistema educacional brasileiro',
      content:
        'Uma nova proposta de reforma educacional foi apresentada hoje na Câmara dos Deputados...',
      source: 'Portal de Notícias',
      sourceUrl: 'https://example.com/noticia1',
      publishedAt: new Date('2024-01-15'),
      tags: ['educação', 'reforma', 'política'],
    },
    {
      title: 'Senado aprova projeto de lei ambiental',
      description:
        'Nova legislação visa proteger biomas brasileiros e reduzir desmatamento',
      content:
        'O Senado Federal aprovou hoje um importante projeto de lei ambiental...',
      source: 'Jornal Nacional',
      sourceUrl: 'https://example.com/noticia2',
      publishedAt: new Date('2024-01-14'),
      tags: ['meio ambiente', 'sustentabilidade', 'legislação'],
    },
    {
      title: 'Transparência: Novos dados de gastos públicos são divulgados',
      description:
        'Portal da transparência atualiza informações sobre uso de recursos públicos',
      content:
        'O Portal da Transparência divulgou hoje novos dados sobre gastos públicos...',
      source: 'Gazeta do Povo',
      sourceUrl: 'https://example.com/noticia3',
      publishedAt: new Date('2024-01-13'),
      tags: ['transparência', 'orçamento', 'prestação de contas'],
    },
  ]

  for (const newsItem of news) {
    await prisma.news.create({
      data: newsItem,
    })
  }

  console.log('✅ News created')

  // Create sample events
  const events = [
    {
      title: 'Audiência Pública sobre Educação',
      description:
        'Discussão sobre o futuro da educação pública no Brasil com participação popular',
      type: 'audiência pública',
      location: 'Câmara dos Deputados',
      city: 'Brasília',
      state: 'DF',
      date: new Date('2024-02-20T14:00:00'),
      organizer: 'Comissão de Educação',
      tags: ['educação', 'participação popular'],
    },
    {
      title: 'Protesto pela Transparência',
      description:
        'Manifestação pacífica por mais transparência nos gastos públicos',
      type: 'protesto',
      location: 'Praça dos Três Poderes',
      city: 'Brasília',
      state: 'DF',
      date: new Date('2024-02-25T10:00:00'),
      organizer: 'Sociedade Civil Organizada',
      tags: ['transparência', 'democracia'],
    },
    {
      title: 'Debate sobre Meio Ambiente',
      description:
        'Debate público sobre políticas ambientais e mudanças climáticas',
      type: 'debate',
      location: 'Auditório da Universidade',
      city: 'São Paulo',
      state: 'SP',
      date: new Date('2024-03-01T19:00:00'),
      organizer: 'Universidade de São Paulo',
      tags: ['meio ambiente', 'sustentabilidade'],
    },
  ]

  for (const event of events) {
    await prisma.event.create({
      data: event,
    })
  }

  console.log('✅ Events created')
  console.log('🎉 Database seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
