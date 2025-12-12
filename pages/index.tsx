import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'
import Head from 'next/head'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'

interface HomeProps {
  topPoliticians: any[]
  recentNews: any[]
  upcomingEvents: any[]
  userRegion?: string
}

export default function Home({
  topPoliticians,
  recentNews,
  upcomingEvents,
  userRegion,
}: HomeProps) {
  return (
    <>
      <Head>
        <title>Politze - Conscientização Política</title>
        <meta
          name="description"
          content="Conheça os políticos do seu país e acompanhe a transparência política"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
              Conheça Seus
              <span className="block text-yellow-300">Representantes</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-100">
              Transparência política para tomar decisões informadas sobre o futuro do Brasil
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/politicians"
                className="bg-yellow-400 text-gray-900 px-8 py-4 rounded-lg font-bold text-lg hover:bg-yellow-300 transition transform hover:scale-105 shadow-lg"
              >
                Explorar Políticos
              </Link>
              <Link
                href="/events"
                className="bg-white text-primary-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition transform hover:scale-105 shadow-lg"
              >
                Ver Agenda
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Top Politicians Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              {userRegion ? `Políticos da sua região` : 'Políticos em Destaque'}
            </h2>
            <Link
              href="/politicians"
              className="text-primary-600 hover:text-primary-700 font-semibold"
            >
              Ver todos →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {topPoliticians.map((politician) => (
              <Link
                key={politician.id}
                href={`/politicians/${politician.id}`}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition transform hover:-translate-y-1 overflow-hidden"
              >
                <div className="relative h-48 bg-gradient-to-br from-primary-400 to-primary-600">
                  {politician.photo ? (
                    <img
                      src={politician.photo}
                      alt={politician.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white text-6xl font-bold">
                      {politician.name.charAt(0)}
                    </div>
                  )}
                  <div className="absolute top-2 right-2 bg-yellow-400 text-gray-900 px-3 py-1 rounded-full font-bold text-sm">
                    ⭐ {politician.score.toFixed(1)}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg text-gray-900 mb-1">
                    {politician.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-2">
                    {politician.party} - {politician.position}
                  </p>
                  <p className="text-gray-500 text-xs">
                    {politician.city ? `${politician.city}, ` : ''}{politician.state}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
              <div className="text-4xl font-bold text-primary-600 mb-2">
                {topPoliticians.length}+
              </div>
              <div className="text-gray-600">Políticos Cadastrados</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
              <div className="text-4xl font-bold text-green-600 mb-2">
                {recentNews.length}+
              </div>
              <div className="text-gray-600">Notícias</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
              <div className="text-4xl font-bold text-purple-600 mb-2">
                {upcomingEvents.length}+
              </div>
              <div className="text-gray-600">Eventos Agendados</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl">
              <div className="text-4xl font-bold text-yellow-600 mb-2">100%</div>
              <div className="text-gray-600">Transparente</div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent News Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Últimas Notícias</h2>
            <Link
              href="/news"
              className="text-primary-600 hover:text-primary-700 font-semibold"
            >
              Ver todas →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentNews.map((news) => (
              <div
                key={news.id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition overflow-hidden"
              >
                {news.imageUrl && (
                  <img
                    src={news.imageUrl}
                    alt={news.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6">
                  <div className="text-xs text-gray-500 mb-2">
                    {new Date(news.publishedAt).toLocaleDateString('pt-BR')}
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2">
                    {news.title}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-3">
                    {news.description}
                  </p>
                  {news.politician && (
                    <div className="mt-4 text-xs text-primary-600">
                      Sobre: {news.politician.name}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Próximos Eventos</h2>
            <Link
              href="/events"
              className="text-primary-600 hover:text-primary-700 font-semibold"
            >
              Ver todos →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.map((event) => (
              <div
                key={event.id}
                className="bg-gradient-to-br from-primary-50 to-white border border-primary-100 rounded-xl p-6 hover:shadow-lg transition"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="bg-primary-600 text-white px-3 py-1 rounded-lg text-xs font-bold uppercase">
                    {event.type}
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary-600">
                      {new Date(event.date).getDate()}
                    </div>
                    <div className="text-xs text-gray-600">
                      {new Date(event.date).toLocaleDateString('pt-BR', {
                        month: 'short',
                      })}
                    </div>
                  </div>
                </div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">
                  {event.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {event.description}
                </p>
                {event.location && (
                  <div className="text-xs text-gray-500">
                    📍 {event.location}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Faça Parte da Mudança
          </h2>
          <p className="text-xl mb-8 text-gray-100 max-w-2xl mx-auto">
            Junte-se a milhares de brasileiros conscientes e acompanhe a transparência política
          </p>
          <Link
            href="/politicians"
            className="inline-block bg-yellow-400 text-gray-900 px-8 py-4 rounded-lg font-bold text-lg hover:bg-yellow-300 transition transform hover:scale-105 shadow-lg"
          >
            Começar Agora
          </Link>
        </div>
      </section>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context)

  try {
    // Get user region if logged in
    let userRegion = null
    let whereClause: any = {}

    if (session?.user?.id) {
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { region: true, state: true },
      })
      userRegion = user?.state
      if (userRegion) {
        whereClause.state = userRegion
      }
    }

    // Get top politicians
    const topPoliticians = await prisma.politician.findMany({
      where: whereClause,
      orderBy: { score: 'desc' },
      take: 8,
      select: {
        id: true,
        name: true,
        party: true,
        position: true,
        state: true,
        city: true,
        photo: true,
        score: true,
      },
    })

    // Get recent news
    const recentNews = await prisma.news.findMany({
      orderBy: { publishedAt: 'desc' },
      take: 3,
      include: {
        politician: {
          select: {
            name: true,
          },
        },
      },
    })

    // Get upcoming events
    const upcomingEvents = await prisma.event.findMany({
      where: {
        date: { gte: new Date() },
      },
      orderBy: { date: 'asc' },
      take: 3,
    })

    return {
      props: {
        topPoliticians: JSON.parse(JSON.stringify(topPoliticians)),
        recentNews: JSON.parse(JSON.stringify(recentNews)),
        upcomingEvents: JSON.parse(JSON.stringify(upcomingEvents)),
        userRegion,
      },
    }
  } catch (error) {
    console.error('Error fetching home data:', error)
    return {
      props: {
        topPoliticians: [],
        recentNews: [],
        upcomingEvents: [],
      },
    }
  }
}
