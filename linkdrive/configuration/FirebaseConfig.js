// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: process.env.FIREBASE_API_KEY,
	authDomain: 'linkdrive-42842.firebaseapp.com',
	projectId: 'linkdrive-42842',
	storageBucket: 'linkdrive-42842.firebasestorage.app',
	messagingSenderId: '529092575657',
	appId: '1:529092575657:web:fa39e21ae7cb545f94c4b8',
	measurementId: 'G-WKHFZXMDCQ',
}

// Initialize Firebase
export const app = initializeApp(firebaseConfig)
// const analytics = getAnalytics(app)

