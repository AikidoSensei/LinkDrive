import Image from 'next/image'
import { Geist, Geist_Mono } from 'next/font/google'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import { useContext, useEffect, useState } from 'react'
import SearchBar from '@/components/parentcomponents/SearchBar'
import FolderList from '@/components/parentcomponents/Folder/FolderList'
import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore'
import { app } from '@/configuration/FirebaseConfig'
import { Skeleton } from '@/components/ui/skeleton'
import { ParentFolderContext } from '@/context/ParentFolderContext'
import { RefreshContext } from '@/context/RefreshContext'
import FileList from '@/components/parentcomponents/File/FileList'

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
	const [folderList, setFolderList] = useState([])
	const [fileList, setFileList] = useState([])
	const { data: session } = useSession()
	const {parentFolderId, setParentFolderId} = useContext(ParentFolderContext)
		const { refreshTrigger, setRefreshTrigger } = useContext(RefreshContext)

	// useEffect to auth and also to get my folders
	useEffect(() => {
		if (!session) {
			router.push('/login')
		} else {
			console.log('User Session', session.user)
			setParentFolderId(0)
			getAllFolders()
			getAllFiles()
		}
	}, [session,refreshTrigger])


	const [success, setSuccess] = useState(false) // Success state (data)
	const [loading, setLoading] = useState(true) // Loading state
	const [error, setError] = useState(null) // Error state
	
	const [fileSuccess, setFileSuccess] = useState(false) // Success state (data)
	const [fileLoading, setFileLoading] = useState(false) // Loading state
	const [fileError, setFileError] = useState(false) // Error state
	// get all folders function
	const getAllFolders = async () => {
		try {
			setFolderList([])
			setLoading(true)
			setError(null)
			setSuccess(false)
			const db = getFirestore(app)
			const q = query(
				collection(db, 'Folders'),
				where('createdBy', '==', session.user.email)
			)

			const querySnapshot = await getDocs(q)

			if (querySnapshot.empty) {
				setFolderList([])
				setLoading(false)
				setSuccess(true)
				return
			}

			const folders = []
			querySnapshot.forEach((doc) => {
				folders.push(doc.data())
			})

			setFolderList(folders)
			setSuccess(true) // Data successfully fetched
		} catch (error) {
			console.error(error)
			setError(error)
		} finally {
			setLoading(false) // Ensure loading is stopped
			setError(error)
		}
	}
// get all files function
	const getAllFiles = async  ()=>{
				try {
			setFileList([])
			setFileLoading(true)
			setFileError(null)
			setFileSuccess(false)

			const db = getFirestore(app)
			const q = query(
				collection(db, 'Files'),
				where('createdBy', '==', session.user.email)
			)

			const querySnapshot = await getDocs(q)
			if (querySnapshot.empty) {
				
			 setFileList([]) 
				setFileSuccess(true)
				setFileLoading(false)
				return
			}

			const files = []
			querySnapshot.forEach((doc) => {
				files.push(doc.data())
			})

			setFileList(files)
			setFileSuccess(true) // Data successfully fetched
			setFileError(null)
		} catch (error) {
			console.error(error)
			setFileError('An error occurred while fetching folders')
		} finally {
			setFileLoading(false) // Ensure loading is stopped
		}
	}
	return (
		<div className='w-full h-full p-4 '>
			<div className='h-max w-full'>
				<SearchBar />
			</div>
			<FolderList
				data={folderList}
				success={success}
				error={error}
				loading={loading}
			/>
			<FileList
				data={fileList}
				success={fileSuccess}
				error={fileError}
				loading={fileLoading}
			/>
		</div>
	)
}

