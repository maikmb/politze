import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

interface Comment {
  id: string
  content: string
  createdAt: string
  user: {
    id: string
    name: string | null
    image: string | null
  }
}

interface CommentsProps {
  politicianId: string
}

export default function Comments({ politicianId }: CommentsProps) {
  const { data: session, status } = useSession()
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    loadComments()
  }, [politicianId])

  const loadComments = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/comments/${politicianId}`)
      if (response.ok) {
        const data = await response.json()
        setComments(data)
      }
    } catch (err) {
      console.error('Error loading comments:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newComment.trim()) {
      setError('Por favor, escreva um comentário')
      return
    }

    setSubmitting(true)
    setError('')

    try {
      const response = await fetch(`/api/comments/${politicianId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: newComment }),
      })

      if (response.ok) {
        const comment = await response.json()
        setComments([comment, ...comments])
        setNewComment('')
      } else {
        const data = await response.json()
        setError(data.error || 'Erro ao enviar comentário')
      }
    } catch (err) {
      setError('Erro ao enviar comentário')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Comentários ({comments.length})
      </h2>

      {/* Comment Form */}
      {status === 'authenticated' ? (
        <form onSubmit={handleSubmit} className="mb-6">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Deixe seu comentário sobre este político..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
            rows={4}
            maxLength={1000}
            disabled={submitting}
          />
          {error && (
            <p className="text-red-600 text-sm mt-2">{error}</p>
          )}
          <div className="flex justify-between items-center mt-2">
            <span className="text-sm text-gray-500">
              {newComment.length}/1000 caracteres
            </span>
            <button
              type="submit"
              disabled={submitting || !newComment.trim()}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {submitting ? 'Enviando...' : 'Comentar'}
            </button>
          </div>
        </form>
      ) : (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200 text-center">
          <p className="text-gray-600">
            Faça login para deixar um comentário
          </p>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8 text-gray-500">
            Carregando comentários...
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Ainda não há comentários. Seja o primeiro a comentar!
          </div>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="border-l-4 border-primary-200 pl-4 py-3 bg-gray-50 rounded-r-lg"
            >
              <div className="flex items-center gap-3 mb-2">
                {comment.user.image ? (
                  <img
                    src={comment.user.image}
                    alt={comment.user.name || 'User'}
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold">
                    {comment.user.name?.charAt(0) || '?'}
                  </div>
                )}
                <div className="flex-1">
                  <div className="font-medium text-gray-900">
                    {comment.user.name || 'Anônimo'}
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(comment.createdAt).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
              </div>
              <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
