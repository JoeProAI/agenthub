'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth/AuthProvider'
import { useRouter } from 'next/navigation'
import { Terminal, Activity, Zap, ArrowRight, LogOut, FileText, TrendingUp, Database } from 'lucide-react'
import Link from 'next/link'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase/config'
import toast from 'react-hot-toast'

export default function DashboardPage() {
  const { user, loading: authLoading, signOut } = useAuth()
  const router = useRouter()
  const [credits, setCredits] = useState<number>(0)
  const [totalExecutions, setTotalExecutions] = useState<number>(0)
  const [loading, setLoading] = useState(true)

  // Content Engine State
  const [content, setContent] = useState('')
  const [format, setFormat] = useState<'blog' | 'social' | 'documentation' | 'email' | 'landing-page'>('blog')
  const [tone, setTone] = useState<'professional' | 'casual' | 'technical' | 'friendly' | 'persuasive'>('professional')
  const [seoOptimize, setSeoOptimize] = useState(true)
  const [factCheck, setFactCheck] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [result, setResult] = useState('')

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
          setTotalExecutions(userData?.totalExecutions || 0)
        }
        setLoading(false)
      }
    }
    fetchUserData()
  }, [user])

  const handleGenerate = async () => {
    if (!content.trim()) {
      toast.error('Please enter some content')
      return
    }

    if (!user) return

    setGenerating(true)
    setResult('')

    try {
      const response = await fetch('/api/agents/content-engine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          format,
          tone,
          userId: user.uid,
          options: {
            seoOptimize,
            factCheck,
            includeImages: false
          }
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to generate content')
      }

      const data = await response.json()
      setResult(data.content)
      setCredits(data.creditsRemaining)
      toast.success(`Generated ${data.metadata.wordCount} words in ${Math.round(data.metadata.readingTime)}min read`)
    } catch (error: any) {
      console.error(error)
      toast.error(error.message || 'Failed to generate content')
    } finally {
      setGenerating(false)
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
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-blue-950 to-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center gap-2">
              <Terminal className="w-8 h-8 text-blue-500" />
              <span className="text-2xl font-bold text-white">AgentHub</span>
            </Link>
            
            <div className="flex items-center gap-6">
              <Link
                href="/chat"
                className="text-slate-400 hover:text-white transition"
              >
                Chat
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

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Welcome Card */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 mb-8">
              <h1 className="text-2xl font-bold text-white mb-2">
                Welcome back, {user.displayName || 'there'}!
              </h1>
              <p className="text-blue-100">
                You have {credits} credits remaining and {totalExecutions} total executions
              </p>
            </div>

            {/* Content Engine */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <Terminal className="w-8 h-8 text-blue-500" />
                <div>
                  <h2 className="text-2xl font-bold text-white">Content Engine</h2>
                  <p className="text-slate-400">Transform your notes into polished content</p>
                </div>
              </div>

              {/* Input */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Your Content
                  </label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Paste your notes, ideas, or draft content here..."
                    className="w-full h-40 px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition resize-none"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Format
                    </label>
                    <select
                      value={format}
                      onChange={(e) => setFormat(e.target.value as any)}
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500 transition"
                    >
                      <option value="blog">Blog Post</option>
                      <option value="social">Social Media</option>
                      <option value="documentation">Documentation</option>
                      <option value="email">Email</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Tone
                    </label>
                    <select
                      value={tone}
                      onChange={(e) => setTone(e.target.value as any)}
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500 transition"
                    >
                      <option value="professional">Professional</option>
                      <option value="casual">Casual</option>
                      <option value="technical">Technical</option>
                      <option value="friendly">Friendly</option>
                    </select>
                  </div>
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={generating || !content.trim()}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {generating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5" />
                    Execute
                  </>
                )}
              </button>

              {/* Result */}
              {result && (
                <div className="mt-6 p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-semibold text-white">Generated Content</h3>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(result)
                        toast.success('Copied to clipboard!')
                      }}
                      className="text-sm text-blue-400 hover:text-blue-300 transition"
                    >
                      Copy
                    </button>
                  </div>
                  <div className="text-slate-300 whitespace-pre-wrap">{result}</div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-400">Credits</span>
                  <span className="text-white font-semibold">{credits}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Executions</span>
                  <span className="text-white font-semibold">{totalExecutions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Tier</span>
                  <span className="text-blue-400 font-semibold">Free</span>
                </div>
              </div>
            </div>

            {/* Add Credits */}
            <div className="bg-gradient-to-br from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-xl p-6">
              <Database className="w-8 h-8 text-blue-400 mb-3" />
              <h3 className="text-lg font-semibold text-white mb-2">Scale Your Usage</h3>
              <p className="text-slate-400 text-sm mb-4">
                Upgrade to unlock unlimited potential
              </p>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
              >
                View Plans
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* More Workflows */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-3">More Workflows</h3>
              <p className="text-slate-400 text-sm mb-4">
                Explore automation workflows
              </p>
              <Link
                href="/marketplace"
                className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition text-sm font-medium"
              >
                Browse Workflows
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
