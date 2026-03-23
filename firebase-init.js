import { initializeApp, getApps } from 'firebase/app';
import { getAnalytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: 'AIzaSyBl7cWiy3l95PG2hrS3EI2G-ansFSvOVCE',
  authDomain: 'better---extension.firebaseapp.com',
  projectId: 'better---extension',
  storageBucket: 'better---extension.firebasestorage.app',
  messagingSenderId: '321849336918',
  appId: '1:321849336918:web:69b24fa090caa8141047f7',
  measurementId: 'G-BRSWRWWQ82'
};

let firebaseApp = null;
let firebaseAnalytics = null;

export async function initializeFirebase() {
  try {
    firebaseApp = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

    // Analytics can be unavailable in some extension contexts.
    if (await isSupported()) {
      firebaseAnalytics = getAnalytics(firebaseApp);
    }
  } catch (error) {
    console.warn('BetterYouTube: Firebase initialization failed.', error);
  }

  return { app: firebaseApp, analytics: firebaseAnalytics };
}

