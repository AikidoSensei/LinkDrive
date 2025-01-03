'use client'
import React, { useContext, useEffect, useState } from 'react'
import {
	collection,
	deleteDoc,
	doc,
	getDoc,
	getDocs,
	getFirestore,
	increment,
	query,
	updateDoc,
	where,
	writeBatch,
} from 'firebase/firestore'
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { app } from '@/configuration/FirebaseConfig'
import { useSession } from 'next-auth/react'
import { toast } from '@/hooks/use-toast'
import { RefreshContext } from '@/context/RefreshContext'
import { Button } from '@/components/ui/button'
import StorageDetails from '@/components/parentcomponents/StrorageInfo/StorageDetails'
import DashboardLayout from '@/components/layouts/DashboardLayout'
import { Loader2, TrashIcon } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { ToastAction } from '@/components/ui/toast'
import { createClient } from '@supabase/supabase-js'
import { useRouter } from 'next/router'
import Head from 'next/head'
const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL,
	process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)
const Storage = () => {
	const { data: session } = useSession()
	const router = useRouter()
	const { refreshTrigger, setRefreshTrigger } = useContext(RefreshContext)
	const [clear, setClear] = useState('')
	const [loading, setLoading] = useState(false)

	const [used, setUsed] = useState(0)
	const [sizes, setSizes] = useState({
		documents: 0,
		images: 0,
		audio: 0,
		others: 0,
	})

	const [numberOfFiles, setNumberOfFiles] = useState({
		documents: 0,
		images: 0,
		audio: 0,
		others: 0,
	})

	useEffect(() => {
		if (session) {
			getUserFiles()
			getUserStorageInfo(session.user.email)
		}
		else{
			router.push('/login')
		}
	}, [session, refreshTrigger])
	
	const getUserFiles = async () => {
		setLoading(true)
		const db = getFirestore(app)
		const q = query(
			collection(db, 'Files'),
			where('createdBy', '==', session.user.email)
		)

		try {
			const querySnapshot = await getDocs(q)

			if (querySnapshot.empty) {
				toast({
					variant: 'message',
					title: 'You are yet to upload a file',
				})
				setLoading(false)
				return
			}

			let totalUsed = 0
			const fileSizes = {
				documents: 0,
				images: 0,
				audio: 0,
				others: 0,
			}

			const fileCounts = {
				documents: 0,
				images: 0,
				audio: 0,
				others: 0,
			}

			querySnapshot.forEach((doc) => {
				const fileData = doc.data()
				const fileSize = Number(fileData['size'] || 0)
				const fileType = fileData['type']?.toLowerCase() || ''

				totalUsed += fileSize

				// Categorize file sizes and counts
				if (
					['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'].includes(fileType)
				) {
					fileSizes.images += fileSize
					fileCounts.images += 1
				} else if (
					['pdf', 'docx', 'doc', 'txt', 'ppt', 'pptx', 'xlsx', 'csv'].includes(
						fileType
					)
				) {
					fileSizes.documents += fileSize
					fileCounts.documents += 1
				} else if (
					['mp3', 'wav', 'm4a', 'ogg', 'flac', 'aac'].includes(fileType)
				) {
					fileSizes.audio += fileSize
					fileCounts.audio += 1
				} else {
					fileSizes.others += fileSize
					fileCounts.others += 1
				}
			})

			// Update states
			setUsed(totalUsed)
			setSizes(fileSizes)
			setNumberOfFiles(fileCounts)
			setLoading(false)
			// console.log('File Sizes: ', fileSizes)
			// console.log('File Counts: ', fileCounts)
			// console.log('Total Used: ', totalUsed)
		} catch (error) {
			console.error('Error fetching user files: ', error.message)
			toast({
				variant: 'destructive',
				title: 'Error fetching files',
				description: error.message,
			})
			setLoading(false)
		}
	}
	const getUserStorageInfo = async (userEmail) => {
		const db = getFirestore(app)

		try {
			const userRef = doc(db, 'Users', userEmail)
			const userDoc = await getDoc(userRef)

			if (userDoc.exists()) {
				const { storageUsed, storageLimit } = userDoc.data()
				setUsed({
					storageUsed: storageUsed || 0,
					storageLimit: storageLimit || 50 * 1000 * 1000,
				})
			} else {
				console.warn('User document does not exist.')
				return { storageUsed: 0, storageLimit: 50 * 1024 * 1024 }
			}
		} catch (error) {
			console.error('Error fetching user storage info:', error)
			throw new Error('Unable to fetch storage info.')
		}
	}
const handleClearStorage = async () => {
	if (clear !== 'Clear') {
		toast({
			variant: 'destructive',
			title: 'Failed to clear storage',
			description: 'Please input "Clear" to clear storage.',
		})
		setClear('')
		return
	}

	const db = getFirestore(app)
	setClear('')

	try {
		toast({
			variant: 'message',
			title: 'Clearing storage',
			description: 'Just a moment...',
			action: (
				<ToastAction altText='deleting' className='outline-none border-none'>
					<Loader2 className='animate-spin' />
				</ToastAction>
			),
		})

		let totalSize = 0 

		// Step 1: Query all files created by the user
		const filesQuery = query(
			collection(db, 'Files'),
			where('createdBy', '==', session.user.email)
		)
		const filesSnapshot = await getDocs(filesQuery)

		// Collect file paths and IDs
		const filesToDelete = filesSnapshot.docs.map((fileDoc) => ({
			id: fileDoc.id,
			name: fileDoc.data().name,
			size: fileDoc.data().size || 0,
		}))

		// Delete files from Supabase storage
		const supabaseResults = await Promise.all(
			filesToDelete.map(async (file) => {
				try {
					const { error } = await supabase.storage
						.from('linkdrive-storage')
						.remove([`files/${file.name}`])
					if (error) throw error
					return { success: true }
				} catch (err) {
					console.error(`Supabase deletion failed for ${file.name}:`, err)
					return { success: false, file }
				}
			})
		)

		// Filter out failed deletions
		const failedDeletions = supabaseResults.filter((res) => !res.success)

		if (failedDeletions.length > 0) {
			toast({
				variant: 'destructive',
				title: 'Failed to clear storage',
				description: `Some files could not be deleted from Supabase: ${failedDeletions
					.map((res) => res.file.name)
					.join(', ')}`,
			})
			return
		}

		totalSize = filesToDelete.reduce((acc, file) => acc + file.size, 0)
		const batch = writeBatch(db)

		filesSnapshot.docs.forEach((fileDoc) => {
			batch.delete(doc(db, 'Files', fileDoc.id))
		})

		await batch.commit()

		// Step 2: Delete folders in Firestore
		const folderQuery = query(
			collection(db, 'Folders'),
			where('createdBy', '==', session.user.email)
		)
		const foldersSnapshot = await getDocs(folderQuery)

		const folderBatch = writeBatch(db)
		foldersSnapshot.docs.forEach((folderDoc) => {
			folderBatch.delete(doc(db, 'Folders', folderDoc.id))
		})

		await folderBatch.commit()

		// Step 3: Update storageUsed in Users document
		const userDocRef = doc(db, 'Users', session.user.email)
		await updateDoc(userDocRef, {
			storageUsed: increment(-totalSize),
		})

		// Final success toast
		toast({
			variant: 'default',
			title: 'Storage cleared successfully',
			description:
				'All files and folders have been deleted, and storage updated.',
		})

		// Reset UI state
		setNumberOfFiles({
			documents: 0,
			images: 0,
			audio: 0,
			others: 0,
		})
		setSizes({
			documents: 0,
			images: 0,
			audio: 0,
			others: 0,
		})
		setRefreshTrigger(!refreshTrigger)
	} catch (error) {
		console.error('Error clearing storage:', error)
		toast({
			variant: 'destructive',
			title: 'Error',
			description: error.message,
			action: (
				<ToastAction altText='Try again' onClick={handleClearStorage}>
					Try again
				</ToastAction>
			),
		})
	}
}



	return (
		<div className='flex flex-col gap-4 pb-8 max-h-full'>
			<Head>
				<title>Storage</title>
			</Head>

			<div className='border-b p-4'>
				<p className='text-xs lg:text-xl font-bold text-black mt-6'>
					Memory Usage
				</p>
			</div>

			<StorageDetails
				used={used?.storageUsed}
				limit={used?.storageLimit}
				eachSize={sizes}
				files={numberOfFiles}
				loading={loading}
			/>
			<div className='flex justify-between items-center py-1 px-4 ml-4 mr-4 rounded-xl border text-black'>
				<p>Upgrade to standard</p>
				<Button className=' h-10 text-white bg-green-600'>Upgrade</Button>
			</div>
			<div className='flex justify-between items-center p-4 ml-4 mr-4 rounded-xl border text-black'>
				<p>Clear My Storage</p>

				<AlertDialog>
					<AlertDialogTrigger asChild>
						<Button variant='destructive'>Clear Storage</Button>
					</AlertDialogTrigger>
					<AlertDialogContent
						className='bg-white '
						onClick={(e) => e.stopPropagation()}
					>
						<AlertDialogHeader className='bg-red-300/15 rounded-xl p-4'>
							<AlertDialogTitle className='text-black/70'>
								Are you sure?
							</AlertDialogTitle>
							<AlertDialogDescription>
								Please confirm you want to clear your storage by typing "Clear"
							</AlertDialogDescription>
						</AlertDialogHeader>

						<Input
							placeholder='Clear'
							variant='destructive'
							className='border-2 border-red-500 outline-none text-red-500 '
							value={clear}
							onChange={(e) => setClear(e.target.value)}
						/>
						<AlertDialogFooter>
							<AlertDialogCancel className='bg-black text-white outline-none hover:outline-none hover:bg-black hover:text-white'>
								Cancel
							</AlertDialogCancel>
							<AlertDialogAction
								className='bg-red-500 text-white'
								onClick={() => handleClearStorage()}
							>
								<TrashIcon />
								Clear Storage
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			</div>
		</div>
	)
}
Storage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>
export default Storage
