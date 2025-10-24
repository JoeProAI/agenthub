# 🚀 Complete Cloud Deployment Guide

This guide walks you through deploying AgentHub **entirely in the cloud** using GitHub, Vercel, Firebase, and your available credits.

---

## 📋 What You'll Need

### Required Accounts (All Free Tiers Available)
- ✅ **GitHub** - Code hosting
- ✅ **Vercel** - Hosting & deployment  
- ✅ **Firebase** - Backend (Auth, Firestore, Storage)
- ✅ **OpenAI** - AI models (GPT-4o)
- ✅ **Stripe** - Payment processing

### Optional Accounts
- ⭐ **X AI** - Alternative AI models (Grok)
- ⭐ **Modal** - Heavy compute ($500 credits)
- ⭐ **Daytona.io** - Cloud dev environments ($20k credits)

---

## 🎯 Strategic Use of Your Credits

### Daytona.io ($20,000 credits) - Development Infrastructure
**Best used for:**
- Cloud development environments for the team
- Pre-configured workspaces with all dependencies
- Testing and staging environments
- CI/CD runners
- Agent testing sandboxes

**Setup Later:** We'll deploy first, then integrate Daytona for development

### Modal ($500 credits) - Production Compute
**Best used for:**
- Video processing agents (transcription, summarization)
- Batch data processing jobs
- Heavy ML inference tasks
- Scheduled background jobs
- Long-running agent workflows

**Setup Later:** Integrate after core agents are working

---

## Step 1: Create Firebase Project (5 minutes)

### 1.1 Create Project
1. Go to https://console.firebase.google.com/
2. Click **"Add project"**
3. Project name: `agenthub-production`
4. Google Analytics: **Yes** (recommended)
5. Click **"Create project"**

### 1.2 Enable Firebase Authentication
1. Left sidebar → **Authentication** → **Get started**
2. Click **"Email/Password"** → Enable both toggles → **Save**
3. Click **"Google"** → Enable → **Save**
   - Public-facing name: "AgentHub"
   - Support email: your-email@domain.com

### 1.3 Create Firestore Database
1. Left sidebar → **Firestore Database** → **Create database**
2. Start in **production mode** (we'll set rules next)
3. Location: **us-east1** (or closest to you)
4. Click **Enable**

### 1.4 Set Firestore Security Rules
Click **"Rules"** tab and paste:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // User profiles
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Public agents (marketplace)
    match /agents/{agentId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
        resource.data.creatorId == request.auth.uid;
    }
    
    // User executions (private)
    match /executions/{executionId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
    
    // Billing records
    match /billing/{userId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == userId;
    }
  }
}
```

Click **"Publish"**

### 1.5 Enable Firebase Storage
1. Left sidebar → **Storage** → **Get started**
2. Start in **production mode**
3. Location: **us-east1** (same as Firestore)
4. Click **Done**

### 1.6 Get Firebase Config
1. Click gear icon (⚙️) → **Project settings**
2. Scroll to **"Your apps"** section
3. Click web icon **</>** to add web app
4. App nickname: `AgentHub Web`
5. **DO NOT** check "Also set up Firebase Hosting"
6. Click **"Register app"**
7. **COPY** the `firebaseConfig` object - save to a text file

Example:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "agenthub-production.firebaseapp.com",
  projectId: "agenthub-production",
  storageBucket: "agenthub-production.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890abcdef"
};
```

### 1.7 Create Service Account
1. Project settings → **Service accounts** tab
2. Click **"Generate new private key"**
3. Click **"Generate key"** (downloads JSON file)
4. **SAVE THIS FILE SECURELY** - you'll need it for Vercel

---

## Step 2: Get API Keys (10 minutes)

### 2.1 OpenAI API Key
1. Go to https://platform.openai.com/api-keys
2. Click **"Create new secret key"**
3. Name: `AgentHub Production`
4. Permissions: **All** (or restrict to specific models)
5. Click **"Create secret key"**
6. **COPY** the key immediately (starts with `sk-proj-...`)
7. Add $10-20 credits to your account if needed

