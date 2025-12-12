import { ReactNode } from 'react'
import Link from 'next/link'
import { useSession, signIn, signOut } from 'next-auth/react'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const { data: session } = useSession()

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg">
        <nav className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="text-3xl font-bold">
                <span className="text-white">Polit</span>
                <span className="text-yellow-300">ze</span>
              </div>
            </Link>

            <div className="hidden md:flex items-center space-x-6">
              <Link href="/" className="hover:text-yellow-300 transition">
                Início
              </Link>
              <Link href="/politicians" className="hover:text-yellow-300 transition">
                Políticos
              </Link>
              <Link href="/news" className="hover:text-yellow-300 transition">
                Notícias
              </Link>
              <Link href="/events" className="hover:text-yellow-300 transition">
                Agenda
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              {session ? (
                <div className="flex items-center space-x-3">
                  {session.user?.image && (
                    <img
                      src={session.user.image}
                      alt={session.user.name || 'User'}
                      className="w-8 h-8 rounded-full"
                    />
                  )}
                  <span className="hidden sm:inline">{session.user?.name}</span>
                  <button
                    onClick={() => signOut()}
                    className="bg-white text-primary-600 px-4 py-2 rounded-lg hover:bg-yellow-300 transition font-medium"
                  >
                    Sair
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => signIn()}
                  className="bg-white text-primary-600 px-4 py-2 rounded-lg hover:bg-yellow-300 transition font-medium"
                >
                  Entrar
                </button>
              )}
            </div>
          </div>
        </nav>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="bg-gray-800 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">
                <span className="text-white">Polit</span>
                <span className="text-yellow-300">ze</span>
              </h3>
              <p className="text-gray-400">
                Conscientizando os brasileiros sobre a qualidade dos candidatos políticos.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/" className="hover:text-yellow-300 transition">
                    Início
                  </Link>
                </li>
                <li>
                  <Link href="/politicians" className="hover:text-yellow-300 transition">
                    Políticos
                  </Link>
                </li>
                <li>
                  <Link href="/news" className="hover:text-yellow-300 transition">
                    Notícias
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Sobre</h4>
              <p className="text-gray-400">
                Plataforma de transparência política para o Brasil.
              </p>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Politze. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
