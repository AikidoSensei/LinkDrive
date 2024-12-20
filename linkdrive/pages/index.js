import Image from 'next/image'
import { Geist, Geist_Mono } from 'next/font/google'
import { useRouter } from 'next/router'
import { signIn, useSession } from 'next-auth/react'
import { useContext, useEffect, useState } from 'react'
import SearchBar from '@/components/parentcomponents/SearchBar'
import FolderList from '@/components/parentcomponents/Folder/FolderList'
import { collection, doc, getDoc, getDocs, getFirestore, query, where } from 'firebase/firestore'
import { app } from '@/configuration/FirebaseConfig'
import { Skeleton } from '@/components/ui/skeleton'
import { ParentFolderContext } from '@/context/ParentFolderContext'
import { RefreshContext } from '@/context/RefreshContext'
import FileList from '@/components/parentcomponents/File/FileList'
import { Button } from '@/components/ui/button'

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
	const {data:session} = useSession()
	const router = useRouter()
	useEffect(()=>{
		if(session){
			router.push('app/')
		}
	},[session])


	return (
		<div className='w-full h-full p-4 flex text-black justify-center items-center'>
			<h1>Hello World! Welcome to linkdrive</h1>
			<Button onClick={() => signIn()}> Sign in with Google</Button>
		</div>
	)
}

