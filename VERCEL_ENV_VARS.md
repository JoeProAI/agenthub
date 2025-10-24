# 🔐 Vercel Environment Variables

Copy and paste these into Vercel Dashboard when deploying.

**Go to**: Project Settings → Environment Variables

---

## ✅ Required Variables (9 total)

### OpenAI (1 variable)
```bash
OPENAI_API_KEY=your-openai-api-key-here
```
**Note**: Use your actual OpenAI API key starting with `sk-proj-...`

### Firebase Public Config (6 variables)
```bash
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDh0PxvaM4Sapmd6yZIb6OJtXvBJhvTiIs

NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=agenthub-47cff.firebaseapp.com

NEXT_PUBLIC_FIREBASE_PROJECT_ID=agenthub-47cff

NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=agenthub-47cff.firebasestorage.app

NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=569399107923

NEXT_PUBLIC_FIREBASE_APP_ID=1:569399107923:web:d05dec5e8e50cbf06841a6
```

### Firebase Admin SDK (3 variables)
```bash
FIREBASE_ADMIN_PROJECT_ID=agenthub-47cff

FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-fbsvc@agenthub-47cff.iam.gserviceaccount.com

FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
```
**Note**: Copy the full private key from your Firebase service account JSON file. Keep the quotes and `\n` characters.

---

## ⚙️ Optional Variables (can add later)

### Stripe (for payments)
```bash
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### X AI (alternative model)
```bash
XAI_API_KEY=xai-...
```

### Modal (for heavy compute)
```bash
MODAL_API_KEY=your-modal-key
MODAL_API_SECRET=your-modal-secret
```

---

## 📝 How to Add in Vercel

1. **During Initial Deploy**:
   - When importing from GitHub, Vercel shows "Environment Variables" section
   - Add the 9 required variables above
   - Click "Deploy"

2. **After Deploy** (to add more):
   - Go to your project dashboard
   - Click "Settings" → "Environment Variables"
   - Add new variables
   - Click "Save"
   - Redeploy for changes to take effect

---

## 🔍 Important Notes

- **NEXT_PUBLIC_** variables are exposed to the browser (safe for Firebase config)
- **Private keys** (OpenAI, Firebase Admin) are server-side only (secure)
- **Private key formatting**: Keep the `\n` characters in the Firebase private key
- All 9 required variables must be present for the app to work
- Optional variables can be added later without breaking the app

---

## ✅ Verification

After deploying, check:
- Build logs show no "Missing environment variable" errors
- App loads without console errors
- Authentication works
- Content Wizard agent can be tested

---

**Ready to deploy!** Copy these values into Vercel. 🚀
