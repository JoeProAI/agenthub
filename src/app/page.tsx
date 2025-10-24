import Link from "next/link"
import { ArrowRight, Bot, Zap, DollarSign, Shield, Sparkles, Code2 } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-blue-950 to-slate-950">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <nav className="flex justify-between items-center mb-20">
          <div className="flex items-center gap-2">
            <Bot className="w-8 h-8 text-blue-500" />
            <span className="text-2xl font-bold text-white">AgentHub</span>
          </div>
          <div className="flex gap-4">
            <Link 
              href="/auth/signin" 
              className="px-4 py-2 text-white hover:text-blue-400 transition"
            >
              Sign In
            </Link>
            <Link 
              href="/auth/signup"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Get Started
            </Link>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="text-center max-w-4xl mx-auto mb-20">
          <div className="inline-block mb-4 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full">
            <span className="text-blue-400 text-sm font-medium">Built on Vercel AI Cloud</span>
          </div>
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Ship AI Agents
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Without the Complexity
            </span>
          </h1>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Discover, deploy, and monetize production-ready AI agents. 
            Built with the Vercel AI SDK, powered by OpenAI and X AI.
          </p>
          <div className="flex gap-4 justify-center">
            <Link 
              href="/marketplace"
              className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 font-semibold"
            >
              Explore Agents
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link 
              href="/docs"
              className="px-8 py-4 border border-slate-700 text-white rounded-lg hover:border-slate-600 transition font-semibold"
            >
              View Docs
            </Link>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-20">
          <FeatureCard
            icon={<Zap className="w-8 h-8" />}
            title="Deploy in Seconds"
            description="From idea to production with zero infrastructure setup. Built on Vercel's edge network."
          />
          <FeatureCard
            icon={<Shield className="w-8 h-8" />}
            title="Production Ready"
            description="Durable workflows, automatic failover, and enterprise-grade security out of the box."
          />
          <FeatureCard
            icon={<DollarSign className="w-8 h-8" />}
            title="Monetize Easily"
            description="Built-in billing, subscriptions, and marketplace. Start earning from your agents."
          />
        </div>

        {/* Agent Showcase */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Popular Agents
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AgentCard
              name="Content Wizard"
              description="Turn notes and threads into polished blog posts, social media, and documentation"
              price="FREE"
              badge="Most Popular"
            />
            <AgentCard
              name="Code Review Pro"
              description="Automated code analysis with security checks and performance optimization tips"
              price="5 credits"
              badge="New"
            />
            <AgentCard
              name="Support Hero"
              description="Intelligent customer support automation with knowledge base integration"
              price="2 credits"
            />
            <AgentCard
              name="Data Analyst"
              description="Analyze datasets, generate insights, and create visualizations automatically"
              price="10 credits"
            />
            <AgentCard
              name="Video Summarizer"
              description="Transcribe and summarize video content with key points and chapters"
              price="15 credits"
            />
            <AgentCard
              name="Research Assistant"
              description="Deep research from multiple sources with comprehensive reports"
              price="Pro Only"
              badge="Enterprise"
            />
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-center">
          <Sparkles className="w-12 h-12 text-white mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Build Your First Agent?
          </h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Start with 100 free agent executions. No credit card required.
          </p>
          <Link 
            href="/auth/signup"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition font-semibold"
          >
            <Code2 className="w-5 h-5" />
            Get Started Free
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-800 mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center text-slate-400 text-sm">
            <p>© 2025 AgentHub. Built with Vercel AI Cloud.</p>
            <div className="flex gap-6">
              <Link href="/docs" className="hover:text-white transition">Docs</Link>
              <Link href="/pricing" className="hover:text-white transition">Pricing</Link>
              <Link href="/blog" className="hover:text-white transition">Blog</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 hover:border-blue-500/50 transition">
      <div className="text-blue-500 mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-slate-400">{description}</p>
    </div>
  )
}

function AgentCard({ name, description, price, badge }: { name: string; description: string; price: string; badge?: string }) {
  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 hover:border-blue-500/50 transition group cursor-pointer">
      <div className="flex justify-between items-start mb-3">
        <Bot className="w-10 h-10 text-blue-500 group-hover:scale-110 transition" />
        {badge && (
          <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">
            {badge}
          </span>
        )}
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{name}</h3>
      <p className="text-slate-400 text-sm mb-4">{description}</p>
      <div className="flex justify-between items-center">
        <span className="text-blue-400 font-semibold">{price}</span>
        <ArrowRight className="w-5 h-5 text-slate-600 group-hover:text-blue-500 group-hover:translate-x-1 transition" />
      </div>
    </div>
  )
}
