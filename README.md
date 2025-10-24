# 🤖 AgentHub - AI Agent Marketplace

A production-ready AI agent marketplace built on **Vercel AI Cloud**, **Firebase**, and **Next.js 15**.

## 🚀 Quick Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/agenthub)

---

## 📋 Prerequisites

Before deploying, you'll need accounts and API keys for:

1. **Vercel** - https://vercel.com (free tier available)
2. **Firebase** - https://firebase.google.com (free Spark plan)
3. **OpenAI** - https://platform.openai.com/api-keys
4. **Stripe** - https://dashboard.stripe.com/test/apikeys
5. **GitHub** - https://github.com (for code hosting)

### Optional Services
- **X AI** (Grok) - https://x.ai (for additional models)
- **Modal** - https://modal.com ($500 credits for heavy compute)
- **Daytona.io** - https://daytona.io ($20k credits for cloud dev environments)

---

## 🛠️ Step-by-Step Setup

### Step 1: Firebase Project Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"**
3. Enter project name: `agenthub-prod`
4. Enable Google Analytics (optional)
5. Click **"Create project"**

#### Enable Firebase Authentication
1. In Firebase Console, go to **Authentication** → **Get Started**
2. Enable **Email/Password** provider
3. Enable **Google** provider
   - Add your OAuth client ID (auto-generated)

#### Create Firestore Database
1. Go to **Firestore Database** → **Create database**
2. Start in **production mode**
3. Choose location: `us-east1` (or closest to your users)
4. Click **Enable**

#### Add Firestore Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Public agent marketplace data
    match /agents/{agentId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Private user executions
    match /executions/{executionId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
    
    // Billing records (private)
    match /billing/{userId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == userId;
    }
  }
}
```

#### Get Firebase Config
1. Go to **Project Settings** (gear icon)
2. Scroll to **"Your apps"** → Click web icon (</>) 
3. Register app name: `AgentHub Web`
4. Copy the `firebaseConfig` values - you'll need these for Vercel

#### Create Firebase Admin Service Account
1. Go to **Project Settings** → **Service Accounts**
2. Click **"Generate new private key"**
3. Download the JSON file - you'll need this for Vercel

---

### Step 2: Create GitHub Repository

```bash
# Option A: Using GitHub CLI (recommended)
gh repo create agenthub --public --source=. --remote=origin

# Option B: Using GitHub web interface
# 1. Go to https://github.com/new
# 2. Repository name: agenthub
# 3. Public or Private
# 4. Do NOT initialize with README (we already have one)
# 5. Click "Create repository"
```

#### Push code to GitHub
```bash
cd "c:\Projects\WindSurf\Vercel Agents"
git init
git add .
git commit -m "Initial commit: AgentHub platform"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/agenthub.git
git push -u origin main
```

---

### Step 3: Deploy to Vercel

#### Method A: Vercel Dashboard (Easiest)

1. Go to [Vercel Dashboard](https://vercel.com/new)
2. Click **"Import Project"**
3. Select your GitHub repository `agenthub`
4. Configure settings:
   - **Framework Preset**: Next.js
   - **Root Directory**: ./
   - **Build Command**: `next build`
   - **Output Directory**: .next
   - **Install Command**: `npm install`

5. Click **"Deploy"**

#### Method B: Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy from project directory
cd "c:\Projects\WindSurf\Vercel Agents"
vercel

# Follow prompts:
# - Set up and deploy? Y
# - Which scope? (select your account)
# - Link to existing project? N
# - Project name? agenthub
# - Directory? ./
# - Override settings? N

# Production deployment
vercel --prod
```

---

### Step 4: Configure Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Click **Settings** → **Environment Variables**
3. Add all variables from `.env.example`:

#### Firebase Config (from Step 1)
```
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=agenthub-prod.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=agenthub-prod
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=agenthub-prod.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:...
```

#### Firebase Admin (from service account JSON)
```
FIREBASE_ADMIN_PROJECT_ID=agenthub-prod
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxxxx@agenthub-prod.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

#### OpenAI
```
OPENAI_API_KEY=sk-proj-...
```

#### Stripe
```
STRIPE_SECRET_KEY=sk_test_... (or sk_live_... for production)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_... (or pk_live_...)
STRIPE_WEBHOOK_SECRET=whsec_... (configure after Stripe webhook setup)
```

#### Optional: X AI
```
XAI_API_KEY=xai-...
```

#### Optional: Modal
```
MODAL_TOKEN_ID=ak-...
MODAL_TOKEN_SECRET=as-...
```

#### App Config
```
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
NEXT_PUBLIC_APP_NAME=AgentHub
```

4. Click **"Save"** for each variable
5. Click **"Redeploy"** to apply environment variables

---

### Step 5: Configure Stripe Webhooks

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/webhooks)
2. Click **"Add endpoint"**
3. Endpoint URL: `https://your-app.vercel.app/api/webhooks/stripe`
4. Select events to listen for:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copy the **"Signing secret"** (starts with `whsec_...`)
6. Add it to Vercel environment variables as `STRIPE_WEBHOOK_SECRET`
7. Redeploy in Vercel

