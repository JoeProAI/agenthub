import Link from 'next/link'
import { Bot, Book, Code2, Rocket } from 'lucide-react'

export default function DocsPage() {
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

      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">Documentation</h1>
          <p className="text-xl text-slate-400">
            Everything you need to build and deploy AI agents
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
            <Book className="w-12 h-12 text-blue-500 mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Quick Start</h2>
            <p className="text-slate-400 mb-4">
              Get started with AgentHub in minutes. Learn the basics and run your first agent.
            </p>
            <Link href="/docs/quickstart" className="text-blue-400 hover:text-blue-300">
              Read Guide →
            </Link>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
            <Code2 className="w-12 h-12 text-purple-500 mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">API Reference</h2>
            <p className="text-slate-400 mb-4">
              Complete API documentation for integrating agents into your applications.
            </p>
            <Link href="/docs/api" className="text-blue-400 hover:text-blue-300">
              View API Docs →
            </Link>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
            <Rocket className="w-12 h-12 text-green-500 mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Build Your Agent</h2>
            <p className="text-slate-400 mb-4">
              Learn how to create, test, and publish your own AI agents to the marketplace.
            </p>
            <Link href="/docs/building" className="text-blue-400 hover:text-blue-300">
              Start Building →
            </Link>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
            <Bot className="w-12 h-12 text-yellow-500 mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Example Agents</h2>
            <p className="text-slate-400 mb-4">
              Explore sample agents and learn best practices from real-world implementations.
            </p>
            <Link href="/docs/examples" className="text-blue-400 hover:text-blue-300">
              View Examples →
            </Link>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Need Help?
          </h2>
          <p className="text-blue-100 mb-8">
            Join our Discord community or reach out to our support team
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="https://discord.gg/agenthub"
              className="px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition font-semibold"
            >
              Join Discord
            </Link>
            <Link
              href="/contact"
              className="px-8 py-4 border-2 border-white text-white rounded-lg hover:bg-white/10 transition font-semibold"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
