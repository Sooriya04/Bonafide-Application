require('dotenv').config();
const { initializeApp } = require('firebase-admin/app');
const { getAuth, GoogleAuthProvider } = require('firebase/auth');

const firebaseConfig = {
  apiKey: process.env.apiKey,
  authDomain: process.env.authDomain,
  projectId: process.env.projectId,
  storageBucket: process.env.storageBucket,
  messagingSenderId: process.env.messagingSenderId,
  appId: process.env.appId,
  measurementId: process.env.measurementId,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const GoogleProvider = new GoogleAuthProvider();

console.log('Client SDK Project ID:', firebaseConfig.projectId);

module.exports = { auth, GoogleProvider };
