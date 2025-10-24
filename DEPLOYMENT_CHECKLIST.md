# ✅ AgentHub Deployment Checklist

Copy this checklist and check off items as you complete them.

---

## 🎯 Phase 1: GitHub Setup (5 minutes)

- [ ] Create new GitHub repository at https://github.com/new
  - Name: `agenthub` (or your preferred name)
  - Visibility: Public or Private
  - **Do not** initialize with README

- [ ] Push code to GitHub:
```powershell
cd "c:\Projects\WindSurf\Vercel Agents"
git init
git add .
git commit -m "Initial commit: AgentHub MVP"
git remote add origin https://github.com/YOUR_USERNAME/agenthub.git
git branch -M main
git push -u origin main
```

- [ ] Verify all files are on GitHub
- [ ] Repository URL: `_______________________________`

---

## 🔥 Phase 2: Firebase Setup (10 minutes)

### Create Project
- [ ] Go to https://console.firebase.google.com/
- [ ] Click "Add project"
- [ ] Project name: `agenthub-production`
- [ ] Enable Google Analytics (optional)
- [ ] Click "Create project"

### Enable Authentication
- [ ] Go to Authentication → Get Started
- [ ] Enable **Email/Password** provider
- [ ] Enable **Google** provider
  - Public name: "AgentHub"
  - Support email: `_______________________________`

### Create Firestore Database
- [ ] Go to Firestore Database → Create database
- [ ] Mode: **Production mode**
- [ ] Location: `us-east1` (or your region)
- [ ] Click "Enable"

### Set Security Rules
- [ ] Click "Rules" tab
- [ ] Paste rules from `DEPLOYMENT_GUIDE.md` Step 1.4
- [ ] Click "Publish"

### Enable Storage
- [ ] Go to Storage → Get started
- [ ] Mode: **Production mode**
- [ ] Same location as Firestore
- [ ] Click "Done"

### Get Firebase Config
- [ ] Go to Project Settings (gear icon)
- [ ] Scroll to "Your apps" → Click web icon `</>`
- [ ] App nickname: `AgentHub Web`
- [ ] **Copy** the firebaseConfig values:

```javascript
NEXT_PUBLIC_FIREBASE_API_KEY=_______________________________
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=_______________________________
NEXT_PUBLIC_FIREBASE_PROJECT_ID=_______________________________
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=_______________________________
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=_______________________________
NEXT_PUBLIC_FIREBASE_APP_ID=_______________________________
```

### Get Service Account
- [ ] Project Settings → Service Accounts tab
- [ ] Click "Generate new private key"
- [ ] Download JSON file (save securely!)
- [ ] Extract these values:

```
FIREBASE_ADMIN_PROJECT_ID=_______________________________
FIREBASE_ADMIN_CLIENT_EMAIL=_______________________________
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

---

## 🔑 Phase 3: Get API Keys (10 minutes)

### OpenAI (Required)
- [ ] Go to https://platform.openai.com/api-keys
- [ ] Click "Create new secret key"
- [ ] Name: `AgentHub Production`
- [ ] Copy key:
```
OPENAI_API_KEY=_______________________________
```
- [ ] Add credits to account ($10-20 recommended)

### Stripe (Required)
- [ ] Go to https://dashboard.stripe.com/test/apikeys
- [ ] Copy **Publishable key**:
```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=_______________________________
```
- [ ] Reveal and copy **Secret key**:
```
STRIPE_SECRET_KEY=_______________________________
```

### X AI (Optional)
- [ ] Go to https://console.x.ai/
- [ ] Create API key: `AgentHub`
- [ ] Copy key:
```
XAI_API_KEY=_______________________________
```

---

## 🚀 Phase 4: Deploy to Vercel (15 minutes)

### Import Project
- [ ] Go to https://vercel.com/new
- [ ] Click "Import Git Repository"
- [ ] Authorize Vercel GitHub App if prompted
- [ ] Select your `agenthub` repository
- [ ] Click "Import"

### Configure Build
- [ ] Framework: **Next.js** (auto-detected)
- [ ] Root Directory: `./`
- [ ] Leave other settings as default

### Add Environment Variables
Click "Environment Variables" and add ALL of these:

#### Firebase Public (6 variables)
- [ ] `NEXT_PUBLIC_FIREBASE_API_KEY`
- [ ] `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- [ ] `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- [ ] `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- [ ] `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- [ ] `NEXT_PUBLIC_FIREBASE_APP_ID`

#### Firebase Admin (3 variables)
- [ ] `FIREBASE_ADMIN_PROJECT_ID`
- [ ] `FIREBASE_ADMIN_CLIENT_EMAIL`
- [ ] `FIREBASE_ADMIN_PRIVATE_KEY` (include quotes and \n!)

#### OpenAI (1 variable)
- [ ] `OPENAI_API_KEY`

#### Stripe (2 variables)
- [ ] `STRIPE_SECRET_KEY`
- [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

#### App Config (2 variables)
- [ ] `NEXT_PUBLIC_APP_URL` = https://your-project-name.vercel.app
- [ ] `NEXT_PUBLIC_APP_NAME` = AgentHub

#### Optional
- [ ] `XAI_API_KEY` (if using X AI)

### Deploy!
- [ ] Click **"Deploy"**
- [ ] Wait 2-3 minutes for build
- [ ] ✅ Deployment successful!
- [ ] Copy your URL: `_______________________________`

---

## 🔔 Phase 5: Stripe Webhooks (5 minutes)

- [ ] Go to https://dashboard.stripe.com/test/webhooks
- [ ] Click "Add endpoint"
- [ ] Endpoint URL: `https://YOUR-APP.vercel.app/api/webhooks/stripe`
- [ ] Select events:
  - [ ] `checkout.session.completed`
  - [ ] `customer.subscription.created`
  - [ ] `customer.subscription.updated`
  - [ ] `customer.subscription.deleted`
  - [ ] `invoice.payment_succeeded`
  - [ ] `invoice.payment_failed`
