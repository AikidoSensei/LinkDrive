import Image from 'next/image'
import { Geist, Geist_Mono } from 'next/font/google'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'
import SearchBar from '@/components/parentcomponents/SearchBar'
import FolderList from '@/components/parentcomponents/Folder/FolderList'

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
})
const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
})
//


export default function MyHome() {
	const router = useRouter()
	const { data: session } = useSession()
	useEffect(() => {
		if (!session) {
			router.push('/login')
		} else {
			console.log('User Session', session.user)
		}
	})
	return (
				<div className='w-full h-full p-4'>
					<div className='h-10 w-full'><SearchBar/></div>
          <FolderList/>
				</div>
	)
}
// className={`${geistSans.variable} ${geistMono.variable} grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]`}