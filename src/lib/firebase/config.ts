import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app'
import { getAuth, Auth } from 'firebase/auth'
import { getFirestore, Firestore } from 'firebase/firestore'
import { getStorage, FirebaseStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Initialize Firebase (client-side only)
function initializeFirebase() {
  if (typeof window === 'undefined') {
    // Return dummy objects for server-side
    return {
      app: null as any,
      auth: null as any,
      db: null as any,
      storage: null as any,
    }
  }

  let app: FirebaseApp
  
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig)
  } else {
    app = getApp()
  }

  return {
    app,
    auth: getAuth(app),
    db: getFirestore(app),
    storage: getStorage(app),
  }
}

const { app, auth, db, storage } = initializeFirebase()

export { app, auth, db, storage }
