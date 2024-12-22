'use client'
import dynamic from 'next/dynamic'
import React, { useState, useEffect, useContext } from 'react'
import { getFirestore, collection, getDocs, query, where, deleteDoc, doc, updateDoc, increment } from 'firebase/firestore'
import { app } from '@/configuration/FirebaseConfig'
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
import { LayoutGrid, List, Loader2, RotateCcw, Trash2, TrashIcon } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import ToolTip from '@/components/parentcomponents/ToolTip'
import DetailBar from '@/components/parentcomponents/DetailBar'
import GifNew from '@/components/parentcomponents/GifNew'
import FileItem from '@/components/parentcomponents/File/FileItem'
import { RefreshContext } from '@/context/RefreshContext'
import { useSession } from 'next-auth/react'
import { toast } from '@/hooks/use-toast'
import { ToastAction } from '@/components/ui/toast'
import DashboardLayout from '@/components/layouts/DashboardLayout'
import { useRouter } from 'next/router'
import link from '@/public/black-link.json'
import { BreadCrumbContext } from '@/context/BreadCrumbContext'
import { createClient } from '@supabase/supabase-js'
const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL,
	process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)
const Lottie = dynamic(() => import('lottie-react'), { ssr: false })
const Trash = () => {
	const db = getFirestore(app)
	const { data: session, status } = useSession()

	const router = useRouter()
	const [loading, setLoading] = useState(false)
	const [data, setData] = useState([])
	const [success, setSuccess] = useState(false)
	const [error, setError] = useState(false)
	const { refreshTrigger, setRefreshTrigger } = useContext(RefreshContext)
	const {crumb, setCrumb} = useContext(BreadCrumbContext)
	const [view, setView] = useState('list')
	
	useEffect(() => {
		setCrumb('Trash')
		if(status==='unauthenticated'){
			router.push('/login')
		}
		else if (status === 'authenticated'){
			const fetchTrashFiles = async () => {
				setLoading(true)
				setError(false)
				setSuccess(false)
	
				try {
					const querySnapshot = await getDocs(collection(db, 'Files'))
					const trashFiles = []
	
					querySnapshot.forEach((doc) => {
						const file = doc.data()
						if (file.trash === true) {
							trashFiles.push({ id: doc.id, ...file })
						}
					})
	
					setData(trashFiles)
					setSuccess(true)
				} catch (err) {
					console.error('Error fetching trashed files:', err)
					setError(true)
				} finally {
					setLoading(false)
				}
			}
			fetchTrashFiles()
		}
	}, [session, refreshTrigger])

	const handleClearTrash = async () => {
		try {
			toast({
				title: 'Deleting Files',
				description: 'Please wait while trash files are being deleted...',
				variant: 'message',
				action: (
					<ToastAction altText='deleting' className='outline-none border-none'>
						<Loader2 className='animate-spin' />
					</ToastAction>
				),
			})

			// Query for trash files in Firebase
			const trashFilesQuery = query(
				collection(db, 'Files'),
				where('trash', '==', true),
				where('createdBy', '==', session.user.email)
			)

			const querySnapshot = await getDocs(trashFilesQuery)

			if (querySnapshot.empty) {
				toast({
					title: 'No Trash Files',
					description: 'There are no files in the trash to delete.',
					variant: 'default',
				})
				return
			}

			const filesToDelete = []
			let totalSize = 0

			const deletePromises = querySnapshot.docs.map((fileDoc) => {
				const fileData = fileDoc.data()
				filesToDelete.push(fileData.name)
				totalSize += fileData.size || 0
				return deleteDoc(doc(db, 'Files', fileDoc.id))
			})

			await Promise.all(deletePromises)

			const supabaseDeletePromises = filesToDelete.map((fileName) =>
				supabase.storage.from('linkdrive-storage').remove([`files/${fileName}`])
			)

			const supabaseResults = await Promise.all(supabaseDeletePromises)

			const supabaseErrors = supabaseResults.filter((res) => res.error)
			if (supabaseErrors.length > 0) {
				console.error('Supabase deletion errors:', supabaseErrors)
				toast({
					title: 'Partial Success',
					description: 'Some files could not be deleted from Supabase.',
					variant: 'destructive',
				})
			} else {
				// Update storageUsed in Firebase
				const userDocRef = doc(db, 'Users', session.user.email) // Assuming user email as doc ID
				await updateDoc(userDocRef, {
					storageUsed: increment(-totalSize), // Deduct the total size
				})

				toast({
					title: 'Success',
					description:
						'All trash files have been successfully deleted, and storage has been updated.',
					variant: 'default',
				})
				setRefreshTrigger(!refreshTrigger)
			}
		} catch (error) {
			console.error('Error deleting trash files:', error)
			toast({
				title: 'Error',
				description: 'Failed to delete trash files. Please try again.',
				variant: 'destructive',
			})
		}
	}

const handleRestoreTrash = async () => {
	if (!session) {
		toast({
			title: 'Error',
			description: 'User not logged in.',
			variant: 'destructive',
		})
		return
	}

	toast({
		variant: 'message',
		title: 'Restoring your files',
		description: 'Just a moment',
		action: (
			<ToastAction altText='deleting' className='outline-none border-none'>
				<Loader2 className='animate-spin' />
			</ToastAction>
		),
	})
	const trashQuery = query(
		collection(db, 'Files'),
		where('trash', '==', true),
		where('createdBy', '==', session.user.email) // Filter by user email
	)

	try {
		const querySnapshot = await getDocs(trashQuery)

		if (querySnapshot.empty) {
			toast({
				title: 'No Trash',
				description: 'There are no files in trash.',
				variant: 'default',
			})
			return
		}

		const updatePromises = querySnapshot.docs.map((file) =>
			updateDoc(doc(db, 'Files', file.id), {
				trash: false,
			})
		)

		await Promise.all(updatePromises)

		toast({
			title: 'Success',
			description: 'All files have been restored from trash.',
			variant: 'default',
		})
	} catch (error) {
		console.error('Error clearing trash:', error)
		toast({
			title: 'Error',
			description: 'Could not restore files. Try again later.',
			variant: 'destructive',
		})
	} finally {
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
	<div className='p-2 lg:p-5 mt-5 bg-white flex flex-col gap-0 min-h-[320px] h-full'>
		<div className='flex justify-between items-center'>
			<p className='text-xs lg:text-xl font-bold text-black'>{'Trash'}</p>
			<div className='flex items-center gap-4 text-black'>
				<div
					className={`p-1 lg:p-2 rounded-full hover:bg-green-500 hover:text-white cursor-pointer  `}
					onClick={() => handleRestoreTrash()}
				>
					<ToolTip
						text={'Restore Trash'}
						item={
							<RotateCcw
								className='w-4 h-4 lg:w-full'
								strokeWidth={1}
								size={13}
							/>
						}
						view={view}
					/>
				</div>

				<AlertDialog>
					<AlertDialogTrigger asChild>
						<div
							className={`p-1 lg:p-2 rounded-full hover:bg-red-500 hover:text-white cursor-pointer  `}
						>
							<ToolTip
								text={'Empty Trash'}
								item={
									<Trash2
										className='w-4 h-4 lg:w-full'
										strokeWidth={1}
										size={13}
									/>
								}
								view={view}
							/>
						</div>
					</AlertDialogTrigger>
					<AlertDialogContent
						className='bg-white '
						onClick={(e) => e.stopPropagation()}
					>
						<AlertDialogHeader>
							<AlertDialogTitle className='text-black/70'>
								Are you sure?
							</AlertDialogTitle>
							<AlertDialogDescription>
								This will permanently delete all Files, Folders and their
								contents.
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel className='bg-black text-white outline-none hover:outline-none hover:bg-black hover:text-white'>
								Cancel
							</AlertDialogCancel>
							<AlertDialogAction
								className='bg-red-500 text-white'
								onClick={() => handleClearTrash()}
							>
								<TrashIcon />
								Empty Trash
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>

				<div
					className={`p-1 lg:p-2 rounded-full hover:bg-black/10 hover:text-black ${
						view === 'list' ? 'bg-black/20' : 'bg-white'
					} `}
					onClick={() => setView('list')}
				>
					<ToolTip
						text={'List layout'}
						item={
							<List className='w-4 h-4 lg:w-full' strokeWidth={1} size={13} />
						}
						view={view}
					/>
				</div>
				<div
					className={`p-1 lg:p-2 rounded-full hover:bg-black/10 hover:text-black ${
						view === 'icons' ? 'bg-black/20 ' : 'bg-white'
					} `}
					onClick={() => setView('icons')}
				>
					<ToolTip
						text={'Grid layout'}
						item={
							<LayoutGrid
								className='w-4 h-4 lg:w-full lg:h-full'
								strokeWidth={1}
								size={13}
							/>
						}
						view={view}
					/>
				</div>
				<a className='float-right bg-green-500 p-1 lg:p-2 rounded-md  text-white text-xs'>
					View All
				</a>
			</div>
		</div>

		{view === 'list' && <DetailBar state={'file'} />}
		<Separator className={`'mt-0' ${view === 'icons' && 'mt-6'} `} />

		{loading && <Loading2 />}
		{error && <Error error={'An error occurred while loading files.'} />}

		{success && (
			<div
				className={`${
					view === 'icons'
						? `${
								data.length === 0
									? 'flex justify-center items-center w-full h-full '
									: 'w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 py-2 '
						  } `
						: 'flex flex-col w-full h-full '
				} `}
			>
				{!loading && data.length === 0 ? (
					<div className='w-full h-full flex justify-center items-center'>
						<GifNew text='Files added to Trash will show up here' />
					</div>
				) : (
					<React.Fragment>
						{data.map((item, index) => (
							<div key={index}>
								<FileItem file={item} view={view} />
							</div>
						))}
					</React.Fragment>
				)}
			</div>
		)}
	</div>
)
}

const loadarray = [1, 2, 3, 4]

export const Loading2 = () => {
	return (
		<div className='w-full h-10  '>
			{loadarray.map((each) => (
				<div key={each} className='w-full h-full mt-2 flex '>
					<div className='w-full flex items-center gap-x-2'>
						<Skeleton className='h-full w-10  rounded-md' />
						<Skeleton className='w-full h-full ' />
					</div>
				</div>
			))}
		</div>
	)
}

const Error = ({ error }) => {
	return (
		<div className='w-full text-2xl text-black h-full flex items-center justify-center'>
			<h1>{error}</h1>
		</div>
	)
}
Trash.getLayout = (page)=><DashboardLayout>{page}</DashboardLayout>
export default Trash
