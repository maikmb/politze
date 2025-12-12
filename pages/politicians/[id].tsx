import { GetServerSideProps } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import Comments from '@/components/Comments'

interface PoliticianDetailProps {
  politician: any
}

export default function PoliticianDetail({ politician }: PoliticianDetailProps) {
  if (!politician) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Político não encontrado</h1>
        <Link href="/politicians" className="text-primary-600 hover:underline mt-4 block">
          Voltar para a lista
        </Link>
      </div>
    )
  }

  const avgRating =
    politician.ratings.length > 0
      ? politician.ratings.reduce((acc: number, r: any) => acc + r.score, 0) /
        politician.ratings.length
      : 0

  return (
    <>
      <Head>
        <title>{politician.name} - Politze</title>
        <meta name="description" content={`Perfil de ${politician.name}`} />
      </Head>

      <div className="bg-gray-50 min-h-screen">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white">
          <div className="container mx-auto px-4 py-12">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="relative">
                {politician.photo ? (
                  <img
                    src={politician.photo}
                    alt={politician.name}
                    className="w-48 h-48 rounded-full object-cover border-4 border-white shadow-xl"
                  />
                ) : (
                  <div className="w-48 h-48 rounded-full bg-white text-primary-600 flex items-center justify-center text-7xl font-bold border-4 border-white shadow-xl">
                    {politician.name.charAt(0)}
                  </div>
                )}
                <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-gray-900 px-4 py-2 rounded-full font-bold shadow-lg">
                  ⭐ {politician.score.toFixed(1)}
                </div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-4xl font-bold mb-2">{politician.name}</h1>
                <p className="text-xl text-gray-100 mb-4">
                  {politician.party} - {politician.position}
                </p>
                <p className="text-lg">
                  {politician.city ? `${politician.city}, ` : ''}{politician.state}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Transparency Stats */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Dados de Transparência
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-3xl font-bold text-blue-600 mb-1">
                      {politician.proposalsCount}
                    </div>
                    <div className="text-sm text-gray-600">Propostas</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-3xl font-bold text-green-600 mb-1">
                      {politician.approvedProposals}
                    </div>
                    <div className="text-sm text-gray-600">Aprovadas</div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="text-3xl font-bold text-purple-600 mb-1">
                      {politician.presenceRate?.toFixed(0) || 0}%
                    </div>
                    <div className="text-sm text-gray-600">Presença</div>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <div className="text-3xl font-bold text-yellow-600 mb-1">
                      #{politician.rankPosition || 'N/A'}
                    </div>
                    <div className="text-sm text-gray-600">Ranking</div>
                  </div>
                </div>
              </div>

              {/* Budget Information */}
              {politician.totalBudget && (
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Orçamento
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Orçamento Total</span>
                        <span className="font-bold">
                          R$ {politician.totalBudget.toLocaleString('pt-BR')}
                        </span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Gasto</span>
                        <span className="font-bold">
                          R$ {politician.spentBudget?.toLocaleString('pt-BR') || 0}
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4">
                      <div
                        className="bg-primary-600 h-4 rounded-full transition-all"
                        style={{
                          width: `${((politician.spentBudget || 0) / politician.totalBudget) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Biography */}
              {politician.biography && (
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Biografia
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    {politician.biography}
                  </p>
                </div>
              )}

              {/* Related News */}
              {politician.news.length > 0 && (
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Notícias Relacionadas
                  </h2>
                  <div className="space-y-4">
                    {politician.news.map((newsItem: any) => (
                      <div
                        key={newsItem.id}
                        className="border-l-4 border-primary-600 pl-4 py-2"
                      >
                        <div className="text-xs text-gray-500 mb-1">
                          {new Date(newsItem.publishedAt).toLocaleDateString('pt-BR')}
                        </div>
                        <h3 className="font-bold text-gray-900 mb-1">
                          {newsItem.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {newsItem.description}
                        </p>
                        {newsItem.sourceUrl && (
                          <a
                            href={newsItem.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary-600 hover:underline"
                          >
                            Ler mais →
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Comments Section */}
              <Comments politicianId={politician.id} />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Info */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Informações de Contato
                </h3>
                <div className="space-y-3">
                  {politician.email && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-gray-600">📧</span>
                      <a
                        href={`mailto:${politician.email}`}
                        className="text-primary-600 hover:underline"
                      >
                        {politician.email}
                      </a>
                    </div>
                  )}
                  {politician.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-gray-600">📞</span>
                      <span>{politician.phone}</span>
                    </div>
                  )}
                  {politician.website && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-gray-600">🌐</span>
                      <a
                        href={politician.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:underline"
                      >
                        Website
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* User Ratings */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Avaliações dos Usuários
                </h3>
                <div className="text-center mb-4">
                  <div className="text-4xl font-bold text-yellow-500">
                    ⭐ {avgRating.toFixed(1)}
                  </div>
                  <p className="text-sm text-gray-600">
                    {politician.ratings.length} avaliações
                  </p>
                </div>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {politician.ratings.slice(0, 5).map((rating: any) => (
                    <div
                      key={rating.id}
                      className="border-t pt-3"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        {rating.user.image && (
                          <img
                            src={rating.user.image}
                            alt={rating.user.name}
                            className="w-6 h-6 rounded-full"
                          />
                        )}
                        <span className="font-medium text-sm">
                          {rating.user.name}
                        </span>
                        <span className="text-yellow-500 text-sm">
                          {'⭐'.repeat(rating.score)}
                        </span>
                      </div>
                      {rating.comment && (
                        <p className="text-sm text-gray-600">{rating.comment}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params as { id: string }

  try {
    const politician = await prisma.politician.findUnique({
      where: { id },
      include: {
        ratings: {
          include: {
            user: {
              select: {
                name: true,
                image: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        news: {
          orderBy: { publishedAt: 'desc' },
          take: 5,
        },
      },
    })

    if (!politician) {
      return { notFound: true }
    }

    return {
      props: {
        politician: JSON.parse(JSON.stringify(politician)),
      },
    }
  } catch (error) {
    console.error('Error fetching politician:', error)
    return { notFound: true }
  }
}
