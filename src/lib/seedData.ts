import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from './firebase';
import { StoreSettings } from '../types';

export const INITIAL_CATEGORIES = [];
export const INITIAL_PRODUCTS = [];
export const INITIAL_BANNERS = [];
export const INITIAL_COUPONS = [];

export const INITIAL_SETTINGS: StoreSettings = {
  storeName: 'Sri Vigneshwara Mitti Idols',
  storeAddress: 'D.No. 73-1-5, MG Road, Patamata, Opp. High School Road Bus Stop, Vijayawada - 520010',
  phone: '9390538027',
  whatsappNumber: '9390538027',
  email: 'mahesh.vutukuri267@gmail.com',
  googleMapsLink: 'https://maps.google.com/?q=Patamata+MG+Road+Vijayawada',
  upiId: '',
  upiPayeeName: 'Sri Vigneshwara Mitti Idols',
  businessHours: 'Mon - Sun: 8:00 AM - 9:00 PM',
  instagramUrl: 'https://instagram.com',
  facebookUrl: 'https://facebook.com',
  youtubeUrl: 'https://youtube.com',
  twitterUrl: 'https://x.com',
  terms: 'All idols are handmade from 100% eco-friendly clay. Free delivery is guaranteed within Vijayawada city limits.',
  privacyPolicy: 'We respect customer privacy. Address and phone numbers are used exclusively for delivery coordination.',
  refundPolicy: 'If idol is damaged in transit, immediate replacement or full refund is provided upon photo proof on WhatsApp within 2 hours of delivery.',
  shippingPolicy: 'Free doorstep delivery across Vijayawada within 24-48 hours. Live GPS tracking provided.',
};

/**
 * Remove all default demo records from Firestore collections so only admin uploaded data shows.
 */
export async function clearDemoDataFromFirestore(): Promise<void> {
  try {
    const demoProductIds = [
      'prod_12_siddhivinayak',
      'prod_18_dagdusheth',
      'prod_8_seed_tree',
      'prod_15_lalbaugcha',
      'prod_24_lalbaug',
      'prod_15_pagdi',
      'prod_10_chintamani',
      'p1',
      'p2',
      'p3',
      'p4'
    ];
    const demoCatIds = ['cat_pure_clay', 'cat_seed_idols', 'cat_organic_paint', 'cat_terracotta'];
    const demoBannerIds = ['ban_1', 'ban_2', 'banner_1', 'banner_2'];
    const demoCouponIds = ['coup_GANESH10', 'coup_VIJAYAWADA', 'coupon_ganesh2026', 'coupon_vijayawada50'];
    const demoReviewIds = ['r1', 'r2', 'rev_1', 'rev_2'];

    for (const id of demoProductIds) {
      await deleteDoc(doc(db, 'products', id));
    }
    for (const id of demoCatIds) {
      await deleteDoc(doc(db, 'categories', id));
    }
    for (const id of demoBannerIds) {
      await deleteDoc(doc(db, 'banners', id));
    }
    for (const id of demoCouponIds) {
      await deleteDoc(doc(db, 'coupons', id));
    }
    for (const id of demoReviewIds) {
      await deleteDoc(doc(db, 'reviews', id));
    }
    console.log('Cleared initial demo data from Firestore.');
  } catch (error) {
    console.error('Error clearing demo data:', error);
  }
}

/**
 * Ensures store settings exist without populating demo products/categories/banners.
 */
export async function checkAndSeedInitialData(): Promise<boolean> {
  try {
    // Create store settings only once. Existing UPI details must never be overwritten.
    const settingsRef = doc(db, 'settings', 'store_settings');
    const settingsSnapshot = await getDoc(settingsRef);
    if (!settingsSnapshot.exists()) {
      await setDoc(settingsRef, INITIAL_SETTINGS);
    }
    // Clear initial demo records if they exist
    await clearDemoDataFromFirestore();
    return true;
  } catch (error) {
    console.error('Error in store setup:', error);
    return false;
  }
}
