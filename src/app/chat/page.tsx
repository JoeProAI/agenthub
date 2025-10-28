'use client'

import { useChat } from 'ai/react'
import { useAuth } from '@/lib/auth/AuthProvider'
import { useRouter } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import { Terminal, Zap, LogOut, Send, Copy, Share2, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase/config'
import toast from 'react-hot-toast'

export default function ChatPage() {
  const { user, loading: authLoading, signOut } = useAuth()
  const router = useRouter()
  const [credits, setCredits] = useState<number>(0)
  const [loading, setLoading] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
    api: '/api/chat',
    body: {
      userId: user?.uid,
    },
    onResponse: async (response) => {
      // Refresh credits after successful response
      if (user) {
        const userRef = doc(db, 'users', user.uid)
        const userSnap = await getDoc(userRef)
        if (userSnap.exists()) {
          const userData = userSnap.data()
          setCredits(userData?.credits || 0)
        }
      }
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to send message')
    },
  })

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/signin')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const userRef = doc(db, 'users', user.uid)
        const userSnap = await getDoc(userRef)
        if (userSnap.exists()) {
          const userData = userSnap.data()
          setCredits(userData?.credits || 0)
        }
        setLoading(false)
      }
    }
    fetchUserData()
  }, [user])

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
    toast.success('Copied to clipboard!')
  }

  const handleShareConversation = async () => {
    const conversationText = messages
      .map(m => `${m.role.toUpperCase()}: ${m.content}`)
      .join('\n\n')

    try {
      await navigator.clipboard.writeText(conversationText)
      toast.success('Conversation copied to clipboard!')
    } catch (error) {
      toast.error('Failed to copy conversation')
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-blue-950 to-slate-950 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-blue-950 to-slate-950 flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-800 flex-shrink-0">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center gap-2">
              <Terminal className="w-8 h-8 text-blue-500" />
              <span className="text-2xl font-bold text-white">AgentHub</span>
            </Link>

            <div className="flex items-center gap-6">
              <Link
                href="/dashboard"
                className="text-slate-400 hover:text-white transition"
              >
                Dashboard
              </Link>

              <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 rounded-lg">
                <Zap className="w-5 h-5 text-blue-400" />
                <span className="text-white font-semibold">{credits}</span>
                <span className="text-slate-400 text-sm">credits</span>
              </div>

              <button
                onClick={signOut}
                className="flex items-center gap-2 px-4 py-2 text-slate-400 hover:text-white transition"
              >
                <LogOut className="w-5 h-5" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Chat Container */}
      <div className="flex-1 container mx-auto px-4 py-8 flex flex-col max-w-4xl">
        {/* Title */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">Streaming Chat</h1>
          <p className="text-slate-400">Chat with AI agents in real-time. Watch them think, use tools, and reason.</p>

          {messages.length > 0 && (
            <button
              onClick={handleShareConversation}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-slate-800/50 text-slate-300 rounded-lg hover:bg-slate-800 transition text-sm"
            >
              <Share2 className="w-4 h-4" />
              Share Conversation
            </button>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto mb-6 space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-12">
              <Terminal className="w-16 h-16 text-slate-700 mx-auto mb-4" />
              <p className="text-slate-400 mb-2">Start a conversation</p>
              <p className="text-slate-500 text-sm">
                Try asking: "Research the latest trends in AI" or "Analyze this code snippet"
              </p>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-6 py-4 ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-900/50 border border-slate-800 text-slate-100'
                }`}
              >
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div className="text-xs font-semibold uppercase tracking-wider opacity-70">
                    {message.role === 'user' ? 'You' : 'Agent'}
                  </div>
                  {message.role === 'assistant' && (
                    <button
                      onClick={() => handleCopyMessage(message.content)}
                      className="text-slate-400 hover:text-white transition"
                      title="Copy message"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="whitespace-pre-wrap break-words leading-relaxed">
                  {message.content}
                </div>

                {/* Show tool calls if available */}
                {message.toolInvocations && message.toolInvocations.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {message.toolInvocations.map((tool: any, idx: number) => (
                      <div
                        key={idx}
                        className="bg-slate-800/50 border border-slate-700 rounded-lg p-3 text-sm"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Terminal className="w-4 h-4 text-blue-400" />
                          <span className="font-semibold text-blue-400">
                            Tool: {tool.toolName}
                          </span>
                        </div>

                        {tool.state === 'result' && tool.result && (
                          <div className="text-slate-400 text-xs">
                            <details>
                              <summary className="cursor-pointer hover:text-slate-300 transition">
                                View result
                              </summary>
                              <pre className="mt-2 overflow-x-auto">
                                {JSON.stringify(tool.result, null, 2)}
                              </pre>
                            </details>
                          </div>
                        )}

                        {tool.state === 'call' && (
                          <div className="text-slate-500 text-xs flex items-center gap-2">
                            <div className="w-3 h-3 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin" />
                            Executing...
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl px-6 py-4">
                <div className="flex items-center gap-3 text-slate-400">
                  <div className="w-5 h-5 border-2 border-slate-700 border-t-blue-500 rounded-full animate-spin" />
                  <span>Agent is thinking...</span>
                </div>
              </div>
            </div>
          )}

          {/* Error display */}
          {error && (
            <div className="bg-red-900/20 border border-red-800 rounded-2xl px-6 py-4 text-red-200">
              Error: {error.message}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder="Ask me anything..."
            disabled={isLoading}
            className="flex-1 px-6 py-4 bg-slate-900/50 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-6 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
          >
            <Send className="w-5 h-5" />
            Send
          </button>
        </form>

        {/* Cost indicator */}
        <div className="mt-4 text-center text-sm text-slate-500">
          Each message costs 5 credits. You have {credits} credits remaining.
        </div>
      </div>
    </div>
  )
}
