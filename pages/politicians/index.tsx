import { useState } from 'react'
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'

interface PoliticiansProps {
  politicians: any[]
  states: string[]
}

export default function Politicians({ politicians, states }: PoliticiansProps) {
  const [selectedState, setSelectedState] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredPoliticians = politicians.filter((politician) => {
    const matchesState = !selectedState || politician.state === selectedState
    const matchesSearch =
      !searchTerm ||
      politician.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      politician.party.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesState && matchesSearch
  })

  return (
    <>
      <Head>
        <title>Políticos - Politze</title>
        <meta name="description" content="Conheça os políticos do Brasil" />
      </Head>

      <div className="bg-gray-50 min-h-screen">
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold mb-4">Políticos do Brasil</h1>
            <p className="text-xl text-gray-100">
              Conheça e avalie seus representantes
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Filters */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Buscar por nome ou partido
                </label>
                <input
                  type="text"
                  placeholder="Digite o nome ou partido..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filtrar por estado
                </label>
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Todos os estados</option>
                  {states.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Results count */}
          <div className="mb-6">
            <p className="text-gray-600">
              Mostrando {filteredPoliticians.length} de {politicians.length} políticos
            </p>
          </div>

          {/* Politicians Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPoliticians.map((politician) => (
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
                  <p className="text-gray-500 text-xs mb-3">
                    {politician.city ? `${politician.city}, ` : ''}{politician.state}
                  </p>
                  
                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-blue-50 p-2 rounded">
                      <div className="text-blue-600 font-bold">
                        {politician.proposalsCount}
                      </div>
                      <div className="text-gray-600">Propostas</div>
                    </div>
                    <div className="bg-green-50 p-2 rounded">
                      <div className="text-green-600 font-bold">
                        {politician.presenceRate?.toFixed(0) || 0}%
                      </div>
                      <div className="text-gray-600">Presença</div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {filteredPoliticians.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">
                Nenhum político encontrado com os filtros selecionados.
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
    const politicians = await prisma.politician.findMany({
      orderBy: { score: 'desc' },
      select: {
        id: true,
        name: true,
        party: true,
        position: true,
        state: true,
        city: true,
        photo: true,
        score: true,
        proposalsCount: true,
        presenceRate: true,
      },
    })

    const states = [...new Set(politicians.map((p) => p.state))].sort()

    return {
      props: {
        politicians: JSON.parse(JSON.stringify(politicians)),
        states,
      },
    }
  } catch (error) {
    console.error('Error fetching politicians:', error)
    return {
      props: {
        politicians: [],
        states: [],
      },
    }
  }
}
