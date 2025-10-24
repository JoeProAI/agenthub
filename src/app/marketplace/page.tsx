'use client'

import Link from 'next/link'
import { Bot, ArrowRight, Sparkles, TrendingUp, Star } from 'lucide-react'

const agents = [
  {
    id: 'content-wizard',
    name: 'Content Wizard',
    description: 'Transform notes and threads into polished blog posts, social media content, and documentation',
    price: 'FREE',
    category: 'Productivity',
    rating: 4.9,
    executions: 15420,
    badge: 'Most Popular',
    available: true,
  },
  {
    id: 'code-review',
    name: 'Code Review Pro',
    description: 'Automated code analysis with security checks, best practices, and performance optimization',
    price: '5 credits',
    category: 'Development',
    rating: 4.8,
    executions: 8932,
    badge: 'New',
    available: false,
  },
  {
    id: 'support-hero',
    name: 'Support Hero',
    description: 'Intelligent customer support automation with knowledge base integration and multi-channel',
    price: '2 credits',
    category: 'Customer Service',
    rating: 4.7,
    executions: 12105,
    available: false,
  },
  {
    id: 'data-analyst',
    name: 'Data Analyst',
    description: 'Analyze datasets, generate insights, create visualizations, and provide actionable recommendations',
    price: '10 credits',
    category: 'Analytics',
    rating: 4.9,
    executions: 6543,
    available: false,
  },
  {
    id: 'video-summarizer',
    name: 'Video Summarizer',
    description: 'Transcribe and summarize video content with key points, chapters, and actionable takeaways',
    price: '15 credits',
    category: 'Media',
    rating: 4.6,
    executions: 4221,
    available: false,
  },
  {
    id: 'research-assistant',
    name: 'Research Assistant',
    description: 'Deep research from multiple sources with comprehensive reports and citations',
    price: 'Pro Only',
    category: 'Research',
    rating: 4.8,
    executions: 3892,
    badge: 'Enterprise',
    available: false,
  },
]

const categories = ['All', 'Productivity', 'Development', 'Customer Service', 'Analytics', 'Media', 'Research']

export default function MarketplacePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-blue-950 to-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center gap-2">
              <Bot className="w-8 h-8 text-blue-500" />
              <span className="text-2xl font-bold text-white">AgentHub</span>
            </Link>
            
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="text-slate-400 hover:text-white transition">
                Dashboard
              </Link>
              <Link href="/auth/signin" className="px-4 py-2 text-white hover:text-blue-400 transition">
                Sign In
              </Link>
              <Link href="/auth/signup" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">Agent Marketplace</h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Discover and deploy production-ready AI agents built by the community
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-white mb-2">6</div>
            <div className="text-slate-400">Available Agents</div>
          </div>
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-white mb-2">51K+</div>
            <div className="text-slate-400">Total Executions</div>
          </div>
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-white mb-2">4.8</div>
            <div className="text-slate-400">Average Rating</div>
          </div>
        </div>

        {/* Categories */}
        <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition ${
                category === 'All'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Agents Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((agent) => (
            <div
              key={agent.id}
              className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 hover:border-blue-500/50 transition group"
            >
              <div className="flex justify-between items-start mb-4">
                <Bot className="w-12 h-12 text-blue-500 group-hover:scale-110 transition" />
                {agent.badge && (
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full font-medium">
                    {agent.badge}
                  </span>
                )}
              </div>

              <h3 className="text-xl font-bold text-white mb-2">{agent.name}</h3>
              <p className="text-slate-400 text-sm mb-4 min-h-[3rem]">{agent.description}</p>

              <div className="flex items-center gap-4 mb-4 text-sm text-slate-500">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="text-white">{agent.rating}</span>
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  <span>{agent.executions.toLocaleString()} runs</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <div>
                  <div className="text-xs text-slate-500">Price</div>
                  <div className="text-blue-400 font-bold">{agent.price}</div>
                </div>
                {agent.available ? (
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                  >
                    Try Now
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                ) : (
                  <button
                    disabled
                    className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-slate-500 rounded-lg cursor-not-allowed text-sm font-medium"
                  >
                    Coming Soon
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-center">
          <Sparkles className="w-12 h-12 text-white mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white mb-4">
            Want to Build Your Own Agent?
          </h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Join our creator program and monetize your AI agents on the marketplace
          </p>
          <Link
            href="/docs"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition font-semibold"
          >
            Read the Docs
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  )
}
