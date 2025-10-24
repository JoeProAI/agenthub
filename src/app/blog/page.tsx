import Link from 'next/link'
import { Bot } from 'lucide-react'

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-blue-950 to-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="flex items-center gap-2">
            <Bot className="w-8 h-8 text-blue-500" />
            <span className="text-2xl font-bold text-white">AgentHub</span>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-16 max-w-4xl text-center">
        <h1 className="text-5xl font-bold text-white mb-4">Blog</h1>
        <p className="text-xl text-slate-400 mb-12">
          Coming soon - Insights, tutorials, and updates from the AgentHub team
        </p>
        <Link
          href="/"
          className="inline-block px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
        >
          Back to Home
        </Link>
      </div>
    </div>
  )
}