### 2.2 X AI API Key (Optional)
1. Go to https://console.x.ai/
2. Click **"API Keys"**
3. Create new key: `AgentHub`
4. **COPY** the key (starts with `xai-...`)

### 2.3 Stripe API Keys
1. Go to https://dashboard.stripe.com/test/apikeys
2. **Publishable key**: Copy and save (starts with `pk_test_...`)
3. **Secret key**: Click "Reveal" → Copy and save (starts with `sk_test_...`)

**For Production**: Switch to https://dashboard.stripe.com/apikeys (live mode)

---

## Step 3: Create GitHub Repository (5 minutes)

### Option A: GitHub Web Interface (Easiest)

1. Go to https://github.com/new
2. **Repository name**: `agenthub` (or your preferred name)
3. **Description**: "AI Agent Marketplace built on Vercel AI Cloud"
4. **Public** or **Private** (your choice)
5. **DO NOT** initialize with README, .gitignore, or license (we have these)
6. Click **"Create repository"**

### Option B: GitHub CLI

```bash
gh auth login
gh repo create agenthub --public --source=. --remote=origin --push
```

### Push Your Code

Open PowerShell in your project directory:

```powershell
cd "c:\Projects\WindSurf\Vercel Agents"

# Initialize git
git init
git add .
git commit -m "Initial commit: AgentHub MVP"

# Add GitHub remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/agenthub.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**Verify**: Go to `https://github.com/YOUR_USERNAME/agenthub` - you should see all files

---

## Step 4: Deploy to Vercel (10 minutes)

### 4.1 Import from GitHub

1. Go to https://vercel.com/new
2. Click **"Import Git Repository"**
3. If prompted, install Vercel GitHub App
4. Select your `agenthub` repository
5. Click **"Import"**

### 4.2 Configure Project

**Framework Preset**: Next.js (auto-detected)  
**Root Directory**: `./`  
**Build Command**: Leave default (`next build`)  
**Output Directory**: Leave default (`.next`)

### 4.3 Add Environment Variables

Click **"Environment Variables"** and add ALL of these:

#### Firebase (from Step 1.6)
```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=agenthub-production.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=agenthub-production
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=agenthub-production.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:...
```

#### Firebase Admin (from service-account.json in Step 1.7)
Open the JSON file and copy:
```
FIREBASE_ADMIN_PROJECT_ID=agenthub-production
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxxxx@agenthub-production.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
```

**Important**: For PRIVATE_KEY, include the quotes and `\n` characters!

#### OpenAI (from Step 2.1)
```
OPENAI_API_KEY=sk-proj-...
```

#### Stripe (from Step 2.3)
```
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

#### Optional: X AI
```
XAI_API_KEY=xai-...
```

#### App Configuration
```
NEXT_PUBLIC_APP_URL=https://your-app-name.vercel.app
NEXT_PUBLIC_APP_NAME=AgentHub
```

### 4.4 Deploy!

1. Click **"Deploy"**
2. Wait 2-3 minutes for build
3. ✅ Success! Your site is live at `https://your-app-name.vercel.app`

---

## Step 5: Configure Stripe Webhooks (5 minutes)

1. Go to https://dashboard.stripe.com/test/webhooks
2. Click **"Add endpoint"**
3. **Endpoint URL**: `https://your-app-name.vercel.app/api/webhooks/stripe`
4. **Listen to**: Select these events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Click **"Add endpoint"**
6. Copy the **"Signing secret"** (starts with `whsec_...`)

### Add to Vercel

1. Go to your Vercel project → **Settings** → **Environment Variables**
2. Add new variable:
   ```
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```
3. Click **"Redeploy"** to apply changes

---

## Step 6: Setup GitHub Actions (Optional - 5 minutes)

Enables auto-deployment on every push to `main`.

### 6.1 Get Vercel Token

1. Go to https://vercel.com/account/tokens
2. Click **"Create"**
3. Name: `GitHub Actions`
4. Scope: **Full Account**
5. Expiration: **No Expiration**
6. Click **"Create"**
7. **COPY** the token immediately

### 6.2 Get Vercel Project IDs

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Link project
cd "c:\Projects\WindSurf\Vercel Agents"
vercel link

