'use client'
import dynamic from 'next/dynamic'
import DashboardLayout from '@/components/layouts/DashboardLayout'
import FileList from '@/components/parentcomponents/File/FileList'
import FolderList from '@/components/parentcomponents/Folder/FolderList'
import SearchBar from '@/components/parentcomponents/SearchBar'
import { app } from '@/configuration/FirebaseConfig'
import { ParentFolderContext } from '@/context/ParentFolderContext'
import { RefreshContext } from '@/context/RefreshContext'
import useAsync from '@/hooks/useAsync'
import {
	collection,
	getDocs,
	getFirestore,
	query,
	where,
} from 'firebase/firestore'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import React, { useContext, useEffect, useState } from 'react'
import link from '@/public/black-link.json'
import { BreadCrumbContext } from '@/context/BreadCrumbContext'
import { useSearchParams } from 'next/navigation'
import { ChevronRight } from 'lucide-react'
const Lottie = dynamic(() => import('lottie-react'), { ssr: false })


const FolderDetail = () => {
	const { data: session, status } = useSession()
	const router = useRouter()
	const { id, name } = router.query
	const searchParam = useSearchParams()
	const path = searchParam.get('name')

	const { parentFolderId, setParentFolderId } = useContext(ParentFolderContext)
	const { refreshTrigger, setRefreshTrigger } = useContext(RefreshContext)
	const {crumb, setCrumb} = useContext(BreadCrumbContext)
	useEffect(() => {
		setCrumb(path)
		if(status === 'unauthenticated'){
			router.push('/login')
		} else if (status === 'authenticated'){
		setParentFolderId(id)
		getSubFolders()
		getFolderFiles()
		console.log(folderList)
		console.log(fileList)
	}

	}, [id, session, refreshTrigger])
console.log('uniquefolder',parentFolderId)
	const [success, setSuccess] = useState(false)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)

	const [fileSuccess, setFileSuccess] = useState(false)
	const [fileLoading, setFileLoading] = useState(true)
	const [fileError, setFileError] = useState(null)

	const [folderList, setFolderList] = useState([])
	const [fileList, setFileList] = useState([])

	const getSubFolders = async () => {
		try {
			setFolderList([])
			setLoading(true)
			setError(null)
			const db = getFirestore(app)
			const q = query(
				collection(db, 'Folders'),
				where('createdBy', '==', session.user.email),
				where('parentFolderId', '==', id)
			)

			const querySnapshot = await getDocs(q)
			if (querySnapshot.empty) {
				setFolderList([])
				setLoading(false)
				setSuccess(true)
				return
			}
			querySnapshot.forEach((doc, index) => {
				// console.log(doc.id, doc.data())
				setFolderList((folderList) => [...folderList, doc.data()])
			})
			setSuccess(true)
			setLoading(false)
		} catch (error) {
			setError(error)
		}
	}

	const getFolderFiles = async () => {
		try {
			setFileList([])
			setFileLoading(true)
			setFileError(null)

			const db = getFirestore(app)
			const q = query(
				collection(db, 'Files'),
				where('createdBy', '==', session.user.email),
				where('parentFolderId', '==', id)
			)

			const querySnapshot = await getDocs(q)

			if (querySnapshot.empty) {
				// Handle a situation when no documents are returned *_*
				setFileList([])
				setFileSuccess(true)
				setFileLoading(false)
				return
			}
			const files = []
			querySnapshot.forEach((doc) => {
				files.push(doc.data())
			})

			setFileList(files) // Update state with file data
			setFileSuccess(true)
			setFileLoading(false)
		} catch (error) {
			setFileError(error) // Handle any errors
			setFileLoading(false)
		}
	}
	if (status === 'loading') {
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
		<div className='text-black p-5'>
			<FolderList
				data={folderList}
				success={success}
				error={error}
				loading={loading}
				title={name}
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
FolderDetail.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>
export default FolderDetail
