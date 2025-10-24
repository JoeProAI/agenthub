import Link from 'next/link'
import { Bot, Check, ArrowRight } from 'lucide-react'

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for trying out AI agents',
    features: [
      '100 free credits on signup',
      'Access to Content Wizard',
      'Basic support',
      'Community access',
      'API access (100 calls/day)',
    ],
    cta: 'Get Started',
    href: '/auth/signup',
    popular: false,
  },
  {
    name: 'Basic',
    price: '$9',
    period: '/month',
    description: 'For individuals and small teams',
    features: [
      '500 credits/month',
      'All marketplace agents',
      'Priority support',
      'Advanced analytics',
      'API access (1K calls/day)',
      'Custom integrations',
    ],
    cta: 'Start Free Trial',
    href: '/auth/signup',
    popular: true,
  },
  {
    name: 'Pro',
    price: '$29',
    period: '/month',
    description: 'For growing businesses',
    features: [
      '2,000 credits/month',
      'All marketplace agents',
      'Premium support (24/7)',
      'Advanced analytics & insights',
      'API access (10K calls/day)',
      'Custom agent deployment',
      'Team collaboration',
      'White-label options',
    ],
    cta: 'Start Free Trial',
    href: '/auth/signup',
    popular: false,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'For large organizations',
    features: [
      'Unlimited credits',
      'Dedicated agents',
      'Dedicated support manager',
      'Custom SLAs',
      'Unlimited API calls',
      'On-premise deployment',
      'Advanced security & compliance',
      'Custom training & onboarding',
    ],
    cta: 'Contact Sales',
    href: '/contact',
    popular: false,
  },
]

export default function PricingPage() {
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
              <Link href="/marketplace" className="text-slate-400 hover:text-white transition">
                Marketplace
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

      <div className="container mx-auto px-4 py-16">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-4">Simple, Transparent Pricing</h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Choose the plan that's right for you. All plans include a 14-day free trial.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto mb-16">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative bg-slate-900/50 border rounded-2xl p-6 ${
                plan.popular
                  ? 'border-blue-500 shadow-lg shadow-blue-500/20'
                  : 'border-slate-800'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-blue-600 text-white text-sm font-medium rounded-full">
                  Most Popular
                </div>
              )}
              
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  <span className="text-slate-400">{plan.period}</span>
                </div>
                <p className="text-slate-400 text-sm">{plan.description}</p>
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <Check className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className={`block w-full px-6 py-3 rounded-lg text-center font-medium transition ${
                  plan.popular
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-slate-800 text-white hover:bg-slate-700'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-6">
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-2">
                What are credits?
              </h3>
              <p className="text-slate-400">
                Credits are used to run AI agents. Different agents consume different amounts of credits based on their complexity. The Content Wizard is free to use as a demo.
              </p>
            </div>

            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-2">
                Can I change plans anytime?
              </h3>
              <p className="text-slate-400">
                Yes! You can upgrade, downgrade, or cancel your plan at any time. Changes take effect at the start of your next billing cycle.
              </p>
            </div>

            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-2">
                Do unused credits roll over?
              </h3>
              <p className="text-slate-400">
                Monthly subscription credits reset each billing cycle. However, purchased credit packs never expire.
              </p>
            </div>

            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-slate-400">
                We accept all major credit cards (Visa, Mastercard, Amex), as well as PayPal and bank transfers for Enterprise plans.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-center max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-4">
            Still have questions?
          </h2>
          <p className="text-blue-100 mb-8">
            Our team is here to help. Get in touch and we'll respond within 24 hours.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition font-semibold"
          >
            Contact Sales
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  )
}
