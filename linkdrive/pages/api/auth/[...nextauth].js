import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { app } from '@/configuration/FirebaseConfig'
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore'

export const authOptions = {
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
		}),
	],
	secret: process.env.NEXTAUTH_SECRET,
	pages: { signIn: '/login' },
	callbacks: {
		async signIn({ user }) {
			const db = getFirestore(app)

			try {
				// Reference the user document in Firestore
				const userRef = doc(db, 'Users', user.email)
				const docSnap = await getDoc(userRef)

				if (!docSnap.exists()) {
					// If user doesn't exist, create the document
					await setDoc(userRef, {
						email: user.email,
						name: user.name || '',
						image: user.image || '',
						createdAt: new Date().toISOString(),
						storageUsed: 0, // Start with 0 storage usage
						storageLimit: 50 * 1000 * 1000, // 50MB in bytes
					})
				}

				return true
			} catch (error) {
				console.error('Error storing user in Firestore:', error)
				return false // Reject sign-in on Firestore error
			}
		},
		async session({ session, token }) {
			// Add custom data to session if needed
			session.user.id = token.id
			return session
		},
	},
}

export default NextAuth(authOptions)
