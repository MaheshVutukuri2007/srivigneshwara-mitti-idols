import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import {
  auth,
  db,
  isUserAdmin,
  signInWithPopup,
  googleProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
} from '../lib/firebase';
import { Customer } from '../types';

interface AuthContextType {
  user: User | null;
  customerProfile: Customer | null;
  isAdmin: boolean;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (e: string, p: string) => Promise<void>;
  signupWithEmail: (e: string, p: string, name: string, phone: string) => Promise<void>;
  logoutUser: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateCustomerAddresses: (addresses: Customer['addresses']) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [customerProfile, setCustomerProfile] = useState<Customer | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const isAdmin = isUserAdmin(user?.email);

  const loadProfile = async (currentUser: User) => {
    try {
      const ref = doc(db, 'customers', currentUser.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setCustomerProfile(snap.data() as Customer);
      } else {
        // Create initial customer doc
        const newProfile: Customer = {
          id: currentUser.uid,
          name: currentUser.displayName || currentUser.email?.split('@')[0] || 'Customer',
          email: currentUser.email || '',
          phone: currentUser.phoneNumber || '',
          addresses: [],
          totalOrders: 0,
          totalSpent: 0,
          isBlocked: false,
          joinedDate: new Date().toISOString(),
        };
        await setDoc(ref, newProfile);
        setCustomerProfile(newProfile);
      }
    } catch (err) {
      console.error('Error loading customer profile:', err);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await loadProfile(currentUser);
      } else {
        setCustomerProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    const res = await signInWithPopup(auth, googleProvider);
    if (res.user) {
      await loadProfile(res.user);
    }
  };

  const loginWithEmail = async (email: string, pass: string) => {
    const res = await signInWithEmailAndPassword(auth, email, pass);
    if (res.user) {
      await loadProfile(res.user);
    }
  };

  const signupWithEmail = async (email: string, pass: string, name: string, phone: string) => {
    const res = await createUserWithEmailAndPassword(auth, email, pass);
    if (res.user) {
      const newProfile: Customer = {
        id: res.user.uid,
        name,
        email,
        phone,
        addresses: [],
        totalOrders: 0,
        totalSpent: 0,
        isBlocked: false,
        joinedDate: new Date().toISOString(),
      };
      await setDoc(doc(db, 'customers', res.user.uid), newProfile);
      setCustomerProfile(newProfile);
    }
  };

  const logoutUser = async () => {
    await signOut(auth);
    setUser(null);
    setCustomerProfile(null);
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const updateCustomerAddresses = async (addresses: Customer['addresses']) => {
    if (!user) return;
    const ref = doc(db, 'customers', user.uid);
    await setDoc(ref, { addresses }, { merge: true });
    setCustomerProfile((prev) => (prev ? { ...prev, addresses } : prev));
  };

  const refreshProfile = async () => {
    if (user) {
      await loadProfile(user);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        customerProfile,
        isAdmin,
        loading,
        loginWithGoogle,
        loginWithEmail,
        signupWithEmail,
        logoutUser,
        resetPassword,
        updateCustomerAddresses,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