# Get IDs (they'll be printed)
vercel project ls
```

Or find in Vercel dashboard: **Settings** → **General** → Project ID & Org ID

### 6.3 Add GitHub Secrets

1. Go to your GitHub repo → **Settings** → **Secrets and variables** → **Actions**
2. Click **"New repository secret"** for each:
   - `VERCEL_TOKEN`: your token from step 6.1
   - `VERCEL_ORG_ID`: from step 6.2
   - `VERCEL_PROJECT_ID`: from step 6.2

Now every push to `main` auto-deploys! ✅

---

## Step 7: Test Your Deployment (5 minutes)

### 7.1 Visit Your Site
1. Go to `https://your-app-name.vercel.app`
2. You should see the homepage with all agent cards

### 7.2 Test Authentication
1. Click **"Sign Up"**
2. Enter email and password
3. Should create account and redirect to dashboard
4. Check Firebase Console → Authentication - user should appear
5. Check Firestore → users collection - profile should exist with 100 credits

### 7.3 Test a Simple Agent (Coming in Phase 2)
This will work once we add agent execution logic in the next steps.

---

## Next Steps: Build the Agents! 🤖

Your infrastructure is ready. Now let's build the actual agents:

### Phase 2: Core Agents (Next 1-2 days)
1. **Content Wizard** - Turn notes into blog posts
2. **Code Review Pro** - Automated code analysis
3. **Support Hero** - Customer support automation

### Phase 3: Monetization (Next week)
1. Stripe checkout integration
2. Credit system implementation
3. Usage tracking
4. Subscription management

---

## 🔧 Troubleshooting

### Build Fails

**Error**: `Module not found`  
**Fix**: Check package.json dependencies, redeploy

**Error**: `Firebase initialization failed`  
**Fix**: Verify all Firebase env vars are set correctly

### Authentication Not Working

**Error**: `Firebase: Error (auth/invalid-api-key)`  
**Fix**: Double-check FIREBASE_API_KEY in Vercel

**Error**: Users can't sign up  
**Fix**: Enable Email/Password in Firebase Console

### Stripe Issues

**Error**: `Webhook signature verification failed`  
**Fix**: Verify STRIPE_WEBHOOK_SECRET matches Stripe dashboard

---

## 📊 Cost Breakdown (Monthly Estimates)

| Service | Free Tier | Expected Cost |
|---------|-----------|---------------|
| **Vercel** | 100GB bandwidth | $0 (hobby) - $20/mo (pro) |
| **Firebase** | 50K reads/day | $0-5/mo |
| **OpenAI** | Pay-per-use | $20-100/mo |
| **Stripe** | 2.9% + 30¢ | Per transaction |
| **Modal** | $500 credits | $0 (using credits) |
| **Daytona** | $20k credits | $0 (using credits) |

**Total**: ~$20-125/mo after free tiers

---

## 🎉 You're Live!

Your AI agent marketplace is now running in production!

**What you have:**
- ✅ Next.js app deployed on Vercel
- ✅ Firebase authentication and database
- ✅ Stripe payment integration ready
- ✅ GitHub CI/CD pipeline
- ✅ Modern UI with TailwindCSS
- ✅ Production-ready infrastructure

**Next**: Build your first agent and start monetizing!

---

## 💡 Pro Tips

1. **Start Simple**: Get 1 agent working perfectly before adding more
2. **Monitor Costs**: Set up billing alerts in OpenAI and Firebase
3. **Use Test Mode**: Test all payments in Stripe test mode first
4. **Version Control**: Always commit to GitHub before major changes
5. **Environment Variables**: Never commit API keys to GitHub
6. **Logging**: Use Vercel logs to debug issues in production
7. **Analytics**: Enable Vercel Analytics to track usage

---

## 📞 Support & Resources

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Firebase Docs**: https://firebase.google.com/docs
- **Vercel AI SDK**: https://sdk.vercel.ai/docs
- **Modal Docs**: https://modal.com/docs
- **Daytona Docs**: https://daytona.io/docs

---

**Ready to build something amazing? Let's ship! 🚀**
