import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { prisma } from '@/lib/prisma'

interface EventsProps {
  events: any[]
}

export default function Events({ events }: EventsProps) {
  return (
    <>
      <Head>
        <title>Agenda de Eventos - Politze</title>
        <meta name="description" content="Próximos protestos e eventos públicos" />
      </Head>

      <div className="bg-gray-50 min-h-screen">
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold mb-4">Agenda de Eventos</h1>
            <p className="text-xl text-gray-100">
              Participe de protestos e eventos públicos
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <span className="inline-block bg-primary-600 text-white px-3 py-1 rounded-lg text-xs font-bold uppercase mb-2">
                      {event.type}
                    </span>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">
                      {event.title}
                    </h2>
                  </div>
                  <div className="text-center bg-primary-50 rounded-lg p-3">
                    <div className="text-3xl font-bold text-primary-600">
                      {new Date(event.date).getDate()}
                    </div>
                    <div className="text-xs text-gray-600">
                      {new Date(event.date).toLocaleDateString('pt-BR', {
                        month: 'short',
                      })}
                    </div>
                  </div>
                </div>

                {event.description && (
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {event.description}
                  </p>
                )}

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <span>📅</span>
                    <span>
                      {new Date(event.date).toLocaleDateString('pt-BR', {
                        weekday: 'long',
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <span>🕐</span>
                    <span>
                      {new Date(event.date).toLocaleTimeString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  {event.location && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <span>📍</span>
                      <span>{event.location}</span>
                    </div>
                  )}
                  {event.city && event.state && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <span>🌆</span>
                      <span>
                        {event.city}, {event.state}
                      </span>
                    </div>
                  )}
                  {event.organizer && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <span>👥</span>
                      <span>{event.organizer}</span>
                    </div>
                  )}
                </div>

                {event.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {event.tags.map((tag: string) => (
                      <span
                        key={tag}
                        className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {event.contactInfo && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-xs text-gray-500">
                      Contato: {event.contactInfo}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {events.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">
                Nenhum evento agendado no momento.
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
    const events = await prisma.event.findMany({
      where: {
        date: { gte: new Date() },
      },
      orderBy: { date: 'asc' },
    })

    return {
      props: {
        events: JSON.parse(JSON.stringify(events)),
      },
    }
  } catch (error) {
    console.error('Error fetching events:', error)
    return {
      props: {
        events: [],
      },
    }
  }
}
