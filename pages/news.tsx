import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { prisma } from '@/lib/prisma'

interface NewsProps {
  news: any[]
}

export default function News({ news }: NewsProps) {
  return (
    <>
      <Head>
        <title>Notícias - Politze</title>
        <meta name="description" content="Últimas notícias sobre política" />
      </Head>

      <div className="bg-gray-50 min-h-screen">
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold mb-4">Notícias</h1>
            <p className="text-xl text-gray-100">
              Fique por dentro das últimas notícias políticas
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="space-y-6">
            {news.map((newsItem) => (
              <div
                key={newsItem.id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition overflow-hidden"
              >
                <div className="md:flex">
                  {newsItem.imageUrl && (
                    <div className="md:w-1/3">
                      <img
                        src={newsItem.imageUrl}
                        alt={newsItem.title}
                        className="w-full h-64 md:h-full object-cover"
                      />
                    </div>
                  )}
                  <div className={`p-6 ${newsItem.imageUrl ? 'md:w-2/3' : 'w-full'}`}>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-xs text-gray-500">
                        {new Date(newsItem.publishedAt).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </span>
                      {newsItem.tags.length > 0 && (
                        <div className="flex gap-2">
                          {newsItem.tags.slice(0, 3).map((tag: string) => (
                            <span
                              key={tag}
                              className="bg-primary-100 text-primary-700 text-xs px-2 py-1 rounded"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">
                      {newsItem.title}
                    </h2>
                    {newsItem.description && (
                      <p className="text-gray-600 mb-4">{newsItem.description}</p>
                    )}
                    {newsItem.politician && (
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-sm text-gray-500">Relacionado a:</span>
                        <span className="text-sm font-medium text-primary-600">
                          {newsItem.politician.name} ({newsItem.politician.party})
                        </span>
                      </div>
                    )}
                    {newsItem.sourceUrl && (
                      <a
                        href={newsItem.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition"
                      >
                        Ler notícia completa →
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {news.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">
                Nenhuma notícia disponível no momento.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const news = await prisma.news.findMany({
      orderBy: { publishedAt: 'desc' },
      include: {
        politician: {
          select: {
            name: true,
            party: true,
          },
        },
      },
    })

    return {
      props: {
        news: JSON.parse(JSON.stringify(news)),
      },
    }
  } catch (error) {
    console.error('Error fetching news:', error)
    return {
      props: {
        news: [],
      },
    }
  }
}