- [ ] Click "Add endpoint"
- [ ] Copy **Signing secret** (starts with `whsec_...`)

### Add to Vercel
- [ ] Go to Vercel project → Settings → Environment Variables
- [ ] Add: `STRIPE_WEBHOOK_SECRET` = `_______________________________`
- [ ] Click "Redeploy" to apply

---

## 🧪 Phase 6: Test Everything (10 minutes)

### Test Homepage
- [ ] Visit your Vercel URL
- [ ] Homepage loads correctly
- [ ] Navigation works
- [ ] Agent cards display

### Test Sign Up
- [ ] Click "Sign Up"
- [ ] Enter test email and password
- [ ] Account created successfully
- [ ] Redirected to dashboard

### Verify Firebase
- [ ] Check Firebase Console → Authentication
- [ ] New user appears in users list
- [ ] Check Firestore → users collection
- [ ] User document exists with 100 credits

### Test Content Wizard
- [ ] Find Content Wizard in agent list
- [ ] Enter some test content
- [ ] Select format (e.g., "blog")
- [ ] Click "Generate"
- [ ] Content generates successfully
- [ ] Credits deducted (should show 99)

### Check Logs
- [ ] Go to Vercel → Your Project → Logs
- [ ] Check for any errors
- [ ] Verify API calls succeeded

---

## 📋 Phase 7: GitHub Actions (Optional - 5 minutes)

### Get Vercel Tokens
- [ ] Go to https://vercel.com/account/tokens
- [ ] Create token: `GitHub Actions`
- [ ] Scope: Full Account
- [ ] Copy token: `_______________________________`

### Get Project IDs
- [ ] Install Vercel CLI: `npm install -g vercel`
- [ ] Login: `vercel login`
- [ ] Link: `vercel link`
- [ ] Get IDs: `vercel project ls`
- [ ] Org ID: `_______________________________`
- [ ] Project ID: `_______________________________`

### Add GitHub Secrets
- [ ] Go to GitHub repo → Settings → Secrets and variables → Actions
- [ ] Add `VERCEL_TOKEN`
- [ ] Add `VERCEL_ORG_ID`
- [ ] Add `VERCEL_PROJECT_ID`

### Test Auto-Deploy
- [ ] Make a small change to README.md
- [ ] Commit and push to main
- [ ] Check GitHub Actions tab
- [ ] Deployment should trigger automatically

---

## 🎯 Phase 8: Production Checklist (Before Launch)

### Security
- [ ] Enable 2FA on Firebase account
- [ ] Enable 2FA on Vercel account
- [ ] Enable 2FA on GitHub account
- [ ] Enable 2FA on Stripe account
- [ ] Review Firestore security rules
- [ ] Switch to Stripe live mode keys

### Monitoring
- [ ] Set up Vercel Analytics
- [ ] Enable Firebase Analytics
- [ ] Set up error tracking (Sentry recommended)
- [ ] Configure uptime monitoring

### Billing
- [ ] Set billing alerts in OpenAI ($10, $50, $100)
- [ ] Set billing alerts in Firebase
- [ ] Set billing alerts in Vercel
- [ ] Review Stripe pricing and fees

### Content
- [ ] Update homepage with real content
- [ ] Add Terms of Service page
- [ ] Add Privacy Policy page
- [ ] Add FAQ or Help page
- [ ] Customize email templates

### SEO
- [ ] Add proper meta tags
- [ ] Create sitemap
- [ ] Set up Google Search Console
- [ ] Add Open Graph tags
- [ ] Test social sharing

---

## 🎉 Success Checklist

- [ ] ✅ Code on GitHub
- [ ] ✅ Firebase project configured
- [ ] ✅ App deployed to Vercel
- [ ] ✅ Authentication working
- [ ] ✅ Database saving data
- [ ] ✅ First agent working
- [ ] ✅ Credits system working
- [ ] ✅ Stripe webhooks configured
- [ ] ✅ No errors in logs

---

## 📞 Troubleshooting Quick Reference

### Build fails on Vercel
1. Check build logs for specific error
2. Verify all environment variables are set
3. Check for typos in .env variable names
4. Redeploy after fixing

### Firebase authentication fails
1. Verify Firebase config is correct
2. Check that Auth providers are enabled
3. Clear browser cache and try again
4. Check Vercel logs for detailed error

### Agent execution fails
1. Verify OpenAI API key has credits
2. Check user has sufficient credits in Firestore
3. Look at Vercel function logs
4. Test OpenAI API key directly

### Need Help?
- Vercel Discord: https://vercel.com/discord
- Next.js Docs: https://nextjs.org/docs
- Firebase Support: https://firebase.google.com/support

---

## 🚀 You're Live!

Once all items are checked, your AI Agent Marketplace is production-ready!

**Next Steps:**
1. Share with beta users
2. Collect feedback
3. Build additional agents
4. Add marketplace features
5. Scale to production!

**Congratulations! 🎉**
