import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import firebaseConfigData from '../../firebase-applet-config.json';

const firebaseConfig = {
  apiKey: firebaseConfigData.apiKey,
  authDomain: firebaseConfigData.authDomain,
  projectId: firebaseConfigData.projectId,
  storageBucket: firebaseConfigData.storageBucket,
  messagingSenderId: firebaseConfigData.messagingSenderId,
  appId: firebaseConfigData.appId,
};

// Initialize Firebase App
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firebase Auth
export const auth = getAuth(app);

// Initialize Firestore with specific databaseId if provided
export const db = firebaseConfigData.firestoreDatabaseId
  ? getFirestore(app, firebaseConfigData.firestoreDatabaseId)
  : getFirestore(app);

// Initialize Firebase Storage
export const storage = getStorage(app);

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();

// Admin Email List matching system requirements
export const ADMIN_EMAILS = [
  'mahesh.vutukuri267@gmail.com',
  'mahesh.vutukuri2647@gmail.com',
];

export const isUserAdmin = (email?: string | null): boolean => {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase().trim());
};

export {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  firebaseSignOut as signOut,
  sendPasswordResetEmail,
};