---

### Step 6: Set up Firebase Hosting (Optional)

For custom domain mapping:

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in your project
cd "c:\Projects\WindSurf\Vercel Agents"
firebase init hosting

# Select:
# - Use existing project: agenthub-prod
# - Public directory: out
# - Configure as single-page app: Yes
# - Set up automatic builds with GitHub: Yes (optional)

# Deploy to Firebase (if not using Vercel)
npm run build && firebase deploy
```

**Note**: We recommend using **Vercel** as primary host since it has better Next.js support.

---

## 🔐 Security Checklist

Before going live:

- [ ] Enable 2FA on Firebase, Vercel, GitHub, Stripe
- [ ] Use production Stripe keys (not test keys)
- [ ] Review Firestore security rules
- [ ] Set up Vercel domain authentication
- [ ] Enable Vercel Web Application Firewall
- [ ] Configure CORS policies
- [ ] Set up monitoring (Sentry, LogRocket)
- [ ] Review Firebase usage limits
- [ ] Enable rate limiting on API routes

---

## 📊 Monitoring & Analytics

### Vercel Analytics
- Automatically enabled for all deployments
- View at: https://vercel.com/[your-username]/agenthub/analytics

### Firebase Analytics
```typescript
// Already integrated in lib/firebase/analytics.ts
import { logEvent } from 'firebase/analytics'
logEvent(analytics, 'agent_executed', {
  agent_id: 'content-wizard',
  user_id: userId
})
```

### Error Tracking with Sentry (Optional)
```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

---

## 🧪 Testing Locally (Daytona.io)

### Set up Daytona Cloud Workspace

1. Go to [Daytona.io](https://www.daytona.io/)
2. Create new workspace from GitHub repo
3. Environment will be auto-configured
4. Access via VS Code or browser IDE

### Manual Local Setup (Alternative)

```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/agenthub.git
cd agenthub

# Install dependencies
npm install

# Create .env.local file
cp .env.example .env.local

# Add your API keys to .env.local

# Run development server
npm run dev

# Open http://localhost:3000
```

---

## 💳 Pricing Tiers

| Tier | Price | Executions | Agents | Features |
|------|-------|-----------|--------|----------|
| **Free** | $0/mo | 100/mo | View only | Basic agents |
| **Basic** | $9/mo | 1,000/mo | 3 agents | Email support |
| **Pro** | $29/mo | 10,000/mo | 10 agents | API access, priority |
| **Enterprise** | $99/mo | Unlimited | Unlimited | Custom agents, SLA |

---

## 🤖 Available Agents (MVP)

1. **Content Wizard** - Transform notes into polished content (FREE)
2. **Code Review Pro** - Automated code analysis (5 credits)
3. **Support Hero** - Customer support automation (2 credits)
4. **Data Analyst** - Analyze datasets and generate insights (10 credits)
5. **Video Summarizer** - Transcribe and summarize videos (15 credits)

---

## 🛣️ Roadmap

### Phase 1: MVP (Weeks 1-2)✅
- [x] Next.js 15 setup
- [x] Firebase authentication
- [x] Basic UI components
- [ ] 3 core agents (Content, Code Review, Support)
- [ ] Credit system
- [ ] Landing page

### Phase 2: Monetization (Weeks 3-4)
- [ ] Stripe integration
- [ ] Subscription tiers
- [ ] Usage tracking
- [ ] Admin dashboard

### Phase 3: Marketplace (Weeks 5-6)
- [ ] Agent marketplace UI
- [ ] Developer portal
- [ ] Agent submission flow
- [ ] Revenue sharing

### Phase 4: Scale (Weeks 7-8)
- [ ] Modal integration
- [ ] Advanced agents (Video, Research)
- [ ] Public API
- [ ] Enterprise features

---

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

---

## 📄 License

MIT License - see [LICENSE](./LICENSE) for details.

---

## 🆘 Support

- **Documentation**: https://your-app.vercel.app/docs
- **Email**: support@yourdomain.com
- **Discord**: https://discord.gg/your-server

---

## 🌟 Built With

- [Next.js 15](https://nextjs.org/)
- [Vercel AI SDK](https://sdk.vercel.ai/)
- [Firebase](https://firebase.google.com/)
- [Stripe](https://stripe.com/)
- [TailwindCSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)

---

## 📞 Contact

**JoeProAI**
- Website: https://joepro.ai
- GitHub: [@JoeProAI](https://github.com/JoeProAI)
- Email: joe@joepro.ai

---

Built with ❤️ using Vercel AI Cloud
