import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// Direct Firebase configuration - no environment variables for now
const firebaseConfig = {
  apiKey: "AIzaSyDvrUIhdMhl7md8SFAf9oULxHLotWzUY8E",
  authDomain: "foodieswipeapp.firebaseapp.com",
  projectId: "foodieswipeapp",
  storageBucket: "foodieswipeapp.appspot.com",
  messagingSenderId: "538210912329",
  appId: "1:538210912329:web:b543239a284ebb77861798"
};

console.log('Initializing Firebase with config:', {
  apiKey: firebaseConfig.apiKey.substring(0, 10) + '...',
  authDomain: firebaseConfig.authDomain,
  projectId: firebaseConfig.projectId
});

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with React Native persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

console.log('Firebase Auth initialized successfully');

export { auth };