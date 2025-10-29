import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

// Initialize Firebase Admin (server-side only)
if (!getApps().length) {
  try {
    // For Vercel deployment, use environment variables
    if (process.env.FIREBASE_ADMIN_PROJECT_ID) {
      initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
          clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
      })
    } else {
      // For local development, try to use default credentials or service account
      // You can download service account JSON from Firebase Console
      initializeApp()
    }
  } catch (error) {
    console.error('Firebase Admin initialization error:', error)
    throw error
  }
}

export const adminDb = getFirestore()
