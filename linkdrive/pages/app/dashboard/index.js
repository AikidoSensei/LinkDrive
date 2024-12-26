"use client"
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { Geist, Geist_Mono } from 'next/font/google'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import { useContext, useEffect, useState } from 'react'
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import SearchBar from '@/components/parentcomponents/SearchBar'
import FolderList from '@/components/parentcomponents/Folder/FolderList'
import {
	collection,
	doc,
	getDoc,
	getDocs,
	getFirestore,
	query,
	where,
} from 'firebase/firestore'
import { app } from '@/configuration/FirebaseConfig'
import { Skeleton } from '@/components/ui/skeleton'
import { ParentFolderContext } from '@/context/ParentFolderContext'
import { RefreshContext } from '@/context/RefreshContext'
import FileList from '@/components/parentcomponents/File/FileList'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import SideBarComponent from '@/components/parentcomponents/SideBarComponent'
import StorageInfo from '@/components/parentcomponents/StrorageInfo/StorageInfo'
import { Toaster } from '@/components/ui/toaster'
import UserInfo from '@/components/parentcomponents/StrorageInfo/UserInfo'
import DashboardLayout from '@/components/layouts/DashboardLayout'
import link from '@/public/black-link.json'
import { BreadCrumbContext } from '@/context/BreadCrumbContext'
import Head from 'next/head'
const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
})
const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
})
//
const Lottie = dynamic(() => import('lottie-react'), { ssr: false })

const Dashboard = () => {
	const router = useRouter()
	const [folderList, setFolderList] = useState([])
	const [fileList, setFileList] = useState([])
	const { data: session,status } = useSession()
	const { parentFolderId, setParentFolderId } = useContext(ParentFolderContext)
	const { refreshTrigger, setRefreshTrigger } = useContext(RefreshContext)
	const { crumb, setCrumb } = useContext(BreadCrumbContext)
	const db = getFirestore(app)
	const [config, setConfig] = useState({
		view: true,
		defaultFolder: true,
	})

	// useEffect to auth and also to get my folders
useEffect(() => {
setCrumb('')
	if (status === 'unauthenticated') {
		router.push('/')
	} else if (status === 'authenticated') {
		// Fetch user config and initialize state only if authenticated
		const fetchUserConfig = async () => {
			try {
				const userSettingsRef = doc(db, 'Settings', session.user.email)
				const docSnap = await getDoc(userSettingsRef)

				if (docSnap.exists()) {
					const userConfig = docSnap.data()
					setConfig({
						view: userConfig.view ?? true,
						defaultFolder: userConfig.defaultFolder ?? true,
					})
				} else {
					console.log('No user settings found, using defaults.')
				}
			} catch (error) {
				console.error('Error fetching user settings:', error)
			}
		}
		fetchUserConfig()
		setParentFolderId(0)
		getAllFolders()
		getAllFiles()
	}
}, [status, session, router, refreshTrigger])


	const [success, setSuccess] = useState(false) 
	const [loading, setLoading] = useState(true) 
	const [error, setError] = useState(null) 

	const [fileSuccess, setFileSuccess] = useState(false) 
	const [fileLoading, setFileLoading] = useState(false) 
	const [fileError, setFileError] = useState(false) 

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
			setSuccess(true) 
		} catch (error) {
			console.error(error)
			setError(error)
		} finally {
			setLoading(false) 
			setError(error)
		}
	}

	// get all files function
	const getAllFiles = async () => {
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
			setFileSuccess(true) 
			setFileError(null)
		} catch (error) {
			console.error(error)
			setFileError('An error occurred while fetching folders')
		} finally {
			setFileLoading(false) 
		}
	}
if(status === loading){
return (
	<div className='w-full col-span-2 flex justify-center items-center h-screen z-[1000] text-black'>
		<div className='w-[100px] h-[100px] bg-black rounded-3xl flex items-center justify-center'>
			<div className=' bg-white rounded-full shadow-xl p-1 w-[50px]'>
				<Lottie animationData={link} />
			</div>
		</div>
	</div>
)
}
	return (
		<div className='w-full h-full'>
<Head>
	<title>Dashboard</title>
</Head>
					
						<FolderList
							data={folderList}
							success={success}
							error={error}
							loading={loading}
							config={config}
						/>
						<FileList
							data={fileList}
							success={fileSuccess}
							error={fileError}
							loading={fileLoading}
							config={config}
						/>

		</div>
	)
}
Dashboard.getLayout = (page)=><DashboardLayout>{page}</DashboardLayout>

export default Dashboard
